import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition, useReducedMotion } from '@/shared/hooks';
import { cn } from '@/shared/utils';

/**
 * CustomCursor implements a high-performance cursor replacement.
 * Gracefully degrades in keyboard-only mode or if reduced motion is preferred.
 */
export const CustomCursor = () => {
  const { x, y, hasHover } = useMousePosition();
  const prefersReduced = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  useEffect(() => {
    // If device suddenly loses hover capabilities, reset state.
    if (!hasHover) {
      setIsHovering(false);
    }
  }, [hasHover]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user starts tabbing, switch to keyboard mode (show default cursor)
      if (e.key === 'Tab' || e.key === 'Shift') {
        setIsKeyboardMode(true);
        document.body.classList.add('recruiter-mode'); // Reusing the auto-cursor class
      }
    };

    const handleMouseMove = () => {
      // If user moves mouse, exit keyboard mode
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        document.body.classList.remove('recruiter-mode');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = !!target.closest('button, a, input, [role="button"], .interactive, .edu-item, .exp-item');
      setIsHovering(isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isKeyboardMode]);

  // Accessibility: Do not render if the device does not support hover,
  // if the user is in keyboard mode, or if reduced motion is preferred.
  if (!hasHover || isKeyboardMode || prefersReduced) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform",
        "flex items-center justify-center bg-white mix-blend-difference"
      )}
      animate={{
        x: x - (isHovering ? 16 : 8),
        y: y - (isHovering ? 16 : 8),
        scale: isHovering ? 2 : 1,
        width: isHovering ? 32 : 16,
        height: isHovering ? 32 : 16,
      }}
      transition={{
        type: 'spring',
        stiffness: 700,
        damping: 32,
        mass: 0.1,
      }}
    >
      {isHovering && (
        <motion.div
          className="w-1 h-1 rounded-full bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};
