/**
 * ScrollReveal fades and slides content in as it scrolls into view.
 *
 * Fits in: wraps section headers/cards across most content pages (14 call
 *          sites). `direction` describes the motion of the entrance (e.g.
 *          "up" rises into place from below), matching the `distance` prop
 *          in pixels. Honours `useReducedMotion` vestibular-sensitive
 *          visitors get the content instantly, with no transform.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  threshold?: number;
  [dataAttr: `data-${string}`]: string | number | boolean | undefined;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
  once = true,
  threshold = 0.2,
  ...dataAttrs
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className} {...dataAttrs}>{children}</div>;
  }

  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'down' || direction === 'right' ? -1 : 1;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, [axis]: sign * distance }}
      whileInView={{ opacity: 1, [axis]: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...dataAttrs}
    >
      {children}
    </motion.div>
  );
};
