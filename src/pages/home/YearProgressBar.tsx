import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

const YEAR_START = 2018;
const YEAR_END = 2028;

export const YearProgressBar: React.FC = () => {
  const currentYear = 2026;
  const totalSpan = YEAR_END - YEAR_START;
  const progressPercent = ((currentYear - YEAR_START) / totalSpan) * 100;
  const ticks = [2018, 2020, 2022, 2024, 2026, 2028];

  return (
    <div className="relative mt-6 md:mt-10 mb-10 md:mb-14">
      {/* Background track */}
      <div className="relative h-[2px] bg-white/5 rounded-full overflow-visible">
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary/60 via-brand-primary to-brand-primary/80 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          viewport={{ once: true }}
        />
        {/* Leading glow dot with arrow head */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 z-10"
          initial={{ left: 0, opacity: 0 }}
          whileInView={{ left: `${progressPercent}%`, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          viewport={{ once: true }}
          style={{ marginLeft: '-6px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_15px_rgba(0,200,180,0.6)]" />
            <div className="absolute left-[70%] w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-brand-primary" />
          </div>
        </motion.div>
      </div>

      {/* Tick marks */}
      <div className="relative flex justify-between mt-3">
        {ticks.map((year) => {
          const pct = ((year - YEAR_START) / totalSpan) * 100;
          const isCurrent = year === currentYear;
          const isPast = year < currentYear;
          return (
            <div
              key={year}
              className="flex flex-col items-center"
              style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              <div className={cn(
                "w-px h-2 mb-1",
                isCurrent ? "bg-brand-primary" : isPast ? "bg-white/15" : "bg-white/5"
              )} />
              <span className={cn(
                "font-mono text-[9px] tabular-nums font-bold",
                isCurrent ? "text-brand-primary" : isPast ? "text-white/25" : "text-white/10"
              )}>
                {year}
              </span>
              {isCurrent && (
                <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-brand-primary/60 font-bold mt-0.5">
                  Now
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
