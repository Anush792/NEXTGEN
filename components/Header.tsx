'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Code as Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    setSignedInEmail(localStorage.getItem('studentEmail'));

    const onStorage = () => setSignedInEmail(localStorage.getItem('studentEmail'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentPassword');
    setSignedInEmail(null);
    router.push('/signin');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-slate-900 dark:text-white">NextGen Coders</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Programming Courses</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors ${
                isActive('/courses') ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/website-builder"
              className={`text-sm font-medium transition-colors ${
                isActive('/website-builder') ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Website Builder
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {signedInEmail ? (
              <>
                <Link href="/student/dashboard">
                  <Button variant="outline" className="hidden md:inline-flex text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="hidden md:inline-flex text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
