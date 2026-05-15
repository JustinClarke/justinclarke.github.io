import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '@/types';
import { TOOLTIPS } from '@/config/tooltips';

interface CardConfig {
  accentColor: string;
  accentHex: string;
  eyebrow: string;
  status: string;
  statusPulse?: boolean;
  statusAnimDuration?: number;
  headline: string;
  headlineLabel: string;
  headlineSub: string;
  ctaText: string;
  tooltipKey: keyof typeof TOOLTIPS;
  hoverBorder: string;
  hoverShadow: string;
  hoverTextColor: string;
  accentGradient: string;
  radiusGradient: string;
}

const CARD_CONFIG: Record<string, CardConfig> = {
  'sql-disaster': {
    accentColor: 'red-500',
    accentHex: '#ef4444',
    eyebrow: 'RELATIONAL ARCHITECTURE',
    status: 'OPERATIONAL',
    statusPulse: true,
    headline: '11',
    headlineLabel: 'ENTITIES',
    headlineSub: 'Core + Junction Tables',
    ctaText: 'Case Study',
    tooltipKey: 'sqlDisaster',
    hoverBorder: 'red-500/25',
    hoverShadow: '[0_0_60px_-20px_rgba(239,68,68,0.15)]',
    hoverTextColor: 'red-400',
    accentGradient: 'via-red-500/50',
    radiusGradient: 'rgba(239,68,68,0.04)',
  },
  'litestore': {
    accentColor: 'teal-500',
    accentHex: '#00c8b4',
    eyebrow: 'PRODUCTION SAAS',
    status: 'PRODUCTION',
    statusPulse: true,
    statusAnimDuration: 1.2,
    headline: '3.0s → 0.6s',
    headlineLabel: 'PAGE LOAD',
    headlineSub: 'SSR + Edge Caching',
    ctaText: 'Case Study',
    tooltipKey: 'litestore',
    hoverBorder: '[#00c8b4]/25',
    hoverShadow: '[0_0_60px_-20px_rgba(0,200,180,0.12)]',
    hoverTextColor: '[#00c8b4]',
    accentGradient: 'via-[#00c8b4]/50',
    radiusGradient: 'rgba(0,200,180,0.04)',
  },
  'spotify-engine': {
    accentColor: 'green-500',
    accentHex: '#1db954',
    eyebrow: 'MSC RESEARCH',
    status: 'DISTINCTION',
    headline: '1.2M',
    headlineLabel: 'TRACKS',
    headlineSub: '12D Acoustic Feature Space',
    ctaText: 'Research',
    tooltipKey: 'spotifyEngine',
    hoverBorder: '[#1db954]/25',
    hoverShadow: '[0_0_60px_-20px_rgba(29,185,84,0.12)]',
    hoverTextColor: '[#1db954]',
    accentGradient: 'via-[#1db954]/50',
    radiusGradient: 'rgba(29,185,84,0.04)',
  },
  'hr-archetype': {
    accentColor: 'purple-600',
    accentHex: '#a855f7',
    eyebrow: 'BEHAVIORAL AI',
    status: 'SYNC_ACTIVE',
    statusPulse: true,
    statusAnimDuration: 0.9,
    headline: '13-Axis',
    headlineLabel: 'DIAGNOSTIC',
    headlineSub: 'Gemini AI Powered',
    ctaText: 'Intelligence',
    tooltipKey: 'hrArchetype',
    hoverBorder: '[#a855f7]/25',
    hoverShadow: '[0_0_60px_-20px_rgba(168,85,247,0.12)]',
    hoverTextColor: '[#a855f7]',
    accentGradient: 'via-[#a855f7]/50',
    radiusGradient: 'rgba(168,85,247,0.04)',
  },
  'capital-budgeting': {
    accentColor: 'amber-500',
    accentHex: '#f59e0b',
    eyebrow: 'FINANCIAL ENGINEERING',
    status: 'FINAL DIRECTIVE',
    headline: '₱581M',
    headlineLabel: 'CAPEX MODEL',
    headlineSub: 'Maritime Asset Feasibility',
    ctaText: 'Feasibility',
    tooltipKey: 'capital',
    hoverBorder: '[#f59e0b]/25',
    hoverShadow: '[0_0_60px_-20px_rgba(245,158,11,0.12)]',
    hoverTextColor: '[#f59e0b]',
    accentGradient: 'via-[#f59e0b]/50',
    radiusGradient: 'rgba(245,158,11,0.04)',
  },
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cfg = CARD_CONFIG[project.id];
  if (!cfg) return null;

  const metrics = project.pageMetrics.slice(0, 3);
  const accentHex = cfg.accentHex;

  return (
    <div
      className="group relative flex flex-col bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden transition-[border-color,box-shadow,transform,opacity] duration-500 h-full"
      style={{
        borderColor: `color-mix(in srgb, ${accentHex}, transparent 75%)`,
        boxShadow: `0 0 60px -20px ${accentHex}20`,
      } as React.CSSProperties}
      data-tooltip={TOOLTIPS[cfg.tooltipKey]}
    >
      {/* Top accent line */}
      <div
        className={`h-px w-full bg-gradient-to-r from-transparent ${cfg.accentGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <Link to={`/project/${project.id}`} className="flex flex-col h-full">

        {/* Meta row */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3">
          <div className="font-mono text-[8px] text-[#5a5a57] uppercase tracking-[0.4em] font-black">
            {cfg.eyebrow}
          </div>
          <div className="flex items-center gap-2">
            {cfg.statusPulse ? (
              <motion.div
                className={`w-1.5 h-1.5 rounded-full bg-[${cfg.accentHex}]`}
                style={{ backgroundColor: accentHex }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: cfg.statusAnimDuration || 1, repeat: Infinity }}
              />
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: `color-mix(in srgb, ${accentHex}, transparent 40%)` }}
              />
            )}
            <span
              className="font-mono text-[8px] uppercase tracking-widest font-black"
              style={{ color: `color-mix(in srgb, ${accentHex}, transparent 40%)` }}
            >
              {cfg.status}
            </span>
          </div>
        </div>

        {/* Hero visual — full-width, tall */}
        <div className="relative w-full h-52 border-y border-white/[0.04] overflow-hidden transition-colors duration-500" style={{ borderColor: `color-mix(in srgb, ${accentHex}, transparent 88%)` }}>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${cfg.radiusGradient} 0%, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0">
            {project.heroVisual}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6 flex flex-col flex-1">

          {/* Headline metric */}
          <div className="mb-4 pb-4 border-b border-white/[0.05] flex items-baseline gap-3">
            <span className="font-noto text-4xl font-black tracking-tighter leading-none" style={{ color: accentHex }}>
              {cfg.headline}
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#f4f4f3] font-black tracking-[0.2em] uppercase">
                {cfg.headlineLabel}
              </span>
              <span className="font-mono text-[7px] text-[#5a5a57] font-black tracking-widest uppercase">
                {cfg.headlineSub}
              </span>
            </div>
          </div>

          <h3 className="font-sans text-xl md:text-2xl font-black text-[#f4f4f3] tracking-tight leading-tight mb-2 group-hover:transition-colors group-hover:duration-300" style={{ color: '#f4f4f3' }}>
            {project.title}
          </h3>

          <p className="font-sans text-[#6a6a66] text-[12px] leading-relaxed mb-5 flex-1">
            {project.copy}
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 border-y border-white/[0.05] divide-x divide-white/[0.05] mb-5">
            {metrics.map((m, i) => (
              <div key={i} className="py-3.5 px-1 flex flex-col gap-0.5 first:pl-0 last:pr-0">
                <span className="font-mono text-base md:text-lg font-black tracking-tighter" style={{ color: accentHex }}>
                  {m.val}
                </span>
                <span className="font-mono text-[7px] text-[#5a5a57] uppercase tracking-widest font-black opacity-60">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 flex-wrap">
              {project.tech.slice(0, 3).map(t => {
                const techKey = t.toLowerCase().replace(/[\s\/]/g, '');
                const techTooltip = TOOLTIPS[techKey as keyof typeof TOOLTIPS];
                return (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04] font-mono text-[8px] text-[#5a5a57] uppercase tracking-widest font-black"
                    data-tooltip={techTooltip}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
            <div className="font-mono text-[9px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5 group/link hover:opacity-70 transition-opacity" style={{ color: accentHex }}>
              <span>{cfg.ctaText}</span>
              <span className="transition-transform group-hover/link:translate-x-1 duration-300">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
