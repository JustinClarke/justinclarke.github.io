import { LINKS } from '../../../data/projectStats';

const drivers = [
  {
    id: 'HAM',
    lapTime: '88.392s',
    skill: { value: '−0.198s', positive: false },
    segments: [
      { label: 'CAR',  pct: 52, color: '#334155', title: 'Constructor baseline' },
      { label: 'FUEL', pct: 13, color: '#475569', title: 'Fuel weight penalty' },
      { label: 'CMP',  pct: 10, color: 'var(--color-emerald-dark)', title: 'Tyre compound stint age' },
      { label: 'RBR',  pct: 8,  color: '#065F46', title: 'Rubber surface evolution' },
      { label: 'WX',   pct: 3,  color: '#2563EB', title: 'Weather & air density' },
      { label: 'SKILL',pct: 14, color: 'var(--color-f1-red)', title: 'Isolated driver skill' },
    ],
  },
  {
    id: 'VER',
    lapTime: '88.651s',
    skill: { value: '+0.074s', positive: true },
    segments: [
      { label: 'CAR',  pct: 52, color: '#334155', title: 'Constructor baseline' },
      { label: 'FUEL', pct: 13, color: '#475569', title: 'Fuel weight penalty' },
      { label: 'CMP',  pct: 10, color: 'var(--color-emerald-dark)', title: 'Tyre compound stint age' },
      { label: 'RBR',  pct: 7,  color: '#065F46', title: 'Rubber surface evolution' },
      { label: 'WX',   pct: 3,  color: '#2563EB', title: 'Weather & air density' },
      { label: 'AIR',  pct: 7,  color: 'var(--color-blue-bright)', title: 'Turbulent dirty-air tax' },
      { label: 'SKILL',pct: 8,  color: 'var(--color-f1-red)', title: 'Isolated driver skill' },
    ],
  },
];

const legend = [
  { label: 'Car baseline',   color: '#334155' },
  { label: 'Fuel weight',    color: '#475569' },
  { label: 'Tyre compound',  color: 'var(--color-emerald-dark)' },
  { label: 'Track evolution',color: '#065F46' },
  { label: 'Weather',        color: '#2563EB' },
  { label: 'Dirty air',      color: 'var(--color-blue-bright)' },
  { label: 'Driver residual',color: 'var(--color-f1-red)' },
];

export function DecompositionExplainer() {
  return (
    <div className="rounded-3xl bg-graphite-800/40 border border-white/5 px-8 md:px-12 py-12 md:py-16 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-3 block font-semibold">
            The Decomposition
          </span>
          <h2 className="text-2xl md:text-3xl font-noto font-black text-white/90 uppercase tracking-tighter">
            Same lap. Seven causes.
          </h2>
        </div>
        <p className="font-jetbrains text-[11px] text-white/50 max-w-sm leading-relaxed">
          2021 Abu Dhabi Grand Prix · Lap 14 ·{' '}
          <a
            href={`${LINKS.docs}/reference/schemas/laps`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 underline underline-offset-2 hover:text-white/70 transition-colors"
          >
            fct_lap_residuals
          </a>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {drivers.map((driver) => (
          <div key={driver.id}>
            <div className="flex justify-between font-jetbrains text-xs text-white/60 mb-2">
              <span className="font-bold text-white text-sm">{driver.id}</span>
              <span>
                {driver.lapTime} ·{' '}
                <span className={`font-bold ${driver.skill.positive ? 'text-red-400' : 'text-emerald-400'}`}>
                  driver_skill: {driver.skill.value}
                </span>
              </span>
            </div>
            <div className="h-7 bg-white/[0.04] border border-white/10 rounded-lg flex overflow-hidden">
              {driver.segments.map((seg) => (
                <div
                  key={seg.label}
                  className="h-full flex items-center justify-center font-jetbrains text-[9px] font-bold text-white/80 border-r border-white/5 last:border-r-0 select-none"
                  style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                  title={seg.title}
                >
                  {seg.pct >= 6 ? seg.label : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-jetbrains text-[11px] text-white/45 leading-relaxed max-w-xl">
        The red <span className="text-f1-red font-semibold">SKILL</span> segment is the only part
        the driver controls. Everything else is physics  - and now it's measured.
        Verstappen's dirty-air tax (<span className="text-blue-400">AIR</span>) cost him{' '}
        <span className="text-white/70 font-semibold">+0.218s</span> in clean-air equivalent pace
        on this lap. The stopwatch lumped it into his split.
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 border-t border-white/[0.06]">
        {legend.map((item) => (
          <span key={item.label} className="font-jetbrains text-[10px] text-white/45 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
