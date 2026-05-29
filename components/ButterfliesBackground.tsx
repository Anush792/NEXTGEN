'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const ButterflySVG = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="butterfly-svg"
  >
    <motion.path
      d="M12 3C12 3 14 5 14 7C14 9 12 11 12 11C12 11 10 9 10 7C10 5 12 3 12 3Z"
      fill={color}
      fillOpacity="0.6"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 0.9, 1] }}
      transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M12 11C12 11 8 13 4 11C2 10 2 7 4 6C6 5 10 7 12 11Z"
      fill={color}
      fillOpacity="0.4"
      initial={{ rotate: 0 }}
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '12px 11px' }}
    />
    <motion.path
      d="M12 11C12 11 16 13 20 11C22 10 22 7 20 6C18 5 14 7 12 11Z"
      fill={color}
      fillOpacity="0.4"
      initial={{ rotate: 0 }}
      animate={{ rotate: [5, -5, 5] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '12px 11px' }}
    />
    <motion.path
      d="M12 11C12 11 10 15 8 18C7 20 9 22 11 20C13 18 12 11 12 11Z"
      fill={color}
      fillOpacity="0.5"
      initial={{ rotate: 0 }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '12px 11px' }}
    />
    <motion.path
      d="M12 11C12 11 14 15 16 18C17 20 15 22 13 20C11 18 12 11 12 11Z"
      fill={color}
      fillOpacity="0.5"
      initial={{ rotate: 0 }}
      animate={{ rotate: [3, -3, 3] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '12px 11px' }}
    />
  </svg>
);

export default function ButterfliesBackground() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Generate random butterfly positions
  const generateButterflies = useCallback(() => {
    const newButterflies: Butterfly[] = [];
    const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < 6; i++) {
      newButterflies.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 25,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    return newButterflies;
  }, []);

  // Toggle visibility every ~4 seconds (70% visible = ~2.8s visible, ~1.2s hidden)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const toggleVisibility = () => {
      const visibleDuration = 2800 + Math.random() * 1000; // 2.8-3.8s visible
      const hiddenDuration = 800 + Math.random() * 800; // 0.8-1.6s hidden
      
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        timeoutId = setTimeout(() => {
          setIsVisible(true);
          // Regenerate positions when becoming visible again
          setButterflies(generateButterflies());
          toggleVisibility();
        }, hiddenDuration);
      }, visibleDuration);
    };

    // Initial generation
    setButterflies(generateButterflies());
    toggleVisibility();

    return () => clearTimeout(timeoutId);
  }, [generateButterflies]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {butterflies.map((butterfly, index) => (
        <motion.div
          key={butterfly.id}
          className="absolute"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            opacity: isVisible ? butterfly.opacity : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isVisible ? butterfly.opacity : 0,
            x: [0, 100, -50, 150, 0],
            y: [0, -80, 60, -40, 0],
            rotate: [0, 15, -10, 20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: butterfly.duration,
            delay: butterfly.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <ButterflySVG 
            size={butterfly.size} 
            color={['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'][index % 5]} 
          />
        </motion.div>
      ))}

      {/* Additional floating particles for depth */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-blue-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -10, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
