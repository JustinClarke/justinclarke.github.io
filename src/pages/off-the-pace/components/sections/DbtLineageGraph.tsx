/**
 * DbtLineageGraph the real dbt lineage feeding fct_lap_residuals, rendered as a
 * top-down layered graph. Nodes, edges and per-node test counts are baked from
 * the dbt manifest (data/dag.json)  - no runtime fetch, no hand-typed paths. The
 * graph narrows as it descends, dramatising how 18 upstream models converge into
 * a single fact table that the 7-term invariant must hold on.
 *
 * Fits in: PipelineSection on the architecture page, replacing the old
 *          hand-typed "simplified DAG path".
 * Data:    src/pages/off-the-pace/data/dag.json (pruned from transform/target/
 *          manifest.json; see its `provenance` field).
 * Layout:  computed once at module load from the static JSON (positions by
 *          graph depth); hovering only flips a highlight flag, so the SVG
 *          geometry never recomputes. Each node's `depth` is its longest path
 *          from a source, which stacks the bands top-to-bottom.
 */
import { useState } from 'react';
import dagData from '../../data/dag.json';

interface DagNode {
  id: string; label: string; layer: string; tests: number;
  depth: number; terminal: boolean; convergence: boolean;
}
interface DagEdge { source: string; target: string; }
const DAG = dagData as {
  provenance: string; totals: { models: number; tests: number };
  nodes: DagNode[]; edges: DagEdge[];
};

const NODE_W = 122, NODE_H = 26, COL_GAP = 12, BAND_H = 48, PAD_X = 10, PAD_Y = 14;

function layerColor(n: DagNode): string {
  if (n.terminal || n.layer === 'marts') return 'var(--color-f1-red)';
  if (n.convergence) return 'var(--color-emerald)';
  switch (n.layer) {
    case 'dimension': return 'var(--color-amber)';
    case 'intermediate': return 'var(--color-blue-bright)';
    default: return 'rgba(255,255,255,0.45)'; // staging
  }
}

// ── Static layout (computed once) ──
const MAX_DEPTH = Math.max(...DAG.nodes.map((n) => n.depth));
const BANDS: DagNode[][] = Array.from({ length: MAX_DEPTH + 1 }, () => []);
DAG.nodes.forEach((n) => BANDS[n.depth].push(n));
BANDS.forEach((b) => b.sort((a, c) => a.id.localeCompare(c.id)));
const MAX_ROW = Math.max(...BANDS.map((b) => b.length));
const VB_W = PAD_X * 2 + MAX_ROW * NODE_W + (MAX_ROW - 1) * COL_GAP;
const VB_H = PAD_Y * 2 + MAX_DEPTH * BAND_H + NODE_H;
const POS: Record<string, { x: number; y: number }> = {};
BANDS.forEach((band, depth) => {
  const total = band.length * NODE_W + (band.length - 1) * COL_GAP;
  const startX = (VB_W - total) / 2;
  band.forEach((n, i) => {
    POS[n.id] = { x: startX + i * (NODE_W + COL_GAP), y: PAD_Y + depth * BAND_H };
  });
});
const cx = (id: string) => POS[id].x + NODE_W / 2;

export function DbtLineageGraph() {
  const [hover, setHover] = useState<string | null>(null);
  const active = hover ? DAG.nodes.find((n) => n.id === hover) ?? null : null;
  const isEdgeLit = (e: DagEdge) => hover != null && (e.source === hover || e.target === hover);
  const isNodeLit = (id: string) =>
    hover == null || id === hover || DAG.edges.some((e) =>
      (e.source === hover && e.target === id) || (e.target === hover && e.source === id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <span className="font-jetbrains text-micro uppercase tracking-widest text-text-tertiary">
          Model lineage · real dbt manifest
        </span>
        <span className="font-jetbrains text-micro text-text-tertiary tabular-nums">
          {DAG.totals.models} models · {DAG.totals.tests} tests · {DAG.nodes.length} upstream of{' '}
          <span className="text-f1-red">fct_lap_residuals</span>
        </span>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img"
        aria-label={`dbt lineage: ${DAG.nodes.length} models converging into fct_lap_residuals.`}>
        {/* edges (under nodes) */}
        {DAG.edges.map((e, i) => {
          const s = POS[e.source], t = POS[e.target];
          const x1 = cx(e.source), y1 = s.y + NODE_H, x2 = cx(e.target), y2 = t.y;
          const my = (y1 + y2) / 2;
          const lit = isEdgeLit(e);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`}
              fill="none"
              stroke={lit ? 'var(--color-f1-red)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={lit ? 1.4 : 0.8}
              opacity={hover && !lit ? 0.25 : 1}
            />
          );
        })}

        {/* nodes */}
        {DAG.nodes.map((n) => {
          const p = POS[n.id];
          const color = layerColor(n);
          const lit = isNodeLit(n.id);
          const emphasised = n.terminal || n.convergence;
          return (
            <g
              key={n.id}
              transform={`translate(${p.x} ${p.y})`}
              opacity={lit ? 1 : 0.3}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              tabIndex={0}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
            >
              <rect
                width={NODE_W} height={NODE_H} rx={4}
                fill={color} fillOpacity={emphasised ? 0.22 : 0.12}
                stroke={color} strokeWidth={emphasised ? 1.6 : 1}
              />
              <text
                x={8} y={NODE_H / 2 + 0.5} dominantBaseline="middle"
                className="font-jetbrains" fontSize={7.5} fill="rgba(255,255,255,0.92)"
                {...(n.label.length > 16 ? { textLength: NODE_W - 30, lengthAdjust: 'spacingAndGlyphs' as const } : {})}
              >
                {n.label}
              </text>
              <text
                x={NODE_W - 6} y={NODE_H / 2 + 0.5} dominantBaseline="middle" textAnchor="end"
                className="font-jetbrains tabular-nums" fontSize={7} fill={color}
              >
                {n.tests}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hover detail / legend */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-h-[16px]">
        <div className="font-jetbrains text-micro tabular-nums">
          {active ? (
            <span className="text-text-secondary">
              <span className="text-white font-semibold">{active.label}</span>
              {' · '}{active.layer}{' · '}
              <span className="text-emerald-400">{active.tests} tests</span>
            </span>
          ) : (
            <span className="text-text-tertiary">Hover a model for its test count · number on each node = tests</span>
          )}
        </div>
        <div className="flex items-center gap-3 font-jetbrains text-micro uppercase tracking-wider text-text-tertiary">
          {[
            { label: 'staging', c: 'rgba(255,255,255,0.45)' },
            { label: 'dim', c: 'var(--color-amber)' },
            { label: 'intermediate', c: 'var(--color-blue-bright)' },
            { label: 'fct', c: 'var(--color-f1-red)' },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: l.c }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
