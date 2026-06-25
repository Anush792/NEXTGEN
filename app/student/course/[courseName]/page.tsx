'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { onUserOrdersSnapshot, onCourseVideosSnapshot, type Video } from '@/lib/firebase-db';
import { Play, ExternalLink, AlertCircle, BookOpen, ChevronLeft } from 'lucide-react';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const courseName = decodeURIComponent(
    (Array.isArray(params?.courseName) ? params.courseName[0] : params?.courseName) || ''
  );

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Auth redirect check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Real-time access check and video retrieval from Firebase
  useEffect(() => {
    if (!user || !courseName) return;

    // Listen to the user's orders
    const unsubscribeOrders = onUserOrdersSnapshot(user.uid, user.email, (orders) => {
      // Access is granted if there is a 'completed' status order for this course name
      const approvedOrders = orders.filter(
        (order) => order.courseName === courseName && order.status === 'completed'
      );

      if (approvedOrders.length > 0) {
        setHasAccess(true);
        setError(null);

        // Access is verified; subscribe to course videos in real-time
        const unsubscribeVideos = onCourseVideosSnapshot(courseName, (courseVideos) => {
          setVideos(courseVideos);
          if (courseVideos.length > 0 && !selectedVideo) {
            setSelectedVideo(courseVideos[0]);
          }
          setLoading(false);
        });

        return () => {
          unsubscribeVideos();
        };
      } else {
        setHasAccess(false);
        setError('No approved enrollment found for this course. Please contact admin if you believe this is an error.');
        setLoading(false);
      }
    });

    return () => {
      unsubscribeOrders();
    };
  }, [user, courseName]);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 animate-pulse text-lg">Loading course workspace...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/student/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> Back
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{courseName}</h1>
            </div>
            <Button
              onClick={() => router.push('/student/dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              Dashboard Home
            </Button>
          </div>

          {!hasAccess ? (
            <Card className="border-red-800 bg-red-950/20 max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Enrolled Course Not Ready</h3>
                <p className="text-red-300 text-sm">{error || 'Access denied'}</p>
                <div className="pt-2">
                  <Button
                    onClick={() => router.push('/student/dashboard')}
                    className="bg-red-900 hover:bg-red-800 text-white"
                  >
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left/Middle Column: Video Player */}
              <div className="lg:col-span-2 space-y-4">
                {selectedVideo ? (
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-black relative shadow-2xl">
                      {getYouTubeVideoId(selectedVideo.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.youtubeUrl)}?autoplay=1&rel=0`}
                          title={selectedVideo.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-900 p-6 text-center">
                          <AlertCircle className="h-10 w-10 text-yellow-500" />
                          <p className="text-slate-200">Unable to load direct playback for this format.</p>
                          <Button
                            onClick={() => window.open(selectedVideo.youtubeUrl, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Open in YouTube <ExternalLink className="h-4 w-4 ml-1.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                      <CardContent className="pt-5 space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                          <Play className="h-3 w-3" /> Playing Now
                        </div>
                        <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                        <p className="text-sm text-slate-400">
                          Course: <span className="text-slate-300 font-semibold">{courseName}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-12 text-center h-[400px]">
                    <BookOpen className="h-16 w-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No videos uploaded</h3>
                    <p className="text-slate-400 max-w-sm">
                      No learning resources have been added to this course's syllabus yet. Check back soon!
                    </p>
                  </Card>
                )}
              </div>

              {/* Right Column: Playlist/Sidebar */}
              <div className="space-y-4">
                <Card className="border-slate-800 bg-slate-900/80 sticky top-4 max-h-[80vh] flex flex-col">
                  <CardHeader className="border-b border-slate-800 py-4">
                    <CardTitle className="text-white text-lg flex items-center justify-between">
                      <span>Course Content</span>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {videos.length} Lectures
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1 divide-y divide-slate-800/50">
                    {videos.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        No modules uploaded.
                      </div>
                    ) : (
                      videos.map((video, index) => (
                        <button
                          key={video.id}
                          onClick={() => setSelectedVideo(video)}
                          className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                            selectedVideo?.id === video.id
                              ? 'bg-blue-600/10 hover:bg-blue-600/15 text-blue-400'
                              : 'hover:bg-slate-800/40 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            selectedVideo?.id === video.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${
                              selectedVideo?.id === video.id ? 'text-blue-400' : 'text-slate-200'
                            }`}>
                              {video.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <span>Lecture</span> • <span>Order {video.orderIndex}</span>
                            </p>
                          </div>
                          <Play className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                            selectedVideo?.id === video.id ? 'text-blue-500' : 'text-slate-600'
                          }`} />
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}