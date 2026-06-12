/**
 * StatsRibbon four headline numbers (races, rows, models, tests) that count up
 * from zero the first time the ribbon scrolls into view.
 *
 * Fits in: the overview, as a quick credibility band.
 * Note:    The count-up only starts once, on first scroll-in then the observer
 *          disconnects so it never re-triggers.
 *
 * For beginners ----------------------------------------------------------------
 * Two ideas combine here:
 *  - IntersectionObserver is a browser tool that calls you back when an element
 *    enters the viewport. We use it to flip `isVisible` true the moment the
 *    ribbon is seen, then `disconnect()` so it fires only once.
 *  - requestAnimationFrame (rAF) asks the browser to run `step` before the next
 *    repaint (~60x/sec). Each call nudges the number toward its target using an
 *    easing curve, producing a smooth count-up animation. The cleanup function
 *    cancels any pending frame if the component unmounts mid-animation.
 * -----------------------------------------------------------------------------
 */
import { useEffect, useState, useRef } from 'react';
import { STATS } from '../../../data/projectStats';

// LEARN: A custom hook (any function named use*) that animates one number from 0
//    to `endValue`. It returns the live `count`, which the component renders.
function useCounter(endValue: number, duration: number = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return; // wait until the ribbon is on screen

    let startTime: number | null = null;
    let animationFrame: number;

    // LEARN: `step` runs once per animation frame. `timestamp` is the time the
    //    browser passes in; progress goes 0→1 over `duration` ms, then we stop.
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    // LEARN: cleanup cancel the queued frame so a half-finished animation does
    //    not keep running after the component is removed.
    return () => window.cancelAnimationFrame(animationFrame);
  }, [endValue, duration, trigger]);

  return count;
}

export function StatsRibbon() {
  const [isVisible, setIsVisible] = useState(false);
  // LEARN: a ref is a stable handle to the real DOM node, so the observer below
  //    has something concrete to watch. Reading `ref.current` does not re-render.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire once, then stop watching
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const races = useCounter(STATS.races, 2000, isVisible);
  const rows = useCounter(90, 2500, isVisible);
  const models = useCounter(STATS.dbtModels, 1800, isVisible);
  const tests = useCounter(STATS.tests, 2200, isVisible);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 bg-graphite-800/40 border border-white/5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-white/95 tracking-tighter mb-2">
            {races}
          </span>
          <span className="font-jetbrains text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Races Analyzed
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-l border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-white/95 tracking-tighter mb-2">
            {rows}M+
          </span>
          <span className="font-jetbrains text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Telemetry Rows
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-t md:border-t-0 md:border-l border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-white/95 tracking-tighter mb-2">
            {models}
          </span>
          <span className="font-jetbrains text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Data Models
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-t border-l md:border-t-0 border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-emerald-500 tracking-tighter mb-2 relative">
            {tests}
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl -z-10 rounded-full" />
          </span>
          <span className="font-jetbrains text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest text-emerald-600 font-semibold">
            Passing Tests
          </span>
        </div>
      </div>
      <p className="font-jetbrains text-[10px] text-white/40 text-center">
        {STATS.seasons} seasons · {STATS.telemetryHz}Hz telemetry · modeled locally  - zero cloud spend
      </p>
    </div>
  );
}
