import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, MagneticButton, BackToTerminal } from '@/ui';
import { TheCloser } from '@/components/layout';

const SYSTEM_LOGS = [
  '[BUILD] next build · 30+ static routes prerendered',
  '[ANALYTICS] gtag.js loaded · NEXT_PUBLIC_GOOGLE_ANALYTICS',
  '[FORMS] axios.post → sheet.best → Google Sheets',
  '[DEPLOY] vercel deploy --prod',
  '[META] og:image · twitter:card hydrated from _document.js',
  '[UI] Aos.init({ duration: 1500 })',
  '[ROUTING] Pages Router · brand-per-file scaffold ×11',
];

const AUDIT_METRICS = [
  { label: 'LCP', value: '0.6s', sub: 'Audit Result' },
  { label: 'FCP', value: '0.4s', sub: 'Hydration Speed' },
  { label: 'Routes', value: '30+', sub: 'Static Pages' },
  { label: 'Tenants', value: '11', sub: 'Brand Routes' },
];

const BRANDS = [
  'JBL', 'Sleepycat', 'Xyxx', 'Zymrat', 'MensXP', 'Vitro', 
  'Skillmatics', 'Frootle', 'ThePantProject', 'WOW', 'The Man Company'
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
      
      <BackToTerminal />

      {/* ── CINEMATIC HUD STATUS ─────────────────────────────── */}
      <div className="fixed top-12 right-12 z-[100] hidden md:flex gap-4">
         <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">Status:</span>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#7e7ca6] animate-pulse font-black">Production_Live</span>
         </div>
      </div>

      {/* ── HERO: SOLO ENGINEERING BUILD ──────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7e7ca620_0%,transparent_70%)]" />
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center">
               <div className="inline-flex items-center gap-4 mb-8 md:mb-12 px-6 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-2xl">
                 <div className="w-2 h-2 rounded-full bg-[#7e7ca6] animate-ping" />
                 <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold text-white/60">
                   Solo Engineering Lead
                 </span>
               </div>
               
               <h1 className="font-noto text-[15vw] sm:text-7xl md:text-[13rem] font-black leading-[0.85] tracking-tighter mb-10 md:mb-12 uppercase break-words">
                 Retail as a<br/>
                 <span className="text-[#7e7ca6] relative inline-block">Service.</span>
               </h1>
               
               <p className="font-mono text-base md:text-3xl text-white/40 max-w-4xl leading-relaxed font-medium mb-16 md:mb-32 px-4 md:px-0">
                  A production Next.js platform: <span className="text-white">30+ statically prerendered routes</span>, an external Google Sheets pipeline, and a custom <span className="text-white">GA4 telemetry layer</span> — shipped solo to litestore.in.
               </p>

               <MagneticButton>
                  <a href="https://litestore.in" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white text-black font-mono text-xs font-black tracking-widest uppercase shadow-2xl block w-full md:w-auto text-center">
                     Visit Live Platform
                  </a>
               </MagneticButton>
            </div>
          </ScrollReveal>
        </div>

        {/* Technical Terminal Footer */}
        <div className="relative w-full px-6 md:px-12 z-20 mt-20 md:mt-32">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12 md:pt-16">
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
                The<br/><em className="font-playfair font-normal italic text-[#7e7ca6]">Build.</em>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 md:mb-48">
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

          {/* Technical Beats */}
          <ScrollReveal direction="up">
            <div className="flex flex-col gap-12 mb-16 md:mb-24 pt-16 border-t border-white/5">
              <div className="flex flex-col gap-4">
                 <span className="font-mono text-[#7e7ca6] text-[10px] tracking-[0.4em] uppercase font-black">Operational Highlights</span>
                 <h3 className="font-noto text-4xl md:text-6xl font-black uppercase tracking-tighter">The Technical Dossier.</h3>
              </div>
            </div>
          </ScrollReveal>

          {/* Journey Beats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOURNEY_BEATS.map((beat, i) => (
              <ScrollReveal key={beat.id} delay={i * 0.08} direction="up">
                <div className="p-8 md:p-10 rounded-[28px] border border-white/5 bg-white/[0.02] flex flex-col gap-5 hover:border-[#7e7ca6]/20 hover:bg-[#7e7ca6]/[0.03] transition-all duration-700">
                  <div className="w-8 h-px bg-[#7e7ca6]/60" />
                  <h4 className="font-mono text-xs font-black tracking-[0.3em] uppercase text-white">{beat.label}</h4>
                  <p className="font-mono text-sm text-white/40 leading-relaxed">{beat.detail}</p>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={JOURNEY_BEATS.length * 0.08} direction="up">
              <div className="p-8 md:p-10 rounded-[28px] border border-[#7e7ca6]/20 bg-[#7e7ca6]/[0.04] flex flex-col gap-5 col-span-1 md:col-span-1">
                <div className="w-8 h-px bg-[#7e7ca6]" />
                <h4 className="font-mono text-xs font-black tracking-[0.3em] uppercase text-[#7e7ca6]">The Result</h4>
                <p className="font-noto text-4xl md:text-5xl font-black tracking-tighter text-white">11<br/><span className="text-lg md:text-xl text-white/30 font-mono font-normal tracking-wide">brands shipped to production.</span></p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#7e7ca6] text-[11px] tracking-[0.5em] uppercase font-black">Architecture Stack</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                The Real<br/><span className="text-white/20">Stack.</span>
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
                Telemetry<br/><span className="text-white/20">Layer.</span>
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
                          <span className="text-white/30">{'// pages/_document.js'}</span><br/>
                          <span className="text-violet-400">{'<script'}</span> async<br/>
                          {'  src={'}<span className="text-amber-300">{'`'}</span><span className="text-emerald-300">https://www.googletagmanager.com/gtag/js</span><br/>
                          <span className="text-emerald-300">       ?id=</span><span className="text-violet-300">{'${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}'}</span><span className="text-amber-300">{'`'}</span>{'}'}<br/>
                          <span className="text-violet-400">{'/>'}</span><br/>
                          <br/>
                          <span className="text-violet-400">{'<script'}</span> dangerouslySetInnerHTML={'{{'}<br/>
                          {'  __html: '}<span className="text-amber-300">{'`'}</span><br/>
                          <span className="text-white/80">{'    window.dataLayer = window.dataLayer || [];'}</span><br/>
                          <span className="text-white/80">{'    function gtag(){ dataLayer.push(arguments); }'}</span><br/>
                          <span className="text-white/80">{'    gtag(\'js\', new Date());'}</span><br/>
                          <span className="text-white/80">{'    gtag(\'config\', '}</span><span className="text-violet-300">{'${GA_ID}'}</span><span className="text-white/80">, {'{'}</span><br/>
                          <span className="text-cyan-300">{'      page_path:'}</span> window.location.pathname,<br/>
                          <span className="text-white/80">{'    });'}</span><br/>
                          {'  '}<span className="text-amber-300">{'`'}</span><br/>
                          {'}}'} <span className="text-violet-400">{'/>'}</span>
                       </code>
                    </div>
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
                    <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Brand<br/><span className="text-[#7e7ca6]">Routes.</span></h2>
                 </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                 <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed max-w-xl">
                    Each tenant is a templated route under <code className="font-mono text-sm text-[#7e7ca6]">/spaces/&lt;mall&gt;/&lt;brand&gt;</code>, statically prerendered at build for SEO and edge-cacheable delivery. The production deploy ships 11 of these.
                 </p>
              </ScrollReveal>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BRANDS.map((brand, i) => (
                <ScrollReveal key={brand} delay={i * 0.05}>
                   <div className="px-6 py-8 md:py-12 border border-black/5 bg-black/[0.01] flex items-center justify-center text-center group hover:bg-black/5 transition-all cursor-default">
                      <span className="font-noto text-xs md:text-sm font-black uppercase tracking-widest text-black/40 group-hover:text-[#7e7ca6] transition-colors">{brand}</span>
                    </div>
                </ScrollReveal>
              ))}
           </div>
        </div>
      </section>

      <footer className="w-full border-t border-white/5">
        <TheCloser />
      </footer>
    </div>
  );
};
