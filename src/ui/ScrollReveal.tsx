/**
 * ScrollReveal a pass-through wrapper that just renders its children.
 *
 * Fits in: many call sites wrap content in <ScrollReveal delay=.. direction=..>
 *          expecting an on-scroll fade/slide animation.
 * Note:    this is INTENTIONALLY a no-op right now. It accepts all the animation
 *          props (delay/direction/distance/once/threshold) but ignores them, so
 *          the animation is currently disabled site-wide from one place. Keeping
 *          the props in the type means call sites don't need to change if/when
 *          the real reveal effect is wired back in here.
 *
 * For beginners ----------------------------------------------------------------
 * A component can accept props it doesn't use the extra props are simply left
 * out of the destructuring below, so they're silently accepted and dropped.
 * -----------------------------------------------------------------------------
 */
import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
