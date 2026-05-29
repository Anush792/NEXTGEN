'use client';

import { useEffect, useState, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeProvider';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('theme-toggle-position');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (e) {
        console.error('Failed to parse saved position');
      }
    }
  }, []);

  useEffect(() => {
    // Save position to localStorage whenever it changes
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('theme-toggle-position', JSON.stringify(position));
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep button within viewport bounds
      const maxX = window.innerWidth - 48; // 48px is button width
      const maxY = window.innerHeight - 48; // 48px is button height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragStart]);

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle theme if not dragging
    if (!isDragging) {
      toggleTheme();
    }
  };

  if (!isMounted) {
    return null;
  }

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y || 24, // Default top position
    right: position.x || 24, // Default right position  
    transform: position.x !== 0 || position.y !== 0 ? 'none' : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'all 0.3s ease',
  };

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className="z-50 h-12 w-12 rounded-full border-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:scale-110 dark:border-slate-700 dark:hover:bg-slate-800"
      style={buttonStyle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Drag to move)`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      ) : (
        <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  );
}