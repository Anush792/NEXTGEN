'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  borderRadius?: string;
}

export default function GlowCard({
  children,
  className,
  glowColor = 'rgba(16, 185, 129, 0.35)',
  glowSize = 250,
  borderRadius = '1rem',
}: GlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(-glowSize);
  const mouseY = useMotionValue(-glowSize);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(-glowSize);
    mouseY.set(-glowSize);
  }, [mouseX, mouseY, glowSize]);

  const borderGlow = useMotionTemplate`radial-gradient(${glowSize}px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;
  const surfaceGlow = useMotionTemplate`radial-gradient(${glowSize * 0.8}px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.06), transparent 80%)`;

  return (
    <div
      ref={containerRef}
      className={cn('relative group', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: borderGlow,
          borderRadius,
          maskImage: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: surfaceGlow,
          borderRadius,
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-[1] h-full border border-slate-800/80 bg-[#0A0F1C]/80 backdrop-blur-sm transition-colors duration-300 group-hover:border-slate-700/60"
        style={{ borderRadius }}
      >
        {children}
      </div>
    </div>
  );
}
