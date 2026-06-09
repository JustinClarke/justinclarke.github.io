import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrambleText } from '../../ui/ScrambleText';
import { STATS } from '../../../data/projectStats';
import { smoothScrollTo } from '@/utils';

const GROSS_TIME = '1:31.408';
const TRUE_PACE = '1:29.035';
const TOTAL_STRIPPED = '2.373';

interface DecompositionRow {
  label: string;
  delta: string;
  pct: number;
}

const DECOMPOSITION: DecompositionRow[] = [
  { label: 'Fuel load', delta: '0.812', pct: 65 },
  { label: 'Tyre deg', delta: '1.243', pct: 100 },
  { label: 'Dirty air', delta: '0.318', pct: 26 },
];

function DecompositionPanel() {
  return (
    <div className="relative group overflow-hidden bg-[#0A0A0A]/92 border border-white/[0.08] backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-[#0A0A0A]/95 hover:border-white/[0.12] hover:shadow-[0_0_40px_rgba(225,6,0,0.15)]">
      {/* Subtle glowing orb in the background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[radial-gradient(closest-side,rgba(225,6,0,0.25),transparent)] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

      {/* Tech corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-f1-red/50 rounded-tl-xl transition-colors duration-300 group-hover:border-f1-red" />
      <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-f1-red/50 rounded-br-xl transition-colors duration-300 group-hover:border-f1-red" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-6 pb-2 sm:pb-4 border-b border-white/[0.08] font-jetbrains">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-f1-red animate-pulse shadow-[0_0_8px_rgba(225,6,0,0.8)]" />
          <span className="text-[8px] sm:text-[9px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-white/70 font-semibold">
            CAUSAL DECOMPOSITION
          </span>
        </div>
        <span className="text-[7px] sm:text-[9px] text-white/40 tracking-wider font-medium">SPAIN 2023 · L32 · VER</span>
      </div>

      <div className="relative z-10 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-0 sm:mb-6 font-jetbrains">
        <div className="text-left">
          <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-white/40 mb-1 sm:mb-1.5 font-medium">GROSS LAP</div>
          <div className="text-xl sm:text-3xl lg:text-4xl font-black text-white/70 tabular-nums tracking-tight">
            {GROSS_TIME}
          </div>
        </div>

        <div className="sm:hidden text-f1-red/40 flex-shrink-0 mx-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        <div className="text-right sm:hidden">
          <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-f1-red/80 mb-1 sm:mb-1.5 font-bold">TRUE PACE</div>
          <div className="text-2xl font-black text-white tabular-nums tracking-tight" style={{ textShadow: '0 0 24px rgba(225,6,0,0.6)' }}>
            {TRUE_PACE}
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden sm:flex flex-col gap-4 sm:gap-4 mb-3 sm:mb-4">
        {DECOMPOSITION.map(({ label, delta, pct }) => (
          <div key={label} className="flex items-center justify-between gap-3 sm:gap-4 group/row">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/20 shrink-0 transition-colors duration-300 group-hover/row:bg-white/50" />
              <span className="font-jetbrains text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50 truncate transition-colors duration-300 group-hover/row:text-white/90">
                {label}
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-3 shrink-0">
              <div className="w-14 sm:w-20 h-[3px] bg-white/[0.05] rounded-full relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-f1-red/40 to-f1-red rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-jetbrains text-[10px] sm:text-[11px] text-f1-red font-semibold tabular-nums w-12 sm:w-14 text-right drop-shadow-[0_0_8px_rgba(225,6,0,0.4)] transition-all duration-300 group-hover/row:text-[#ff1a0d] group-hover/row:drop-shadow-[0_0_12px_rgba(225,6,0,0.6)]">
                −{delta}s
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total stripped  - makes the math legible */}
      <div className="relative z-10 hidden sm:flex items-center justify-between gap-3 mb-4 sm:mb-5 pt-3 border-t border-white/[0.06]">
        <span className="font-jetbrains text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30">Total stripped</span>
        <span className="font-jetbrains text-[11px] sm:text-[12px] text-white/50 font-bold tabular-nums">−{TOTAL_STRIPPED}s</span>
      </div>

      <div className="relative z-10 hidden sm:block border-t border-white/[0.12] pt-4 sm:pt-5 mb-4 sm:mb-5 font-jetbrains">
        <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-f1-red/80 mb-1.5 font-bold">TRUE PACE</div>
        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight" style={{ textShadow: '0 0 24px rgba(225,6,0,0.6)' }}>
          {TRUE_PACE}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between sm:pt-4 sm:border-t border-white/[0.06] font-jetbrains gap-2 mt-4 sm:mt-0">
        <span className="text-[6px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/30 font-medium">
          {STATS.races} RACES <span className="hidden sm:inline">// {STATS.seasons} SEASONS</span>
        </span>
        <span className="sm:hidden text-[6px] text-f1-red/60 tracking-widest uppercase font-bold">
          PACE ISOLATED
        </span>
      </div>
    </div>
  );
}

export function SplitHero() {
  const [hoverCta, setHoverCta] = useState(false);
  const [hoverSource, setHoverSource] = useState(false);
  const [hoverFindings, setHoverFindings] = useState(false);

  return (
    <section className="relative min-h-screen lg:h-screen flex flex-col pt-20 pb-16 lg:pt-24 lg:pb-32 overflow-hidden">
      <style>{`
        @keyframes slideArrow {
          0% { transform: translateX(-6px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px color-mix(in srgb, var(--color-f1-red) 40%, transparent);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px color-mix(in srgb, var(--color-f1-red) 80%, transparent), 0 0 60px color-mix(in srgb, var(--color-f1-red) 40%, transparent);
            transform: scale(1.02);
          }
        }
        .cta-arrow {
          display: inline-block;
          margin-left: 2px;
          transition: transform 0.2s ease-out;
          opacity: 0;
        }
        .cta-button:hover .cta-arrow {
          animation: slideArrow 0.3s ease-out forwards;
          transform: translateX(4px);
        }
        .app-launch-btn {
          animation: pulseGlow 2s infinite ease-in-out;
        }
        .app-launch-btn:hover {
          animation: none;
        }
      `}</style>

      {/* Video background  - f1.webm preferred; f1.mp4 fallback */}
      <video
        autoPlay loop muted playsInline
        {...{ fetchpriority: 'high' }}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        poster="/assets/audif1.avif"
        style={{ objectFit: 'cover', objectPosition: 'center', willChange: 'transform', transform: 'translate3d(0,0,0)' }}
      >
        <source src="/assets/f1.webm" type="video/webm" />
        <source src="/assets/f1.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(22,24,29,0.25), rgba(22,24,29,0.92))' }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-f1-red-dim)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-4 overflow-x-hidden">

        <div className="flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-f1-red/25 bg-[#2E0100]/90">
            <span className="font-jetbrains text-[7px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.4em] uppercase font-black text-f1-red">
              F1 TELEMETRY // CAUSAL DECOMPOSITION
            </span>
          </div>

          <h1
            aria-label="Off The Pace"
            className="font-noto text-7xl sm:text-8xl lg:text-[8vw] xl:text-[7.5rem] font-black leading-none tracking-tighter mb-4 sm:mb-6 uppercase text-center lg:text-left"
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
              OFF THE
            </span>
            <span className="block text-f1-red italic font-playfair font-bold mt-[-0.35em] lowercase" style={{ textShadow: '0 0 60px rgba(225,6,0,0.7)' }}>
              pace.
            </span>
          </h1>

          <div className="flex flex-col gap-1.5 sm:gap-2 mb-6 sm:mb-8 text-center lg:text-left">
            <p className="font-jetbrains text-base sm:text-lg md:text-xl text-white/90 font-bold">
              Lap times lie.
            </p>
            <p className="font-jetbrains text-[11px] sm:text-xs text-white/45 uppercase tracking-[0.12em] sm:tracking-[0.2em] leading-relaxed max-w-md mx-auto lg:mx-0">
              Seven measurable causes explain every lap. This strips them out.
            </p>
          </div>

          <div className="w-full max-w-sm sm:max-w-xl lg:max-w-[560px] flex flex-col gap-3 mt-3 sm:mt-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
              {/* BLUE: ARCHITECTURE */}
              <a
                href="/off-the-pace"
                onMouseEnter={(e) => {
                  setHoverSource(true);
                  e.currentTarget.style.boxShadow = 'color-mix(in srgb, #1D4ED8 80%, transparent) 0 0 35px';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, #1D4ED8 10%, transparent)';
                }}
                onMouseLeave={(e) => {
                  setHoverSource(false);
                  e.currentTarget.style.boxShadow = 'color-mix(in srgb, #1D4ED8 40%, transparent) 0 0 20px';
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                className="cta-button order-3 col-span-1 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200"
                style={{ backgroundColor: 'transparent', borderColor: '#1D4ED8', borderWidth: '1px', boxShadow: 'color-mix(in srgb, #1D4ED8 40%, transparent) 0 0 20px', opacity: 0.9 }}
              >
                <ScrambleText text="ARCHITECTURE" isHovered={hoverSource} prefix="[" suffix="]" />
              </a>

              {/* RED: LAUNCH DASHBOARD */}
              <a
                href="https://off-the-pace.web.app/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => {
                  setHoverCta(true);
                  e.currentTarget.style.boxShadow = '0 0 40px color-mix(in srgb, var(--color-f1-red) 100%, transparent), 0 0 80px color-mix(in srgb, var(--color-f1-red) 60%, transparent)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  setHoverCta(false);
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = '';
                }}
                className="app-launch-btn cta-button order-1 col-span-2 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-black whitespace-nowrap transition-all duration-300"
                style={{ backgroundColor: 'var(--color-f1-red)', borderColor: 'var(--color-f1-red)', borderWidth: '1px', zIndex: 50 }}
              >
                <span className="mr-3 flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <ScrambleText text="RUN CAUSAL MODELS // INTERACTIVE" isHovered={hoverCta} prefix="[" suffix="]" />
              </a>

              {/* GREEN: SEE THE FINDINGS */}
              <a
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('case-studies', 2.2, 80);
                }}
                onMouseEnter={(e) => {
                  setHoverFindings(true);
                  e.currentTarget.style.boxShadow = 'color-mix(in srgb, #00665E 80%, transparent) 0 0 35px';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, #00665E 15%, transparent)';
                }}
                onMouseLeave={(e) => {
                  setHoverFindings(false);
                  e.currentTarget.style.boxShadow = 'color-mix(in srgb, #00665E 40%, transparent) 0 0 20px';
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                className="cta-button order-2 col-span-1 inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-white font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200"
                style={{ backgroundColor: 'transparent', borderColor: '#00665E', borderWidth: '1px', boxShadow: 'color-mix(in srgb, #00665E 40%, transparent) 0 0 20px', opacity: 0.9 }}
              >
                <ScrambleText text="SEE THE FINDINGS" isHovered={hoverFindings} prefix="[" suffix="]" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none lg:mx-0">
          <DecompositionPanel />
        </div>
      </div>

    </section>
  );
}
