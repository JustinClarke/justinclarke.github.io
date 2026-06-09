import { Car, TimerReset, Flag } from 'lucide-react';

function GhostCarGraphic() {
  return (
    <div className="w-full h-24 bg-graphite-900 border border-white/5 rounded-xl flex items-center justify-center p-3 overflow-hidden shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.03)]">
      <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
        {/* Track Line */}
        <path d="M10 35 C 50 15, 120 50, 190 32" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />
        <path d="M10 35 C 50 15, 120 50, 190 32" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" />
        
        {/* HAM Car (Teal) */}
        <circle cx="120" cy="37" r="3" fill="var(--color-acc-lang)" className="sb-breathe" />
        <text x="120" y="29" fill="var(--color-acc-lang)" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HAM</text>
        
        {/* VER Car (Red/Glow) */}
        <circle cx="95" cy="31" r="3.5" fill="var(--color-f1-red)" className="animate-pulse" />
        <text x="95" y="23" fill="var(--color-f1-red)" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">VER</text>

        {/* Split Time Marker */}
        <path d="M95 31 L120 37" stroke="var(--color-f1-red)" strokeWidth="1" strokeDasharray="1 1" />
        <rect x="135" y="6" width="50" height="11" rx="2" fill="rgba(225,6,0,0.05)" stroke="rgba(225,6,0,0.15)" strokeWidth="0.5" />
        <text x="160" y="14" fill="var(--color-f1-red)" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GAP: +0.259s</text>
      </svg>
    </div>
  );
}

function TyreCliffGraphic() {
  return (
    <div className="w-full h-24 bg-graphite-900 border border-white/5 rounded-xl flex items-center justify-center p-3 overflow-hidden shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.03)]">
      <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
        {/* Axes */}
        <line x1="15" y1="10" x2="15" y2="52" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="15" y1="52" x2="185" y2="52" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Grip Degradation Curve */}
        <path d="M15 15 C 60 18, 110 22, 135 32 C 145 37, 150 48, 160 52" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="sb-line-draw" />
        
        {/* Cliff Threshold line */}
        <line x1="140" y1="10" x2="140" y2="52" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="140" cy="34" r="3.5" fill="var(--color-f1-red)" className="animate-pulse" />
        
        {/* Labels */}
        <text x="145" y="23" fill="var(--color-viz-red)" fontSize="6.5" fontFamily="monospace" fontWeight="bold">CLIFF ZONE</text>
        <text x="25" y="20" fill="rgba(255,255,255,0.4)" fontSize="5.5" fontFamily="monospace">GRIP</text>
        <text x="175" y="47" fill="rgba(255,255,255,0.4)" fontSize="5.5" fontFamily="monospace">LAPS</text>
      </svg>
    </div>
  );
}

function PitStrategyGraphic() {
  return (
    <div className="w-full h-24 bg-graphite-900 border border-white/5 rounded-xl flex items-center justify-center p-3 overflow-hidden shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.03)]">
      <svg className="w-full h-full" viewBox="0 0 200 60" fill="none">
        {/* Pit Lane Path */}
        <rect x="15" y="42" width="170" height="8" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <text x="22" y="48" fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">PIT LANE</text>
        
        {/* Main Track Straight */}
        <rect x="15" y="15" width="170" height="8" rx="2" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />
        
        {/* Car 1 (Target) */}
        <circle cx="150" cy="19" r="2.5" fill="#34d399" />
        <text x="150" y="11" fill="#34d399" fontSize="5.5" fontFamily="monospace" textAnchor="middle">CAR 1</text>
        
        {/* Dirty Air Wake */}
        <path d="M125 19 Q 110 16 95 19 T 65 19" stroke="rgba(239,68,68,0.15)" strokeWidth="5" strokeLinecap="round" strokeDasharray="3 2" className="sb-flow-dash-rev" />
        
        {/* Car 2 (Trailing in Dirty Air) */}
        <circle cx="85" cy="19" r="2.5" fill="var(--color-viz-red)" />
        <text x="85" y="11" fill="var(--color-viz-red)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">CAR 2</text>
        
        <rect x="30" y="28" width="80" height="9" rx="1.5" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.15)" strokeWidth="0.5" />
        <text x="70" y="34" fill="var(--color-viz-red)" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DIRTY WAKE TAX: +0.318s/lap</text>
      </svg>
    </div>
  );
}

const products = [
  {
    title: 'Ghost Car',
    desc: 'Application layer that reassembles micro-sectors from different drivers at identical track conditions, recombining driver skill residuals with any constructor baseline.',
    impact: 'Data layer shipped · app visualisation next',
    color: 'text-f1-red',
    iconColor: 'text-f1-red group-hover:text-white',
    boxDefault: 'bg-transparent border-2 border-f1-red/60',
    boxHover: 'group-hover:bg-f1-red group-hover:border-f1-red group-hover:shadow-[0_0_20px_rgba(225,6,0,0.4)]',
    bg: 'from-transparent to-f1-red/2',
    icon: Car,
    graphic: <GhostCarGraphic />,
  },
  {
    title: 'Tyre Cliff Prediction',
    desc: 'Isolates purely mechanical grip degradation from fuel burn using survival modelling.',
    impact: 'Predicts compound failure cliff before it happens',
    color: 'text-amber-400',
    iconColor: 'text-amber-500 group-hover:text-white',
    boxDefault: 'bg-transparent border-2 border-amber-500/60',
    boxHover: 'group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    bg: 'from-transparent to-amber-500/2',
    icon: TimerReset,
    graphic: <TyreCliffGraphic />,
  },
  {
    title: 'Pit Strategy Value',
    desc: 'Quantifies the exact cost of dirty-air traffic using counterfactual clean-air times.',
    impact: 'Calculates overcut/undercut viability in traffic',
    color: 'text-emerald-400',
    iconColor: 'text-emerald-500 group-hover:text-white',
    boxDefault: 'bg-transparent border-2 border-emerald-500/60',
    boxHover: 'group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    bg: 'from-transparent to-emerald-500/2',
    icon: Flag,
    graphic: <PitStrategyGraphic />,
  },
];

export function BusinessValue() {
  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-xl">
        <span className="font-jetbrains text-[10px] text-emerald-400 uppercase tracking-[0.2em] mb-4 block font-semibold">
          Business Value
        </span>
        <h2 className="text-3xl md:text-4xl font-noto font-black text-white uppercase tracking-tighter mb-4">
          Why It Matters.
        </h2>
        <p className="text-white/55 text-sm font-jetbrains leading-relaxed">
          Translating raw physics into strategic racing advantage and actionable insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative p-7 bg-graphite-850 border border-white/5 rounded-2xl hover:bg-graphite-800 hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              <div className="relative z-10 flex flex-col h-full justify-between gap-5">
                <div className="flex flex-col gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 ${item.boxDefault} ${item.boxHover}`}>
                    <Icon className={`w-6 h-6 ${item.iconColor} transition-colors duration-500`} />
                  </div>
                  <div>
                    <h3 className="font-noto text-xl font-bold text-white/90 mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-xs text-white/55 font-jetbrains leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* SVG Visual Diagnostic */}
                <div className="my-1">
                  {item.graphic}
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <span className={`font-jetbrains text-[9px] uppercase tracking-wider ${item.color} font-bold`}>
                    {item.impact}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
