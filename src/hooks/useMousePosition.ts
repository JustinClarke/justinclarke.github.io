import React, { useState, useEffect, RefObject } from 'react';

/**
 * Custom hook to track mouse position.
 */
export function useMousePosition(ref?: RefObject<HTMLElement | null>) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const checkHover = () => {
      setHasHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    checkHover();
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    mediaQuery.addEventListener('change', checkHover);
    return () => mediaQuery.removeEventListener('change', checkHover);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      } else {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref]);

  return { ...mousePos, hasHover };
}
