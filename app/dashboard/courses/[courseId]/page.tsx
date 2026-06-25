'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Award,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  modules: Module[];
}

const courseDatabase: Record<string, CourseData> = {
  'python-mastery': {
    id: 'python-mastery',
    title: 'Python Programming Mastery',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Python Foundations',
        description: 'Variables, data types, and basic operations',
        lessons: [
          { id: 'l1', title: 'Welcome to Python', duration: '8:24', youtubeId: 'kqtD5dpn9C8', isCompleted: true, isLocked: false },
          { id: 'l2', title: 'Variables & Data Types', duration: '14:32', youtubeId: 'cQT33yu9pY8', isCompleted: true, isLocked: false },
          { id: 'l3', title: 'String Operations Deep Dive', duration: '18:45', youtubeId: 'k9TUPpGqYTo', isCompleted: true, isLocked: false },
          { id: 'l4', title: 'Numbers & Math Operations', duration: '12:10', youtubeId: 'khKv-8q7YmY', isCompleted: false, isLocked: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Control Flow & Logic',
        description: 'Conditionals, loops, and logical operators',
        lessons: [
          { id: 'l5', title: 'If/Else Statements', duration: '16:20', youtubeId: 'PqFKRqpHrjw', isCompleted: false, isLocked: false },
          { id: 'l6', title: 'For Loops & While Loops', duration: '22:15', youtubeId: '94UHCEmprCY', isCompleted: false, isLocked: false },
          { id: 'l7', title: 'List Comprehensions', duration: '13:40', youtubeId: '3dt4OGnU5sM', isCompleted: false, isLocked: false },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Functions & Modules',
        description: 'Writing reusable code with functions',
        lessons: [
          { id: 'l8', title: 'Defining Functions', duration: '19:55', youtubeId: '9Os0o3wzS_I', isCompleted: false, isLocked: false },
          { id: 'l9', title: 'Lambda & Higher-Order Functions', duration: '15:30', youtubeId: '25ovCm9jKfA', isCompleted: false, isLocked: true },
          { id: 'l10', title: 'Decorators & Generators', duration: '24:10', youtubeId: 'FsAPt_9Bf3U', isCompleted: false, isLocked: true },
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Object-Oriented Programming',
        description: 'Classes, inheritance, and polymorphism',
        lessons: [
          { id: 'l11', title: 'Classes & Objects', duration: '21:00', youtubeId: 'ZDa-Z5JzLYM', isCompleted: false, isLocked: true },
          { id: 'l12', title: 'Inheritance & Mixins', duration: '18:30', youtubeId: 'RSl87lqOXDE', isCompleted: false, isLocked: true },
        ],
      },
    ],
  },
  'react-nextjs': {
    id: 'react-nextjs',
    title: 'React & Next.js Complete Guide',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: React Fundamentals',
        description: 'Components, JSX, and the React paradigm',
        lessons: [
          { id: 'l1', title: 'Introduction to React', duration: '10:15', youtubeId: 'Tn6-PIqc4UM', isCompleted: true, isLocked: false },
          { id: 'l2', title: 'JSX & Component Architecture', duration: '16:40', youtubeId: '9YkUCxvaLEk', isCompleted: true, isLocked: false },
          { id: 'l3', title: 'Props & State Management', duration: '20:30', youtubeId: '4pO-HcG2igk', isCompleted: false, isLocked: false },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: React Hooks Deep Dive',
        description: 'useState, useEffect, useContext, and custom hooks',
        lessons: [
          { id: 'l4', title: 'useState & useEffect', duration: '22:10', youtubeId: 'O6P86uwfdR0', isCompleted: false, isLocked: false },
          { id: 'l5', title: 'useContext & useReducer', duration: '18:55', youtubeId: '5LrDIWkK_Bc', isCompleted: false, isLocked: false },
          { id: 'l6', title: 'Building Custom Hooks', duration: '14:20', youtubeId: 'J-g9ZJha8FE', isCompleted: false, isLocked: true },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Next.js App Router',
        description: 'Server components, routing, and data fetching',
        lessons: [
          { id: 'l7', title: 'Next.js 14 App Router', duration: '25:00', youtubeId: 'ZjAqacIC_3c', isCompleted: false, isLocked: true },
          { id: 'l8', title: 'Server vs Client Components', duration: '19:45', youtubeId: 'VBlSe8tvg4U', isCompleted: false, isLocked: true },
        ],
      },
    ],
  },
};

const fallbackCourse: CourseData = {
  id: 'fallback',
  title: 'Course',
  modules: [
    {
      id: 'mod-1',
      title: 'Module 1: Getting Started',
      description: 'Introduction and setup',
      lessons: [
        { id: 'l1', title: 'Welcome & Overview', duration: '10:00', youtubeId: 'dQw4w9WgXcQ', isCompleted: false, isLocked: false },
        { id: 'l2', title: 'Environment Setup', duration: '15:00', youtubeId: 'jNQXAC9IVRw', isCompleted: false, isLocked: false },
      ],
    },
  ],
};

export default function ClassroomPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = (Array.isArray(params?.courseId) ? params.courseId[0] : params?.courseId) || '';

  const courseData = courseDatabase[courseId] || { ...fallbackCourse, title: courseId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };

  const allLessons = useMemo(() => courseData.modules.flatMap((m) => m.lessons), [courseData]);

  const [activeVideoId, setActiveVideoId] = useState(() => {
    const firstUnlocked = allLessons.find((l) => !l.isLocked);
    return firstUnlocked?.youtubeId || allLessons[0]?.youtubeId || '';
  });

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    return new Set(allLessons.filter((l) => l.isCompleted).map((l) => l.id));
  });

  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    return new Set(courseData.modules.map((m) => m.id));
  });

  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const activeLesson = allLessons.find((l) => l.youtubeId === activeVideoId);

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setActiveVideoId(lesson.youtubeId);
  };

  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="border-b border-slate-800/80 bg-[#0A0F1C]/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <span className="text-slate-700">/</span>
                <h1 className="text-sm md:text-base font-semibold text-white truncate max-w-[300px]">
                  {courseData.title}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                  <Award className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    {completedCount}/{totalLessons} completed
                  </span>
                </div>
                <div className="hidden md:block h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="hidden md:block text-xs font-semibold text-emerald-400">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className={`flex flex-col ${isTheaterMode ? '' : 'lg:flex-row'} gap-6`}>
            <div className={`${isTheaterMode ? 'w-full' : 'w-full lg:w-[65%]'} space-y-4`}>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-black shadow-2xl shadow-black/50">
                <AnimatePresence mode="wait">
                  <motion.iframe
                    key={activeVideoId}
                    src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1&autoplay=1`}
                    title={activeLesson?.title || 'Video Player'}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Play className="h-2.5 w-2.5" />
                        Now Playing
                      </span>
                      {activeLesson && (
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {activeLesson.duration}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {activeLesson?.title || 'Select a lesson'}
                    </h2>
                    <p className="text-sm text-slate-500">{courseData.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeLesson && (
                      <motion.button
                        onClick={() => handleToggleComplete(activeLesson.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          completedLessons.has(activeLesson.id)
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-white'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {completedLessons.has(activeLesson.id) ? 'Completed' : 'Mark Complete'}
                      </motion.button>
                    )}
                    <button
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white transition-colors"
                      title={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isTheaterMode ? 'w-full' : 'w-full lg:w-[35%]'}`}>
              <div className="rounded-2xl border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm overflow-hidden sticky top-4 max-h-[calc(100vh-8rem)] flex flex-col">
                <div className="p-4 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white">Course Content</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md">
                      {courseData.modules.length} modules · {totalLessons} lessons
                    </span>
                  </div>
                  <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {courseData.modules.map((module) => {
                    const moduleCompleted = module.lessons.filter((l) => completedLessons.has(l.id)).length;
                    const isExpanded = expandedModules.has(module.id);

                    return (
                      <div key={module.id} className="border-b border-slate-800/40 last:border-b-0">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-200 truncate">
                                {module.title}
                              </h4>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {moduleCompleted}/{module.lessons.length} completed · {module.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {moduleCompleted === module.lessons.length && module.lessons.length > 0 && (
                              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="pb-2">
                                {module.lessons.map((lesson, lessonIndex) => {
                                  const isActive = lesson.youtubeId === activeVideoId;
                                  const isComplete = completedLessons.has(lesson.id);

                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => handleLessonClick(lesson)}
                                      disabled={lesson.isLocked}
                                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                                        lesson.isLocked
                                          ? 'opacity-40 cursor-not-allowed'
                                          : isActive
                                          ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500'
                                          : 'hover:bg-slate-800/30 border-l-2 border-l-transparent'
                                      }`}
                                    >
                                      <div
                                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                          lesson.isLocked
                                            ? 'bg-slate-800/60 text-slate-600'
                                            : isComplete
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : isActive
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-800/80 text-slate-400'
                                        }`}
                                      >
                                        {lesson.isLocked ? (
                                          <Lock className="h-3 w-3" />
                                        ) : isComplete ? (
                                          <CheckCircle className="h-3.5 w-3.5" />
                                        ) : isActive ? (
                                          <Play className="h-3 w-3 ml-0.5" />
                                        ) : (
                                          lessonIndex + 1
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-xs font-medium truncate ${
                                            isActive
                                              ? 'text-emerald-300'
                                              : isComplete
                                              ? 'text-slate-300'
                                              : 'text-slate-400'
                                          }`}
                                        >
                                          {lesson.title}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                                          <Clock className="h-2.5 w-2.5" />
                                          {lesson.duration}
                                        </p>
                                      </div>

                                      {isComplete && !lesson.isLocked && (
                                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
