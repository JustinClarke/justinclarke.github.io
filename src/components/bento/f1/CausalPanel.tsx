/**
 * CausalPanel "Panel B" of the F1 card: the causal lap-time breakdown, listing
 * each modelled penalty (tyres, fuel, air, thermal) and the isolated driver
 * coefficient that the whole project is really about.
 *
 * Fits in: the alternative to TelemetryPanel; F1TelemetryWidget swaps between the
 *          two inside <AnimatePresence>. Reads the `decomp` object from the hook.
 * Note:    presentational only the numbers are computed in useF1Telemetry; this
 *          file just formats and colours them.
 *
 * For beginners ----------------------------------------------------------------
 * `decomp` arrives already calculated. `.toFixed(3)` formats a number to three
 * decimals for display, and cn() colours a value red or green depending on its
 * sign so a gain shows differently from a loss without any extra logic.
 * -----------------------------------------------------------------------------
 */
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { cn } from '@/utils';
import type { F1Telemetry } from '@/hooks/useF1Telemetry';

type CausalPanelProps = Pick<F1Telemetry, 'decomp' | 'fuelWeight'>;

export function CausalPanel({ decomp, fuelWeight }: CausalPanelProps) {
  return (
    // LEARN: this panel enters from the left (x: -20 → 0), mirroring TelemetryPanel
    //    so the two appear to slide past each other when you toggle.
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-black/40 border border-white/5 rounded-2xl p-2.5 lg:p-2 xl:p-2.5 2xl:p-3.5 flex flex-col gap-2 shrink-0 text-left min-h-[110px]"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-1">
        <span className="font-mono text-[8px] xs:text-[9px] lg:text-[7.5px] xl:text-[8.5px] 2xl:text-[10px] text-neutral-500 uppercase tracking-wider lg:tracking-tight xl:tracking-normal 2xl:tracking-wider whitespace-nowrap shrink-0">CAUSAL DECOMP (ε)</span>
        <span className="font-mono text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] 2xl:text-xs text-white font-bold shrink-0">{decomp.totalLapTime.toFixed(3)}s</span>
      </div>

      <div className="flex flex-col gap-1 text-[8.5px] xs:text-[9px] lg:text-[8px] xl:text-[9px] 2xl:text-[10px] font-mono leading-tight">
        {/* Expected Stint wear */}
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <span className="text-neutral-400 shrink-0">Tyre Decay:</span>
          <span className="text-white shrink-0">+{decomp.tyreBasePenalty.toFixed(3)}s</span>
        </div>

        {/* Fuel load */}
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <span className="text-neutral-400 shrink-0">Fuel ({fuelWeight.toFixed(1)}kg):</span>
          <span className="text-white shrink-0">+{decomp.fuelLoadPenalty.toFixed(3)}s</span>
        </div>

        {/* Air state */}
        {/* LEARN: a positive penalty (slower) shows red; a negative one (a gain
            from a tow/DRS) shows green. The `>= 0 ? '+' : ''` just adds a plus
            sign so positive numbers read like "+0.650s". */}
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <span className="text-neutral-400 shrink-0">Air Penalty:</span>
          <span className={cn(decomp.airPenalty > 0 ? "text-viz-mac-red shrink-0" : "text-emerald-400 shrink-0")}>
            {decomp.airPenalty >= 0 ? '+' : ''}{decomp.airPenalty.toFixed(3)}s
          </span>
        </div>

        {/* Thermal Hysteresis */}
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <span className="text-neutral-400 shrink-0">Thermal Hyst:</span>
          <span className="text-white shrink-0">+{decomp.thermalHysteresis.toFixed(3)}s</span>
        </div>

        {/* Isolated Driver Skill */}
        <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-0.5 gap-2 whitespace-nowrap">
          <span className="text-viz-mac-red font-black uppercase flex items-center gap-1 shrink-0">
            <Award size={9} className="shrink-0" /> Driver Coeff ε:
          </span>
          <span className="text-emerald-400 font-bold shrink-0">{decomp.driverSkill.toFixed(3)}s</span>
        </div>
      </div>
    </motion.div>
  );
}
