import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  price: number;
  instructor_name: string;
  duration_hours: number;
  image_url: string;
  created_at: string;
  rating?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __nextgenCourses: Course[] | undefined;
}

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'Python Programming',
    description: 'Learn Python from scratch with real-world examples.',
    category: 'Programming',
    difficulty: 'Beginner',
    price: 1999,
    instructor_name: 'NextGen Team',
    duration_hours: 30,
    image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200',
    created_at: new Date().toISOString(),
    rating: 4.8,
  },
  {
    id: '2',
    title: 'React Development',
    description: 'Build modern web apps with React and Next.js.',
    category: 'Programming',
    difficulty: 'Intermediate',
    price: 3499,
    instructor_name: 'NextGen Team',
    duration_hours: 25,
    image_url: 'https://images.unsplash.com/photo-1518773571834-52a0305f315a?w=1200',
    created_at: new Date().toISOString(),
    rating: 4.9,
  },
];

const courseStore: Course[] = (globalThis.__nextgenCourses ||= [...defaultCourses]);
const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json(data);
      }
      if (error) {
        console.error('Supabase GET /courses error:', error.message);
      }
    } catch (error) {
      console.error('Supabase GET /courses exception:', error);
    }
  }

  return NextResponse.json(courseStore.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      price,
      instructor_name,
      duration_hours,
      image_url,
      videoUrl,
    } = await request.json();

    if (!title || !description || price === undefined || !instructor_name || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, instructor_name, image_url' },
        { status: 400 }
      );
    }

    if (hasSupabaseConfig) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .insert([
            {
              title,
              description,
              category: category || 'Programming',
              difficulty: difficulty || 'Beginner',
              price: Number(price),
              instructor_name,
              duration_hours: Number(duration_hours) || 10,
              image_url,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          if (videoUrl) {
            try {
              await supabase.from('course_videos').insert([
                {
                  course_name: title,
                  title: `${title} - Introduction`,
                  youtube_url: videoUrl,
                  order_index: 0,
                },
              ]);
            } catch (videoError) {
              console.error('Video fallback insert error:', videoError);
            }
          }
          return NextResponse.json(data, { status: 201 });
        }

        if (error) {
          console.error('Supabase course insert error:', error.message);
        }
      } catch (supabaseError) {
        console.error('Supabase course insert exception:', supabaseError);
      }
    }

    const newCourse: Course = {
      id: String(Date.now()),
      title,
      description,
      category: category || 'Programming',
      difficulty: difficulty || 'Beginner',
      price: Number(price),
      instructor_name,
      duration_hours: Number(duration_hours) || 10,
      image_url,
      created_at: new Date().toISOString(),
      rating: 0,
    };

    courseStore.unshift(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (err) {
    console.error('POST /api/courses error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
    }

    if (hasSupabaseConfig) {
      try {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (!error) {
          return NextResponse.json({ message: 'Course deleted successfully' });
        }
        console.error('Supabase course delete error:', error.message);
      } catch (supabaseError) {
        console.error('Supabase course delete exception:', supabaseError);
      }
    }

    const index = courseStore.findIndex((course) => course.id === id);
    if (index >= 0) {
      courseStore.splice(index, 1);
      return NextResponse.json({ message: 'Course deleted successfully (in-memory)' });
    }

    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  } catch (err) {
    console.error('DELETE /api/courses error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
