import { animate } from 'framer-motion';

/**
 * Custom "Elevator" scroll utility.
 * Provies a slow, gradual, and premium-feeling smooth scroll to a target element.
 * Rewritten using Framer Motion to eliminate GSAP dependency.
 * 
 * @param targetId The ID of the target element to scroll to.
 * @param duration Custom scroll duration in seconds (default: 1.8).
 * @param offset Vertical offset from the top (default: 0).
 */
export const elevatorScroll = (targetId: string, duration: number = 1.8, offset: number = 0) => {
  const element = document.getElementById(targetId);
  
  if (element) {
    const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
    
    // Honor reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetY);
      return;
    }

    animate(window.scrollY, targetY, {
      duration: duration,
      ease: [0.87, 0, 0.13, 1], // expo.inOut cubic-bezier equivalent
      onUpdate: (value) => {
        window.scrollTo(0, value);
      }
    });
  }
};
