/**
 * projectStats the single source of truth for every headline number, identity
 * term, ML model, build-status row, and external link shown across the Off The
 * Pace pages. Edit a value here and it updates everywhere it is rendered.
 *
 * Fits in: imported by ProjectHero, the section components, and both views.
 * Note:    Numbers are verified against the real pipeline output - see the
 *          per-block "Source -" comments before changing any of them.
 */
// Single source of truth for landing-page headline stats. Verified against the off-the-pace repo (README, transform/target/manifest.json, ml/model_card.yml v14, dev.duckdb) on 2026-10-13.
//
// Note on counts:
//   races: 172 = distinct race_ids in fct_lap_residuals (fully processed; qualifying for analysis).
//          173 = Bronze ingestion coverage (README.md uses this larger number).
//   tests: 996 = total dbt tests (transform/target/manifest.json resource_type=test: generic + singular).
//   mlTests: 270 = ML test suite (ml/tests/, README.md `make ml-test`); runs via ml-ci.yml.
//
//   telemetryRowsPerSeason: 17M = mean of 14.4M to 19.0M rows per season in data/bronze/telemetry (137.2M rows over 8 seasons, parquet footers, 2026-10-13).
//   telemetryHz: 7.6 = mean SessionTime step of 0.131s within a driver-lap (FastF1 merged stream).
//
// Update this file whenever the pipeline is rebuilt with a new season or model changes.
export const STATS = {
  races: 172,
  racesIngested: 173,
  decomposedLaps: 161_040,
  seasons: 8,
  seasonRange: '2018–2025',
  telemetryRowsPerSeason: '17M',
  telemetryHz: 7.6,
  dbtModels: 93,
  intermediateModels: 53,
  martTables: 18,
  tests: 996,
  mlTests: 270,
} as const;

// The 5-term additive identity - pace_delta_s = fuel + compound + constructor + dirty_air_tax + driver_skill_residual_s
// (WI-01, 2026-09-27; was 7-term. Rubber and ambient now sit inside the field base pace.)
// Source - transform/tests/assert_lap_7term_identity.sql (file name kept; it enforces 5 terms) + transform/macros/assert_additive_identity.sql
// coast_tax does NOT appear in the shipped identity  - it was a heuristic refinement never merged.
// Colours reference the --color-term-* tokens in src/index.css (mirrored as raw
// hex in src/config/constants.ts TERM_COLORS for canvas/d3). Single source.
export const IDENTITY_TERMS = [
  { key: 'fuel_component_s',        label: 'Fuel Mass',       color: 'var(--color-term-fuel)' },
  { key: 'compound_component_s',    label: 'Tyre Compound',   color: 'var(--color-term-compound)' },
  { key: 'constructor_component_s', label: 'Car Baseline',    color: 'var(--color-term-constructor)' },
  { key: 'dirty_air_tax_s',         label: 'Dirty Air',       color: 'var(--color-term-dirty-air)' },
  { key: 'driver_skill_residual_s', label: 'Driver Skill',    color: 'var(--color-term-driver)' },
] as const;

// Five XGBoost models. Source - ml/model_card.yml (v14, generated 2026-09-28).
// eval = final TimeSeriesSplit fold (2025, a validation fold: it also admitted features); 2026 is the designated holdout.
export const ML_MODELS = [
  { name: 'degradation_regressor_p10', label: 'Degradation P10', metric: 'Pinball ↓', eval: 0.388, baseline: 0.603 },
  { name: 'degradation_regressor_p50', label: 'Degradation P50', metric: 'Pinball ↓', eval: 0.861, baseline: 1.124 },
  { name: 'degradation_regressor_p90', label: 'Degradation P90', metric: 'Pinball ↓', eval: 0.483, baseline: 0.618 },
  { name: 'cliff_classifier',          label: 'Cliff Classifier', metric: 'Macro-F1 ↑', eval: 0.371, baseline: 0.213 },
  { name: 'stint_life_regressor',      label: 'Stint Life',       metric: 'AFT NLL ↓',  eval: 2.347, baseline: 2.367 },
] as const;

export const ML_FACTS = {
  modelCount: 5,
  trainRows: 95_513,
  featureCount: 32,
  calibrationNominal: 0.80,
  calibrationEmpirical: 0.796,
  meanIntervalWidth: 5.70,
  calibrationN: 13_951,
  leakageProbeAccuracy: 0.937,
  leakageMajority: 0.146,
} as const;

// Build status. Source - off-the-pace/README.md status table.
export type BuildStatus = 'built' | 'fitted' | 'wip' | 'planned';
export const BUILD_STATUS: { label: string; status: BuildStatus }[] = [
  { label: 'Ingestion (Bronze)',                    status: 'built'   },
  { label: `Transform (${STATS.dbtModels} models, ${STATS.tests} tests)`, status: 'built'   },
  { label: 'Coefficients (KM tyre cliff)', status: 'fitted'  },
  { label: `ML (5 XGBoost models, ${STATS.mlTests} tests)`,    status: 'built'   },
  { label: 'Docs & Governance (Mintlify + 15 CI workflows)', status: 'built'   },
  { label: 'First Attributed Finding',              status: 'built'   },
  { label: 'Frontend (React + DuckDB-Wasm)',        status: 'built' },
  { label: 'Streaming',                             status: 'planned' },
];

export const LINKS = {
  repo: 'https://github.com/justinclarke/off-the-pace',
  docs: 'https://offthepace.mintlify.app',
} as const;
