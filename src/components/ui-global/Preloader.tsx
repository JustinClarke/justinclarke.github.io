import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  OTHER_LANGUAGES, 
  TERMINAL_LOGS, 
  PIPELINE_COLORS, 
  PRELOADER_TIMELINE 
} from '@/data';
import { PRELOADER_EXIT } from '@/config/animations';
import { useReducedMotion } from '@/shared/hooks';

/**
 * Preloader - Technical decryption rhythm + Cinematic fade exit.
 * 
 * Orchestrates a precisely timed sequence of multilingual greetings 
 * and terminal boot logs to create a premium "loading" experience.
 */
export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const [colorPhase, setColorPhase] = useState(0);
  const prefersReducedMotion = useReducedMotion();

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

    // Stagger logs
    const logDelays = prefersReducedMotion ? [50, 100, 150, 200, 250] : [300, 700, 1100, 1400, 1700];
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
          className='fixed inset-0 z-[9999] bg-[#050505] overflow-hidden flex items-center justify-center'
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
          <div className='absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 pb-8'>
            <motion.div 
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className='flex items-end justify-between mb-6'
            >
              <div className='flex-1' />

              <div className='w-[320px] shrink-0 hidden md:block'>
                <div className='border border-white/[0.03] rounded-lg bg-black/20 px-4 py-3 backdrop-blur-sm'>
                  <div className='flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/[0.03]'>
                    <div className='w-[4px] h-[4px] rounded-full bg-white/10' aria-hidden='true' />
                    <span className='font-mono text-[12px] text-white/15 uppercase tracking-[0.25em]'>
                      kern.sys.boot
                    </span>
                  </div>

                  <div className='flex flex-col gap-[3px] min-h-[90px]'>
                    <AnimatePresence initial={false}>
                      {visibleLogs.map((logIndex) => (
                        <motion.div
                          key={logIndex}
                          initial={{ opacity: 0, x: -2 }}
                          animate={{ opacity: 1, x: 0 }}
                          className='font-mono text-[13px] uppercase tracking-wider leading-tight'
                        >
                          <span className={`transition-colors duration-700 ${TERMINAL_LOGS[logIndex].isStatus ? 'text-[#00c8b4]' : 'text-white/15'}`}>
                            {TERMINAL_LOGS[logIndex].tag}
                          </span>{' '}
                          <span className='text-white/40'>
                            {TERMINAL_LOGS[logIndex].text}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
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
