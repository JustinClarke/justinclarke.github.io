/**
 * SpotifyEnginePage the project case-study page for the MSc Spotify
 * Predictive Engine: a 3-model hierarchical recommendation system trained on
 * 1M rows of Spotify MSD data that solves the cold-start problem.
 *
 * Fits in: one of five project pages, reachable via /project/spotify-engine.
 *          Rendered lazily by App.tsx inside the page-transition wrapper.
 * Note:    the code-display block (Section 01, right column) is plain JSX
 *          using coloured <span> elements for syntax highlighting - no
 *          third-party syntax highlighter library is needed for a static
 *          snippet this small.
 */
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { routeMeta } from '@/content';
import { RelatedProjects } from '@/components/projects';

/* ─────────────────────────── DATA ─────────────────────────── */

// `color` is a CSS variable string (e.g. 'var(--color-viz-teal)'), not raw
// hex, so FeatureBar's inline style stays in sync with index.css tokens.
const AUDIO_FEATURES = [
  { label: 'Danceability',      value: 0.82, color: 'var(--color-viz-spotify)' },
  { label: 'Energy',            value: 0.74, color: 'var(--color-viz-spotify)' },
  { label: 'Valence',           value: 0.91, color: 'var(--color-viz-spotify)' },
  { label: 'Acousticness',      value: 0.12, color: 'var(--color-viz-teal)' },
  { label: 'Instrumentalness',  value: 0.05, color: 'var(--color-viz-teal)' },
  { label: 'Liveness',          value: 0.18, color: 'var(--color-viz-teal)' },
];

const MODELS = [
  {
    rank: '01',
    name: 'Hierarchical',
    subtitle: 'Model 1',
    tag: 'Recommended',
    desc: 'The flagship model. Uses a stable sort across 3 similarity dimensions: Genre TF-IDF → Popularity (Artist/Track) → Acoustic DNA.',
    pipeline: ['Genre TF-IDF', 'Popularity', 'Acoustic DNA'],
    accent: 'var(--color-viz-spotify)',
    active: true,
  },
  {
    rank: '02',
    name: 'Averaged Hybrid',
    subtitle: 'Model 2',
    tag: 'Balanced',
    desc: 'A linear combination of vector distances. Balances genre, popularity, and acoustic features into a single similarity score.',
    pipeline: ['Genre', 'Popularity', 'Acoustics'],
    accent: 'rgba(255,255,255,0.5)',
    active: false,
  },
  {
    rank: '03',
    name: 'Spotify Baseline',
    subtitle: 'Control',
    tag: 'Control',
    desc: 'The official Spotify API recommendations endpoint - our external benchmark for measuring model performance.',
    pipeline: ['Spotify API', 'Internal', 'Black-box'],
    accent: 'rgba(255,255,255,0.2)',
    active: false,
  },
];

const ENG_STATS = [
  { l: 'Dataset',    v: '1M Rows',      sub: 'Spotify MSD' },
  { l: 'Memory',     v: '<200MB',       sub: 'float16/int8' },
  { l: 'Ingestion',  v: 'Live API',     sub: 'Spotipy + cron' },
  { l: 'Features',   v: '20+',          sub: 'Audio + Meta' },
];

const NOTEBOOKS = [
  {
    name: 'Preprocessing.ipynb',
    tag: 'Stage 01',
    desc: 'Data cleaning, float16 downcasting, and CSV chunking logic for sub-200MB edge runtime.',
    link: '/resources/msc-project/Preprocessing.ipynb',
    lines: '312',
  },
  {
    name: 'Feature_Extraction.ipynb',
    tag: 'Stage 02',
    desc: 'Spotipy API ingestion, 1M-row MSD parsing, and multi-threaded feature engineering.',
    link: '/resources/msc-project/Reading1M_feature_extraction.ipynb',
    lines: '487',
  },
  {
    name: 'Modeling.ipynb',
    tag: 'Stage 03',
    desc: 'Hierarchical sort validation, cosine similarity benchmarks, and Model 1 vs. Spotify Control evaluation.',
    link: '/resources/msc-project/Modeling.ipynb',
    lines: '604',
  },
];

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

/**
 * Animated EQ bars that fill the hero section background.
 *
 * Per-bar duration/delay are computed once in the render body (not inside
 * JSX), so they stay stable across re-renders instead of reshuffling.
 */
const EQVisualizer = () => {
  const BAR_COUNT = 80;
  return (
    <div
      className="absolute inset-0 flex items-end justify-center gap-[2px] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const duration = 2 + Math.random() * 3;
        const delay = i * 0.02;
        return (
          <motion.div
            key={i}
            className="flex-1 origin-bottom"
            style={{
              background: `linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05), transparent)`,
              height: '100%',
            }}
            animate={{ 
              scaleY: [0.3, 0.8, 0.5, 1, 0.3],
              opacity: [0.2, 0.5, 0.3, 0.7, 0.2]
            }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay, 
              ease: 'easeInOut' 
            }}
          />
        );
      })}
    </div>
  );
};

/** Spotify logo mark */
const SpotifyMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308c-.216.354-.672.468-1.026.252-2.85-1.74-6.438-2.13-10.662-1.164-.402.096-.804-.156-.9-.558-.096-.402.156-.804.558-.9 4.626-1.056 8.586-.612 11.772 1.332.354.21.468.672.258 1.038zm1.47-3.258c-.276.444-.858.588-1.302.312-3.264-2.004-8.238-2.586-12.096-1.416-.504.156-1.038-.138-1.194-.642-.156-.504.138-1.038.642-1.194 4.416-1.338 9.9-0.678 13.638 1.626.45.27.594.852.312 1.314zm.126-3.414c-3.912-2.322-10.374-2.538-14.136-1.398-.6.186-1.236-.15-1.422-.75-.186-.6.15-1.236.75-1.422 4.308-1.308 11.454-1.05 16.002 1.65.54.318.72.1.4.636-.318.54-.99.72-1.596.402l.006.006z" />
  </svg>
);

/** Section label with flanking lines */
const Label = ({ children, green = false }: { children: React.ReactNode; green?: boolean }) => (
  <span className={cn(
    'inline-flex items-center gap-2 font-mono text-micro md:text-micro tracking-[0.48em] uppercase font-black',
    green ? 'text-viz-spotify' : 'text-text-ghost'
  )}>
    <span className={cn('w-5 h-px', green ? 'bg-viz-spotify/50' : 'bg-white/15')} />
    {children}
    <span className={cn('w-5 h-px', green ? 'bg-viz-spotify/50' : 'bg-white/15')} />
  </span>
);

/** Animated horizontal bar for audio features */
const FeatureBar = ({
  label, value, color, delay = 0
}: { label: string; value: number; color: string; delay?: number }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="font-mono text-micro uppercase font-black tracking-widest text-text-tertiary">{label}</span>
      <span className="font-mono text-micro font-black tabular-nums" style={{ color }}>{(value * 100).toFixed(0)}</span>
    </div>
    <div className="h-px w-full bg-white/[0.06] overflow-hidden rounded-full">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value * 100}%` }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
      />
    </div>
  </div>
);

/** Blinking terminal cursor */
const Cursor = () => (
  <motion.span
    className="inline-block w-1.5 h-3.5 bg-viz-spotify ml-0.5 align-middle"
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
  />
);

/* ─────────────────────────── PAGE ─────────────────────────── */

export const SpotifyEnginePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-surface text-fg font-sans selection:bg-viz-spotify/25 overflow-x-hidden"
    >
      <SEO {...routeMeta('/project/spotify-engine')} />



      {/* ── FIXED HUD ────────────────────────────────────────── */}
      <div
        className="fixed top-10 right-10 z-[100] hidden md:flex gap-3 items-center"
        role="status"
        aria-label="System status"
        aria-live="polite"
      >
        <div className="px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl flex items-center gap-4 shadow-2xl">
          <span className="font-mono text-micro tracking-[0.35em] uppercase text-text-ghost font-bold">SP-442</span>
          <div className="w-px h-3 bg-white/10" aria-hidden="true" />
          <span className="flex items-center gap-2 font-mono text-micro tracking-ultra uppercase text-text-tertiary font-black">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-viz-spotify opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-viz-spotify" />
            </span>
            Production Ready
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden bg-void text-white">

        {/* Background layer */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Radial green glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(29,185,84,0.08)_0%,transparent_70%)]" />
          {/* Fine grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Bottom fade over EQ bars */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void via-void/60 to-transparent" />
        </div>

        {/* Live EQ Visualizer */}
        <EQVisualizer />

        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full text-center">
          <ScrollReveal direction="up">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-10 md:mb-12 px-4 py-2 rounded-sm border border-white/[0.08] bg-white/[0.03] backdrop-blur-md"
            >
              <SpotifyMark className="w-3.5 h-3.5 text-viz-spotify" />
              <span className="font-mono text-micro tracking-[0.55em] uppercase font-bold text-text-tertiary">
                MSc Research <span className="text-text-secondary">· Spotify Project</span>
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="sr-only">Spotify: Predictive Engine - Machine Learning Research for Spotify Acoustic DNA</h1>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-noto text-[13vw] sm:text-[7rem] md:text-[9.5rem] font-black leading-[0.8] tracking-tighter mb-10 md:mb-14 uppercase"
            >
              Spotify:<br />
              <span className="text-viz-spotify italic font-playfair font-normal lowercase pr-3">predictive</span>
              Engine.
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-mono text-sm md:text-xl text-text-tertiary max-w-2xl mx-auto leading-relaxed font-medium mb-14 md:mb-20 px-4"
            >
              A{' '}
              <span className="text-white font-black underline decoration-viz-spotify underline-offset-[10px]">Terminal-First</span>{' '}
              research artifact solving the cold-start problem through 3-dimensional hierarchical similarity and acoustic DNA modelling.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <MagneticButton as="div">
                <a
                  href="/resources/msc-project/MSc_Project.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 md:px-10 py-4 rounded-2xl bg-viz-spotify text-black font-mono text-fine font-black tracking-widest uppercase shadow-[0_0_40px_rgba(29,185,84,0.3)] hover:shadow-[0_0_64px_rgba(29,185,84,0.45)] transition-shadow block text-center"
                >
                  Read Project Report
                </a>
              </MagneticButton>
              <MagneticButton as="div">
                <a
                  href="#artifacts"
                  className="px-8 md:px-10 py-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white font-mono text-fine font-black tracking-widest uppercase backdrop-blur-xl hover:bg-white/[0.07] transition-colors block text-center"
                >
                  View Notebooks
                </a>
              </MagneticButton>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 01 - ACOUSTIC DNA (uses AUDIO_FEATURES!)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-brand-bg text-white border-t border-white/[0.04] relative overflow-hidden">

        {/* Ghost text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-noto text-[16vw] font-black uppercase tracking-tighter text-white/[0.018] leading-none">DNA</span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 md:gap-32 items-center relative z-10">

          {/* Left: explanation */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <Label green>Acoustic Feature Vector</Label>
                <h2 className="font-noto text-5xl md:text-7xl xl:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  Acoustic<br />
                  <span className="text-text-ghost">DNA.</span>
                </h2>
              </div>
              <p className="font-mono text-sm md:text-base text-text-tertiary leading-relaxed max-w-lg">
                Each track is fingerprinted across 20+ Spotify API dimensions. The{' '}
                <span className="text-viz-spotify font-black">green</span> features drive high-energy recommendations;{' '}
                <span className="text-viz-teal font-black">teal</span> features fine-tune acoustic texture. Together they form the similarity vector.
              </p>

              {/* Feature bars */}
              <div className="flex flex-col gap-5 pt-6 border-t border-white/[0.06]">
                {AUDIO_FEATURES.map((f, i) => (
                  <FeatureBar key={f.label} {...f} delay={i * 0.08} />
                ))}
              </div>

              <p className="font-mono text-micro uppercase font-black tracking-widest text-text-tertiary">
                Sample values · Normalised 0–100
              </p>
            </div>
          </ScrollReveal>

          {/* Right: cosine similarity explainer card */}
          <ScrollReveal direction="right">
            <div className="relative rounded-[28px] overflow-hidden bg-deep border border-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

              {/* Card header */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.05]">
                <div className="w-2.5 h-2.5 rounded-full bg-viz-spotify" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-4 font-mono text-micro uppercase font-black tracking-widest text-text-tertiary">similarity_engine.py</span>
              </div>

              {/* Code body */}
              <div className="p-7 md:p-10 overflow-x-auto">
                <code className="font-mono text-fine md:text-label text-text-tertiary leading-[1.9] block whitespace-pre">
                  <span className="text-text-dim select-none">01  </span><span className="text-text-ghost"># Build audio feature vectors</span>{'\n'}
                  <span className="text-text-dim select-none">02  </span>audio_vecs = <span className="text-viz-teal">scaler</span>.fit_transform(df[AUDIO_COLS]){'\n'}
                  <span className="text-text-dim select-none">03  </span>{'\n'}
                  <span className="text-text-dim select-none">04  </span><span className="text-text-ghost"># TF-IDF encode genre strings</span>{'\n'}
                  <span className="text-text-dim select-none">05  </span>genre_tfidf = <span className="text-viz-teal">TfidfVectorizer</span>().fit_transform(df[<span className="text-viz-spotify">'genres'</span>]){'\n'}
                  <span className="text-text-dim select-none">06  </span>{'\n'}
                  <span className="text-text-dim select-none">07  </span><span className="text-text-ghost"># Compute cosine similarities</span>{'\n'}
                  <span className="text-text-dim select-none">08  </span>sim  = <span className="text-viz-spotify">cosine_similarity</span>(audio_vecs, query_audio){'\n'}
                  <span className="text-text-dim select-none">09  </span>sim2 = <span className="text-viz-spotify">cosine_similarity</span>(pop_vecs,   query_pop){'\n'}
                  <span className="text-text-dim select-none">10  </span>sim3 = <span className="text-viz-spotify">cosine_similarity</span>(genre_tfidf, query_genre){'\n'}
                  <span className="text-text-dim select-none">11  </span>{'\n'}
                  <span className="text-text-dim select-none">12  </span><span className="text-text-ghost"># Hierarchical stable sort → cold-start resolved</span>{'\n'}
                  <span className="text-text-dim select-none">13  </span>df[<span className="text-viz-spotify">'sim'</span>], df[<span className="text-viz-spotify">'sim2'</span>], df[<span className="text-viz-spotify">'sim3'</span>] = sim, sim2, sim3{'\n'}
                  <span className="text-text-dim select-none">14  </span>result = df.sort_values([<span className="text-viz-spotify">'sim3'</span>,<span className="text-viz-spotify">'sim2'</span>,<span className="text-viz-spotify">'sim'</span>], ascending=<span className="text-viz-teal">False</span>, kind=<span className="text-viz-spotify">'stable'</span>){'\n'}
                  <span className="text-text-dim select-none">15  </span><Cursor />
                </code>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 02 - 3-MODEL BENCHMARK
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-void text-white border-t border-white/[0.04] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-32 items-end mb-16 md:mb-24">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-6">
                <Label green>Methodological Discipline</Label>
                <h2 className="font-noto text-5xl md:text-7xl xl:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  Three Model<br />
                  <span className="text-text-ghost italic">Benchmark.</span>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="font-mono text-sm md:text-base text-text-tertiary leading-relaxed max-w-xl">
                We tested our engineered models against Spotify's internal baseline - measuring precision across three distinct input modes: Playlist, Song, and Artist. Only by competing against the source can you beat it.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MODELS.map((model, i) => (
              <ScrollReveal key={model.name} delay={i * 0.1}>
                <div
                  className={cn(
                    'relative flex flex-col h-full rounded-[20px] overflow-hidden border transition-all duration-500',
                    model.active
                      ? 'border-viz-spotify/25 bg-viz-spotify/[0.04] shadow-[0_0_60px_rgba(29,185,84,0.08)]'
                      : 'border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03]'
                  )}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-px w-full"
                    style={{ background: model.active ? 'var(--color-viz-spotify)' : 'rgba(255,255,255,0.08)' }}
                  />

                  <div className="p-8 md:p-9 flex flex-col gap-8 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-micro uppercase font-black tracking-widest text-text-tertiary">{model.tag}</span>
                        <span className="font-mono text-micro uppercase font-black tracking-widest" style={{ color: model.accent }}>
                          {model.subtitle}
                        </span>
                      </div>
                      <span
                        className="font-noto text-4xl font-black leading-none"
                        style={{ color: model.active ? 'var(--color-viz-spotify)' : 'rgba(255,255,255,0.07)' }}
                      >
                        {model.rank}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-noto text-2xl md:text-3xl font-black uppercase leading-tight">{model.name}</h3>

                    {/* Description */}
                    <p className="font-mono text-fine md:text-xs text-text-tertiary leading-relaxed flex-1">{model.desc}</p>

                    {/* Pipeline stages */}
                    <div className="pt-6 border-t border-white/[0.06]">
                      <span className="font-mono text-micro uppercase font-black tracking-widest text-text-tertiary block mb-3">Sort Pipeline</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {model.pipeline.map((stage, si) => (
                          <React.Fragment key={stage}>
                            <span
                              className="font-mono text-micro font-black uppercase px-2.5 py-1 rounded-full border"
                              style={{
                                color: model.active ? 'var(--color-viz-spotify)' : 'rgba(255,255,255,0.3)',
                                borderColor: model.active ? 'rgba(29,185,84,0.25)' : 'rgba(255,255,255,0.06)',
                                background: model.active ? 'rgba(29,185,84,0.06)' : 'transparent',
                              }}
                            >
                              {stage}
                            </span>
                            {si < model.pipeline.length - 1 && (
                              <span className="text-text-dim font-mono text-micro">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 03 - DATA ENGINEERING (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-brand-bg text-white border-t border-white/[0.04] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 md:gap-32 items-center">

          <ScrollReveal direction="left">
            <div className="flex flex-col gap-10 md:gap-12">
              <div className="flex flex-col gap-5">
                <Label green>Memory-First Design</Label>
                <h2 className="font-noto text-5xl md:text-7xl xl:text-[7rem] font-black tracking-tighter uppercase leading-[0.82]">
                  Data<br />
                  <span className="text-text-ghost">Engineering.</span>
                </h2>
              </div>

              <p className="font-mono text-sm md:text-base text-text-tertiary leading-relaxed">
                Handling a 1M-row dataset on edge environments required strict memory engineering. We utilized{' '}
                <span className="text-viz-spotify font-black">float16/int8</span> downcasting and chunked CSV processing to maintain a sub-200MB runtime footprint.
              </p>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-0 border border-white/[0.06] divide-x divide-y divide-white/[0.06]">
                {ENG_STATS.map((stat) => (
                  <div key={stat.l} className="flex flex-col gap-1 p-6 group hover:bg-white/[0.02] transition-colors">
                    <span className="font-mono text-micro uppercase tracking-widest text-text-tertiary font-black">{stat.l}</span>
                    <span className="font-noto text-xl md:text-2xl font-black">{stat.v}</span>
                    <span className="font-mono text-micro text-text-tertiary">{stat.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Self-growing dataset diagram */}
          <ScrollReveal direction="right">
            <div className="relative rounded-[24px] overflow-hidden border border-white/[0.06] bg-pitch p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] flex flex-col gap-8">

              <div className="flex items-center justify-between">
                <span className="font-mono text-micro uppercase font-black tracking-widest text-text-tertiary">Dataset Growth Loop</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-viz-spotify" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Pipeline steps */}
              {[
                { step: '01', title: 'Playlist URL input', detail: 'User pastes Spotify playlist URI' },
                { step: '02', title: 'Spotipy API fetch', detail: 'Retrieve audio features for all tracks' },
                { step: '03', title: 'Append to dataset',  detail: 'New tracks persisted to new_tracks.csv' },
                { step: '04', title: 'Trigger at 200 rows', detail: 'Auto-merge into main 1M corpus' },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-5 items-start">
                  <div className="flex flex-col items-center gap-0 shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-micro font-black border shrink-0"
                      style={{ borderColor: 'rgba(29,185,84,0.3)', color: 'var(--color-viz-spotify)', background: 'rgba(29,185,84,0.06)' }}
                    >
                      {item.step}
                    </div>
                    {i < 3 && (
                      <motion.div
                        className="w-px bg-gradient-to-b from-viz-spotify/30 to-transparent"
                        initial={{ height: 0 }}
                        whileInView={{ height: 28 }}
                        transition={{ duration: 0.4, delay: i * 0.12, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <span className="font-noto text-sm font-black uppercase leading-none">{item.title}</span>
                    <span className="font-mono text-micro text-text-tertiary leading-relaxed">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 04 - RESEARCH ARTIFACTS (white)
      ══════════════════════════════════════════════════════════════ */}
      <section id="artifacts" className="py-24 md:py-40 px-6 md:px-12 bg-white text-black relative overflow-hidden">

        <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col gap-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 font-mono text-micro tracking-[0.48em] uppercase font-black text-black/25">
              <span className="w-5 h-px bg-black/15" />Notebook Repository<span className="w-5 h-px bg-black/15" />
            </span>
            <h2 className="font-noto text-[12vw] sm:text-7xl md:text-[8.5rem] font-black tracking-tighter uppercase leading-none">
              Research<br />Artifacts.
            </h2>
          </div>

          {/* ls -la style listing */}
          <div className="flex flex-col gap-0 border border-black/[0.08] overflow-hidden rounded-[16px]">
            {NOTEBOOKS.map((nb, i) => (
              <ScrollReveal key={nb.name} delay={i * 0.07}>
                <a
                  href={nb.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-0 p-7 md:p-9 border-b last:border-b-0 border-black/[0.07] hover:bg-black/[0.02] transition-colors"
                >
                  {/* Stage badge */}
                  <div className="md:w-28 shrink-0">
                    <span className="font-mono text-micro uppercase font-black tracking-widest px-2.5 py-1 rounded-full border border-black/[0.12] text-black/40">
                      {nb.tag}
                    </span>
                  </div>

                  {/* File name */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="font-mono text-sm md:text-base font-black text-black">{nb.name}</span>
                    <span className="font-mono text-fine text-black/35 leading-relaxed max-w-lg">{nb.desc}</span>
                  </div>

                  {/* Meta */}
                  <div className="md:w-24 shrink-0 flex flex-col items-start md:items-end gap-0.5">
                    <span className="font-mono text-micro font-black uppercase tracking-widest text-black/20">{nb.lines} lines</span>
                    <span className="font-mono text-micro font-black uppercase tracking-widest text-black/20">.ipynb</span>
                  </div>

                  {/* Arrow */}
                  <div className="md:ml-8 shrink-0">
                    <motion.div
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors duration-300"
                    >
                      <svg
                        className="w-3 h-3 text-black/25 group-hover:text-white transition-colors duration-300"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* Stack footnote */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-black/[0.07]">
            {[
              { l: 'Core',   v: 'React + TypeScript' },
              { l: 'AI',     v: 'Gemini 1.5 + Scikit-learn' },
              { l: 'DB',     v: 'Firestore (real-time)' },
              { l: 'Input',  v: 'Playlist · Song · Artist' },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-2">
                <span className="font-mono text-micro uppercase font-black tracking-widest text-black/25">{s.l}:</span>
                <span className="font-mono text-micro font-black text-black/50">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedProjects currentProjectId="spotify-engine" />

      <footer className="w-full border-t border-border-subtle">
        <TheCloser />
      </footer>
    </div>
  );
};
