import { motion } from 'framer-motion';
import type { F1Telemetry } from '@/hooks/useF1Telemetry';

type TelemetryPanelProps = Pick<F1Telemetry, 'liveSpeed' | 'liveThrottle' | 'liveBrake'>;

/** PANEL A: Raw Telemetry dials. Rendered as a keyed child of AnimatePresence. */
export function TelemetryPanel({ liveSpeed, liveThrottle, liveBrake }: TelemetryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-3 gap-2 shrink-0"
    >
      <div className="bg-black/40 border border-white/5 rounded-xl p-2 lg:p-1.5 xl:p-2 2xl:p-3 flex flex-col items-center justify-between">
        <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] lg:text-[8px] xl:text-[9px] 2xl:text-[10px] text-neutral-500 uppercase tracking-tight xs:tracking-normal sm:tracking-wide lg:tracking-tighter xl:tracking-normal 2xl:tracking-wider">Speed</span>
        <span className="font-mono text-xs xs:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-white tracking-tighter mt-1">{liveSpeed}</span>
        <span className="font-mono text-[8px] lg:text-[7px] xl:text-[8px] 2xl:text-[9px] text-neutral-400 uppercase tracking-wider mt-0.5">km/h</span>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-xl p-2 lg:p-1.5 xl:p-2 2xl:p-3 flex flex-col items-center justify-between">
        <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] lg:text-[8px] xl:text-[9px] 2xl:text-[10px] text-neutral-500 uppercase tracking-tight xs:tracking-normal sm:tracking-wide lg:tracking-tighter xl:tracking-normal 2xl:tracking-wider">Throttle</span>
        <span className="font-mono text-xs xs:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-brand-primary tracking-tighter">{liveThrottle}%</span>
        <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${liveThrottle}%` }} />
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-xl p-2 lg:p-1.5 xl:p-2 2xl:p-3 flex flex-col items-center justify-between">
        <span className="font-mono text-[8px] xs:text-[9px] sm:text-[10px] lg:text-[8px] xl:text-[9px] 2xl:text-[10px] text-neutral-500 uppercase tracking-tight xs:tracking-normal sm:tracking-wide lg:tracking-tighter xl:tracking-normal 2xl:tracking-wider">Brake</span>
        <span className="font-mono text-xs xs:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-viz-mac-red tracking-tighter">{liveBrake}%</span>
        <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-viz-mac-red transition-all duration-300" style={{ width: `${liveBrake}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
