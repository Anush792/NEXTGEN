'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const letters = ['N', 'E', 'X', 'T', 'G', 'E', 'N'];

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showCoders, setShowCoders] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if intro has already been shown
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Sequence: letters appear → coders appears → transition out (original "normal" timings)
    const codersTimer = setTimeout(() => {
      setShowCoders(true);
    }, 2200);

    const exitTimer = setTimeout(() => {
      setExitAnimation(true);
    }, 4200);

    const completeTimer = setTimeout(() => {
      sessionStorage.setItem('hasSeenIntro', 'true');
      setIsVisible(false);
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(codersTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: exitAnimation ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
            animate={exitAnimation ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Content Container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            animate={exitAnimation ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* NEXTGEN Letters */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-6xl sm:text-8xl md:text-9xl font-black text-white"
                  style={{
                    textShadow: '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(59, 130, 246, 0.3)',
                    background: 'linear-gradient(135deg, #fff 0%, #3b82f6 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  initial={{ 
                    opacity: 0, 
                    y: 100,
                    scale: 0.5,
                    rotateX: -90,
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* CODERS Word */}
            <motion.div
              className="mt-2 sm:mt-4 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={showCoders ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.3em] text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)',
                  backgroundSize: '200% 100%',
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={showCoders ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={showCoders ? {
                    backgroundPosition: ['0% 50%', '200% 50%'],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CODERS
                </motion.span>
              </motion.span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={showCoders ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Learn • Code • Build
            </motion.p>

            {/* Loading Bar */}
            <motion.div
              className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={showCoders ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                initial={{ width: '0%' }}
                animate={exitAnimation ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0 }}
            animate={showCoders ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
