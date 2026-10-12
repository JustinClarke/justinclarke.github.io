/**
 * datascopeData.ts
 * Canonical facts, metrics, and interactive fixture datasets for DataScope
 * and the integrated DuckChat cognitive runtime.
 *
 * Sourced directly from:
 * - ~/github/DataScope/README.md
 * - ~/github/DataScope/eval/
 * - _docs/_resume.yaml (authoritative sweeps)
 */

export interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
  accent: string;
}

export const CANONICAL_STATS = {
  sourceLoc: '66,500+',
  testCount: '2,500+',
  testFiles: '231',
  evalExperimentsDesigned: '20',
  evalExperimentsBuilt: '12',
  groundingCalls: '408',
  groundingResult: '71.6% → 56.9%',
  duckchatBenchmark: '72 questions',
  duckchatBestScore: '69/72',
  duckchatRepairGain: '+6 / 72 questions',
  modelEfficiency: '4B beats 9B (62/66 vs 57/66)',
  networkUpload: '0 bytes',
  cloudCost: '$0.00 / query',
  queryLatencyP95: '< 16ms',
  engine: 'DuckDB-Wasm 1.32',
  duckchatAstGuard: 'SELECT / WITH only',
  license: 'Apache-2.0',
};

export const HERO_METRICS: MetricItem[] = [
  {
    value: '0 Bytes',
    label: 'Cloud Upload',
    sublabel: '100% on-device RAM',
    accent: 'var(--color-datascope)',
  },
  {
    value: '< 12ms',
    label: 'Query Latency',
    sublabel: 'DuckDB-Wasm in Web Worker',
    accent: '#863bff',
  },
  {
    value: '100%',
    label: 'Citation Verified',
    sublabel: 'Zero ungrounded numbers',
    accent: 'var(--color-emerald)',
  },
  {
    value: '2,500+',
    label: 'Passing Tests',
    sublabel: 'Across 231 test suites',
    accent: '#f2a33c',
  },
];

export const EXECUTIVE_PILLARS = [
  {
    id: 'sovereignty',
    number: '01',
    title: 'Absolute Data Sovereignty',
    tagline: 'Zero bytes leave the client. Physical privacy by architecture.',
    description:
      'Data is ingested, parsed, profiled, and queried directly in browser memory via DuckDB-Wasm and Apache Arrow IPC. Works completely offline with the network disconnected. Compliant with HIPAA, GDPR, and strict banking NDAs by physical topology, not just legal promises.',
    highlight: '0 Network Requests After Load',
    badge: 'Hardware Isolated',
    accent: 'var(--color-datascope)',
  },
  {
    id: 'cognitive-runtime',
    number: '02',
    title: 'Deterministic Cognitive Runtime',
    tagline: 'The model suggests what is interesting. It never decides what is true.',
    description:
      'Powered by DuckChat’s integrated AST guard and compiler repair passes. The LLM is restricted to a read-only grammar. If the model makes a syntax or grouping slip, a deterministic AST rewriter patches it in 0ms without a second model call. Every factual claim is validated against real database output.',
    highlight: 'DuckChat AST Guard + Repair Layer',
    badge: '100% Citation Enforcement',
    accent: '#863bff',
  },
  {
    id: 'zero-infra',
    number: '03',
    title: 'Zero-Dollar Cloud Compute',
    tagline: 'OLAP warehouse performance powered entirely by client silicon.',
    description:
      'Eliminate the massive cloud warehouse bills of Snowflake and BigQuery for ad-hoc exploration. A complete multi-table relational engine runs on the user’s local CPU and GPU via WebLLM on WebGPU and DuckDB vectorization. Ships as a zero-deployment static bundle.',
    highlight: '$0 Monthly Infrastructure Bill',
    badge: 'WebGPU + WebAssembly',
    accent: 'var(--color-emerald)',
  },
];

export interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  tech: string;
  latency: string;
  details: string[];
  contractSnippet: string;
}

export const ARCHITECTURE_TOPOLOGY: ArchitectureNode[] = [
  {
    id: 'ingestion',
    name: 'Browser Ingestion Seam',
    role: 'Local File Streaming',
    tech: 'File System Access API + Chunked Buffers',
    latency: '< 4ms',
    details: [
      'Multi-table folder drops: CSV, Parquet, JSON, TSV, ZIP',
      'Dynamic size tiering: warning at 50MB, sampling at 100MB, refusal guard at 300MB',
      'Zero remote staging: buffers stream directly to WebAssembly heap',
    ],
    contractSnippet: `interface IngestSource {
  readonly file: File;
  readonly mime: 'text/csv' | 'application/parquet' | 'application/json';
  toArrowBuffer(): Promise<Uint8Array>;
}`,
  },
  {
    id: 'engine',
    name: 'DuckDB-Wasm Core',
    role: 'Client-Side OLAP Engine',
    tech: 'WebAssembly + Apache Arrow IPC Worker',
    latency: '4ms – 16ms',
    details: [
      'Isolated inside dedicated Web Worker to keep 120 FPS UI unblocked',
      'Native vectorized execution across multiple registered tables',
      'Strict QueryEngine interface seam: profilers never bind to DuckDB directly',
    ],
    contractSnippet: `interface QueryEngine {
  query(sql: string, params?: unknown[]): Promise<ArrowTable>;
  registerTable(name: string, buffer: Uint8Array): Promise<TableMeta>;
  memoryUsage(): Promise<MemoryAccounting>;
}`,
  },
  {
    id: 'profiler',
    name: 'Semantic Schema Engine',
    role: 'Zero-Config Discovery',
    tech: 'Cardinality Profiler + Foreign Key Inference',
    latency: '< 25ms',
    details: [
      'Infers semantic column intent beyond raw storage types (Currency, Temporal, PK/FK)',
      'Cross-table containment & cardinality heuristics derive relational join graphs',
      'Every join edge carries confidence score and explicit evidence statement',
    ],
    contractSnippet: `interface SchemaGraph {
  readonly tables: TableDescriptor[];
  readonly edges: JoinEdge[];
  readonly capabilityGates: Map<CapabilityKey, boolean>;
}`,
  },
  {
    id: 'duckchat',
    name: 'DuckChat Cognitive Runtime',
    role: 'Deterministic AI Pipeline',
    tech: 'AST Guard + Mechanical Repair + WebLLM/Edge',
    latency: '< 1ms repair',
    details: [
      'AST Guard strictly admits SELECT / WITH clauses; blocks mutations at parser level',
      'Deterministic repair engine fixes GROUP BY omissions and sign flips with 0 extra LLM calls',
      'Verifiable Citation Gate: checks model numbers against DuckDB result table',
    ],
    contractSnippet: `interface DuckChatPipeline {
  guard(ast: SqlAst): Result<GuardedAst, SecurityFault>;
  repair(ast: GuardedAst): RepairedAst; // +6/72 benchmark boost
  verifyCitations(claim: string, rows: Record<string, unknown>[]): boolean;
}`,
  },
  {
    id: 'viewspec',
    name: 'ViewSpec Renderer',
    role: 'Grammar-Gated Presentation',
    tech: 'React 19 + Monaco Editor + Virtualized Canvas',
    latency: '60 FPS',
    details: [
      'Renderer consumes versioned, capability-gated ViewSpec schema',
      'Never executes raw model-emitted DOM or arbitrary scripts',
      'Deterministic views always paint first; AI components gracefully degrade on failure',
    ],
    contractSnippet: `interface ViewSpec {
  version: '2026.1';
  layout: 'split-hero' | 'pivot-grid' | 'erd-graph';
  sourceTables: string[];
  verifiedQueries: string[];
}`,
  },
];

export interface DuckChatRepairExample {
  id: string;
  name: string;
  prompt: string;
  rawModelSql: string;
  faultClass: string;
  repairedSql: string;
  repairReason: string;
  resultMetric: string;
}

export const DUCKCHAT_REPAIRS: DuckChatRepairExample[] = [
  {
    id: 'groupby-key',
    name: 'GROUP BY Projection Rectification',
    prompt: 'Show revenue and customer tier for all high-volume accounts in Q3',
    faultClass: 'Missing Non-Aggregated Projection in GROUP BY clause',
    rawModelSql: `SELECT 
  c.tier,
  c.region,
  SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o USING (customer_id)
WHERE o.order_date >= '2026-07-01'
GROUP BY c.tier`,
    repairedSql: `SELECT 
  c.tier,
  c.region,
  SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o USING (customer_id)
WHERE o.order_date >= '2026-07-01'
GROUP BY c.tier, c.region`,
    repairReason:
      'Deterministic AST walker identifies projected column `c.region` missing from `GROUP BY`. Repaired before execution at 0.2ms latency with zero secondary model calls.',
    resultMetric: '14 rows · 11ms execution in DuckDB',
  },
  {
    id: 'duration-scale',
    name: 'Temporal Unit Scaling Correction',
    prompt: 'Calculate average resolution time in hours for support tickets',
    faultClass: 'Raw Epoch Microsecond Division Fault',
    rawModelSql: `SELECT 
  priority,
  AVG(resolved_at - created_at) / 60 AS avg_duration
FROM support_tickets
GROUP BY priority`,
    repairedSql: `SELECT 
  priority,
  AVG(date_diff('second', created_at, resolved_at)) / 3600.0 AS avg_hours
FROM support_tickets
GROUP BY priority`,
    repairReason:
      'DuckDB interval type division mismatch caught by dialect rewrite layer. Replaces raw arithmetic with canonical `date_diff` hour computation.',
    resultMetric: '4 priority tiers · 7ms execution',
  },
  {
    id: 'accounting-sign',
    name: 'Signed Transaction Vectoring',
    prompt: 'Compute net cash balance by department across returns and payments',
    faultClass: 'Unsigned Absolute Sum on Bi-Directional Ledger',
    rawModelSql: `SELECT 
  department_id,
  SUM(amount) AS net_balance
FROM ledger_entries
GROUP BY 1`,
    repairedSql: `SELECT 
  department_id,
  SUM(CASE WHEN transaction_type = 'DEBIT' THEN -amount ELSE amount END) AS net_balance
FROM ledger_entries
GROUP BY 1`,
    repairReason:
      'Recognizes schema balance semantics from metadata classification. Automatically injects directional signage logic.',
    resultMetric: '8 departments · 9ms execution',
  },
];

export const GROUNDING_LADDER_DATA = [
  {
    rung: 0,
    label: 'Rung 0: Computed Facts Only',
    rowsInjected: '0 raw rows (schema + summary facts)',
    correctness: 71.6,
    status: 'Optimal accuracy ceiling',
    insight: 'Model focuses on exact column profiles, data types, and proven facts without context distraction.',
  },
  {
    rung: 1,
    label: 'Rung 1: Summary + 10 Sample Rows',
    rowsInjected: '10 representative records',
    correctness: 64.7,
    status: '−6.9% accuracy regression',
    insight: 'Row samples introduce specific value tokens that begin skewing predicate generation.',
  },
  {
    rung: 2,
    label: 'Rung 2: Summary + 100 Sample Rows',
    rowsInjected: '100 sample records',
    correctness: 63.7,
    status: '−7.9% accuracy regression',
    insight: 'Token density causes model attention to drift toward incidental row quirks rather than relational logic.',
  },
  {
    rung: 3,
    label: 'Rung 3: Raw Row Saturation',
    rowsInjected: 'Maximum allowable row context',
    correctness: 56.9,
    status: '−14.7% accuracy collapse',
    insight: 'Context pollution is real: raw row dumping degrades a model already supplied with computed relational facts.',
  },
];

export const FALSIFIED_HYPOTHESES = [
  {
    id: 'prompt-scaffolding',
    code: 'EXP-16a',
    title: 'Production Prompt vs Bare DDL',
    hypothesis: 'Carefully engineered system prompts with detailed few-shot examples would maximize SQL accuracy.',
    measuredResult: 'Production prompt scored 12/24 (N=3) — WORSE than bare DDL schema (15/24) on identical fixtures.',
    architecturalAction: 'Stripped 80% of verbose prompt scaffolding. Replaced with compact, high-density schema definitions.',
  },
  {
    id: 'semantic-labels',
    code: 'EXP-16b',
    title: 'Semantic Type Annotation Effect',
    hypothesis: 'Injecting inferred semantic types (e.g. "Primary Key", "Currency") into prompts would guide the model.',
    measuredResult: 'Labels proved net-harmful: 9 → 12 → 15 of 21 correct as labels went shipped → hand-corrected → removed.',
    architecturalAction: 'Isolated semantic types for UI capability gating only; removed from SQL synthesis prompts entirely.',
  },
  {
    id: 'json-protocol',
    code: 'EXP-16e',
    title: 'Structured-Spec JSON Protocol',
    hypothesis: 'Forcing the model to emit a structured intermediate JSON query tree would eliminate SQL syntax bugs.',
    measuredResult: 'Compiler gate passed 8/8, but model emission failed 0/8 execution-correct due to token format collapse.',
    architecturalAction: 'Killed JSON AST generation for small models. Allowed model to emit SQL directly, governed by DuckChat AST repairs.',
  },
];
