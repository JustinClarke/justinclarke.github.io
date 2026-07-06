/**
 * SqlDisasterWidget the "Disaster Response" bento card (a relational-database
 * coursework project). Its signature visual is a live entity-relationship
 * schema graph: entity nodes wired together by foreign-key edges, with a
 * cursor walking the graph so data appears to "flow" along the active joins.
 * The values are illustrative, not a live DB.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    one timer advances a focus node around the graph; the touching FK
 *          edges light up and a readout below reports that entity's row count
 *          and how many tables it joins to.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldCheck, GitFork } from 'lucide-react';
import { cn } from '@/utils';

// Each entity carries its row count and a colour token; the graph below
// positions them by id, so this array is the single source of truth.
const ENTITIES = [
  { id: 'disaster', label: 'DISASTER', count: 5, color: 'var(--color-sql-disaster)' },
  { id: 'region', label: 'REGION', count: 7, color: 'var(--color-sql-region)' },
  { id: 'agency', label: 'AGENCY', count: 5, color: 'var(--color-sql-agency)' },
  { id: 'team', label: 'RESP_TEAM', count: 10, color: 'var(--color-sql-team)' },
  { id: 'volunteer', label: 'VOLUNTEER', count: 15, color: 'var(--color-sql-volunteer)' },
  { id: 'shelter', label: 'SHELTER', count: 9, color: 'var(--color-sql-shelter)' },
  { id: 'supply', label: 'SUPPLY', count: 10, color: 'var(--color-sql-supply)' },
] as const;

// Node positions in the SVG's 280×130 viewBox, stretched to fill the panel
// (preserveAspectRatio="none") so coordinates map directly onto the rendered
// box. Region sits centre as the hub because most foreign keys resolve through it.
const NODES: Record<string, { x: number; y: number }> = {
  disaster: { x: 55, y: 30 },
  region: { x: 140, y: 68 },
  agency: { x: 225, y: 24 },
  team: { x: 100, y: 106 },
  volunteer: { x: 30, y: 74 },
  shelter: { x: 195, y: 110 },
  supply: { x: 255, y: 70 },
};

// Foreign-key relationships as [from, to] pairs; an edge lights up when either
// endpoint is the focused node.
const EDGES: [string, string][] = [
  ['disaster', 'region'],
  ['region', 'agency'],
  ['disaster', 'team'],
  ['team', 'volunteer'],
  ['region', 'shelter'],
  ['region', 'supply'],
  ['agency', 'team'],
];

export function SqlDisasterWidget() {
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFocus((prev) => (prev + 1) % ENTITIES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const activeEntity = ENTITIES[focus];
  const activeId = activeEntity.id;
  const activeColor = activeEntity.color;

  // Which nodes the focused entity joins to, derived straight from EDGES.
  const linkedIds = EDGES.flatMap(([a, b]) =>
    a === activeId ? [b] : b === activeId ? [a] : [],
  );

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-edge-soft pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-viz-red" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-viz-red" />
          </span>
          <span className="font-mono text-micro sm:text-micro font-bold border border-viz-red/40 text-viz-red px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-viz-red/5">
            SQL
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-fg uppercase leading-none">
            Operational Response Schema
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-micro sm:text-micro text-fg-faint mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-fg-faint font-medium">SCHEMA OPERATIONAL</span>
          <span>•</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={focus}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="uppercase font-medium font-mono text-fg-faint"
            >
              {activeEntity.label}: {activeEntity.count}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Description Block */}
      <div className="relative rounded-lg border-t border-r border-b border-t-edge-soft border-r-edge-soft border-b-edge-soft bg-bento-subtle backdrop-blur-sm px-3 py-2 shrink-0">
        <p className="text-fine sm:text-caption leading-relaxed text-fg-soft">
          PostgreSQL • <span className="font-semibold text-fg">3NF normalization</span>, <span className="font-semibold text-fg">relational modeling</span>, <span className="font-semibold text-fg">indexed analytical queries</span> and <span className="font-semibold text-fg">referential integrity</span>.
        </p>
      </div>

      {/* Main Panel  live entity-relationship schema graph */}
      <div className="hidden lg:flex flex-grow min-h-0 flex-col gap-2">

        {/* Schema graph */}
        <div className="relative bg-bento-inset border border-edge-soft rounded-xl overflow-hidden flex-grow min-h-[128px]">
          {/* faint dotted grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(var(--color-edge-soft)_0.75px,transparent_0.75px)] [background-size:12px_12px]"
            aria-hidden
          />

          <div className="absolute top-2 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            <GitFork size={9} className="text-fg-faint shrink-0" />
            <span className="font-mono text-micro text-fg-faint uppercase tracking-widest">Schema Graph</span>
          </div>

          {/* Edges  drawn in a stretched SVG (lines don't distort meaningfully) */}
          <svg viewBox="0 0 280 130" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {EDGES.map(([a, b], i) => {
              const active = a === activeId || b === activeId;
              const from = NODES[a];
              const to = NODES[b];
              return (
                <g key={i}>
                  {/* resting edge */}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    className="stroke-fg/10"
                    strokeWidth={0.6}
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* active edge  a dash "flows" along the join */}
                  {active && (
                    <motion.line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      style={{ stroke: activeColor }}
                      strokeWidth={1.2}
                      strokeLinecap="round"
                      strokeDasharray="4 8"
                      vectorEffect="non-scaling-stroke"
                      initial={{ opacity: 0, strokeDashoffset: 24 }}
                      animate={{ opacity: 0.9, strokeDashoffset: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ strokeDashoffset: { duration: 1.4, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.3 } }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes + labels  rendered as HTML overlays so text stays crisp and
              dots stay perfectly round regardless of the panel's aspect ratio */}
          {ENTITIES.map((e) => {
            const pos = NODES[e.id];
            const isActive = e.id === activeId;
            const isLinked = linkedIds.includes(e.id);
            return (
              <div
                key={e.id}
                className="absolute z-[5]"
                style={{ left: `${(pos.x / 280) * 100}%`, top: `${(pos.y / 130) * 100}%`, transform: 'translate(-50%, -50%)' }}
              >
                {/* label, floated above the dot */}
                <span
                  className={cn(
                    'absolute bottom-full left-1/2 -translate-x-1/2 mb-1 font-mono text-[8px] {/* tw-allow-micro */} uppercase tracking-wide leading-none whitespace-nowrap transition-colors duration-300',
                    isActive ? 'text-fg font-bold' : isLinked ? 'text-fg-soft' : 'text-fg-faint',
                  )}
                >
                  {e.label}
                </span>
                {/* pulsing halo for the focused node */}
                {isActive && (
                  <span
                    className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: e.color }}
                  />
                )}
                {/* the node dot */}
                <motion.span
                  className="relative block rounded-full"
                  style={{ backgroundColor: e.color }}
                  animate={{
                    width: isActive ? 12 : isLinked ? 9 : 7,
                    height: isActive ? 12 : isLinked ? 9 : 7,
                    opacity: isActive ? 1 : isLinked ? 0.9 : 0.45,
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            );
          })}
        </div>

        {/* Focused-entity readout */}
        <div className="bg-bento-inset border border-edge-soft rounded-lg px-3 py-2 flex items-center justify-between gap-2 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: activeColor }}
              />
              <span
                className="font-mono text-fine md:text-xs font-black uppercase truncate"
                style={{ color: activeColor }}
              >
                {activeEntity.label}
              </span>
              <span className="font-mono text-micro md:text-micro text-fg-soft shrink-0">
                {activeEntity.count} rows · {linkedIds.length} FK join{linkedIds.length === 1 ? '' : 's'}
              </span>
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-micro md:text-micro text-fg-faint uppercase tracking-widest shrink-0">
            3NF
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-edge-soft pt-1.5 text-fg-soft font-mono text-micro md:text-micro shrink-0">
        <div className="flex items-center gap-1.5">
          <Database size={9} className="shrink-0" />
          <span>11 Entities · 47 Queries</span>
        </div>
        <div className="flex items-center gap-1.5 text-viz-red">
          <ShieldCheck size={9} className="shrink-0" />
          <span>P95 &lt; 200ms · FK Integrity</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['Postgres', 'OLAP', 'Data Model'].map(tech => (
          <span key={tech} className="font-mono text-micro sm:text-micro px-2 py-0.5 bg-viz-red/10 border border-viz-red/30 rounded text-viz-red font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
