import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useReducedMotion, useMousePositionMotion } from '@/hooks';
import { cn } from '@/utils';

/**
 * CustomCursor: High-performance Cinematic HUD Cursor.
 * Morphs from a terminal block to a targeting reticle with trailing data.
 */
export const CustomCursor = () => {
  const { mouseX, mouseY } = useMousePositionMotion();
  const prefersReduced = useReducedMotion();

  const [hoverState, setHoverState] = useState<'default' | 'interactive' | 'text'>('default');
  const [activeLabel, setActiveLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Main Cursor Spring: Snappy, zero mass for instantaneous feel
  const springConfig = { stiffness: 1000, damping: 50, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Trailing Chip Spring: Slightly more 'liquid' and delayed
  const trailConfig = { stiffness: 150, damping: 30, mass: 0.8 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest('button, a, input, [role="button"], .interactive, .edu-item, .exp-item');
      const text = target.closest('p, h1, h2, h3, span, li');

      if (interactive) {
        setHoverState('interactive');
        // Extract command from data-cmd or use generic
        const cmd = interactive.getAttribute('data-cmd') || (interactive.tagName === 'A' ? '> nav_to()' : '> exec_fn()');
        setActiveLabel(cmd);
      } else if (text) {
        setHoverState('text');
        setActiveLabel('');
      } else {
        setHoverState('default');
        setActiveLabel('');
      }
    };

    const handleMouseDown = () => setHoverState('interactive');
    const handleMouseUp = () => setHoverState('default');
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (prefersReduced || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {/* ── Main Morphing Cursor ── */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center will-change-transform"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        <AnimatePresence mode="wait">
          {hoverState === 'interactive' ? (
            /* HUD Targeting Reticle - Brand Teal for High Contrast */
            <motion.div
              key="interactive"
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              className="relative w-10 h-10"
            >
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2.5 h-2.5 border-brand-primary"
                  style={{
                    transform: `rotate(${deg}deg)`,
                    top: deg === 0 || deg === 270 ? 0 : 'auto',
                    bottom: deg === 90 || deg === 180 ? 0 : 'auto',
                    left: deg === 0 || deg === 90 ? 0 : 'auto',
                    right: deg === 180 || deg === 270 ? 0 : 'auto',
                    borderTopWidth: (deg === 0 || deg === 270) ? 2 : 0,
                    borderLeftWidth: (deg === 0 || deg === 90) ? 2 : 0,
                    borderRightWidth: (deg === 180 || deg === 270) ? 2 : 0,
                    borderBottomWidth: (deg === 90 || deg === 180) ? 2 : 0,
                    filter: 'drop-shadow(0 0 4px rgba(0, 200, 180, 0.4))',
                  }}
                />
              ))}
              <motion.div 
                className="absolute inset-0 m-auto w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_#00c8b4]"
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          ) : hoverState === 'text' ? (
            /* Terminal I-Beam - Multi-layer contrast for absolute visibility */
            <motion.div
              key="text"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 24, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-[2.5px] bg-white relative"
              style={{ 
                boxShadow: '0 0 0 1px rgba(0,0,0,1), 0 0 12px rgba(255,255,255,0.8)' 
              }}
            />
          ) : (
            /* Terminal Block - Multi-layer contrast */
            <motion.div
              key="default"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-3 h-5 bg-white rounded-[1px]"
              style={{ 
                boxShadow: '0 0 0 1px rgba(0,0,0,1), 0 0 12px rgba(255,255,255,0.6)' 
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Trailing Data Chip ── */}
      <motion.div
        className="absolute top-0 left-0 ml-6 mt-6 flex flex-col gap-1 will-change-transform pointer-events-none"
        style={{ x: trailX, y: trailY }}
      >
        <AnimatePresence>
          {activeLabel && (
            <motion.div
              initial={{ x: -10, opacity: 0, filter: 'blur(4px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: 10, opacity: 0, filter: 'blur(4px)' }}
              className="bg-black/90 border border-white/10 backdrop-blur-md px-2 py-1 rounded-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#00c8b4]" />
                <span className="font-mono text-[10px] tracking-tighter text-white/90 uppercase">
                  {activeLabel}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle coordinate telemetry */}
        <div className="flex gap-2 opacity-20 font-mono text-[8px] tracking-widest text-white px-2">
          <span>X:{Math.round(mouseX.get())}</span>
          <span>Y:{Math.round(mouseY.get())}</span>
        </div>
      </motion.div>
    </div>
  );
};
