import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const videosFilePath = path.join(process.cwd(), 'data', 'course_videos.json');

declare global {
  // eslint-disable-next-line no-var
  var __nextgenCourseVideos: any[] | undefined;
}

const courseVideosStore = globalThis.__nextgenCourseVideos ||= [];

const defaultVideos = [
  {
    id: 'video_1',
    course_name: 'React Development',
    title: 'React Basics',
    youtube_url: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
    order_index: 1,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'video_2',
    course_name: 'React Development',
    title: 'React Hooks',
    youtube_url: 'https://www.youtube.com/watch?v=f687hBjwFcM',
    order_index: 2,
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
];

const loadVideosFromFile = () => {
  try {
    if (fs.existsSync(videosFilePath)) {
      const raw = fs.readFileSync(videosFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        courseVideosStore.length = 0;
        courseVideosStore.push(...parsed);
        return;
      }
    }
  } catch (error) {
    console.error('Failed to load course videos from file:', error);
  }

  if (courseVideosStore.length === 0) {
    courseVideosStore.push(...defaultVideos);
  }
};

const saveVideosToFile = () => {
  try {
    const dir = path.dirname(videosFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(videosFilePath, JSON.stringify(courseVideosStore, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save course videos to file:', error);
  }
};

loadVideosFromFile();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseName = searchParams.get('course_name');

    console.log('GET /api/videos:', { hasSupabaseConfig, courseName });

    if (!hasSupabaseConfig) {
      const filtered = courseName
        ? courseVideosStore.filter((video) => video.course_name === courseName)
        : courseVideosStore;
      return NextResponse.json(filtered);
    }

    let query = supabase.from('course_videos').select('*').order('order_index', { ascending: true });
    if (courseName) {
      query = query.eq('course_name', courseName);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase course videos error, falling back to in-memory:', error);
      const filtered = courseName
        ? courseVideosStore.filter((video) => video.course_name === courseName)
        : courseVideosStore;
      return NextResponse.json(filtered);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET /api/videos exception, falling back:', error);
    const { searchParams } = new URL(request.url);
    const courseName = searchParams.get('course_name');
    const filtered = courseName
      ? courseVideosStore.filter((video) => video.course_name === courseName)
      : courseVideosStore;
    return NextResponse.json(filtered);
  }
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { course_name, title, youtube_url } = body;

    if (!course_name || !title || !youtube_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newVideo = {
      id: `video_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      course_name,
      title,
      youtube_url,
      order_index: courseVideosStore.length + 1,
      created_at: new Date().toISOString(),
    };

    let inserted = false;
    let supabaseData: any = null;
    if (hasSupabaseConfig) {
      const { data, error } = await supabase
        .from('course_videos')
        .insert([{ course_name, title, youtube_url, order_index: newVideo.order_index }])
        .select()
        .single();

      if (error) {
        console.error('Supabase POST /api/videos error:', error);
      } else {
        inserted = true;
        supabaseData = data;
      }
    }

    if (!inserted) {
      courseVideosStore.push(newVideo);
      saveVideosToFile();
      return NextResponse.json(newVideo, { status: 201 });
    }

    return NextResponse.json(supabaseData || newVideo, { status: 201 });
  } catch (error) {
    console.error('POST /api/videos exception:', error);

    if (body?.course_name && body?.title && body?.youtube_url) {
      const fallbackVideo = {
        id: `video_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        course_name: body.course_name,
        title: body.title,
        youtube_url: body.youtube_url,
        order_index: courseVideosStore.length + 1,
        created_at: new Date().toISOString(),
      };

      courseVideosStore.push(fallbackVideo);
      saveVideosToFile();
      return NextResponse.json(fallbackVideo, { status: 201 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    if (hasSupabaseConfig) {
      const { error } = await supabase
        .from('course_videos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase DELETE /api/videos error:', error);
      } else {
        return NextResponse.json({ message: 'Video deleted successfully' });
      }
    }

    const index = courseVideosStore.findIndex((video) => video.id === id);
    if (index !== -1) {
      courseVideosStore.splice(index, 1);
      saveVideosToFile();
      return NextResponse.json({ message: 'Video deleted locally (fallback)' });
    }

    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  } catch (error) {
    console.error('DELETE /api/videos exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}