/**
 * DataScopeHero.tsx
 * Split hero: tight engineering headline on the left, InteractiveCommandCenter on the right.
 * Design language matches Off The Pace — restrained, dark graphite, one accent colour (purple),
 * typography-led, authentic copy not marketing speak.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { DataScopeLogo } from '../ui/DataScopeLogo';
import { InteractiveCommandCenter } from './InteractiveCommandCenter';
import { HERO_METRICS } from '../../data/datascopeData';
import { useNavigate } from 'react-router-dom';
import { ScrambleText } from '@/pages/off-the-pace/components/ui/ScrambleText';
import { useState } from 'react';

export function DataScopeHero() {
  const reduce = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const [hoverArch, setHoverArch] = useState(false);
  const [hoverGh, setHoverGh] = useState(false);

  return (
    <section className="relative pt-20 sm:pt-28 pb-16 md:pb-24 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">

      {/* Eyebrow — product identity, not a sales pitch */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-8"
      >
        <div
          className="inline-flex items-center gap-2.5 px-3 py-1.5 font-jetbrains text-micro uppercase tracking-[0.18em]"
          style={{
            background: 'rgba(10,10,14,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '999px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {/* Live pulse dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#863bff] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#863bff]" />
          </span>
          <span className="text-white/50">Client-Native Analytics</span>
          <span className="text-white/20">/</span>
          <span className="text-white/70">DuckDB-Wasm + AST AI</span>
        </div>
      </motion.div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

        {/* Left: Headline + CTAs + Spec Ribbon */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            {/* Logo + wordmark */}
            <div className="flex items-center gap-3">
              <DataScopeLogo size={32} glow />
              <span className="font-jetbrains font-extrabold text-sm tracking-tight text-white/60 uppercase">
                DataScope
              </span>
            </div>

            {/* Main headline — one strong declarative statement */}
            <h1 className="font-noto text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tight text-white leading-[0.9]">
              The browser{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #863bff 0%, #00d4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                is the warehouse.
              </span>
            </h1>

            {/* Sub-headline — engineering descriptor, not a tagline */}
            <p className="font-jetbrains text-xs text-white/50 leading-relaxed max-w-md uppercase tracking-[0.1em]">
              Multi-table DuckDB-Wasm OLAP engine running in a Web Worker.
              Schema inference, FK graph, and a deterministic AI layer.
              Zero upload. Offline-capable.
            </p>
          </motion.div>

          {/* CTA block — mirrors OTP's button row */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-col gap-3 w-full max-w-sm"
          >
            {/* Primary: Architecture deep-dive */}
            <button
              onClick={() => navigate('/datascope/architecture')}
              onMouseEnter={() => setHoverArch(true)}
              onMouseLeave={() => setHoverArch(false)}
              className="group relative flex items-stretch text-white transition-all duration-300 overflow-hidden rounded-md"
              style={{
                background: '#07080b',
                border: '1px solid rgba(134,59,255,0.35)',
                boxShadow: 'rgba(134,59,255,0.35) 0 0 22px',
              }}
            >
              {/* Left accent bar */}
              <div
                className="w-1.5 shrink-0"
                style={{ background: 'linear-gradient(180deg, #863bff, rgba(134,59,255,0.4))' }}
              />
              {/* Shimmer */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-20deg] pointer-events-none" />

              <div className="flex-1 flex items-center justify-between px-4 py-3 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#863bff] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#863bff]" />
                  </span>
                  <span className="font-jetbrains text-micro uppercase tracking-mega font-black text-white">
                    <ScrambleText text="ARCHITECTURE & EVALS" isHovered={hoverArch} prefix="[" suffix="]" />
                  </span>
                </div>
                <svg className="w-4 h-4 text-white/30 group-hover:text-[#863bff] group-hover:translate-x-0.5 transition-all duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Secondary row */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/JustinClarke/DataScope"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverGh(true)}
                onMouseLeave={() => setHoverGh(false)}
                className="cta-button inline-flex items-center justify-center px-4 py-2.5 text-white font-jetbrains text-micro uppercase tracking-widest font-bold transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#00d4ff',
                  borderWidth: '1px',
                  boxShadow: 'rgba(0,212,255,0.35) 0 0 18px',
                  opacity: 0.9,
                  borderRadius: '4px',
                }}
              >
                <ScrambleText text="GITHUB" isHovered={hoverGh} prefix="[" suffix="]" />
              </a>

              <button
                onClick={() => {
                  const el = document.getElementById('datascope-repair-lab');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-4 py-2.5 text-white/60 font-jetbrains text-micro uppercase tracking-widest font-bold transition-all duration-200 hover:text-white"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                }}
              >
                AI Lab ↓
              </button>
            </div>
          </motion.div>

          {/* Spec ribbon — same tight card pattern as OTP StatsRibbon */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="grid grid-cols-2 gap-2 pt-6 border-t border-white/[0.06]"
          >
            {HERO_METRICS.map((metric, i) => (
              <div
                key={i}
                className="flex flex-col p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="font-jetbrains font-extrabold text-xl tracking-tight tabular-nums"
                  style={{ color: metric.accent }}
                >
                  {metric.value}
                </div>
                <div className="font-jetbrains font-bold text-[11px] text-white/80 mt-0.5">{metric.label}</div>
                <div className="font-jetbrains text-[10px] text-white/35 truncate">{metric.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Interactive Command Center */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 w-full"
        >
          <InteractiveCommandCenter />
        </motion.div>
      </div>
    </section>
  );
}
