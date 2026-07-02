/**
 * HudHeader the title strip atop the F1 telemetry card: the "OFF THE PACE"
 * wordmark, a live "LAP n" readout that proves the card is a running sim, a
 * plain-English one-liner so a non-technical recruiter instantly gets what the
 * project is, and a "open the live engine" cue that invites the click through.
 *
 * Fits in: rendered by F1TelemetryWidget, which passes the three fields shown here.
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

type HudHeaderProps = Pick<F1Telemetry, 'isPlaying' | 'isCliffRisk' | 'currentLap'>;

// LEARN: `{ isPlaying, ... }` in the parameter list is destructuring it unpacks
//    the named props straight into local variables to use in the JSX below.
export function HudHeader({ isPlaying, isCliffRisk, currentLap }: HudHeaderProps) {
  return (
    <div className="flex flex-col gap-2.5 pb-1 shrink-0">
      {/* Row 1 — wordmark + a LIVE lap readout. The moving lap number and pulsing
          dot signal "this is a running sim you can play with", not a screenshot. */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
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
          <h3 className="font-noto text-base xs:text-lg sm:text-xl font-black italic tracking-tight text-white uppercase leading-none truncate">
            OFF THE PACE
          </h3>
        </div>
      </div>

      {/* Row 2 — plain-English "what this is" in its own frosted callout strip.
          The left accent border and glass background make it unmissable to a
          recruiter scanning the card, while the slightly larger text ensures
          readability. Sits visually between the bold title and the tech pipeline. */}
      <div className="relative rounded-lg border border-[rgba(255,255,255,0.05)] bg-white/[0.03] backdrop-blur-sm px-3 py-2">
        <p className="text-[11px] sm:text-[12.5px] leading-relaxed text-neutral-300">
          Production-style <span className="font-semibold text-white">analytics pipeline</span> transforming <span className="font-semibold text-white">raw telemetry</span> into <span className="font-semibold text-dbt">curated datasets</span> and <span className="font-semibold text-purple-400">ML insights</span>.
        </p>
      </div>
    </div>
  );
}
