/**
 * useBentoCycle the "brain" behind the featured-projects bento grid: it picks
 * which project card is spotlighted, remembers which one the mouse is hovering,
 * and makes a soft light follow the cursor across the whole grid.
 *
 * Fits in: called once by the bento grid; the grid itself just reads the values
 *          returned here and draws them (it stays a "dumb" renderer).
 * Note:    the cursor-follow light is written straight onto the page as CSS
 *          variables (--bento-cx / --bento-cy), NOT React state, because updating
 *          React ~60 times a second on every mouse move would be slow and janky.
 *
 * For beginners ----------------------------------------------------------------
 * A "hook" is a reusable function whose name starts with `use`. It bundles up
 * some memory (useState) and some background behaviour (useEffect) so a component
 * can borrow all of it in one line. Think of it as a small machine you plug in.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect, useRef } from 'react';
import { CYCLING_CARDS } from '@/data/bento';
import { debug } from '@/utils';

// LEARN: A logger labelled "bento". Silent unless you enable it in the console
//    with  localStorage.debug = 'bento'  then refresh (see src/utils/debug.ts).
const log = debug('bento');

export function useBentoCycle() {
  // LEARN: useState gives this hook memory that survives re-renders. Each call
  //    returns [currentValue, setterFunction]. Calling the setter re-renders the
  //    component that uses this hook, with the new value.
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  // LEARN: useRef is a box that holds a value across re-renders WITHOUT causing
  //    one when it changes. We use refs to stash timer/animation handles so we
  //    can cancel them later in cleanup. `.current` is how you read/write the box.
  const rafRef = useRef<number | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-cycle the highlighted card every 4 seconds ─────────────────────────
  // LEARN: useEffect runs code AFTER the screen is painted. The empty `[]` at the
  //    end means "run once, when this hook first mounts". setInterval repeatedly
  //    calls our function on a timer.
  useEffect(() => {
    log('cycle started', { cards: CYCLING_CARDS.length });
    cycleRef.current = setInterval(() => {
      // LEARN: passing a FUNCTION to the setter lets us read the latest value
      //    safely. `% length` wraps back to 0 after the last card (a loop).
      setActiveCardIdx(i => (i + 1) % CYCLING_CARDS.length);
    }, 4000);
    // LEARN: the function you RETURN from useEffect is its cleanup. React runs it
    //    when the hook unmounts, so the timer doesn't keep firing forever.
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  // ── Cursor-tracked spotlight (writes CSS vars; idles back to centre) ─────────
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // LEARN: requestAnimationFrame throttles us to the screen's refresh rate.
      //    If a frame is already queued (rafRef is set) we skip so dozens of
      //    raw mouse events collapse into at most one DOM write per frame.
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const pct = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
        // LEARN: setProperty writes a CSS custom property on <html>. The grid's
        //    CSS reads --bento-cx/--bento-cy to position its glow so JS updates
        //    the look without React re-rendering anything.
        document.documentElement.style.setProperty('--bento-cx', `${pct.x}%`);
        document.documentElement.style.setProperty('--bento-cy', `${pct.y}%`);
        rafRef.current = null;
      });
    };
    // LEARN: when the mouse stops, this timer fires after 2s and eases the light
    //    back to a resting position near the top-centre. Each move resets it.
    const handleIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        document.documentElement.style.setProperty('--bento-cx', '50%');
        document.documentElement.style.setProperty('--bento-cy', '10%');
      }, 2000);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousemove', handleIdle);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousemove', handleIdle);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // LEARN: a plain derived value recomputed every render from current state.
  //    No need for state of its own; it's just "the card at the active index".
  const cyclingCard = CYCLING_CARDS[activeCardIdx];

  return { hoveredCard, setHoveredCard, cyclingCard };
}
