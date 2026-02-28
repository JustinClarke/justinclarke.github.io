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
