import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  OTHER_LANGUAGES,
  BOOT_LOGS,
  PIPELINE_COLORS,
  PRELOADER_TIMELINE
} from '@/config/constants';
import { PRELOADER_EXIT } from '@/config/animations';
import { useReducedMotion } from '@/hooks';

/**
 * Preloader the intro "loading" screen: a greeting cycles through languages
 * while terminal-style boot logs and a progress bar fill in, then it fades out.
 *
 * Fits in: shown once on first visit (App.tsx decides whether to render it).
 * Note:    when it finishes it fires a `preloaderComplete` window event the rest
 *          of the app listens for that to reveal the page. A "Skip Intro" button
 *          fires the same event early.
 *
 * For beginners ----------------------------------------------------------------
 * The whole thing is choreographed with timers. A chain of setTimeout calls
 * swaps the greeting text at set moments; clearTimeout in the cleanup cancels
 * any still-pending ones if the component leaves early. `progress` is a Framer
 * Motion value animated from 0 to 100, and the bar's width follows it.
 * -----------------------------------------------------------------------------
 */
export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const [colorPhase, setColorPhase] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // LEARN: useMemo runs this once and remembers the result, so the random pick
  //    of 9 languages stays fixed for the life of the component instead of
  //    reshuffling on every render. The empty `[]` means "never recompute".
  // Pick 9 random non-English languages (3 slow + 6 fast)
  const sessionLanguages = useMemo(() => {
    return [...OTHER_LANGUAGES].sort(() => 0.5 - Math.random()).slice(0, 9);
  }, []);

  const phaseColor = PIPELINE_COLORS[colorPhase % PIPELINE_COLORS.length];
  const progress = useMotionValue(0);

  // ── Decryption / Terminal Logic ──
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText('Hello');
      return;
    }

    // 0.0s - 0.9s: Slow Phase
    setCurrentText(sessionLanguages[0]);
    const timers = [
      setTimeout(() => setCurrentText(sessionLanguages[1]), 300),
      setTimeout(() => setCurrentText(sessionLanguages[2]), 600),

      // 0.9s - 1.5s: Rapid Phase
      setTimeout(() => setCurrentText(sessionLanguages[3]), 900),
      setTimeout(() => setCurrentText(sessionLanguages[4]), 1000),
      setTimeout(() => setCurrentText(sessionLanguages[5]), 1100),
      setTimeout(() => setCurrentText(sessionLanguages[6]), 1200),
      setTimeout(() => setCurrentText(sessionLanguages[7]), 1300),
      setTimeout(() => setCurrentText(sessionLanguages[8]), 1400),
      
      // 1.5s: Final Stillness
      setTimeout(() => setCurrentText('Hello'), 1500)
    ];

    return () => timers.forEach(clearTimeout);
  }, [sessionLanguages, prefersReducedMotion]);

  // Color pulse cycle
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorPhase((prev) => prev + 1);
    }, 900);
    return () => clearInterval(colorInterval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const runProgress = async () => {
      if (prefersReducedMotion) {
        await animate(progress, 100, { duration: 0.4 });
        return;
      }
      // Synchronize bar with decryption speed
      await animate(progress, 20, { duration: PRELOADER_TIMELINE.SLOW_PHASE_DURATION, ease: 'linear' });
      await animate(progress, 85, { duration: PRELOADER_TIMELINE.FAST_PHASE_DURATION, ease: 'easeInOut' });
      await animate(progress, 100, { duration: PRELOADER_TIMELINE.STILLNESS_DURATION, ease: 'easeIn' });
    };

    runProgress();

    // Stagger logs (6 items)
    const logDelays = prefersReducedMotion 
      ? [50, 100, 150, 200, 250, 300] 
      : [300, 600, 900, 1200, 1500, 1800];
    const logTimers = logDelays.map((delay, i) =>
      setTimeout(() => setVisibleLogs((prev) => [...prev, i]), delay)
    );

    // Initial trigger for exit transition
    const totalDuration = prefersReducedMotion ? 0.6 : PRELOADER_TIMELINE.TOTAL_DURATION;
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      document.body.style.overflow = 'auto';
    }, totalDuration * 1000);

    return () => {
      logTimers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      document.body.style.overflow = 'auto';
    };
  }, [progress, prefersReducedMotion]);

  const width = useTransform(progress, (v) => `${v}%`);

  return (
    <AnimatePresence mode='wait'>
      {isVisible && (
        <motion.div
          variants={PRELOADER_EXIT}
          initial='initial'
          exit='exit'
          className='fixed inset-0 z-[9999] bg-brand-bg overflow-hidden flex items-center justify-center'
        >
          {/* Background Ambient Glow */}
          <div className='absolute inset-0 z-0'>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className='absolute inset-0 flex items-center justify-center'
            >
              <div
                className='w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-700'
                style={{ backgroundColor: `${phaseColor}15` }}
              />
            </motion.div>
          </div>

          {/* ── Center: Multilingual Greeting ── */}
          <div className='relative z-10 flex flex-col items-center'>
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className='text-5xl md:text-7xl font-serif italic text-white tracking-tight select-none'
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.08)'
              }}
            >
              {currentText}
              <span className='text-white/20 ml-1'>.</span>
            </motion.div>
          </div>

          {/* ── Bottom Interface ── */}
          <div className='absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 pb-8 flex flex-col items-stretch'>
            
            <motion.div
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className='relative flex items-end justify-between mb-6 gap-6'
            >
              {/* Left Side: Borderless Raw Terminal Logs */}
              <div className='flex-grow flex flex-col justify-start max-w-[65%] min-h-[190px]'>
                <div className='w-fit flex items-center gap-1.5 mb-3 pb-2 border-b border-white/10 shrink-0'>
                  <div className='w-[5px] h-[5px] rounded-full bg-brand-primary animate-pulse' aria-hidden='true' />
                  <span className='font-mono text-[11px] text-white/60 uppercase tracking-[0.3em]'>
                    kern.sys.boot_diagnostics
                  </span>
                </div>

                <div className='flex flex-col gap-2 flex-grow overflow-hidden font-mono text-[12px] md:text-[13px] uppercase tracking-wider leading-relaxed'>
                  <AnimatePresence initial={false}>
                    {visibleLogs.map((logIndex) => {
                      const log = BOOT_LOGS[logIndex];
                      const match = log.match(/^(\[\s*[A-Z0-9_-]+\s*\])\s*(\[[A-Z0-9_-]+\])\s*(.*)$/i);
                      const status = match ? match[1] : '[ OK ]';
                      const tag = match ? match[2] : '[BOOT]';
                      const message = match ? match[3] : log;

                      // Dynamic status badge coloring
                      const statusColor = status.includes('INFO') ? 'text-sky-400' : 'text-emerald-400';

                      // Dynamic colors for realistic console highlights
                      const tagColor = 
                        tag.includes('BOOT') ? 'text-amber-400' :
                        tag.includes('DATA') ? 'text-sky-400' :
                        tag.includes('STRM') ? 'text-teal-400' :
                        tag.includes('GPU') ? 'text-lime-400' :
                        tag.includes('USR') ? 'text-violet-400' :
                        tag.includes('VITE') ? 'text-purple-400 font-extrabold animate-pulse' : 'text-neutral-400';

                      return (
                        <motion.div
                          key={logIndex}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className='flex items-center gap-2 md:gap-3'
                        >
                          {/* Status tag */}
                          <span className={`shrink-0 font-bold ${statusColor}`}>
                            {status}
                          </span>

                          {/* Technical Module Tag */}
                          <span className={`shrink-0 font-bold ${tagColor}`}>
                            {tag}
                          </span>

                          {/* Descriptive Output */}
                          <span className='text-neutral-200 truncate'>
                            {message}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Netflix-style Skip Intro Button (Positioned Higher) */}
              <div className='absolute bottom-20 right-0 z-20'>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    window.dispatchEvent(new CustomEvent('preloaderComplete'));
                    document.body.style.overflow = 'auto';
                  }}
                  className='group px-6 py-2.5 rounded border border-white/30 bg-black/60 backdrop-blur-md text-white hover:bg-black/90 hover:border-white transition-all duration-200 font-sans text-xs md:text-sm font-semibold uppercase tracking-widest cursor-pointer select-none active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                >
                  Skip Intro
                </button>
              </div>
            </motion.div>

            {/* ── Progress Bar ── */}
            <div className='relative w-full h-[1px] bg-white/5'>
              <motion.div
                className='absolute top-0 left-0 h-full'
                style={{
                  width,
                  background: `linear-gradient(90deg, transparent, ${phaseColor}, white, ${phaseColor}, transparent)`
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
