'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTheme } from '@/lib/ThemeProvider';

const rayVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0.5, 1.2, 0.5],
    transition: {
      duration: 0.6,
      delay: i * 0.04,
      ease: 'easeInOut',
    },
  }),
};

const sunMoonVariants: Variants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      mass: 0.8,
    },
  },
  exit: {
    scale: 0,
    rotate: 180,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const craterVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 0.3,
    transition: {
      delay: 0.2 + i * 0.08,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const starVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1.3, 1],
    opacity: [0, 1, 0.7],
    transition: {
      delay: 0.1 + i * 0.06,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-11 w-11 rounded-full bg-slate-800/50 border border-slate-700/50 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  const rays = Array.from({ length: 8 });
  const stars = [
    { x: -10, y: -8, size: 2 },
    { x: 9, y: -10, size: 1.5 },
    { x: -8, y: 9, size: 1.8 },
    { x: 11, y: 7, size: 1.3 },
    { x: 0, y: -13, size: 1.6 },
  ];

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-11 w-11 rounded-full overflow-hidden
        bg-gradient-to-br from-slate-800/90 to-slate-900/90
        dark:from-slate-800/90 dark:to-slate-900/90
        border border-slate-600/40 dark:border-slate-600/40
        shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]
        hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]
        backdrop-blur-xl transition-shadow duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50
        group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br from-emerald-500/10 to-cyan-500/10" />

      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            className="absolute inset-0 flex items-center justify-center"
            variants={sunMoonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {stars.map((star, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full bg-cyan-300"
                style={{
                  width: star.size * 2,
                  height: star.size * 2,
                  left: `calc(50% + ${star.x}px)`,
                  top: `calc(50% + ${star.y}px)`,
                }}
                variants={starVariants}
                custom={i}
                initial="initial"
                animate="animate"
              />
            ))}

            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="#06B6D4"
                stroke="#0891B2"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </svg>

            {[{ cx: 13, cy: 9, r: 1.5 }, { cx: 10, cy: 14, r: 2 }, { cx: 15, cy: 15, r: 1 }].map(
              (crater, i) => (
                <motion.circle
                  key={`crater-${i}`}
                  cx={crater.cx}
                  cy={crater.cy}
                  r={crater.r}
                  fill="#0E7490"
                  className="absolute"
                  style={{
                    position: 'absolute',
                  }}
                  variants={craterVariants}
                  custom={i}
                  initial="initial"
                  animate="animate"
                />
              )
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            className="absolute inset-0 flex items-center justify-center"
            variants={sunMoonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {rays.map((_, i) => {
              const angle = (i * 360) / 8;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 14;
              const y = Math.sin(rad) * 14;
              return (
                <motion.div
                  key={`ray-${i}`}
                  className="absolute w-[2px] h-[6px] bg-emerald-400 rounded-full"
                  style={{
                    left: `calc(50% + ${x}px - 1px)`,
                    top: `calc(50% + ${y}px - 3px)`,
                    transform: `rotate(${angle}deg)`,
                  }}
                  variants={rayVariants}
                  custom={i}
                  initial="initial"
                  animate="animate"
                />
              );
            })}

            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <motion.circle
                cx="12"
                cy="12"
                r="5"
                fill="#10B981"
                stroke="#059669"
                strokeWidth="1"
                initial={{ r: 0 }}
                animate={{ r: 5 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 30% 30%, rgba(6,182,212,0.12), transparent 60%)'
            : 'radial-gradient(circle at 70% 30%, rgba(16,185,129,0.12), transparent 60%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
