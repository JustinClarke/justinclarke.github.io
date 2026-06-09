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
import { Zap, Play, Pause, RefreshCw } from 'lucide-react';
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
>;

export function ControlsBar({
  isPlaying, setIsPlaying,
  uiMode, setUiMode,
  selectedCompound, setSelectedCompound,
  setTyreAge, setCurrentLap, setFuelWeight,
}: ControlsBarProps) {
  return (
    <div className="hidden sm:flex items-center justify-between py-1.5 px-3 bg-white/[0.02] border border-white/5 rounded-xl shrink-0 gap-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <Zap size={11} className="text-viz-mac-red animate-pulse" />
        <span className="font-mono text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-wider uppercase">Interactive Control Deck</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Main Mode Toggles */}
        <div className="bg-neutral-950 border border-white/5 p-0.5 rounded-lg flex shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUiMode('telemetry');
            }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'telemetry' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
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
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'causal' ? "bg-viz-mac-red/15 border border-viz-mac-red/30 text-viz-mac-red" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Causal
          </button>
        </div>


        {/* LEARN: play/pause. `!isPlaying` flips the boolean; the icon shown also
            depends on isPlaying one piece of state driving two visuals. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="p-1 rounded bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors shrink-0"
        >
          {isPlaying ? <Pause size={10} /> : <Play size={10} />}
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
          className="p-1 rounded bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors shrink-0"
        >
          <RefreshCw size={10} className={cn(isPlaying && "animate-spin-slow")} />
        </button>
      </div>
    </div>
  );
}
