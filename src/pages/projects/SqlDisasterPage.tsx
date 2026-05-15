import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal, Badge } from '@/ui';
import { TheCloser, SEO } from '@/components/layout';
import { SqlErd } from '@/components/projects/SqlErd';
import { RelatedProjects } from '@/components/projects';

// ─── Data ────────────────────────────────────────────────────────────────────

const SQL_METRICS = [
  { label: 'Entities',      value: '11',  sub: 'Core + Junction' },
  { label: 'Context',       value: 'PH',  sub: 'Disaster Ops' },
  { label: 'Relationships', value: 'M:N', sub: 'Composite Keys' },
  { label: 'Syllabus',      value: '11',  sub: 'Query Categories' },
];

const QUERY_CATEGORIES = [
  'SELECT/WHERE/ORDER', 'INNER/LEFT/RIGHT JOIN', 'GROUP BY + HAVING', 'CTE Composition',
  'RANK / DENSE_RANK', 'NTILE Bucketing', 'IN-Subqueries', 'TIMESTAMPDIFF',
  'Composite PKs', 'CHECK Constraints', 'Junction Modeling',
];

const ENTITY_REGISTRY = [
  { id: 'disaster',  label: 'DISASTER',         count: 5,  color: '#ff3c3c' },
  { id: 'region',    label: 'REGION',            count: 7,  color: '#ffaa2e' },
  { id: 'agency',    label: 'AGENCY',            count: 5,  color: '#3b8eff' },
  { id: 'team',      label: 'RESPONSE_TEAM',     count: 10, color: '#00e5cc' },
  { id: 'volunteer', label: 'VOLUNTEER',         count: 15, color: '#c06ef0' },
  { id: 'shelter',   label: 'SHELTER',           count: 9,  color: '#2dce68' },
  { id: 'supply',    label: 'SUPPLY',            count: 10, color: '#ff6a25' },
];

const SCHEMA_FEATURES = [
  { t: 'M:N Modeling',    d: '4 junction tables with composite Primary Keys enforcing relational integrity across the volunteer-to-team and supply-to-region chains.' },
  { t: 'Check Invariants',d: 'CHECK constraints enforce current_occupancy ≤ capacity across all 9 shelter nodes - prevents logical data violations at the schema level.' },
  { t: 'FK Integrity',    d: 'Foreign Key chains span regional dispatch zones: Agency → Team → Disaster → Region → Shelter, ensuring cascading constraint coverage.' },
  { t: 'Geographic Ops',  d: 'NDRRMC and PRC agency coordination nodes model real Philippine relief hierarchy across 7 affected regions and 5 concurrent disaster events.' },
];

const ENGINE_STATS = [
  { value: '1,603', label: 'Lines of code', sub: 'Vanilla JS · no framework' },
  { value: '61',    label: 'Graph nodes',   sub: 'D3 v7 force simulation' },
  { value: '71',    label: 'Edges',         sub: '6 relationship types' },
  { value: '4',     label: 'Alert tiers',   sub: 'Critical · Warning · Info' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const SqlDisasterPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ticker, setTicker] = useState(0);

  // Ticker - cycles through entity counts for the HUD
  useEffect(() => {
    const id = setInterval(() => setTicker(t => (t + 1) % ENTITY_REGISTRY.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden"
    >
      <SEO
        title="SQL Disaster Response System"
        description="SQL case study: an 11-entity relational database modeling Philippine disaster relief logistics - composite keys, NTILE risk tiers, and a live D3 command dashboard. Full ERD inside."
        path="/project/sql-disaster"
        schemaType="CreativeWork"
      />

      <BackToTerminal />

      {/* ── CINEMATIC HUD ──────────────────────────────────────────────── */}
      <div
        className="fixed top-12 right-12 z-[100] hidden md:flex gap-4 items-center"
        role="status"
        aria-label="System status"
        aria-live="polite"
      >
        <div className="px-5 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl flex items-center gap-5 shadow-2xl">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/60 font-bold">
            {ENTITY_REGISTRY[ticker].label}
            <span style={{ color: ENTITY_REGISTRY[ticker].color }} className="ml-2">
              {ENTITY_REGISTRY[ticker].count}
            </span>
          </span>
          <div className="w-px h-3 bg-white/20" aria-hidden="true" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">Module: DIS-REL-PH</span>
          <div className="w-px h-3 bg-white/20" aria-hidden="true" />
          <span className="flex items-center gap-2 text-red-500 font-mono text-[9px] tracking-[0.3em] uppercase font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse inline-block" aria-hidden="true" />
            OPERATIONAL
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 md:px-24 overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.06)_0%,transparent_65%)]" />
          {/* scanline */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl w-full text-center">
          <ScrollReveal direction="up">

            {/* Status pill */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-[4px] border border-red-500/30 bg-red-500/10 backdrop-blur-md mb-10">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.6em] uppercase font-black text-red-500">
                Relief Logistics Architecture
              </span>
            </div>

            {/* Hero type */}
            <h1 className="sr-only">SQL Disaster Response System - Philippine Relief Logistics Database</h1>
            <div
              aria-hidden="true"
              className="font-noto text-[18vw] sm:text-8xl md:text-[10rem] font-black leading-none tracking-tighter mb-6 uppercase flex flex-col items-center"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
                DISASTER
              </span>
              <span className="text-red-600 italic font-playfair font-normal mt-[-0.4em] lowercase drop-shadow-[0_0_60px_rgba(220,38,38,0.7)]">
                response.
              </span>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-48 bg-red-600/8 blur-[140px] pointer-events-none -rotate-6" />
            </div>

            {/* Descriptor */}
            <p className="font-mono text-base md:text-2xl text-white/25 max-w-3xl mx-auto leading-relaxed mb-10 px-4">
              Modeled life-saving coordination for{' '}
              <span className="text-white/70 underline decoration-red-600 underline-offset-[10px] decoration-[1.5px]">
                Philippine relief operations
              </span>{' '}
              using an 11-entity MySQL relational engine.
            </p>

            {/* Inline tech tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {['MySQL', 'D3.js v7', 'Vanilla JS', 'Force Graph', 'CTE + Window Functions'].map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-widest uppercase px-3 py-1 border border-white/10 rounded-full text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton as="div">
                <a
                  href="/resources/sql-disaster/dashboard.html"
                  target="_blank"
                  className="px-8 md:px-10 py-4 rounded-2xl bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_40px_rgba(220,38,38,0.35)] block"
                >
                  Open Command Dashboard
                </a>
              </MagneticButton>
              <MagneticButton as="div">
                <a
                  href="/resources/sql-disaster/drcs.pdf"
                  target="_blank"
                  className="px-8 md:px-10 py-4 rounded-2xl border border-red-500/30 bg-red-500/5 text-white font-mono text-xs font-black tracking-widest uppercase block"
                >
                  Project Specification
                </a>
              </MagneticButton>
            </div>

          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ENTITY STAT RAIL
      ════════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/5 bg-[#080808] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-4 md:grid-cols-7 divide-x divide-white/5">
          {ENTITY_REGISTRY.map(entity => (
            <div key={entity.id} className="flex flex-col items-center justify-center py-6 px-4 gap-1.5 group">
              <span
                className="font-mono text-2xl md:text-3xl font-black transition-all duration-300"
                style={{ color: entity.color }}
              >
                {entity.count}
              </span>
              <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/25 group-hover:text-white/50 transition-colors">
                {entity.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RELATIONAL BLUEPRINT (ERD)
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.08)_0%,transparent_60%)]" />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center gap-5 mb-16 md:mb-20">
              <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">System Architecture</span>
              <h2 className="font-noto text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                Relational<br />
                <span className="text-white/15">Blueprint.</span>
              </h2>
              <p className="font-mono text-sm md:text-base text-white/35 max-w-xl leading-relaxed">
                A code-implemented visualization of the 11-entity relational engine.
                Toggle entity layers and explore supply chain and personnel dispatch hierarchies.
              </p>
            </div>

            {/* ERD legend strip */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12">
              {ENTITY_REGISTRY.map(e => (
                <div key={e.id} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-white/30">{e.label}</span>
                </div>
              ))}
            </div>

            <SqlErd />

            {/* ERD metadata strip */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {SQL_METRICS.map(m => (
                <div key={m.label} className="p-5 border border-white/5 rounded-2xl bg-white/[0.02] flex flex-col gap-1">
                  <span className="font-mono text-2xl md:text-3xl font-black text-white">{m.value}</span>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-white/30">{m.label}</span>
                  <span className="font-mono text-[9px] text-white/20">{m.sub}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SCHEMA RIGOR
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-28 items-center">

          {/* Left: header + description */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">Data Modeling</span>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Schema<br />
                <span className="text-white/15">Rigor.</span>
              </h2>
              <p className="font-mono text-sm md:text-base text-white/35 leading-relaxed max-w-md">
                Designed a robust MySQL architecture to synchronize relief efforts across 7 Philippine regions.
                Modeled multi-tier disasters - Typhoon Yagi, Luzon Earthquake, Mt. Kanlaon - and their full
                resource allocation chains.
              </p>

              {/* Impact numbers */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { v: '7',  l: 'Regions' },
                  { v: '47', l: 'Queries' },
                  { v: '<200ms', l: 'Avg latency' },
                ].map(stat => (
                  <div key={stat.l} className="flex flex-col gap-1">
                    <span className="font-mono text-2xl font-black text-red-500">{stat.v}</span>
                    <span className="font-mono text-[9px] tracking-widest uppercase text-white/25">{stat.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: feature cards */}
          <ScrollReveal direction="right">
            <div className="relative p-px rounded-[36px] bg-gradient-to-br from-red-500/20 via-white/5 to-transparent">
              <div className="bg-[#0c0c0c] rounded-[35px] p-8 md:p-10 flex flex-col gap-4 border border-white/5">
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase font-black text-red-500/50 mb-2">
                  ENTITY_REGISTRY_V1.0
                </div>
                {SCHEMA_FEATURES.map(item => (
                  <div
                    key={item.t}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="font-mono text-[10px] text-white uppercase font-black tracking-widest">{item.t}</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/35 leading-relaxed">{item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          THE D3 ENGINE - new section
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(59,142,255,0.06)_0%,transparent_60%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center gap-5 mb-16">
              <span className="font-mono text-[#3b8eff] text-[11px] tracking-[0.5em] uppercase font-black">Visualization Engine</span>
              <h2 className="font-noto text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                The D3<br />
                <span className="text-white/15">Engine.</span>
              </h2>
              <p className="font-mono text-sm md:text-base text-white/35 max-w-xl leading-relaxed">
                The interactive dashboard is 1,603 lines of handwritten Vanilla JS - no React, no framework.
                Built on D3 v7 force simulation with custom physics, multi-layer filtering, and a programmatic alert system.
              </p>
            </div>
          </ScrollReveal>

          {/* Engine stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {ENGINE_STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} direction="up">
                <div className="p-6 md:p-8 border border-white/5 rounded-2xl bg-white/[0.02] flex flex-col gap-2 hover:border-[#3b8eff]/20 hover:bg-[#3b8eff]/5 transition-all duration-300 group">
                  <span className="font-mono text-3xl md:text-4xl font-black text-[#3b8eff] group-hover:text-[#6aabff] transition-colors">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">{stat.label}</span>
                  <span className="font-mono text-[9px] text-white/20">{stat.sub}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Feature list */}
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '◉', title: 'Force Simulation', desc: 'D3 force-directed graph with custom charge, link distance, and collision physics tuned for 61-node readability.' },
                { icon: '◈', title: 'Programmatic Alerts', desc: 'Alert panel generated dynamically from node data - shelter load thresholds, active disaster states, standby team detection.' },
                { icon: '◎', title: 'Multi-layer Filtering', desc: 'Entity type toggling, full-text node search, edge hover inspection, pin/unpin state, and keyboard controls.' },
              ].map(f => (
                <div key={f.title} className="p-6 border border-white/5 rounded-2xl bg-white/[0.02] hover:border-[#3b8eff]/15 transition-all duration-300">
                  <div className="font-mono text-xl text-[#3b8eff] mb-3">{f.icon}</div>
                  <div className="font-mono text-[11px] tracking-widest uppercase font-black text-white mb-2">{f.title}</div>
                  <div className="font-mono text-[10px] text-white/35 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          QUERY SYLLABUS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 gap-5">
              <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">Analytical Breadth</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                The Query<br />
                <span className="text-white/15">Syllabus.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Code block */}
            <ScrollReveal direction="left">
              <div className="p-6 md:p-10 bg-[#0c0c0c] border border-white/8 rounded-[28px] font-mono text-[11px] md:text-[13px] leading-relaxed overflow-x-auto shadow-2xl">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="ml-4 text-[9px] uppercase tracking-widest font-black text-white/20">
                    shelter_stress_tier.sql
                  </span>
                </div>
                <code className="block whitespace-pre text-red-400/70">
                  <span className="text-white/35">WITH</span>{' '}ShelterMetrics{' '}<span className="text-white/35">AS (</span>{'\n'}
                  {'  '}<span className="text-white/80">SELECT</span> name, capacity,{'\n'}
                  {'    '}(occupancy / capacity) * 100{' '}<span className="text-white/80">AS</span> stress_pct{'\n'}
                  {'  '}<span className="text-white/80">FROM</span> Shelters{'\n'}
                  <span className="text-white/35">)</span>{'\n'}
                  <span className="text-white/80">SELECT</span> name, stress_pct,{'\n'}
                  {'  '}<span className="text-white/80">NTILE</span>(3){' '}
                  <span className="text-white/80">OVER</span> (<span className="text-white/80">ORDER BY</span> stress_pct{' '}
                  <span className="text-white/80">DESC</span>){' '}<span className="text-white/80">AS</span> stress_tier{'\n'}
                  <span className="text-white/80">FROM</span> ShelterMetrics;{'\n'}
                  {'\n'}
                  <span className="text-white/20">{'-- '}Identifies high-risk evacuation zones</span>{'\n'}
                  <span className="text-white/20">{'-- '}Shelter 8 Bicol: 99% · Shelter 1 Manila: 96%</span>
                </code>
              </div>
            </ScrollReveal>

            {/* Categories */}
            <ScrollReveal direction="right">
              <div className="flex flex-col gap-8">
                <p className="font-mono text-base md:text-lg text-white/30 leading-relaxed">
                  11 query categories covering the full analytical spectrum -
                  from basic retrieval to window functions, CTEs, and composite key modeling.
                  Each category applied to real Philippine disaster data.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUERY_CATEGORIES.map((cat, i) => (
                    <div key={cat} className="flex items-center gap-3 group">
                      <span className="font-mono text-[8px] text-red-600/50 w-4 flex-shrink-0 group-hover:text-red-400 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-black group-hover:text-white/60 transition-colors">
                        {cat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          LIVE COMMAND DASHBOARD CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-6 md:px-12 bg-white text-black relative overflow-hidden">

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center gap-8 md:gap-10 mb-16 md:mb-20">
              <span className="font-mono text-black/25 text-[10px] tracking-[0.6em] uppercase font-black">
                Interactive Command Interface
              </span>
              <h2 className="font-noto text-5xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.85]">
                The<br />Dashboard.
              </h2>
              <p className="font-mono text-base md:text-lg text-black/40 leading-relaxed max-w-2xl">
                7 color-coded entity types. Full-text node search. Edge inspection on hover.
                Programmatic alert system. Pin/unpin. Zoom. Reset. All in a single HTML file.
              </p>
            </div>

            {/* Mock terminal preview */}
            <div className="relative w-full max-w-4xl mx-auto rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.25)] bg-[#05080f] border border-white/10">

              {/* Browser chrome */}
              <div className="h-10 bg-[#0b1120] border-b border-white/5 flex items-center px-5 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                  <div className="w-3 h-3 rounded-full bg-green-400/40" />
                </div>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/15">
                  ROOT@COORD_DASHBOARD ~ /LIVE_SESSION
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[8px] text-red-500/60 uppercase tracking-widest">MT. KANLAON ACTIVE</span>
                </div>
              </div>

              {/* Stat bar */}
              <div className="grid grid-cols-7 border-b border-white/5">
                {ENTITY_REGISTRY.map(e => (
                  <div key={e.id} className="flex flex-col items-center py-3 gap-0.5">
                    <span className="font-mono text-base font-black" style={{ color: e.color }}>{e.count}</span>
                    <span className="font-mono text-[7px] tracking-widest uppercase text-white/20">{e.id}</span>
                  </div>
                ))}
              </div>

              {/* Body */}
              <div className="flex items-center justify-center py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_3px)] bg-[size:100%_4px]" />
                <div className="flex flex-col items-center gap-6 z-10 text-center px-6">
                  <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/20 mb-2">
                    PHILIPPINE DISASTER REGISTRY · 61 NODES · 71 LINKS
                  </div>
                  <MagneticButton>
                    <a
                      href="/resources/sql-disaster/dashboard.html"
                      target="_blank"
                      className="px-10 md:px-14 py-4 md:py-5 bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase rounded-full shadow-[0_0_60px_rgba(220,38,38,0.5)] block"
                    >
                      Launch Command Dashboard
                    </a>
                  </MagneticButton>
                  <span className="font-mono text-[9px] text-white/15 uppercase tracking-widest">
                    Click · Inspect · Pin · Filter · Zoom
                  </span>
                </div>
              </div>
            </div>

          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          IMPACT RAIL
      ════════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {[
            { v: '11',    l: 'Entities',          d: 'core + junction tables' },
            { v: '47',    l: 'Queries',            d: '11 analytical categories' },
            { v: '1,603', l: 'Lines of code',      d: 'vanilla JS, no framework' },
            { v: '<200ms',l: 'Avg query latency',  d: 'indexed relational design' },
          ].map(stat => (
            <div key={stat.l} className="flex flex-col items-center justify-center py-10 px-4 gap-1.5 text-center">
              <span className="font-mono text-2xl md:text-3xl font-black text-white">{stat.v}</span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-white/30">{stat.l}</span>
              <span className="font-mono text-[8px] text-white/15">{stat.d}</span>
            </div>
          ))}
        </div>
      </div>

      <RelatedProjects currentProjectId="sql-disaster" />

      <footer className="w-full border-t border-white/5">
        <TheCloser />
      </footer>
    </div>
  );
};
