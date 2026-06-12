/**
 * CapabilityGridSection a 6-card grid summarising the engine's headline
 * capabilities (ghost car, overtake graph, tyre cliff, etc.), each with its own
 * hover-glow colour and source-table footnote.
 *
 * Fits in: a standalone band on the Off The Pace pages.
 * Note:    CapCard is a small private sub-component declared in this same file
 *          because it is only ever used here.
 *
 * For beginners ----------------------------------------------------------------
 * `glowColor` is passed in as a prop and dropped into an inline `style` because
 * it differs per card (a JS-driven value, so inline style is correct here). The
 * radial-gradient only shows on hover via the `group`/`group-hover` Tailwind
 * pattern: the parent has `group`, children react to its hover with `group-hover:`.
 * -----------------------------------------------------------------------------
 */
import React from 'react';

interface CapCardProps {
  icon: string;
  title: string;
  desc: string;
  meta: string;
  glowColor: string;
}

const CapCard: React.FC<CapCardProps> = ({ icon, title, desc, meta, glowColor }) => (
  <div className="bg-graphite-850 border border-white/5 rounded-xl p-6 hover:bg-graphite-800 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle at top right, ${glowColor}, transparent 50%)` }}
    />

    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-lg mb-4 select-none">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-white/95 uppercase tracking-wide mb-2">
      {title}
    </h4>
    <p className="font-jetbrains text-[11px] text-white/55 leading-relaxed mb-4">
      {desc}
    </p>
    <div className="font-jetbrains text-[9px] text-white/35 tracking-wider mt-auto select-all">
      {meta}
    </div>
  </div>
);

export const CapabilityGridSection: React.FC = () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CapCard
            icon="🏎"
            title="Ghost Car Simulator"
            desc="Counterfactual lap reconstruction - what would HAM have lapped in a Ferrari? Recombines ego driver skill with host constructor pace. Self-consistency gate - ego == host → predicted == actual."
            meta="fct_ghost_car_pace • fct_ghost_race_finish"
            glowColor="rgba(225,6,0,0.1)"
          />
          <CapCard
            icon="📡"
            title="Overtake Graph"
            desc="Telemetry-confirmed on-track pass detection via driver_ahead_id swaps. Distinguishes on-track passes from pit-cycle gains, SC restarts, and lapping traffic. Resolves to pass location and DRS state."
            meta="int_overtakes • fct_racecraft"
            glowColor="rgba(59,130,246,0.1)"
          />
          <CapCard
            icon="🧮"
            title="Tyre Cliff Predictor"
            desc="Multi-horizon XGBoost target - next_lap_degradation_jump_s, 3-lap and 5-lap cumulative jumps. Features include push load, dirty air thermal load, cumulative thermal surface/bulk indices, and powertrain signature."
            meta="fct_cliff_prediction_features • XGBoost (built)"
            glowColor="rgba(16,185,129,0.1)"
          />
          <CapCard
            icon="⚙"
            title="Powertrain Fingerprint"
            desc="Per-lap driving style signature from raw 10Hz telemetry - gear change count, mean/max RPM, full-throttle percentage, DRS activation share, and short-shift index (early upshifts as energy proxy)."
            meta="int_lap_powertrain_signature"
            glowColor="rgba(245,158,11,0.1)"
          />
          <CapCard
            icon="🎯"
            title="Pit Strategy Value"
            desc="Opportunity cost model for pit decisions. Classifies each pit call as optimal, overran, undercut_forced, or early. Drives tyre_management_score in fct_stint_features."
            meta="int_pit_strategy_value • fct_stint_features"
            glowColor="rgba(139,92,246,0.1)"
          />
          <CapCard
            icon="📋"
            title="Race Control Integration"
            desc="Race control messages parsed via regex into SC/VSC windows, red flag laps, penalties, investigations. Replaces coarse TrackStatus digit-string inference with precise lap-level neutralisation windows."
            meta="stg_race_control • int_race_control_events"
            glowColor="rgba(236,72,153,0.1)"
          />
        </div>
      </div>
    </div>
  );
};
