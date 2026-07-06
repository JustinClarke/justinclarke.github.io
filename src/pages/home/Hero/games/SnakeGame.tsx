/**
 * SnakeGame the hidden Snake easter egg that takes over the terminal when you
 * type `snake`.
 *
 * Fits in: launched by the Hero terminal as a `snake` side-effect; `onExit` tells
 *          the terminal to close the game and return to the prompt.
 * Note:    the game has TWO copies of its data on purpose. React state (snake,
 *          food, score…) exists only to paint the screen. The matching `useRef`
 *          values (snk, dir, fd…) are the engine's real, always-current truth,
 *          since a 60fps loop driven from React state alone would read stale
 *          values (state is frozen at the moment its closure was created).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID = 20;
const SPEED = 120; // ms per tick
const CENTER = { x: 10, y: 10 };
const UP = { x: 0, y: -1 };

type Pt = { x: number; y: number };
type State = 'countdown' | 'playing' | 'paused' | 'over';

// Keeps picking a random cell until it finds one the snake isn't occupying.
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

export const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  /* ── React state (for rendering only) ── */
  const [snake, setSnake] = useState<Pt[]>([CENTER]);
  const [food, setFood] = useState<Pt>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake-hs') || 0));
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);
  const [flash, setFlash] = useState<{ msg: string; id: number } | null>(null);
  const [deathMsg, setDeathMsg] = useState("");

  /* ── Refs (engine truth – never stale) ── */
  // `raf` holds the animation-frame id (so we can cancel it); `last` is the
  // timestamp of the previous tick. `{ ...CENTER }` copies the constant so we
  // never mutate the shared CENTER object.
  const snk = useRef<Pt[]>([{ ...CENTER }]);
  const dir = useRef<Pt>({ ...UP });
  const fd = useRef<Pt>({ x: 5, y: 5 });
  const sc = useRef(0);
  const ph = useRef<State>('countdown');
  const raf = useRef(0);
  const last = useRef(0);

  // The keyboard and loop code below can only see refs reliably, so mirror the
  // `phase` state into the `ph` ref on every change.
  useEffect(() => { ph.current = phase; }, [phase]);

  /* ── Engine reset ── */
  // Wipes both the refs (engine) and the state (screen) back to start.
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
  useEffect(() => {
    let alive = true;               // killed on unmount - StrictMode safe

    // Wait until SPEED ms have passed since `last`, giving a steady tick
    // independent of frame rate rather than moving the snake every frame.
    const step = (now: number) => {
      if (!alive) return;           // unmounted → stop

      const state = ph.current;

      // Only tick when playing
      if (state === 'playing') {
        if (last.current === 0) last.current = now;   // first frame
        if (now - last.current >= SPEED) {
          last.current = now;

          // s[0] is the head; the new head is the current head shifted by the
          // current direction, added to the front while the tail drops (unless we ate).
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

    // `alive` guards against a leftover step firing after unmount - React's
    // StrictMode double-mount in dev would otherwise surface this as a leak.
    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
    };
  }, []);                           // runs ONCE, never re-created

  /* ── Countdown ── */
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
  // e.preventDefault() stops the arrow keys and space from also scrolling the page.
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
        // Guards stop a 180° turn (reversing straight into yourself): you can
        // only turn if you're currently moving on the other axis.
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

  const handleTurn = (key: string) => {
    if (ph.current !== 'playing') return;
    const d = dir.current;
    switch (key) {
      case 'ArrowUp': if (d.y === 0) dir.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': if (d.y === 0) dir.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': if (d.x === 0) dir.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': if (d.x === 0) dir.current = { x: 1, y: 0 }; break;
    }
  };

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
      <div className="flex items-center mb-3 font-mono text-fine text-viz-success px-2.5 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#22c55e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          SCORE: {score}
        </div>
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
          {/* 400 cells (20×20); flat index i converts to grid coords via i % GRID
              (column) and Math.floor(i / GRID) (row). */}
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
              className="absolute top-4 right-4 z-[200] font-mono text-micro font-bold text-viz-success bg-black/80 px-2 py-1 rounded border border-viz-success/30 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              {flash.msg}
            </div>
          )}

          {phase === 'countdown' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-5">
              <div className="text-display font-bold text-white font-mono">{cd > 0 ? cd : 'GO!'}</div>
            </div>
          )}

          {phase === 'paused' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-5">
              <h2 className="font-mono text-3xl font-extrabold text-brand-primary mb-1">SNAKE PAUSED</h2>
              <p className="font-mono text-micro text-text-tertiary mb-5">Press "P" or click below to resume.</p>
              <button className="px-8 py-3 bg-viz-success font-extrabold rounded cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm" onClick={resume}>RESUME</button>
            </div>
          )}

          {phase === 'over' && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-[6px] z-[150] flex flex-col items-center justify-center p-8 text-center">
              <h2 className="font-mono text-2xl font-black text-viz-error mb-2 tracking-tighter uppercase">{deathMsg}</h2>
              <div className="flex flex-col gap-1 mb-6">
                <p className="font-mono text-xs text-text-tertiary">Score: <span className="text-white font-bold">{score}</span></p>
                {score >= highScore && score > 0 ? (
                  <p className="font-mono text-micro text-viz-success font-bold animate-pulse">NEW PERSONAL BEST · committing to git...</p>
                ) : (
                  <p className="font-mono text-micro text-text-tertiary italic">Peak performance: {highScore}</p>
                )}
              </div>
              <button className="px-10 py-3 bg-brand-primary text-black font-black rounded-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs tracking-widest uppercase" onClick={restart}>RE-SYNC KERNEL</button>
            </div>
          )}
        </div>
      </div>

      {/* On-screen controls for mobile */}
      <div className="flex flex-col items-center gap-2 p-4 lg:hidden border-t border-white/5">
        <button
          className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
          onPointerDown={(e) => { e.preventDefault(); handleTurn('ArrowUp'); }}
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleTurn('ArrowLeft'); }}
          >
            ◀
          </button>
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleTurn('ArrowDown'); }}
          >
            ▼
          </button>
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleTurn('ArrowRight'); }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Keyboard controls for desktop view */}
      <div className="hidden lg:flex justify-center items-center gap-6 p-4 border-t border-white/5 font-mono text-micro text-text-tertiary select-none">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▲</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▼</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">◀</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▶</kbd> Steer Snake
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">P</kbd> Pause/Resume
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">Esc</kbd> Exit
        </span>
      </div>
    </div>
  );
};
