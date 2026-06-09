/**
 * useF1Telemetry the whole fake "live F1 data feed" behind the telemetry bento
 * card: speed, throttle, sectors, tyre wear, fuel burn, a causal lap-time model,
 * and a scrolling dbt pipeline log. None of it is real data; it's all simulated
 * on timers so the card looks alive.
 *
 * Fits in: called once by F1TelemetryWidget, which becomes a pure renderer that
 *          just reads the big object returned here. Child panels Pick their slice.
 * Note:    two interval loops drive everything a fast 400ms physics tick and a
 *          slow 15s lap tick. Both pause when isPlaying is false or a dbt test run
 *          is in progress. The log auto-scroll stays in the widget (it needs a DOM
 *          ref this hook can't hold).
 *
 * For beginners ----------------------------------------------------------------
 * This file is almost all useState + useEffect. useState is the card's memory
 * (each value, like liveSpeed, has a matching setter); useEffect runs the timers
 * that keep changing those values. Every setter call re-renders the card with the
 * new numbers that's why the dials appear to move on their own.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect } from 'react';
import { INITIAL_PIPELINE_LOGS } from '@/data/f1';
import { debug } from '@/utils';

// LEARN: A logger labelled "f1". Silent unless you enable it in the console with
//    localStorage.debug = 'f1'  then refresh (see src/utils/debug.ts).
const log = debug('f1');

export function useF1Telemetry() {
  // LEARN: a wall of useState. Each line is one remembered value plus the only
  //    function allowed to change it. The `<'Monza' | 'Spa' | 'Monaco'>` is a
  //    "union type": TypeScript will only allow those three exact strings.
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTrack, setActiveTrack] = useState<'Monza' | 'Spa' | 'Monaco'>('Monaco');

  // Interactive Panel States
  const [uiMode, setUiMode] = useState<'telemetry' | 'causal'>('causal');
  const [selectedCompound, setSelectedCompound] = useState<'soft' | 'medium' | 'hard'>('soft');

  // Simulated Live Metrics
  const [liveSpeed, setLiveSpeed] = useState(318);
  const [liveThrottle, setLiveThrottle] = useState(100);
  const [liveBrake, setLiveBrake] = useState(0);
  const [currentLap, setCurrentLap] = useState(4);
  const [tyreAge, setTyreAge] = useState(5);
  const [fuelWeight, setFuelWeight] = useState(100.4); // kg

  // Causal & Thermal states
  const [activeSector, setActiveSector] = useState<'S1' | 'S2' | 'S3'>('S1');
  const [airState, setAirState] = useState<'FREE' | 'TOW' | 'DIRTY' | 'DRS'>('FREE');
  const [thermalSurface, setThermalSurface] = useState(90); // °C
  const [thermalBulk, setThermalBulk] = useState(88); // °C

  // Track animation progress (to map sector highlights)
  const [dotDistance, setDotDistance] = useState(0);

  // dbt Console Logging & Testing States
  const [isTesting, setIsTesting] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>(INITIAL_PIPELINE_LOGS);

  // ── Fast physics loop: recompute the live dials ~2.5×/second ────────────────
  // LEARN: this effect re-runs whenever isPlaying / activeTrack / isTesting change
  //    (see the dependency array at the bottom). If we're paused or running tests
  //    it bails out early, so no timer is created. Otherwise it starts a 400ms
  //    interval and returns a cleanup that stops it.
  useEffect(() => {
    if (!isPlaying || isTesting) return;
    log('physics loop running', { activeTrack });

    const interval = setInterval(() => {
      // LEARN: a sine wave gives a smooth, repeating up-and-down value over time,
      //    which we use to wobble the speed naturally instead of randomly.
      const time = Date.now();
      const wave = Math.sin(time * 0.0035);

      // Map dot distance (0 to 100) to sectors
      // Sector 1: 0% to 35%, Sector 2: 35% to 70%, Sector 3: 70% to 100%
      const currentDist = (time / (activeTrack === 'Monaco' ? 90 : activeTrack === 'Spa' ? 120 : 80)) % 100;
      setDotDistance(currentDist);

      let calculatedSpeed = 310;
      let calculatedThrottle = 100;
      let calculatedBrake = 0;
      let sector: 'S1' | 'S2' | 'S3' = 'S1';
      let state: 'FREE' | 'TOW' | 'DIRTY' | 'DRS' = 'FREE';

      if (currentDist < 35) {
        sector = 'S1';
        state = 'TOW';
        calculatedSpeed = Math.floor(290 + wave * 25);
        calculatedThrottle = 100;
        calculatedBrake = 0;
      } else if (currentDist >= 35 && currentDist < 70) {
        sector = 'S2';
        state = 'DIRTY'; // Cornering behind car
        calculatedSpeed = Math.floor(110 + (1 - Math.abs(wave)) * 60);
        calculatedThrottle = Math.floor(30 + Math.random() * 40);
        calculatedBrake = Math.floor(60 + Math.random() * 30);
      } else {
        sector = 'S3';
        state = 'DRS';
        calculatedSpeed = Math.floor(315 + wave * 15);
        calculatedThrottle = 100;
        calculatedBrake = 0;
      }

      setActiveSector(sector);
      setAirState(state);
      setLiveSpeed(calculatedSpeed);
      setLiveThrottle(calculatedThrottle);
      setLiveBrake(calculatedBrake);

      // LEARN: `prev => ...` reads the latest fuel value and returns the next one.
      //    Math.max keeps it from dropping below 5kg; toFixed(2) avoids ugly
      //    floating-point tails like 99.40000001.
      // Fuel burn simulation (~0.05kg per step)
      setFuelWeight(prev => Math.max(5.0, Number((prev - 0.03).toFixed(2))));

      // Thermal simulation based on dirty air
      if (state === 'DIRTY') {
        // High surface spike, slower bulk climb
        setThermalSurface(prev => Math.min(125, Number((prev + 1.2).toFixed(1))));
        setThermalBulk(prev => Math.min(115, Number((prev + 0.3).toFixed(1))));
      } else {
        // Cooling
        setThermalSurface(prev => Math.max(90, Number((prev - 0.8).toFixed(1))));
        setThermalBulk(prev => Math.max(88, Number((prev - 0.1).toFixed(1))));
      }

      // Live log emitter
      if (Math.random() > 0.8) {
        const events = [
          `[${new Date().toLocaleTimeString()}] [dbt] SUCCESS - f1_pit_model`,
          `[${new Date().toLocaleTimeString()}] [DuckDB] Ingested 12.4K packets`,
          `[${new Date().toLocaleTimeString()}] [XGBoost] Driver Residual ε: -0.142s`,
          `[${new Date().toLocaleTimeString()}] [Fabric] Refresh Power BI model`,
          `[${new Date().toLocaleTimeString()}] [Data Quality] SLA: 100% OK`
        ];
        const newLog = events[Math.floor(Math.random() * events.length)];
        setPipelineLogs(prev => [...prev.slice(-4), newLog]);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, activeTrack, isTesting]);

  // ── Slow lap loop: advance the lap counter and age the tyres every 15s ──────
  useEffect(() => {
    if (!isPlaying || isTesting) return;

    const lapInterval = setInterval(() => {
      setCurrentLap(prev => {
        // LEARN: after lap 57 we roll back to 1 and a roll-back means a fresh
        //    set of tyres (age 0). Any other lap just ages the current set by 1.
        const nextLap = prev === 57 ? 1 : prev + 1;
        if (nextLap === 1) {
          setTyreAge(0);
        } else {
          setTyreAge(t => t + 1);
        }
        log('new lap', nextLap);
        return nextLap;
      });
    }, 15000); // New lap every 15s

    return () => clearInterval(lapInterval);
  }, [isPlaying, isTesting]);

  // ── The "Run tests" button: play a scripted dbt test sequence over time ─────
  // LEARN: this isn't a loop it's a one-shot animation built from staggered
  //    setTimeout calls. Each test's line appears a bit later than the last, so
  //    the console looks like it's working through them live.
  const runDbtTests = () => {
    if (isTesting) return;
    log('dbt tests: start');
    setIsTesting(true);
    setPipelineLogs([`[${new Date().toLocaleTimeString()}] [dbt] Initiating Physical Verification Suite...`]);

    const tests = [
      { msg: '[dbt] 🔍 [TEST 1/5] DECOMPOSITION_CLOSURE ...', status: 'PASS (residual sum = 0.000s)' },
      { msg: '[dbt] 🔍 [TEST 2/5] STINT_BOUNDARY_INTEGRITY ...', status: 'PASS (zero leakage across boundaries)' },
      { msg: '[dbt] 🔍 [TEST 3/5] NO_FUTURE_LEAKAGE ...', status: 'PASS (strictly trailing causal matrices)' },
      { msg: '[dbt] 🔍 [TEST 4/5] SYNTHETIC_TEAMMATE_IDENTITY ...', status: 'PASS (identical setups match zero-delta)' },
      { msg: '[dbt] 🔍 [TEST 5/5] FIELD_PACE_HONEST_RANGE ...', status: 'PASS (session fast ratio = 1.018)' }
    ];

    tests.forEach((t, index) => {
      // LEARN: scheduling each line at (index+1)*1200ms staggers them: test 1 at
      //    1.2s, test 2 at 2.4s, and so on. `[...prev, a, b]` appends without
      //    mutating the old array React needs a brand-new array to re-render.
      setTimeout(() => {
        setPipelineLogs(prev => [...prev, t.msg, `[dbt]  └─ SUCCESS: ${t.status}`]);
        if (index === tests.length - 1) {
          // After the last test, a final summary line, then hand control back.
          setTimeout(() => {
            setPipelineLogs(prev => [...prev, `[dbt] ✅ ALL PIPELINE TESTS PASSING. Causal integrity verified.`]);
            setIsTesting(false);
            log('dbt tests: complete');
          }, 800);
        }
      }, (index + 1) * 1200);
    });
  };

  // LEARN: each track is just a long SVG path string (the "d" attribute of an
  //    <path>). This returns the right one for the selected circuit; the widget
  //    draws it and animates a dot along it. The numbers are pre-drawn shapes —
  //    nothing to read here, just data.
  const getTrackPath = () => {
    switch (activeTrack) {
      case 'Spa': return 'M167.75 20.858c-3.075-5.364-.283-7.034 3.387-5.065 3.669 1.97 49.393 30.95 55.603 35.171 6.21 4.22 10.613 8.816 14.395 13.224 6.116 7.128 29.072 34.701 33.87 40.235 2.327 2.682 4.765 5.265 8.892 6.504.742.223 1.542.375 2.398.53 3.105.563 9.733 2.517 14.112 9.848 4.987 8.348 5.552 11.818 4.705 22.04-.49 5.916.164 11.615 2.258 14.631 5.08 7.316 15.721 22.54 22.956 32.545 8.75 12.099 16.935 28.98 20.322 40.235s41.49 144.622 43.467 152.5c1.975 7.878 4.009 9.705-5.504 15.334-4.516 2.673-8.435 6.431-6.774 13.787 1.27 5.628 9.744 26.446.846 32.639-2.08 1.447-48.41 32.702-57.014 38.265-5.222 3.377-12.385.885-15.242-4.08-2.856-4.964-3.503-11.631 4.093-15.897 5.927-3.329 9.314-5.205 25.685-14.96 3.995-2.38 6.181-7.751 3.198-14.442-2.634-5.909-7.55-20.755-9.972-27.574-5.645-15.897-10.43-48.422-14.254-69.216-1.552-8.44-7.338-16.882-19.193-18.007-2.61-.248-11.29-.844-18.77-.563-7.303.275-20.816 4.787-27.66 22.79-5.08 13.366-15.524 40.095-23.992 62.464-6.59 17.407-22.297 12.661-24.696 10.832-5.53-4.215-19.68-14.49-31.19 1.688-5.503 7.738-16.934 26.59-23.567 36.86-7.403 11.462-15.806 3.657-38.81-13.506-9.759-7.282-7.215-21.806-5.786-27.293 6.586-25.285 18.77-40.094 31.189-50.786s29.919-23.353 50.805-30.669c20.887-7.315 27.2-13.496 33.023-24.197 16.23-29.825 24.133-42.908 22.44-57.54-1.694-14.63-19.053-43.752-22.722-56.413-2.69-9.285-4.774-32.872-5.249-52.615-.083-3.47-.676-7.138 6.096-6.19 10.725 1.5 7.765-7.127 6.21-9.379-7.904-11.442-11.323-16.99-17.782-28.324-7.057-12.38-39.515-71.467-41.773-75.406z';
      case 'Monza': return 'M218.372 50.51c17.128-1.458 28.349-2.045 40.274-3.238 9.544-.954 18.648-.863 32.116-1.38 3.542-.136 3.729-.748 5.353-5.354 1.036-2.935 1.478-4.501 4.144-4.835 5.525-.69 9.921-1.651 11.443-2.091 14.149-4.09 33.715-10.744 48.213-17.291 6.233-2.814 20.461 2.978 21.497 16.187s3.53 38.46 4.015 45.973c.518 8.029.022 9.197-4.533 11.655-9.842 5.31-36.237 19.593-46.102 25.511-14.892 8.936-29.224 17.864-38.59 26.03-10.102 8.806-73.808 64.464-80.377 70.318-3.39 3.023-6.907 6.216-12.087 10.705-3.24 2.809-2.08 5.871-1.38 10.878 1.035 7.425-.519 16.403-8.289 21.756-5.758 3.967-6.446 5.425-7.248 12.962-4.732 44.498-20.042 187.268-21.674 201.017-1.813 15.28-17.22 18.9-29.267 11.784-24.993-14.763-21.878-47.89-20.85-65.527.408-6.966 12.017-143.36 19.435-230.17.309-3.611.466-5.692 5.3-5.347 5.184.37 5.612-1.727 3.54-7.77-3.737-10.9-5.649-24.2-5.06-31.068 1.369-15.987 2.231-26.008 2.297-26.732 1.804-19.481 7.9-39.11 33.93-52.707 14.168-7.4 25.64-9.712 43.9-11.266z';
      case 'Monaco': default: return 'M118.34 246.687c-5.14.774-6.994 2.392-9.853 7.317-4.586 7.898-9.192 18.211-11.413 27.357-2.486 10.243-2.829 25.557-1.95 39.458.445 7.034 2.23 10.04 8.243 12.045 7.17 2.387 8.339 2.488 9.949 9.801 1.61 7.319 6.389 33.36 8.047 42.434 1.188 6.495 2.042 8.91-3.805 11.704-6.436 3.07-7.9 3.95-6.729 9.07 1.17 5.12 6.805 23.714 11.023 30.435 11.51 18.336 19.262 23.945 27.311 26.726 5.165 1.784 11.935 2.284 13.315 7.946 1.317 5.416 1.181 7.937-2.341 9.074-13.167 4.244-26.043 5.56-38.334 5.268-4.24-.102-4.829-.294-4.245-5.56.442-3.967.44-9.514-3.803-14.047-3.322-3.553-10.24-13.756-16.093-28.531-9.486-23.955-16.97-48.602-19.168-60.132-2.924-15.363-5.422-36.152-6.435-49.746-1.903-25.458-.928-45.988 3.217-55.89 5.267-12.585 6.437-17.12 5.999-21.07-.878-7.9-.355-10.97 4.242-12.437 14.192-4.535 27.36-4.242 37.456-5.852 10.094-1.609 27.134-4.495 33.651-6.439 8.34-2.486 23.423-7.227 36.577-9.363 11.704-1.903 21.801-3.073 32.774-8.34 6.195-2.974 21.8-11.119 28.384-13.169 6.585-2.046 18.713-4.606 25.75-6.143 8.048-1.759 17.221-3.118 23.994-4.534 9.32-1.953 25.118-13.113 27.46-27.898 2.535-15.996-2.563-24.582-12.876-33.749-7.022-6.243-11.658-11.657-12.68-15.461-1.987-7.38.472-12.368 3.803-16.97 4.974-6.877 50.625-68.034 53.99-72.277 3.366-4.244 6.436-3.658 9.95-.88 3.509 2.783 7.415 5.432 7.023 10.39-.438 5.56-.515 9.95 1.757 13.607 2.632 4.244 3.365 5.121 6.585 9.51 2.136 2.914 3.949 5.707 5.121 9.51 1.097 3.565 6.103 5.143 8.922 2.633 2.632-2.341 3.073-6.585-.876-9.51-1.636-1.211-3.58-2.506-5.269-5.12-2.926-4.537-5.415-7.9-7.168-10.681-1.389-2.204-3.13-11.026 2.778-12.73 8.632-2.487 19.607-5.853 25.31-7.608 2.719-.835 11.123-.146 11.123 8.34 0 8.485-.294 17.848-1.17 25.896-.394 3.597-3.482 47.7-22.192 77.593-23.132 36.952-62.28 63.471-70.912 68.28-19.604 10.923-39.682 17.952-46.525 19.703-12.584 3.218-28.287 4.485-42.725 6.437-3.529.476-5.299 3.87-5.074 5.463.586 4.098-.946 5.21-4.484 5.852-8.585 1.563-10.73 2.731-12.486-.388-1.8-3.2-3.085-2.424-7.805-1.759-15.215 2.147-86.663 12.827-97.344 14.435z';
    }
  };

  const getTrackViewBox = () => {
    switch (activeTrack) {
      case 'Spa': return '67.659 -43.735 364.573 587.295';
      case 'Monza': return '80.428 -42.996 339.071 586.220';
      case 'Monaco': default: return '26.385 -58.910 447.413 588.401';
    }
  };

  // LEARN: the "causal model" the showpiece of this card. It breaks a lap time
  //    into named causes (fuel, tyres, dirty air, tyre temperature) and adds them
  //    to a base pace, so the UI can show WHY the lap was the time it was. Each
  //    line is a small physics-flavoured estimate; together they sum to totalLapTime.
  const getCausalDecomp = () => {
    const basePace = 76.500;
    const fuelLoadPenalty = Number((fuelWeight * 0.038).toFixed(3)); // 0.038s per kg
    const wearFactors = { soft: 0.12, medium: 0.07, hard: 0.04 };
    const tyreBasePenalty = Number((tyreAge * wearFactors[selectedCompound]).toFixed(3));
    const airPenalty = airState === 'DIRTY' ? 0.650 : airState === 'DRS' ? -0.200 : airState === 'TOW' ? -0.350 : 0.000;
    const thermalHysteresis = Number(((thermalSurface - 90) * 0.015).toFixed(3));
    const driverSkill = -1.350; // Dynamic isolated driver advantage
    const totalLapTime = basePace + fuelLoadPenalty + tyreBasePenalty + airPenalty + thermalHysteresis + driverSkill;

    return {
      basePace,
      fuelLoadPenalty,
      tyreBasePenalty,
      airPenalty,
      thermalHysteresis,
      driverSkill,
      totalLapTime
    };
  };

  // LEARN: derived values recomputed every render from the current state above.
  //    `decomp` is the model's output; the cliff values flag when soft/medium/hard
  //    tyres have aged past the point where grip falls off a "cliff".
  const decomp = getCausalDecomp();

  // Check tyre cliff thresholds
  const getCliffThreshold = () => {
    if (selectedCompound === 'soft') return 15;
    if (selectedCompound === 'medium') return 24;
    return 35;
  };
  const cliffOnset = getCliffThreshold();
  const isCliffRisk = tyreAge >= cliffOnset;

  // LEARN: the hook hands back ONE big object: state values, their setters, and
  //    the derived results. The widget destructures whatever slice it needs.
  return {
    // playback + track
    isPlaying, setIsPlaying,
    activeTrack, setActiveTrack,
    // panel modes
    uiMode, setUiMode,
    selectedCompound, setSelectedCompound,
    // live metrics
    liveSpeed, liveThrottle, liveBrake,
    currentLap, setCurrentLap,
    tyreAge, setTyreAge,
    fuelWeight, setFuelWeight,
    // causal + thermal
    activeSector, airState,
    thermalSurface, thermalBulk,
    dotDistance,
    // dbt console
    isTesting,
    pipelineLogs,
    runDbtTests,
    // derived
    decomp,
    cliffOnset,
    isCliffRisk,
    getTrackPath,
    getTrackViewBox,
  };
}

// LEARN: `ReturnType<typeof useF1Telemetry>` asks TypeScript "what type does this
//    function return?" and names it F1Telemetry. Child panels then write
//    `Pick<F1Telemetry, 'liveSpeed' | ...>` to type just the props they accept —
//    so the prop types stay in sync with this hook automatically, no hand-copying.
/** The full object returned by {@link useF1Telemetry}. Child panels Pick their slice. */
export type F1Telemetry = ReturnType<typeof useF1Telemetry>;
