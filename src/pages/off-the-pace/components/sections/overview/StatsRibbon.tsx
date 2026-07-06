/**
 * StatsRibbon four headline numbers (races, rows, models, tests) that count up
 * from zero the first time the ribbon scrolls into view.
 *
 * Fits in: the overview, as a quick credibility band.
 * Note:    The count-up only starts once, on first scroll-in then the observer
 *          disconnects so it never re-triggers.
 */
import { useEffect, useState, useRef } from 'react';
import { STATS } from '../../../data/projectStats';

function useCounter(endValue: number, duration: number = 2000, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return; // wait until the ribbon is on screen

    let startTime: number | null = null;
    let animationFrame: number;

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
    return () => window.cancelAnimationFrame(animationFrame);
  }, [endValue, duration, trigger]);

  return count;
}

export function StatsRibbon() {
  const [isVisible, setIsVisible] = useState(false);
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
  // Numeric part of STATS.telemetryRowsPerSeason ("90M+") - single source, the
  // "M+" unit stays in the markup below.
  const rows = useCounter(parseInt(STATS.telemetryRowsPerSeason, 10), 2500, isVisible);
  const models = useCounter(STATS.dbtModels, 1800, isVisible);
  const tests = useCounter(STATS.tests, 2200, isVisible);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 bg-brand-card/60 backdrop-blur-xl saturate-150 border border-white/10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
            {races}
          </span>
          <span className="font-jetbrains text-micro sm:text-micro md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Races Analyzed
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-l border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
            {rows}M+
          </span>
          <span className="font-jetbrains text-micro sm:text-micro md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Telemetry Rows
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-t md:border-t-0 md:border-l border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-2">
            {models}
          </span>
          <span className="font-jetbrains text-micro sm:text-micro md:text-xs uppercase tracking-wider md:tracking-widest text-slate-400 font-semibold">
            Data Models
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 text-center border-t border-l md:border-t-0 border-white/5">
          <span className="font-noto text-3xl sm:text-4xl md:text-5xl font-black text-emerald-500 tracking-tighter mb-2 relative">
            {tests}
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl -z-10 rounded-full" />
          </span>
          <span className="font-jetbrains text-micro sm:text-micro md:text-xs uppercase tracking-wider md:tracking-widest text-emerald-600 font-semibold">
            Passing Tests
          </span>
        </div>
      </div>
      <p className="font-jetbrains text-micro text-text-tertiary text-center">
        {STATS.seasons} seasons · {STATS.telemetryHz}Hz telemetry · modeled locally  - zero cloud spend
      </p>
    </div>
  );
}
