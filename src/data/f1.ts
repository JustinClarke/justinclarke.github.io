/**
 * data/f1.ts the canned numbers that drive the F1 telemetry widget's demo.
 *
 * Fits in: the F1 bento widget / off-the-pace section replay these frames to
 *          fake a live telemetry feed (speed/throttle/brake traces, pipeline logs).
 * Note:    colours are tokens (var(--color-...)), not raw hex.
 *
 * For beginners ----------------------------------------------------------------
 * Pure data, no logic. The widget steps through these arrays on a timer to
 * animate, which is cheaper and more predictable than wiring real telemetry.
 * -----------------------------------------------------------------------------
 */
// Act 0 sector cycle  - strap text + bracket colour synced
export const SECTOR_CYCLE = [
  { strap: 'L47/57   ε -0.098s   S1', color: 'var(--color-blue-bright)' }, // blue
  { strap: 'L47/57   ε -0.211s   S2', color: 'var(--color-acc-bi)' }, // purple
  { strap: 'L47/57   ε -0.142s   S3', color: 'var(--color-emerald)' }, // emerald
] as const;

// Act 2 pre-recorded telemetry loop : Monaco T1 → straight → T2 → straight
export const TELEMETRY_FRAMES = [
  { spd: 87,  thr: 0,   brk: 95  }, // T1 entry  - brake hard
  { spd: 142, thr: 25,  brk: 0   }, // T1 exit
  { spd: 258, thr: 100, brk: 0   }, // straight : DRS open
  { spd: 318, thr: 87,  brk: 0   }, // top speed
  { spd: 296, thr: 92,  brk: 0   }, // shifting
  { spd: 121, thr: 0,   brk: 100 }, // T2 entry  - brake hard
  { spd: 178, thr: 60,  brk: 0   }, // T2 exit
] as const;

export const INITIAL_PIPELINE_LOGS = [
  '[13:49:10] [DuckDB] Ingesting telemetry.parquet',
  '[13:49:11] [dbt] Running model - stg_f1_telemetry (2.4M)',
  '[13:49:12] [dbt] SUCCESS - Created stg_f1_telemetry',
  '[13:49:13] [XGBoost] Running pace prediction model...',
  '[13:49:14] [Fabric] Syncing Gold tables to Lakehouse',
];
