import { useState, useEffect, RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Custom hook to calculate parallax offsets based on mouse position relative to a target element.
 * 
 * @param ref - Reference to the container element for coordinate calculation.
 * @param factor - Strength of the parallax effect (displacement in pixels).
 * @returns Object containing x and y offsets.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, factor: number = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalized coordinates (-1 to 1)
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      setOffset({ 
        x: Math.max(-1, Math.min(1, x)) * factor, 
        y: Math.max(-1, Math.min(1, y)) * factor 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, factor, prefersReducedMotion]);

  return prefersReducedMotion ? { x: 0, y: 0 } : offset;
}
