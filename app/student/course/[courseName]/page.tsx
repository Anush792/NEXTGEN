'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  order_index: number;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseName = decodeURIComponent(
    (Array.isArray(params?.courseName) ? params.courseName[0] : params?.courseName) || ''
  );

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const studentEmail = localStorage.getItem('studentEmail');
    if (!studentEmail) {
      router.push('/signin');
      return;
    }

    const load = async () => {
      try {
        // Check if student has approved or graduated access for this course
        // Use the orders API instead of direct Supabase access for better error handling
        const ordersResponse = await fetch('/api/orders');
        if (!ordersResponse.ok) {
          throw new Error('Unable to verify course access. Please try again later.');
        }

        const allOrders = await ordersResponse.json();
        const studentOrders = allOrders.filter((order: any) =>
          (order.user_id_value === studentEmail || order.user_email === studentEmail) &&
          order.course_name === courseName &&
          ['approved', 'graduated'].includes(order.status)
        );

        if (studentOrders.length === 0) {
          setHasAccess(false);
          setError('No approved enrollment found for this course. Please contact admin if you believe this is an error.');
          setLoading(false);
          return;
        }

        setHasAccess(true);

        // Load videos for this course
        const videoResponse = await fetch(`/api/videos?course_name=${encodeURIComponent(courseName)}`);
        if (!videoResponse.ok) {
          const errorData = await videoResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to load course videos. Please try again later.');
        }

        const videoData = await videoResponse.json();
        setVideos(Array.isArray(videoData) ? videoData : []);
      } catch (err) {
        console.error('Error loading course details:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading course details. Please try refreshing the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router, courseName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">{courseName}</h1>
            <Button onClick={() => router.push('/student/dashboard')} className="bg-slate-800 hover:bg-slate-700">
              Back to Dashboard
            </Button>
          </div>

          {!hasAccess ? (
            <Card className="border border-red-600 bg-red-950/30">
              <CardContent>
                <p className="text-red-300">{error || 'Access denied'}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Course Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                {!error && videos.length === 0 && (
                  <p className="text-slate-400">No videos uploaded for this course yet.</p>
                )}
                <div className="space-y-3">
                  {videos.map((video) => (
                    <div key={video.id} className="border rounded-lg border-slate-700 p-3 bg-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-semibold text-white">{video.title}</h2>
                          <p className="text-slate-400 text-sm">Position: {video.order_index}</p>
                        </div>
                        <Button
                          onClick={() => window.open(video.youtube_url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Watch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-slate-500">If a video does not play, please check with admin for updated content.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6">
            <p className="text-xs text-slate-500">
              Student approval and course enrollment updates are fetched regularly. Refresh the page if you just got approved.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}