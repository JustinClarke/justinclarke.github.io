/**
 * SplitHero the hero atop the Overview page: a two-column split with the
 * headline + three CTAs on the left and a live "causal decomposition" panel
 * (DecompositionPanel) on the right, over a looping F1 video.
 *
 * Fits in: rendered once by OffThePaceOverview, under PersistentNav.
 * Note:    Like ProjectHero, the CTAs animate via direct DOM style writes in
 *          their mouse handlers, so those colours live in inline `style`, and
 *          one-off keyframes live in the scoped <style> block.
 *
 * For beginners ----------------------------------------------------------------
 * DecompositionPanel is a private presentational sub-component: it takes no
 * props and just renders the DECOMPOSITION data array as labelled bars. The
 * three `hover*` useState booleans only feed ScrambleText so each button's label
 * "decodes" when you point at it. The "Findings" link calls smoothScrollTo
 * instead of jumping, after `e.preventDefault()` stops the default anchor jump.
 * -----------------------------------------------------------------------------
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrambleText } from '../../ui/ScrambleText';
import { STATS, LINKS } from '../../../data/projectStats';
import { HERO_LAP, toLapClock } from '../../../data/decompositions';
import { CASE_STUDIES } from '../../../data/caseStudies';
import { smoothScrollTo } from '@/utils';
import { ScrollHint } from '@/pages/home/Hero/ScrollHint';

// W1  - the living hero decomposition. Real lap from the warehouse
// (decompositions.ts), animated as a strip-away waterfall. Numbers reconcile to
// the additive identity by construction: truePace = gross - Σterms.
const HERO_GROSS = toLapClock(HERO_LAP.grossLapTime_s);   // "1:38.330"
const HERO_TRUE = toLapClock(HERO_LAP.truePace_s);        // "1:37.058"
const HERO_TAG = `${HERO_LAP.raceLabel.toUpperCase()} · L${HERO_LAP.lap} · ${HERO_LAP.driver}`;
const HERO_MAX_ABS = Math.max(...HERO_LAP.terms.map((t) => Math.abs(t.seconds)));

function TermRow({ term, index, reduce }: { term: (typeof HERO_LAP.terms)[number]; index: number; reduce: boolean }) {
  const slower = term.seconds >= 0;                       // positive = slower than baseline
  const frac = Math.abs(term.seconds) / HERO_MAX_ABS;     // 0..1 of one half-track
  const value = `${slower ? '+' : '−'}${Math.abs(term.seconds).toFixed(3)}`;
  const bar = (
    <motion.span
      className="block h-full w-full rounded-[2px]"
      style={{ backgroundColor: term.color, transformOrigin: slower ? 'left center' : 'right center' }}
      initial={reduce ? false : { scaleX: 0, opacity: 0.4 }}
      whileInView={reduce ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 group/row">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: term.color }} />
      <span className="font-jetbrains text-[9px] sm:text-[10px] uppercase tracking-wide text-white/55 w-[5.25rem] shrink-0 truncate transition-colors duration-300 group-hover/row:text-white/90">
        {term.label}
      </span>
      {/* diverging track: faster (−) grows left toward the axis, slower (+) grows right */}
      <div className="flex-1 flex items-stretch h-[5px] min-w-0">
        <div className="w-1/2 flex justify-end pr-px overflow-hidden">
          <div className="h-full" style={{ width: `${slower ? 0 : frac * 100}%` }}>{!slower && bar}</div>
        </div>
        <span className="w-px self-stretch bg-white/15 shrink-0" aria-hidden="true" />
        <div className="w-1/2 flex justify-start pl-px overflow-hidden">
          <div className="h-full" style={{ width: `${slower ? frac * 100 : 0}%` }}>{slower && bar}</div>
        </div>
      </div>
      <span
        className="font-jetbrains text-[10px] sm:text-[11px] tabular-nums w-11 sm:w-12 text-right shrink-0 font-semibold"
        style={{ color: slower ? 'var(--color-sql-red)' : 'var(--color-emerald)' }}
      >
        {value}s
      </span>
    </div>
  );
}

function DecompositionPanel() {
  const reduce = useReducedMotion() ?? false;
  return (
    <div className="relative group overflow-hidden bg-[#0a0a0c]/70 border border-white/10 backdrop-blur-[24px] saturate-[180%] p-4 sm:p-6 lg:p-7 rounded-2xl shadow-2xl transition-all duration-500 hover:bg-[#0a0a0c]/80 hover:border-white/20 hover:shadow-[0_0_50px_rgba(225,6,0,0.2)]">
      {/* Subtle glowing orb in the background */}
      <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-[radial-gradient(closest-side,rgba(225,6,0,0.4),transparent)] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60 animate-[pulseGlow_6s_ease-in-out_infinite]" />

      {/* Tech corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-f1-red/50 rounded-tl-xl transition-colors duration-300 group-hover:border-f1-red" />
      <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-f1-red/50 rounded-br-xl transition-colors duration-300 group-hover:border-f1-red" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-white/[0.08] font-jetbrains">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-f1-red animate-pulse shadow-[0_0_8px_rgba(225,6,0,0.8)]" />
          <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/70 font-semibold">
            CAUSAL DECOMPOSITION
          </span>
        </div>
        <span className="text-[7px] sm:text-[9px] text-white/40 tracking-wider font-medium">{HERO_TAG}</span>
      </div>

      {/* Honesty label  - kills the "is this fabricated?" ambiguity (plan W1) */}
      <div className="relative z-10 hidden sm:flex items-center gap-1.5 mb-4 text-[8px] uppercase tracking-[0.2em] text-emerald-400/80 font-jetbrains font-semibold">
        <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
        Real lap · <span className="text-white/45 normal-case tracking-normal lowercase">fct_lap_residuals</span>
      </div>

      <div className="relative z-10 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-0 sm:mb-4 font-jetbrains">
        <div className="text-left">
          <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-white/40 mb-1 sm:mb-1.5 font-medium">GROSS LAP</div>
          <div className="text-xl sm:text-3xl lg:text-4xl font-black text-white/70 tabular-nums tracking-tight">
            {HERO_GROSS}
          </div>
        </div>

        <div className="sm:hidden text-f1-red/40 flex-shrink-0 mx-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        <div className="text-right sm:hidden">
          <div className="text-[7px] sm:text-[9px] uppercase tracking-[0.3em] text-f1-red/80 mb-1 sm:mb-1.5 font-bold">TRUE PACE</div>
          <div className="text-2xl font-black text-white tabular-nums tracking-tight" style={{ textShadow: '0 0 24px rgba(225,6,0,0.6)' }}>
            {HERO_TRUE}
          </div>
        </div>
      </div>

      {/* All 7 signed terms, peeled one-by-one (≤1.2s total; static for reduced-motion) */}
      <div className="relative z-10 hidden sm:flex flex-col gap-2.5 mb-3 sm:mb-4">
        {HERO_LAP.terms.map((term, i) => (
          <TermRow key={term.key} term={term} index={i} reduce={reduce} />
        ))}
      </div>

      {/* Total stripped  - makes the math legible */}
      <div className="relative z-10 hidden sm:flex items-center justify-between gap-3 mb-4 pt-3 border-t border-white/[0.06]">
        <span className="font-jetbrains text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30">Net of 7 causes</span>
        <span className="font-jetbrains text-[11px] sm:text-[12px] text-white/50 font-bold tabular-nums">
          {HERO_LAP.totalStripped_s >= 0 ? '+' : '−'}{Math.abs(HERO_LAP.totalStripped_s).toFixed(3)}s
        </span>
      </div>

      <div className="relative z-10 hidden sm:block border-t border-white/[0.12] pt-4 mb-4 font-jetbrains">
        <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-f1-red/80 mb-1.5 font-bold">TRUE PACE · BASELINE</div>
        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight" style={{ textShadow: '0 0 24px rgba(225,6,0,0.6)' }}>
          {HERO_TRUE}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between sm:pt-3 sm:border-t border-white/[0.06] font-jetbrains gap-2 mt-4 sm:mt-0">
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

// W2  - one concrete, clickable proof above the fold. Strategy/skill numbers come
// straight from caseStudies.ts (no new constants); link opens the live finding.
function ProofLine() {
  const sp = CASE_STUDIES.find((c) => c.id === 'sao-paulo-2021');
  if (!sp) return null;
  const strat = sp.metrics[0]?.value ?? '';
  const skill = sp.metrics[1]?.value ?? '';
  return (
    <a
      href={sp.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group/proof inline-flex items-center gap-2.5 mb-6 sm:mb-8 px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:border-f1-red/40 hover:bg-f1-red/[0.06] transition-all duration-300 max-w-md mx-auto lg:mx-0"
    >
      <span className="font-jetbrains text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-f1-red font-black shrink-0">Proven</span>
      <span className="font-jetbrains text-[10px] sm:text-[11px] text-white/65 leading-tight text-left">
        São Paulo 2021: <span className="text-white font-bold tabular-nums">{strat}</span> strategy,{' '}
        <span className="text-emerald-400 font-bold tabular-nums">{skill}</span> Hamilton  - measured
      </span>
      <svg className="w-3 h-3 text-white/30 group-hover/proof:text-f1-red group-hover/proof:translate-x-0.5 transition-all duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    </a>
  );
}

export function SplitHero() {
  const [hoverCta, setHoverCta] = useState(false);
  const [hoverSource, setHoverSource] = useState(false);
  const [hoverFindings, setHoverFindings] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // P2  - the hero video no longer competes with the LCP. It ships with
  // preload="none" + no autoplay (so nothing is fetched up front), and we only
  // start it AFTER window load, and only on a real desktop viewport with motion
  // allowed and Save-Data off. Otherwise the cheap AVIF poster is all that
  // paints  - which keeps the <h1> as the LCP element on mobile/metered/reduced.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const okViewport = window.matchMedia('(min-width: 769px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (!okViewport || reduceMotion || saveData) return; // poster only

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      el.play().catch(() => { /* autoplay blocked: poster remains, no error */ });
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
    };
  }, []);

  // Detect scroll to dismiss the scroll hint when entering other sections
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="f1-hero" className="relative min-h-screen lg:h-screen flex flex-col py-20 lg:py-24 overflow-hidden">
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
            box-shadow: 0 0 50px color-mix(in srgb, var(--color-f1-red) 90%, transparent), 0 0 80px color-mix(in srgb, var(--color-f1-red) 50%, transparent);
            transform: scale(1.03);
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

      {/* Video background  - f1.webm preferred; f1.mp4 fallback. Deferred + gated
          in the effect above (preload=none, started post-load on desktop only);
          the AVIF poster carries the visual until then. */}
      <video
        ref={videoRef}
        loop muted playsInline preload="none"
        aria-hidden="true"
        width={1920}
        height={1080}
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

          {/* W2  - one concrete proof above the fold. Numbers sourced from caseStudies.ts. */}
          <ProofLine />

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

              {/* RED: LAUNCH DASHBOARD unified single CTA */}
              <a
                href="https://off-the-pace.web.app/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => {
                  setHoverCta(true);
                  e.currentTarget.style.boxShadow = '0 0 40px color-mix(in srgb, var(--color-f1-red) 50%, transparent), 0 0 80px color-mix(in srgb, var(--color-f1-red) 25%, transparent)';
                  e.currentTarget.style.transform = 'scale(1.015) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  setHoverCta(false);
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.transform = '';
                }}
                className="app-launch-btn group order-1 col-span-2 relative flex items-stretch text-white transition-all duration-300 overflow-hidden rounded-md"
                style={{ backgroundColor: '#0a0a0c', borderColor: 'color-mix(in srgb, var(--color-f1-red) 35%, transparent)', borderWidth: '1px', zIndex: 50 }}
              >
                {/* Left accent bar */}
                <div
                  className="w-1 sm:w-1.5 shrink-0 transition-all duration-300 group-hover:w-2"
                  style={{ background: 'linear-gradient(180deg, var(--color-f1-red), color-mix(in srgb, var(--color-f1-red) 50%, #1a0000))' }}
                />

                {/* Subtle shimmer overlay on hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-20deg] pointer-events-none" />

                {/* Content area */}
                <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 sm:py-4 relative z-10">
                  {/* Row 1: Label + status */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Ping dot */}
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-f1-red opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-f1-red shadow-[0_0_6px_rgba(225,6,0,0.8)]" />
                    </span>

                    <span className="font-jetbrains text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black text-white group-hover:text-white transition-colors">
                      <ScrambleText text="LAUNCH PLATFORM" isHovered={hoverCta} prefix="[" suffix="]" />
                    </span>

                    {/* Status pill */}
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30 transition-colors">
                      <span className="relative flex h-1 w-1">
                        <span className="group-hover:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-400" />
                      </span>
                      <span className="font-jetbrains text-[7px] sm:text-[8px] uppercase tracking-[0.15em] text-emerald-400/90 font-semibold group-hover:text-emerald-300 transition-colors">
                        Live · {"<"}10ms
                      </span>
                    </span>
                  </div>

                  {/* Row 2: Feature pills inline, horizontal */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {['Ghost Car Standings', 'Tyre Cliff Survival', 'ONNX Simulators'].map((feat, i) => (
                      <span
                        key={feat}
                        className={`font-jetbrains text-[7px] sm:text-[8px] tracking-wider uppercase px-2 py-[3px] rounded-[3px] border transition-colors duration-300 ${
                          feat === 'ONNX Simulators' ? 'hidden sm:inline-block' : 'inline-block'
                        }`}
                        style={{
                          color: `rgba(255,255,255,${0.55 - i * 0.12})`,
                          borderColor: `rgba(255,255,255,${0.08 - i * 0.02})`,
                          backgroundColor: `rgba(255,255,255,${0.03 - i * 0.005})`,
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right arrow affordance */}
                <div className="flex items-center pr-4 sm:pr-5 shrink-0 relative z-10">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white/25 group-hover:text-f1-red group-hover:translate-x-0.5 transition-all duration-300"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              {/* GREEN: DOCUMENTATION */}
              <a
                href={LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
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
                <ScrambleText text="DOCUMENTATION" isHovered={hoverFindings} prefix="[" suffix="]" />
              </a>
            </div>



          </div>
        </div>

        <div className="w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none lg:mx-0">
          <DecompositionPanel />
        </div>
      </div>

      {/* Scroll hint retro F1 style, starts dark grey, turns light red, blinks if idle, disappears in other sections */}
      <ScrollHint hasScrolled={hasScrolled} variant="f1" className="absolute bottom-6 md:bottom-8" />
    </section>
  );
}
