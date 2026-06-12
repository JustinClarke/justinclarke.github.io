/**
 * useFirstVisit returns true the FIRST time a visitor hits something, then
 * false on every later visit and remembers across page loads.
 *
 * Fits in: gate one-time intros/hints ("show this tip only once").
 * Note:    it records the visit under `key` in localStorage, so "first" means
 *          first on this browser/device, persisting between sessions.
 *
 * For beginners ----------------------------------------------------------------
 * localStorage is the browser's tiny key/value store that survives refreshes and
 * restarts. The lazy useState initialiser reads it once on mount to decide the
 * answer; the effect then writes the flag so next time it returns false.
 * -----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';

export function useFirstVisit(key: string): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem(key);
  });

  useEffect(() => {
    const visited = localStorage.getItem(key);
    if (!visited) {
      localStorage.setItem(key, 'true');
    }
  }, [key]);

  return isFirstVisit;
}
