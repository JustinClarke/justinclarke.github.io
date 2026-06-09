/**
 * useTerminalBoot owns the staged "boot up" animation state for the Hero
 * terminal (the typed-out startup lines you see on first load).
 *
 * Fits in: called by the Hero component. The number it returns (`bootStep`)
 *          drives the typing animation in TerminalHeader.
 * Note:    the boot animation runs once per browser tab. Repeat visits and
 *          phones jump straight to the finished state so nobody waits twice.
 *
 * For beginners ----------------------------------------------------------------
 * A "custom hook" is just a function whose name starts with `use` and that uses
 * React features (useState/useEffect) inside. It lets us keep this fiddly boot
 * logic in its own file instead of cluttering the Hero component. The Hero calls
 * `useTerminalBoot()` and gets back a number plus a setter, exactly like
 * `useState` that's the point: it behaves like a built-in hook.
 *
 * `bootStep` is a single number that represents "how far through the boot we
 * are." TerminalHeader watches it and types out one more line each step:
 *   -1  → waiting for the preloader (intro screen) to finish
 *    0  → start typing the boot lines
 *    7  → fully booted (also the value we jump straight to when skipping)
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { debug } from '@/utils';

const log = debug('terminal');

export function useTerminalBoot() {
  // LEARN: passing a FUNCTION to useState means "run this once to work out the
  //    starting value." We use it to decide whether to skip the boot animation.
  const [bootStep, setBootStep] = useState<number>(() => {
    // Phones skip the animation entirely (start fully booted).
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 7;

    // Already booted earlier this tab session? Skip it.
    try {
      if (typeof window !== 'undefined' && (
        (window as any).__TERMINAL_BOOTED__ ||
        sessionStorage.getItem('terminal_booted') === 'true'
      )) {
        return 7;
      }
    } catch (e) {
      // sessionStorage can throw in private mode ignore and continue.
    }

    // The intro Preloader already finished → we can start typing now (step 0).
    if (typeof window !== 'undefined' && (window as any).__PRELOADER_COMPLETE__) return 0;

    // Otherwise wait for the preloader to signal it's done (step -1).
    return -1;
  });

  // ── Effect: kick off the boot once the preloader finishes ───────────────────
  // LEARN: useEffect re-runs whenever a value in its dependency array (here
  //    `[bootStep]`) changes. We bail out early once booted so it stops working.
  useEffect(() => {
    if (bootStep === 7) return; // already done, nothing to wait for

    // The Preloader dispatches this event when its animation ends.
    const handleStart = () => {
      log('preloader done → starting boot');
      setTimeout(() => setBootStep(0), 300);
    };

    window.addEventListener('preloaderComplete', handleStart);

    // LEARN: a safety net. If the preloader event never arrives (e.g. it was
    //    skipped), this timer nudges us off the -1 "waiting" state after 4.5s so
    //    the terminal can never get stuck on a blank waiting screen.
    const safetyTimeout = setTimeout(() => {
      setBootStep(prev => prev === -1 ? 0 : prev);
    }, 4500);

    // Cleanup: remove the listener and timer when this effect re-runs/unmounts.
    return () => {
      window.removeEventListener('preloaderComplete', handleStart);
      clearTimeout(safetyTimeout);
    };
  }, [bootStep]);

  // ── Effect: remember that we've booted, so repeat visits can skip ───────────
  useEffect(() => {
    if (bootStep === 7 && typeof window !== 'undefined') {
      log('boot complete');
      (window as any).__TERMINAL_BOOTED__ = true;
      try {
        sessionStorage.setItem('terminal_booted', 'true');
      } catch (e) {
        // ignore storage restrictions
      }
    }
  }, [bootStep]);

  return { bootStep, setBootStep };
}
