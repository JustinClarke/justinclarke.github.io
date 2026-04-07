import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID = 20;
const SPEED = 120; // ms per tick
const CENTER = { x: 10, y: 10 };
const UP = { x: 0, y: -1 };

type Pt = { x: number; y: number };
type State = 'countdown' | 'playing' | 'paused' | 'over';

function spawnFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

export const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  /* ── React state (for rendering only) ── */
  const [snake, setSnake] = useState<Pt[]>([CENTER]);
  const [food, setFood] = useState<Pt>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);

  /* ── Refs (engine truth – never stale) ── */
  const snk = useRef<Pt[]>([{ ...CENTER }]);
  const dir = useRef<Pt>({ ...UP });
  const fd  = useRef<Pt>({ x: 5, y: 5 });
  const sc  = useRef(0);
  const ph  = useRef<State>('countdown');
  const raf = useRef(0);
  const last = useRef(0);

  // Sync phase ref
  useEffect(() => { ph.current = phase; }, [phase]);

  /* ── Engine reset ── */
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
    let alive = true;               // killed on unmount — StrictMode safe

    const step = (now: number) => {
      if (!alive) return;           // unmounted → stop

      const state = ph.current;

      // Only tick when playing
      if (state === 'playing') {
        if (last.current === 0) last.current = now;   // first frame
        if (now - last.current >= SPEED) {
          last.current = now;

          const s = snk.current;
          const d = dir.current;
          const head: Pt = { x: s[0].x + d.x, y: s[0].y + d.y };

          // Collision
          const wall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
          const self = s.some(p => p.x === head.x && p.y === head.y);

          if (wall || self) {
            setPhase('over');
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
        const d = dir.current;
        switch (e.key) {
          case 'ArrowUp':    if (d.y === 0) dir.current = { x: 0, y: -1 }; break;
          case 'ArrowDown':  if (d.y === 0) dir.current = { x: 0, y:  1 }; break;
          case 'ArrowLeft':  if (d.x === 0) dir.current = { x: -1, y: 0 }; break;
          case 'ArrowRight': if (d.x === 0) dir.current = { x:  1, y: 0 }; break;
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

  /* ── JSX ── */
  return (
    <div className="snake-game">
      <div className="snake-hdr">
        <div className="s-info"><span className="o-dot" />SCORE: {score}</div>
        <div style={{ flex: 1 }} />
        <button onClick={onExit} className="exit-btn">EXIT (ESC)</button>
      </div>

      <div className="snake-grid-wrapper">
        <div className="snake-grid">
          {Array.from({ length: GRID * GRID }).map((_, i) => {
            const x = i % GRID, y = Math.floor(i / GRID);
            const isSn = snake.some(s => s.x === x && s.y === y);
            const isFd = food.x === x && food.y === y;
            return <div key={i} className={`cell${isSn ? ' snake' : ''}${isFd ? ' food' : ''}`} />;
          })}

          {phase === 'countdown' && (
            <div className="game-overlay-box">
              <div className="big-cd">{cd > 0 ? cd : 'GO!'}</div>
            </div>
          )}

          {phase === 'paused' && (
            <div className="game-overlay-box">
              <h2 className="arcade-title">SNAKE PAUSED</h2>
              <p className="arcade-sub">Press "P" or click below to resume.</p>
              <button className="start-btn" onClick={resume}>RESUME</button>
            </div>
          )}

          {phase === 'over' && (
            <div className="game-overlay-box">
              <h2 className="over-title">SYSTEM FAILURE</h2>
              <p className="over-score">FINAL SCORE: {score}</p>
              <button className="start-btn" onClick={restart}>RE-SYNC</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
