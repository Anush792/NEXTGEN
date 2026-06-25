'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlowCard from '@/components/GlowCard';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Play, Settings, Sparkles, TrendingUp, Clock, Award } from 'lucide-react';

interface PurchasedCourse {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  instructor: string;
  category: string;
  lastAccessed: string;
}

const purchasedCourses: PurchasedCourse[] = [
  {
    id: 'python-mastery',
    title: 'Python Programming Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
    progress: 72,
    totalLessons: 48,
    completedLessons: 35,
    instructor: 'NextGen Team',
    category: 'Backend',
    lastAccessed: '2 hours ago',
  },
  {
    id: 'react-nextjs',
    title: 'React & Next.js Complete Guide',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    progress: 45,
    totalLessons: 62,
    completedLessons: 28,
    instructor: 'NextGen Team',
    category: 'Frontend',
    lastAccessed: '1 day ago',
  },
  {
    id: 'cpp-fundamentals',
    title: 'C++ Data Structures & Algorithms',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    progress: 100,
    totalLessons: 36,
    completedLessons: 36,
    instructor: 'NextGen Team',
    category: 'CS Core',
    lastAccessed: '3 days ago',
  },
  {
    id: 'java-spring',
    title: 'Java Spring Boot Development',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    progress: 18,
    totalLessons: 55,
    completedLessons: 10,
    instructor: 'NextGen Team',
    category: 'Backend',
    lastAccessed: '5 days ago',
  },
  {
    id: 'html-css-pro',
    title: 'HTML & CSS Professional Design',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80',
    progress: 60,
    totalLessons: 30,
    completedLessons: 18,
    instructor: 'NextGen Team',
    category: 'Frontend',
    lastAccessed: '1 week ago',
  },
  {
    id: 'fullstack-mern',
    title: 'Full-Stack MERN Development',
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
    progress: 5,
    totalLessons: 78,
    completedLessons: 4,
    instructor: 'NextGen Team',
    category: 'Full-Stack',
    lastAccessed: 'Just now',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

function getProgressColor(progress: number): string {
  if (progress === 100) return 'from-emerald-500 to-cyan-400';
  if (progress >= 60) return 'from-emerald-500 to-emerald-400';
  if (progress >= 30) return 'from-cyan-500 to-blue-400';
  return 'from-violet-500 to-purple-400';
}

function getProgressBg(progress: number): string {
  if (progress === 100) return 'bg-emerald-500/10';
  if (progress >= 60) return 'bg-emerald-500/10';
  if (progress >= 30) return 'bg-cyan-500/10';
  return 'bg-violet-500/10';
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses] = useState<PurchasedCourse[]>(purchasedCourses);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses);
  const totalLessonsCompleted = courses.reduce((sum, c) => sum + c.completedLessons, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <motion.p
                className="text-emerald-400 text-sm font-medium mb-1 flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="h-4 w-4" />
                Welcome back
              </motion.p>
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {user?.displayName || user?.email?.split('@')[0] || 'Student'}
              </motion.h1>
              <motion.p
                className="text-slate-400 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Continue your learning journey
              </motion.p>
            </div>
            <motion.button
              onClick={() => router.push('/dashboard/settings')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Enrolled Courses', value: totalCourses, icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { label: 'Completed', value: completedCourses, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Avg. Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
              { label: 'Lessons Done', value: totalLessonsCompleted, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className="rounded-xl border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm p-4"
              >
                <div className={`h-9 w-9 rounded-lg ${stat.bg} border flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">My Courses</h2>
            <button
              onClick={() => router.push('/courses')}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Browse More →
            </button>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course) => (
              <motion.div key={course.id} variants={cardVariants}>
                <GlowCard
                  glowColor={
                    course.progress === 100
                      ? 'rgba(16, 185, 129, 0.4)'
                      : 'rgba(6, 182, 212, 0.35)'
                  }
                >
                  <div className="p-0">
                    <div className="relative h-44 w-full overflow-hidden rounded-t-[1rem]">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-slate-200 border border-white/10">
                          {course.category}
                        </span>
                      </div>

                      {course.progress === 100 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-sm text-[10px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Complete
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-semibold text-white leading-tight mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{course.instructor}</p>
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.lastAccessed}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </span>
                          <span
                            className={`font-semibold ${
                              course.progress === 100
                                ? 'text-emerald-400'
                                : course.progress >= 60
                                ? 'text-emerald-400'
                                : course.progress >= 30
                                ? 'text-cyan-400'
                                : 'text-violet-400'
                            }`}
                          >
                            {course.progress}%
                          </span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden ${getProgressBg(course.progress)}`}>
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(course.progress)}`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      <motion.button
                        onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          course.progress === 100
                            ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700/80 border border-emerald-500/20'
                            : 'bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 hover:from-emerald-500 hover:to-cyan-500 text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="h-4 w-4" />
                        {course.progress === 100 ? 'Review Course' : course.progress > 0 ? 'Continue Watching' : 'Start Learning'}
                      </motion.button>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
