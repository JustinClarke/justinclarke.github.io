/**
 * HudHeader the title strip atop the F1 telemetry card: the "OFF THE PACE"
 * heading, a live status pill (lap counter, or "paused"), and the tyre age.
 *
 * Fits in: rendered by F1TelemetryWidget, which passes the four fields shown here.
 * Note:    purely presentational no state, no timers. It only reflects its props.
 *
 * For beginners ----------------------------------------------------------------
 * A component is a function that takes `props` (data from its parent) and returns
 * markup. `Pick<F1Telemetry, ...>` says "this component's props are exactly these
 * named fields of the telemetry hook's output" so if the hook changes, the prop
 * types update automatically and TypeScript flags any mismatch.
 * -----------------------------------------------------------------------------
 */
import { cn } from '@/utils';
import type { F1Telemetry } from '@/hooks/useF1Telemetry';

type HudHeaderProps = Pick<F1Telemetry, 'isPlaying' | 'isCliffRisk' | 'currentLap' | 'tyreAge'>;

// LEARN: `{ isPlaying, ... }` in the parameter list is destructuring it unpacks
//    the named props straight into local variables to use in the JSX below.
export function HudHeader({ isPlaying, isCliffRisk, currentLap, tyreAge }: HudHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-white/5 pb-2 shrink-0 gap-3">
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {/* LEARN: cn() builds the class string. The nested ternaries pick the
              pulsing dot's colour: amber if tyres are at cliff risk, teal while
              running normally, grey when paused. */}
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              isPlaying ? (isCliffRisk ? "bg-amber-500" : "bg-teal-500") : "bg-neutral-500"
            )} />
            <span className={cn(
              "relative inline-flex rounded-full h-2.5 w-2.5",
              isPlaying ? (isCliffRisk ? "bg-amber-500" : "bg-teal-500") : "bg-neutral-500"
            )} />
          </span>
          {/* Official F1 logo */}
          <span className="shrink-0 transform -skew-x-12 inline-flex items-center">
            <img src="/assets/f1.svg" alt="Formula 1" className="h-[13px] sm:h-[15px] w-auto" />
          </span>
          <h3 className="font-noto text-base xs:text-lg sm:text-xl font-black italic tracking-tight text-white uppercase leading-none">
            OFF THE PACE
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-0.5">
          <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 tracking-widest uppercase font-bold">
            // CAUSAL DECOMPOSITION
          </span>
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] leading-none select-none">
            <span className={cn("px-1.5 py-0.5 rounded bg-white/5 font-semibold", isCliffRisk ? "text-amber-500" : "text-viz-mac-red")}>
              {isPlaying ? `INGESTING • LAP ${currentLap}/57` : 'PIPELINE PAUSED'}
            </span>
            <span className="text-neutral-500 font-bold bg-white/5 px-1.5 py-0.5 rounded uppercase">Age: {tyreAge} Laps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
