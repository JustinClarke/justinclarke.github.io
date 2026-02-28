import React from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Custom hook for the 'Spotlight' interactive gradient effect.
 * Optimized to use CSS Variables instead of multiple useMotionTemplate strings.
 * This pushes the computation of the gradient to the browser's CSS engine,
 * which is significantly more efficient than JS-based string interpolation.
 */
export function useSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // We return the motion values to be mapped to CSS variables in the component
  return { 
    mouseX, 
    mouseY, 
    handleMouseMove 
  };
}
