/**
 * datascopeData.ts: every claim and number on /datascope, in one place.
 *
 * The rule for this file is that each figure traces to a recorded run, a test
 * command or the source itself, named in `source`. Where that file is public
 * on GitHub, `href` links straight to it. The DuckChat repo is private, so its
 * sources are cited by path only. Re-swept 2026-10-13 against:
 *   ~/github/DataScope   README, src/, eval/, and experiment 16's record under
 *                        _implementation/_misc/_ideation/_experiments/_archive/
 *   ~/github/duckchat    README, docs/PROJECT-WALKTHROUGH.md,
 *                        docs/repairs/INDEX.md, experiments/check-repair.js
 *   _docs/_resume.yaml   the evidence-swept canonical_stats for both projects
 *
 * Deliberately absent, because nothing in either repo backs them: latency
 * claims, compliance claims (DataScope's own README says "nothing here is a
 * compliance claim"), CI or supply-chain gates on DataScope (it has no
 * workflows), and any suggestion that DataScope ships DuckChat's repairs.
 */

export const DATASCOPE_APP_URL = 'https://data--scope.web.app';
export const DATASCOPE_APP_HOST = 'data--scope.web.app';
export const DATASCOPE_REPO_URL = 'https://github.com/JustinClarke/DataScope';

const dsFile = (path: string) => `${DATASCOPE_REPO_URL}/blob/main/${path}`;
const EXP16 = '_implementation/_misc/_ideation/_experiments/_archive/16-light-model-sql-ceiling/README.md';

/** Deep link the live app reads on load (IngestionPanel's `?sample=` effect). */
export const sampleUrl = (id: SampleId) => `${DATASCOPE_APP_URL}/?sample=${id}`;

export interface Source {
  /** Repo-relative path, shown as the citation. */
  source: string;
  /** Public GitHub URL, only when the file is actually public. */
  href?: string;
}

// ─── Chapters ────────────────────────────────────────────────────────────────
// One page, ordered by depth: each chapter goes a level further into the
// system than the last, so the copy gets more technical as you scroll.

export const CHAPTERS = [
  { id: 'product', label: 'Product' },
  { id: 'engine', label: 'Engine' },
  { id: 'language', label: 'Language' },
  { id: 'correctness', label: 'Correctness' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'frontier', label: 'Frontier' },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]['id'];

// ─── Product ──────────────────────────────────────────────────────────────

export const HERO_STATS = [
  { value: '66.5k', label: 'lines of TypeScript' },
  { value: '2,500+', label: 'tests in 231 files' },
  { value: '12', label: 'evaluation harnesses' },
] as const;

/** The five datasets bundled with the app (DataScope/src/features/ingestion/samples.ts). */
export const SAMPLES = [
  {
    id: 'ecommerce',
    label: 'E-commerce mini-warehouse',
    shape: '4 tables · 5,437 rows',
  },
  {
    id: 'titanic',
    label: 'Titanic Passengers',
    shape: '891 rows · 10 columns',
  },
  {
    id: 'stock_prices',
    label: 'Daily Stock Prices',
    shape: '2,500 days · OHLCV',
  },
  {
    id: 'product_reviews',
    label: 'Product Reviews',
    shape: '520 rows · free text',
  },
  {
    id: 'weather',
    label: 'City Weather Data',
    shape: '3,650 days · 6 columns',
  },
] as const;

export type SampleId = (typeof SAMPLES)[number]['id'];

// ─── Engine ───────────────────────────────────────────────────────────────

export interface Seam extends Source {
  name: string;
  body: string;
  /** A trimmed excerpt of the real declaration, not the whole file. */
  code?: string;
}

const SEAM_QUERY_ENGINE: Seam = {
  name: 'QueryEngine',
  body:
    'Profiling, classification and insight code is written against this interface, never against DuckDB-Wasm directly, so the engine can be replaced without touching the features above it. A dropped File registers as a streaming handle, so a large file is never copied whole onto the JS heap.',
  code: `export interface QueryEngine {
  execute(
    sql: string,
    options?: { signal?: AbortSignal },
  ): Promise<QueryResult>;
  registerFile(name: string, data: Uint8Array | File): Promise<void>;
  summarize(tableName: string): Promise<QueryResult>;
  exportTable(
    tableName: string,
    format: "parquet" | "csv",
  ): Promise<Uint8Array<ArrayBuffer>>;
}`,
  source: 'src/types/query.ts',
  href: dsFile('src/types/query.ts'),
};

const SEAM_REGISTRY: Seam = {
  name: 'Table registry',
  body:
    'The engine executes; the registry owns what is loaded. It tracks every source and derived table with its metadata, memory accounting and lifecycle. A derived table keeps the SQL that produced it, which is what undo, redo and replay run on.',
  code: `export interface TableRegistryEntry {
  tableName: string;
  origin: "file" | "derived" | "api" | "sample" | "shared";
  rowCount: number;
  memoryBytes: number;
  /** The CREATE TABLE AS that produced it. Powers undo/redo/replay. */
  generatingSql?: string;
  /** True when the source exceeded the sampled-preview size tier. */
  sampled?: boolean;
  // ...profile, columns, sourceUrl, lastFetchedAt
}`,
  source: 'src/types/dataset.ts',
  href: dsFile('src/types/dataset.ts'),
};

const SEAM_FACTS: Seam = {
  name: 'Structural facts',
  body:
    'One model sits behind both the profile UI and the schema pruner that writes the AI prompt. Facts carry snapshot provenance and are never labelled permanent or verified. Foreign keys are inferred from containment and cardinality, and every edge in the schema graph carries a confidence score, the sentence of evidence behind it, and a flag when two parent columns nearly tie.',
  source: 'src/services/relationships.ts',
  href: dsFile('src/services/relationships.ts'),
};

const SEAM_VIEWSPEC: Seam = {
  name: 'ViewSpec',
  body:
    'The renderer consumes a versioned, capability-gated layout artifact and never executes model output. A deterministic producer always paints first. An AI producer may only compose inside the grammar the capability broker declared legal, and any failure falls back to the deterministic view.',
  code: `export interface ViewSpecPanel {
  /** Id from the fixed panel registry, never an arbitrary string. */
  componentId: string;
  props: Record<string, unknown>;
  chart?: ChartSpec;
  /** Tier 1 paints unconditionally; 2 and 3 wait for disclosure. */
  tier: 1 | 2 | 3;
}`,
  source: 'src/types/viewspec.ts',
  href: dsFile('src/types/viewspec.ts'),
};

/**
 * The README's architecture flowchart, as a spine of stations. `branch` is the
 * side lane leaving that station; `seam` is the load-bearing interface that
 * sits at it. Order and edges follow the README's mermaid graph.
 */
export interface Station {
  nodes: readonly string[];
  caption?: string;
  branch?: { label: string; ai?: boolean };
  seam?: Seam;
}

export const ENGINE_STATIONS: readonly Station[] = [
  {
    nodes: ['File drop'],
    caption: 'CSV, TSV, Parquet, JSON, JSONL or ZIP. A dropped folder becomes one table per file.',
  },
  { nodes: ['DuckDB-Wasm worker'], seam: SEAM_QUERY_ENGINE },
  {
    nodes: ['Table registry'],
    branch: { label: 'SQL, pivot, then charts' },
    seam: SEAM_REGISTRY,
  },
  { nodes: ['Profiler', 'Classifier', 'Capability broker'], seam: SEAM_FACTS },
  {
    nodes: ['ViewSpec'],
    branch: { label: 'Optional AI producer', ai: true },
    seam: SEAM_VIEWSPEC,
  },
  { nodes: ['Renderer'] },
];

export const ENGINE_SPECS: readonly (Source & { term: string; body: string })[] = [
  {
    term: 'Size tiers',
    body: 'A warning at 50 MB, a 100,000-row sample above 100 MB, and a refusal with guidance above 300 MB. The tier is decided before a byte is read, so a big file gets an answer instead of a hung tab.',
    source: 'src/features/ingestion/aggregateSize.ts',
    href: dsFile('src/features/ingestion/aggregateSize.ts'),
  },
  {
    term: 'Threads',
    body: "COOP and COEP headers unlock SharedArrayBuffer for DuckDB's threaded build. COEP is set to credentialless so WebLLM's cross-origin model shards still load, and without isolation DuckDB falls back to a single thread.",
    source: 'vite.config.ts',
    href: dsFile('vite.config.ts'),
  },
  {
    term: 'Reloads',
    body: 'Dropped files are staged in OPFS by a worker that receives the Blob by reference. After a hard reload the staged bytes go back into a fresh engine, and the tables are queryable again without a re-drop.',
    source: 'src/services/opfsStaging.ts',
    href: dsFile('src/services/opfsStaging.ts'),
  },
  {
    term: 'Offline',
    body: 'The production build is a folder of static files. It runs from any static host, or straight off disk with the network cable unplugged.',
    source: 'README.md',
    href: dsFile('README.md'),
  },
];

// ─── Language ─────────────────────────────────────────────────────────────

/** DataScope's three AI modes (README "AI optional, three modes"). */
export const AI_MODES = [
  { mode: 'Local only', detail: 'AI off. Every deterministic module still works.', network: 'None' },
  { mode: 'Local model', detail: 'WebLLM on WebGPU in a worker, cached after the first download.', network: 'Model download only' },
  { mode: 'API', detail: 'Workers AI, your own provider key, or a local Ollama endpoint.', network: 'Per request' },
] as const;

/** DuckChat's single-shot path, in run order (duckchat/src/ask.js and friends). */
export const QUESTION_PATH = [
  {
    step: 'Schema, not rows',
    body: 'Column names and types, the allowed values of low-cardinality columns, date ranges and a few worked examples. The table itself never goes into the prompt.',
  },
  {
    step: 'One query',
    body: 'The model writes a single SQL statement. Agent mode exists, and ships switched off because it measured worse.',
  },
  {
    step: 'Read-only guard',
    body: 'Anything that is not a plain SELECT or WITH is refused before it reaches the database.',
  },
  {
    step: 'Eight repairs',
    body: "Faults that are wrong by definition are rewritten, and both frontends report the rewrite instead of passing it off as the model's own.",
  },
  {
    step: 'One retry',
    body: 'If DuckDB rejects the SQL, the error goes back to the model once.',
  },
  {
    step: 'Checked sentence',
    body: "For a one-row result, a check confirms the answer states that row's numbers and dates.",
  },
] as const;

export interface RepairExample {
  id: string;
  name: string;
  fn: string;
  kind: 'structural' | 'fit';
  question?: string;
  before: string;
  after: string;
  why: string;
  declines: string;
  source: string;
}

/**
 * Before/after pairs are the repo's own guard cases (experiments/check-repair.js),
 * byte for byte, except the superlative, which shows the shape repair.js's
 * header documents ("which month had the most transactions" returned as a
 * twenty-row ranking). Its guard case uses MAX(transaction_id) as a
 * deliberately tie-proof aggregate, which reads oddly out of context.
 */
export const REPAIRS: readonly RepairExample[] = [
  {
    id: 'group-keys',
    name: 'Missing group key',
    fn: 'repairGroupKeys',
    kind: 'structural',
    before: 'SELECT ROUND(SUM(amount_cents), 2) AS total\nFROM records\nGROUP BY category',
    after: 'SELECT category, ROUND(SUM(amount_cents), 2) AS total\nFROM records\nGROUP BY category',
    why: 'The query runs and returns a column of totals with nothing saying which total is which. Eight prompt strategies failed to remove it, and a prompt rule naming the fault made it appear in three places that had been fine. The keys are already in the text, so no model is needed to fix it.',
    declines: "It reads top-level clauses only. An early version paired an outer GROUP BY with a CTE's SELECT list and turned valid SQL into a syntax error, and a repair that breaks a working query is worse than one that never fires.",
    source: 'duckchat/src/repair.js · repair 1',
  },
  {
    id: 'hours',
    name: 'Wrong unit divisor',
    fn: 'repairHoursConversion',
    kind: 'fit',
    before: 'SELECT SUM(ms_played / 3600.0) AS hours_listened\nFROM records',
    after: 'SELECT SUM(ms_played / 3600000.0) AS hours_listened\nFROM records',
    why: "Milliseconds to hours is a constant, 3,600,000, and an alias that says hours is a promise about the number. On two adjacent questions the model wrote two different wrong divisors, one 60× and one 1000× too large, so this is arithmetic it can't be trusted with.",
    declines: 'It fires only when the column is detected as milliseconds and the alias says hours. The same division aliased x, or the word hours inside a string literal, is left alone.',
    source: 'duckchat/src/repair.js · repair 2',
  },
  {
    id: 'sign',
    name: 'Signed money summed one way',
    fn: 'repairSignConvention',
    kind: 'fit',
    before: 'SELECT SUM(amount_cents / 100.0) AS spent_dollars\nFROM records',
    after: 'SELECT -SUM(amount_cents / 100.0) AS spent_dollars\nFROM records',
    why: 'Debits are negative in this column, so a total aliased as spending came back negative. A spent total is positive by definition, which makes the sign mechanically decidable.',
    declines: 'Detection is timid on purpose: the column has to be named like money and actually hold negatives (MIN below zero). A net total aliased total_dollar_amount, a comparison against zero and a column already inside ABS() all pass through untouched.',
    source: 'duckchat/src/repair.js · repair 3',
  },
  {
    id: 'superlative',
    name: 'Singular question, ranked answer',
    fn: 'repairSuperlativeLimit',
    kind: 'structural',
    question: 'which month had the most transactions?',
    before: 'SELECT month, COUNT(*) AS n\nFROM records\nGROUP BY month\nORDER BY n DESC\nLIMIT 20',
    after: 'SELECT month, COUNT(*) AS n\nFROM records\nGROUP BY month\nORDER BY n DESC\nLIMIT 1',
    why: "The prompt's own worked example answered a singular-looking question with LIMIT 20, and the model copied the constant. A prose rule stating the fix moved the result in none of three domains.",
    declines: "Before truncating, it runs the query and checks that the top two rows don't tie. A plural noun, a digit, or words like top, each and all in the question also stop it.",
    source: 'duckchat/src/repair.js · repair 4',
  },
];

export const REPAIR_STATS = [
  {
    value: '62 → 68',
    unit: 'of 72',
    label: 'Repairs off, then on. Same model (qwen3.5:4b) at the same commit (377e711).',
    source: 'duckchat/docs/baselines/4b-s59-fitoff-62of72.json, 4b-s60-gfil-example-68of72.json',
  },
  {
    value: '66 / 66',
    unit: 'untouched',
    label: 'Correct queries the repair layer has to leave byte-identical, checked on every npm test.',
    source: 'duckchat/experiments/check-repair-noop.js',
  },
  {
    value: '16 vs 18',
    unit: 'of 22',
    label: 'A five-sample vote scored 16 even with an oracle choosing its best answer. Repair plus one retry scored 18 for a quarter of the cost.',
    source: 'duckchat/docs/repairs/INDEX.md · s22',
  },
] as const;

// ─── Correctness ──────────────────────────────────────────────────────────

/**
 * The four levels of correctness from DuckChat's walkthrough, each paired with
 * a measured failure where that level passed and a later one didn't.
 */
export const LEVELS = [
  {
    level: 'The SQL parsed',
    gap: 'Gemini Nano wrote valid SQL naming real tables for 8 of 8 questions. Executed and checked, about 6 of 8 were right.',
    source: 'DataScope experiment 16, probe 3',
  },
  {
    level: 'The SQL ran',
    gap: 'A triple-hop average of averages ran cleanly in every prompt arm and returned 272.9. The answer was 818.7.',
    source: 'DataScope experiment 16b',
  },
  {
    level: 'The rows answer the question',
    gap: "With operator precedence and the default LIMIT fixed, comparison questions returned complete rows 12 times out of 12. The model's counts matched its own rows once.",
    source: 'duckchat/docs/PROJECT-WALKTHROUGH.md',
  },
  {
    level: 'The sentence matches the rows',
    gap: "A check that an answer's numbers appear in the returned rows can't catch wrong rows, a missing group or a wrong verdict, so each level is scored on its own.",
    source: 'duckchat/docs/PROJECT-WALKTHROUGH.md',
  },
] as const;

/**
 * DataScope's NL-to-SQL harness: 58 labelled questions, five arms, recorded
 * 2026-08-02 (eval/EVAL-RESULTS.json, which is gitignored, hence no link).
 * Rates are fractions of 58. `role` marks the two controls that bracket it.
 */
export const HARNESS = {
  questions: 58,
  ranAt: '2 Aug 2026',
  source: 'eval/EVAL-RESULTS.json',
  arms: [
    { id: 'mock-cloud', label: 'Mock cloud', model: 'returns the gold SQL', exec: 1, correct: 1, role: 'ceiling' },
    { id: 'webllm', label: 'In-browser', model: 'Qwen2.5-Coder 1.5B on WebGPU', exec: 0.931, correct: 0.724 },
    { id: 'cloud-edge', label: 'Cloud edge', model: 'hosted model via the edge worker', exec: 0.966, correct: 0.534 },
    { id: 'ollama', label: 'Ollama stand-in', model: 'qwen3:8b, not the pinned model', exec: 0.466, correct: 0.431 },
    { id: 'local-template', label: 'Template', model: 'keyword templates, no model', exec: 0.672, correct: 0.19, role: 'floor' },
  ],
} as const;

// ─── Experiments ─────────────────────────────────────────────────────────

/** Experiment 10, the grounding ladder: 4 rungs × 102 calls, gemini-flash-latest. */
export const GROUNDING_LADDER = {
  calls: 408,
  model: 'gemini-flash-latest',
  source: 'eval/claude/10-grounding-ladder/CHAT-RESULTS-gemini.json',
  href: dsFile('eval/claude/10-grounding-ladder/CHAT-RESULTS-gemini.json'),
  rungs: [
    { rows: '0', label: 'computed facts only', correct: 71.6 },
    { rows: '10', label: '+ 10 rows', correct: 64.7 },
    { rows: '100', label: '+ 100 rows', correct: 63.7 },
    { rows: 'all', label: '+ every row', correct: 56.9 },
  ],
} as const;

export interface Result {
  question: string;
  result: string;
  detail: string;
  outcome: string;
  source: string;
}

export const RESULTS: readonly Result[] = [
  {
    question: 'Does letting the model query in a loop beat one query?',
    result: '16/22 vs 20/22',
    detail: 'Agent mode against single-shot on a real 305,757-row Spotify export, at 2.3× the tokens and 2.3× the wall clock. The model averaged 1.05 queries per question, because it only revisited a query when DuckDB raised an error, which the built-in retry already handles.',
    outcome: 'Agent mode ships switched off.',
    source: 'duckchat/docs/build-log/s43-the-agentic-query-loop-the-model.md',
  },
  {
    question: 'Is a bigger local model better?',
    result: '62/66 vs 57 and 60',
    detail: 'qwen3.5:4b against two runs of qwen3.5:9b at the same commit (66c87f5). That is one benchmark at one and two runs, so it says something about this harness rather than about scale in general.',
    outcome: 'The 4B is still the local default.',
    source: 'duckchat/docs/baselines/4b-run2.json, 9b-run1.json, 9b-run2.json',
  },
  {
    question: 'Does the production prompt help a small model?',
    result: '12/24 vs 15/24',
    detail: "The app's real schema block (row counts, semantic types, an inferred relationships section) against a bare DDL block, on an identical fixture at N=3.",
    outcome: 'Richer schema description made the model worse at the schema.',
    source: 'DataScope experiment 16a',
  },
  {
    question: "Do the app's semantic-type labels help?",
    result: '9 → 12 → 15 of 21',
    detail: 'Labels as shipped, then hand-corrected, then removed. The classifier is one of the headline features of the app, and inside the prompt it was making the SQL worse.',
    outcome: 'Without labels the prompt scored 18/24, the best any prompt reached on that fixture.',
    source: 'DataScope experiment 16b',
  },
  {
    question: 'Can a structured spec stop clerical errors?',
    result: '8/8, then 0/8',
    detail: 'A host-side compiler turned all 8 fixture questions into gold-matching SQL. Asked to emit the spec itself, the model scored 0 of 8, stuck repeating the same invalid reference on every retry.',
    outcome: 'The bottleneck was the hand-rolled JSON protocol, not the model.',
    source: 'DataScope experiment 16e',
  },
  {
    question: 'Is a hosted model at temperature 0 repeatable?',
    result: '63/70, twice',
    detail: 'Two runs agreed on pass or fail for 68 of 70 questions, yet the SQL text changed on 17 of them.',
    outcome: 'Hosted runs are treated as samples, and fixtures freeze the truth.',
    source: 'duckchat/docs/PROJECT-WALKTHROUGH.md',
  },
];

// ─── Frontier ────────────────────────────────────────────────────────────

/**
 * Experiment 16: execution-verified correctness by model and schema shape.
 * Cells are passes over attempts; three repeats of 8 questions unless `single`.
 */
export const FRONTIER = {
  source: EXP16,
  href: dsFile(EXP16),
  fixtures: ['Flat', 'One join', 'Four tables'],
  models: [
    { name: 'Qwen3 1.7B', note: 'WebGPU build', cells: [{ n: 24, of: 24 }, { n: 24, of: 24 }, { n: 24, of: 24 }] },
    { name: 'Qwen2.5-Coder 1.5B', note: 'shipped pin', cells: [{ n: 24, of: 24 }, { n: 24, of: 24 }, { n: 18, of: 24 }] },
    { name: 'Qwen2.5-Coder 0.5B', note: 'Ollama', cells: [{ n: 8, of: 8, single: true }, { n: 15, of: 24 }, { n: 12, of: 24 }] },
  ],
} as const;

/** The fourth axis: stacked aggregation on the same four tables, Qwen3 1.7B, N=3. */
export const NESTED_GRAIN = [
  { arm: 'Bare DDL block', score: '15/24' },
  { arm: 'Production prompt', score: '12/24' },
  { arm: 'Labels stripped', score: '18/24' },
] as const;

export const PRACTICES = [
  {
    term: 'Written down first',
    body: 'Pass rules go into the experiment README before any model is called, and mechanical gates stay separate from anything scored by a person.',
  },
  {
    term: 'Append-only runs',
    body: 'Run directories are allocated from a manifest, refuse to overwrite, and redact secrets. A recorded run can be re-scored later without another model call.',
  },
  {
    term: 'Reviewed before spend',
    body: "Experiment 20's first design went to adversarial review and came back with five blocking findings, one of them an arm that silently duplicated another. It was rewritten as a falsifiable ablation before any inference was paid for.",
  },
  {
    term: "Data that can't drift",
    body: "DuckChat's CI regenerates its seeded dataset on Node 20, 22 and 24 and fails on any diff, so a score can't be explained by the data changing underneath it.",
  },
] as const;

export const STACK = [
  'React 19',
  'TypeScript 6',
  'Vite 8',
  'DuckDB-Wasm 1.32',
  'Apache Arrow 17',
  'WebLLM 0.2.84',
  'Monaco',
  'Zustand 5',
  'Vitest 4',
  'Cloudflare Workers',
  'Terraform',
] as const;
