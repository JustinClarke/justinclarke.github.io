import { useEffect, useMemo } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * useMousePositionMotion
 * A high-performance mouse tracking hook that uses Framer Motion's useMotionValue
 * to bypass the React render loop. This prevents the entire component from re-rendering
 * on every single mousemove event (60-120 times per second).
 */
export function useMousePositionMotion() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
}
