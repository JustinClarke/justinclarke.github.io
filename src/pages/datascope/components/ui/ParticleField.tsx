/**
 * ParticleField the drifting amber/violet/bone constellation behind the
 * DataScope hero, the same one the live app's front door draws.
 *
 * Fits in: DataScopeHero's backdrop layer only.
 * Note:    the loop pauses whenever the canvas is off screen or the tab is
 *          hidden, and prefers-reduced-motion gets one still frame instead of
 *          an animation. Colours come from DATASCOPE_PARTICLE_COLORS because a
 *          canvas can't read Tailwind classes.
 */
import { useEffect, useRef } from 'react';
import { DATASCOPE_PARTICLE_COLORS as C } from '@/config/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CONNECT_DIST = 120;
const MOUSE_DIST = 180;
/** One particle per this many CSS px² of canvas, so phones draw fewer. */
const AREA_PER_PARTICLE = 21_000;
const MAX_PARTICLES = 64;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
}

function makeParticle(w: number, h: number): Particle {
  const roll = Math.random();
  const [color, alpha] =
    roll < 0.3 ? [C.amber, 0.75] : roll < 0.65 ? [C.violet, 0.6] : [C.bone, 0.3];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 1,
    color,
    alpha,
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // setTransform, not scale: scale() compounds on every resize.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(MAX_PARTICLES, Math.round((w * h) / AREA_PER_PARTICLE));
      particles = Array.from({ length: count }, () => makeParticle(w, h));
    };

    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (step) {
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d > 0 && d < MOUSE_DIST) {
            const force = (1 - d / MOUSE_DIST) * 0.8;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
          p.vx *= 0.99;
          p.vy *= 0.99;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < CONNECT_DIST) {
            ctx.strokeStyle = `rgba(${C.linkRgb}, ${(0.08 * (1 - d / CONNECT_DIST)).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      draw(true);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();

    if (reduce) {
      draw(false);
      const onResize = () => {
        resize();
        draw(false);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    observer.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
