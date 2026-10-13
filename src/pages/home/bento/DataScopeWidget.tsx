/**
 * DataScopeWidget the "DataScope Studio" bento card, rebuilt to properly
 * convey the depth of a ~33k LoC analytics IDE. A self-running simulation
 * cycles through three of DataScope's core capabilities:
 *
 *   1. Blueprint: the post-ingest landing view with verdict + next-actions
 *   2. Schema: column classifier with semantic types & health profiling
 *   3. SQL + Join: Monaco SQL console with results + join-graph inference
 *
 * The header carries the real reticle logo mark and the split-color wordmark
 * ("DataSc⊕pe"). The pipeline strip shows the actual architecture data flow,
 * not just a library list. Every number mirrors the real ecommerce sample.
 *
 * Fits in: one card in the homepage featured-projects bento grid.
 * Note:    three timers drive the simulation: phase cycler, column
 *          classifier, and SQL console. None touch real data.
 */
import { useState, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  Zap,
  ChevronRight,
  Database,
  Search,
  Key,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  GitFork,
  Sparkles,
  Terminal,
  Play,
  Check,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/utils';

const DS_COLOR = 'var(--color-datascope)';

/* ── Brand palette from the real DataScope app ── */
const DS_AMBER  = '#F2A33C';
const DS_VIOLET = '#8B5CF6';
const DS_TEAL   = '#17B3BE';
const DS_CREAM  = '#EDEAE6';

/* ── Inline reticle logo mark (exact match of datascope-reticle.svg) ── */
function ReticleMark({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-label="DataScope logo"
    >
      <circle cx="50" cy="50" r="30" fill="none" stroke={DS_CREAM} strokeWidth="9" />
      <path d="M50 4 V15 M50 85 V96 M4 50 H15 M85 50 H96" stroke={DS_CREAM} strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 L50 20 A30 30 0 0 1 76 65 Z" fill={DS_AMBER} />
      <circle cx="50" cy="50" r="10" fill={DS_VIOLET} />
    </svg>
  );
}

/* ── Mock data mirrors the real DataScope ecommerce sample ── */
const COLUMNS = [
  { table: 'orders',      col: 'order_id',    type: 'BIGINT',   semantic: 'Primary Key',    distinct: '3,487', nulls: '0%',   health: 'pass' as const, minMax: '1 → 3,487', bars: [3, 5, 8, 12, 7, 4, 6, 9, 11, 5, 3, 7] },
  { table: 'products',    col: 'unit_price',  type: 'DOUBLE',   semantic: 'Currency',       distinct: '142',   nulls: '0%',   health: 'pass' as const, minMax: '$4.99 → $299', bars: [12, 9, 7, 5, 4, 3, 2, 2, 1, 1, 1, 1] },
  { table: 'customers',   col: 'signup_date', type: 'DATE',     semantic: 'Temporal',       distinct: '348',   nulls: '1.2%', health: 'warn' as const, minMax: '2024-01 → 12', bars: [2, 4, 6, 8, 10, 12, 11, 9, 7, 5, 4, 3] },
  { table: 'products',    col: 'category',    type: 'VARCHAR',  semantic: 'Categorical',    distinct: '8',     nulls: '0%',   health: 'pass' as const, minMax: '8 classes', bars: [10, 8, 6, 4, 3, 2, 1, 1, 0, 0, 0, 0] },
  { table: 'customers',   col: 'customer_id', type: 'BIGINT',   semantic: 'Foreign Key',    distinct: '400',   nulls: '0%',   health: 'pass' as const, minMax: '1 → 400', bars: [5, 7, 9, 11, 12, 10, 8, 6, 5, 4, 3, 2] },
];

const SQL_QUERIES = [
  { sql: 'SELECT category, SUM(quantity * unit_price) AS revenue\nFROM order_items JOIN products USING (product_id)\nGROUP BY 1 ORDER BY 2 DESC', result: '8 rows · 12ms' },
  { sql: 'SELECT date_trunc(\'month\', order_date) AS mo,\n       COUNT(DISTINCT customer_id) AS buyers\nFROM orders GROUP BY 1', result: '12 rows · 8ms' },
  { sql: 'SELECT name, COUNT(*) AS orders\nFROM customers JOIN orders USING (customer_id)\nGROUP BY 1 ORDER BY 2 DESC LIMIT 5', result: '5 rows · 6ms' },
];

const BLUEPRINT_FACTS = [
  { label: 'Tables', value: '4', confidence: 'verified' },
  { label: 'Rows',   value: '5,437', confidence: 'verified' },
  { label: 'Join Edges', value: '5 FK', confidence: 'inferred' },
  { label: 'Nullability', value: '1 col', confidence: 'flagged' },
];

const BLUEPRINT_ACTIONS = [
  { text: 'Explore correlation matrix', color: DS_AMBER },
  { text: 'Chart orders.customer_id over time', color: DS_TEAL },
  { text: 'Profile order_items', color: DS_VIOLET },
];

const TABLES = [
  { name: 'customers',   rows: '400',   cols: 5, color: DS_AMBER },
  { name: 'orders',      rows: '1,400', cols: 4, color: DS_VIOLET },
  { name: 'order_items', rows: '3,487', cols: 5, color: DS_TEAL },
  { name: 'products',    rows: '150',   cols: 4, color: DS_AMBER },
];

type Phase = 'blueprint' | 'schema';
const PHASES: Phase[] = ['blueprint', 'schema'];
const PHASE_LABELS: Record<Phase, string> = {
  blueprint: 'BLUEPRINT',
  schema: 'ERD SCHEMA',
};

export function DataScopeWidget() {
  const [phase, setPhase] = useState<Phase>('blueprint');
  const [colIdx, setColIdx] = useState(0);
  const [sqlIdx, setSqlIdx] = useState(0);
  const sqlRef = useRef<HTMLDivElement>(null);

  // Cycle through the demo phases every 12s.
  useEffect(() => {
    const t = setInterval(() => setPhase(p => {
      const i = PHASES.indexOf(p);
      return PHASES[(i + 1) % PHASES.length];
    }), 12000);
    return () => clearInterval(t);
  }, []);

  // Rotate column classifier every 3s within schema phase.
  useEffect(() => {
    const t = setInterval(() => setColIdx(i => (i + 1) % COLUMNS.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Rotate SQL queries every 5s within sql phase.
  useEffect(() => {
    const t = setInterval(() => setSqlIdx(i => (i + 1) % SQL_QUERIES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const col = COLUMNS[colIdx];
  const query = SQL_QUERIES[sqlIdx];

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* ── Header: Logo + Wordmark ── */}
      <div className="flex flex-col gap-2.5 pb-1 shrink-0">
        {/* Row 1: Reticle mark + split wordmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="font-mono text-micro font-medium border px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0"
              style={{ borderColor: `color-mix(in srgb, ${DS_AMBER} 30%, transparent)`, color: DS_AMBER, background: `color-mix(in srgb, ${DS_AMBER} 5%, transparent)` }}
            >
              Browser-Native IDE
            </span>
            {/* <ReticleMark size={22} className="shrink-0 drop-shadow-[0_0_6px_rgba(242,163,60,0.4)]" /> */}
            <h3 className="font-noto text-base xs:text-lg sm:text-xl font-black tracking-tight leading-none truncate">
              <span className="text-fg">Data</span>
              <span style={{ color: DS_AMBER }}>Sc</span>
              {/* The inline reticle-as-O in the wordmark */}
              <span className="inline-flex align-middle mx-[-1px]">
                <ReticleMark size={16} className="translate-y-[-1px]" />
              </span>
              <span style={{ color: DS_AMBER }}>pe</span>
            </h3>
          </div>
        </div>

        {/* Row 2: description callout */}
        <div className="relative rounded-lg border-t border-r border-b border-t-edge-soft border-r-edge-soft border-b-edge-soft bg-bento-subtle backdrop-blur-sm px-3 py-2">
          <p className="text-fine md:text-caption leading-relaxed text-fg-soft">
            Browser-native <span className="font-semibold text-fg">analytics IDE</span>. Drop files, get <span className="font-semibold" style={{ color: DS_AMBER }}>schema detection</span>, <span className="font-semibold" style={{ color: DS_VIOLET }}>profiling</span>, <span className="font-semibold" style={{ color: DS_TEAL }}>SQL</span>, <span className="font-semibold text-fg">charts</span>, and <span className="font-semibold" style={{ color: DS_AMBER }}>schema-graph inference</span>.
          </p>
        </div>
      </div>

      {/* ── Architecture pipeline: actual data flow ── */}
      <div className="flex items-center justify-between py-2.5 px-2.5 md:px-2 lg:px-3 xl:px-4 bg-fg/[0.02] border border-edge-soft rounded-xl shrink-0 select-none overflow-hidden">
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            ),
            label: 'DROP',
            color: 'text-fg-soft'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.55 9.72 11 12 11s4.39-.45 6-1.23V12zm-6-3c-3.87 0-6-1.5-6-2s2.13-2 6-2 6 1.5 6 2-2.13 2-6 2z"/>
              </svg>
            ),
            label: 'DUCKDB',
            color: 'text-yellow-400'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            ),
            label: 'PROFILER',
            color: 'text-purple-400'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" />
              </svg>
            ),
            label: 'CLASSIFIER',
            color: 'text-cyan-400'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            ),
            label: 'BLUEPRINT',
            color: 'text-amber-400'
          },
        ].map((stage, i, arr) => (
          <Fragment key={stage.label}>
            <div
              className={cn(
                "flex items-center gap-1.5 transition-all duration-300",
                "hover:scale-[1.03] hover:-translate-y-px cursor-default shrink-0",
                stage.color,
                "animate-f1-aura"
              )}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <span className="text-micro leading-none shrink-0">{stage.icon}</span>
              <span className="font-mono text-micro font-black tracking-[0.08em] leading-none shrink-0">{stage.label}</span>
            </div>
            {i < arr.length - 1 && (
              <span className="relative flex-grow h-px min-w-[10px] bg-fg/10 mx-1.5 md:mx-1.5 lg:mx-2 xl:mx-4">
                <span
                  className="f1-flow-packet h-1 w-1 rounded-full shadow-[0_0_6px_var(--color-datascope)]"
                  style={{ animationDelay: `${i * 0.5}s`, background: DS_AMBER }}
                />
              </span>
            )}
          </Fragment>
        ))}
      </div>

      {/* ── Phase indicator tabs ── */}
      <div className="flex items-center gap-2 shrink-0 lg:flex hidden border-b border-edge-soft/30 pb-1.5">
        {PHASES.map(p => (
          <button
            key={p}
            onClick={(e) => { e.stopPropagation(); setPhase(p); }}
            className={cn(
              "font-mono text-micro px-3 py-1 rounded-full transition-all duration-300 uppercase tracking-widest border",
              phase === p
                ? "border-fg/10 bg-fg/[0.03] text-fg font-medium shadow-sm"
                : "border-transparent text-fg-faint hover:text-fg-soft hover:bg-fg/[0.02]"
            )}
          >
            {PHASE_LABELS[p]}
          </button>
        ))}
        <div className="flex-grow" />
        <span className="font-mono text-micro tracking-widest text-fg-faint">
          {PHASES.indexOf(phase) + 1} / {PHASES.length}
        </span>
      </div>

      {/* ── Main content: rotating capability demo ── */}
      <div className="hidden lg:flex flex-grow min-h-0">
        <AnimatePresence mode="wait">
          {phase === 'blueprint' && (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col gap-1.5 h-full justify-between min-h-0 overflow-hidden"
            >
              {/* Blueprint view: verdict + facts + actions */}
              <div className="bg-bento-inset border border-edge-soft rounded-xl p-2.5 flex flex-col gap-2 shrink-0 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 blur-3xl pointer-events-none" />
                
                {/* Header Row: Title + Verdict Badge */}
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Sparkles size={11} style={{ color: DS_AMBER }} />
                      BLUEPRINT
                    </span>
                    <span className="font-mono text-micro font-semibold px-2 py-0.5 rounded-full border text-emerald-400 border-emerald-400/30 bg-emerald-400/10 flex items-center gap-1">
                      <CheckCircle2 size={9} /> E-commerce mini-warehouse
                    </span>
                  </div>
                  <span className="font-mono text-micro text-fg-faint bg-fg/[0.03] border border-edge-soft/40 px-2 py-0.5 rounded-full">
                    Auto Ingest · <span className="text-emerald-400 font-semibold">100% Valid</span>
                  </span>
                </div>

                {/* Verdict callout box */}
                <div className="relative z-10 px-2.5 py-1 rounded-lg bg-fg/[0.025] border-l-2 border-amber-400/80 border-t border-r border-b border-edge-soft/40">
                  <p className="font-mono text-micro text-fg-soft leading-tight">
                    <span className="text-fg font-semibold">4 tables · 5,437 rows</span> · Structure verified with 5 foreign key joins. Ready for analytical query execution.
                  </p>
                </div>

                {/* Fact grid */}
                <div className="grid grid-cols-4 gap-1.5 relative z-10">
                  {BLUEPRINT_FACTS.map(fact => {
                    const isFlagged = fact.confidence === 'flagged';
                    return (
                      <div
                        key={fact.label}
                        className={cn(
                          "rounded-lg p-1.5 border font-mono flex flex-col justify-between transition-all duration-300 relative overflow-hidden",
                          isFlagged
                            ? "bg-rose-500/5 border-rose-500/30 text-rose-300"
                            : "bg-fg/[0.025] border-edge-soft/40 hover:bg-fg/[0.05]"
                        )}
                      >
                        <div className="flex items-center justify-between text-micro text-fg-faint mb-0.5">
                          <span className="truncate">{fact.label}</span>
                          {isFlagged ? (
                            <AlertTriangle size={9} className="text-rose-400 shrink-0" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
                          )}
                        </div>
                        <div
                          className="font-mono text-fine font-black tracking-tight"
                          style={{ color: isFlagged ? 'var(--color-sql-red)' : DS_AMBER }}
                        >
                          {fact.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom section: Suggested Actions + SQL Console (Left 3 cols) & Data Quality + Join Graph (Right 2 cols) */}
              <div className="grid grid-cols-5 gap-1.5 flex-grow min-h-0">
                
                {/* Left Stack (3 cols): Suggested Actions on Top, SQL Console on Bottom */}
                <div className="col-span-3 flex flex-col gap-1.5 h-full min-h-0">
                  
                  {/* Suggested Actions Card */}
                  <div className="bg-bento-inset border border-edge-soft rounded-xl p-2 md:p-2.5 flex flex-col justify-between flex-1 min-h-0 relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between shrink-0 border-b border-edge-soft/40 pb-1 mb-1">
                      <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1.5 font-bold">
                        <Zap size={11} style={{ color: DS_AMBER }} />
                        SUGGESTED ACTIONS
                      </span>
                      <span className="font-mono text-micro text-fg-faint">3 recommended</span>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-grow justify-center py-0.5">
                      {BLUEPRINT_ACTIONS.map((action, i) => (
                        <motion.div
                          key={action.text}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.2 }}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg bg-fg/[0.025] border border-edge-soft/40 font-mono text-micro text-fg-soft cursor-default hover:bg-fg/[0.06] hover:border-fg/20 transition-all duration-200 group w-full"
                        >
                          <Zap size={9.5} style={{ color: action.color }} className="shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="truncate leading-tight font-medium text-fg/90">{action.text}</span>
                          <ChevronRight size={9.5} className="text-fg-faint ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* SQL Console (Bottom half of Left column) */}
                  <div className="bg-bento-inset border border-edge-soft rounded-xl p-2 md:p-2.5 flex flex-col justify-between flex-1 min-h-0 shadow-inner">
                    <div className="flex items-center justify-between border-b border-edge-soft/40 pb-1 shrink-0">
                      <span className="font-mono text-micro text-fg-faint tracking-widest uppercase flex items-center gap-1.5 font-bold">
                        <Terminal size={11} style={{ color: DS_TEAL }} />
                        SQL CONSOLE
                      </span>
                      <span
                        className="font-mono text-micro px-1.5 py-0.5 rounded font-semibold uppercase border flex items-center gap-1 shadow-sm"
                        style={{
                          background: `color-mix(in srgb, ${DS_AMBER} 12%, transparent)`,
                          borderColor: `color-mix(in srgb, ${DS_AMBER} 35%, transparent)`,
                          color: DS_AMBER,
                        }}
                      >
                        <Play size={7} className="fill-current" />
                        Run ⌘↵
                      </span>
                    </div>

                    <div className="font-mono text-micro text-fg-soft leading-relaxed flex-grow flex flex-col justify-between min-h-0 py-0.5">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={sqlIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-1 justify-between h-full"
                        >
                          <div className="flex flex-col gap-0.5 bg-fg/[0.015] p-1.5 rounded-lg border border-edge-soft/30 my-auto">
                            {query.sql.split('\n').map((line, i) => (
                              <div key={i} className="truncate flex items-center gap-2">
                                <span className="text-fg-faint text-micro w-3 text-right shrink-0 select-none opacity-50">{i + 1}</span>
                                <span className="truncate">
                                  {line.split(/(\b(?:SELECT|FROM|JOIN|GROUP BY|ORDER BY|USING|WHERE|LIMIT|AS|DESC|DISTINCT|COUNT|SUM)\b)/gi).map((part, j) =>
                                    part.match(/^(SELECT|FROM|JOIN|GROUP BY|ORDER BY|USING|WHERE|LIMIT|AS|DESC|DISTINCT|COUNT|SUM)$/i)
                                      ? <span key={j} style={{ color: DS_VIOLET }} className="font-bold">{part}</span>
                                      : <span key={j} className="text-fg-soft">{part}</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-1 border-t border-edge-soft/30 flex items-center justify-between shrink-0 mt-auto">
                            <span className="text-emerald-400 font-medium text-micro flex items-center gap-1 font-mono">
                              <CheckCircle2 size={9} /> {query.result}
                            </span>
                            <span className="font-mono text-micro text-fg-faint bg-fg/[0.03] border border-edge-soft/40 px-1.5 py-0.2 rounded">DuckDB WASM</span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                </div>

                {/* Right Stack (2 cols): Data Quality on Top, Join Graph on Bottom */}
                <div className="col-span-2 flex flex-col gap-1.5 h-full min-h-0">
                  
                  {/* Data Quality Section */}
                  <div className="bg-bento-inset border border-edge-soft rounded-xl p-2 md:p-2.5 flex flex-col justify-between flex-1 min-h-0 relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between shrink-0 border-b border-edge-soft/40 pb-1 mb-1">
                      <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1.5 font-bold">
                        <ShieldCheck size={11} style={{ color: DS_TEAL }} />
                        DATA QUALITY
                      </span>
                      <span className="font-mono text-micro font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-1.5 py-0.2 rounded">100% PASS</span>
                    </div>

                    <div className="flex flex-col gap-1 text-micro font-mono justify-center flex-grow">
                      {[
                        { label: 'Null Check', detail: '0 nulls in PK', status: 'pass' },
                        { label: 'Duplicates', detail: '100% unique PK', status: 'pass' },
                        { label: 'Types Valid', detail: 'Strict schema', status: 'pass' },
                      ].map(check => (
                        <div key={check.label} className="flex items-center justify-between px-1.5 py-0.5 rounded bg-fg/[0.02] border border-edge-soft/30">
                          <span className="text-fg-soft font-medium">{check.label}</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-micro">
                            <Check size={8} /> {check.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join Graph Section */}
                  <div className="bg-bento-inset border border-edge-soft rounded-xl p-2 md:p-2.5 flex flex-col justify-between flex-1 min-h-0 shadow-inner">
                    <div className="flex items-center justify-between shrink-0 border-b border-edge-soft/40 pb-1 mb-0.5">
                      <span className="font-mono text-micro text-fg-faint uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <GitFork size={11} style={{ color: DS_AMBER }} />
                        JOIN GRAPH
                      </span>
                      <span className="font-mono text-micro text-fg-faint bg-fg/[0.03] border border-edge-soft/40 px-1.5 py-0.2 rounded">5 edges</span>
                    </div>

                    <div className="flex items-center justify-center flex-grow min-h-0 relative py-1">
                      <svg viewBox="0 0 120 50" className="w-full h-full max-h-[44px] overflow-visible">
                        {/* Edge Lines */}
                        <line x1="30" y1="12" x2="75" y2="12" stroke={DS_AMBER} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
                        <line x1="75" y1="12" x2="75" y2="40" stroke={DS_VIOLET} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
                        <line x1="30" y1="12" x2="30" y2="40" stroke={DS_TEAL} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
                        <line x1="30" y1="40" x2="75" y2="40" stroke={DS_AMBER} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />

                        {/* Nodes */}
                        <g>
                          <circle cx="30" cy="12" r="4" fill={DS_AMBER} fillOpacity="0.25" stroke={DS_AMBER} strokeWidth="1.2" />
                          <text x="30" y="5" textAnchor="middle" fill={DS_CREAM} fontSize="4.5" fontFamily="monospace" fontWeight="bold">orders</text>
                        </g>

                        <g>
                          <circle cx="75" cy="12" r="4" fill={DS_TEAL} fillOpacity="0.25" stroke={DS_TEAL} strokeWidth="1.2" />
                          <text x="75" y="5" textAnchor="middle" fill={DS_CREAM} fontSize="4.5" fontFamily="monospace" opacity="0.95" fontWeight="bold">items</text>
                        </g>

                        <g>
                          <circle cx="30" cy="40" r="4" fill={DS_VIOLET} fillOpacity="0.25" stroke={DS_VIOLET} strokeWidth="1.2" />
                          <text x="30" y="48" textAnchor="middle" fill={DS_CREAM} fontSize="4.5" fontFamily="monospace" opacity="0.95" fontWeight="bold">customers</text>
                        </g>

                        <g>
                          <circle cx="75" cy="40" r="4" fill={DS_AMBER} fillOpacity="0.25" stroke={DS_AMBER} strokeWidth="1.2" />
                          <text x="75" y="48" textAnchor="middle" fill={DS_CREAM} fontSize="4.5" fontFamily="monospace" opacity="0.95" fontWeight="bold">products</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* Schema Phase: Explorer + Classifier (Top 50%) & Expanded ERD Diagram (Bottom 50%) */}
          {phase === 'schema' && (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full flex flex-col gap-1.5 min-h-0 overflow-hidden"
            >
              {/* Top Half: Explorer (3 cols) + Classifier (2 cols) */}
              <div className="grid grid-cols-5 gap-1.5 h-[38%] min-h-0">
                
                {/* Left (3 cols): Table Explorer - Rich IDE Dataset List */}
                <div className="col-span-3 bg-bento-inset border border-edge-soft rounded-xl p-2 flex flex-col justify-between relative overflow-hidden h-full min-h-0 shadow-inner">
                  <div className="flex items-center justify-between border-b border-edge-soft/40 pb-1 shrink-0">
                    <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Database size={11} style={{ color: DS_AMBER }} />
                      EXPLORER
                    </span>
                    <span className="font-mono text-micro text-fg-faint bg-fg/[0.03] border border-edge-soft/40 px-1.5 py-0.5 rounded">
                      4 tables · <span style={{ color: DS_AMBER }} className="font-semibold">5,437</span> rows
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 my-auto py-0.5">
                    {TABLES.map((t) => {
                      const isActive = col.table === t.name;
                      return (
                        <div
                          key={t.name}
                          className={cn(
                            "flex flex-col justify-between p-1.5 rounded-lg border font-mono transition-all duration-300 relative overflow-hidden",
                            isActive
                              ? "bg-fg/[0.05] border-amber-500/50 shadow-[0_0_12px_rgba(242,163,60,0.15)] scale-[1.01]"
                              : "bg-fg/[0.02] border-edge-soft/40 hover:bg-fg/[0.04]"
                          )}
                        >
                          {isActive && (
                            <div
                              className="absolute top-0 right-0 w-8 h-8 rounded-full blur-md pointer-events-none"
                              style={{ background: t.color, opacity: 0.25 }}
                            />
                          )}
                          <div className="flex items-center justify-between gap-1">
                            <span className="flex items-center gap-1.5 truncate">
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300",
                                  isActive && "scale-125 shadow-[0_0_6px_currentColor]"
                                )}
                                style={{ color: t.color, background: t.color }}
                              />
                              <span className={cn("text-micro font-bold truncate", isActive ? "text-fg" : "text-fg-soft")}>
                                {t.name}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-micro text-fg-faint mt-1">
                            <span>{t.rows} rows</span>
                            <span>{t.cols} cols</span>
                          </div>

                          {/* Relative row volume indicator bar */}
                          <div className="w-full bg-fg/[0.06] h-[2px] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, (parseInt(t.rows.replace(',', '')) / 3487) * 100)}%`,
                                background: t.color,
                                opacity: isActive ? 1 : 0.4
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right (2 cols): Column Classifier */}
                <div className="col-span-2 bg-bento-inset border border-edge-soft rounded-xl p-2 flex flex-col justify-between relative overflow-hidden h-full min-h-0 shadow-inner">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-violet-500/5 blur-2xl pointer-events-none" />
                  
                  {/* Classifier Header */}
                  <div className="flex items-center justify-between relative z-10 shrink-0 border-b border-edge-soft/40 pb-1">
                    <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Search size={11} style={{ color: DS_VIOLET }} />
                      CLASSIFIER
                    </span>
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        col.health === 'pass' ? "bg-emerald-400 text-emerald-400 shadow-[0_0_6px_currentColor]" : "bg-amber-400 text-amber-400 shadow-[0_0_6px_currentColor]"
                      )}
                      title={col.health === 'pass' ? 'Healthy' : 'Nullable'}
                      aria-label={col.health === 'pass' ? 'Healthy' : 'Nullable'}
                    />
                  </div>

                  {/* Rotating Column Details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={colIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col justify-between flex-grow relative z-10 py-1"
                    >
                      <div className="flex flex-col gap-1">
                        {/* Column Name & Data Type Header */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1 truncate">
                            <span className="font-mono text-micro text-fg-faint">{col.table}.</span>
                            <span className="font-mono text-fine font-black tracking-tight truncate" style={{ color: DS_AMBER }}>
                              {col.col}
                            </span>
                          </div>
                          <span className="font-mono text-micro font-bold px-1.5 py-0.5 rounded bg-fg/[0.06] text-fg-soft border border-edge-soft/60 uppercase shrink-0">
                            {col.type}
                          </span>
                        </div>

                        {/* Structured Metadata Pill Badges */}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          <span className="inline-flex items-center gap-1 font-mono text-micro font-medium px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/30">
                            <Key size={8} className="shrink-0 text-violet-400" />
                            {col.semantic}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-micro px-1.5 py-0.5 rounded bg-fg/[0.03] text-fg-soft border border-edge-soft/50">
                            <Layers size={8} className="shrink-0 text-fg-faint" />
                            {col.distinct} distinct
                          </span>
                          {col.nulls !== '0%' && (
                            <span className="inline-flex items-center gap-1 font-mono text-micro px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              Nulls: {col.nulls}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mini Sparkline Distribution Histogram */}
                      <div className="flex flex-col gap-1 pt-1.5 border-t border-edge-soft/30 mt-1">
                        <div className="flex items-center justify-between font-mono text-micro text-fg-faint">
                          <span className="whitespace-nowrap">DISTRIBUTION</span>
                          <span className="whitespace-nowrap truncate ml-2">{col.minMax}</span>
                        </div>
                        <div className="flex items-end gap-0.5 h-5 pt-0.5 relative">
                          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-edge-soft/40" />
                          {col.bars.map((h, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-t-[1.5px] min-w-[2px] relative group"
                              style={{
                                background: `linear-gradient(to top, color-mix(in srgb, ${DS_VIOLET} ${30 + h * 5}%, transparent), color-mix(in srgb, ${DS_VIOLET} ${60 + h * 5}%, transparent))`
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${(h / 12) * 100}%` }}
                              transition={{ delay: i * 0.02, duration: 0.3 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Half: Expanded ERD Diagram (62% Height) */}
              <div className="bg-bento-inset border border-edge-soft rounded-xl p-2.5 flex flex-col justify-between h-[62%] min-h-0 relative overflow-hidden">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_srgb,var(--color-fg)_4%,transparent)_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />

                {/* ERD Header */}
                <div className="flex items-center justify-between border-b border-edge-soft/40 pb-1 relative z-10 shrink-0">
                  <span className="font-mono text-micro text-fg-faint uppercase tracking-widest flex items-center gap-1 font-medium">
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="none" stroke={DS_AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                      <path d="M10 6h4M6 10v4M14 17.5h-4M17.5 10v4" />
                    </svg>
                    ENTITY RELATIONSHIP DIAGRAM (ERD)
                  </span>
                  <span className="font-mono text-micro px-1.5 py-0.2 rounded border border-amber-400/30 bg-amber-400/10 text-amber-400 font-medium">
                    Auto-Inferred Schema
                  </span>
                </div>

                {/* Stylish Staggered ERD Diagram */}
                <div className="flex-grow relative z-10 flex items-center justify-between px-2 w-full mt-2">
                  
                  {/* SVG Connecting Lines Behind Cards */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                    <path d="M 20% 30% C 35% 30%, 35% 70%, 50% 70%" stroke={DS_VIOLET} strokeWidth="1.5" strokeDasharray="3 3" fill="none" className="opacity-40" />
                    <path d="M 50% 70% C 65% 70%, 65% 25%, 80% 25%" stroke={DS_TEAL} strokeWidth="1.5" strokeDasharray="3 3" fill="none" className="opacity-40" />
                    <path d="M 80% 75% C 80% 60%, 80% 40%, 80% 25%" stroke={DS_AMBER} strokeWidth="1.5" strokeDasharray="3 3" fill="none" className="opacity-40" />
                  </svg>

                  {/* Column 1: Customers */}
                  <div className="w-[30%] -mt-12 group">
                    <div className="bg-background/80 backdrop-blur-sm border border-amber-500/30 rounded p-1.5 font-mono text-micro flex flex-col gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] -rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-105">
                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-0.5 font-bold text-amber-400">
                        <span>tbl_customers</span>
                        <span className="text-micro text-fg-faint">400</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-fg-soft text-micro">
                        <div className="flex justify-between font-semibold text-amber-300">
                          <span>🔑 customer_id</span>
                          <span>PK</span>
                        </div>
                        <div className="flex justify-between text-fg-faint">
                          <span>customer_name</span>
                          <span>TXT</span>
                        </div>
                        <div className="flex justify-between text-fg-faint">
                          <span>signup_date</span>
                          <span>DATE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Orders */}
                  <div className="w-[30%] mt-12 group">
                    <div className="bg-background/80 backdrop-blur-sm border border-violet-500/30 rounded p-1.5 font-mono text-micro flex flex-col gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] rotate-2 transition-transform group-hover:rotate-0 group-hover:scale-105">
                      <div className="flex items-center justify-between border-b border-violet-500/20 pb-0.5 font-bold text-violet-400">
                        <span>tbl_orders</span>
                        <span className="text-micro text-fg-faint">1.4k</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-fg-soft text-micro">
                        <div className="flex justify-between font-semibold text-violet-300">
                          <span>🔑 order_id</span>
                          <span>PK</span>
                        </div>
                        <div className="flex justify-between text-teal-300">
                          <span>🔗 customer_id</span>
                          <span>FK</span>
                        </div>
                        <div className="flex justify-between text-fg-faint">
                          <span>order_date</span>
                          <span>DATE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Items & Products Stacked */}
                  <div className="w-[30%] flex flex-col gap-3 -mt-4">
                    {/* Items */}
                    <div className="group">
                      <div className="bg-background/80 backdrop-blur-sm border border-teal-500/30 rounded p-1.5 font-mono text-micro flex flex-col gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] -rotate-1 transition-transform group-hover:rotate-0 group-hover:scale-105">
                        <div className="flex items-center justify-between border-b border-teal-500/20 pb-0.5 font-bold text-teal-400">
                          <span>tbl_items</span>
                          <span className="text-micro text-fg-faint">3.5k</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-fg-soft text-micro">
                          <div className="flex justify-between font-semibold text-teal-300">
                            <span>🔑 item_id</span>
                            <span>PK</span>
                          </div>
                          <div className="flex justify-between text-violet-300">
                            <span>🔗 order_id</span>
                            <span>FK</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>🔗 product_id</span>
                            <span>FK</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="group">
                      <div className="bg-background/80 backdrop-blur-sm border border-amber-500/30 rounded p-1.5 font-mono text-micro flex flex-col gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] rotate-1 transition-transform group-hover:rotate-0 group-hover:scale-105">
                        <div className="flex items-center justify-between border-b border-amber-500/20 pb-0.5 font-bold text-amber-400">
                          <span>tbl_products</span>
                          <span className="text-micro text-fg-faint">150</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-fg-soft text-micro">
                          <div className="flex justify-between font-semibold text-amber-300">
                            <span>🔑 product_id</span>
                            <span>PK</span>
                          </div>
                          <div className="flex justify-between text-fg-faint">
                            <span>unit_price</span>
                            <span>DBL</span>
                          </div>
                          <div className="flex justify-between text-fg-faint">
                            <span>category</span>
                            <span>TXT</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ERD Footer legend */}
                <div className="pt-1 border-t border-edge-soft/40 flex items-center justify-between text-micro font-mono text-fg-faint relative z-10 shrink-0">
                  <span className="flex items-center gap-1.5"><span className="text-amber-400">🔑</span> Primary Key <span className="text-teal-400 ml-2">🔗</span> Foreign Key</span>
                  <span className="text-emerald-400 font-medium">1:N Cardinality Verified</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SQL Phase merged into Blueprint */}
        </AnimatePresence>
      </div>

      {/* ── Footer metrics ── */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center pt-1.5 text-fg-soft font-mono text-micro shrink-0">
        <div className="flex items-center gap-1.5">
          <Shield size={9} className="shrink-0" />
          <span>Nothing Leaves · 1,015 Tests</span>
        </div>
        <div className="flex items-center gap-3">
          {['TypeScript', 'DuckDB', 'React', 'Workers'].map(tech => (
            <span key={tech} className="font-mono text-micro font-bold" style={{ color: DS_AMBER }}>
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5" style={{ color: DS_AMBER }}>
          <Activity size={9} className="shrink-0" />
          <span>14 Modules · Apache-2.0</span>
        </div>
      </div>

      {/* Mobile-only fallback */}
      <div className="lg:hidden flex flex-col gap-2 mt-1 shrink-0">
        <div className="flex flex-wrap gap-1">
          {['TypeScript', 'DuckDB-Wasm', 'React', '1,015 Tests'].map(tech => (
            <span
              key={tech}
              className="font-mono text-micro px-2 py-0.5 rounded font-bold uppercase tracking-wider"
              style={{
                background: `color-mix(in srgb, ${DS_AMBER} 10%, transparent)`,
                borderWidth: 1,
                borderColor: `color-mix(in srgb, ${DS_AMBER} 30%, transparent)`,
                color: DS_AMBER,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
