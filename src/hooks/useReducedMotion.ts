/**
 * useReducedMotion returns true when the visitor has asked their OS to
 * minimise animation ("prefers reduced motion").
 *
 * Fits in: animation-heavy components call this and skip/shorten motion when true.
 * Note:    it also LISTENS for changes, so toggling the OS setting updates the
 *          app live without a refresh.
 *
 * For beginners ----------------------------------------------------------------
 * window.matchMedia checks a CSS media query from JavaScript here the
 * accessibility "reduce motion" setting. The `() => {...}` passed to useState is
 * a "lazy initialiser": it computes the first value once, and guards against
 * `window` being missing during server-side rendering.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}
