'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { onUserOrdersSnapshot, getCourseVideos, type Order, type Video } from '@/lib/firebase-db';
import { Clock, CheckCircle, XCircle, Play, ExternalLink } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  courseName: string;
  status: string;
  createdAt: any;
  videos: Video[];
  progress: number;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Real-time orders listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onUserOrdersSnapshot(user.uid, user.email, async (orders) => {
      const approvedOrders = orders.filter(o => o.status === 'completed');

      // Get unique courses
      const uniqueCourses = new Map<string, Order>();
      approvedOrders.forEach(order => {
        if (!uniqueCourses.has(order.courseName)) {
          uniqueCourses.set(order.courseName, order);
        }
      });

      // Fetch videos for each course
      const enrolledCourses: EnrolledCourse[] = [];
      const courseOrders = Array.from(uniqueCourses.values());
      for (const order of courseOrders) {
        const videos = await getCourseVideos(order.courseName);
        enrolledCourses.push({
          id: order.id!,
          courseName: order.courseName,
          status: order.status,
          createdAt: order.createdAt,
          videos: videos || [],
          progress: 0 // TODO: Track actual progress
        });
      }

      setCourses(enrolledCourses);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-900/30 text-green-400 border-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-900/30 text-red-400 border-red-600"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (authLoading || loading) {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
              <p className="text-slate-400">Welcome back, {user?.displayName || user?.email}</p>
            </div>
            <Button onClick={() => router.push('/courses')} className="bg-blue-600 hover:bg-blue-700">
              Browse More Courses
            </Button>
          </div>

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
                  className="border-slate-800 bg-slate-900 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-xl">{course.courseName}</CardTitle>
                      {getStatusBadge(course.status)}
                    </div>
                    <p className="text-sm text-slate-400">
                      Enrolled on {new Date(course.createdAt?.toDate?.() || course.createdAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="w-full h-2" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-3">Course Videos ({course.videos.length})</p>
                      {course.videos.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {course.videos.map((video, index) => {
                            const videoId = getYouTubeVideoId(video.youtubeUrl);
                            return (
                              <div
                                key={video.id}
                                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white truncate">{video.title}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(video.youtubeUrl, '_blank')}
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-800 rounded-lg text-center">
                          <p className="text-slate-400 text-sm">No videos available yet.</p>
                        </div>
                      )}
                    </div>
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
