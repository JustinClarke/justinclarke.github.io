import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion, useMousePositionMotion } from '@/shared/hooks';
import { cn } from '@/shared/utils';

/**
 * CustomCursor implements a high-performance cursor replacement.
 * Refactored to use useMotionValue (via useMousePositionMotion) to bypass 
 * the React render loop on every single mousemove event.
 */
export const CustomCursor = () => {
  const { mouseX, mouseY } = useMousePositionMotion();
  const prefersReduced = useReducedMotion();
  
  const [isHovering, setIsHovering] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  // Smooth springs for the cursor movement
  const springConfig = { stiffness: 700, damping: 40, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Shift') {
        setIsKeyboardMode(true);
        document.body.classList.add('recruiter-mode');
      }
    };

    const handleMouseMove = () => {
      if (isKeyboardMode) {
        setIsKeyboardMode(false);
        document.body.classList.remove('recruiter-mode');
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;
      const isInteractive = !!target.closest('button, a, input, [role="button"], .interactive, .edu-item, .exp-item');
      setIsHovering(isInteractive);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isKeyboardMode]);

  if (!hasHover || isKeyboardMode || prefersReduced) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 rounded-full pointer-events-none z-[99999] will-change-transform",
        "flex items-center justify-center bg-white mix-blend-difference"
      )}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: isHovering ? '-50%' : '-50%', // Centers the cursor
        translateY: isHovering ? '-50%' : '-50%',
        width: isHovering ? 32 : 16,
        height: isHovering ? 32 : 16,
        scale: isHovering ? 1.2 : 1, // Adjusted scale for smoother feel
      }}
      transition={{
        width: { duration: 0.2 },
        height: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
    >
      {isHovering && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};
