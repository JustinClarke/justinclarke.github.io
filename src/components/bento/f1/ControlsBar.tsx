/**
 * ControlsBar the interactive deck for the F1 telemetry card: Telemetry/Causal
 * panel toggle, a play/pause button, and a reset button that restores a fresh run.
 *
 * Fits in: rendered by F1TelemetryWidget. It owns no state it just calls the
 *          setter functions handed down from the useF1Telemetry hook.
 * Note:    every button calls e.stopPropagation() so a control press never also
 *          triggers the bento card's own click (which would navigate away).
 *
 * For beginners ----------------------------------------------------------------
 * State lives in the hook; this component receives both the values (like
 * isPlaying) AND the functions that change them (like setIsPlaying) as props.
 * Clicking a button calls one of those setters, which updates the hook's state
 * and re-renders the card. This is "lifting state up": children ask the parent
 * to change shared data rather than holding their own copy.
 * -----------------------------------------------------------------------------
 */
import { Play, Pause, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';
import type { F1Telemetry } from '@/hooks/useF1Telemetry';

// LEARN: Pick<> narrows the giant hook type down to just the values + setters this
//    bar needs, so its props stay in lock-step with the hook automatically.
type ControlsBarProps = Pick<
  F1Telemetry,
  | 'isPlaying' | 'setIsPlaying'
  | 'uiMode' | 'setUiMode'
  | 'selectedCompound' | 'setSelectedCompound'
  | 'setTyreAge' | 'setCurrentLap' | 'setFuelWeight'
  | 'isCliffRisk' | 'currentLap' | 'tyreAge'
>;

export function ControlsBar({
  isPlaying, setIsPlaying,
  uiMode, setUiMode,
  selectedCompound, setSelectedCompound,
  setTyreAge, setCurrentLap, setFuelWeight,
  isCliffRisk, currentLap, tyreAge,
}: ControlsBarProps) {
  // Lap progress as a percentage for the visual bar
  const lapProgress = Math.round((currentLap / 57) * 100);

  return (
    <div className="hidden sm:flex flex-col p-2.5 md:p-3 bg-bento-panel border border-[rgba(255,255,255,0.1)] rounded-2xl shrink-0 w-full gap-2.5" onClick={(e) => e.stopPropagation()}>

      {/* ── Top row: lap counter + progress bar + transport controls ── */}
      <div className="flex items-center justify-between gap-4 select-none">
        {/* Lap counter + progress bar */}
        <div className="flex-1 flex items-center gap-3">
          <span className="font-mono text-[9px] md:text-[10px] text-neutral-500 leading-none uppercase tracking-wider shrink-0">
            LAP <span className="text-white font-bold">{currentLap}</span><span className="text-neutral-600">/57</span>
          </span>
          {/* Lap progress bar */}
          <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isCliffRisk
                  ? "bg-gradient-to-r from-amber-500/80 to-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
                  : "bg-gradient-to-r from-viz-mac-red/70 to-viz-mac-red shadow-[0_0_6px_rgba(225,6,0,0.3)]"
              )}
              style={{ width: `${lapProgress}%` }}
            />
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* LEARN: play/pause. `!isPlaying` flips the boolean; the icon shown also
              depends on isPlaying one piece of state driving two visuals. */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className={cn(
              "p-1.5 rounded-md border transition-all duration-200 shrink-0",
              isPlaying
                ? "bg-viz-mac-red/10 border-[rgba(225,6,0,0.25)] text-viz-mac-red hover:bg-viz-mac-red/20"
                : "bg-white/5 border-[rgba(255,255,255,0.1)] text-neutral-400 hover:text-white hover:bg-white/10"
            )}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
          </button>

          {/* LEARN: reset calls several setters at once to put the simulation back
              to a clean opening state (soft tyres, lap 1, full fuel). */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCompound('soft');
              setTyreAge(0);
              setCurrentLap(1);
              setFuelWeight(100.4);
            }}
            className="p-1.5 rounded-md bg-white/5 border border-[rgba(255,255,255,0.1)] text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200 shrink-0"
          >
            <RefreshCw size={11} className={cn(isPlaying && "animate-spin-slow")} />
          </button>
        </div>
      </div>

      {/* ── Bottom row: mode switch ── */}
      <div className="flex items-center justify-start">
        {/* Mode toggle — segmented control */}
        <div className="bg-neutral-950/80 border border-[rgba(255,255,255,0.06)] p-[3px] rounded-lg flex shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUiMode('telemetry');
            }}
            className={cn(
              "relative px-2 sm:px-2.5 py-[3px] rounded-[5px] font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all duration-200",
              uiMode === 'telemetry'
                ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Telemetry
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUiMode('causal');
            }}
            className={cn(
              "relative px-2 sm:px-2.5 py-[3px] rounded-[5px] font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all duration-200",
              uiMode === 'causal'
                ? "bg-viz-mac-red/12 border border-[rgba(225,6,0,0.25)] text-viz-mac-red shadow-[0_0_10px_rgba(225,6,0,0.08)]"
                : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Causal
          </button>
        </div>
      </div>
    </div>
  );
}
