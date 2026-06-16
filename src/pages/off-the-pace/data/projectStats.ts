/**
 * projectStats the single source of truth for every headline number, identity
 * term, ML model, build-status row, and external link shown across the Off The
 * Pace pages. Edit a value here and it updates everywhere it is rendered.
 *
 * Fits in: imported by ProjectHero, the section components, and both views.
 * Note:    Numbers are verified against the real pipeline output - see the
 *          per-block "Source -" comments before changing any of them.
 *
 * For beginners ----------------------------------------------------------------
 * `as const` at the end of an object tells TypeScript "treat these exact values
 * as fixed and read-only" - so `STATS.seasons` is known to be literally 7, not
 * just "some number", and nothing can accidentally reassign it. This is a plain
 * data module: no React, no logic, just exported constants other files import.
 * -----------------------------------------------------------------------------
 */
// Single source of truth for landing-page headline stats. Verified against transform/ on 2026-05-31.
//
// Note on counts:
//   races: 147 = distinct race_ids in fct_lap_residuals (fully processed; qualifying for analysis).
//          168 = Bronze ingestion coverage (README.md / ingestion/README.md use this larger number).
//   tests: 336 = total dbt tests in schema.yml + singular tests/ (100% pass rate).
//          336 = the count transform/README.md usually cites.
//   mlTests: 27 = ML test suite (ml/tests/); runs via ml-ci.yml.
//
// Update this file whenever the pipeline is rebuilt with a new season or model changes.
export const STATS = {
  races: 147,
  racesIngested: 168,
  seasons: 7,
  seasonRange: '2018–2024',
  telemetryRowsPerSeason: '90M+',
  telemetryHz: 10,
  dbtModels: 60,
  intermediateModels: 36,
  martTables: 9,
  tests: 424,
  mlTests: 28,
  buildSeconds: 4,
} as const;

// The 7-term additive identity - pace_delta_s = sum(IDENTITY_TERMS) + driver_skill_residual_s
// Source - transform/tests/assert_lap_7term_identity.sql + transform/macros/assert_additive_identity.sql
// coast_tax does NOT appear in the shipped identity  - it was a heuristic refinement never merged.
export const IDENTITY_TERMS = [
  { key: 'fuel_component_s',        label: 'Fuel Mass',      color: '#475569' },
  { key: 'compound_component_s',    label: 'Tyre Compound',  color: 'var(--color-emerald-dark)' },
  { key: 'rubber_component_s',      label: 'Track Evolution', color: '#065F46' },
  { key: 'ambient_component_s',     label: 'Weather',        color: '#2563EB' },
  { key: 'constructor_component_s', label: 'Car Baseline',   color: '#334155' },
  { key: 'dirty_air_tax_s',         label: 'Dirty Air',      color: 'var(--color-blue-bright)' },
  { key: 'driver_skill_residual_s', label: 'Driver Skill',   color: 'var(--color-f1-red)' },
] as const;

// Five XGBoost models. Source - ml/model_card.yml (generated 2026-06-01).
// eval = final TimeSeriesSplit fold (2024); 2025 is designated holdout.
export const ML_MODELS = [
  { name: 'degradation_regressor_p10', label: 'Degradation P10', metric: 'Pinball ↓', eval: 0.078, baseline: 0.128 },
  { name: 'degradation_regressor_p50', label: 'Degradation P50', metric: 'Pinball ↓', eval: 0.190, baseline: 0.225 },
  { name: 'degradation_regressor_p90', label: 'Degradation P90', metric: 'Pinball ↓', eval: 0.128, baseline: 0.144 },
  { name: 'cliff_classifier',          label: 'Cliff Classifier', metric: 'Macro-F1 ↑', eval: 0.368, baseline: 0.184 },
  { name: 'stint_life_regressor',      label: 'Stint Life',       metric: 'RMSE ↓',     eval: 7.73,  baseline: 8.08  },
] as const;

export const ML_FACTS = {
  modelCount: 5,
  trainRows: 110_440,
  featureCount: 42,
  calibrationNominal: 0.80,
  calibrationEmpirical: 0.804,
  meanIntervalWidth: 1.11,
  calibrationN: 18_677,
  leakageProbeAccuracy: 0.9999,
  leakageMajority: 0.169,
} as const;

// Build status. Source - off-the-pace/README.md status table.
export type BuildStatus = 'built' | 'fitted' | 'wip' | 'planned';
export const BUILD_STATUS: { label: string; status: BuildStatus }[] = [
  { label: 'Ingestion (Bronze)',                    status: 'built'   },
  { label: `Transform (${STATS.dbtModels} models, ${STATS.tests} tests)`, status: 'built'   },
  { label: 'Coefficients  - all 6 components fitted', status: 'fitted'  },
  { label: `ML (5 XGBoost models, ${STATS.mlTests} tests)`,    status: 'built'   },
  { label: 'Docs & Governance (Docusaurus + 3 CI)', status: 'built'   },
  { label: 'First Attributed Finding',              status: 'built'   },
  { label: 'Frontend (React + DuckDB-Wasm)',        status: 'built' },
  { label: 'Streaming',                             status: 'planned' },
];

export const LINKS = {
  repo: 'https://github.com/justinclarke/off-the-pace',
  docs: 'https://offthepace.mintlify.app',
} as const;
