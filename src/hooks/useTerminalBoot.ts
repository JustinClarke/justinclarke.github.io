import { useState, useEffect } from 'react';

/**
 * Manages the terminal boot sequence state.
 *
 * bootStep drives the staged typing animation in TerminalHeader:
 *   -1  waiting for preloaderComplete event
 *    0  start typing
 *    7  fully booted (skipped on mobile and on repeated visits)
 *
 * Cleanup - the preloaderComplete listener and safety timeout both clear on unmount.
 */
export function useTerminalBoot() {
  const [bootStep, setBootStep] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 7;

    try {
      if (typeof window !== 'undefined' && (
        (window as any).__TERMINAL_BOOTED__ ||
        sessionStorage.getItem('terminal_booted') === 'true'
      )) {
        return 7;
      }
    } catch (e) {}

    if (typeof window !== 'undefined' && (window as any).__PRELOADER_COMPLETE__) return 0;
    return -1;
  });

  // Listen for preloaderComplete; safety timeout fires if preloader never signals
  useEffect(() => {
    if (bootStep === 7) return;

    const handleStart = () => {
      setTimeout(() => setBootStep(0), 300);
    };

    window.addEventListener('preloaderComplete', handleStart);

    const safetyTimeout = setTimeout(() => {
      setBootStep(prev => prev === -1 ? 0 : prev);
    }, 4500);

    return () => {
      window.removeEventListener('preloaderComplete', handleStart);
      clearTimeout(safetyTimeout);
    };
  }, [bootStep]);

  // Mark terminal as booted in sessionStorage so repeat visits skip the animation
  useEffect(() => {
    if (bootStep === 7 && typeof window !== 'undefined') {
      (window as any).__TERMINAL_BOOTED__ = true;
      try {
        sessionStorage.setItem('terminal_booted', 'true');
      } catch (e) {}
    }
  }, [bootStep]);

  return { bootStep, setBootStep };
}
