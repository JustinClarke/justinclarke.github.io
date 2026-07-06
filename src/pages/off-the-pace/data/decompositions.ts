/**
 * decompositions real, baked lap decompositions pulled from the Off The Pace
 * warehouse (`fct_lap_residuals`). This is the single source of truth for every
 * "seven causes, one lap" visual: the living hero waterfall (SplitHero), the
 * DecompositionExplainer, and the break-the-invariant demo on the architecture
 * page. Numbers are real, not illustrative  - that is the whole point.
 *
 * Fits in: imported by the hero panel, the decomposition chart, and the
 *          invariant demo. Colours/labels reuse IDENTITY_TERMS (projectStats).
 *
 * Provenance ------------------------------------------------------------------
 *   Source : off-the-pace `app/public/data/facts/fct_lap_residuals/{year}.parquet`
 *            (a thin export of the dbt mart of the same name).
 *   Query  : SELECT lap_time_s + the 7 component columns WHERE race_id/driver/lap.
 *   Verified: 2026-06-20. Reproduce with off-the-pace
 *            `scripts/export_portfolio_laps.py` (one-shot; manual copy, not CI).
 *
 * The invariant -----------------------------------------------------------------
 *   fct_lap_residuals closes an additive identity (positive seconds = slower):
 *     lap_time_s = base_track_pace_s
 *                + fuel + compound + rubber + ambient + constructor
 *                + dirty_air_tax + driver_skill_residual
 *   so the structural baseline (= "true pace" here) is exactly
 *     truePace_s = grossLapTime_s - Σ(terms).
 *   We store gross + the 7 signed terms and *derive* truePace, so the bar can
 *   never silently drift out of tolerance (±0.0001s).
 *
 * Each raw lap below is a plain object of {term key -> seconds}. `buildLap` turns
 * it into a `LapDecomposition` whose `terms` array is ordered exactly like
 * IDENTITY_TERMS (so charts iterate in a stable order) and whose `truePace_s`
 * and `totalStripped_s` are computed, not typed by hand.
 */
import { IDENTITY_TERMS } from './projectStats';

export type IdentityTermKey = (typeof IDENTITY_TERMS)[number]['key'];

export interface LapTerm {
  key: IdentityTermKey;
  label: string;        // human label from IDENTITY_TERMS ("Fuel Mass")
  color: string;        // var(--color-term-*) from IDENTITY_TERMS
  seconds: number;      // signed: positive = slower than baseline, negative = faster
}

export interface LapDecomposition {
  id: string;
  raceLabel: string;            // "São Paulo 2021"
  raceId: string;               // warehouse race_id, e.g. "2021_19" (provenance)
  lap: number;
  driver: string;               // 3-letter code, e.g. "HAM"
  position: number;
  compound: string;             // "HARD" | "MEDIUM" | "SOFT" | ...
  tyreAge: number;              // age_in_stint, laps on this set
  grossLapTime_s: number;       // lap_time_s the clock showed
  truePace_s: number;           // = gross - Σterms (structural / field baseline)
  totalStripped_s: number;      // = Σterms (signed net of the 7 measured causes)
  terms: LapTerm[];             // 7 terms, signed, ordered like IDENTITY_TERMS
}

type RawTerms = Record<IdentityTermKey, number>;

interface RawLap {
  id: string;
  raceLabel: string;
  raceId: string;
  lap: number;
  driver: string;
  position: number;
  compound: string;
  tyreAge: number;
  grossLapTime_s: number;
  terms: RawTerms;
}

const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

function buildLap(raw: RawLap): LapDecomposition {
  const terms: LapTerm[] = IDENTITY_TERMS.map((t) => ({
    key: t.key,
    label: t.label,
    color: t.color,
    seconds: raw.terms[t.key],
  }));
  const totalStripped_s = round4(terms.reduce((sum, t) => sum + t.seconds, 0));
  const truePace_s = round4(raw.grossLapTime_s - totalStripped_s);
  return { ...raw, terms, truePace_s, totalStripped_s };
}

// ── Raw laps (exact warehouse values, full precision) ──
//
// HERO  - George Russell, Las Vegas 2024, Lap 6, leading. A clean front-runner
// lap where all seven causes are legibly non-zero and the clock (1:38.330)
// overstates the underlying pace by ~1.27s of net penalty.
const RAW_LAPS: RawLap[] = [
  {
    id: 'las-vegas-2024-l6-rus',
    raceLabel: 'Las Vegas 2024',
    raceId: '2024_22',
    lap: 6,
    driver: 'RUS',
    position: 1,
    compound: 'MEDIUM',
    tyreAge: 7,
    grossLapTime_s: 98.33,
    terms: {
      fuel_component_s: 2.277,
      compound_component_s: 2.4364,
      rubber_component_s: 0.24094,
      ambient_component_s: -0.023593,
      constructor_component_s: -1.033063,
      dirty_air_tax_s: 0.5,
      driver_skill_residual_s: -3.125396,
    },
  },
  // São Paulo 2021, Lap 59  - the overtake lap from the published finding.
  // HAM passes VER for the lead; the decomposition is the case-study centrepiece.
  {
    id: 'sao-paulo-2021-l59-ham',
    raceLabel: 'São Paulo 2021',
    raceId: '2021_19',
    lap: 59,
    driver: 'HAM',
    position: 1,
    compound: 'HARD',
    tyreAge: 16,
    grossLapTime_s: 72.379,
    terms: {
      fuel_component_s: 0.56875,
      compound_component_s: 2.3012,
      rubber_component_s: 0.0,
      ambient_component_s: 0.190516,
      constructor_component_s: -1.496473,
      dirty_air_tax_s: 0.5,
      driver_skill_residual_s: -3.110265,
    },
  },
  {
    id: 'sao-paulo-2021-l59-ver',
    raceLabel: 'São Paulo 2021',
    raceId: '2021_19',
    lap: 59,
    driver: 'VER',
    position: 2,
    compound: 'HARD',
    tyreAge: 19,
    grossLapTime_s: 74.068,
    terms: {
      fuel_component_s: 0.56875,
      compound_component_s: 2.6648,
      rubber_component_s: 0.0,
      ambient_component_s: 0.190516,
      constructor_component_s: -1.264559,
      dirty_air_tax_s: 0.0,
      driver_skill_residual_s: -1.516779,
    },
  },
];

export const DECOMPOSITIONS: LapDecomposition[] = RAW_LAPS.map(buildLap);

const byId = (id: string): LapDecomposition => {
  const lap = DECOMPOSITIONS.find((d) => d.id === id);
  if (!lap) throw new Error(`decompositions: unknown lap id "${id}"`);
  return lap;
};

/** The hero decomposition rendered in SplitHero (Russell, Las Vegas 2024 L6). */
export const HERO_LAP = byId('las-vegas-2024-l6-rus');

/** São Paulo 2021 L59 overtake pair (HAM vs VER) for the case study + explainer. */
export const SAO_PAULO_L59 = {
  ham: byId('sao-paulo-2021-l59-ham'),
  ver: byId('sao-paulo-2021-l59-ver'),
} as const;

export interface StintLap {
  lap: number;
  driver: string;
  tyreAge: number;            // age_in_stint, laps on this set
  lapTime_s: number;
  compoundPenalty_s: number;  // compound_component_s (+ = slower)
  driverSkill_s: number;      // driver_skill_residual_s (− = faster than baseline)
  dirtyAir_s: number;         // dirty_air_tax_s
}

// São Paulo 2021 final stint (HAM's 3rd stop L44 vs VER's L41 = 3-lap tyre-age
// gap). These are the selected laps published in the finding table, reproduced
// verbatim and reconciled against fct_lap_residuals (2021_19).
// Source: off-the-pace docs/findings/sao-paulo-2021.mdx.
export const SAO_PAULO_STINT: StintLap[] = [
  { lap: 45, driver: 'HAM', tyreAge: 2,  lapTime_s: 72.14, compoundPenalty_s: 1.08,  driverSkill_s: -1.99,  dirtyAir_s: 0.0 },
  { lap: 45, driver: 'VER', tyreAge: 5,  lapTime_s: 72.98, compoundPenalty_s: 1.28,  driverSkill_s: -2.08,  dirtyAir_s: 0.5 },
  { lap: 55, driver: 'HAM', tyreAge: 12, lapTime_s: 72.56, compoundPenalty_s: 1.87,  driverSkill_s: -2.57,  dirtyAir_s: 0.5 },
  { lap: 55, driver: 'VER', tyreAge: 15, lapTime_s: 72.49, compoundPenalty_s: 2.19,  driverSkill_s: -2.69,  dirtyAir_s: 0.0 },
  { lap: 59, driver: 'HAM', tyreAge: 16, lapTime_s: 72.38, compoundPenalty_s: 2.30,  driverSkill_s: -3.11,  dirtyAir_s: 0.5 },
  { lap: 59, driver: 'VER', tyreAge: 19, lapTime_s: 74.07, compoundPenalty_s: 2.66,  driverSkill_s: -1.51,  dirtyAir_s: 0.0 },
  { lap: 65, driver: 'HAM', tyreAge: 22, lapTime_s: 72.95, compoundPenalty_s: 5.46,  driverSkill_s: -5.44,  dirtyAir_s: 0.0 },
  { lap: 65, driver: 'VER', tyreAge: 25, lapTime_s: 73.66, compoundPenalty_s: 8.30,  driverSkill_s: -7.79,  dirtyAir_s: 0.0 },
  { lap: 71, driver: 'HAM', tyreAge: 28, lapTime_s: 73.86, compoundPenalty_s: 11.17, driverSkill_s: -9.72,  dirtyAir_s: 0.0 },
  { lap: 71, driver: 'VER', tyreAge: 31, lapTime_s: 74.93, compoundPenalty_s: 14.08, driverSkill_s: -12.86, dirtyAir_s: 0.0 },
];

/** Short axis/segment codes per identity term (shared by the charts). */
export const TERM_ABBR: Record<IdentityTermKey, string> = {
  fuel_component_s: 'FUEL',
  compound_component_s: 'CMP',
  rubber_component_s: 'RBR',
  ambient_component_s: 'WX',
  constructor_component_s: 'CAR',
  dirty_air_tax_s: 'AIR',
  driver_skill_residual_s: 'SKILL',
};

/** Format seconds as a lap clock, e.g. 98.33 -> "1:38.330", 72.379 -> "1:12.379". */
export function toLapClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds - mins * 60;
  return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

// Dev-only guard: every lap must reconcile to the additive identity within the
// ±0.0001s tolerance the warehouse test (assert_additive_identity) enforces.
if (import.meta.env?.DEV) {
  for (const d of DECOMPOSITIONS) {
    const drift = Math.abs(d.grossLapTime_s - d.totalStripped_s - d.truePace_s);
    if (drift > 1e-4) {
      console.error(`decompositions: ${d.id} breaks the identity by ${drift}s`);
    }
  }
}
