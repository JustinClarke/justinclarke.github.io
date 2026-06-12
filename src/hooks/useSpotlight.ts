/**
 * useSpotlight tracks the cursor's position INSIDE an element, for the glow
 * that follows your mouse across a card (see SpotlightCard).
 *
 * Fits in: a component spreads the returned onMouseMove onto its element and
 *          binds mouseX/mouseY to CSS variables the glow gradient reads.
 * Note:    coordinates are relative to the element (clientX minus the element's
 *          left edge), not the whole page.
 *
 * For beginners ----------------------------------------------------------------
 * useMotionValue is a Framer Motion box that holds a number WITHOUT re-rendering
 * React when it changes. We `.set()` it on every mouse move; the browser's CSS
 * engine paints the glow, so even 120 moves/second stay smooth.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { useMotionValue } from 'framer-motion';

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
