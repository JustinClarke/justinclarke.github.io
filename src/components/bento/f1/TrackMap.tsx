/**
 * TrackMap the left, larger half of the F1 card: the circuit drawn as an SVG,
 * a glowing dot that laps it, sector/air-state badges, the StatusBar overlay, and
 * the Monaco/Spa/Monza selector buttons.
 *
 * Fits in: rendered by F1TelemetryWidget; gets the track shape + live state it
 *          needs as props. It owns no state picking a track calls setActiveTrack.
 * Note:    the moving dot is pure SVG (<animateMotion>), not React the browser
 *          animates it along the path string, which is cheaper than re-rendering.
 *
 * For beginners ----------------------------------------------------------------
 * SVG is "drawing with markup": a <path d="..."> is a shape described by a string
 * of coordinates. Here the same path is drawn twice (a faint base + a bright
 * gradient), and <animateMotion> slides a <circle> along it forever. cn() picks
 * badge colours from the live sector/air state.
 * -----------------------------------------------------------------------------
 */
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/utils';
import type { F1Telemetry } from '@/hooks/useF1Telemetry';
import { StatusBar } from './StatusBar';

type TrackMapProps = Pick<
  F1Telemetry,
  | 'activeSector' | 'airState' | 'isCliffRisk'
  | 'getTrackViewBox' | 'getTrackPath'
  | 'activeTrack' | 'isPlaying' | 'setActiveTrack'
  | 'thermalSurface' | 'thermalBulk'
>;

export function TrackMap({
  activeSector, airState, isCliffRisk,
  getTrackViewBox, getTrackPath,
  activeTrack, isPlaying, setActiveTrack,
  thermalSurface, thermalBulk,
}: TrackMapProps) {
  return (
    <div className="md:col-span-3 flex flex-col justify-between bg-black/40 border border-[rgba(255,255,255,0.05)] rounded-2xl p-2.5 lg:p-3 relative overflow-hidden min-h-0">

      {/* Active Sector / Air State Overlay Badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 shrink-0">
        <span className={cn(
          "font-mono text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded uppercase border",
          activeSector === 'S1' ? "bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-blue-400" : activeSector === 'S2' ? "bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.3)] text-purple-400" :
              "bg-[rgba(20,184,166,0.1)] border-[rgba(20,184,166,0.3)] text-teal-400"
        )}>
          Sector {activeSector}
        </span>

        <span className={cn(
          "font-mono text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded uppercase border",
          airState === 'DIRTY' ? "bg-[rgba(225,6,0,0.1)] border-[rgba(225,6,0,0.3)] text-viz-mac-red animate-pulse" : airState === 'TOW' ? "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)] text-amber-400" : airState === 'DRS' ? "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-emerald-400" :
                "bg-white/5 border-[rgba(255,255,255,0.1)] text-neutral-400"
        )}>
          {airState === 'DIRTY' ? 'Dirty Air (+22% Wear)' : airState === 'TOW' ? 'Tow Zone (-0.35s)' : airState === 'DRS' ? 'DRS Train (-0.2s)' : 'Free Air'}
        </span>

        {isCliffRisk && (
          <span className="font-mono text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-amber-400 animate-pulse flex items-center gap-1">
            <ShieldAlert size={8} /> CLIFF RISK
          </span>
        )}
      </div>

      {/* Track Map SVG */}
      <div className="relative w-full flex-grow flex items-center justify-center min-h-[220px] md:min-h-[280px] mt-3">
        <svg className="w-full h-full max-h-[260px] md:max-h-[320px] p-1" viewBox={getTrackViewBox()}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="2" />
            </pattern>
            <linearGradient id="track-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-acc-creative)" stopOpacity="0.95" /> {/* S1 Pink */}
              <stop offset="50%" stopColor="var(--color-acc-bi)" stopOpacity="1.0" /> {/* S2 Purple */}
              <stop offset="100%" stopColor="var(--color-viz-warning)" stopOpacity="0.95" /> {/* S3 Golden Amber */}
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Static track layout */}
          <path
            d={getTrackPath()}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic telemetry path */}
          {/* LEARN: keyed on activeTrack, so switching circuits remounts this path
              and replays its fade-in. It's the bright gradient stroke on top of
              the faint base path above. */}
          <motion.path
            key={activeTrack}
            d={getTrackPath()}
            fill="none"
            stroke="url(#track-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Dynamic racing dot */}
          {/* LEARN: shown only while playing (`isPlaying && ...`). The <circle> is
              the car; <animateMotion> below moves it along the track path on a
              loop. `dur` sets the lap time per circuit; the browser does the
              animating, so React isn't involved frame-by-frame. */}
          {isPlaying && (
            <circle
              key={`dot-${activeTrack}`}
              r="8"
              fill={isCliffRisk ? "var(--color-amber)" : "var(--color-viz-mac-red)"}
              filter={isCliffRisk ? "drop-shadow(0 0 10px var(--color-amber))" : "drop-shadow(0 0 10px var(--color-viz-mac-red))"}
            >
              <animateMotion
                dur={`${activeTrack === 'Monaco' ? 9 : activeTrack === 'Spa' ? 12 : 8}s`}
                repeatCount="indefinite"
                path={getTrackPath()}
                rotate="auto"
              />
            </circle>
          )}
        </svg>

        {/* Combined Sector & Thermal Status Bar */}
        <StatusBar activeSector={activeSector} thermalSurface={thermalSurface} thermalBulk={thermalBulk} />

      </div>

      {/* Circuit Selector Buttons (Bottom Row) */}
      <div className="flex gap-2.5 pt-2.5 border-t border-[rgba(255,255,255,0.05)] shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Track Select */}
        {/* LEARN: `as const` makes this a fixed tuple of those exact strings, which
            is why setActiveTrack accepts each one. .map renders a button per track;
            stopPropagation keeps the tap from also clicking the whole card. */}
        <div className="flex gap-1.5 w-full">
          {(['Monaco', 'Spa', 'Monza'] as const).map(track => (
            <button
              key={track}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTrack(track);
              }}
              className={cn(
                "flex-1 font-mono text-[10px] md:text-xs py-1 rounded border tracking-wider transition-all",
                activeTrack === track
                  ? "bg-white/10 border-[rgba(255,255,255,0.2)] text-white font-bold"
                  : "bg-white/5 border-[rgba(255,255,255,0.1)] text-neutral-400 hover:text-neutral-200"
              )}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
