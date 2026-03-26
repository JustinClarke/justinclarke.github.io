import React, { useState } from 'react';

interface ScienceSectionProps {
  id: string;
}

interface TermDetail {
  title: string;
  desc: string;
  formula: string;
  mathSymbol: string;
}

const DETAILS: Record<string, TermDetail> = {
  fuel: {
    title: 'θ_fuel : Fuel Mass Penalty',
    mathSymbol: 'θ_fuel · F_i',
    formula: 'fuel_mass_kg * fuel_mass_coefficient_s',
    desc: 'Linear fuel weight model. A full tank (110 kg) adds ~3.0s at race start. We compute fuel_mass_kg per lap using circuit length from dim_circuits and a calibrated burn rate, then multiply by a fitted lap-time coefficient. Isolated via within-driver-stint variation orthogonal to tyre state.',
  },
  compound: {
    title: 'θ_compound : KM Tyre Cliff Model',
    mathSymbol: 'θ_compound(age_i)',
    formula: 'non_linear_degradation_cliff_s',
    desc: 'A non-linear compound degradation curve fitted to historical stints. Captures the "cliff"  - the abrupt pace drop when a tyre crosses its thermal and structural threshold. Parameters - compound_cliff_onset_laps, compound_cliff_severity, compound_grip_peak. Multi-horizon ML targets ship with the feature mart (next_lap_degradation_jump_s, next_3_lap, next_5_lap).',
  },
  rubber: {
    title: 'θ_rubber : Track Surface Evolution',
    mathSymbol: 'θ_rubber · R_i',
    formula: 'track_surface_rubber_effect_s',
    desc: 'Rubber laid by the field across the session increases grip across the race. Estimated as a session-level exponential smoothing curve (int_track_evolution) using field lap times, then partitioned from individual driver variation.',
  },
  ambient: {
    title: 'θ_ambient : Weather & Air Density',
    mathSymbol: 'θ_ambient · W_i',
    formula: 'ambient_temperature_effect_s',
    desc: 'Ambient temperature, track temperature, humidity, and barometric pressure (pressure_hpa) all affect PU output and tyre behaviour. Estimated as a linear additive weather component using stg_weather joined at lap level via session time.',
  },
  car: {
    title: 'θ_car : Constructor Structural Pace',
    mathSymbol: 'θ_car · V_i',
    formula: 'constructor_structural_pace_gap_s',
    desc: "The within-race car performance gap between teams, isolated from tyre state and traffic. Estimated using a synthetic teammate panel - for each driver, we compare against their own team partner's clean laps on the same stint lap, same compound. Produces power-sector and aero-sector pace indices with confidence bands via int_constructor_structural_pace.",
  },
  air: {
    title: 'θ̂_air : Dirty Air Tax (Causal OLS with Lagged Instrument)',
    mathSymbol: 'θ̂_air · A_i−1',
    formula: 'dirty_air_share_lag1 * dirty_air_coefficient_s',
    desc: 'The pace cost of following another car in turbulent air. Confounders abound - a driver trailing closely is often faster (DRS boost) or slower (aero degradation) at the same time. We use a 1-lap lag instrument  - dirty air share from the previous lap  - to ensure causal ordering. Lapping-traffic laps are excluded from the calibration panel to prevent bias. Global θ̂_air estimated via SQL OLS: COVAR_POP(residual, air_lag1) / VAR_POP(air_lag1). Bounded [0, 5.0s] per lap.',
  },
  skill: {
    title: 'ε_i : Driver Skill Residual',
    mathSymbol: 'ε_i (driver)',
    formula: 'lap_time_residual_skill_s',
    desc: 'The unexplained remainder after every measurable physical factor is removed. This is the driver signal. Negative = faster than the model predicts. Aggregated at race grain in fct_driver_skill_features with synthetic-teammate deltas, strategic divergence share, and constructor confidence scores for the ML driver ranking model.',
  },
};

const TERM_KEYS = ['fuel', 'compound', 'rubber', 'ambient', 'car', 'air', 'skill'] as const;
type TermKey = typeof TERM_KEYS[number];

const TERM_LABELS: Record<TermKey, React.ReactNode> = {
  fuel:     <span>θ<sub>fuel</sub> · F<sub>i</sub></span>,
  compound: <span>θ<sub>compound</sub>(age<sub>i</sub>)</span>,
  rubber:   <span>θ<sub>rubber</sub> · R<sub>i</sub></span>,
  ambient:  <span>θ<sub>ambient</sub> · W<sub>i</sub></span>,
  car:      <span>θ<sub>car</sub> · V<sub>i</sub></span>,
  air:      <span>θ̂<sub>air</sub> · A<sub>i−1</sub></span>,
  skill:    <span>ε<sub>i</sub> <span className="text-[10px] opacity-70">(driver)</span></span>,
};

const TelemetryChart: React.FC<{ term: TermKey }> = ({ term }) => {
  return (
    <svg
      key={term}
      viewBox="0 0 400 220"
      className="w-full h-full max-h-[190px]"
    >
      <defs>
        <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-f1-red)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-f1-red)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-f1-red)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-f1-red)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rubberGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-viz-success)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-viz-success)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-viz-info)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-viz-info)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="airGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-viz-warning)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-viz-warning)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-f1-red)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-f1-red)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3,3">
        <line x1="40" y1="40" x2="360" y2="40" />
        <line x1="40" y1="85" x2="360" y2="85" />
        <line x1="40" y1="130" x2="360" y2="130" />
        <line x1="40" y1="175" x2="360" y2="175" />
        
        <line x1="40" y1="40" x2="40" y2="175" />
        <line x1="120" y1="40" x2="120" y2="175" />
        <line x1="200" y1="40" x2="200" y2="175" />
        <line x1="280" y1="40" x2="280" y2="175" />
        <line x1="360" y1="40" x2="360" y2="175" />
      </g>

      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPath 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        .animate-pulse-dot {
          transform-origin: center;
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes flowWake {
          to { stroke-dashoffset: -20; }
        }
        .animate-wake {
          stroke-dasharray: 4, 4;
          animation: flowWake 1.2s linear infinite;
        }
      `}</style>

      {term === 'fuel' && (
        <>
          {/* Shaded Area */}
          <path d="M 40 40 L 360 175 L 360 175 L 40 175 Z" fill="url(#fuelGrad)" />
          {/* Plot Line */}
          <path
            d="M 40 40 L 360 175"
            stroke="var(--color-f1-red)"
            strokeWidth="2.5"
            fill="none"
            className="animate-draw"
          />
          {/* Current lap dot */}
          <circle cx="200" cy="107.5" r="4" fill="var(--color-f1-red)" className="animate-pulse-dot" />
          
          {/* Labels */}
          <text x="35" y="44" className="font-jetbrains text-[8px] fill-white/40 text-end">+3.3s</text>
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">0.0s</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">110kg (Start)</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">0kg (End)</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">FUEL LOAD vs LAP TIME PENALTY</text>
        </>
      )}

      {term === 'compound' && (
        <>
          {/* Shaded Area */}
          <path d="M 40 175 Q 160 175 220 150 T 300 70 T 360 30 L 360 175 Z" fill="url(#compoundGrad)" />
          {/* Plot Line */}
          <path
            d="M 40 175 Q 160 175 220 150 T 300 70 T 360 30"
            stroke="var(--color-f1-red)"
            strokeWidth="2.5"
            fill="none"
            className="animate-draw"
          />
          {/* Cliff threshold vertical line */}
          <line x1="270" y1="40" x2="270" y2="175" stroke="var(--color-f1-red)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
          <text x="275" y="55" className="font-jetbrains text-[8px] fill-f1-red font-bold">TYRE CLIFF</text>
          
          {/* Labels */}
          <text x="35" y="34" className="font-jetbrains text-[8px] fill-white/40 text-end">+4.5s</text>
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">0.0s</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">L0 (New)</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">L40 (Cliffed)</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">TYRE AGE vs PACE LOSS (CLIFF PROFILE)</text>
        </>
      )}

      {term === 'rubber' && (
        <>
          {/* Shaded Area */}
          <path d="M 40 40 Q 120 135 360 155 L 360 40 Z" fill="url(#rubberGrad)" />
          {/* Plot Line */}
          <path
            d="M 40 40 Q 120 135 360 155"
            stroke="var(--color-viz-success)"
            strokeWidth="2.5"
            fill="none"
            className="animate-draw"
          />
          {/* Labels */}
          <text x="35" y="44" className="font-jetbrains text-[8px] fill-white/40 text-end">0.0s</text>
          <text x="35" y="159" className="font-jetbrains text-[8px] fill-white/40 text-end">-1.2s</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">Session Start</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">Session End</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">TRACK RUBBER EVOLUTION (GRIP GAIN)</text>
        </>
      )}

      {term === 'ambient' && (
        <>
          {/* Thermal / Density Waveforms */}
          {/* Temp wave (Red) */}
          <path
            d="M 40 120 C 100 80, 160 160, 220 70 C 280 140, 320 90, 360 110"
            stroke="var(--color-f1-red)"
            strokeWidth="2"
            fill="none"
            className="animate-draw"
          />
          {/* Air density inverse wave (Blue) */}
          <path
            d="M 40 95 C 100 135, 160 55, 220 145 C 280 75, 320 125, 360 105"
            stroke="var(--color-viz-info)"
            strokeWidth="2"
            fill="none"
            className="animate-draw"
          />
          <text x="225" y="60" className="font-jetbrains text-[8px] fill-f1-red font-bold">TEMP</text>
          <text x="225" y="160" className="font-jetbrains text-[8px] fill-viz-info font-bold">AIR DENSITY</text>
          
          {/* Labels */}
          <text x="35" y="44" className="font-jetbrains text-[8px] fill-white/40 text-end">Max</text>
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">Min</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">Race Start</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">Finish</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">WEATHER VARIABLES & THERMAL EFFICIENCY</text>
        </>
      )}

      {term === 'car' && (
        <>
          {/* Teammate Panel */}
          {/* Driver A (fast stint) */}
          <path
            d="M 40 130 Q 160 145 360 170"
            stroke="var(--color-viz-info)"
            strokeWidth="2"
            fill="none"
            id="driverA"
            className="animate-draw"
          />
          {/* Driver B (teammate, slower) */}
          <path
            d="M 40 100 Q 160 115 360 140"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeDasharray="4,4"
            fill="none"
            id="driverB"
            className="animate-draw"
          />
          {/* Shaded delta gap */}
          <path
            d="M 40 130 Q 160 145 360 170 L 360 140 Q 160 115 40 100 Z"
            fill="url(#carGrad)"
            opacity="0.6"
          />
          {/* Arrow indicating delta */}
          <line x1="200" y1="118" x2="200" y2="133" stroke="var(--color-viz-info)" strokeWidth="1.5" />
          <polygon points="200,136 197,131 203,131" fill="var(--color-viz-info)" />
          <polygon points="200,115 197,120 203,120" fill="var(--color-viz-info)" />
          
          <text x="208" y="130" className="font-jetbrains text-[8px] fill-viz-info font-bold">PACE DELTA</text>

          {/* Labels */}
          <text x="35" y="90" className="font-jetbrains text-[8px] fill-white/40 text-end">Faster</text>
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">Slower</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">Stint Lap 0</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">Stint Lap 20</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">TEAMMATE PANEL CONSTRUCTOR PACE DELTA</text>
        </>
      )}

      {term === 'air' && (
        <>
          {/* Dirty Air Wake schematic */}
          {/* Lead car */}
          <rect x="50" y="55" width="22" height="12" rx="2" fill="white" opacity="0.9" />
          <text x="61" y="64" className="font-jetbrains text-[8px] fill-black font-extrabold text-center" textAnchor="middle">CAR1</text>
          
          {/* Turbulent wake lines */}
          <g stroke="var(--color-f1-red)" strokeWidth="1.5" fill="none" opacity="0.65">
            <path d="M 72 61 Q 120 45 170 58 T 270 65" className="animate-wake" />
            <path d="M 72 61 Q 120 77 170 64 T 270 57" className="animate-wake" />
            <path d="M 72 61 Q 140 61 210 61 T 270 61" className="animate-wake" />
          </g>

          {/* Following car */}
          <rect x="220" y="55" width="22" height="12" rx="2" fill="var(--color-f1-red)" />
          <text x="231" y="64" className="font-jetbrains text-[8px] fill-white font-extrabold text-center" textAnchor="middle">CAR2</text>
          
          {/* Wake Force vs Gap Plot */}
          <path d="M 100 130 Q 180 180 340 180" stroke="var(--color-viz-warning)" strokeWidth="2" fill="none" className="animate-draw" />
          <path d="M 100 130 Q 180 180 340 180 L 340 180 L 100 180 Z" fill="url(#airGrad)" />

          {/* Labels */}
          <text x="35" y="134" className="font-jetbrains text-[8px] fill-white/40 text-end">+1.8s</text>
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">0.0s</text>
          <text x="100" y="192" className="font-jetbrains text-[8px] fill-white/40">0.5s Gap</text>
          <text x="340" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">3.0s Gap</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">WAKE DYNAMICS & DISTANCE-BASED TAX</text>
        </>
      )}

      {term === 'skill' && (
        <>
          {/* Bell curve (Driver Skill distribution) */}
          <path d="M 60 175 C 120 175, 150 50, 200 50 C 250 50, 280 175, 340 175 Z" fill="rgba(255,255,255,0.02)" />
          {/* Shaded faster tail (left side) */}
          <path d="M 60 175 C 120 175, 150 50, 200 50 L 200 175 Z" fill="url(#skillGrad)" />
          
          {/* Distribution Path */}
          <path
            d="M 60 175 C 120 175, 150 50, 200 50 C 250 50, 280 175, 340 175"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            fill="none"
            className="animate-draw"
          />

          {/* Highlight indicator (Driver offset) */}
          <line x1="140" y1="100" x2="140" y2="175" stroke="var(--color-f1-red)" strokeWidth="1.5" />
          <circle cx="140" cy="100" r="3.5" fill="var(--color-f1-red)" className="animate-pulse-dot" />
          <text x="110" y="90" className="font-jetbrains text-[8px] fill-f1-red font-bold">DRIVER GAIN</text>

          {/* Center line (Mean average driver) */}
          <line x1="200" y1="50" x2="200" y2="175" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="2,2" />
          <text x="204" y="65" className="font-jetbrains text-[8px] fill-white/40">MEAN (0.0s)</text>

          {/* Labels */}
          <text x="35" y="179" className="font-jetbrains text-[8px] fill-white/40 text-end">0.0</text>
          <text x="40" y="192" className="font-jetbrains text-[8px] fill-white/40">-0.8s (Faster)</text>
          <text x="360" y="192" className="font-jetbrains text-[8px] fill-white/40 text-end">+0.8s (Slower)</text>
          <text x="200" y="210" className="font-jetbrains text-[9px] fill-white/60 font-bold text-center" textAnchor="middle">DRIVER SKILL RESIDUAL DISTRIBUTION</text>
        </>
      )}
    </svg>
  );
};

export const ScienceSection: React.FC<ScienceSectionProps> = ({ id }) => {
  const [selectedTerm, setSelectedTerm] = useState<TermKey>('air');

  const current = DETAILS[selectedTerm];

  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      <div className="max-w-6xl mx-auto py-16">
        <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block">
          03 / The Science
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter mb-4">
          Econometrics meets<br />10Hz telemetry.
        </h2>
        <p className="text-white/55 text-sm max-w-xl font-jetbrains leading-relaxed mb-8">
          This isn't rolling averages. Isolating confounded variables from time-series race data demands genuine causal identification. We use lagged instruments, Frisch-Waugh detrending, and OLS estimation - not correlation.
        </p>

        <div className="bg-graphite-800/20 border border-white/5 p-6 rounded-xl">
          <style>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] font-jetbrains text-[10px] uppercase tracking-widest text-white/50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-f1-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-f1-red shadow-[0_0_8px_rgba(225,6,0,0.8)]"></span>
              </span>
              <span className="text-white/90 font-bold">Interactive Model</span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="hidden sm:inline text-white/60">Click any term to inspect its live causal estimation &amp; graph</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-f1-red font-black animate-pulse px-4 py-2 bg-f1-red/10 border border-f1-red/40 rounded shadow-[0_0_15px_rgba(225,6,0,0.25)]">
              <span className="text-xs md:text-sm tracking-widest">← SELECT A TERM TO EXPLORE →</span>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Equation terms"
            className="flex items-center justify-start xl:justify-center gap-1.5 md:gap-3 font-jetbrains text-[11px] sm:text-xs md:text-sm select-none overflow-x-auto whitespace-nowrap w-full pb-6 pt-2 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <span className="text-white font-bold shrink-0 text-sm md:text-base drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">ΔLapTime</span>
            <span className="text-white/50 shrink-0 text-sm md:text-base">=</span>

            {TERM_KEYS.map((key, idx) => {
              const isSkill = key === 'skill';
              const isSelected = selectedTerm === key;
              return (
                <React.Fragment key={key}>
                  <button
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedTerm(key)}
                    className={`px-3 py-2 md:px-4 md:py-2.5 border rounded font-jetbrains transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-f1-red/80 cursor-pointer select-none shrink-0 flex items-center justify-center relative overflow-hidden group ${
                      isSelected
                        ? isSkill
                          ? 'border-f1-red bg-f1-red/30 text-white shadow-[0_0_20px_rgba(225,6,0,0.6)] font-bold scale-[1.05] z-10'
                          : 'border-f1-red bg-f1-red/20 text-white shadow-[0_0_15px_rgba(225,6,0,0.4)] font-bold scale-[1.05] z-10'
                        : isSkill
                          ? 'border-f1-red/40 bg-f1-red/10 text-f1-red/80 hover:border-f1-red/80 hover:bg-f1-red/20 hover:text-f1-red hover:shadow-[0_0_15px_rgba(225,6,0,0.4)] hover:-translate-y-[2px]'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/60 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:-translate-y-[2px]'
                    }`}
                  >
                    {!isSelected && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></span>
                    )}
                    <span className="relative z-10">{TERM_LABELS[key]}</span>
                  </button>
                  {idx < TERM_KEYS.length - 1 && (
                    <span className="text-white/50 shrink-0 text-sm md:text-base">+</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 border-l-2 border-f1-red bg-white/[0.02] rounded-r-lg p-6 transition-all duration-300">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h4 className="font-jetbrains text-sm font-bold text-f1-red uppercase tracking-wider mb-2">
                  {current.title}
                </h4>
                <div className="mb-4">
                  <span className="text-[10px] text-white/40 font-jetbrains uppercase tracking-widest mr-2 block sm:inline mb-1 sm:mb-0">
                    SQL / Heuristic Mapping:
                  </span>
                  <code className="text-xs font-jetbrains text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-400/10 break-all inline-block">
                    {current.formula}
                  </code>
                </div>
                <p className="text-xs md:text-sm text-white/70 font-jetbrains leading-relaxed">
                  {current.desc}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-graphite-900/40 border border-white/5 rounded-xl p-4 min-h-[240px]">
              <div className="w-full text-[9px] font-jetbrains text-white/30 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Telemetry Visualisation</span>
                <span className="text-f1-red/80 font-bold">● {selectedTerm.toUpperCase()}_MODEL</span>
              </div>
              <div className="w-full flex-1 flex items-center justify-center">
                <TelemetryChart term={selectedTerm} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
