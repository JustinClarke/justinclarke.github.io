/**
 * StrokTalkPage UX/product case study for StrokTalk, a mobile speech-and-language
 * rehabilitation app for stroke survivors living with aphasia.
 *
 * Fits in: a showcase page reachable via /studio/stroktalk.
 *          Rendered lazily by App.tsx inside the page-transition wrapper.
 *
 * Built for an MSc Interactive System Design module at QMUL. Every screen here
 * is a real high-fidelity mockup; the page frames them in device chrome and
 * walks through the product story.
 *
 * Sections:
 *   1. Hero               split-screen brand intro + floating device stack
 *   2. The Brief          problem framing + headline stats
 *   3. Design System      colour palette (interactive swatches) + type/voice note
 *   4. Five Pillars       interactive master-detail of the training modules
 *   5. Onboarding Flow    the first-run journey as a connected device sequence
 *   6. Training Gallery   horizontal carousel of every drill screen
 *   7. Feature Deep-Dives doctor loop, progress analytics, accessibility
 *   8. Footer             TheCloser
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { ScrollReveal } from '@/ui';
import { SEO, TheCloser } from '@/components/layout';
import { STROKTALK_PALETTE } from '@/config/constants';

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const ASSET = '/assets/art/stroktalk/screens';

const HERO_META = [
  { label: 'Role', value: 'Product / UX Design' },
  { label: 'Platform', value: 'iOS · Mobile' },
  { label: 'Type', value: 'Concept App' },
  { label: 'Module', value: 'Interactive System Design' },
];

const STATS = [
  { k: '5', v: 'Training pillars' },
  { k: '24', v: 'Designed screens' },
  { k: '1 tap', v: 'To a specialist' },
  { k: 'AA', v: 'Accessibility-first' },
];

const PILLARS = [
  {
    id: 'comprehension',
    name: 'Comprehension',
    tag: 'Understanding language',
    home: `${ASSET}/home-comprehension.jpg`,
    drill: `${ASSET}/train-comprehension-meaning.jpg`,
    task: 'Select the phrase with the same meaning',
    blurb:
      'Re-learning to decode meaning. The patient matches a short phrase to its closest paraphrase low-pressure, multiple-choice so reading comprehension rebuilds one sentence at a time.',
  },
  {
    id: 'expression',
    name: 'Expression',
    tag: 'Forming the words',
    home: `${ASSET}/home-expression.jpg`,
    drill: `${ASSET}/train-expression.jpg`,
    task: 'Describe the picture into the microphone',
    blurb:
      'Bridging thought and speech. A prompt image asks the patient to describe what they see out loud the app captures the audio and hands it to the assessment engine for scoring.',
  },
  {
    id: 'speech',
    name: 'Speech',
    tag: 'Saying it clearly',
    home: `${ASSET}/home-speech.jpg`,
    drill: `${ASSET}/train-speech.jpg`,
    task: 'Hold the button and read the word aloud',
    blurb:
      'Articulation practice at word level. Press-and-hold to record a single target word the deliberate hold gesture gives a clear start and end, which matters a lot for shaky motor control.',
  },
  {
    id: 'memory',
    name: 'Memory',
    tag: 'Linking word to image',
    home: `${ASSET}/home-memory.jpg`,
    drill: `${ASSET}/train-memory-match.jpg`,
    task: 'Select the picture that matches the word',
    blurb:
      'Word-retrieval and recall. The patient binds a written word to the right image, then to scenes containing it strengthening the lexical pathways that a stroke often disrupts.',
  },
  {
    id: 'communication',
    name: 'Communication',
    tag: 'Putting it together',
    home: `${ASSET}/home-communication.jpg`,
    drill: `${ASSET}/train-communication.jpg`,
    task: 'Hold a free-form conversation',
    blurb:
      'The graduation module. An open chat lets the patient string everything comprehension, expression, recall into real back-and-forth conversation, the actual goal of recovery.',
  },
];

const JOURNEY = [
  { src: `${ASSET}/splash.jpg`, step: '01', label: 'Launch', caption: 'A calm mint splash, zero clutter.' },
  { src: `${ASSET}/onboarding-terms.jpg`, step: '02', label: 'Consent', caption: 'Plain-language terms before anything else.' },
  { src: `${ASSET}/onboarding-phone.jpg`, step: '03', label: 'Phone', caption: 'One field, oversized input.' },
  { src: `${ASSET}/onboarding-verify.jpg`, step: '04', label: 'Verify', caption: 'A four-digit code, big and spaced.' },
  { src: `${ASSET}/onboarding-profile.jpg`, step: '05', label: 'Profile', caption: 'Age, goals and an emergency contact.' },
  { src: `${ASSET}/set-goal.png`, step: '06', label: 'Goal', caption: 'Pick a difficulty and begin.' },
];

const TRAINING_GALLERY = [
  { src: `${ASSET}/start-training.jpg`, label: 'Session start' },
  { src: `${ASSET}/train-comprehension-meaning.jpg`, label: 'Comprehension · Same meaning' },
  { src: `${ASSET}/train-comprehension-sort.jpg`, label: 'Comprehension · Sort sentences' },
  { src: `${ASSET}/train-expression.jpg`, label: 'Expression · Describe the picture' },
  { src: `${ASSET}/train-speech.jpg`, label: 'Speech · Read aloud' },
  { src: `${ASSET}/train-memory-match.jpg`, label: 'Memory · Match the word' },
  { src: `${ASSET}/train-memory-items.jpg`, label: 'Memory · Find the items' },
  { src: `${ASSET}/train-communication.jpg`, label: 'Communication · Free chat' },
];

const FEATURES = [
  {
    src: `${ASSET}/doctor-assessment.jpg`,
    kicker: 'AI scoring + a real clinician',
    title: 'A doctor in the loop',
    body: 'Every session is scored and turned into plain-language evaluation comments naming the syntax and grammar patterns it spotted, then a concrete improvement plan. A "Join the 15-min call" button keeps a real rehab specialist one tap away.',
    points: ['Readable feedback, not jargon', 'Session score out of 100', 'Tap-to-call a specialist'],
  },
  {
    src: `${ASSET}/history.jpg`,
    kicker: 'History & analytics',
    title: 'Progress you can feel',
    body: 'Recovery is slow, so the app makes it visible. A running score graph, a rolling average and a total session count turn invisible effort into momentum each record carrying its date, duration and delta from last time.',
    points: ['Highest-score trend line', 'Rolling average & totals', 'Per-session deltas'],
  },
  {
    src: `${ASSET}/appearance.png`,
    kicker: 'Accessibility',
    title: 'Built for every ability',
    body: 'The users are relearning to read and may have motor impairment, so legibility is the whole game. Three text sizes, light and dark themes, system-following display, oversized tap targets and a single accent colour to follow.',
    points: ['Bold / Regular / Large text', 'Light, dark & system themes', 'Big targets, one accent'],
  },
];

/* ─────────────────────────── PRIMITIVES ─────────────────────────── */

/** iPhone-style device frame around a full-screen mockup screenshot. */
function PhoneFrame({
  src,
  alt,
  className = '',
  priority = false,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallback?: string;
}) {
  return (
    <div className={`relative ${className} will-change-transform`}>
      <div className="relative rounded-[2rem] md:rounded-[2.4rem] p-[3px] bg-gradient-to-b from-white/20 via-white/5 to-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
        <div className="rounded-[1.85rem] md:rounded-[2.2rem] overflow-hidden bg-strok-slate border border-black/50">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block select-none"
            loading={priority ? 'eager' : 'lazy'}
            onError={(e) => {
              if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
            draggable={false}
          />
        </div>
        {/* glossy edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] md:rounded-[2.4rem] ring-1 ring-inset ring-white/10" />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] md:rounded-[2.4rem] bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.07] mix-blend-overlay" />
      </div>
    </div>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8 md:mb-12">
      <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.5em] text-white/20">{number}</span>
      <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/30">{title}</span>
    </div>
  );
}

/** Interactive colour swatch with copy-to-clipboard + computed RGB. */
function DetailedSwatch({ color }: { color: (typeof STROKTALK_PALETTE)[number] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rgb = useMemo(() => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
  }, [color.hex]);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-3 md:p-4 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
      <button
        className="w-full aspect-[5/3] rounded-xl mb-3 border border-white/10 transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50"
        style={{ backgroundColor: color.hex }}
        onClick={handleCopy}
        aria-label={`Copy hex code ${color.hex} for ${color.name}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20 mix-blend-overlay" />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">Copied</span>
        </div>
      </button>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-strok-mint/80 mb-1">{color.role}</span>
      <span className="font-sans font-bold text-white text-sm tracking-tight">{color.name}</span>
      <span className="font-mono text-[11px] text-white/40 mt-0.5">{color.hex.toUpperCase()}</span>
      <span className="font-mono text-[10px] text-white/25">RGB {rgb}</span>
      <p className="text-white/40 text-[11px] leading-relaxed mt-3">{color.note}</p>
    </div>
  );
}

/* ─────────────────────────── FIVE PILLARS ─────────────────────────── */

function PillarsExplorer() {
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <div className="flex flex-col gap-10 md:gap-16">
      {/* Tab selector */}
      <div className="flex flex-wrap items-center gap-2.5 md:gap-3 justify-center lg:justify-start">
        {PILLARS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full border transition-all duration-300 font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] ${
              i === active
                ? 'border-strok-mint bg-strok-mint text-strok-slate font-bold shadow-[0_0_24px_color-mix(in_srgb,var(--color-strok-mint)_45%,transparent)] scale-105'
                : 'border-white/15 hover:border-white/40 text-white/55 hover:text-white bg-white/[0.02]'
            }`}
          >
            <span className="opacity-50 mr-1.5">0{i + 1}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
        {/* Info */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-noto text-5xl md:text-6xl font-black text-white/10 leading-none">0{active + 1}</span>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full border border-strok-mint/30 bg-strok-mint/10 font-mono text-[9px] tracking-[0.2em] uppercase text-strok-mint mb-2">
                    {pillar.tag}
                  </span>
                  <h3 className="font-noto text-3xl md:text-4xl font-black text-white tracking-tight">{pillar.name}</h3>
                </div>
              </div>

              <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl">{pillar.blurb}</p>

              {/* The drill, as a labelled task chip */}
              <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-strok-mint/15 border border-strok-mint/30 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-strok-mint">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">The drill</span>
                  <span className="block text-white/80 text-sm font-medium">{pillar.task}</span>
                </div>
              </div>

              {/* Progress rail */}
              <div className="flex items-center gap-1.5 pt-2">
                {PILLARS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to ${PILLARS[i].name}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === active ? 'w-8 bg-strok-mint' : 'w-4 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Device pair */}
        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          {/* ambient glow */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-60 bg-[radial-gradient(ellipse_at_60%_40%,color-mix(in_srgb,var(--color-strok-mint)_18%,transparent)_0%,transparent_70%)]"
            aria-hidden
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-4 md:gap-6 items-center"
            >
              <PhoneFrame src={pillar.home} alt={`${pillar.name} home screen`} className="translate-y-3" />
              <PhoneFrame src={pillar.drill} alt={`${pillar.name} training screen`} className="-translate-y-3" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── TRAINING CAROUSEL ─────────────────────────── */

function TrainingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[idx] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(idx);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollLeft = el.scrollLeft;
          const childWidth = (el.firstElementChild as HTMLElement)?.offsetWidth || 1;
          const gap = 24;
          setActiveIndex(Math.round(scrollLeft / (childWidth + gap)));
          ticking = false;
        });
        ticking = true;
      }
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {TRAINING_GALLERY.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex-shrink-0 w-56 sm:w-64 md:w-72 snap-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="group">
              <PhoneFrame src={item.src} alt={item.label} className="transition-transform duration-500 group-hover:-translate-y-1.5" />
              <div className="mt-4 flex items-center gap-2 px-1">
                <span className="font-mono text-[10px] text-strok-mint/70">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[10px] md:text-[11px] tracking-wide uppercase text-white/45 group-hover:text-white/80 transition-colors">
                  {item.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        {TRAINING_GALLERY.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-strok-mint' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export const StrokTalkPage = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-strok-mint/30 overflow-x-hidden flex flex-col">
      <SEO
        title="StrokTalk Speech Rehab App ⋅ Justin Clarke"
        description="UX case study for StrokTalk an iOS speech-and-language rehabilitation app for stroke survivors with aphasia. Five training pillars, an AI doctor loop and accessibility-first design."
        path="/studio/stroktalk"
      />

      {/* ══════════════════════════════════════════════
          SECTION 1 HERO
      ══════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#040605]" aria-hidden />
        {/* ambient mint glows */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[820px] h-[820px] pointer-events-none blur-[80px] bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--color-strok-mint)_16%,transparent)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[720px] h-[720px] pointer-events-none blur-[80px] bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--color-strok-mint-deep)_14%,transparent)_0%,transparent_70%)]"
          aria-hidden
        />
        {/* noise */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: 'url("/assets/noise.png")',
          }}
          aria-hidden
        />
        {/* editorial grid lines */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-[6%] w-px bg-white/[0.03]" aria-hidden />
        <div className="hidden lg:block absolute top-0 bottom-0 right-[6%] w-px bg-white/[0.03]" aria-hidden />

        {/* back link */}
        <Link
          to="/studio"
          className="absolute top-24 left-6 md:left-16 z-20 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white/80 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Portfolio
        </Link>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center h-full pt-32 pb-16 lg:py-0">
          {/* LEFT editorial */}
          <div className="flex flex-col justify-center gap-6 lg:gap-7 text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal direction="up" className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-strok-mint/25 bg-strok-mint/[0.06] shadow-[0_0_30px_color-mix(in_srgb,var(--color-strok-mint)_12%,transparent)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="w-1.5 h-1.5 rounded-full bg-strok-mint shadow-[0_0_8px_var(--color-strok-mint)] animate-pulse" />
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-white/90">
                  UX Case Study · Aphasia Recovery
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="font-noto text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]">
                Strok<span className="text-strok-mint">Talk</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <p className="text-white/50 font-light text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                A mobile speech-and-language therapy companion for stroke survivors living with aphasia turning slow,
                clinical rehab into daily, game-like practice with a doctor on call.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.22}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-3 border-t border-white/[0.06]">
                {HERO_META.map((m) => (
                  <div key={m.label} className="flex flex-col items-center lg:items-start">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{m.label}</span>
                    <span className="font-sans text-xs md:text-sm text-white/75 font-medium">{m.value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT device stack */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-[420px] lg:min-h-0">
            <ScrollReveal direction="up" delay={0.15} className="relative w-full max-w-[420px] mx-auto">
              {/* halo */}
              <div
                className="absolute inset-[-15%] rounded-full blur-[110px] opacity-40 animate-pulse bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-strok-mint)_60%,transparent)_0%,transparent_65%)]"
                style={{ animationDuration: '6s' }}
                aria-hidden
              />
              {/* back phone */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                whileInView={{ opacity: 1, y: 0, rotate: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="absolute left-0 top-6 w-[46%] hidden sm:block"
              >
                <PhoneFrame src={`${ASSET}/history.jpg`} alt="StrokTalk training history" priority />
              </motion.div>
              {/* front phone */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: 0, scale: 1.03 }}
                className="relative z-10 w-[64%] sm:w-[62%] ml-auto mr-2 sm:mr-6"
              >
                <PhoneFrame src={`${ASSET}/home-comprehension.jpg`} alt="StrokTalk home screen" priority />
              </motion.div>
            </ScrollReveal>
          </div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 THE BRIEF
      ══════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-16 pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="01" title="The Brief" />
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <ScrollReveal direction="up" className="lg:col-span-7">
              <h2 className="font-noto text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                Designing for the day after a stroke.
              </h2>
              <div className="space-y-5 text-white/55 text-base md:text-lg leading-relaxed">
                <p>
                  After a stroke, many people live with <span className="text-white">aphasia</span> a loss of the ability to
                  understand or produce language. Recovery is possible, but it leans on repetitive, often dull exercises that
                  usually only happen inside a clinic.
                </p>
                <p>
                  StrokTalk moves that practice into the patient's pocket. It breaks rehabilitation into five focused pillars,
                  wraps each in a friendly, low-pressure drill, and closes the loop with an{' '}
                  <span className="text-strok-mint">AI-scored assessment</span> and a real specialist a tap away. The brief: make
                  daily speech therapy feel less like homework and more like progress.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1} className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4 h-full">
                {STATS.map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:p-6 flex flex-col justify-center hover:border-strok-mint/30 transition-colors duration-300"
                  >
                    <span className="font-noto text-3xl md:text-4xl font-black text-strok-mint tracking-tight">{s.k}</span>
                    <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider text-white/45 mt-1">{s.v}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 DESIGN SYSTEM
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="02" title="Design System" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
              <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter shrink-0">
                Calm, clear, one accent.
              </h2>
              <p className="text-white/40 font-mono text-xs md:text-sm max-w-xl md:text-right">
                The system does the opposite of "engaging." For a tired brain relearning language, restraint is the feature: a
                single mint to follow, ink to read, and one coral cue per screen.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {STROKTALK_PALETTE.map((c) => (
                <DetailedSwatch key={c.hex} color={c} />
              ))}
            </div>
          </ScrollReveal>

          {/* Type & voice note */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <div className="rounded-2xl md:rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-9">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-strok-mint/80">Typography</span>
                <p className="font-noto text-4xl md:text-5xl font-black tracking-tight mt-3 mb-4">Aa Bb Cc</p>
                <p className="text-white/50 text-sm md:text-base leading-relaxed">
                  A rounded, low-contrast sans set heavy and large. Headings carry the weight; body never drops below a comfortable
                  size. When your reader is relearning to read, legibility isn't a nicety it's the product.
                </p>
              </div>
              <div className="rounded-2xl md:rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-9 flex flex-col justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-strok-mint/80 mb-4">Tone of voice</span>
                <div className="space-y-3">
                  {[
                    'Short imperative prompts “Select one”, “Read aloud”.',
                    'One word per prompt in coral, never a whole sentence.',
                    'Encouraging, never clinical “Good job. 89.7”.',
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-strok-coral flex-shrink-0" />
                      <span className="text-white/60 text-sm md:text-base leading-relaxed">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 FIVE PILLARS
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="03" title="Training Pillars" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
              <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter shrink-0">
                Five ways back to language.
              </h2>
              <p className="text-white/40 font-mono text-xs md:text-sm max-w-xl md:text-right">
                The carousel on the home screen is the spine of the app. Each pillar owns its own 3D guide and its own kind of drill.
                Tap through them.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <PillarsExplorer />
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 ONBOARDING FLOW
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="04" title="First-Run Journey" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              From install to first drill.
            </h2>
            <p className="text-white/40 font-mono text-xs md:text-sm max-w-2xl mb-10 md:mb-14">
              Six steps, each stripped to a single decision. Big inputs, generous spacing and a clear forward button no patient gets
              stranded before training even begins.
            </p>
          </ScrollReveal>

          <div className="flex gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {JOURNEY.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex-shrink-0 w-48 sm:w-56 snap-center relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <PhoneFrame src={s.src} alt={s.label} />
                <div className="mt-4 px-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-strok-mint">{s.step}</span>
                    <span className="font-sans text-sm font-bold text-white tracking-tight">{s.label}</span>
                  </div>
                  <p className="text-white/40 text-[11px] leading-relaxed">{s.caption}</p>
                </div>
                {/* connector arrow */}
                {i < JOURNEY.length - 1 && (
                  <div className="hidden md:flex absolute top-[42%] -right-4 z-10 text-white/20">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6 TRAINING GALLERY
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="05" title="Inside The Drills" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Every exercise, end to end.
            </h2>
            <p className="text-white/40 font-mono text-xs md:text-sm max-w-2xl mb-10 md:mb-14">
              Multiple-choice meaning, sentence sorting, picture description, press-to-speak, image matching and free chat one
              consistent shell, many ways to practise.
            </p>
          </ScrollReveal>

          <TrainingCarousel />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 7 FEATURE DEEP-DIVES
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="06" title="Closing The Loop" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 md:mb-16">
              Three things that make it stick.
            </h2>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-12">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.05}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center rounded-3xl border border-white/8 bg-white/[0.02] p-6 md:p-10 hover:border-strok-mint/25 transition-colors duration-500 ${
                    i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                  }`}
                >
                  <div className="lg:col-span-5 flex justify-center [direction:ltr]">
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className="absolute inset-[-12%] -z-10 blur-3xl opacity-50 bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--color-strok-mint)_20%,transparent)_0%,transparent_70%)]"
                        aria-hidden
                      />
                      <PhoneFrame src={f.src} alt={f.title} />
                    </div>
                  </div>
                  <div className="lg:col-span-7 [direction:ltr]">
                    <span className="inline-block px-3 py-1 rounded-full border border-strok-mint/30 bg-strok-mint/10 font-mono text-[9px] tracking-[0.2em] uppercase text-strok-mint mb-4">
                      {f.kicker}
                    </span>
                    <h3 className="font-noto text-2xl md:text-4xl font-black tracking-tight mb-4">{f.title}</h3>
                    <p className="text-white/55 text-base md:text-lg leading-relaxed mb-6 max-w-xl">{f.body}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {f.points.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/8 bg-white/[0.03] font-mono text-[10px] md:text-[11px] tracking-wide text-white/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-strok-mint" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="w-full border-t border-white/5 mt-auto">
        <TheCloser />
      </footer>
    </div>
  );
};

export default StrokTalkPage;
