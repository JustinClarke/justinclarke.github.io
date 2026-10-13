/**
 * OutputSection section "05 / The Output": shows the engine's actual product -
 * a SQL query, a switchable results table for four sample races, and stacked
 * "decomposition bars" that break each lap time into its causal components.
 *
 * Fits in: rendered by SourceView's Science & Output block.
 * Note:    DATA_SAMPLES holds real fct_lap_residuals rows (top five ml_eligible
 *          cars on one lap per race, dev.duckdb, 2026-10-13); the dropdown picks
 *          which race feeds both the table and the decomposition bars.
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { STATS } from '../../data/projectStats';

interface OutputSectionProps {
  id: string;
}

interface LapData {
  driver: string;
  lapTime: number;
  fuel: number;
  compound: number;
  constructor: number;
  dirtyAir: number;
  driverSkill: number;
  mlEligible: boolean;
}

const DATA_SAMPLES: Record<string, { race: string; lap: number; data: LapData[] }> = {
  'abu-dhabi-2021': {
    race: '2021 Abu Dhabi',
    lap: 13,
    data: [
      { driver: 'HAM', lapTime: 88.258, fuel: 2.094, compound: 3.405, constructor: -1.296, dirtyAir: 0.000, driverSkill: -1.965, mlEligible: true },
      { driver: 'PER', lapTime: 89.267, fuel: 2.094, compound: 1.994, constructor: -1.879, dirtyAir: 0.000, driverSkill: 1.039, mlEligible: true },
      { driver: 'SAI', lapTime: 89.801, fuel: 2.094, compound: 1.994, constructor: -0.319, dirtyAir: 0.000, driverSkill: 0.012, mlEligible: true },
      { driver: 'NOR', lapTime: 90.583, fuel: 2.094, compound: 1.994, constructor: -0.139, dirtyAir: 0.000, driverSkill: 0.615, mlEligible: true },
      { driver: 'LEC', lapTime: 90.323, fuel: 2.094, compound: 1.994, constructor: -0.319, dirtyAir: 0.331, driverSkill: 0.203, mlEligible: true },
    ]
  },
  'monaco-2023': {
    race: '2023 Monaco',
    lap: 15,
    data: [
      { driver: 'ALO', lapTime: 77.444, fuel: 2.708, compound: 2.979, constructor: -0.029, dirtyAir: 0.000, driverSkill: -0.853, mlEligible: true },
      { driver: 'OCO', lapTime: 78.018, fuel: 2.708, compound: 3.441, constructor: -0.991, dirtyAir: 0.000, driverSkill: 0.221, mlEligible: true },
      { driver: 'SAI', lapTime: 77.883, fuel: 2.708, compound: 2.793, constructor: -0.882, dirtyAir: 0.331, driverSkill: 0.294, mlEligible: true },
      { driver: 'HAM', lapTime: 78.189, fuel: 2.708, compound: 3.441, constructor: -0.967, dirtyAir: 0.331, driverSkill: 0.037, mlEligible: true },
      { driver: 'LEC', lapTime: 78.312, fuel: 2.708, compound: 2.793, constructor: -0.882, dirtyAir: 0.331, driverSkill: 0.723, mlEligible: true },
    ]
  },
  'monza-2024': {
    race: '2024 Monza',
    lap: 18,
    data: [
      { driver: 'SAI', lapTime: 85.678, fuel: 1.644, compound: 1.355, constructor: -0.592, dirtyAir: 0.331, driverSkill: -0.179, mlEligible: true },
      { driver: 'VER', lapTime: 85.469, fuel: 1.644, compound: 0.990, constructor: -0.448, dirtyAir: 0.000, driverSkill: 0.164, mlEligible: true },
      { driver: 'PER', lapTime: 85.448, fuel: 1.644, compound: 0.990, constructor: -0.448, dirtyAir: 0.000, driverSkill: 0.143, mlEligible: true },
      { driver: 'PIA', lapTime: 84.028, fuel: 1.644, compound: 0.110, constructor: -1.277, dirtyAir: 0.000, driverSkill: 0.431, mlEligible: true },
      { driver: 'NOR', lapTime: 83.920, fuel: 1.644, compound: 0.220, constructor: -1.277, dirtyAir: 0.331, driverSkill: -0.118, mlEligible: true },
    ]
  },
  'silverstone-2022': {
    race: '2022 Silverstone',
    lap: 26,
    data: [
      { driver: 'HAM', lapTime: 92.655, fuel: 1.713, compound: 2.966, constructor: -1.500, dirtyAir: 0.331, driverSkill: -1.618, mlEligible: true },
      { driver: 'SAI', lapTime: 92.976, fuel: 1.713, compound: 0.233, constructor: -1.378, dirtyAir: 0.000, driverSkill: 1.645, mlEligible: true },
      { driver: 'NOR', lapTime: 94.108, fuel: 1.713, compound: 3.073, constructor: -0.090, dirtyAir: 0.000, driverSkill: -1.350, mlEligible: true },
      { driver: 'ALO', lapTime: 94.013, fuel: 1.713, compound: 2.966, constructor: 0.007, dirtyAir: 0.000, driverSkill: -1.436, mlEligible: true },
      { driver: 'PER', lapTime: 92.666, fuel: 1.713, compound: 2.644, constructor: -0.871, dirtyAir: 0.000, driverSkill: -1.583, mlEligible: true },
    ]
  },
};

const COMPONENT_SPAN = 52;

const BAR_SEGMENTS: { key: keyof LapData; label: string; bg: string; text: string; title: string }[] = [
  { key: 'fuel',     label: 'FUEL', bg: 'bg-slate-700',   text: 'text-text-tertiary', title: 'Fuel Weight Penalty' },
  { key: 'compound', label: 'CMP',  bg: 'bg-emerald-600', text: 'text-text-primary', title: 'Tyre Compound Stint Age' },
  { key: 'dirtyAir', label: 'AIR',  bg: 'bg-blue-500/70', text: 'text-white',    title: 'Turbulent Dirty Air Tax' },
];

const DecompositionBar = ({ row }: { row: LapData }) => {
  // Drop negligible segments, then scale each remaining value (plus the
  // driver-skill slice) to a shared percentage of COMPONENT_SPAN.
  const comps = BAR_SEGMENTS
    .map((s) => ({ ...s, value: Math.abs(row[s.key] as number) }))
    .filter((s) => s.value > 0.001);
  const skillValue = Math.abs(row.driverSkill);
  const totalShown = comps.reduce((a, s) => a + s.value, 0) + skillValue;
  const span = (v: number) => (totalShown === 0 ? 0 : (v / totalShown) * COMPONENT_SPAN);
  const skillFaster = row.driverSkill < 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between font-jetbrains text-xs text-text-tertiary mb-2">
        <span className="font-bold text-white">{row.driver}</span>
        <span>
          {row.lapTime.toFixed(3)}s ·{' '}
          <span className={`font-bold ${skillFaster ? 'text-emerald-400' : 'text-red-400'}`}>
            driver_skill_residual: {skillFaster ? '−' : '+'}{skillValue.toFixed(3)}s
          </span>
        </span>
      </div>
      <div className="h-6 bg-white/[0.03] border border-white/5 rounded flex overflow-hidden">
        <div
          className="h-full bg-slate-800 flex items-center justify-center font-jetbrains text-micro font-bold text-text-tertiary border-r border-white/5 select-none"
          style={{ width: `${100 - COMPONENT_SPAN}%` }}
          title="Constructor Baseline"
        >
          CAR
        </div>
        {comps.map((s) => (
          <div
            key={s.label}
            className={`h-full ${s.bg} flex items-center justify-center font-jetbrains text-micro font-bold ${s.text} border-r border-white/5 select-none`}
            style={{ width: `${span(s.value)}%` }}
            title={s.title}
          >
            {s.label}
          </div>
        ))}
        <div
          className={`h-full ${skillFaster ? 'bg-f1-red text-white' : 'bg-f1-red/40 text-text-primary'} flex items-center justify-center font-jetbrains text-micro font-bold select-none`}
          style={{ width: `${span(skillValue)}%` }}
          title={skillFaster ? 'Isolated Driver Skill (Negative = Faster)' : 'Isolated Driver Skill (Positive = Slower)'}
        >
          SKILL
        </div>
      </div>
    </div>
  );
};

export const OutputSection = ({ id }: OutputSectionProps) => {
  const [showTable, setShowTable] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string>('abu-dhabi-2021');
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  return (
    <section id={id} className="w-full scroll-mt-32 reveal-element">
      <div className="max-w-6xl mx-auto py-16">
        <span className="font-jetbrains text-micro text-f1-red uppercase tracking-mega mb-4 block">
          05 / The Output
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-text-primary uppercase tracking-tighter mb-4">
          A causal decomposition,<br />down to the millisecond.
        </h2>
        <p className="text-text-tertiary text-sm max-w-2xl font-jetbrains leading-relaxed mb-8">
          The engine doesn't output a chart. It outputs a pristine, 1-lap grain feature matrix : <code className="text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 rounded font-bold border border-emerald-400/10">fct_lap_residuals</code>  - where each component is a precisely isolated, physically-grounded additive term in seconds. Five terms. CI-enforced identity. Positive = slower.
        </p>

        <div className="terminal rounded-xl border border-white/10 bg-[#1A1D22] overflow-hidden font-jetbrains shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-graphite-800 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-viz-mac-red" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-viz-mac-green" />
            <span className="ml-2 text-micro text-text-tertiary uppercase tracking-widest">
              fct_lap_residuals • DuckDB • data/dev.duckdb
            </span>
            <span className="ml-auto text-micro text-emerald-400 uppercase tracking-wider font-semibold">
              ● {STATS.tests} tests passing
            </span>
          </div>
          <div className="p-6 text-xs md:text-sm text-text-secondary overflow-x-auto whitespace-pre leading-loose">
            <div><span className="text-emerald-400">$</span> <span className="text-white">duckdb data/dev.duckdb</span></div>
            <div className="mt-2">
              <span className="text-pink-400">SELECT</span>
              <span className="text-white"> lap_id, driver_id, lap_time_s,</span>
            </div>
            <div><span className="text-white">       fuel_component_s, compound_component_s,</span></div>
            <div><span className="text-white">       constructor_component_s,</span></div>
            <div><span className="text-white">       dirty_air_tax_s,</span></div>
            <div><span className="text-white">       </span><span className="text-pink-400">driver_skill_residual_s</span><span className="text-white">,  </span><span className="text-text-tertiary italic">-- the human element</span></div>
            <div><span className="text-white">       ml_eligible</span></div>
            <div><span className="text-pink-400">FROM</span> <span className="text-blue-400">fct_lap_residuals</span></div>
            <div><span className="text-pink-400">WHERE</span> <span className="text-white">ml_eligible = </span><span className="text-orange-400">TRUE</span></div>
            <div><span className="text-white">  </span><span className="text-pink-400">AND</span> <span className="text-white">race_year = </span><span className="text-orange-400">2021</span> <span className="text-pink-400">AND</span> <span className="text-white">race_id = </span><span className="text-green-400">'2021_22'</span></div>
            <div><span className="text-pink-400">ORDER BY</span> <span className="text-white">driver_id, lap_number</span> <span className="text-pink-400">LIMIT</span> <span className="text-orange-400">5</span><span className="text-white">;</span></div>
          </div>
        </div>

        <div id="fct-lap-residuals-table" className={`mt-6 border border-white/10 rounded-xl overflow-hidden bg-graphite-850 scroll-mt-32 ${showTable ? '' : 'hidden lg:block'}`}>
          <div className="px-4 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-jetbrains text-micro text-text-tertiary uppercase tracking-widest">View sample:</span>
              <div className="relative">
                <button
                  onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-f1-red/40 rounded-lg bg-f1-red/5 hover:bg-f1-red/10 hover:border-f1-red/60 transition-all font-jetbrains text-xs text-text-primary uppercase tracking-widest font-bold"
                >
                  {DATA_SAMPLES[selectedSample]?.race}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSampleDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSampleDropdown && (
                  <div className="absolute top-full left-0 mt-2 border border-white/10 rounded-lg bg-graphite-900 shadow-2xl z-50 w-64">
                    {Object.entries(DATA_SAMPLES).map(([ key, sample ]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedSample(key);
                          setShowSampleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-jetbrains text-micro uppercase tracking-wider hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 ${
                          key === selectedSample ? 'text-emerald-400 bg-emerald-500/10 border-l-2 border-l-emerald-400' : 'text-text-tertiary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{sample.race}</span>
                          <span className="text-text-tertiary">Lap {sample.lap}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="inline-block text-micro font-jetbrains uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              ● Live Result
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-jetbrains text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-text-tertiary uppercase text-micro tracking-wider">
                  <th className="py-3 px-4 font-normal">driver_id</th>
                  <th className="py-3 px-4 font-normal text-right">lap_time_s</th>
                  <th className="py-3 px-4 font-normal text-right">fuel_comp_s</th>
                  <th className="py-3 px-4 font-normal text-right">compound_s</th>
                  <th className="py-3 px-4 font-normal text-right">constructor_s</th>
                  <th className="py-3 px-4 font-normal text-right">dirty_air_s</th>
                  <th className="py-3 px-4 font-bold text-right text-f1-red bg-f1-red/5">driver_skill_s</th>
                  <th className="py-3 px-4 font-normal text-center">ml_eligible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DATA_SAMPLES[selectedSample]?.data.map((row) => (
                  <tr key={row.driver} className="hover:bg-white/[0.01] transition-colors duration-150">
                    <td className="py-3 px-4 font-bold text-text-secondary">{row.driver}</td>
                    <td className="py-3 px-4 text-right text-text-secondary">{row.lapTime.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right text-red-400">+{row.fuel.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right text-red-400">+{row.compound.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right" style={{ color: row.constructor < 0 ? 'var(--color-emerald)' : 'var(--color-sql-red)' }}>
                      {row.constructor < 0 ? '' : '+'}{row.constructor.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-right" style={{ color: row.dirtyAir === 0 ? '#9ca3af' : 'var(--color-blue-bright)' }}>
                      {row.dirtyAir === 0 ? '0.000' : `+${row.dirtyAir.toFixed(3)}`}
                    </td>
                    <td className="py-3 px-4 text-right font-bold bg-f1-red/[0.02]" style={{ color: row.driverSkill < 0 ? 'var(--color-emerald)' : 'var(--color-sql-red)' }}>
                      {row.driverSkill < 0 ? '' : '+'}{row.driverSkill.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-semibold">{row.mlEligible ? 'TRUE' : 'FALSE'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          className="lg:hidden mt-3 font-jetbrains text-micro uppercase tracking-wider text-text-tertiary border border-white/10 px-4 py-2 rounded hover:text-text-secondary hover:border-white/20 transition-colors duration-200"
          onClick={() => setShowTable(v => !v)}
        >
          {showTable ? '↑ Hide full matrix' : '↓ Show full matrix (11 columns)'}
        </button>

        <div className="mt-12">
          <div className="font-jetbrains text-micro text-text-tertiary uppercase tracking-wider mb-2">
            Lap decomposition · {DATA_SAMPLES[selectedSample]?.race} · Lap {DATA_SAMPLES[selectedSample]?.lap}
          </div>
          <p className="font-jetbrains text-fine text-text-tertiary mb-6">
            Same lap, decomposed: the red <span className="text-f1-red font-semibold">SKILL</span> segment is the only part the driver controls.
          </p>

          {DATA_SAMPLES[selectedSample]?.data.slice(0, 2).map((row) => (
            <DecompositionBar key={row.driver} row={row} />
          ))}

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-slate-800 rounded-sm" />
              Car baseline
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-slate-700 rounded-sm" />
              Fuel weight
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded-sm" />
              Tyre compound
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-800 rounded-sm" />
              Track evolution
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded-sm" />
              Weather
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-sm" />
              Dirty air
            </span>
            <span className="font-jetbrains text-micro text-text-tertiary flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-f1-red rounded-sm" />
              Driver residual
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
