'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeProvider';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full border-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 dark:border-slate-700 dark:hover:bg-slate-800"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      ) : (
        <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  );
}