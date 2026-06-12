/**
 * InsightCallout a "timing feed" table of driver skill residuals for one lap,
 * each row showing the number plus a proportional bar.
 *
 * Fits in: the overview, as a worked example of the decomposition in action.
 * Note:    Bars are scaled relative to the biggest absolute value (`maxAbs`), so
 *          the longest bar is always full-width regardless of the raw numbers.
 *
 * For beginners ----------------------------------------------------------------
 * `Math.max(...array)` finds the largest value; the `...` (spread) passes each
 * array element as a separate argument. We compute `maxAbs` once at module load
 * (the data is fixed), then each row's bar width is its share of that maximum.
 * -----------------------------------------------------------------------------
 */
import { LINKS } from '../../../data/projectStats';

// Portugal 2021 (race 2021_3), lap 17. Field-centred driver_skill_residual_s.
// Queried from fct_lap_residuals on 2026-06-04. Negative = faster than field average.
const skillResiduals = [
  { pos: '1', driver: 'BOT', value:  0.164, label: '+0.164s', note: 'P1, clean air, Mercedes',  teamColor: '#00D2BE' },
  { pos: '2', driver: 'HAM', value:  0.394, label: '+0.394s', note: 'P2, clean air, Mercedes',  teamColor: '#00D2BE' },
  { pos: '3', driver: 'VER', value: -0.485, label: '−0.485s', note: '+0.500s dirty-air tax',    teamColor: '#0600EF' },
  { pos: '4', driver: 'PER', value: -0.195, label: '−0.195s', note: 'P4, clean air, Red Bull',  teamColor: '#0600EF' },
  { pos: '5', driver: 'NOR', value:  0.216, label: '+0.216s', note: 'P5, clean air, McLaren',   teamColor: '#FF8000' },
];

const maxAbs = Math.max(...skillResiduals.map((r) => Math.abs(r.value)));

export function InsightCallout() {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xl">
        <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block font-semibold">
          Featured insight
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white uppercase tracking-tighter mb-4">
          The data speaks.
        </h2>
        <p className="text-white/55 text-sm font-jetbrains leading-relaxed max-w-2xl">
          Lap 17, 2021 Portuguese Grand Prix. Verstappen sits 0.001s behind Hamilton on the same
          medium compound, same fuel load, same weather. The engine decomposes field-centred skill
          residuals, VER's raw pace is 0.879s faster than Hamilton's on this lap. The dirty-air tax
          swallows{' '}
          <span className="text-f1-red font-bold">+0.500s</span> of it.
        </p>
      </div>

      <div className="bg-graphite-850 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-md">
        {/* Timing board decorative dot grid background */}
        <div className="absolute inset-0 bg-dots-dark opacity-40 pointer-events-none" />

        {/* Console Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <span className="font-jetbrains text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">
            TIMING_FEED // DRIVER_SKILL_RESIDUAL_S
          </span>
          <span className="font-jetbrains text-[8px] text-white/40 uppercase font-mono">
            NEGATIVE = FASTER THAN EXPECTED
          </span>
        </div>

        {/* Live Grid Table */}
        <div className="relative z-10 flex flex-col gap-3 font-jetbrains">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 text-white/40 text-[9px] uppercase tracking-wider border-b border-white/5 pb-2 font-bold select-none">
            <div className="col-span-1">POS</div>
            <div className="col-span-2">DRIVER</div>
            <div className="col-span-3">SKILL RESIDUAL</div>
            <div className="col-span-4">RELATIVE PERFORMANCE</div>
            <div className="col-span-2 text-right">SECTOR NOTE</div>
          </div>

          {/* Data Rows */}
          {skillResiduals.map((row) => {
            const barPct = (Math.abs(row.value) / maxAbs) * 100;
            const isPositive = row.value > 0;
            return (
              <div key={row.driver} className="grid grid-cols-12 gap-2 items-center text-xs group py-0.5">
                {/* Pos */}
                <div className="col-span-1 text-white/40 font-bold font-mono">
                  {row.pos}
                </div>

                {/* Driver Tag with team constructor colored border */}
                <div className="col-span-2 flex items-center gap-2">
                  <span className="w-[3px] h-4 shrink-0 rounded-sm" style={{ backgroundColor: row.teamColor }} />
                  <span className="font-bold text-white/70 group-hover:text-white transition-colors">
                    {row.driver}
                  </span>
                </div>

                {/* Residual value */}
                <div className={`col-span-3 font-bold font-mono ${isPositive ? 'text-f1-red' : 'text-emerald-400'}`}>
                  {row.label}
                </div>

                {/* Timing bar */}
                <div className="col-span-4">
                  <div className="h-4 bg-graphite-900/50 rounded border border-white/5 overflow-hidden flex items-center p-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <div
                      className={`h-full rounded-sm transition-all duration-700 ${
                        isPositive ? 'bg-gradient-to-r from-orange to-f1-red ml-auto' : 'bg-gradient-to-r from-emerald-500 to-acc-lang'
                      }`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>

                {/* Sector Context */}
                <div className="col-span-2 text-[10px] text-white/50 text-right truncate">
                  {row.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timing board footer */}
        <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="font-jetbrains text-[10px] text-white/50 leading-relaxed max-w-lg">
            Verstappen's raw pace advantage was real. Hamilton's clean-air buffer was real.
            Without the decomposition, neither is visible in the timing sheets.
          </p>
          <a
            href={`${LINKS.docs}/reference/schemas/laps`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-jetbrains text-[10px] text-f1-red uppercase tracking-wider font-semibold shrink-0 hover:opacity-75 transition-opacity"
          >
            See fct_lap_residuals →
          </a>
        </div>
      </div>
    </div>
  );
}
