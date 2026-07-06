/**
 * useSpotlight tracks the cursor's position INSIDE an element, for the glow
 * that follows your mouse across a card (see SpotlightCard).
 *
 * Fits in: a component spreads the returned onMouseMove onto its element and
 *          binds mouseX/mouseY to CSS variables the glow gradient reads.
 * Note:    coordinates are relative to the element (clientX minus the element's
 *          left edge), not the whole page.
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

  return {
    mouseX, 
    mouseY, 
    handleMouseMove 
  };
}
