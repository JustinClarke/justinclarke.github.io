/**
 * StatusBar the frosted overlay pinned to the bottom of the track map: per-sector
 * times (the live sector pulses) and the two tyre temperatures.
 *
 * Fits in: rendered inside TrackMap, positioned absolutely over the SVG.
 * Note:    purely presentational; it only highlights/colours based on its props.
 */
import { Thermometer } from 'lucide-react';
import { cn } from '@/utils';
import type { F1Telemetry } from '../useF1Telemetry';

type StatusBarProps = Pick<F1Telemetry, 'activeSector' | 'thermalSurface' | 'thermalBulk'>;

export function StatusBar({ activeSector, thermalSurface, thermalBulk }: StatusBarProps) {
  return (
    <div className="absolute bottom-1.5 left-2 right-2 flex flex-col gap-1.5 items-center justify-center font-mono bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.05)] select-none leading-none z-10">
      {/* Row 1: Sectors */}
      <div className="flex gap-2 items-center justify-center text-micro">
        <div className="flex items-center">
          <span className="text-neutral-500 font-bold uppercase text-micro mr-1">S1</span>
          <span className={cn("font-bold", activeSector === 'S1' ? "text-blue-400 animate-pulse" : "text-text-secondary")}>28.4s</span>
        </div>
        <span className="text-text-muted text-micro">•</span>
        <div className="flex items-center">
          <span className="text-neutral-500 font-bold uppercase text-micro mr-1">S2</span>
          <span className={cn("font-bold", activeSector === 'S2' ? "text-purple-400 animate-pulse" : "text-text-secondary")}>36.1s</span>
        </div>
        <span className="text-text-muted text-micro">•</span>
        <div className="flex items-center">
          <span className="text-neutral-500 font-bold uppercase text-micro mr-1">S3</span>
          <span className={cn("font-bold", activeSector === 'S3' ? "text-emerald-400 animate-pulse" : "text-text-secondary")}>20.8s</span>
        </div>
      </div>

      {/* Row 2: Thermal Metrics */}
      <div className="flex gap-2.5 items-center justify-center text-micro md:text-micro">
        {/* Temperature turns red past the danger threshold (> 110). */}
        <div className="flex items-center gap-1">
          <Thermometer size={10} className="text-neutral-500 shrink-0" />
          <span className="text-neutral-500 font-bold uppercase text-micro">Surf:</span>
          <span className={cn("font-bold", thermalSurface > 110 ? "text-viz-mac-red" : "text-neutral-300")}>{thermalSurface}°C</span>
        </div>
        <span className="text-text-muted text-micro">•</span>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500 font-bold uppercase text-micro">Bulk:</span>
          <span className={cn("font-bold", thermalBulk > 105 ? "text-viz-mac-red" : "text-neutral-300")}>{thermalBulk}°C</span>
        </div>
      </div>
    </div>
  );
}
