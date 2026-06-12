/**
 * LiteStorePage the project case-study page for the LiteStore retail SaaS
 * platform built and shipped solo at age 19.
 *
 * Fits in: one of five project pages, reachable via /project/litestore.
 *          Rendered lazily by App.tsx and mounted inside the page-transition
 *          wrapper.
 * Note:    BRAND_COLOR stores the CSS variable string so the same value can be
 *          passed both to JSX `style={{ color: BRAND_COLOR }}` and to
 *          Tailwind utilities via `text-litestore`. Never a raw hex here.
 *
 * For beginners ----------------------------------------------------------------
 * The rotating "Build Output" log at the bottom of the hero uses two React
 * ideas together. useState stores which log line is currently visible (a
 * number 0-4). useEffect runs a setInterval that increments that number every
 * 2.8 seconds, cycling back to 0 at the end. AnimatePresence from Framer
 * Motion then plays a fade-slide animation each time the number changes and
 * a different <motion.span> needs to appear.
 * -----------------------------------------------------------------------------
 */
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, MagneticButton, BackToTerminal } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { RelatedProjects } from '@/components/projects';

// LEARN: This constant stores a CSS variable reference, not a raw hex colour.
//    When React renders `style={{ color: BRAND_COLOR }}`, the browser resolves
//    `var(--color-litestore)` at paint time from index.css - so if the token
//    ever changes, every usage updates automatically.
const BRAND_COLOR = 'var(--color-litestore)';

const STACK_PILLS = [
  'Next.js 12', 'Tailwind CSS', 'MUI', 'Swiper', 'AOS',
  'GA4', 'sheet.best', 'Vercel', 'GitHub Actions',
];

const CONTRIBUTIONS = [
  {
    label: 'Sole Frontend Engineer',
    detail: 'Every line of JSX, every Tailwind token, every route. Listed in /about/company as "Justin Clarke / React Developer."',
    accent: true,
  },
  {
    label: 'Brand Identity & Design',
    detail: 'Designed the LiteStore logo and visual language from a blank brief   no design team, no design file handed to me.',
    accent: false,
  },
  {
    label: 'Client Lead (No PM)',
    detail: 'Sole point of contact for requirements and delivery. Directly managing a paying client at 19.',
    accent: false,
  },
  {
    label: 'Google Workspace Admin',
    detail: 'Managed org-level Google Workspace for the client. First time owning infrastructure beyond the codebase.',
    accent: false,
  },
  {
    label: 'Three Full Rewrites',
    detail: 'HTML/CSS → Create React App → Next.js 12. Each version shipped. Each version taught something the next one fixed.',
    accent: false,
  },
  {
    label: 'Hired My Own Replacement',
    detail: 'When I left, I recruited and onboarded the next developer. First time architecting a handoff, not just a product.',
    accent: false,
  },
];

const METRICS = [
  { value: '₹2.2 Cr+', label: 'GMV via Flexi-Stores' },
  { value: '58%', label: 'Cheaper than conventional retail' },
  { value: '48 hrs', label: 'Brand transition time' },
  { value: '11', label: 'Brands in production' },
  { value: '30+', label: 'Statically prerendered routes' },
  { value: '3', label: 'Mall locations' },
];

const BRAND_TOKENS = [
  { name: 'LiteStore', hex: '#7e7ca6' }, // tw-allow-hex displayed as a literal swatch label
  { name: 'MensXP', hex: '#ff5e03' },
  { name: 'Vitro', hex: '#2c4b35' },
  { name: 'WOW', hex: '#bc9850' },
  { name: 'Sleepycat', hex: '#ff6832' },
  { name: 'JBL', hex: '#ff3200' },
];

const LOGS = [
  '[BUILD] next 12.2.2 · 30 routes prerendered',
  '[POST] axios → sheet.best/api/sheets/31835dc6...',
  '[GTAG] window.dataLayer.push · page_path: ${pathname}',
  '[TENANT] /spaces/{orion,garuda,lulu}/{brand}',
  '[THEME] tailwind.config.js · 5 brand color tokens',
];

export const LiteStorePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLog, setActiveLog] = useState(0);

  // LEARN: setInterval fires the callback repeatedly on a fixed delay. The
  //    function returned from useEffect is the "cleanup" - it runs when this
  //    component unmounts (the visitor navigates away) and cancels the interval
  //    so it doesn't keep running in the background after the page is gone.
  useEffect(() => {
    const interval = setInterval(() => setActiveLog(p => (p + 1) % LOGS.length), 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface-primary text-text-base font-sans selection:bg-litestore/30 overflow-x-hidden">
      <SEO
        title="LiteStore ⋅ Retail-as-a-Service"
        description="Production Next.js platform: 30+ statically prerendered routes, multi-tenant brand theming, GA4 telemetry, and a Google Sheets pipeline. Shipped solo to litestore.in."
        path="/project/litestore"
        schemaType="SoftwareApplication"
      />

      <BackToTerminal />

      {/* ── LIVE STATUS PILL ── */}
      <div className="fixed top-12 right-6 md:right-12 z-[100] flex items-center gap-3">
        <div className="hidden md:flex px-4 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-litestore animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/50">Production Live</span>
        </div>
        <a
          href="https://litestore.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-litestore text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all duration-200"
        >
          Visit Site
        </a>
      </div>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 py-24 md:py-28 overflow-hidden bg-brand-bg text-white">
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12]" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,color-mix(in_srgb,var(--color-litestore)_19%,transparent)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Main heading */}
        <ScrollReveal direction="up">
          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-white/8 bg-white/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full bg-litestore animate-ping" />
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-bold text-white/50">
                Solo Engineering Lead · litestore.in
              </span>
            </div>

            <h1 className="font-noto text-[13vw] sm:text-8xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase mb-8">
              Retail as a<br />
              <span style={{ color: BRAND_COLOR }}>Service.</span>
            </h1>

            <p className="font-mono text-base md:text-xl text-white/40 max-w-2xl leading-relaxed mb-10">
              LiteStore is India's Retail-as-a-Service platform. I built litestore.in:
              {' '}<span className="text-white">30+ routes</span>, LiteStore storefronts for{' '}
              <span className="text-white">11 brands across 3 malls</span>, lead pipeline, GA4 telemetry.
              Shipped <span className="text-white">solo at 19</span>.
            </p>

            <MagneticButton as="div">
              <a
                href="https://litestore.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 py-4 rounded-2xl bg-white text-black font-mono text-xs font-black tracking-widest uppercase shadow-2xl"
              >
                Visit litestore.in
              </a>
            </MagneticButton>
          </div>
        </ScrollReveal>

        {/* Bottom bar: live log + quick stats */}
        <div className="relative z-10 max-w-6xl mx-auto w-full mt-16 pt-8 border-t border-white/8 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[9px] tracking-widest uppercase text-white/20 font-black">Build Output</span>
            </div>
            <div className="font-mono text-[10px] md:text-xs text-litestore/70 h-5">
              <AnimatePresence mode="wait">
                <motion.span key={activeLog} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {LOGS[activeLog]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex gap-10 md:justify-end">
            {[
              { v: '30+', l: 'Routes' },
              { v: '11', l: 'Tenants' },
              { v: '3', l: 'Malls' },
              { v: '~2K', l: 'LOC' },
            ].map(m => (
              <div key={m.l} className="flex flex-col gap-0.5 text-right">
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{m.l}</span>
                <span className="font-noto text-2xl font-black text-white">{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TECH STACK + ARCHITECTURE (combined)
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-pitch text-white border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: stack + architecture narrative */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-litestore font-black">Architecture</span>
                <h2 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter mt-2">How It's Built.</h2>
              </div>

              <p className="font-mono text-sm md:text-base text-white/40 leading-relaxed">
                Pages Router with <span className="text-white">getStaticProps</span> for every route,
                edge-cacheable, SEO-ready. Multi-tenant brand pages live at{' '}
                <code className="text-litestore">/spaces/&lt;mall&gt;/&lt;brand&gt;</code>, each pulling per-tenant
                Tailwind color tokens from a single config. Forms POST via <span className="text-white">axios → sheet.best</span> into
                the client's own Google Sheet   serverless, zero backend, revocable without touching code.
                GA4 wired directly in <code className="text-white">_document.js</code> with{' '}
                <code className="text-white">process.env</code> config for staging/prod isolation.
              </p>

              {/* Stack pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {STACK_PILLS.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] tracking-wider text-white/60 uppercase"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Form pipeline visual */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">Form Pipeline</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { label: 'Next.js Form', sub: 'client-side', color: 'border-litestore/30 text-litestore' },
                    { label: '→', sub: '', color: 'text-white/20 border-transparent' },
                    { label: 'axios POST', sub: 'sheet.best API', color: 'border-white/10 text-white' },
                    { label: '→', sub: '', color: 'text-white/20 border-transparent' },
                    { label: 'Google Sheets', sub: "client's own data", color: 'border-green-500/20 text-green-400' },
                  ].map((step, i) => (
                    step.label === '→'
                      ? <span key={i} className="font-mono text-white/20 text-lg">→</span>
                      : (
                        <div key={i} className={`px-3 py-2 rounded-xl border ${step.color} flex flex-col`}>
                          <span className="font-mono text-[10px] font-black uppercase tracking-wider">{step.label}</span>
                          {step.sub && <span className="font-mono text-[9px] text-white/30">{step.sub}</span>}
                        </div>
                      )
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: brand color tokens */}
          <ScrollReveal direction="right">
            <div className="flex flex-col gap-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-litestore font-black">Design System</span>
                <h2 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter mt-2">Per-Tenant<br />Tokens.</h2>
              </div>
              <p className="font-mono text-sm text-white/40 leading-relaxed">
                One <code className="text-white">tailwind.config.js</code>. Every brand gets its own named color token,
                consumed by a shared template   no copy-paste, no forked stylesheets.
              </p>

              <div className="relative p-1 bg-gradient-to-br from-litestore/20 to-transparent rounded-[28px]">
                {/* tw-allow-hex: one-off swatch card colour in the design system demo */}
                <div className="bg-[#0d0d0d] rounded-[27px] p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-5 opacity-40">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    <span className="ml-3 font-mono text-[9px] uppercase tracking-widest text-white/40">tailwind.config.js · theme.colors</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {BRAND_TOKENS.map(token => (
                      <div key={token.name} className="flex items-center gap-4 group">
                        <div
                          className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0 shadow-md"
                          style={{ backgroundColor: token.hex }}
                        />
                        <div className="flex items-baseline gap-3 min-w-0">
                          <span className="font-mono text-xs text-white font-bold uppercase tracking-wide">{token.name}</span>
                          <code className="font-mono text-[10px] text-white/30">{token.hex}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          METRICS
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-brand-bg text-white border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-12">
              <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-litestore font-black">Production Metrics</span>
              <h2 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter mt-2">Numbers.</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {METRICS.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.06} direction="up" className="h-full">
                <div className="group relative p-6 h-full rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col gap-4 hover:border-litestore/30 hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-white/10 font-bold uppercase tracking-widest">[METRIC_0{i + 1}]</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-litestore/20 group-hover:bg-litestore/80 group-hover:scale-125 transition-all duration-300" />
                  </div>
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <span className="font-noto text-2xl sm:text-3xl font-black text-litestore tracking-tight whitespace-nowrap leading-none">{m.value}</span>
                    <span className="font-mono text-[9px] text-white/40 leading-relaxed uppercase tracking-wider group-hover:text-white/60 transition-colors duration-300">{m.label}</span>
                  </div>
                  <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(126,124,166,0.08)_0%,transparent_70%)] transition-opacity duration-300 pointer-events-none" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTRIBUTIONS
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-white text-black border-b border-black/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-litestore font-black">What I Actually Did</span>
                <h2 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter mt-2 text-black">My<br />Contributions.</h2>
              </div>
              <p className="font-mono text-sm text-black/40 max-w-sm leading-relaxed">
                Shipped this as a second-year CS student. Here's the full scope   code was only part of it.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTRIBUTIONS.map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 0.07} direction="up">
                <div className={`p-7 rounded-[20px] flex flex-col gap-4 h-full border transition-all duration-500
                  ${c.accent
                    ? 'bg-litestore text-white border-transparent'
                    : 'bg-white border-black/8 hover:border-litestore/30'
                  }`}
                >
                  <div className={`w-6 h-px ${c.accent ? 'bg-white/60' : 'bg-litestore/60'}`} />
                  <h3 className={`font-mono text-xs font-black tracking-[0.25em] uppercase ${c.accent ? 'text-white' : 'text-black'}`}>
                    {c.label}
                  </h3>
                  <p className={`font-mono text-sm leading-relaxed ${c.accent ? 'text-white/80' : 'text-black/50'}`}>
                    {c.detail}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <RelatedProjects currentProjectId="litestore" />

      <footer className="w-full border-t border-border-subtle">
        <TheCloser />
      </footer>
    </div>
  );
};
