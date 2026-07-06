/**
 * useMousePositionMotion tracks the cursor's position on the whole PAGE.
 *
 * Fits in: used by CustomCursor to move the custom cursor dot.
 * Note:    like useSpotlight but page-wide (clientX/clientY straight from the
 *          window), not relative to one element.
 */
import { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

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
