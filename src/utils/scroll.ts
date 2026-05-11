const expoInOut = (t: number): number => {
  if (t === 0 || t === 1) return t;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

export const elevatorScroll = (targetId: string, duration = 1.6, offset = 100) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const startTime = performance.now();
  const durationMs = duration * 1000;

  const tick = (now: number) => {
    const t = Math.min((now - startTime) / durationMs, 1);
    
    // Recalculate targetY in case of layout shifts during scroll
    const currentTargetY = element.getBoundingClientRect().top + window.scrollY - offset;
    const delta = currentTargetY - startY;
    
    window.scrollTo(0, startY + delta * expoInOut(t));
    
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};
