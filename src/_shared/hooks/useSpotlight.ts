import React from 'react';
import { useMotionValue, useMotionTemplate } from 'framer-motion';

/**
 * Custom hook for the 'Spotlight' interactive gradient effect.
 */
export function useSpotlight(config = { radius: 250, color: '0, 200, 180' }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(
      ${config.radius}px circle at ${mouseX}px ${mouseY}px,
      rgba(${config.color}, 0.08),
      transparent 80%
    )
  `;

  const borderGlow = useMotionTemplate`
    radial-gradient(
      ${config.radius}px circle at ${mouseX}px ${mouseY}px,
      rgba(${config.color}, 0.4),
      transparent 80%
    )
  `;

  const borderMask = useMotionTemplate`
    radial-gradient(${config.radius}px circle at ${mouseX}px ${mouseY}px, black, transparent)
  `;

  return { mouseX, mouseY, handleMouseMove, background, borderGlow, borderMask };
}
