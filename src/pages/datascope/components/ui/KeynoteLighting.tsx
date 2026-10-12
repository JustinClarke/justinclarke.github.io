/**
 * KeynoteLighting.tsx
 * Ambient page atmosphere — restrained, matches Off The Pace's subtle
 * radial glow treatment. Single primary (purple) glow, no color soup.
 */
import { motion, useReducedMotion } from 'framer-motion';

export function KeynoteLighting() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Subtle dot matrix — same opacity as OTP */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top overhead glow — purple only, not a rainbow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[480px] opacity-35 blur-[120px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(134,59,255,0.5) 0%, rgba(134,59,255,0.15) 50%, transparent 75%)',
        }}
      />

      {/* Right horizon: subtle cyan accent — one secondary, not three */}
      <motion.div
        animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] -right-[20vw] w-[45vw] h-[45vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)' }}
      />

      {/* Bottom vignette keeps content readable */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080b] to-transparent" />
    </div>
  );
}
