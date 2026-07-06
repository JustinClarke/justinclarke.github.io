/**
 * StudioPage UI/UX work index.
 *
 * Fits in: the landing page reachable via /studio, rendered lazily by
 *          App.tsx inside the page-transition wrapper.
 *
 * A deliberately spare gallery: a cinematic dark hero followed by two
 * portrait case-study cards (Crescendo and StrokTalk).
 */
import { Link } from 'react-router-dom';

import { SEO, TheCloser } from '@/components/layout';
import { routeMeta } from '@/content';
import { ScrollReveal } from '@/ui';

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const NOISE_BG = 'url("/assets/noise.png")';

type CaseStudy = {
  to: string;
  index: string;
  kicker: string;
  title: string;
  blurb: string;
  image: string;
  imageFit: string;
  meta: { label: string; value: string }[];
  /** brand accent, used via the --accent CSS var */
  accent: string;
  accentSoft: string;
};

const CASES: CaseStudy[] = [
  {
    to: '/studio/crescendo',
    index: '01',
    kicker: 'Brand Identity & Editorial',
    title: 'Crescendo',
    blurb:
      "Full brand identity for GITAM University's flagship student magazine: logo, type system, five colour palettes and every spread across 120+ pages.",
    image: '/assets/art/crescendo/logo/logo-bg.webp',
    imageFit: 'object-cover',
    meta: [
      { label: 'Role', value: 'Senior Illustrator' },
      { label: 'Scope', value: '120+ pages' },
      { label: 'Tools', value: 'Adobe CC' },
    ],
    accent: '#F21170',
    accentSoft: '#72147E',
  },
  {
    to: '/studio/stroktalk',
    index: '02',
    kicker: 'UX Case Study · Aphasia Recovery',
    title: 'StrokTalk',
    blurb:
      'A mobile speech-and-language therapy companion for stroke survivors with aphasia: five training pillars, an AI doctor loop and accessibility-first design.',
    image: '/assets/art/stroktalk/screens/splash.jpg',
    imageFit: 'object-cover',
    meta: [
      { label: 'Role', value: 'Product / UX' },
      { label: 'Platform', value: 'iOS · Mobile' },
      { label: 'Screens', value: '24 designed' },
    ],
    accent: '#57CC99',
    accentSoft: '#38A3A5',
  },
];

/* ─────────────────────────── CASE CARD ─────────────────────────── */

function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      to={study.to}
      style={{ '--accent': study.accent, '--accent-soft': study.accentSoft } as React.CSSProperties}
      className="group relative flex flex-col w-full md:w-[360px] lg:w-[420px] h-[600px] lg:h-[700px] shrink-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.02] transition-all duration-[1200ms] delay-75 ease-in-out hover:border-[var(--accent)]/50 hover:bg-white/[0.04] hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_var(--accent-soft)] shadow-black/50 will-change-transform"
    >
      {/* accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms] delay-75 ease-in-out blur-3xl bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_15%,transparent)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative w-full h-[45%] overflow-hidden shrink-0 bg-black/40">
        <img
          src={study.image}
          alt={study.title}
          className={`absolute inset-0 w-full h-full ${study.imageFit} transition-transform duration-[2000ms] delay-75 ease-in-out group-hover:scale-105`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent opacity-95 transition-opacity duration-[1500ms] delay-75 ease-in-out group-hover:opacity-60" />
        <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
          <span className="font-mono text-micro tracking-mega uppercase font-bold text-text-primary">
            {study.index}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 lg:p-8 justify-between relative z-10 bg-gradient-to-b from-brand-bg to-brand-bg/95">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-fine tracking-ultra uppercase font-bold text-[var(--accent)] shadow-sm">
            {study.kicker}
          </span>

          <h3 className="font-noto text-3xl lg:text-5xl font-black uppercase tracking-tighter text-white group-hover:text-[var(--accent)] transition-colors duration-[1000ms] delay-75 ease-in-out">
            {study.title}
          </h3>

          <p className="text-text-tertiary text-sm md:text-base leading-relaxed line-clamp-3 mt-2">
            {study.blurb}
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-6">
          <div className="flex flex-wrap gap-y-4 gap-x-6 pt-5 border-t border-white/10">
            {study.meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1.5 min-w-[30%]">
                <span className="font-mono text-micro uppercase tracking-widest text-text-tertiary">{m.label}</span>
                <span className="font-sans text-xs md:text-sm text-text-primary font-medium">{m.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 inline-flex items-center justify-center gap-3 w-full px-5 py-4 rounded-xl border border-white/10 group-hover:border-[var(--accent)]/40 bg-white/[0.02] group-hover:bg-[var(--accent)]/15 transition-all duration-[1000ms] delay-75 ease-in-out shadow-inner group-hover:shadow-[0_0_20px_var(--accent-soft)]">
            <span className="font-mono text-fine font-bold tracking-widest uppercase text-text-secondary group-hover:text-white transition-colors duration-[1000ms] delay-75 ease-in-out">
              View Case Study
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-[1000ms] delay-75 ease-in-out group-hover:translate-x-1.5 text-text-secondary group-hover:text-[var(--accent)]"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export const StudioPage = () => {
  return (
    <div className="bg-brand-bg text-white font-sans selection:bg-white/20 min-h-screen flex flex-col relative overflow-x-hidden">
      <SEO {...routeMeta('/studio')} />

      {/* Background Ambience */}
      <div
        className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vh] pointer-events-none blur-[80px] bg-[radial-gradient(ellipse_at_center,rgba(114,20,126,0.15)_0%,transparent_70%)] z-0"
        aria-hidden
      />
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] pointer-events-none blur-[80px] bg-[radial-gradient(ellipse_at_center,rgba(87,204,153,0.15)_0%,transparent_70%)] z-0"
        aria-hidden
      />
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: NOISE_BG }}
        aria-hidden
      />

      {/* Hero Content */}
      <main className="flex-1 relative z-10 flex flex-col justify-center pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 w-full max-w-[1400px] mx-auto min-h-[100svh]">
        <div className="w-full flex flex-col xl:flex-row items-center xl:items-stretch justify-center gap-12 xl:gap-20">
          
          {/* Intro Section */}
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left justify-center shrink-0">
            <ScrollReveal direction="up" distance={30}>
              <div className="flex items-center gap-4 mb-6 xl:mb-8 justify-center xl:justify-start">
                <span className="font-mono text-xs md:text-sm font-bold tracking-[0.5em] text-text-tertiary uppercase drop-shadow-md">Selected Work</span>
                <div className="hidden xl:block w-24 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <h1 
                className="font-noto text-6xl md:text-8xl lg:text-[7.5rem] font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-lg" 
              >
                Studio
              </h1>
              <p className="mt-8 text-text-tertiary text-base md:text-lg font-medium max-w-[450px] leading-relaxed drop-shadow-sm">
                A curated selection of my latest design, branding, and product work. Crafted with precision.
              </p>
            </ScrollReveal>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col md:flex-row items-center xl:items-stretch gap-8 md:gap-10 justify-center w-full mt-10 xl:mt-0">
            {CASES.map((study, i) => (
              <ScrollReveal key={study.to} direction="up" distance={40} delay={0.15 * (i + 1)}>
                <CaseCard study={study} />
              </ScrollReveal>
            ))}
          </div>

        </div>
      </main>

      {/* Footer Closer */}
      <div className="relative z-10">
        <TheCloser />
      </div>
    </div>
  );
};

export default StudioPage;
