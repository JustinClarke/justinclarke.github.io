import { useState } from 'react';
import { STATS, LINKS } from '../data/projectStats';
import { ScrambleText } from './ui/ScrambleText';
import { smoothScrollTo } from '@/utils';

const PILLARS = [
  { label: `${STATS.racesIngested} races · ${STATS.seasons} seasons` },
  { label: 'CI-enforced ±0.0001s' },
  { label: `5 XGBoost models · ${STATS.mlTests} tests` },
];

export const ProjectHero = () => {
  const [hoverRepo, setHoverRepo] = useState(false);
  const [hoverDocs, setHoverDocs] = useState(false);
  const [hoverOver, setHoverOver] = useState(false);

  return (
    <section className="relative h-screen md:h-dvh flex flex-col items-center justify-between px-6 md:px-24 pt-20 md:pt-24 pb-28 md:pb-32 overflow-hidden">
      <style>{`
        @keyframes slideArrow {
          0% { transform: translateX(-6px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px color-mix(in srgb, var(--color-f1-red, #ef4444) 40%, transparent);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px color-mix(in srgb, var(--color-f1-red, #ef4444) 80%, transparent), 0 0 60px color-mix(in srgb, var(--color-f1-red, #ef4444) 40%, transparent);
            transform: scale(1.03);
          }
        }
        .cta-arrow { display: inline-block; margin-left: 2px; transition: transform 0.2s ease-out; opacity: 0; }
        .cta-button:hover .cta-arrow { animation: slideArrow 0.3s ease-out forwards; transform: translateX(4px); }
        .app-launch-btn {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        .app-launch-btn:hover {
          animation: none;
        }
      `}</style>

      {/* Video background */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/assets/audif1.avif"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      >
        <source src="/assets/f1.webm" type="video/webm" />
        <source src="/assets/f1.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(22, 24, 29, 0.35), rgba(22, 24, 29, 0.93))' }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-f1-red-dim)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl py-2">
        <div className="flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full border border-f1-red/25 bg-f1-red/10 backdrop-blur-3xl">
            <span className="font-jetbrains text-[7px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.4em] uppercase font-black text-f1-red">
              F1 TELEMETRY // ARCHITECTURE + SOURCE
            </span>
          </div>

          <h1 className="relative font-noto text-6xl sm:text-8xl lg:text-[8.5vw] xl:text-[8rem] font-black leading-none tracking-tighter mb-4 uppercase text-center">
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
              OFF THE
            </span>
            <span className="block italic font-playfair font-bold mt-[-0.35em] lowercase" style={{ color: 'var(--color-f1-red)', textShadow: '0 0 60px color-mix(in srgb, var(--color-f1-red) 70%, transparent)' }}>
              pace.
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-48 blur-[140px] pointer-events-none -rotate-6" style={{ backgroundColor: 'color-mix(in srgb, var(--color-f1-red) 8%, transparent)' }} />
          </h1>

          {/* Capability statement : 2 lines, cold-entry oriented */}
          <div className="flex flex-col gap-2 mb-4 text-center px-4 max-w-2xl mx-auto">
            <p className="font-jetbrains text-base sm:text-lg md:text-xl text-white/90 font-bold leading-snug">
              Seven causes. One <span className="hidden sm:inline">enforced</span> invariant.<br className="hidden sm:block" /> Reproducible locally.
            </p>
            <p className="font-jetbrains text-[11px] sm:text-xs text-white/50 uppercase tracking-[0.15em] leading-relaxed">
              FastF1 → dbt → DuckDB → XGBoost
            </p>
          </div>

          {/* Three pillars chips */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2.5 mb-6">
            {PILLARS.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-f1-red shrink-0" />
                <span className="font-jetbrains text-[9px] sm:text-[10px] uppercase tracking-widest text-white/70 font-semibold whitespace-nowrap">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-3xl flex flex-col gap-3 items-center mt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              {/* NAVY: REPOSITORY */}
              <a
                href={LINKS.repo}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => { setHoverRepo(true); e.currentTarget.style.boxShadow = 'color-mix(in srgb, #1D4ED8 80%, transparent) 0 0 35px'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, #1D4ED8 10%, transparent)'; }}
                onMouseLeave={(e) => { setHoverRepo(false); e.currentTarget.style.boxShadow = 'color-mix(in srgb, #1D4ED8 40%, transparent) 0 0 20px'; e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                className="cta-button order-1 sm:order-1 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200"
                style={{ backgroundColor: 'transparent', borderColor: '#1D4ED8', borderWidth: '1px', boxShadow: 'color-mix(in srgb, #1D4ED8 40%, transparent) 0 0 20px', opacity: 0.9 }}
              >
                <ScrambleText text="REPOSITORY" isHovered={hoverRepo} prefix="[" suffix="]" />
              </a>

              {/* RED: LAUNCH WEB APP */}
              <a
                href="https://off-the-pace.web.app/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => { setHoverOver(true); e.currentTarget.style.boxShadow = '0 0 40px color-mix(in srgb, var(--color-f1-red, #ef4444) 100%, transparent), 0 0 80px color-mix(in srgb, var(--color-f1-red, #ef4444) 60%, transparent)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; }}
                onMouseLeave={(e) => { setHoverOver(false); e.currentTarget.style.boxShadow = ''; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}
                className="app-launch-btn cta-button order-3 col-span-2 sm:order-2 sm:col-span-1 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-black whitespace-nowrap transition-all duration-300"
                style={{ backgroundColor: 'var(--color-f1-red, #ef4444)', borderColor: 'var(--color-f1-red, #ef4444)', borderWidth: '1px', zIndex: 50 }}
              >
                <span className="mr-2.5 flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <ScrambleText text="RUN CAUSAL MODELS" isHovered={hoverOver} prefix="[" suffix="]" />
              </a>

              {/* GREEN: DOCUMENTATION */}
              <a
                href={LINKS.docs}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => { setHoverDocs(true); e.currentTarget.style.boxShadow = 'color-mix(in srgb, #00665E 80%, transparent) 0 0 35px'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, #00665E 15%, transparent)'; }}
                onMouseLeave={(e) => { setHoverDocs(false); e.currentTarget.style.boxShadow = 'color-mix(in srgb, #00665E 40%, transparent) 0 0 20px'; e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                className="cta-button order-2 sm:order-3 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200"
                style={{ backgroundColor: 'transparent', borderColor: '#00665E', borderWidth: '1px', boxShadow: 'color-mix(in srgb, #00665E 40%, transparent) 0 0 20px', opacity: 0.9 }}
              >
                <ScrambleText text="DOCUMENTATION" isHovered={hoverDocs} prefix="[" suffix="]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left control panel readout */}
      <div className="absolute bottom-8 left-10 hidden lg:flex flex-col gap-0 font-jetbrains text-[10px] text-white/40 uppercase tracking-[0.2em] pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-viz-success)', boxShadow: 'color-mix(in srgb, var(--color-viz-success) 60%, transparent) 0 0 12px' }} />
          <span className="text-white/80 font-bold tracking-widest">SYS: PIPELINE HEALTHY</span>
        </div>
        <div className="grid grid-cols-[6rem_1fr] gap-x-6 border-b border-white/10 py-2">
          <span>INGEST</span>
          <span className="text-white/80 font-semibold">{STATS.racesIngested} RACES // {STATS.seasons} SEASONS</span>
        </div>
        <div className="grid grid-cols-[6rem_1fr] gap-x-6 border-b border-white/10 py-2">
          <span>TRANSFORM</span>
          <span className="text-white/80 font-semibold">{STATS.dbtModels} MODELS // {STATS.tests} TESTS</span>
        </div>
        <div className="grid grid-cols-[6rem_1fr] gap-x-6 border-b border-white/10 py-2">
          <span>ML</span>
          <span className="text-white/80 font-semibold">5 XGBOOST // {STATS.mlTests} TESTS</span>
        </div>
        <div className="grid grid-cols-[6rem_1fr] gap-x-6 pt-2">
          <span>TELEMETRY</span>
          <span className="text-white/80 font-semibold">10 HZ // 90M+ ROWS/SEASON</span>
        </div>
      </div>
    </section>
  );
};
