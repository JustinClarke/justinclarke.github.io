import React, { useEffect, useRef, useState } from 'react';
import { GAME_COLORS } from '@/config/constants';

type State = 'countdown' | 'playing' | 'paused' | 'over' | 'won';

export const SpaceInvadersGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);
  const [msg, setMsg] = useState("");

  const gameState = useRef({
    width: 600,
    height: 600,
    playerX: 280,
    playerY: 550,
    playerW: 40,
    playerH: 20,
    bullets: [] as { x: number, y: number, active: boolean }[],
    invaderBullets: [] as { x: number, y: number, active: boolean }[],
    invaders: [] as { x: number, y: number, alive: boolean, type: number }[],
    invaderDir: 1,
    invaderSpeed: 1,
    invaderStepDown: false,
    lastShot: 0,
    score: 0,
    keys: { ArrowLeft: false, ArrowRight: false, Space: false }
  });

  const rafRef = useRef<number>(0);
  const ph = useRef<State>('countdown');

  useEffect(() => { ph.current = phase; }, [phase]);

  const initInvaders = () => {
    const invaders = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 11; col++) {
        invaders.push({
          x: col * 40 + 50,
          y: row * 40 + 50,
          alive: true,
          type: row % 3
        });
      }
    }
    gameState.current.invaders = invaders;
    gameState.current.invaderDir = 1;
    gameState.current.invaderSpeed = 1;
    gameState.current.bullets = [];
    gameState.current.invaderBullets = [];
    gameState.current.playerX = 280;
  };

  useEffect(() => {
    initInvaders();
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (cd > 0) {
      const t = setTimeout(() => setCd(c => c - 1), 800);
      return () => clearTimeout(t);
    }
    setPhase('playing');
  }, [phase, cd]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (ph.current === 'playing' || ph.current === 'paused') {
        if (e.key.toLowerCase() === 'p') {
          setPhase(p => p === 'playing' ? 'paused' : 'playing');
          return;
        }
      }
      if (ph.current === 'playing') {
        if (e.key === 'ArrowLeft') gameState.current.keys.ArrowLeft = true;
        if (e.key === 'ArrowRight') gameState.current.keys.ArrowRight = true;
        if (e.key === ' ') gameState.current.keys.Space = true;
      }
      if (e.key === 'Escape') onExit();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameState.current.keys.ArrowLeft = false;
      if (e.key === 'ArrowRight') gameState.current.keys.ArrowRight = false;
      if (e.key === ' ') gameState.current.keys.Space = false;
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
    let lastTime = performance.now();

    const step = (now: number) => {
      if (!alive) return;
      const dt = now - lastTime;
      lastTime = now;
      
      const s = gameState.current;

      if (ph.current === 'playing') {
        // Player movement
        if (s.keys.ArrowLeft) s.playerX = Math.max(0, s.playerX - 5);
        if (s.keys.ArrowRight) s.playerX = Math.min(s.width - s.playerW, s.playerX + 5);

        // Player shooting
        if (s.keys.Space && now - s.lastShot > 400) {
          s.bullets.push({ x: s.playerX + s.playerW / 2 - 2, y: s.playerY, active: true });
          s.lastShot = now;
        }

        // Bullets movement
        s.bullets.forEach(b => b.y -= 7);
        s.bullets = s.bullets.filter(b => b.y > 0 && b.active);

        s.invaderBullets.forEach(b => b.y += 5);
        s.invaderBullets = s.invaderBullets.filter(b => b.y < s.height && b.active);

        // Invaders movement
        let hitEdge = false;
        const activeInvaders = s.invaders.filter(inv => inv.alive);
        
        if (activeInvaders.length === 0) {
          setMsg("SECTOR CLEARED.");
          setPhase('won');
        }

        activeInvaders.forEach(inv => {
          inv.x += s.invaderDir * s.invaderSpeed;
          if (inv.x <= 10 || inv.x >= s.width - 40) hitEdge = true;
        });

        if (hitEdge) {
          s.invaderDir *= -1;
          s.invaderSpeed += 0.2; // Speed up
          activeInvaders.forEach(inv => inv.y += 20);
        }

        // Invader shooting
        if (Math.random() < 0.02 && activeInvaders.length > 0) {
          const shooter = activeInvaders[Math.floor(Math.random() * activeInvaders.length)];
          s.invaderBullets.push({ x: shooter.x + 15, y: shooter.y + 20, active: true });
        }

        // Collisions: player bullets hit invaders
        s.bullets.forEach(b => {
          activeInvaders.forEach(inv => {
            if (b.active && b.x > inv.x && b.x < inv.x + 30 && b.y > inv.y && b.y < inv.y + 20) {
              inv.alive = false;
              b.active = false;
              s.score += 10;
              setScore(s.score);
            }
          });
        });

        // Collisions: invader bullets hit player
        s.invaderBullets.forEach(b => {
          if (b.active && b.x > s.playerX && b.x < s.playerX + s.playerW && b.y > s.playerY && b.y < s.playerY + s.playerH) {
            setMsg("SYSTEM COMPROMISED.");
            setPhase('over');
          }
        });

        // Invaders hit bottom or player
        activeInvaders.forEach(inv => {
          if (inv.y + 20 >= s.playerY) {
            setMsg("DEFENSES BREACHED.");
            setPhase('over');
          }
        });
      }

      // Render
      ctx.fillStyle = GAME_COLORS.spaceInvaders.bg;
      ctx.fillRect(0, 0, s.width, s.height);

      // Player
      ctx.fillStyle = GAME_COLORS.spaceInvaders.player;
      ctx.fillRect(s.playerX, s.playerY + 10, s.playerW, s.playerH - 10);
      ctx.fillRect(s.playerX + 15, s.playerY, 10, 10); // turret

      // Bullets
      ctx.fillStyle = '#fff';
      s.bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 15));
      
      ctx.fillStyle = GAME_COLORS.spaceInvaders.bullet;
      s.invaderBullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 15));

      // Invaders
      s.invaders.filter(inv => inv.alive).forEach(inv => {
        ctx.fillStyle = GAME_COLORS.spaceInvaders.invaders[inv.type];
        ctx.fillRect(inv.x, inv.y, 30, 20);
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const restart = () => {
    initInvaders();
    gameState.current.score = 0;
    setScore(0);
    setCd(3);
    setPhase('countdown');
  };

  const resume = () => setPhase('playing');

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center mb-3 font-mono text-[11px] px-2.5 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-4 text-viz-success">
          <span className="w-1.5 h-1.5 rounded-full bg-viz-success shadow-[0_0_8px_var(--color-viz-success)]" />
          <span>SCORE: {score}</span>
        </div>
      </div>

      <div className="flex-1 grid place-items-center overflow-hidden p-4 min-h-0 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-full max-h-full object-contain"
        />

        {phase === 'countdown' && (
          <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center p-5 pointer-events-none">
            <div className="text-[80px] font-bold text-white font-mono">{cd > 0 ? cd : 'READY!'}</div>
          </div>
        )}

        {phase === 'paused' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-[150] flex flex-col items-center justify-center p-5">
            <h2 className="font-mono text-3xl font-extrabold text-brand-primary mb-1">PAUSED</h2>
            <p className="font-mono text-[10px] text-white/50 mb-5">Press "P" to resume.</p>
            <button className="px-8 py-3 bg-viz-success font-extrabold rounded cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm text-black" onClick={resume}>RESUME</button>
          </div>
        )}

        {(phase === 'over' || phase === 'won') && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-8 text-center">
            <h2 className={`font-mono text-2xl font-black mb-6 tracking-tighter uppercase ${phase === 'won' ? 'text-viz-success' : 'text-viz-mac-red'}`}>{msg}</h2>
            <button className="px-10 py-3 bg-brand-primary text-black font-black rounded-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs tracking-widest uppercase" onClick={restart}>PLAY AGAIN</button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 p-4 lg:hidden border-t border-white/5">
        <button
          className="w-16 h-16 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-white/50 touch-manipulation"
          onPointerDown={() => { gameState.current.keys.ArrowLeft = true; }}
          onPointerUp={() => { gameState.current.keys.ArrowLeft = false; }}
          onPointerLeave={() => { gameState.current.keys.ArrowLeft = false; }}
        >
          ◀
        </button>
        <button
          className="w-24 h-16 bg-white/5 active:bg-white/10 rounded-xl flex items-center justify-center text-brand-primary font-bold touch-manipulation font-mono text-xs tracking-widest"
          onPointerDown={() => { gameState.current.keys.Space = true; }}
          onPointerUp={() => { gameState.current.keys.Space = false; }}
          onPointerLeave={() => { gameState.current.keys.Space = false; }}
        >
          FIRE
        </button>
        <button
          className="w-16 h-16 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-white/50 touch-manipulation"
          onPointerDown={() => { gameState.current.keys.ArrowRight = true; }}
          onPointerUp={() => { gameState.current.keys.ArrowRight = false; }}
          onPointerLeave={() => { gameState.current.keys.ArrowRight = false; }}
        >
          ▶
        </button>
      </div>

      {/* Keyboard controls for desktop view */}
      <div className="hidden lg:flex justify-center items-center gap-6 p-4 border-t border-white/5 font-mono text-[10px] text-white/40 select-none">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/70 font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">◀</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/70 font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">▶</kbd> Move Ship
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-3 py-0.5 bg-white/5 border border-white/10 rounded text-white/70 font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">Space</kbd> Fire Weapon
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/70 font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">P</kbd> Pause/Resume
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/70 font-semibold shadow-[0_1.5px_0_rgba(255,255,255,0.05)]">Esc</kbd> Exit
        </span>
      </div>
    </div>
  );
};
