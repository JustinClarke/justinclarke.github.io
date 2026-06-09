/**
 * SnakeGame the hidden Snake easter egg that takes over the terminal when you
 * type `snake`.
 *
 * Fits in: launched by the Hero terminal as a `snake` side-effect; `onExit` tells
 *          the terminal to close the game and return to the prompt.
 * Note:    the game has TWO copies of its data on purpose. React state (snake,
 *          food, score…) exists only to paint the screen. The matching `useRef`
 *          values (snk, dir, fd…) are the engine's real, always-current truth.
 *          Read the "refs vs state" note below before changing anything here.
 *
 * For beginners ----------------------------------------------------------------
 * A game loop runs ~60 times a second. If we drove it from React state alone it
 * would constantly read STALE values (state inside a long-lived function is
 * frozen at the moment that function was created). A `ref` is a small box whose
 * `.current` you can read and write at any time WITHOUT re-rendering perfect
 * for the live game data. After we mutate the refs we copy the result into state
 * with `setSnake(...)` etc., purely so React repaints the grid. Engine thinks in
 * refs; the screen reads state.
 * -----------------------------------------------------------------------------
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

// LEARN: Module-level `const`s are plain configuration fixed values shared by
//    every render. Pulling the "magic numbers" up here names them once so the
//    code below reads in English (SPEED, CENTER) instead of bare 120s and 10s.
const GRID = 20;
const SPEED = 120; // ms per tick
const CENTER = { x: 10, y: 10 };
const UP = { x: 0, y: -1 };

// LEARN: `type` aliases give a name to a shape. `Pt` is any {x, y} point; `State`
//    is a "union" the game can ONLY ever be in one of these four named phases,
//    and TypeScript will flag a typo like 'palying' at compile time.
type Pt = { x: number; y: number };
type State = 'countdown' | 'playing' | 'paused' | 'over';

// LEARN: A plain helper function (no React here). It keeps picking a random cell
//    until it finds one the snake is NOT occupying `do...while` guarantees the
//    body runs at least once, then repeats while the food landed on the snake.
function spawnFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

const DEATH_MESSAGES = [
  "SEGMENTATION FAULT (core dumped)",
  "fatal error: snake exceeded bounds",
  "OutOfBoundsException: skill issue",
];

const PRAISE_MESSAGES = [
  "nice", "hungry?", "optimized", "hydrated", "cached", "indexed", "processed", "delicious"
];

// LEARN: `{ onExit }: { onExit: () => void }` says this component takes one prop,
//    `onExit`, which is a FUNCTION that takes nothing and returns nothing. The
//    parent passes it in; we call it to ask the parent to close the game. Passing
//    behaviour down as a prop like this is how a child talks back to its parent.
export const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  /* ── React state (for rendering only) ── */
  // LEARN: `useState` gives a component memory that survives re-renders. Each line
  //    returns the current value and a setter; calling the setter (e.g. setScore)
  //    schedules a re-render so the screen reflects the new value. These exist ONLY
  //    to paint the live game logic uses the refs further down.
  const [snake, setSnake] = useState<Pt[]>([CENTER]);
  const [food, setFood] = useState<Pt>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  // LEARN: Passing a FUNCTION to useState (a "lazy initializer") runs it only on
  //    the very first render. So we read the saved high score from the browser's
  //    localStorage once, not on every re-render.
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake-hs') || 0));
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);
  const [flash, setFlash] = useState<{ msg: string; id: number } | null>(null);
  const [deathMsg, setDeathMsg] = useState("");

  /* ── Refs (engine truth – never stale) ── */
  // LEARN: `useRef` is a box that persists across renders but DOESN'T trigger one
  //    when you change it. We mutate `snk.current`, `dir.current`, etc. inside the
  //    fast game loop where re-rendering 60x/sec would be wasteful and where state
  //    would read stale. `raf` holds the animation-frame id (so we can cancel it);
  //    `last` is the timestamp of the previous tick. `{ ...CENTER }` makes a fresh
  //    COPY of the constant so we never accidentally mutate the shared CENTER.
  const snk = useRef<Pt[]>([{ ...CENTER }]);
  const dir = useRef<Pt>({ ...UP });
  const fd = useRef<Pt>({ x: 5, y: 5 });
  const sc = useRef(0);
  const ph = useRef<State>('countdown');
  const raf = useRef(0);
  const last = useRef(0);

  // Sync phase ref
  // LEARN: The keyboard and loop code below can only see refs reliably, so we mirror
  //    the `phase` STATE into the `ph` REF. This effect re-runs whenever `phase`
  //    changes (that is what the `[phase]` dependency list means) and copies the new
  //    value across, keeping the ref the loop reads in sync with what's on screen.
  useEffect(() => { ph.current = phase; }, [phase]);

  /* ── Engine reset ── */
  // LEARN: `useCallback` hands back the SAME function instance between renders (as
  //    long as its `[]` dependencies don't change). That matters when a function is
  //    passed to other hooks/children, so they don't think it's "new" every render.
  //    `reset` wipes both the refs (engine) and the state (screen) back to start.
  const reset = useCallback(() => {
    snk.current = [{ ...CENTER }];
    dir.current = { ...UP };
    sc.current = 0;
    const f = spawnFood(snk.current);
    fd.current = f;
    last.current = 0;
    setSnake([{ ...CENTER }]);
    setFood(f);
    setScore(0);
  }, []);

  /* ── Single game loop (runs for entire component lifetime) ── */
  // LEARN: This is the engine. The `[]` dependency list means the effect runs ONCE
  //    when the game mounts and is never re-created, so there is exactly one loop.
  //    `requestAnimationFrame(step)` asks the browser to call `step` before the next
  //    repaint (~60x/sec); each `step` schedules the next, forming the loop. The
  //    returned function is "cleanup": React runs it on unmount to stop the loop.
  useEffect(() => {
    let alive = true;               // killed on unmount - StrictMode safe

    // LEARN: `now` is a high-precision timestamp the browser passes in. We don't move
    //    the snake every frame (that'd be far too fast); instead we wait until SPEED
    //    ms have passed since `last`, giving a steady tick independent of frame rate.
    const step = (now: number) => {
      if (!alive) return;           // unmounted → stop

      const state = ph.current;

      // Only tick when playing
      if (state === 'playing') {
        if (last.current === 0) last.current = now;   // first frame
        if (now - last.current >= SPEED) {
          last.current = now;

          // LEARN: The snake is an array of points; `s[0]` is the head. The next head
          //    is the current head shifted by the current direction `d`. We add the
          //    new head to the front and (unless we ate) drop the tail, which is what
          //    makes a snake appear to "move" one cell per tick.
          const s = snk.current;
          const d = dir.current;
          const head: Pt = { x: s[0].x + d.x, y: s[0].y + d.y };

          // Collision
          const wall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
          const self = s.some(p => p.x === head.x && p.y === head.y);

          if (wall || self) {
            const msg = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
            setDeathMsg(msg);
            setPhase('over');

            // Check High Score
            if (sc.current > highScore) {
              setHighScore(sc.current);
              localStorage.setItem('snake-hs', String(sc.current));
            }

            raf.current = requestAnimationFrame(step);
            return;
          }

          const next = [head, ...s];

          if (head.x === fd.current.x && head.y === fd.current.y) {
            sc.current += 10;
            setScore(sc.current);
            const nf = spawnFood(next);
            fd.current = nf;
            setFood(nf);

            // Flash Praise
            const pMsg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
            setFlash({ msg: `+10 · ${pMsg}`, id: Date.now() });
          } else {
            next.pop();
          }

          snk.current = next;
          setSnake([...next]);
        }
      }

      raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);

    // LEARN: Cleanup. `alive = false` stops any in-flight `step`, and we cancel the
    //    pending frame. Without this the loop would keep running after the game
    //    closes and in development React mounts components twice to surface exactly
    //    this kind of leak, which is why the `alive` flag makes the loop safe.
    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);                           // runs ONCE, never re-created

  /* ── Countdown ── */
  // LEARN: The "3 · 2 · 1 · GO" intro. This effect re-runs whenever `phase` or `cd`
  //    changes. While counting, it sets a one-shot timer to decrement `cd` after
  //    800ms; the returned `clearTimeout` cancels a pending timer if the effect
  //    re-runs first, preventing duplicate countdowns. At zero, it flips to playing.
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (cd > 0) {
      const t = setTimeout(() => setCd(c => c - 1), 800);
      return () => clearTimeout(t);
    }
    // cd === 0 → start
    last.current = 0;               // reset tick timer
    setPhase('playing');
  }, [phase, cd]);

  /* ── Keyboard ── */
  // LEARN: Here we listen to the whole window for key presses. We add the listener
  //    when the game mounts and the cleanup REMOVES it on unmount forgetting that
  //    removal is a classic memory leak. `e.preventDefault()` stops the arrow keys
  //    and space from also scrolling the page while you play.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key))
        e.preventDefault();

      const s = ph.current;

      if (e.key.toLowerCase() === 'p' && (s === 'playing' || s === 'paused')) {
        if (s === 'playing') {
          setPhase('paused');
        } else {
          last.current = 0;        // reset tick timer on unpause
          setPhase('playing');
        }
        return;
      }

      if (s === 'playing') {
        // LEARN: The `if (d.y === 0)` / `if (d.x === 0)` guards stop a 180° turn you
        //    can't reverse straight back onto yourself. You can only turn if you're
        //    currently moving on the OTHER axis.
        const d = dir.current;
        switch (e.key) {
          case 'ArrowUp': if (d.y === 0) dir.current = { x: 0, y: -1 }; break;
          case 'ArrowDown': if (d.y === 0) dir.current = { x: 0, y: 1 }; break;
          case 'ArrowLeft': if (d.x === 0) dir.current = { x: -1, y: 0 }; break;
          case 'ArrowRight': if (d.x === 0) dir.current = { x: 1, y: 0 }; break;
        }
      }

      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  /* ── Actions ── */
  const restart = () => {
    reset();
    setCd(3);
    setPhase('countdown');
  };

  const resume = () => {
    last.current = 0;
    setPhase('playing');
  };

  // Clear flash after 1s
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1000);
    return () => clearTimeout(t);
  }, [flash]);

  /* ── JSX ── */
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-3 font-mono text-[11px] text-viz-success px-2.5 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#22c55e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          SCORE: {score}
        </div>
        <div className="flex-1" />
        <button
          onClick={onExit}
          className="bg-white/10 border border-white/15 text-white/80 font-mono text-[8px] tracking-[0.12em] font-bold px-2.5 py-1 rounded transition-all duration-200 flex items-center gap-2 hover:bg-viz-red hover:text-white hover:border-viz-red hover:-translate-y-px active:scale-95 cursor-pointer"
        >
          <span className="bg-white/10 border border-white/20 rounded px-1 text-[8px] text-brand-primary">ESC</span> EXIT
        </button>
      </div>

      <div className="flex-1 grid place-items-center overflow-hidden p-4 min-h-0">
        <div style={{ 
          width: '400px', 
          maxWidth: '100%', 
          maxHeight: '100%', 
          aspectRatio: '1 / 1', 
          position: 'relative' 
        }}>
          <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] bg-[#111] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* LEARN: We draw the board by making an array of 400 cells (20×20) and
                `.map`-ing each to a <div>. The flat index `i` converts to grid
                coordinates with `i % GRID` (column) and `Math.floor(i / GRID)`
                (row). React needs a stable `key` per item in a list so it can tell
                them apart between renders here the cell index `i` is that key. */}
          {Array.from({ length: GRID * GRID }).map((_, i) => {
            const x = i % GRID, y = Math.floor(i / GRID);
            const headIdx = snake.findIndex(s => s.x === x && s.y === y);
            const isFd = food.x === x && food.y === y;
            const isSn = headIdx !== -1;
            const isHead = headIdx === 0;

            return (
              <div
                key={i}
                className={`transition-all duration-200 ${isSn
                    ? `bg-acc-lang z-10 border-[0.5px] border-black/20 ${isHead ? 'rounded-sm scale-110 brightness-125 shadow-[0_0_12px_rgba(0,200,180,0.6)]' : ''}`
                    : isFd ? 'z-20' : 'bg-transparent'
                  }`}
              >
                {isFd && (
                  <div className="w-full h-full bg-viz-red rounded-full animate-food-pulse-pro shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                )}
              </div>
            );
          })}
        </div>
          
          {/* Flash Console */}
          {flash && (
            <div
              key={flash.id}
              className="absolute top-4 right-4 z-[200] font-mono text-[10px] font-bold text-viz-success bg-black/80 px-2 py-1 rounded border border-viz-success/30 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              {flash.msg}
            </div>
          )}

          {phase === 'countdown' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-5">
              <div className="text-[80px] font-bold text-white font-mono">{cd > 0 ? cd : 'GO!'}</div>
            </div>
          )}

          {phase === 'paused' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-5">
              <h2 className="font-mono text-3xl font-extrabold text-brand-primary mb-1">SNAKE PAUSED</h2>
              <p className="font-mono text-[10px] text-white/50 mb-5">Press "P" or click below to resume.</p>
              <button className="px-8 py-3 bg-viz-success font-extrabold rounded cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm" onClick={resume}>RESUME</button>
            </div>
          )}

          {phase === 'over' && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-[6px] z-[150] flex flex-col items-center justify-center p-8 text-center">
              <h2 className="font-mono text-2xl font-black text-viz-error mb-2 tracking-tighter uppercase">{deathMsg}</h2>
              <div className="flex flex-col gap-1 mb-6">
                <p className="font-mono text-xs text-white/60">Score: <span className="text-white font-bold">{score}</span></p>
                {score >= highScore && score > 0 ? (
                  <p className="font-mono text-[10px] text-viz-success font-bold animate-pulse">NEW PERSONAL BEST · committing to git...</p>
                ) : (
                  <p className="font-mono text-[10px] text-white/40 italic">Peak performance: {highScore}</p>
                )}
              </div>
              <button className="px-10 py-3 bg-brand-primary text-black font-black rounded-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs tracking-widest uppercase" onClick={restart}>RE-SYNC KERNEL</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
