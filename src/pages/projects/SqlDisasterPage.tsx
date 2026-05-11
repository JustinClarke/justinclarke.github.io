import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal, Badge } from '@/ui';
import { TheCloser } from '@/components/layout';
import { SqlErd } from '@/components/projects/SqlErd';

const SQL_METRICS = [
  { label: 'Entities', value: '11', sub: 'Core + Junction' },
  { label: 'Context', value: 'PH', sub: 'Disaster Ops' },
  { label: 'Relationships', value: 'M:N', sub: 'Composite Keys' },
  { label: 'Syllabus', value: '11', sub: 'Query Categories' },
];

const QUERY_CATEGORIES = [
  'SELECT/WHERE/ORDER', 'INNER/LEFT/RIGHT JOIN', 'GROUP BY + HAVING', 'CTE Composition',
  'RANK / DENSE_RANK', 'NTILE Bucketing', 'IN-Subqueries', 'TIMESTAMPDIFF',
  'Composite PKs', 'CHECK Constraints', 'Junction Modeling'
];

export const SqlDisasterPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);


  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      <BackToTerminal />

      {/* ── CINEMATIC HUD STATUS ─────────────────────────────── */}
      <div className="fixed top-12 right-12 z-[100] hidden md:flex gap-8 items-center font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">
        <span>Module: DIS-REL-PH</span>
        <div className="w-px h-3 bg-white/20" />
        <span className="flex items-center gap-2 text-red-600">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          Status: Operational
        </span>
      </div>

      {/* ── HERO: THE WAR ROOM ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full text-center">
          <ScrollReveal direction="up">
            <div className="inline-flex flex-col items-center gap-6 mb-12">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-[4px] border border-red-500/30 bg-red-500/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.6em] md:tracking-[0.8em] uppercase font-black text-red-500 text-center">Relief Logistics Architecture</span>
               </div>
            </div>
            
            <h1 className="font-noto text-[15vw] sm:text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-10 md:mb-16 text-white break-words uppercase">
              DISASTER<br/>
              <span className="text-red-600 italic font-playfair font-normal pr-4 block mt-4 lowercase">response.</span>
            </h1>
            
            <p className="font-mono text-base md:text-3xl text-white/30 max-w-4xl mx-auto leading-relaxed font-medium mb-16 md:mb-24 px-4 md:px-0 text-center">
               Modeled life-saving coordination for <span className="text-white underline decoration-red-600 underline-offset-[12px] decoration-2">Philippine relief operations</span> using a 11-entity MySQL relational engine.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 px-4 md:px-0">
               <MagneticButton>
                  <a href="/resources/sql-disaster/dashboard.html" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase shadow-2xl block w-full md:w-auto text-center">
                     Open Command Dashboard
                  </a>
               </MagneticButton>
               <MagneticButton>
                  <a href="/resources/sql-disaster/drcs.pdf" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl border border-red-500/30 bg-red-500/5 text-white font-mono text-xs font-black tracking-widest uppercase block w-full md:w-auto text-center">
                     Project Specification
                  </a>
               </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION: RELATIONAL BLUEPRINT (ERD) ─────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
           <ScrollReveal direction="up">
              <div className="flex flex-col items-center text-center gap-6 mb-12 md:mb-16">
                 <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">System Architecture</span>
                 <h2 className="font-noto text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">Relational<br/><span className="text-white/20">Blueprint.</span></h2>
                 <p className="font-mono text-base md:text-lg text-white/40 max-w-2xl leading-relaxed">
                    A code-implemented visualization of the 11-entity relational engine. Toggle between logical views to explore the supply chain and personnel dispatch hierarchies.
                 </p>
              </div>

              <SqlErd />
           </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 01: SCHEMA RIGOR ───────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
           <ScrollReveal direction="left">
              <div className="flex flex-col gap-10 md:gap-12">
                 <div className="flex flex-col gap-4">
                    <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">Data Modeling</span>
                    <h2 className="font-noto text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">Schema<br/>Rigor.</h2>
                 </div>
                 <p className="font-mono text-base md:text-[18px] text-white/40 leading-relaxed">
                    Designed a robust MySQL architecture to synchronize relief efforts across 7 Philippine regions. We modeled multi-tier disasters (Typhoon Yagi, Luzon Earthquake) and their resource allocation chains.
                 </p>
                 <div className="grid grid-cols-2 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-white/5">
                    {SQL_METRICS.map(m => (
                      <div key={m.label} className="flex flex-col gap-1">
                         <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 font-black">{m.label}</span>
                         <span className="font-noto text-xl md:text-2xl font-bold">{m.value}</span>
                         <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">{m.sub}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </ScrollReveal>

           <ScrollReveal direction="right">
              <div className="relative p-1 rounded-[40px] bg-gradient-to-br from-red-500/20 to-transparent">
                 <div className="bg-[#0c0c0c] rounded-[39px] p-8 md:p-12 flex flex-col gap-8 border border-white/5 shadow-2xl">
                    <div className="font-mono text-[10px] tracking-[0.4em] uppercase font-black text-red-500/60">Entity_Registry_v1.0</div>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { t: 'M:N Modeling', d: '4 Junction tables with composite Primary Keys.' },
                         { t: 'Invariants', d: 'CHECK constraints for current_occupancy <= capacity.' },
                         { t: 'FK Integrity', d: 'Foreign Key chains across regional dispatch zones.' },
                         { t: 'Geographic Ops', d: 'NDRRMC & PRC agency agency coordination nodes.' },
                       ].map(item => (
                         <div key={item.t} className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <span className="font-mono text-xs text-white uppercase font-black block mb-2">{item.t}</span>
                            <span className="font-mono text-[10px] text-white/40 leading-relaxed">{item.d}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           {/* Section Header */}
           <ScrollReveal direction="up">
              <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
                 <span className="font-mono text-red-500 text-[11px] tracking-[0.5em] uppercase font-black">Analytical Breadth</span>
                 <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                    The Query<br/><span className="text-white/20">Syllabus.</span>
                 </h2>
              </div>
           </ScrollReveal>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
           <ScrollReveal direction="left">
              <div className="p-6 md:p-10 bg-white/[0.02] border border-white/10 rounded-[32px] font-mono text-[11px] md:text-[13px] text-red-400/80 leading-relaxed overflow-x-auto shadow-2xl">
                 <div className="flex items-center gap-2 mb-8 opacity-40">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="ml-4 text-[9px] uppercase tracking-widest font-mono font-black">shelter_stress_tier.sql</span>
                 </div>
                 <code className="block whitespace-pre">
                   <span className="text-white/40">WITH</span> ShelterMetrics <span className="text-white/40">AS (</span><br/>
                   &nbsp;&nbsp;<span className="text-white">SELECT</span> name, capacity,<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;(occupancy / capacity) * 100 <span className="text-white">AS</span> stress_pct<br/>
                   &nbsp;&nbsp;<span className="text-white">FROM</span> Shelters<br/>
                   <span className="text-white/40">)</span><br/>
                   <span className="text-white">SELECT</span> name, stress_pct,<br/>
                   &nbsp;&nbsp;<span className="text-white">NTILE</span>(3) <span className="text-white">OVER</span> (<span className="text-white">ORDER BY</span> stress_pct <span className="text-white">DESC</span>) <span className="text-white">AS</span> stress_tier<br/>
                   <span className="text-white">FROM</span> ShelterMetrics;<br/>
                   <br/>
                   <span className="text-white/20">-- Identifies high-risk evacuation zones</span>
                 </code>
              </div>
           </ScrollReveal>

           <ScrollReveal direction="right">
              <div className="flex flex-col gap-10 md:gap-12">
                 <p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed">
                    A code-implemented visualization of the 11-entity relational engine. Toggle between logical views to explore the supply chain and personnel dispatch hierarchies.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUERY_CATEGORIES.map(cat => (
                      <div key={cat} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                         <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest font-black">{cat}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </ScrollReveal>
          </div>
         </div>
      </section>

      {/* ── SECTION 03: LIVE COMMAND DASHBOARD ───────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
           <ScrollReveal direction="up">
              <div className="flex flex-col items-center text-center gap-8 md:gap-12 mb-16 md:mb-24 px-4 md:px-0">
                 <span className="font-mono text-black/30 text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] uppercase font-black text-center">Interactive Command Interface</span>
                 <h2 className="font-noto text-4xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] text-center">The Dashboard.</h2>
                 <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed max-w-2xl text-center">
                    A comprehensive web interface for relief coordination, featuring 7 color-coded entity types, search indexing, and real-time logistics legends.
                 </p>
              </div>

              <div className="relative w-full aspect-video rounded-[32px] md:rounded-[40px] bg-black overflow-hidden shadow-2xl group">
                 <div className="absolute inset-0 bg-[#0c0c0c] flex flex-col">
                    <div className="h-10 md:h-12 bg-white/5 border-b border-white/5 flex items-center px-6 md:px-8 justify-between">
                       <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                       </div>
                       <div className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] uppercase font-black text-white/20 truncate ml-4">ROOT@COORD_DASHBOARD ~ /LIVE_SESSION</div>
                    </div>
                    <div className="flex-grow flex items-center justify-center relative overflow-hidden p-6">
                       <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_3px)] bg-[size:100%_4px]" />
                       <div className="flex flex-col items-center gap-6 md:gap-8 relative z-10 text-center">
                          <div className="font-noto text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Philippine Disaster Registry</div>
                          <MagneticButton>
                             <a href="/resources/sql-disaster/dashboard.html" target="_blank" className="px-8 md:px-12 py-4 md:py-5 bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase rounded-full shadow-[0_0_50px_rgba(220,38,38,0.4)] block w-full md:w-auto">
                                Launch Command Dashboard
                             </a>
                          </MagneticButton>
                       </div>
                    </div>
                 </div>
              </div>
           </ScrollReveal>
        </div>
      </section>

      <footer className="w-full border-t border-white/5">
        <TheCloser />
      </footer>
    </div>
  );
};
