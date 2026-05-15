import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// SQL - Relational Command Network
// An ERD-style live topology showing all 6 database entities
// with animated data packets flowing through the mesh.
// ============================================================
export const SqlVisual = () => {
  const nodes = [
    { x: 52,  y: 30,  label: 'OP_DB',    sub: '8.4K rows' },
    { x: 140, y: 20,  label: 'AGENCY',   sub: '52 entities' },
    { x: 228, y: 30,  label: 'RELIEF',   sub: '1.2K ops' },
    { x: 140, y: 60,  label: 'COORD',    sub: 'HUB · PK' },
    { x: 52,  y: 88,  label: 'LOC',      sub: '312 pts' },
    { x: 228, y: 88,  label: 'RESOURCE', sub: '2.9K units' },
  ];

  const edges: [number, number][] = [
    [0, 3], [1, 3], [2, 3],
    [3, 4], [3, 5],
    [0, 1], [2, 1],
    [4, 5],
  ];

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(239,68,68,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.8)_1px,transparent_1px)] bg-[size:18px_18px]" />

      <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="sql-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="sql-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Hub glow */}
        <circle cx={140} cy={60} r="22" fill="url(#sql-hub-glow)" />

        {/* Edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(239,68,68,0.2)"
            strokeWidth="0.6"
            strokeDasharray="5,4"
            animate={{ strokeDashoffset: [0, -9] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: i * 0.12 }}
          />
        ))}

        {/* Data packets flowing along edges */}
        {edges.map(([a, b], i) => (
          <motion.circle
            key={`pkt-${i}`}
            r={1.8}
            fill="#ef4444"
            style={{ filter: 'url(#sql-glow)' }}
            animate={{ 
              cx: [nodes[a].x, nodes[b].x],
              cy: [nodes[a].y, nodes[b].y],
              opacity: [0, 1, 0] 
            }}
            transition={{
              duration: 1.5 + i * 0.1,
              repeat: Infinity,
              delay: i * 0.38,
              ease: 'linear',
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle cx={n.x} cy={n.y} r="10"
              fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="0.5"
              animate={{ r: [9, 13, 9], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
            <rect x={n.x - 13} y={n.y - 9} width="26" height="18" rx="3"
              fill="rgba(5,5,5,0.95)" stroke="rgba(239,68,68,0.38)" strokeWidth="0.65"
            />
            {/* Internal table rows visual */}
            <line x1={n.x - 9} y1={n.y - 2} x2={n.x + 9} y2={n.y - 2} stroke="rgba(239,68,68,0.18)" strokeWidth="0.4" />
            <line x1={n.x - 9} y1={n.y + 2} x2={n.x + 9} y2={n.y + 2} stroke="rgba(239,68,68,0.10)" strokeWidth="0.4" />
            <text x={n.x} y={n.y + 1.5} fontSize="3.8" textAnchor="middle"
              fill="rgba(239,68,68,0.92)" fontFamily="monospace" fontWeight="bold">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 16} fontSize="2.8" textAnchor="middle"
              fill="rgba(239,68,68,0.28)" fontFamily="monospace">
              {n.sub}
            </text>
          </g>
        ))}

        {/* Status footer removed */}
      </svg>
    </div>
  );
};

// ============================================================
// LiteStore - Lighthouse Performance Observatory
// Real-world performance metrics: score rings, LCP speedometer,
// and conversion uplift chart.
// ============================================================
export const LiteStoreVisual = () => {
  const scores = [
    { label: 'Performance', val: 98, color: '#00c8b4' },
    { label: 'Accessibility', val: 92, color: '#00c8b4' },
    { label: 'Best Practices', val: 95, color: '#00c8b4' },
    { label: 'SEO', val: 100, color: '#00c8b4' },
  ];

  const circumference = 2 * Math.PI * 30; // r=30

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(0,200,180,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,180,0.5)_1px,transparent_1px)] bg-[size:16px_16px]" />

      <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* LEFT: LCP Performance Ring */}
        <g transform="translate(55, 52)">
          {/* Background ring */}
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(0,200,180,0.08)" strokeWidth="4" />
          {/* Outer tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg - 90) * Math.PI / 180;
            const x1 = 34 * Math.cos(rad);
            const y1 = 34 * Math.sin(rad);
            const x2 = (i % 3 === 0 ? 37 : 36) * Math.cos(rad);
            const y2 = (i % 3 === 0 ? 37 : 36) * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,200,180,0.2)" strokeWidth={i % 3 === 0 ? "0.8" : "0.4"} />;
          })}
          {/* Animated fill ring – 80% of 360° = 288° arc (representing the 80% load improvement) */}
          <motion.circle
            cx="0" cy="0" r="30"
            fill="none"
            stroke="url(#cyan-sweep)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * 0.2 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '0 0', rotate: '-90deg', filter: 'url(#cyan-glow)' }}
          />
          {/* Center text */}
          <text x="0" y="-5" fontSize="14" textAnchor="middle" fill="#00c8b4" fontFamily="monospace" fontWeight="bold">0.6s</text>
          <text x="0" y="7" fontSize="4" textAnchor="middle" fill="rgba(0,200,180,0.45)" fontFamily="monospace">LCP P95</text>
          <text x="0" y="15" fontSize="3.5" textAnchor="middle" fill="rgba(0,200,180,0.3)" fontFamily="monospace">← 3.0s</text>
        </g>
        <defs>
          <linearGradient id="cyan-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00c8b4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00c8b4" />
          </linearGradient>
        </defs>

        {/* Vertical divider */}
        <line x1="105" y1="12" x2="105" y2="98" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* RIGHT: Lighthouse scores */}
        <g transform="translate(115, 14)">
          <text x="0" y="0" fontSize="3.5" fill="rgba(0,200,180,0.35)" fontFamily="monospace" fontWeight="bold">
            LIGHTHOUSE AUDIT
          </text>
          {scores.map((s, i) => {
            const barWidth = 148;
            const fillWidth = (s.val / 100) * barWidth;
            return (
              <g key={i} transform={`translate(0, ${12 + i * 20})`}>
                <text x="0" y="7" fontSize="4" fill="rgba(255,255,255,0.4)" fontFamily="monospace">{s.label}</text>
                {/* Bar track */}
                <rect x="0" y="10" width={barWidth} height="4" rx="2" fill="rgba(255,255,255,0.04)" />
                {/* Bar fill */}
                <motion.rect
                  x="0" y="10"
                  height="4" rx="2"
                  fill={s.color}
                  opacity={0.7}
                  initial={{ width: 0 }}
                  animate={{ width: fillWidth }}
                  transition={{ duration: 1.5, delay: 0.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Score value */}
                <text x={barWidth + 5} y="15" fontSize="5" fill={s.color} fontFamily="monospace" fontWeight="bold">{s.val}</text>
              </g>
            );
          })}
        </g>

        {/* Status footer removed */}
      </svg>
    </div>
  );
};

// ============================================================
// Spotify Engine - Acoustic DNA Radar
// A multi-axis radar chart visualizing audio feature vectors
// across the 12-dimensional acoustic space.
// ============================================================
export const SpotifyVisual = () => {
  const CX = 85, CY = 56, MAX_R = 38;

  const features = [
    { label: 'Valence',   v: 0.91 },
    { label: 'Tempo',     v: 0.65 },
    { label: 'Energy',    v: 0.74 },
    { label: 'Live',      v: 0.18 },
    { label: 'Acoustic',  v: 0.12 },
    { label: 'Dance',     v: 0.82 },
  ];

  const getPoint = (idx: number, r: number) => {
    const angle = (idx * 60 - 90) * Math.PI / 180;
    return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)];
  };

  const hexPath = (frac: number) => {
    const pts = features.map((_, i) => {
      const [x, y] = getPoint(i, frac * MAX_R);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts[0]} L${pts.slice(1).join(' L')} Z`;
  };

  const dataPath = () => {
    const pts = features.map((f, i) => {
      const [x, y] = getPoint(i, f.v * MAX_R);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts[0]} L${pts.slice(1).join(' L')} Z`;
  };

  const labelOffset = MAX_R + 11;
  const labelPositions = features.map((f, i) => {
    const [x, y] = getPoint(i, labelOffset);
    return { x, y, label: f.label };
  });

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(rgba(29,185,84,0.4)_1px,transparent_1px)] bg-[size:12px_12px]" />

      <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="spotify-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1db954" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1db954" stopOpacity="0.1" />
          </linearGradient>
          <filter id="spotify-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Radar grid */}
        {[0.33, 0.66, 1.0].map((frac, i) => (
          <path key={i} d={hexPath(frac)}
            fill="none"
            stroke={frac === 1 ? "rgba(29,185,84,0.2)" : "rgba(29,185,84,0.08)"}
            strokeWidth={frac === 1 ? "0.7" : "0.4"}
          />
        ))}

        {/* Axis spokes */}
        {features.map((_, i) => {
          const [x, y] = getPoint(i, MAX_R);
          return (
            <line key={i}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke="rgba(29,185,84,0.12)" strokeWidth="0.4"
            />
          );
        })}

        {/* Axis dots at ends */}
        {features.map((_, i) => {
          const [x, y] = getPoint(i, MAX_R);
          return <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(29,185,84,0.3)" />;
        })}

        {/* Data polygon - animated in */}
        <motion.path
          d={dataPath()}
          fill="url(#spotify-fill)"
          stroke="#1db954"
          strokeWidth="1.2"
          strokeLinejoin="round"
          filter="url(#spotify-glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Data point dots */}
        {features.map((f, i) => {
          const [x, y] = getPoint(i, f.v * MAX_R);
          return (
            <motion.circle key={i} cx={x} cy={y} r="2"
              fill="#1db954"
              filter="url(#spotify-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 + 0.5 }}
            />
          );
        })}

        {/* Axis labels */}
        {labelPositions.map((p, i) => (
          <text key={i} x={p.x} y={p.y + 1.5}
            fontSize="3.5" textAnchor="middle"
            fill="rgba(29,185,84,0.45)" fontFamily="monospace">
            {p.label}
          </text>
        ))}

        {/* Center dot */}
        <circle cx={CX} cy={CY} r="1.5" fill="#1db954" opacity="0.6" />

        {/* Vertical divider */}
        <line x1="155" y1="12" x2="155" y2="98" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* RIGHT: Stats panel */}
        <g transform="translate(165, 18)">
          {/* Dataset stat */}
          <text x="0" y="0" fontSize="3.2" fill="rgba(29,185,84,0.35)" fontFamily="monospace" fontWeight="bold">DATASET</text>
          <text x="0" y="12" fontSize="18" fill="#1db954" fontFamily="monospace" fontWeight="bold">1.2M</text>
          <text x="0" y="21" fontSize="3.5" fill="rgba(29,185,84,0.45)" fontFamily="monospace">Tracks Processed</text>

          <line x1="0" y1="28" x2="105" y2="28" stroke="rgba(29,185,84,0.1)" strokeWidth="0.5" />

          {/* Feature space */}
          <text x="0" y="38" fontSize="3.2" fill="rgba(29,185,84,0.35)" fontFamily="monospace" fontWeight="bold">DIMENSIONS</text>
          <text x="0" y="50" fontSize="18" fill="rgba(29,185,84,0.85)" fontFamily="monospace" fontWeight="bold">12D</text>
          <text x="0" y="59" fontSize="3.5" fill="rgba(29,185,84,0.45)" fontFamily="monospace">Feature Space</text>

          <line x1="0" y1="66" x2="105" y2="66" stroke="rgba(29,185,84,0.1)" strokeWidth="0.5" />

          {/* Model */}
          <text x="0" y="76" fontSize="3.2" fill="rgba(29,185,84,0.35)" fontFamily="monospace" fontWeight="bold">VECTOR LOGIC</text>
          <text x="0" y="88" fontSize="8" fill="rgba(29,185,84,0.75)" fontFamily="monospace" fontWeight="bold">Cosine</text>
          <text x="0" y="97" fontSize="3.5" fill="rgba(29,185,84,0.45)" fontFamily="monospace">Similarity Metric</text>
        </g>

        {/* Status footer removed */}
      </svg>
    </div>
  );
};

// ============================================================
// HR Archetype - Behavioral Classification Matrix
// Shows the 8-archetype classification engine with flight risk
// gauge and real-time behavioral axis indicators.
// ============================================================
export const HRArchetypeVisual = () => {
  const archetypes = [
    'ACHIEVER', 'BUILDER', 'CONNECTOR', 'DEFENDER',
    'EXPLORER', 'GUARDIAN', 'INNOVATOR', 'ORACLE',
  ];
  const activeIdx = 0; // ACHIEVER is active

  const axes13 = [
    { label: 'Ambition',     v: 0.92 },
    { label: 'Collaboration',v: 0.71 },
    { label: 'Autonomy',     v: 0.85 },
    { label: 'Stability',    v: 0.38 },
    { label: 'Recognition',  v: 0.79 },
    { label: 'Innovation',   v: 0.88 },
    { label: 'Loyalty',      v: 0.44 },
    { label: 'Growth',       v: 0.96 },
    { label: 'Risk Aversion',v: 0.22 },
    { label: 'Empathy',      v: 0.65 },
    { label: 'Leadership',   v: 0.83 },
    { label: 'Agility',      v: 0.77 },
    { label: 'Purpose',      v: 0.91 },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(rgba(168,85,247,0.5)_1px,transparent_1px)] bg-[size:14px_14px]" />

      <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="purple-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* TOP LABEL */}
        <text x="8" y="12" fontSize="3.5" fill="rgba(168,85,247,0.4)" fontFamily="monospace" fontWeight="bold">
          BEHAVIORAL ARCHETYPE CLASSIFICATION ENGINE
        </text>

        {/* 2x4 Archetype grid */}
        {archetypes.map((name, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const cellW = 37;
          const cellH = 18;
          const gapX = 3;
          const gapY = 5;
          const startX = 6;
          const startY = 18;
          const x = startX + col * (cellW + gapX);
          const y = startY + row * (cellH + gapY);
          const isActive = i === activeIdx;

          return (
            <g key={i}>
              {isActive && (
                <motion.rect x={x - 1} y={y - 1} width={cellW + 2} height={cellH + 2} rx="3"
                  fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="0.8"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <rect x={x} y={y} width={cellW} height={cellH} rx="2.5"
                fill={isActive ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.015)"}
                stroke={isActive ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.12)"}
                strokeWidth="0.5"
              />
              <text x={x + cellW / 2} y={y + cellH / 2 + 1.5}
                fontSize="3.2" textAnchor="middle"
                fill={isActive ? "rgba(168,85,247,0.95)" : "rgba(168,85,247,0.35)"}
                fontFamily="monospace" fontWeight="bold">
                {name}
              </text>
              {isActive && (
                <motion.circle cx={x + cellW - 4} cy={y + 4} r="1.5" fill="#a855f7"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {/* Scan line animation — no SVG y attr so Framer's y prop is unambiguous */}
        <motion.rect
          x="5" width="158" height="1"
          fill="rgba(168,85,247,0.25)"
          animate={{ y: [17, 61, 17] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Vertical divider */}
        <line x1="170" y1="12" x2="170" y2="98" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* RIGHT: 13-axis diagnostic bars */}
        <g transform="translate(178, 14)">
          <text x="0" y="0" fontSize="3.2" fill="rgba(168,85,247,0.4)" fontFamily="monospace" fontWeight="bold">
            13-AXIS DIAGNOSTIC
          </text>
          {axes13.map((ax, i) => (
            <g key={i} transform={`translate(0, ${7 + i * 7})`}>
              <text x="0" y="5" fontSize="2.5" fill="rgba(168,85,247,0.35)" fontFamily="monospace"
                style={{ textAnchor: 'start' }}>
                {ax.label.slice(0, 9)}
              </text>
              <rect x="42" y="1" width="52" height="3.5" rx="1" fill="rgba(255,255,255,0.04)" />
              <motion.rect x="42" y="1" height="3.5" rx="1"
                fill="#a855f7" opacity={0.65}
                initial={{ width: 0 }}
                animate={{ width: ax.v * 52 }}
                transition={{ duration: 1.2, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            </g>
          ))}
        </g>

        {/* Status footer removed */}
      </svg>
    </div>
  );
};

// ============================================================
// Capital Budgeting - Scenario Analysis Engine
// Three-scenario feasibility model with NPV bars, IRR
// projections, and payback period visualization.
// ============================================================
export const FinanceVisual = () => {
  const scenarios = [
    { label: 'CONSERVATIVE', irr: '18.2%', npv: '₱0.2M', payback: '4.1Y', barFrac: 0.30, color: 'rgba(245,158,11,0.42)' },
    { label: 'BASE CASE',    irr: '24.8%', npv: '₱0.4M', payback: '3.2Y', barFrac: 0.55, color: '#f59e0b' },
    { label: 'OPTIMISTIC',   irr: '31.5%', npv: '₱0.7M', payback: '2.1Y', barFrac: 0.75, color: 'rgba(245,158,11,0.8)' },
  ];

  const barBottom = 90;
  const barMaxH = 65;
  const barW = 44;
  const gap = 16;
  const startX = 68;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(245,158,11,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.5)_1px,transparent_1px)] bg-[size:16px_16px]" />

      <svg className="w-full h-full" viewBox="0 0 280 110" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="amber-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* LEFT: Capital summary */}
        <g transform="translate(8, 16)">
          <text x="0" y="0" fontSize="3.2" fill="rgba(245,158,11,0.4)" fontFamily="monospace" fontWeight="bold">
            CAPEX MODEL
          </text>
          <text x="0" y="18" fontSize="16" fill="#f59e0b" fontFamily="monospace" fontWeight="bold">₱581M</text>
          <text x="0" y="28" fontSize="3.5" fill="rgba(245,158,11,0.4)" fontFamily="monospace">Industrial</text>
          <text x="0" y="35" fontSize="3.5" fill="rgba(245,158,11,0.4)" fontFamily="monospace">Maritime</text>

          <line x1="0" y1="42" x2="50" y2="42" stroke="rgba(245,158,11,0.12)" strokeWidth="0.5" />

          <text x="0" y="52" fontSize="3.2" fill="rgba(245,158,11,0.3)" fontFamily="monospace">WACC</text>
          <text x="0" y="64" fontSize="10" fill="rgba(245,158,11,0.7)" fontFamily="monospace" fontWeight="bold">14.2%</text>
          <text x="0" y="73" fontSize="3.5" fill="rgba(245,158,11,0.3)" fontFamily="monospace">Adjusted</text>

          <line x1="0" y1="80" x2="50" y2="80" stroke="rgba(245,158,11,0.12)" strokeWidth="0.5" />
          <text x="0" y="90" fontSize="3.2" fill="rgba(245,158,11,0.3)" fontFamily="monospace">3 SCENARIOS</text>
        </g>

        {/* Vertical divider */}
        <line x1="62" y1="12" x2="62" y2="98" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Bar chart baseline */}
        <line x1={startX - 5} y1={barBottom} x2={startX + 3 * barW + 2 * gap + 8} y2={barBottom}
          stroke="rgba(245,158,11,0.2)" strokeWidth="0.5" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1.0].map((frac, i) => (
          <line key={i}
            x1={startX - 5} y1={barBottom - frac * barMaxH}
            x2={startX + 3 * barW + 2 * gap + 8} y2={barBottom - frac * barMaxH}
            stroke="rgba(245,158,11,0.06)" strokeWidth="0.4"
          />
        ))}

        {/* Scenario bars — use SVG coordinate flip so bars grow upward cleanly */}
        {scenarios.map((s, i) => {
          const x = startX + i * (barW + gap);
          const h = s.barFrac * barMaxH;
          const barTopY = barBottom - h;

          return (
            <g key={i}>
              {/* Base CASE glow halo (opacity-only animation, safe) */}
              {i === 1 && (
                <motion.rect x={x - 2} y={barTopY - 2} width={barW + 4} height={h + 4} rx="3"
                  fill="rgba(245,158,11,0.06)"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Bar: translate origin to barBottom, flip y-axis, animate height upward */}
              <g transform={`translate(${x}, ${barBottom}) scale(1, -1)`}>
                <motion.rect
                  width={barW} rx="2"
                  fill={s.color}
                  style={{ filter: i === 1 ? 'url(#amber-glow)' : 'none' }}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>

              {/* IRR — static position, fade in */}
              <motion.text
                x={x + barW / 2} y={barTopY - 4}
                fontSize="5.5" textAnchor="middle"
                fill={i === 1 ? "#f59e0b" : "rgba(245,158,11,0.55)"}
                fontFamily="monospace" fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 + i * 0.18 }}
              >
                {s.irr}
              </motion.text>

              {/* NPV */}
              <motion.text
                x={x + barW / 2} y={barTopY - 11}
                fontSize="3.8" textAnchor="middle"
                fill={i === 1 ? "rgba(245,158,11,0.8)" : "rgba(245,158,11,0.35)"}
                fontFamily="monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 + i * 0.18 }}
              >
                {s.npv}
              </motion.text>

              {/* Scenario label */}
              <text x={x + barW / 2} y={barBottom + 7} fontSize="2.8" textAnchor="middle"
                fill="rgba(245,158,11,0.3)" fontFamily="monospace">
                {s.label}
              </text>

              {/* Payback */}
              <text x={x + barW / 2} y={barBottom + 12} fontSize="2.8" textAnchor="middle"
                fill="rgba(245,158,11,0.2)" fontFamily="monospace">
                PB: {s.payback}
              </text>
            </g>
          );
        })}

        {/* RIGHT: Status */}
        <g transform="translate(238, 16)">
          <text x="0" y="0" fontSize="3.2" fill="rgba(245,158,11,0.35)" fontFamily="monospace" fontWeight="bold">IRR RANGE</text>
          <text x="0" y="12" fontSize="9" fill="rgba(245,158,11,0.75)" fontFamily="monospace" fontWeight="bold">24.8%</text>
          <text x="0" y="21" fontSize="3" fill="rgba(245,158,11,0.3)" fontFamily="monospace">BASE CASE</text>

          <line x1="0" y1="28" x2="38" y2="28" stroke="rgba(245,158,11,0.1)" strokeWidth="0.5" />

          <text x="0" y="38" fontSize="3.2" fill="rgba(245,158,11,0.35)" fontFamily="monospace" fontWeight="bold">PAYBACK</text>
          <text x="0" y="50" fontSize="9" fill="rgba(245,158,11,0.6)" fontFamily="monospace" fontWeight="bold">3.2Y</text>
          <text x="0" y="59" fontSize="3" fill="rgba(245,158,11,0.3)" fontFamily="monospace">BASE CASE</text>

          <line x1="0" y1="66" x2="38" y2="66" stroke="rgba(245,158,11,0.1)" strokeWidth="0.5" />

          <text x="0" y="76" fontSize="3.2" fill="rgba(245,158,11,0.35)" fontFamily="monospace" fontWeight="bold">ANALYSIS</text>
          <text x="0" y="86" fontSize="4.5" fill="rgba(245,158,11,0.5)" fontFamily="monospace" fontWeight="bold">WACC</text>
          <text x="0" y="94" fontSize="4.5" fill="rgba(245,158,11,0.5)" fontFamily="monospace" fontWeight="bold">SENSITIVITY</text>
        </g>

        {/* Status footer removed */}
      </svg>
    </div>
  );
};

// Aliased exports (referenced in projects.tsx and project pages)
export const LiteStoreHeroVisual = () => <LiteStoreVisual />;
export const SpotifyHeroVisual    = () => <SpotifyVisual />;
export const FinanceHeroVisual    = () => <FinanceVisual />;
export const HRArchetypeHeroVisual = () => <HRArchetypeVisual />;
export const SqlHeroVisual        = () => <SqlVisual />;
export { SqlVisual as SqlVisualLarge };
