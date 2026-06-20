/**
 * GlobalSpotlight adds a subtle viewport-fixed gradient glow that tracks the
 * cursor across the entire page.
 *
 * Fits in: App shell wrapper, rendered globally.
 * Note:    Updates CSS variables directly on its container element via a ref to
 *          avoid triggering React re-renders on every mouse movement, ensuring
 *          60fps performance even during scroll and rapid cursor sweeps.
 */
import React, { useEffect, useRef, useState } from 'react';

export function GlobalSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    // Check if the device has hover capabilities (ignore touch-only devices)
    const checkHover = () => {
      setHasHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    
    checkHover();
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    mediaQuery.addEventListener('change', checkHover);
    return () => mediaQuery.removeEventListener('change', checkHover);
  }, []);

  useEffect(() => {
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const pctX = (e.clientX / window.innerWidth) * 100;
          const pctY = (e.clientY / window.innerHeight) * 100;
          
          containerRef.current.style.setProperty('--page-cx', `${pctX}%`);
          containerRef.current.style.setProperty('--page-cy', `${pctY}%`);
        }
        rafRef.current = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasHover]);

  if (!hasHover) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[5] transition-opacity duration-1000"
      style={{
        background: 'radial-gradient(circle 800px at var(--page-cx, 50%) var(--page-cy, 30%), var(--page-spotlight-color-1, rgba(0, 200, 180, 0.045)) 0%, var(--page-spotlight-color-2, rgba(99, 102, 241, 0.015)) 50%, transparent 100%)',
      }}
    />
  );
}
