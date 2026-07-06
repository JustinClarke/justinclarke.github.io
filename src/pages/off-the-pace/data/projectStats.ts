/**
 * projectStats the single source of truth for every headline number, identity
 * term, ML model, build-status row, and external link shown across the Off The
 * Pace pages. Edit a value here and it updates everywhere it is rendered.
 *
 * Fits in: imported by ProjectHero, the section components, and both views.
 * Note:    Numbers are verified against the real pipeline output - see the
 *          per-block "Source -" comments before changing any of them.
 */
// Single source of truth for landing-page headline stats. Verified against transform/ on 2026-06-20.
//
// Note on counts:
//   races: 147 = distinct race_ids in fct_lap_residuals (fully processed; qualifying for analysis).
//          168 = Bronze ingestion coverage (README.md / ingestion/README.md use this larger number).
//   tests: 435 = total dbt tests (transform/target/manifest.json resource_type=test: generic + singular).
//          (README.md still cites 336 from an earlier season build; 435 is the current parsed count.)
//   mlTests: 28 = ML test suite (ml/tests/); runs via ml-ci.yml.
//
// Update this file whenever the pipeline is rebuilt with a new season or model changes.
export const STATS = {
  races: 147,
  racesIngested: 168,
  decomposedLaps: 137_447,
  seasons: 7,
  seasonRange: '2018–2024',
  telemetryRowsPerSeason: '90M+',
  telemetryHz: 10,
  dbtModels: 60,
  intermediateModels: 34,
  martTables: 10,
  tests: 435,
  mlTests: 28,
  buildSeconds: 4,
} as const;

// The 7-term additive identity - pace_delta_s = sum(IDENTITY_TERMS) + driver_skill_residual_s
// Source - transform/tests/assert_lap_7term_identity.sql + transform/macros/assert_additive_identity.sql
// coast_tax does NOT appear in the shipped identity  - it was a heuristic refinement never merged.
// Colours reference the --color-term-* tokens in src/index.css (mirrored as raw
// hex in src/config/constants.ts TERM_COLORS for canvas/d3). Single source.
export const IDENTITY_TERMS = [
  { key: 'fuel_component_s',        label: 'Fuel Mass',       color: 'var(--color-term-fuel)' },
  { key: 'compound_component_s',    label: 'Tyre Compound',   color: 'var(--color-term-compound)' },
  { key: 'rubber_component_s',      label: 'Track Evolution', color: 'var(--color-term-rubber)' },
  { key: 'ambient_component_s',     label: 'Weather',         color: 'var(--color-term-ambient)' },
  { key: 'constructor_component_s', label: 'Car Baseline',    color: 'var(--color-term-constructor)' },
  { key: 'dirty_air_tax_s',         label: 'Dirty Air',       color: 'var(--color-term-dirty-air)' },
  { key: 'driver_skill_residual_s', label: 'Driver Skill',    color: 'var(--color-term-driver)' },
] as const;

// Five XGBoost models. Source - ml/model_card.yml (v3, generated 2026-06-12).
// eval = final TimeSeriesSplit fold (2024); 2025 is designated holdout.
export const ML_MODELS = [
  { name: 'degradation_regressor_p10', label: 'Degradation P10', metric: 'Pinball ↓', eval: 0.091, baseline: 0.172 },
  { name: 'degradation_regressor_p50', label: 'Degradation P50', metric: 'Pinball ↓', eval: 0.195, baseline: 0.301 },
  { name: 'degradation_regressor_p90', label: 'Degradation P90', metric: 'Pinball ↓', eval: 0.122, baseline: 0.156 },
  { name: 'cliff_classifier',          label: 'Cliff Classifier', metric: 'Macro-F1 ↑', eval: 0.323, baseline: 0.235 },
  { name: 'stint_life_regressor',      label: 'Stint Life',       metric: 'RMSE ↓',     eval: 8.13,  baseline: 9.50  },
] as const;

export const ML_FACTS = {
  modelCount: 5,
  trainRows: 113_300,
  featureCount: 41,
  calibrationNominal: 0.80,
  calibrationEmpirical: 0.802,
  meanIntervalWidth: 1.23,
  calibrationN: 19_066,
  leakageProbeAccuracy: 0.987,
  leakageMajority: 0.168,
} as const;

// Build status. Source - off-the-pace/README.md status table.
export type BuildStatus = 'built' | 'fitted' | 'wip' | 'planned';
export const BUILD_STATUS: { label: string; status: BuildStatus }[] = [
  { label: 'Ingestion (Bronze)',                    status: 'built'   },
  { label: `Transform (${STATS.dbtModels} models, ${STATS.tests} tests)`, status: 'built'   },
  { label: 'Coefficients  - all 6 components fitted', status: 'fitted'  },
  { label: `ML (5 XGBoost models, ${STATS.mlTests} tests)`,    status: 'built'   },
  { label: 'Docs & Governance (Mintlify + 3 CI)', status: 'built'   },
  { label: 'First Attributed Finding',              status: 'built'   },
  { label: 'Frontend (React + DuckDB-Wasm)',        status: 'built' },
  { label: 'Streaming',                             status: 'planned' },
];

export const LINKS = {
  repo: 'https://github.com/justinclarke/off-the-pace',
  docs: 'https://offthepace.mintlify.app',
} as const;
