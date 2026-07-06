import React, { useEffect, useRef, useState } from 'react';
import { GAME_COLORS } from '@/config/constants';

type State = 'countdown' | 'playing' | 'paused' | 'over';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 25; // in pixels
const TICK_RATE_MS = 800; // time between gravity ticks

const SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // Z
  [[1, 1, 0], [0, 1, 1]]
];

const COLORS = GAME_COLORS.tetris.shapes;

export const TetrisGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);

  const gameState = useRef({
    grid: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
    piece: { shape: [] as number[][], x: 0, y: 0, color: 0 },
    score: 0,
    lastTick: 0,
    keys: { ArrowDown: false }
  });

  const rafRef = useRef<number>(0);
  const ph = useRef<State>('countdown');

  useEffect(() => { ph.current = phase; }, [phase]);

  const spawnPiece = () => {
    const s = gameState.current;
    const type = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[type];
    s.piece = {
      shape,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0,
      color: type + 1
    };
    if (checkCollision(s.piece.x, s.piece.y, s.piece.shape)) {
      setPhase('over');
    }
  };

  const checkCollision = (cx: number, cy: number, cShape: number[][]) => {
    const s = gameState.current;
    for (let r = 0; r < cShape.length; r++) {
      for (let c = 0; c < cShape[r].length; c++) {
        if (cShape[r][c] !== 0) {
          const nx = cx + c;
          const ny = cy + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && s.grid[ny][nx] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = () => {
    const s = gameState.current;
    const oldShape = s.piece.shape;
    const newShape = oldShape[0].map((_, i) => oldShape.map(row => row[i]).reverse());
    if (!checkCollision(s.piece.x, s.piece.y, newShape)) {
      s.piece.shape = newShape;
    }
  };

  const lockPiece = () => {
    const s = gameState.current;
    for (let r = 0; r < s.piece.shape.length; r++) {
      for (let c = 0; c < s.piece.shape[r].length; c++) {
        if (s.piece.shape[r][c] !== 0) {
          const ny = s.piece.y + r;
          if (ny >= 0 && ny < ROWS) {
            s.grid[ny][s.piece.x + c] = s.piece.color;
          }
        }
      }
    }
    
    // Clear lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (s.grid[r].every(cell => cell !== 0)) {
        s.grid.splice(r, 1);
        s.grid.unshift(Array(COLS).fill(0));
        linesCleared++;
        r++; // check same row index again as it has new blocks
      }
    }
    
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800];
      s.score += points[linesCleared];
      setScore(s.score);
    }

    spawnPiece();
  };

  useEffect(() => {
    const s = gameState.current;
    s.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    spawnPiece();
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (cd > 0) {
      const t = setTimeout(() => setCd(c => c - 1), 800);
      return () => clearTimeout(t);
    }
    gameState.current.lastTick = performance.now();
    setPhase('playing');
  }, [phase, cd]);

  const handleKey = (key: string) => {
    if (ph.current !== 'playing') return;
    const s = gameState.current;
    if (key === 'ArrowLeft') {
      if (!checkCollision(s.piece.x - 1, s.piece.y, s.piece.shape)) s.piece.x--;
    }
    if (key === 'ArrowRight') {
      if (!checkCollision(s.piece.x + 1, s.piece.y, s.piece.shape)) s.piece.x++;
    }
    if (key === 'ArrowDown') {
      s.keys.ArrowDown = true;
      if (!checkCollision(s.piece.x, s.piece.y + 1, s.piece.shape)) s.piece.y++;
      else lockPiece();
    }
    if (key === 'ArrowUp') {
      rotate();
    }
    if (key === ' ') {
      while (!checkCollision(s.piece.x, s.piece.y + 1, s.piece.shape)) {
        s.piece.y++;
      }
      lockPiece();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      
      const p = ph.current;
      if (p === 'playing' || p === 'paused') {
        if (e.key.toLowerCase() === 'p') {
          setPhase(p => p === 'playing' ? 'paused' : 'playing');
          return;
        }
      }

      handleKey(e.key);
      if (e.key === 'Escape') onExit();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') gameState.current.keys.ArrowDown = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let alive = true;

    const step = (now: number) => {
      if (!alive) return;
      
      const s = gameState.current;

      if (ph.current === 'playing') {
        const dropInterval = s.keys.ArrowDown ? TICK_RATE_MS / 10 : TICK_RATE_MS;
        if (now - s.lastTick > dropInterval) {
          s.lastTick = now;
          if (!checkCollision(s.piece.x, s.piece.y + 1, s.piece.shape)) {
            s.piece.y++;
          } else {
            lockPiece();
          }
        }
      }

      // Render
      ctx.fillStyle = GAME_COLORS.tetris.bg;
      ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

      // Draw grid lines
      ctx.strokeStyle = GAME_COLORS.tetris.grid;
      ctx.lineWidth = 1;
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * BLOCK_SIZE, 0);
        ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
      }

      const drawBlock = (x: number, y: number, colorIdx: number) => {
        ctx.fillStyle = COLORS[colorIdx - 1];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        // Inner highlight for 3D effect
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, 4);
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 4, BLOCK_SIZE);
        
        // Inner shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE + BLOCK_SIZE - 4, BLOCK_SIZE, 4);
        ctx.fillRect(x * BLOCK_SIZE + BLOCK_SIZE - 4, y * BLOCK_SIZE, 4, BLOCK_SIZE);
      };

      // Draw static grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (s.grid[r][c] !== 0) {
            drawBlock(c, r, s.grid[r][c]);
          }
        }
      }

      // Draw active piece
      if (s.piece.shape.length > 0 && ph.current !== 'over') {
        for (let r = 0; r < s.piece.shape.length; r++) {
          for (let c = 0; c < s.piece.shape[r].length; c++) {
            if (s.piece.shape[r][c] !== 0) {
              drawBlock(s.piece.x + c, s.piece.y + r, s.piece.color);
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const restart = () => {
    gameState.current.grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    gameState.current.score = 0;
    setScore(0);
    spawnPiece();
    setCd(3);
    setPhase('countdown');
  };

  const resume = () => {
    gameState.current.lastTick = performance.now();
    setPhase('playing');
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center mb-3 font-mono text-fine px-2.5 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-4 text-viz-success">
          <span className="w-1.5 h-1.5 rounded-full bg-viz-success shadow-[0_0_8px_var(--color-viz-success)]" />
          <span>SCORE: {score}</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center overflow-hidden p-4 min-h-0 relative">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] object-contain"
        />

        {phase === 'countdown' && (
          <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center p-5 pointer-events-none">
            <div className="text-display font-bold text-white font-mono">{cd > 0 ? cd : 'GO!'}</div>
          </div>
        )}

        {phase === 'paused' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-[150] flex flex-col items-center justify-center p-5">
            <h2 className="font-mono text-3xl font-extrabold text-brand-primary mb-1">PAUSED</h2>
            <p className="font-mono text-micro text-text-tertiary mb-5">Press "P" to resume.</p>
            <button className="px-8 py-3 bg-viz-success font-extrabold rounded cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm text-black" onClick={resume}>RESUME</button>
          </div>
        )}

        {phase === 'over' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-8 text-center">
            <h2 className="font-mono text-2xl font-black text-viz-mac-red mb-6 tracking-tighter uppercase">STACK OVERFLOW</h2>
            <button className="px-10 py-3 bg-brand-primary text-black font-black rounded-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs tracking-widest uppercase" onClick={restart}>PLAY AGAIN</button>
          </div>
        )}
      </div>

      {/* On-screen controls for mobile */}
      <div className="flex flex-col items-center gap-2 p-4 lg:hidden border-t border-white/5">
        <div className="flex gap-4">
          <button
            className="w-20 h-14 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-brand-primary touch-manipulation font-mono text-xs font-bold"
            onPointerDown={(e) => { e.preventDefault(); handleKey('ArrowUp'); }}
          >
            ROTATE
          </button>
          <button
            className="w-20 h-14 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-brand-primary touch-manipulation font-mono text-xs font-bold"
            onPointerDown={(e) => { e.preventDefault(); handleKey(' '); }}
          >
            DROP
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleKey('ArrowLeft'); }}
          >
            ◀
          </button>
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleKey('ArrowDown'); }}
            onPointerUp={(e) => { e.preventDefault(); gameState.current.keys.ArrowDown = false; }}
            onPointerLeave={(e) => { e.preventDefault(); gameState.current.keys.ArrowDown = false; }}
          >
            ▼
          </button>
          <button
            className="w-14 h-14 bg-white/5 active:bg-white/10 rounded-lg flex items-center justify-center text-text-tertiary touch-manipulation"
            onPointerDown={(e) => { e.preventDefault(); handleKey('ArrowRight'); }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Keyboard controls for desktop view */}
      <div className="hidden lg:flex justify-center items-center gap-6 p-4 border-t border-white/5 font-mono text-micro text-text-tertiary select-none">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">◀</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▶</kbd> Move Block
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▲</kbd> Rotate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▼</kbd> Soft Drop
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-3 py-0.5 bg-white/5 border border-white/10 rounded text-text-secondary font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">Space</kbd> Hard Drop
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
