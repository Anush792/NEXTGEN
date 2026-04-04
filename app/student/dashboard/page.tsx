'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  course_name: string;
  status: string;
  created_at: string;
  certificate_url?: string;
}

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  order_index: number;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentEmail = localStorage.getItem('studentEmail');
    if (!studentEmail) {
      router.push('/signin');
      return;
    }

    // Fetch data immediately and then poll for updates so admin approvals appear quickly.
    fetchStudentCourses();
    const interval = setInterval(fetchStudentCourses, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchStudentCourses = async () => {
    try {
      const studentEmail = localStorage.getItem('studentEmail');
      if (!studentEmail) return;

      // Fetch all orders and filter in client-side for this student (handles fallback mode too)
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Unable to fetch orders');
      }

      const allOrders: any[] = await response.json();
      const studentOrders = allOrders.filter((order) =>
        order.user_id_value === studentEmail || order.user_email === studentEmail
      );

      const approvedOrders = studentOrders.filter((order) => ['approved', 'graduated'].includes(order.status));

      const uniqueCourses: Record<string, Course> = {};
      approvedOrders.forEach((order) => {
        if (!uniqueCourses[order.course_name]) {
          uniqueCourses[order.course_name] = {
            id: order.order_id,
            course_name: order.course_name,
            status: order.status,
            created_at: order.created_at,
            certificate_url: order.certificate_url || undefined,
          };
        }
      });

      const courseList = Object.values(uniqueCourses);
      setCourses(courseList);

      const videoPromises = courseList.map(async (course) => {
        try {
          const videosRes = await fetch(`/api/videos?course_name=${encodeURIComponent(course.course_name)}`);
          if (!videosRes.ok) {
            console.error(`Failed to fetch videos for ${course.course_name}:`, videosRes.status);
            return { courseName: course.course_name, videos: [] };
          }
          const courseVideos = (await videosRes.json()) as Video[];
          return { courseName: course.course_name, videos: courseVideos || [] };
        } catch (videoError) {
          console.error(`Error fetching videos for ${course.course_name}:`, videoError);
          return { courseName: course.course_name, videos: [] };
        }
      });

      const videoResults = await Promise.all(videoPromises);
      const videoMap: Record<string, Video[]> = {};
      videoResults.forEach(({ courseName, videos }) => {
        videoMap[courseName] = videos;
      });
      setVideos(videoMap);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      setVideos({});
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Dashboard</h1>

          {courses.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="pt-6 text-center">
                <p className="text-slate-400 mb-4">No approved courses yet.</p>
                <Button onClick={() => router.push('/courses')} className="bg-blue-600 hover:bg-blue-700">
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="border-slate-800 bg-slate-900 hover:border-blue-500 hover:shadow-lg cursor-pointer"
                  onClick={() => router.push(`/student/course/${encodeURIComponent(course.course_name)}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {course.course_name}
                      {course.status === 'graduated' && (
                        <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full">
                          Graduated
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-slate-400">Enrolled on {new Date(course.created_at).toLocaleDateString()}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Progress</p>
                      <Progress value={0} className="w-full" />
                      <p className="text-xs text-slate-500 mt-1">0% Complete</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Course Videos</p>
                      {videos[course.course_name]?.length > 0 ? (
                        <div className="space-y-2">
                          {videos[course.course_name].map((video) => {
                            const videoId = getYouTubeVideoId(video.youtube_url);
                            return (
                              <div key={video.id} className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(video.youtube_url, '_blank');
                                  }}
                                  className="flex-1 justify-start text-left"
                                >
                                  ▶ {video.title}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">No videos available yet.</p>
                      )}
                    </div>

                    {course.status === 'graduated' && course.certificate_url && (
                      <div className="pt-4 border-t border-slate-700">
                        <Button
                          onClick={() => window.open(course.certificate_url, '_blank')}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Download Certificate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}