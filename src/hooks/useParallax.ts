/**
 * useParallax returns an {x, y} offset that drifts with the mouse, for a
 * subtle "the layer follows your cursor" parallax effect.
 *
 * Fits in: a component points this at a container ref and adds the returned
 *          offset to a child's transform.
 * Note:    respects reduced-motion (returns {0,0}) and throttles to one update
 *          per animation frame so fast mouse moves don't flood React.
 */
import { useState, useEffect, RefObject, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useParallax(ref: RefObject<HTMLElement | null>, factor: number = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const rafId = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateRect = () => {
      if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
    };

    updateRect();
    window.addEventListener('resize', updateRect);

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        if (!rectRef.current) return;

        const rect = rectRef.current;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalized coordinates (-1 to 1)
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        
        setOffset({ 
          x: Math.max(-1, Math.min(1, x)) * factor, 
          y: Math.max(-1, Math.min(1, y)) * factor 
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateRect);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ref, factor, prefersReducedMotion]);

  return prefersReducedMotion ? { x: 0, y: 0 } : offset;
}
