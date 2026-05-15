import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, MagneticButton, BackToTerminal } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { RelatedProjects } from '@/components/projects';
import { cn } from '@/utils';

const SYSTEM_LOGS = [
  '[BUILD] next 12.2.2 · 30 routes prerendered',
  '[POST] axios → sheet.best/api/sheets/31835dc6...',
  '[GTAG] window.dataLayer.push · page_path: ${pathname}',
  '[SWIPER] modules: Navigation, Pagination, A11y, EffectFade, Autoplay',
  '[AOS] Aos.init({ duration: 1500 })',
  '[TENANT] /spaces/{orion,garuda,lulu}/{brand}',
  '[THEME] tailwind.config.js · 5 brand color tokens',
];

const AUDIT_METRICS = [
  { label: 'Routes', value: '30', sub: 'Static Pages' },
  { label: 'Tenants', value: '11', sub: 'Brand Routes' },
  { label: 'Malls', value: '3', sub: 'Mall Scopes' },
  { label: 'LOC', value: '~2K', sub: 'pages/*' },
];

type RouteLeaf = { path: string; url: string | null; size: string | null; count?: number };
type RouteNode =
  | { type: 'file'; path: string; url: string; size: string | null }
  | { type: 'group'; path: string; url: string | null; size: null; children: RouteLeaf[] };

const ROUTE_TREE: RouteNode[] = [
  { type: 'file', path: 'index.js', url: '/', size: null },
  { type: 'file', path: 'home.js', url: '/home', size: '31KB' },
  { type: 'file', path: 'contact.js', url: '/contact', size: '5KB' },
  { type: 'file', path: '404.js', url: '/404', size: '2KB' },
  {
    type: 'group', path: 'about/', url: null, size: null,
    children: [
      { path: 'company.js', url: '/about/company', size: '6KB' },
      { path: 'careers.js', url: '/about/careers', size: '3KB' },
    ],
  },
  {
    type: 'group', path: 'blog/', url: null, size: null,
    children: [
      { path: 'index.js', url: '/blog', size: '6KB' },
      { path: 'the-future-of-retail-1.js', url: '/blog/the-future-of-retail-1', size: '9KB' },
      { path: 'the-future-of-retail-2.js', url: '/blog/the-future-of-retail-2', size: '6KB' },
    ],
  },
  {
    type: 'group', path: 'faqs/', url: null, size: null,
    children: [
      { path: 'index.js', url: '/faqs', size: '5KB' },
      { path: 'general.js', url: '/faqs/general', size: '34KB' },
      { path: 'brands.js', url: '/faqs/brands', size: '38KB' },
      { path: 'landowners.js', url: '/faqs/landowners', size: '38KB' },
      { path: 'services.js', url: '/faqs/services', size: '34KB' },
    ],
  },
  {
    type: 'group', path: 'legal/', url: null, size: null,
    children: [
      { path: 'privacypolicy.js', url: '/legal/privacypolicy', size: '20KB' },
      { path: 'termsofuse.js', url: '/legal/termsofuse', size: '20KB' },
      { path: 'reports-and-accounts.js', url: '/legal/reports-and-accounts', size: '2KB' },
    ],
  },
  {
    type: 'group', path: 'spaces/', url: '/spaces', size: null,
    children: [
      { path: 'index.js', url: '/spaces', size: '10KB' },
      { path: 'orion/', url: '/spaces/orion', size: null, count: 6 },
      { path: 'garuda/', url: '/spaces/garuda', size: null, count: 4 },
      { path: 'lulu/', url: '/spaces/lulu', size: null, count: 1 },
    ],
  },
  {
    type: 'group', path: 'utilities/', url: null, size: null,
    children: [
      { path: 'success.js', url: '/utilities/success', size: '500B' },
    ],
  },
];

const BRAND_TOKENS = [
  { name: 'Primary', varName: 'purple', hex: '#7e7ca6', usedBy: 'LiteStore brand' },
  { name: 'Primary :hover', varName: 'darker-purple', hex: '#65629e', usedBy: 'CTA hover state' },
  { name: 'MensXP', varName: 'mensxp-orange', hex: '#ff5e03', usedBy: '/spaces/garuda/mensxp' },
  { name: 'Vitro', varName: 'vitro-green', hex: '#2c4b35', usedBy: '/spaces/garuda/vitro' },
  { name: 'WOW', varName: 'wow-gold', hex: '#bc9850', usedBy: '/spaces/orion/wow' },
  { name: 'Sleepycat', varName: 'sleepycat-orange', hex: '#ff6832', usedBy: '/spaces/orion/sleepycat' },
  { name: 'JBL', varName: 'jbl-orange', hex: '#ff3200', usedBy: '/spaces/orion/jbl' },
];

const TENANTS_BY_MALL = [
  {
    mall: 'Orion Mall',
    path: '/spaces/orion',
    brands: [
      { name: 'JBL', hex: '#ff3200', path: '/spaces/orion/jbl' },
      { name: 'Sleepycat', hex: '#ff6832', path: '/spaces/orion/sleepycat' },
      { name: 'The Pant Project', hex: null, path: '/spaces/orion/thepantproject' },
      { name: 'WOW', hex: '#bc9850', path: '/spaces/orion/wow' },
      { name: 'Xyxx', hex: null, path: '/spaces/orion/xyxx' },
      { name: 'Zymrat', hex: null, path: '/spaces/orion/zymrat' },
    ],
  },
  {
    mall: 'Garuda Mall',
    path: '/spaces/garuda',
    brands: [
      { name: 'MensXP', hex: '#ff5e03', path: '/spaces/garuda/mensxp' },
      { name: 'Vitro', hex: '#2c4b35', path: '/spaces/garuda/vitro' },
      { name: 'Zymrat', hex: null, path: '/spaces/garuda/zymrat' },
      { name: 'Skillmatics', hex: null, path: '/spaces/garuda/skillmatics' },
    ],
  },
  {
    mall: 'Lulu Mall',
    path: '/spaces/lulu',
    brands: [
      { name: 'Frootle', hex: null, path: '/spaces/lulu/frootle' },
    ],
  },
];

const BUSINESS_METRICS = [
  { value: '48 hrs', label: 'Brand transition time', note: 'CountUp 0 → 48', source: 'home.js:537', impressive: true },
  { value: '58%', label: 'Cheaper than conventional', note: 'CountUp 0 → 58', source: 'home.js:550', impressive: true },
  { value: '₹2.2 Cr+', label: 'GMV sold via Flexi-Stores', note: 'Static', source: 'home.js:568', impressive: true },
  { value: 'ZERO', label: 'Security Deposit', note: 'CountUp 100 → 0', source: 'home.js:497' },
  { value: 'ZERO', label: 'Lock-in (months)', note: 'CountUp 100 → 0', source: 'home.js:511' },
  { value: 'ZERO', label: 'Sunk Cost', note: 'CountUp 100 → 0', source: 'home.js:524' },
];

const STACK = [
  { label: 'Framework', value: 'Next.js 12' },
  { label: 'Styling', value: 'Tailwind + MUI' },
  { label: 'Motion', value: 'Swiper + AOS' },
  { label: 'Pipeline', value: 'Vercel + GitHub' },
];

const TELEMETRY_FACTS = [
  { label: 'Property', value: 'gtag.js (GA4)' },
  { label: 'Config', value: 'process.env' },
  { label: 'Scope', value: 'Document-level' },
  { label: 'Compliance', value: 'Disclosed in /legal' },
];

const MIGRATION_ARC = [
  {
    phase: '01',
    stack: 'HTML / CSS',
    label: 'The First Build',
    desc: 'Started with raw HTML and vanilla CSS. Got it live, got it wrong. Discovered what "maintainable" actually means.',
    color: 'text-white/30',
    border: 'border-white/10',
  },
  {
    phase: '02',
    stack: 'React CRA',
    label: 'The Rewrite',
    desc: 'Migrated to Create React App. Learned components, state, and why spaghetti JSX is still spaghetti. More Stack Overflow than sleep.',
    color: 'text-[#7e7ca6]',
    border: 'border-[#7e7ca6]/30',
  },
  {
    phase: '03',
    stack: 'Next.js 12',
    label: 'Production',
    desc: 'Rewrote again. Pages Router, SSR, next/image, static generation. This one shipped to 11 brands across 3 malls.',
    color: 'text-white',
    border: 'border-white/30',
  },
];

const JOURNEY_BEATS = [
  {
    id: 'logo',
    label: 'Brand Identity',
    detail: 'Designed the LiteStore logo and visual language from scratch — the brief was a blank page.',
  },
  {
    id: 'workspace',
    label: 'Workspace Admin',
    detail: 'Managed Google Workspace accounts for the client org. First time owning infrastructure, not just code.',
  },
  {
    id: 'client',
    label: 'Client Lead',
    detail: 'Sole point of contact for requirements, delivery, and iteration. No PM buffer — just me and the stakeholder.',
  },
  {
    id: 'prototype',
    label: 'All Versions',
    detail: 'Prototyped every version before shipping. Designs that never launched still shaped what did.',
  },
  {
    id: 'handoff',
    label: 'Hired Replacement',
    detail: 'When I left, I hired and onboarded my own replacement. First time architecting a handoff.',
  },
  {
    id: 'attribution',
    label: 'Codebase Attribution',
    detail: 'Listed in pages/about/company.js as "Justin Clarke / React Developer" — the only frontend dev on the team.',
  },
];

export const LiteStorePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLog, setActiveLog] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLog(prev => (prev + 1) % SYSTEM_LOGS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#7e7ca6]/30 overflow-x-hidden">
      <SEO
        title="LiteStore Store-as-a-Service"
        description="Production Next.js platform: 30+ statically prerendered routes, an external Google Sheets pipeline, and a custom GA4 telemetry layer. Shipped solo to litestore.in."
        path="/project/litestore"
        schemaType="SoftwareApplication"
      />

      <BackToTerminal />

      {/* ── CINEMATIC HUD STATUS ─────────────────────────────── */}
      <div
        className="fixed top-12 right-12 z-[100] hidden md:flex gap-4 items-center"
        role="status"
        aria-label="System status"
        aria-live="polite"
      >
        <div className="px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-3 shadow-2xl">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/60">Status:</span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#7e7ca6] animate-pulse font-black">Production_Live</span>
        </div>
        <a
          href="https://litestore.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-full bg-[#7e7ca6] text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all duration-300 border border-white/5"
          aria-label="Visit the live LiteStore platform"
        >
          Visit Live Platform
        </a>
      </div>

      {/* ── HERO: SOLO ENGINEERING BUILD ──────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-between px-6 md:px-24 overflow-hidden py-12 md:py-20 gap-y-12">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7e7ca620_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full flex-grow flex flex-col items-center justify-center">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-4 mb-8 md:mb-10 px-6 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-2xl">
                <div className="w-2 h-2 rounded-full bg-[#7e7ca6] animate-ping" />
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold text-white/60">
                  Solo Engineering Lead
                </span>
              </div>

              <h1 className="sr-only">LiteStore — Production Store-as-a-Service Platform with GA4 Telemetry</h1>
              <div aria-hidden="true" className="font-noto text-[15vw] sm:text-7xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-8 md:mb-10 uppercase break-words max-w-5xl mx-auto">
                Retail as a<br />
                <span className="text-[#7e7ca6] relative inline-block">Service.</span>
              </div>

              <p className="font-mono text-base md:text-2xl text-white/40 max-w-3xl leading-relaxed font-medium mb-12 md:mb-16 px-4 md:px-0">
                A production Next.js platform: <span className="text-white">30+ statically prerendered routes</span>, an external Google Sheets pipeline, and a custom <span className="text-white">GA4 telemetry layer</span> — shipped solo to litestore.in.
              </p>

              <div className="mb-0">
                <MagneticButton as="div">
                  <a href="https://litestore.in" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white text-black font-mono text-xs font-black tracking-widest uppercase shadow-2xl block w-full md:w-auto text-center">
                    Visit Live Platform
                  </a>
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Technical Terminal Footer */}
        <div className="relative w-full z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-10 md:pt-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-mono text-[10px] tracking-widest uppercase font-black text-white/20">Audit_Logs_v12.0</span>
              </div>
              <div className="font-mono text-[10px] md:text-xs text-[#7e7ca6]/80 h-6">
                <AnimatePresence mode="wait">
                  <motion.div key={activeLog} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {SYSTEM_LOGS[activeLog]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-start md:justify-end gap-8 md:gap-16">
              {AUDIT_METRICS.map(m => (
                <div key={m.label} className="flex flex-col gap-1 text-left md:text-right">
                  <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase font-black">{m.label}</span>
                  <span className="font-noto text-2xl md:text-3xl font-black text-white">{m.value}</span>
                  <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">{m.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 01: THE BUILD (DEVELOPMENT JOURNEY) ──────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#080808] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-24 md:mb-48 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.6em] uppercase font-black">Origin Story</span>
              <h2 className="font-noto text-6xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.85]">
                The<br /><em className="font-playfair font-normal italic text-[#7e7ca6]">Build.</em>
              </h2>
              <p className="font-mono text-lg md:text-2xl text-white/30 max-w-3xl leading-relaxed">
                A second-year CS student. A real client. Three complete rewrites. What follows is the unredacted version of how LiteStore came to life.
              </p>
            </div>
          </ScrollReveal>

          {/* The Engineering Arc */}
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-12 mb-16 md:mb-24">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[#7e7ca6] text-[10px] tracking-[0.4em] uppercase font-black">Strategic Execution</span>
                <h3 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter">The Engineering Arc.</h3>
              </div>
            </div>
          </ScrollReveal>

          {/* Migration Arc */}
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MIGRATION_ARC.map((phase, i) => (
                <div key={phase.phase} className={`relative p-8 md:p-10 rounded-[32px] border ${phase.border} bg-white/[0.02] flex flex-col gap-6 transition-all duration-700 hover:bg-white/[0.04]`}>
                  {i < MIGRATION_ARC.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <svg className="w-6 h-6 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-white/20 font-black">{phase.phase}</span>
                    <span className={`font-mono text-[10px] tracking-widest uppercase font-black ${phase.color}`}>{phase.stack}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className={`font-noto text-2xl font-black tracking-tight uppercase ${phase.color}`}>{phase.label}</h3>
                    <p className="font-mono text-sm text-white/40 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 02: ROUTE TREE ──────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Pages Router · Static Generation</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                The Route<br /><span className="text-white/20">Map.</span>
              </h2>
              <p className="font-mono text-base md:text-lg text-white/40 max-w-2xl leading-relaxed pt-4">
                Every <code className="text-white">.js</code> file under <code className="text-white">pages/</code> becomes a statically prerendered route at build time. Count them yourself.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="relative p-1 bg-gradient-to-br from-[#7e7ca6]/20 to-transparent rounded-[32px]">
              <div className="bg-[#0c0c0c] rounded-[31px] p-6 md:p-10 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 opacity-40">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <span className="ml-4 font-mono text-[9px] uppercase tracking-widest text-white/30 font-black">tree pages/</span>
                </div>
                <pre className="font-mono text-[11px] md:text-sm text-white/70 leading-relaxed overflow-x-auto">
                  <span className="text-[#7e7ca6] font-black">pages/</span>
                  {ROUTE_TREE.map((node, i) => {
                    const isLastTop = i === ROUTE_TREE.length - 1;
                    const topConn = isLastTop ? '└── ' : '├── ';
                    if (node.type === 'file') {
                      return (
                        <div key={node.path}>
                          <span className="text-white/30">{topConn}</span>
                          <span className="text-white">{node.path}</span>
                          {node.size && <span className="text-white/20"> · {node.size}</span>}
                          <span className="text-white/30"> → </span>
                          <span className="text-[#7e7ca6]">{node.url}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={node.path}>
                        <div>
                          <span className="text-white/30">{topConn}</span>
                          <span className="text-white font-bold">{node.path}</span>
                          {node.url && <>
                            <span className="text-white/30"> → </span>
                            <span className="text-[#7e7ca6]">{node.url}</span>
                          </>}
                        </div>
                        {node.children.map((child, j) => {
                          const childPrefix = isLastTop ? '    ' : '│   ';
                          const isLastChild = j === node.children.length - 1;
                          const childConn = isLastChild ? '└── ' : '├── ';
                          return (
                            <div key={child.path}>
                              <span className="text-white/30">{childPrefix}{childConn}</span>
                              <span className={child.path.endsWith('/') ? 'text-white font-bold' : 'text-white/80'}>{child.path}</span>
                              {child.size && <span className="text-white/20"> · {child.size}</span>}
                              {child.count !== undefined && <span className="text-white/20"> · {child.count} brand pages</span>}
                              {child.url && (
                                <>
                                  <span className="text-white/30"> → </span>
                                  <span className="text-[#7e7ca6]">{child.url}</span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </pre>
                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 md:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">Total Files</span>
                    <span className="font-noto text-2xl md:text-3xl font-black text-white">30</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">Tenant Routes</span>
                    <span className="font-noto text-2xl md:text-3xl font-black text-white">11</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">FAQ Copy</span>
                    <span className="font-noto text-2xl md:text-3xl font-black text-white">~144KB</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Architecture Stack</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                The Real<br /><span className="text-white/20">Stack.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <ScrollReveal direction="left">
              <div className="relative p-1 bg-gradient-to-br from-[#7e7ca6]/20 to-transparent rounded-[40px]">
                <div className="bg-[#0c0c0c] rounded-[39px] p-8 md:p-16 flex flex-col gap-10 md:gap-12 border border-white/5 shadow-2xl">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[#7e7ca6] text-[10px] tracking-widest uppercase font-black">Operational Data Flow</span>
                    <h3 className="font-noto text-3xl md:text-4xl font-black uppercase">Form Pipeline.</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                      <div className="w-10 h-10 rounded-lg bg-[#7e7ca6]/10 border border-[#7e7ca6]/20 flex items-center justify-center text-[#7e7ca6] font-bold font-mono group-hover:scale-110 transition-transform">JS</div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-white uppercase font-black">Next.js 12 Form</span>
                        <span className="font-mono text-[10px] text-white/40">Client-side axios POST</span>
                      </div>
                    </div>
                    <div className="flex justify-center py-2 opacity-20">
                      <svg className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-6 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 font-bold font-mono group-hover:scale-110 transition-transform">XLS</div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-white uppercase font-black">Google Sheets</span>
                        <span className="font-mono text-[10px] text-white/40">Handoff via sheet.best middleware</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-2 font-mono text-[10px] md:text-xs">
                      <span className="text-white/30 uppercase tracking-widest font-black">Live Endpoint</span>
                      <code className="text-[#7e7ca6] break-all">POST https://sheet.best/api/sheets/31835dc6-…</code>
                      <span className="text-white/30 mt-1">contact.js:19-26</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="flex flex-col gap-10 md:gap-12">
                <p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed">
                  Built for production, not theoretical benchmarks. <span className="text-white">Material UI</span> for component velocity, <span className="text-white">Swiper / AOS</span> for cinematic scroll, and <span className="text-white">next/image</span> for asset optimization across 50+ brand assets.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/5">
                  {STACK.map(stat => (
                    <div key={stat.label} className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">{stat.label}</span>
                      <span className="font-noto text-xl font-bold text-white group-hover:text-[#7e7ca6] transition-colors">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 md:p-8 rounded-2xl border border-[#7e7ca6]/20 bg-[#7e7ca6]/[0.04]">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#7e7ca6] font-black">Why sheet.best?</span>
                  <p className="font-mono text-sm md:text-base text-white/60 leading-relaxed mt-3">
                    The client needed lead capture in a Google Sheet they already owned. A backend with auth and a DB was overkill. <span className="text-white">sheet.best</span> as middleware kept the form serverless and the data in the client's hands — they could revoke access without touching code.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#080808] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Web Analytics</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                Telemetry<br /><span className="text-white/20">Layer.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-10 md:gap-12">
                <p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed">
                  Custom <span className="text-white">GA4</span> instrumentation injected at the document level. Page-load tracking, env-driven configuration, and <span className="text-white">dataLayer</span> initialization — wired without third-party plugins.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/5">
                  {TELEMETRY_FACTS.map(fact => (
                    <div key={fact.label} className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">{fact.label}</span>
                      <span className="font-noto text-base font-bold text-white">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-[#7e7ca6]/20 to-transparent overflow-hidden shadow-2xl">
                <div className="bg-[#0c0c0c] rounded-[39px] p-8 md:p-12 border border-white/5">
                  <div className="flex items-center gap-2 mb-8 opacity-40">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    <span className="ml-4 font-mono text-[9px] uppercase tracking-widest text-white/30 font-black">pages/_document.js</span>
                  </div>
                  <code className="block font-mono text-[10px] md:text-xs text-white/60 leading-relaxed overflow-x-auto whitespace-pre p-2">
                    <span className="text-white/30">{'// pages/_document.js'}</span><br />
                    <span className="text-violet-400">{'<script'}</span> async<br />
                    {'  src={'}<span className="text-amber-300">{'`'}</span><span className="text-emerald-300">https://www.googletagmanager.com/gtag/js</span><br />
                    <span className="text-emerald-300">       ?id=</span><span className="text-violet-300">{'${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}'}</span><span className="text-amber-300">{'`'}</span>{'}'}<br />
                    <span className="text-violet-400">{'/>'}</span><br />
                    <br />
                    <span className="text-violet-400">{'<script'}</span> dangerouslySetInnerHTML={'{{'}<br />
                    {'  __html: '}<span className="text-amber-300">{'`'}</span><br />
                    <span className="text-white/80">{'    window.dataLayer = window.dataLayer || [];'}</span><br />
                    <span className="text-white/80">{'    function gtag(){ dataLayer.push(arguments); }'}</span><br />
                    <span className="text-white/80">{'    gtag(\'js\', new Date());'}</span><br />
                    <span className="text-white/80">{'    gtag(\'config\', '}</span><span className="text-violet-300">{'${GA_ID}'}</span><span className="text-white/80">, {'{'}</span><br />
                    <span className="text-cyan-300">{'      page_path:'}</span> window.location.pathname,<br />
                    <span className="text-white/80">{'    });'}</span><br />
                    {'  '}<span className="text-amber-300">{'`'}</span><br />
                    {'}}'} <span className="text-violet-400">{'/>'}</span>
                  </code>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="up">
            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 border-t border-white/5">
              <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#7e7ca6] font-black">Earns You · 01</span>
                <span className="font-mono text-sm text-white font-black">Page-load tracking</span>
                <span className="font-mono text-[11px] text-white/40 leading-relaxed">window.location.pathname captured per route, no SPA-router glue needed</span>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#7e7ca6] font-black">Earns You · 02</span>
                <span className="font-mono text-sm text-white font-black">Env-driven config</span>
                <span className="font-mono text-[11px] text-white/40 leading-relaxed">NEXT_PUBLIC_GOOGLE_ANALYTICS swappable per deploy — staging vs prod isolation</span>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#7e7ca6] font-black">Earns You · 03</span>
                <span className="font-mono text-sm text-white font-black">Zero plugin surface</span>
                <span className="font-mono text-[11px] text-white/40 leading-relaxed">No @next/third-parties dependency — direct gtag.js wiring, full control</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="mt-8 p-6 md:p-8 rounded-2xl border border-[#7e7ca6]/20 bg-[#7e7ca6]/[0.04]">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#7e7ca6] font-black">2026 Retrospective</span>
              <p className="font-mono text-sm md:text-base text-white/60 leading-relaxed mt-3">
                Today I'd reach for <code className="text-white">@next/third-parties/google</code> (released 2023). This was the right call in 2022 — <code className="text-white">_document.js</code> injection was the documented pattern, and the SDK didn't exist yet.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 05: PER-TENANT THEMING ────────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Design System · One Config, 11 Brands</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                Per-Tenant<br /><span className="text-white/20">Tokens.</span>
              </h2>
              <p className="font-mono text-base md:text-lg text-white/40 max-w-2xl leading-relaxed pt-4">
                The 11 brand pages aren't copy-paste — they share a token system. Each tenant gets its own named color in <code className="text-white">tailwind.config.js</code>, consumed by per-brand templates.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <ScrollReveal direction="left">
              <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-[#7e7ca6]/20 to-transparent overflow-hidden shadow-2xl">
                <div className="bg-[#0c0c0c] rounded-[39px] p-8 md:p-10 border border-white/5">
                  <div className="flex items-center gap-2 mb-6 opacity-40">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    <span className="ml-4 font-mono text-[9px] uppercase tracking-widest text-white/30 font-black">tailwind.config.js</span>
                  </div>
                  <pre className="font-mono text-[10px] md:text-xs text-white/70 leading-relaxed overflow-x-auto whitespace-pre">
                    <span className="text-white/30">{'// tailwind.config.js'}</span><br />
                    <span className="text-violet-400">module.exports</span> = {'{'}<br />
                    {'  '}<span className="text-cyan-300">theme</span>: {'{'}<br />
                    {'    '}<span className="text-cyan-300">colors</span>: {'{'}<br />
                    {BRAND_TOKENS.map(t => (
                      <span key={t.varName}>
                        {'      '}<span className="text-amber-300">{`'${t.varName}'`}</span>: <span className="text-emerald-300">{`'${t.hex}'`}</span>,<br />
                      </span>
                    ))}
                    {'      '}<span className="text-white/30">{'// ...standard palette'}</span><br />
                    {'    '}{'}'},<br />
                    {'  '}{'}'},<br />
                    {'}'}
                  </pre>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="flex flex-col gap-3">
                {BRAND_TOKENS.map(token => (
                  <div key={token.varName} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex-shrink-0 border border-white/10 shadow-lg" style={{ backgroundColor: token.hex }} />
                    <div className="flex flex-col gap-1 min-w-0 flex-grow">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-mono text-xs md:text-sm text-white font-black uppercase tracking-wider truncate">{token.name}</span>
                        <span className="font-mono text-[10px] text-white/30 flex-shrink-0">{token.hex}</span>
                      </div>
                      <span className="font-mono text-[10px] text-white/40 truncate">
                        <code className="text-[#7e7ca6]">{token.varName}</code> · {token.usedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 04: BRAND ROUTES (MULTI-TENANT) ───────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        {/* Subtle HUD scanlines on light theme */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_3px)] bg-[size:100%_4px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 mb-16 md:mb-32 items-end">
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-8">
                <span className="font-mono text-black/30 text-[11px] tracking-[0.6em] uppercase font-black">Multi-tenant Architecture</span>
                <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Brand<br /><span className="text-[#7e7ca6]">Routes.</span></h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed max-w-xl">
                Each tenant is a templated route under <code className="font-mono text-sm text-[#7e7ca6]">/spaces/&lt;mall&gt;/&lt;brand&gt;</code>, statically prerendered at build for SEO and edge-cacheable delivery. The production deploy ships 11 of these.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TENANTS_BY_MALL.map((mall, m) => (
              <ScrollReveal key={mall.mall} delay={m * 0.1} direction="up">
                <div className="border border-black/10 bg-white p-6 md:p-8 flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-2 pb-5 border-b border-black/10">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/30 font-black">Mall {String(m + 1).padStart(2, '0')}</span>
                    <h3 className="font-noto text-2xl md:text-3xl font-black uppercase tracking-tight text-black">{mall.mall}</h3>
                    <code className="font-mono text-[10px] md:text-xs text-[#7e7ca6]">{mall.path}</code>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {mall.brands.map(brand => (
                      <li key={brand.path} className="flex items-center gap-3 group">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: brand.hex ?? '#00000020' }}
                          aria-hidden="true"
                        />
                        <span className="font-noto text-sm md:text-base font-black uppercase tracking-wider text-black/60 group-hover:text-[#7e7ca6] transition-colors">
                          {brand.name}
                        </span>
                        <code className="ml-auto font-mono text-[9px] text-black/20 hidden md:inline">/{brand.path.split('/').pop()}</code>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4 border-t border-black/5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-black/40 font-black">
                      {mall.brands.length} {mall.brands.length === 1 ? 'tenant' : 'tenants'} · prerendered at build
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 07: BUSINESS METRICS ──────────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#080808] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Production Metrics</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                What the Client<br /><span className="text-white/20">Measured.</span>
              </h2>
              <p className="font-mono text-base md:text-lg text-white/40 max-w-2xl leading-relaxed pt-4">
                The numbers in the client's pitch deck — rendered with <code className="text-white">react-countup</code> on the live home page. The engineering existed to surface these.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {BUSINESS_METRICS.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.06} direction="up">
                <div className="relative p-6 md:p-10 rounded-[28px] border border-white/5 bg-white/[0.02] flex flex-col gap-4 h-full hover:border-[#7e7ca6]/20 hover:bg-[#7e7ca6]/[0.03] transition-all duration-700">
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 font-black">Metric · {String(i + 1).padStart(2, '0')}</span>
                  <span className={cn(
                    "font-noto text-4xl md:text-6xl font-black tracking-tighter leading-none transition-colors",
                    m.impressive ? "text-[#7e7ca6] drop-shadow-[0_0_20px_rgba(126,124,166,0.3)]" : "text-white"
                  )}>
                    {m.value}
                  </span>
                  <span className="font-mono text-xs md:text-sm text-white/60 leading-relaxed">{m.label}</span>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <code className="font-mono text-[9px] text-[#7e7ca6]/60">{m.source}</code>
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{m.note}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 08: SHIPPING SOLO ─────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Beyond the Code</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                Shipping<br /><span className="text-white/20">Solo.</span>
              </h2>
              <p className="font-mono text-base md:text-lg text-white/40 max-w-2xl leading-relaxed pt-4">
                The code was one piece. Here's what shipping a real platform to a paying client at 19 actually looked like.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOURNEY_BEATS.map((beat, i) => (
              <ScrollReveal key={beat.id} delay={i * 0.08} direction="up">
                <div className="p-8 md:p-10 rounded-[28px] border border-white/5 bg-white/[0.02] flex flex-col gap-5 h-full hover:border-[#7e7ca6]/20 hover:bg-[#7e7ca6]/[0.03] transition-all duration-700">
                  <div className="w-8 h-px bg-[#7e7ca6]/60" />
                  <h4 className="font-mono text-xs font-black tracking-[0.3em] uppercase text-white">{beat.label}</h4>
                  <p className="font-mono text-sm text-white/40 leading-relaxed">{beat.detail}</p>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={JOURNEY_BEATS.length * 0.08} direction="up">
              <div className="p-8 md:p-10 rounded-[28px] border border-[#7e7ca6]/20 bg-[#7e7ca6]/[0.04] flex flex-col gap-5 h-full">
                <div className="w-8 h-px bg-[#7e7ca6]" />
                <h4 className="font-mono text-xs font-black tracking-[0.3em] uppercase text-[#7e7ca6]">The Result</h4>
                <p className="font-noto text-4xl md:text-5xl font-black tracking-tighter text-white">11<br /><span className="text-lg md:text-xl text-white/30 font-mono font-normal tracking-wide">brands shipped to production.</span></p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <RelatedProjects currentProjectId="litestore" />

      <footer className="w-full border-t border-white/5">
        <TheCloser />
      </footer>
    </div>
  );
};
