/**
 * CausalPanel "Panel B" of the F1 card: the causal lap-time breakdown, listing
 * each modelled penalty (tyres, fuel, air, thermal) and the isolated driver
 * coefficient that the whole project is really about.
 *
 * Fits in: the alternative to TelemetryPanel; F1TelemetryWidget swaps between the
 *          two inside <AnimatePresence>. Reads the `decomp` object from the hook.
 * Note:    presentational only the numbers are computed in useF1Telemetry; this
 *          file just formats and colours them.
 */
import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';
import { cn } from '@/utils';
import type { F1Telemetry } from '../useF1Telemetry';

type CausalPanelProps = Pick<F1Telemetry, 'decomp' | 'fuelWeight'>;

export function CausalPanel({ decomp, fuelWeight }: CausalPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-black/40 border border-[rgba(255,255,255,0.06)] rounded-2xl p-2.5 lg:p-2 xl:p-2.5 2xl:p-3 flex flex-col gap-2 shrink-0 text-left min-h-[110px] overflow-hidden shadow-inner"
    >
      {/* Heading: Title Above, Number Below */}
      <div className="flex flex-col gap-1 border-b border-[rgba(255,255,255,0.06)] pb-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-purple-400 shrink-0" />
          <span className="font-mono text-micro text-neutral-300 font-bold uppercase tracking-wider">
            CAUSAL DECOMPOSITION
          </span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-[10px] text-neutral-400 font-medium">Modeled Pace:</span>
          <span className="text-xs font-black text-white bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 rounded">
            {decomp.totalLapTime.toFixed(3)}s
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-micro font-mono leading-tight">
        {/* Tyre Decay */}
        <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-white/[0.015] border border-white/[0.03]">
          <span className="text-neutral-400">Tyre Decay:</span>
          <span className="text-white font-medium">+{decomp.tyreBasePenalty.toFixed(3)}s</span>
        </div>

        {/* Fuel load */}
        <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-white/[0.015] border border-white/[0.03]">
          <span className="text-neutral-400">Fuel ({fuelWeight.toFixed(1)}kg):</span>
          <span className="text-white font-medium">+{decomp.fuelLoadPenalty.toFixed(3)}s</span>
        </div>

        {/* Air state */}
        <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-white/[0.015] border border-white/[0.03]">
          <span className="text-neutral-400">Air Penalty:</span>
          <span className={cn("font-medium", decomp.airPenalty > 0 ? "text-viz-mac-red" : "text-emerald-400")}>
            {decomp.airPenalty >= 0 ? '+' : ''}{decomp.airPenalty.toFixed(3)}s
          </span>
        </div>

        {/* Thermal Hysteresis */}
        <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-white/[0.015] border border-white/[0.03]">
          <span className="text-neutral-400">Thermal Hyst:</span>
          <span className="text-white font-medium">+{decomp.thermalHysteresis.toFixed(3)}s</span>
        </div>
      </div>

      {/* Prominent Hero Driver Skill / Off The Pace Banner: Title Above, Number Below */}
      <div className="flex flex-col gap-1 p-2 rounded-xl bg-viz-mac-red/10 border border-viz-mac-red/30 shadow-[0_0_10px_rgba(225,6,0,0.12)] mt-0.5">
        <div className="flex items-center gap-1.5">
          <Award size={11} className="shrink-0 text-viz-mac-red" />
          <span className="font-mono text-micro text-viz-mac-red font-black uppercase tracking-wider">
            OFF THE PACE (ε)
          </span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-[10px] text-neutral-400">Skill Delta:</span>
          <span className="text-xs font-black text-emerald-400">
            {decomp.driverSkill >= 0 ? '+' : ''}{decomp.driverSkill.toFixed(3)}s
          </span>
        </div>
      </div>
    </motion.div>
  );
}
