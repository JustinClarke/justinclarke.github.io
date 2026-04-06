import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SOFT_QUARTIC_EASE, REVEAL_DURATION } from '@/shared/constants';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  once?: boolean;
  layout?: boolean | 'position' | 'size';
}

/**
 * ScrollReveal provides a standardized, high-performance entrance animation
 * using Framer Motion's whileInView. Replaces legacy JS observers for headers.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 12,
  duration = REVEAL_DURATION,
  once = true,
  layout,
}) => {
  const prefersReduced = useReducedMotion();

  const getInitial = () => {
    if (prefersReduced) return { opacity: 0 };
    switch (direction) {
      case 'up': return { opacity: 0, y: distance };
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance };
      case 'right': return { opacity: 0, x: -distance };
      default: return { opacity: 0, y: distance };
    }
  };

  const getAnimate = () => {
    if (prefersReduced) return { opacity: 1 };
    switch (direction) {
      case 'up':
      case 'down': return { opacity: 1, y: 0 };
      case 'left':
      case 'right': return { opacity: 1, x: 0 };
      default: return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      layout={layout}
      initial={getInitial()}
      whileInView={getAnimate()}
      onViewportEnter={(entry) => {
        if (entry?.target) {
          (entry.target as HTMLElement).classList.add('anim-in');
        }
      }}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: SOFT_QUARTIC_EASE,
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};
