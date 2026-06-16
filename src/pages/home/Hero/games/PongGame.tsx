import React, { useEffect, useRef, useState } from 'react';

type State = 'countdown' | 'playing' | 'paused' | 'over';

export const PongGame = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, lives: 3 });
  const [phase, setPhase] = useState<State>('countdown');
  const [cd, setCd] = useState(3);
  const [deathMsg, setDeathMsg] = useState("");

  const gameState = useRef({
    playerY: 150,
    aiY: 150,
    ballX: 300,
    ballY: 200,
    ballVX: 5,
    ballVY: 3,
    width: 600,
    height: 400,
    paddleW: 10,
    paddleH: 60,
    ballSize: 10,
    keys: { ArrowUp: false, ArrowDown: false },
    score: { player: 0, lives: 3 }
  });

  const rafRef = useRef<number>(0);
  const ph = useRef<State>('countdown');

  useEffect(() => { ph.current = phase; }, [phase]);

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
      if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault();
      if (ph.current === 'playing' || ph.current === 'paused') {
        if (e.key.toLowerCase() === 'p') {
          setPhase(p => p === 'playing' ? 'paused' : 'playing');
          return;
        }
      }
      if (ph.current === 'playing') {
        if (e.key === 'ArrowUp') gameState.current.keys.ArrowUp = true;
        if (e.key === 'ArrowDown') gameState.current.keys.ArrowDown = true;
      }
      if (e.key === 'Escape') onExit();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.current.keys.ArrowUp = false;
      if (e.key === 'ArrowDown') gameState.current.keys.ArrowDown = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onExit]);

  const resetBall = () => {
    gameState.current.ballX = gameState.current.width / 2;
    gameState.current.ballY = gameState.current.height / 2;
    gameState.current.ballVX *= -1; // serve to the other side
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let alive = true;

    const step = () => {
      if (!alive) return;
      
      const s = gameState.current;

      if (ph.current === 'playing') {
        // Player movement
        if (s.keys.ArrowUp) s.playerY = Math.max(0, s.playerY - 7);
        if (s.keys.ArrowDown) s.playerY = Math.min(s.height - s.paddleH, s.playerY + 7);

        // AI movement
        const aiCenter = s.aiY + s.paddleH / 2;
        if (aiCenter < s.ballY - 10) s.aiY += 4;
        else if (aiCenter > s.ballY + 10) s.aiY -= 4;
        s.aiY = Math.max(0, Math.min(s.height - s.paddleH, s.aiY));

        // Ball movement
        s.ballX += s.ballVX;
        s.ballY += s.ballVY;

        // Wall collisions
        if (s.ballY <= 0 || s.ballY + s.ballSize >= s.height) {
          s.ballVY *= -1;
        }

        // Paddle collisions
        if (
          s.ballX <= s.paddleW &&
          s.ballY + s.ballSize >= s.playerY &&
          s.ballY <= s.playerY + s.paddleH
        ) {
          s.ballVX = Math.abs(s.ballVX) * 1.05; // speed up slightly
          s.ballX = s.paddleW;
          s.ballVY = (s.ballY - (s.playerY + s.paddleH / 2)) * 0.2;
        }

        if (
          s.ballX + s.ballSize >= s.width - s.paddleW &&
          s.ballY + s.ballSize >= s.aiY &&
          s.ballY <= s.aiY + s.paddleH
        ) {
          s.ballVX = -Math.abs(s.ballVX) * 1.05;
          s.ballX = s.width - s.paddleW - s.ballSize;
          s.ballVY = (s.ballY - (s.aiY + s.paddleH / 2)) * 0.2;
        }

        // Scoring
        if (s.ballX < 0) {
          s.score.lives--;
          setScore({ ...s.score });
          if (s.score.lives <= 0) {
            setDeathMsg("OUT OF LIVES. GAME OVER.");
            setPhase('over');
          } else {
            resetBall();
          }
        } else if (s.ballX > s.width) {
          s.score.player++;
          setScore({ ...s.score });
          resetBall();
          s.ballVX += s.ballVX > 0 ? 0.5 : -0.5; // Speed up progressively
        }
      }

      // Render
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, s.width, s.height);

      // Center line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(s.width / 2, 0);
      ctx.lineTo(s.width / 2, s.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#00c8b4'; // Brand color // tw-allow-hex
      ctx.fillRect(0, s.playerY, s.paddleW, s.paddleH);
      ctx.fillStyle = '#ef4444'; // Red // tw-allow-hex
      ctx.fillRect(s.width - s.paddleW, s.aiY, s.paddleW, s.paddleH);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.fillRect(s.ballX, s.ballY, s.ballSize, s.ballSize);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const restart = () => {
    gameState.current.score = { player: 0, lives: 3 };
    setScore({ player: 0, lives: 3 });
    gameState.current.ballVX = 5;
    resetBall();
    setCd(3);
    setPhase('countdown');
  };

  const resume = () => setPhase('playing');

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center mb-3 font-mono text-[11px] px-2.5 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-4 text-viz-success">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" /> // tw-allow-hex
          <span>SCORE: {score.player}</span>
          <span className="text-viz-mac-red">LIVES: {score.lives}</span>
        </div>
      </div>

      <div className="flex-1 grid place-items-center overflow-hidden p-4 min-h-0 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-full max-h-full object-contain"
        />

        {phase === 'countdown' && (
          <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center p-5 pointer-events-none">
            <div className="text-[80px] font-bold text-white font-mono">{cd > 0 ? cd : 'GO!'}</div>
          </div>
        )}

        {phase === 'paused' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] z-[150] flex flex-col items-center justify-center p-5">
            <h2 className="font-mono text-3xl font-extrabold text-brand-primary mb-1">PONG PAUSED</h2>
            <p className="font-mono text-[10px] text-white/50 mb-5">Press "P" to resume.</p>
            <button className="px-8 py-3 bg-viz-success font-extrabold rounded cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm text-black" onClick={resume}>RESUME</button>
          </div>
        )}

        {phase === 'over' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-[4px] z-[150] flex flex-col items-center justify-center p-8 text-center">
            <h2 className="font-mono text-2xl font-black text-white mb-2 tracking-tighter uppercase">{deathMsg}</h2>
            <p className="font-mono text-sm text-white/50 mb-6">Final Score: <span className="text-viz-success font-bold">{score.player}</span></p>
            <button className="px-10 py-3 bg-brand-primary text-black font-black rounded-sm cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs tracking-widest uppercase" onClick={restart}>PLAY AGAIN</button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 p-4 lg:hidden border-t border-white/5">
        <button
          className="w-16 h-16 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-white/50 touch-manipulation"
          onPointerDown={() => { gameState.current.keys.ArrowUp = true; }}
          onPointerUp={() => { gameState.current.keys.ArrowUp = false; }}
          onPointerLeave={() => { gameState.current.keys.ArrowUp = false; }}
        >
          ▲
        </button>
        <button
          className="w-16 h-16 bg-white/5 active:bg-white/10 rounded-full flex items-center justify-center text-white/50 touch-manipulation"
          onPointerDown={() => { gameState.current.keys.ArrowDown = true; }}
          onPointerUp={() => { gameState.current.keys.ArrowDown = false; }}
          onPointerLeave={() => { gameState.current.keys.ArrowDown = false; }}
        >
          ▼
        </button>
      </div>
    </div>
  );
};
