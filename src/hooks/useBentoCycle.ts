import { useState, useEffect, useRef } from 'react';
import { CYCLING_CARDS } from '@/data/bento';

/**
 * Behaviour for the featured-projects bento grid:
 *  - auto-cycles the highlighted card every 4s
 *  - tracks which card is hovered
 *  - drives the cursor-follow spotlight via CSS custom props (idles to centre)
 *
 * Returns plain state/derived values; the grid stays a pure renderer.
 */
export function useBentoCycle() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const rafRef = useRef<number | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cycle the highlighted card
  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setActiveCardIdx(i => (i + 1) % CYCLING_CARDS.length);
    }, 4000);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  // Cursor-tracked spotlight parallax (writes CSS vars; idles back to centre)
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const pct = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
        document.documentElement.style.setProperty('--bento-cx', `${pct.x}%`);
        document.documentElement.style.setProperty('--bento-cy', `${pct.y}%`);
        rafRef.current = null;
      });
    };
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

  const cyclingCard = CYCLING_CARDS[activeCardIdx];

  return { hoveredCard, setHoveredCard, cyclingCard };
}
