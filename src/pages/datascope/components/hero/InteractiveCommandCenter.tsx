/**
 * InteractiveCommandCenter.tsx
 * The centerpiece Apple/AWS Summit interactive showcase widget.
 * Visitors can test-drive DataScope's local engine, DuckChat AST repair,
 * and relational schema inference in a live simulated terminal.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Terminal,
  Database,
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Sparkles,
  ArrowRight,
  Lock,
  Cpu,
} from 'lucide-react';
import { ReticleMark } from '../ui/ReticleMark'; // keep for backward-compat if needed
import { DataScopeLogo } from '../ui/DataScopeLogo';

type TabMode = 'ingest' | 'schema' | 'duckchat' | 'results';

export function InteractiveCommandCenter() {
  const [activeTab, setActiveTab] = useState<TabMode>('duckchat');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(3); // 0 to 3

  // Query state for the DuckChat pipeline
  const queries = [
    {
      nl: 'Show total revenue and customer tier for orders completed in Q3',
      rawSql: `SELECT c.tier, c.region, SUM(o.total_amount) AS revenue
FROM customers c JOIN orders o USING (customer_id)
WHERE o.order_date >= '2026-07-01'
GROUP BY c.tier`,
      defect: 'Missing `c.region` in GROUP BY (SQL standard violation)',
      repairedSql: `SELECT c.tier, c.region, SUM(o.total_amount) AS revenue
FROM customers c JOIN orders o USING (customer_id)
WHERE o.order_date >= '2026-07-01'
GROUP BY c.tier, c.region`,
      repairDelta: 'Deterministic AST pass patched in 0.2ms',
      execTime: '8.4ms',
      output: [
        { tier: 'Enterprise', region: 'North America', revenue: '$148,290.00' },
        { tier: 'Enterprise', region: 'EMEA', revenue: '$94,400.00' },
        { tier: 'Growth', region: 'North America', revenue: '$52,110.50' },
        { tier: 'Growth', region: 'APAC', revenue: '$41,380.00' },
      ],
    },
    {
      nl: 'Calculate average resolution hours by priority for high-volume queues',
      rawSql: `SELECT priority, AVG(resolved_at - created_at) / 60 AS avg_duration
FROM support_tickets GROUP BY priority`,
      defect: 'Interval microsecond division fault',
      repairedSql: `SELECT priority, AVG(date_diff('second', created_at, resolved_at)) / 3600.0 AS avg_hours
FROM support_tickets GROUP BY priority`,
      repairDelta: 'Temporal dialect transformer applied',
      execTime: '6.1ms',
      output: [
        { priority: 'P1-Urgent', avg_hours: '2.4 hrs' },
        { priority: 'P2-High', avg_hours: '8.1 hrs' },
        { priority: 'P3-Normal', avg_hours: '24.6 hrs' },
      ],
    },
  ];

  const [queryIndex, setQueryIndex] = useState(0);
  const activeQuery = queries[queryIndex];

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);

    const t1 = setTimeout(() => setSimulationStep(1), 600);
    const t2 = setTimeout(() => setSimulationStep(2), 1400);
    const t3 = setTimeout(() => {
      setSimulationStep(3);
      setIsSimulating(false);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <div className="relative group rounded-3xl bg-[#090b11]/85 border border-white/10 backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_80px_rgba(134,59,255,0.2)]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="h-3 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-1.5 font-jetbrains text-xs text-white/90 font-medium">
            <DataScopeLogo size={14} />
            <span>DataScope Console</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              DuckDB-Wasm Active
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5 font-jetbrains text-micro">
          <button
            onClick={() => setActiveTab('duckchat')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'duckchat'
                ? 'bg-[#863bff]/30 text-white font-semibold border border-[#863bff]/40 shadow-[0_0_10px_rgba(134,59,255,0.3)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            DuckChat AI Engine
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'schema'
                ? 'bg-datascope/30 text-white font-semibold border border-datascope/40 shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Schema Graph
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'ingest'
                ? 'bg-[#f2a33c]/30 text-white font-semibold border border-[#f2a33c]/40 shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            0-Upload Ingest
          </button>
        </div>
      </div>

      {/* Main Terminal Viewport */}
      <div className="p-5 sm:p-6 min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'duckchat' && (
            <motion.div
              key="duckchat-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {/* Natural Language Prompt Box */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#863bff]/20 border border-[#863bff]/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-viz-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
                      Natural Language Query
                    </div>
                    <div className="text-sm font-sans font-medium text-white">
                      "{activeQuery.nl}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setQueryIndex((queryIndex + 1) % queries.length)}
                    className="px-2.5 py-1 text-micro font-mono text-white/60 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Next Prompt
                  </button>
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-3 py-1 text-micro font-jetbrains font-bold uppercase tracking-wider text-white rounded-lg bg-gradient-to-r from-[#863bff] to-datascope hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Trace</span>
                  </button>
                </div>
              </div>

              {/* Four Pipeline Execution Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-jetbrains">
                {/* Stage 1: AST Guard */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    simulationStep >= 0
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/[0.02] border-white/5 text-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase">Stage 01</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-semibold text-white text-xs">AST Guard</div>
                  <div className="text-[11px] text-white/60">Strictly SELECT / WITH</div>
                </div>

                {/* Stage 2: Deterministic Repair */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    simulationStep >= 1
                      ? 'bg-[#f2a33c]/10 border-[#f2a33c]/30 text-[#f2a33c]'
                      : 'bg-white/[0.02] border-white/5 text-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase">Stage 02</span>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-semibold text-white text-xs">AST Repair Pass</div>
                  <div className="text-[11px] text-white/60">0ms compiler fix</div>
                </div>

                {/* Stage 3: DuckDB Execution */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    simulationStep >= 2
                      ? 'bg-datascope/10 border-datascope/30 text-datascope'
                      : 'bg-white/[0.02] border-white/5 text-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase">Stage 03</span>
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-semibold text-white text-xs">DuckDB-Wasm</div>
                  <div className="text-[11px] text-white/60">{activeQuery.execTime} on CPU</div>
                </div>

                {/* Stage 4: Citation Verifier */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    simulationStep >= 3
                      ? 'bg-[#863bff]/10 border-[#863bff]/30 text-viz-accent'
                      : 'bg-white/[0.02] border-white/5 text-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase">Stage 04</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-semibold text-white text-xs">Citation Gate</div>
                  <div className="text-[11px] text-white/60">100% verified numbers</div>
                </div>
              </div>

              {/* AST Repair Diff View */}
              <div className="rounded-2xl bg-black/60 border border-white/10 p-4 font-mono text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-micro text-white/50">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Fault Detected: {activeQuery.defect}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{activeQuery.repairDelta}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Left: Raw LLM Fault */}
                  <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-red-400/80 mb-1">
                      Raw Model Output (Failed Syntax)
                    </span>
                    <pre className="text-white/80 overflow-x-auto text-[11px] leading-relaxed">
                      {activeQuery.rawSql}
                    </pre>
                  </div>

                  {/* Right: DuckChat Deterministic Repair */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 mb-1 flex items-center justify-between">
                      <span>DuckChat AST Repaired SQL</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Executable
                      </span>
                    </span>
                    <pre className="text-white/95 overflow-x-auto text-[11px] leading-relaxed font-bold">
                      {activeQuery.repairedSql}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Result Preview Strip */}
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 flex items-center justify-between text-xs font-jetbrains">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-datascope" />
                  <span className="text-white/60">Execution Output:</span>
                  <span className="text-white font-bold">{activeQuery.output.length} rows returned</span>
                  <span className="text-text-tertiary">({activeQuery.execTime})</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-micro">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Citations match database memory buffer exactly</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'schema' && (
            <motion.div
              key="schema-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 font-jetbrains"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-datascope" />
                  <span className="text-sm font-bold text-white">
                    Inferred Relational Schema Graph (ecommerce/)
                  </span>
                </div>
                <span className="text-micro text-white/50">Derived from 4 dropped CSV tables</span>
              </div>

              {/* Schema Node Visualizer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#f2a33c]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">customers</span>
                    <span className="text-[10px] font-mono text-[#f2a33c] bg-[#f2a33c]/10 px-1.5 py-0.5 rounded">
                      400 rows
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70 space-y-1 font-mono">
                    <div className="text-emerald-400">PK: customer_id (BIGINT)</div>
                    <div>email (VARCHAR)</div>
                    <div>signup_date (DATE)</div>
                    <div>tier (VARCHAR)</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-[#863bff]/40 flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">orders</span>
                    <span className="text-[10px] font-mono text-viz-accent bg-[#863bff]/20 px-1.5 py-0.5 rounded">
                      1,400 rows
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70 space-y-1 font-mono">
                    <div className="text-emerald-400">PK: order_id (BIGINT)</div>
                    <div className="text-datascope flex items-center justify-between">
                      <span>FK: customer_id</span>
                      <span className="text-[10px] text-emerald-400 font-bold">0.96 conf</span>
                    </div>
                    <div>order_date (DATE)</div>
                    <div>total_amount (DOUBLE)</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-datascope/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">order_items</span>
                    <span className="text-[10px] font-mono text-datascope bg-datascope/10 px-1.5 py-0.5 rounded">
                      3,487 rows
                    </span>
                  </div>
                  <div className="text-[11px] text-white/70 space-y-1 font-mono">
                    <div className="text-emerald-400">PK: item_id (BIGINT)</div>
                    <div className="text-datascope">FK: order_id (0.98 conf)</div>
                    <div className="text-datascope">FK: product_id (0.94 conf)</div>
                    <div>quantity (INT)</div>
                  </div>
                </div>
              </div>

              {/* Edge Evidence Callout */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 space-y-1">
                <div className="font-bold text-datascope flex items-center gap-1.5 text-micro uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Join Inference Evidence Sentence</span>
                </div>
                <p className="font-mono text-[11px] text-white/70">
                  `orders.customer_id` ⊆ `customers.customer_id` (100% containment, 400 distinct parents, zero nulls).
                  Foreign key edge accepted with high confidence; near-tie alerts: 0.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'ingest' && (
            <motion.div
              key="ingest-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 font-jetbrains"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Client-Side Ingestion & Privacy Verification
                  </span>
                </div>
                <span className="text-micro text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Network: 0 Bytes Sent
                </span>
              </div>

              {/* Memory accounting tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-micro uppercase text-white/50">Wasm Heap</div>
                  <div className="text-lg font-bold text-white">42.8 MB</div>
                  <div className="text-[10px] text-text-tertiary">Worker allocated</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-micro uppercase text-white/50">Tables Registered</div>
                  <div className="text-lg font-bold text-datascope">4 Tables</div>
                  <div className="text-[10px] text-text-tertiary">DuckDB session catalog</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-micro uppercase text-white/50">Parsed Rows</div>
                  <div className="text-lg font-bold text-viz-accent">5,437 Rows</div>
                  <div className="text-[10px] text-text-tertiary">Streamed via Arrow IPC</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-micro uppercase text-white/50">Network Transmit</div>
                  <div className="text-lg font-bold text-emerald-400">0.00 KB</div>
                  <div className="text-[10px] text-emerald-400">DevTools verifiable</div>
                </div>
              </div>

              {/* Explanatory quote */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-white/70 leading-relaxed">
                <strong className="text-white">Physical Sovereignty Guarantee:</strong> With AI
                toggled to Local or Off, the application makes no HTTP/WebSocket requests whatsoever.
                Disconnect your Wi-Fi, drop your largest customer CSV, and query with zero latency.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer Strip */}
      <div className="px-5 py-3 border-t border-white/[0.08] bg-black/40 flex flex-wrap items-center justify-between gap-3 text-micro font-jetbrains text-white/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Browser Engine: 60 FPS</span>
          </span>
          <span className="text-text-muted">|</span>
          <span>DuckChat v23.4 (Mechanical Repair Active)</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span>Targeting:</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-datascope font-semibold">
            DuckDB-Wasm Vectorized Heap
          </span>
        </div>
      </div>
    </div>
  );
}
