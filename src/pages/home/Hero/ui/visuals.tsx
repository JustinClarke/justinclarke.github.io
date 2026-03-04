// ─────────────────────────────────────────────────────────────────
// visuals.tsx
// Paste-ready replacement for the hero-section illustrations.
// Updated to match the full widget vocabulary (F1TelemetryWidget,
// LiteStoreWidget, SqlDisasterWidget, SpotifyWidget,
// BehaviouralRiskWidget).
//
// Each illustration uses the same 160×100 viewBox as before, so the
// existing layout/sizing inside <getProjectIllustration> works
// unchanged. Drop this in and re-import.
// ─────────────────────────────────────────────────────────────────

import React from 'react';

// ── Color helpers (same vocabulary as before) ──────────────────────
export const T = (a: number) => `rgba(0,200,180,${a})`;
export const AMBER = (a: number) => `rgba(251,191,36,${a})`;
export const RED = (a: number) => `rgba(248,113,113,${a})`;
export const GREEN = (a: number) => `rgba(74,222,128,${a})`;
export const VIOLET = (a: number) => `rgba(168,85,247,${a})`;
export const WHITE = (a: number) => `rgba(255,255,255,${a})`;
export const BLUE = (a: number) => `rgba(59,130,246,${a})`;
export const EMERALD = (a: number) => `rgba(16,185,129,${a})`;
export const ORANGE = (a: number) => `rgba(251,146,60,${a})`;

export const SPOTIFY = (a: number) => `rgba(29,185,84,${a})`;
export const SPOTIFY_LIGHT = (a: number) => `rgba(74,222,128,${a})`;
export const F1_RED = (a: number) => `rgba(255,95,87,${a})`;
export const F1_TEAL = (a: number) => `rgba(0,200,180,${a})`;
export const LITESTORE = (a: number) => `rgba(126,124,166,${a})`;
export const LITESTORE_LIGHT = (a: number) => `rgba(184,182,214,${a})`;
export const DISASTER = (a: number) => `rgba(239,68,68,${a})`;
export const DISASTER_CYAN = (a: number) => `rgba(0,229,204,${a})`;
export const DISASTER_ORANGE = (a: number) => `rgba(255,106,37,${a})`;
export const HR_PURPLE = (a: number) => `rgba(168,85,247,${a})`;
export const CAPITAL_AMBER = (a: number) => `rgba(245,158,11,${a})`;

export const ns = (k: string) => `ill-${k}`;
const MONO = 'ui-monospace, "JetBrains Mono", monospace';

export const SoftGlow: React.FC<{ id: string; std?: number }> = ({ id, std = 1.2 }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation={std} result="b" />
    <feMerge>
      <feMergeNode in="b" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export const GridPattern: React.FC<{ id: string; size?: number; color?: string }> = ({
  id, size = 8, color = 'rgba(0,200,180,0.06)',
}) => (
  <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
    <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={color} strokeWidth="0.3" />
  </pattern>
);

// ── [1] DefaultIllustration (unchanged) ────────────────────────────
export const DefaultIllustration: React.FC = () => {
  const k = ns('def');
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <GridPattern id={`${k}-grid`} size={6} />
      </defs>
      <rect x="10" y="10" width="140" height="80" fill={`url(#${k}-grid)`} stroke={T(0.18)} strokeWidth="0.4" />
      <text x="20" y="24" fill={T(0.5)} fontSize="3" fontFamily={MONO} letterSpacing="1">ANALYSIS</text>
      {[18, 28, 38, 30, 42, 36, 50].map((h, i) => (
        <rect key={i} x={20 + i * 17} y={80 - h} width="10" height={h} rx="0.6"
          fill={T(0.18)} stroke={T(0.45)} strokeWidth="0.4" />
      ))}
    </svg>
  );
};

// ── [2] LiteStore Live Analytics ───────────────────────────────────
// REWORKED: now leads with Lighthouse scores (PERF/A11Y/BEST/SEO)
// and an Active A/B "+20.4% CVR" winner  -  matches LiteStoreWidget.
export const LiteStoreIllustration: React.FC = () => {
  const k = ns('ls');
  const pts: [number, number][] = [
    [12, 70], [22, 66], [32, 62], [42, 55], [52, 58], [62, 48], [72, 44],
    [82, 38], [92, 36], [102, 30], [112, 26], [122, 22], [132, 18], [142, 14], [148, 12],
  ];
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');
  const area = `${path} L148 78 L12 78 Z`;

  const lighthouse: { label: string; val: number; color: (a: number) => string }[] = [
    { label: 'PERF', val: 98, color: GREEN },
    { label: 'A11Y', val: 92, color: LITESTORE_LIGHT },
    { label: 'BEST', val: 95, color: LITESTORE_LIGHT },
    { label: 'SEO',  val: 100, color: GREEN },
  ];

  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${k}-area`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={LITESTORE(0.35)} />
          <stop offset="100%" stopColor={LITESTORE(0)} />
        </linearGradient>
        <GridPattern id={`${k}-grid`} size={6} color="rgba(126,124,166,0.05)" />
        <SoftGlow id={`${k}-glow`} std={1} />
      </defs>

      {/* Browser chrome */}
      <line x1="3" y1="13" x2="157" y2="13" stroke={LITESTORE(0.22)} strokeWidth="0.4" />
      <circle cx="6" cy="8.5" r="0.9" fill={LITESTORE(0.25)} />
      <circle cx="9.4" cy="8.5" r="0.9" fill={LITESTORE(0.25)} />
      <circle cx="12.8" cy="8.5" r="0.9" fill={LITESTORE(0.25)} />
      <text x="80" y="10.2" textAnchor="middle" fill={LITESTORE(0.55)} fontSize="3" fontFamily={MONO}>litestore.app/analytics</text>
      <circle cx="148" cy="8.5" r="0.9" fill={LITESTORE(0.6)} className="sidebar-hub-pulse" />
      <text x="153" y="9.6" textAnchor="end" fill={LITESTORE_LIGHT(0.9)} fontSize="2.2" fontFamily={MONO} className="sb-flicker">LIVE</text>

      {/* Lighthouse score circles + active experiment */}
      <g transform="translate(0, 16)">
        <text x="6" y="3.5" fill={LITESTORE(0.55)} fontSize="2.4" fontFamily={MONO} letterSpacing="0.6">LIGHTHOUSE · vercel edge</text>
        {lighthouse.map((s, i) => {
          const cx = 14 + i * 17;
          const cy = 12;
          const r = 5.5;
          const circ = 2 * Math.PI * r;
          const dash = (s.val / 100) * circ;
          return (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <circle r={r} fill="none" stroke={LITESTORE(0.12)} strokeWidth="1.1" />
              <circle r={r} fill="none"
                stroke={s.color(0.95)} strokeWidth="1.1"
                strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
                transform="rotate(-90)" strokeLinecap="round"
                filter={`url(#${k}-glow)`} />
              <text y="1.4" textAnchor="middle" fill={WHITE(0.95)} fontSize="3.2" fontFamily={MONO} fontWeight="700">{s.val}</text>
              <text y="9.5" textAnchor="middle" fill={LITESTORE(0.5)} fontSize="1.9" fontFamily={MONO} letterSpacing="0.4">{s.label}</text>
            </g>
          );
        })}

        <g transform="translate(86, 0)">
          <rect x="0" y="2" width="72" height="20" rx="2" fill={LITESTORE(0.06)} stroke={LITESTORE(0.3)} strokeWidth="0.4" />
          <text x="3" y="7" fill={LITESTORE(0.55)} fontSize="2" fontFamily={MONO} letterSpacing="0.6">ACTIVE A/B · WINNER</text>
          <text x="69" y="7" textAnchor="end" fill={GREEN(0.95)} fontSize="2.2" fontFamily={MONO} fontWeight="700" className="sb-flicker">●</text>
          <text x="3" y="13" fill={WHITE(0.95)} fontSize="2.6" fontFamily={MONO} fontWeight="600">checkout-v3.cta</text>
          <text x="3" y="19.5" fill={LITESTORE(1)} fontSize="5.2" fontFamily={MONO} fontWeight="700" filter={`url(#${k}-glow)`}>+20.4%
            <tspan fontSize="2.2" fill={LITESTORE(0.55)} dx="2"> CVR</tspan>
          </text>
        </g>
      </g>

      {/* Conversion trend */}
      <rect x="10" y="42" width="140" height="46" fill={`url(#${k}-grid)`} opacity="0.65" />
      <text x="10" y="46" fill={LITESTORE(0.55)} fontSize="2.2" fontFamily={MONO} letterSpacing="0.6">CONVERSION · ROLLING 30D</text>
      <text x="148" y="46" textAnchor="end" fill={GREEN(0.85)} fontSize="2.2" fontFamily={MONO} fontWeight="700">↑ +20.4%</text>

      {[58, 70, 82].map((y, i) => (
        <g key={i}>
          <line x1="10" y1={y} x2="150" y2={y} stroke={LITESTORE(0.08)} strokeWidth="0.3" strokeDasharray="1 2" />
          <text x="8.5" y={y + 1} textAnchor="end" fill={LITESTORE(0.4)} fontSize="1.8" fontFamily={MONO}>{['4%', '2%', '0'][i]}</text>
        </g>
      ))}

      <g transform="translate(0, 12)">
        <path d={area} fill={`url(#${k}-area)`} />
        <path d={path} fill="none" stroke={LITESTORE(0.95)} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${k}-glow)`} className="sb-line-draw" />
        <circle cx="148" cy="12" r="1.6" fill={LITESTORE(1)} className="sidebar-hub-pulse" filter={`url(#${k}-glow)`} />
      </g>

      <g transform="translate(0, 92)">
        <text x="6" y="3" fill={WHITE(0.85)} fontSize="2.4" fontFamily={MONO} fontWeight="700">3.0s → 0.6s LCP</text>
        <text x="54" y="3" fill={LITESTORE(0.6)} fontSize="2.2" fontFamily={MONO}>· 80% faster</text>
        <text x="100" y="3" fill={WHITE(0.85)} fontSize="2.4" fontFamily={MONO} fontWeight="700">18 experiments</text>
        <text x="140" y="3" fill={LITESTORE(0.6)} fontSize="2.2" fontFamily={MONO}>shipped</text>
      </g>
    </svg>
  );
};

// ── [3] SQL Disaster Response Schema ───────────────────────────────
// ENHANCED: added 7-entity count rail at top + query log preview at
// bottom  -  matches SqlDisasterWidget's entity rail + query queue.
export const DisasterIllustration: React.FC = () => {
  const k = ns('sql');

  const entities = [
    { label: 'DISASTER', count: 5, c: '#ff3c3c' },
    { label: 'REGION', count: 7, c: '#ffaa2e' },
    { label: 'AGENCY', count: 5, c: '#3b8eff' },
    { label: 'TEAM', count: 10, c: '#00e5cc' },
    { label: 'VOLUNTEER', count: 15, c: '#c06ef0' },
    { label: 'SHELTER', count: 9, c: '#2dce68' },
    { label: 'SUPPLY', count: 10, c: '#ff6a25' },
  ];

  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <GridPattern id={`${k}-grid`} size={5} color="rgba(239,68,68,0.04)" />
        <SoftGlow id={`${k}-glow`} std={1} />
        <linearGradient id={`${k}-hdr`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={DISASTER(0.4)} />
          <stop offset="100%" stopColor={DISASTER(0.12)} />
        </linearGradient>
        <linearGradient id={`${k}-hdr-c`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={DISASTER_ORANGE(0.45)} />
          <stop offset="100%" stopColor={DISASTER(0.15)} />
        </linearGradient>
        <linearGradient id={`${k}-hdr-r`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={DISASTER_CYAN(0.35)} />
          <stop offset="100%" stopColor={DISASTER_CYAN(0.1)} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="100" fill={`url(#${k}-grid)`} opacity="0.5" />

      <text x="3" y="6.5" fill={DISASTER(0.75)} fontSize="2.8" fontFamily={MONO} letterSpacing="1.2" fontWeight="700">SCHEMA · 11 ENTITIES · 47 QUERIES</text>
      <circle cx="154" cy="5" r="1.2" fill={DISASTER(1)} className="sidebar-hub-pulse" />
      <text x="150" y="6.6" textAnchor="end" fill={DISASTER(0.65)} fontSize="2.2" fontFamily={MONO} className="sb-flicker">SYNC</text>

      {/* Entity count rail */}
      <g transform="translate(0, 9)">
        <rect x="3" y="0" width="154" height="9" rx="1.2" fill="rgba(0,0,0,0.45)" stroke={DISASTER(0.18)} strokeWidth="0.3" />
        {entities.map((e, i) => {
          const x = 7 + i * 21.5;
          return (
            <g key={i}>
              <text x={x} y="4" fill={e.c} fontSize="3.2" fontFamily={MONO} fontWeight="800">{e.count}</text>
              <text x={x} y="7.5" fill={WHITE(0.4)} fontSize="1.7" fontFamily={MONO} letterSpacing="0.3">{e.label.slice(0, 5)}</text>
            </g>
          );
        })}
      </g>

      {/* AGENCY */}
      <rect x="4" y="24" width="36" height="5.5" rx="1" fill={`url(#${k}-hdr)`} stroke={DISASTER(0.7)} strokeWidth="0.5" />
      <text x="22" y="28.2" textAnchor="middle" fill={DISASTER(0.95)} fontSize="2.8" fontFamily={MONO} fontWeight="700">AGENCY</text>
      <rect x="4" y="29.5" width="36" height="14" fill="rgba(0,0,0,0.5)" stroke={DISASTER(0.35)} strokeWidth="0.4" />
      {[
        { kk: 'PK', n: 'agency_id', t: 'INT', y: 33.5 },
        { kk: '',   n: 'name',      t: 'VARCHAR', y: 37.5 },
        { kk: '',   n: 'region',    t: 'VARCHAR', y: 41.5 },
      ].map((r, i) => (
        <g key={i}>
          <text x="6" y={r.y} fill={r.kk === 'PK' ? DISASTER(0.95) : WHITE(0.55)} fontSize="2.4" fontFamily={MONO}>
            {r.kk && <tspan fill={DISASTER(0.85)} fontWeight="700">{r.kk} </tspan>}{r.n}
          </text>
          <text x="39" y={r.y} textAnchor="end" fill={DISASTER(0.35)} fontSize="2.1" fontFamily={MONO}>{r.t}</text>
        </g>
      ))}

      {/* DISPATCH center */}
      <rect x="60" y="33" width="40" height="5.5" rx="1" fill={`url(#${k}-hdr-c)`} stroke={DISASTER_ORANGE(0.8)} strokeWidth="0.6" filter={`url(#${k}-glow)`} />
      <text x="80" y="37.2" textAnchor="middle" fill={DISASTER_ORANGE(1)} fontSize="2.8" fontFamily={MONO} fontWeight="700">DISPATCH</text>
      <rect x="60" y="38.5" width="40" height="22" fill="rgba(0,0,0,0.5)" stroke={DISASTER_ORANGE(0.35)} strokeWidth="0.4" />
      {[
        { kk: 'PK', n: 'dispatch_id', t: 'INT', y: 42.5, fk: false },
        { kk: 'FK', n: 'agency_id',   t: 'INT', y: 46.5, fk: true },
        { kk: 'FK', n: 'resource_id', t: 'INT', y: 50.5, fk: true },
        { kk: '',   n: 'qty',         t: 'INT', y: 54.5, fk: false },
        { kk: '',   n: 'eta',         t: 'DATETIME', y: 58.5, fk: false },
      ].map((r, i) => (
        <g key={i}>
          <text x="62" y={r.y} fill={r.fk ? VIOLET(0.95) : r.kk === 'PK' ? DISASTER_ORANGE(0.95) : WHITE(0.55)} fontSize="2.4" fontFamily={MONO}>
            {r.kk && <tspan fill={r.fk ? VIOLET(0.8) : DISASTER_ORANGE(0.8)} fontWeight="700">{r.kk} </tspan>}{r.n}
          </text>
          <text x="99" y={r.y} textAnchor="end" fill={DISASTER(0.35)} fontSize="2.1" fontFamily={MONO}>{r.t}</text>
        </g>
      ))}

      {/* RESOURCE */}
      <rect x="120" y="24" width="38" height="5.5" rx="1" fill={`url(#${k}-hdr-r)`} stroke={DISASTER_CYAN(0.65)} strokeWidth="0.5" />
      <text x="139" y="28.2" textAnchor="middle" fill={DISASTER_CYAN(0.95)} fontSize="2.8" fontFamily={MONO} fontWeight="700">RESOURCE</text>
      <rect x="120" y="29.5" width="38" height="14" fill="rgba(0,0,0,0.5)" stroke={DISASTER_CYAN(0.3)} strokeWidth="0.4" />
      {[
        { kk: 'PK', n: 'resource_id', t: 'INT', y: 33.5 },
        { kk: '',   n: 'type',        t: 'ENUM', y: 37.5 },
        { kk: '',   n: 'stock',       t: 'INT', y: 41.5 },
      ].map((r, i) => (
        <g key={i}>
          <text x="122" y={r.y} fill={r.kk === 'PK' ? DISASTER_CYAN(0.95) : WHITE(0.55)} fontSize="2.4" fontFamily={MONO}>
            {r.kk && <tspan fill={DISASTER_CYAN(0.8)} fontWeight="700">{r.kk} </tspan>}{r.n}
          </text>
          <text x="157" y={r.y} textAnchor="end" fill={DISASTER_CYAN(0.35)} fontSize="2.1" fontFamily={MONO}>{r.t}</text>
        </g>
      ))}

      {/* Flow relations */}
      <path d="M40 35 L52 35 L52 46 L60 46" stroke={DISASTER(0.7)} strokeWidth="0.6" fill="none" className="sb-flow-dash" />
      <polygon points="58,44.5 60,46 58,47.5" fill={DISASTER(0.7)} />
      <text x="42" y="33.5" fill={DISASTER(0.8)} fontSize="2.2" fontFamily={MONO} fontWeight="700">1</text>
      <text x="54" y="44" fill={DISASTER(0.8)} fontSize="2.2" fontFamily={MONO} fontWeight="700">N</text>

      <path d="M120 35 L108 35 L108 50 L100 50" stroke={DISASTER_CYAN(0.7)} strokeWidth="0.6" fill="none" className="sb-flow-dash" />
      <polygon points="102,48.5 100,50 102,51.5" fill={DISASTER_CYAN(0.7)} />
      <text x="115" y="33.5" fill={DISASTER_CYAN(0.8)} fontSize="2.2" fontFamily={MONO} fontWeight="700">1</text>
      <text x="102" y="48" fill={DISASTER_CYAN(0.8)} fontSize="2.2" fontFamily={MONO} fontWeight="700">N</text>

      {/* Query log (bottom-left) */}
      <g transform="translate(4, 66)">
        <rect width="84" height="30" rx="1.5" fill="rgba(0,0,0,0.6)" stroke={DISASTER(0.35)} strokeWidth="0.4" />
        <text x="3" y="4.5" fill={DISASTER(0.65)} fontSize="2" fontFamily={MONO} letterSpacing="0.5">QUERY LOG · P95</text>
        <circle cx="80" cy="3.5" r="0.9" fill={DISASTER(1)} className="sidebar-hub-pulse" />

        {[
          { q: 'shelter_stress_tier.sql', ms: '142ms', tag: 'NTILE', c: DISASTER },
          { q: 'volunteer_assignment.sql', ms: '61ms', tag: 'CTE', c: DISASTER_CYAN },
          { q: 'region_dispatch_rank.sql', ms: '34ms', tag: 'WINDOW', c: DISASTER_CYAN },
        ].map((row, i) => (
          <g key={i} transform={`translate(0, ${8 + i * 6.5})`}>
            <text x="3" y="4" fill={WHITE(0.85)} fontSize="2.2" fontFamily={MONO}>{row.q}</text>
            <text x="68" y="4" textAnchor="end" fill={row.c(0.65)} fontSize="1.7" fontFamily={MONO}>{row.tag}</text>
            <text x="80" y="4" textAnchor="end" fill={row.c(1)} fontSize="2.2" fontFamily={MONO} fontWeight="700">{row.ms}</text>
          </g>
        ))}
      </g>

      {/* P95 latency display (bottom-right) */}
      <g transform="translate(94, 66)">
        <rect width="62" height="30" rx="1.5" fill="rgba(0,0,0,0.7)" stroke={DISASTER(0.55)} strokeWidth="0.5" />
        <text x="4" y="5" fill={DISASTER(0.65)} fontSize="2.2" fontFamily={MONO} letterSpacing="0.5">FK INTEGRITY · P95</text>
        <text x="4" y="14" fill={DISASTER(1)} fontSize="8.5" fontFamily={MONO} fontWeight="700" filter={`url(#${k}-glow)`}>187<tspan fontSize="2.8" fill={DISASTER(0.6)} dx="0.5">ms</tspan></text>
        <text x="4" y="20" fill={GREEN(0.85)} fontSize="1.9" fontFamily={MONO}>✓ ALL CONSTRAINTS PASS</text>
        <g transform="translate(4, 22)">
          {[2, 3, 2, 4, 3, 5, 4, 3, 2, 4, 3, 5, 3, 4].map((h, i) => (
            <rect key={i} x={i * 4} y={6 - h * 1.1} width="3" height={h * 1.1} fill={DISASTER(0.6 + (h / 10))} />
          ))}
        </g>
      </g>
    </svg>
  );
};

// ── [4] HR Behavioural Intelligence ────────────────────────────────
// FULLY REDESIGNED: replaces the old "4-quadrant matrix" with a
// pipeline + archetype histogram + stats + Gemini insight  -  matches
// BehaviouralRiskWidget's actual structure.
export const HRMindIllustration: React.FC = () => {
  const k = ns('hr');

  const stages: { label: string; icon: string; c: (a: number) => string }[] = [
    { label: 'COLLECT', icon: '◆', c: BLUE },
    { label: 'MAP',     icon: '⚡', c: HR_PURPLE },
    { label: 'ANALYZE', icon: '◇', c: AMBER },
    { label: 'INSIGHT', icon: '●', c: GREEN },
  ];

  const archetypes: { x: number; l: string; n: number; c: (a: number) => string }[] = [
    { x: 4,   l: 'VISION',   n: 24, c: HR_PURPLE },
    { x: 33,  l: 'STEADY',   n: 19, c: GREEN },
    { x: 62,  l: 'STRETCH',  n: 18, c: AMBER },
    { x: 91,  l: 'BURNT',    n: 12, c: RED },
    { x: 120, l: 'AT-RISK',  n: 8,  c: RED },
  ];

  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <GridPattern id={`${k}-grid`} size={6} color="rgba(168,85,247,0.05)" />
        <SoftGlow id={`${k}-glow`} std={1} />
        <linearGradient id={`${k}-rail`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={BLUE(0.4)} />
          <stop offset="33%" stopColor={HR_PURPLE(0.6)} />
          <stop offset="66%" stopColor={AMBER(0.5)} />
          <stop offset="100%" stopColor={GREEN(0.6)} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="100" fill={`url(#${k}-grid)`} opacity="0.5" />

      <text x="3" y="6.5" fill={HR_PURPLE(0.85)} fontSize="2.8" fontFamily={MONO} letterSpacing="1.2" fontWeight="700">HR · BEHAVIOURAL · 13-AXIS</text>
      <circle cx="124" cy="5" r="1.2" fill={HR_PURPLE(1)} className="sidebar-hub-pulse" />
      <text x="156" y="6.6" textAnchor="end" fill={HR_PURPLE(0.85)} fontSize="2.2" fontFamily={MONO} className="sb-flicker">GEMINI · 0.94</text>

      {/* Pipeline rail */}
      <g transform="translate(0, 12)">
        <rect x="3" y="0" width="154" height="18" rx="2" fill="rgba(0,0,0,0.4)" stroke={HR_PURPLE(0.18)} strokeWidth="0.4" />
        <line x1="14" y1="9" x2="146" y2="9" stroke={`url(#${k}-rail)`} strokeWidth="0.6" strokeDasharray="2 1.5" className="sb-flow-dash" />

        {stages.map((s, i) => {
          const x = 14 + i * 44;
          return (
            <g key={i}>
              <circle cx={x} cy="9" r="4" fill="rgba(0,0,0,0.85)" stroke={s.c(0.95)} strokeWidth="0.6"
                className={i === 1 ? 'sidebar-hub-pulse' : undefined}
                filter={i === 1 ? `url(#${k}-glow)` : undefined} />
              <text x={x} y="10.4" textAnchor="middle" fill={s.c(1)} fontSize="3.5" fontFamily={MONO} fontWeight="700">{s.icon}</text>
              <text x={x} y="16.5" textAnchor="middle" fill={s.c(0.8)} fontSize="1.9" fontFamily={MONO} letterSpacing="0.4" fontWeight="700">{s.label}</text>
            </g>
          );
        })}
      </g>

      {/* Archetypes histogram */}
      <g transform="translate(0, 36)">
        <text x="3" y="3" fill={HR_PURPLE(0.55)} fontSize="2.2" fontFamily={MONO} letterSpacing="0.6">8 ARCHETYPES · DOMINANT: VISIONARY</text>
        <text x="156" y="3" textAnchor="end" fill={HR_PURPLE(0.45)} fontSize="2" fontFamily={MONO}>127 responses</text>

        {archetypes.map((a, i) => {
          const h = a.n * 0.55;
          const y = 24 - h;
          return (
            <g key={i}>
              <rect x={a.x} y={y} width="22" height={h} rx="0.6"
                fill={a.c(0.22)} stroke={a.c(0.95)} strokeWidth="0.5"
                filter={i === 0 ? `url(#${k}-glow)` : undefined}
                className={i === 0 ? 'sb-breathe' : undefined} />
              <text x={a.x + 11} y={y - 1.2} textAnchor="middle" fill={a.c(1)} fontSize="2.6" fontFamily={MONO} fontWeight="700">{a.n}</text>
              <text x={a.x + 11} y="28" textAnchor="middle" fill={WHITE(0.6)} fontSize="1.9" fontFamily={MONO} letterSpacing="0.3" fontWeight="600">{a.l}</text>
            </g>
          );
        })}
      </g>

      {/* Stats + Gemini insight */}
      <g transform="translate(0, 68)">
        <rect x="3" y="0" width="46" height="26" rx="1.5" fill="rgba(0,0,0,0.65)" stroke={ORANGE(0.4)} strokeWidth="0.4" />
        <text x="6" y="5" fill={ORANGE(0.7)} fontSize="2.1" fontFamily={MONO} letterSpacing="0.6">AVG ENGAGEMENT</text>
        <text x="6" y="14" fill={ORANGE(1)} fontSize="7" fontFamily={MONO} fontWeight="700" filter={`url(#${k}-glow)`}>5.4<tspan fontSize="2.2" fill={ORANGE(0.55)}> /10</tspan></text>
        <rect x="6" y="17" width="40" height="1.6" rx="0.4" fill={ORANGE(0.12)} />
        <rect x="6" y="17" width="22" height="1.6" rx="0.4" fill={ORANGE(0.9)} className="sb-breathe" />
        <text x="6" y="22.5" fill={ORANGE(0.55)} fontSize="1.7" fontFamily={MONO}>↓ 0.6 vs Q1</text>

        <rect x="52" y="0" width="46" height="26" rx="1.5" fill="rgba(0,0,0,0.65)" stroke={RED(0.5)} strokeWidth="0.4" />
        <text x="55" y="5" fill={RED(0.85)} fontSize="2.1" fontFamily={MONO} letterSpacing="0.6">FLIGHT RISK</text>
        <text x="93" y="5" textAnchor="end" fill={RED(1)} fontSize="2" fontFamily={MONO} fontWeight="700" className="sb-flicker">●</text>
        <text x="55" y="14" fill={RED(1)} fontSize="7" fontFamily={MONO} fontWeight="700">8<tspan fontSize="2.2" fill={RED(0.55)} dx="1">silent</tspan></text>
        <text x="55" y="22.5" fill={RED(0.65)} fontSize="1.7" fontFamily={MONO}>high-perf · misaligned</text>

        <rect x="101" y="0" width="56" height="26" rx="1.5" fill="rgba(0,0,0,0.65)" stroke={HR_PURPLE(0.4)} strokeWidth="0.4" />
        <text x="103" y="5" fill={HR_PURPLE(0.65)} fontSize="2.1" fontFamily={MONO} letterSpacing="0.6">✦ GEMINI INSIGHT</text>
        <text x="103" y="11" fill={WHITE(0.9)} fontSize="2.2" fontFamily={MONO} fontWeight="600">8 high performers</text>
        <text x="103" y="15" fill={WHITE(0.65)} fontSize="2.2" fontFamily={MONO}>show workload</text>
        <text x="103" y="19" fill={WHITE(0.65)} fontSize="2.2" fontFamily={MONO}>misalignment.</text>
        <text x="103" y="23.5" fill={HR_PURPLE(0.85)} fontSize="1.9" fontFamily={MONO} className="sb-flicker">→ recommend 1:1</text>
      </g>
    </svg>
  );
};

// ── [5] Spotify Audio Feature Space ────────────────────────────────
// REFINED: dimension rail across the top matches SpotifyWidget's
// 6-dim row; nearest-neighbour list right panel matches the widget's
// recommendation queue.
export const SpotifyIllustration: React.FC = () => {
  const k = ns('sp');
  const tracks: { x: number; y: number; r: number; a: number; query?: boolean }[] = [
    { x: 38, y: 28, r: 1.8, a: 0.5 },
    { x: 48, y: 38, r: 2.2, a: 0.6 },
    { x: 30, y: 50, r: 1.4, a: 0.4 },
    { x: 58, y: 56, r: 1.6, a: 0.5 },
    { x: 70, y: 30, r: 2.6, a: 0.75 },
    { x: 82, y: 44, r: 3.4, a: 1.0, query: true },
    { x: 92, y: 30, r: 2.2, a: 0.7 },
    { x: 100, y: 56, r: 1.8, a: 0.5 },
    { x: 112, y: 38, r: 2.4, a: 0.7 },
    { x: 120, y: 52, r: 1.6, a: 0.45 },
    { x: 124, y: 30, r: 1.4, a: 0.4 },
    { x: 42, y: 68, r: 1.2, a: 0.35 },
    { x: 76, y: 70, r: 1.8, a: 0.55 },
    { x: 110, y: 70, r: 1.4, a: 0.4 },
    { x: 64, y: 22, r: 1.2, a: 0.35 },
  ];
  const query = tracks.find(t => t.query)!;
  const ranked = tracks
    .filter(t => !t.query)
    .map(t => ({ ...t, d: Math.hypot(t.x - query.x, t.y - query.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);

  const dims = [
    { l: 'VAL', v: 91 },
    { l: 'TMP', v: 65 },
    { l: 'ENR', v: 74 },
    { l: 'DNC', v: 82 },
    { l: 'ACS', v: 12 },
    { l: 'LIV', v: 18 },
  ];

  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <GridPattern id={`${k}-grid`} size={6} color="rgba(29,185,84,0.06)" />
        <radialGradient id={`${k}-q`}>
          <stop offset="0%" stopColor={SPOTIFY(1)} />
          <stop offset="100%" stopColor={SPOTIFY(0)} />
        </radialGradient>
        <SoftGlow id={`${k}-glow`} std={1} />
        <linearGradient id={`${k}-conn`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SPOTIFY(0.7)} />
          <stop offset="100%" stopColor={SPOTIFY_LIGHT(0.3)} />
        </linearGradient>
      </defs>

      <text x="3" y="6.5" fill={SPOTIFY(0.85)} fontSize="2.8" fontFamily={MONO} letterSpacing="1" fontWeight="700">VECTOR SPACE · 1.2M TRACKS · 12D</text>
      <circle cx="154" cy="5" r="1" fill={SPOTIFY(1)} className="sidebar-hub-pulse" />
      <text x="150" y="6.6" textAnchor="end" fill={SPOTIFY(0.7)} fontSize="2.2" fontFamily={MONO} className="sb-flicker">MODEL OK</text>
      <line x1="3" y1="8.5" x2="157" y2="8.5" stroke={SPOTIFY(0.18)} strokeWidth="0.3" />

      {/* Dimension rail */}
      <g transform="translate(0, 11)">
        <rect x="3" y="0" width="154" height="9" rx="1" fill="rgba(0,0,0,0.4)" stroke={SPOTIFY(0.15)} strokeWidth="0.3" />
        {dims.map((d, i) => {
          const x = 8 + i * 25;
          return (
            <g key={i}>
              <text x={x} y="4" fill={SPOTIFY(1)} fontSize="3" fontFamily={MONO} fontWeight="800">{d.v}</text>
              <text x={x} y="7.5" fill={SPOTIFY(0.45)} fontSize="1.7" fontFamily={MONO} letterSpacing="0.3">{d.l}</text>
            </g>
          );
        })}
      </g>

      <rect x="6" y="22" width="100" height="56" fill={`url(#${k}-grid)`} opacity="0.6" />
      <text x="9" y="26" fill={SPOTIFY(0.5)} fontSize="2" fontFamily={MONO}>DIM_3</text>
      <text x="103" y="76" textAnchor="end" fill={SPOTIFY(0.5)} fontSize="2" fontFamily={MONO}>DIM_7 →</text>

      {ranked.map((t, i) => (
        <line key={i} x1={query.x} y1={query.y} x2={t.x} y2={t.y}
          stroke={`url(#${k}-conn)`} strokeWidth="0.5" className="sb-flow-dash" />
      ))}

      <circle cx={query.x} cy={query.y} r="8" fill={`url(#${k}-q)`} opacity="0.3" className="sb-breathe" />
      <circle cx={query.x} cy={query.y} r="6" fill="none" stroke={SPOTIFY(0.7)} strokeWidth="0.4" strokeDasharray="1 1.5" className="sb-rotate-slow" />

      {tracks.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={t.r}
          fill={SPOTIFY(t.a)} stroke={t.query ? SPOTIFY(1) : 'none'} strokeWidth="0.6"
          filter={t.query ? `url(#${k}-glow)` : undefined}
          className={t.query ? 'sidebar-hub-pulse' : 'sb-dot-twinkle'}
          style={!t.query ? { animationDelay: `${i * 0.2}s` } : undefined} />
      ))}

      <g>
        <line x1={query.x + 4} y1={query.y - 4} x2={query.x + 12} y2={query.y - 12} stroke={SPOTIFY(0.5)} strokeWidth="0.3" />
        <text x={query.x + 13} y={query.y - 12.5} fill={SPOTIFY(1)} fontSize="2.4" fontFamily={MONO} fontWeight="700">QUERY</text>
        <text x={query.x + 13} y={query.y - 9} fill={SPOTIFY_LIGHT(0.65)} fontSize="2.2" fontFamily={MONO}>k=5 · cos</text>
      </g>

      {/* Nearest neighbour panel */}
      <g transform="translate(110, 22)">
        <rect width="46" height="56" rx="1.5" fill="rgba(0,0,0,0.55)" stroke={SPOTIFY(0.25)} strokeWidth="0.4" />
        <text x="3" y="4.5" fill={SPOTIFY(0.6)} fontSize="2" fontFamily={MONO} letterSpacing="0.5">NEAREST · cos θ</text>

        {[
          { name: 'Holocene',      sim: 94 },
          { name: 'Latch',         sim: 89 },
          { name: 'Firestarter',   sim: 86 },
          { name: 'Flightless B.', sim: 83 },
          { name: 'One More Time', sim: 81 },
        ].map((r, i) => (
          <g key={i} transform={`translate(0, ${8 + i * 7})`}>
            <rect x="2" y="0" width="42" height="6" rx="0.6"
              fill={i === 0 ? SPOTIFY(0.1) : 'transparent'}
              stroke={i === 0 ? SPOTIFY(0.4) : 'none'} strokeWidth="0.3" />
            <text x="4" y="4" fill={i === 0 ? WHITE(0.95) : WHITE(0.6)} fontSize="2.2" fontFamily={MONO} fontWeight={i === 0 ? '700' : '500'}>{r.name}</text>
            <text x="42" y="4" textAnchor="end" fill={SPOTIFY(i === 0 ? 1 : 0.6)} fontSize="2.2" fontFamily={MONO} fontWeight="700">{r.sim}%</text>
          </g>
        ))}
      </g>

      <g transform="translate(0, 84)">
        <text x="6" y="3" fill={WHITE(0.85)} fontSize="2.2" fontFamily={MONO} fontWeight="700">TF-IDF + COSINE</text>
        <text x="46" y="3" fill={SPOTIFY(0.55)} fontSize="2" fontFamily={MONO}>· MSD-MSC join</text>
        <text x="156" y="3" textAnchor="end" fill={SPOTIFY(0.9)} fontSize="2.2" fontFamily={MONO} fontWeight="700">cold-start solved</text>
      </g>
    </svg>
  );
};

// ── [7] Capital Budgeting (unchanged from your original) ───────────
// Keeping this in case you still use it elsewhere.
export const CapitalIllustration: React.FC = () => {
  const k = ns('cap');
  type Step = { label: string; val: number; kind: 'out' | 'in' | 'term' | 'npv' };
  const data: Step[] = [
    { label: 'CapEx', val: -581, kind: 'out' },
    { label: 'Y1',    val: 142, kind: 'in' },
    { label: 'Y2',    val: 168, kind: 'in' },
    { label: 'Y3',    val: 191, kind: 'in' },
    { label: 'Y4',    val: 188, kind: 'in' },
    { label: 'Y5',    val: 175, kind: 'in' },
    { label: 'Term',  val: 220, kind: 'term' },
    { label: 'NPV',   val: 503, kind: 'npv' },
  ];

  const top = 24, btmAxis = 78;
  const maxAbs = 800;
  const scale = (btmAxis - top) / maxAbs;
  const zeroY = btmAxis - 200 * scale;

  let running = 0;
  const bars = data.map((d, i) => {
    if (d.kind === 'npv') {
      const h = Math.abs(d.val) * scale;
      return { x: 18 + i * 16, y: zeroY - h, h, v: d.val, kind: d.kind, label: d.label };
    }
    const prev = running;
    running += d.val;
    const y1 = zeroY - prev * scale;
    const y2 = zeroY - running * scale;
    return {
      x: 18 + i * 16,
      y: Math.min(y1, y2),
      h: Math.abs(y2 - y1),
      v: d.val,
      kind: d.kind,
      label: d.label,
    };
  });

  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <GridPattern id={`${k}-grid`} size={6} color="rgba(245,158,11,0.04)" />
        <linearGradient id={`${k}-in`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={GREEN(0.55)} />
          <stop offset="100%" stopColor={GREEN(0.15)} />
        </linearGradient>
        <linearGradient id={`${k}-out`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={RED(0.55)} />
          <stop offset="100%" stopColor={RED(0.18)} />
        </linearGradient>
        <linearGradient id={`${k}-npv`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={CAPITAL_AMBER(0.75)} />
          <stop offset="100%" stopColor={CAPITAL_AMBER(0.2)} />
        </linearGradient>
        <linearGradient id={`${k}-term`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={CAPITAL_AMBER(0.55)} />
          <stop offset="100%" stopColor={CAPITAL_AMBER(0.12)} />
        </linearGradient>
      </defs>

      <text x="3" y="8" fill={CAPITAL_AMBER(0.65)} fontSize="2.8" fontFamily={MONO} letterSpacing="1.2">DCF · WACC 11.4%</text>
      <circle cx="155" cy="6.5" r="1" fill={CAPITAL_AMBER(1)} className="sidebar-hub-pulse" />
      <text x="151" y="8" textAnchor="end" fill={WHITE(0.92)} fontSize="2.8" fontFamily={MONO} letterSpacing="0.6" className="sb-flicker">CapEx ₱581M</text>
      <line x1="3" y1="10" x2="157" y2="10" stroke={CAPITAL_AMBER(0.15)} strokeWidth="0.3" />

      <rect x="14" y={top - 2} width="140" height={btmAxis - top + 4} fill={`url(#${k}-grid)`} opacity="0.6" />
      <line x1="14" y1={zeroY} x2="154" y2={zeroY} stroke={CAPITAL_AMBER(0.35)} strokeWidth="0.4" />
      <text x="13" y={zeroY + 0.8} textAnchor="end" fill={CAPITAL_AMBER(0.5)} fontSize="2" fontFamily={MONO}>0</text>
      {[200, 400, 600].map(v => (
        <g key={v}>
          <line x1="14" y1={zeroY - v * scale} x2="154" y2={zeroY - v * scale} stroke={CAPITAL_AMBER(0.08)} strokeWidth="0.3" strokeDasharray="1 2" />
          <text x="13" y={zeroY - v * scale + 0.8} textAnchor="end" fill={CAPITAL_AMBER(0.35)} fontSize="1.8" fontFamily={MONO}>{v}</text>
        </g>
      ))}

      {bars.map((b, i) => {
        const fill = b.kind === 'out' ? `url(#${k}-out)`
          : b.kind === 'npv' ? `url(#${k}-npv)`
          : b.kind === 'term' ? `url(#${k}-term)`
          : `url(#${k}-in)`;
        const stroke = b.kind === 'out' ? RED(0.9)
          : b.kind === 'npv' ? CAPITAL_AMBER(1)
          : b.kind === 'term' ? CAPITAL_AMBER(0.7)
          : GREEN(0.85);
        const labelColor = b.kind === 'out' ? RED(0.95)
          : b.kind === 'npv' ? CAPITAL_AMBER(1)
          : b.kind === 'term' ? CAPITAL_AMBER(0.85)
          : GREEN(0.9);
        return (
          <g key={i}>
            <rect x={b.x} y={b.y} width="10" height={Math.max(b.h, 0.6)} fill={fill} stroke={stroke} strokeWidth="0.4"
              className={b.kind === 'npv' ? 'sb-breathe' : undefined} />
            {i < bars.length - 2 && (
              <line x1={b.x + 10} y1={b.kind === 'out' ? b.y + b.h : b.y} x2={b.x + 16}
                y2={b.kind === 'out' ? b.y + b.h : b.y}
                stroke={CAPITAL_AMBER(0.4)} strokeWidth="0.3" className="sb-flow-dash" />
            )}
            <text x={b.x + 5} y={btmAxis + 4} textAnchor="middle" fill={CAPITAL_AMBER(0.55)} fontSize="2.1" fontFamily={MONO}>{b.label}</text>
            <text x={b.x + 5} y={b.y - 1.2} textAnchor="middle" fill={labelColor} fontSize="2.1" fontFamily={MONO} fontWeight="600">
              {b.v > 0 ? '+' : ''}{b.v}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── [8] Dispatcher ─────────────────────────────────────────────────
export const getProjectIllustration = (projectId: string): React.ReactElement => {
  switch (projectId) {
    case 'litestore':      return <LiteStoreIllustration />;
    case 'sql-disaster':   return <DisasterIllustration />;
    case 'hr-archetype':   return <HRMindIllustration />;
    case 'spotify-engine': return <SpotifyIllustration />;
    case 'off-the-pace':   return <DefaultIllustration />;
    case 'capital':        return <CapitalIllustration />;
    default:               return <DefaultIllustration />;
  }
};
