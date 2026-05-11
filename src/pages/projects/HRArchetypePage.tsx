import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal, SpotlightCard, Badge } from '@/ui';
import { TheCloser } from '@/components/layout';

const DATA_STREAMS = [
  'PIPELINE: SENTIMENT → ARCHETYPE → ACTION',
  'RETENTION_WINDOW: 90_DAY_PREDICTION',
  'ACTIVE_NODES: 8_ARCHETYPES',
  'TRUST_LAYER: CONSENT_MONITORING_LIVE',
  'AUTH: EXEC_DASHBOARD_LIVE',
];

const ARCHETYPES = [
  { name: 'Purposeful Driver', tag: 'High+Safe+Intrinsic', desc: 'The backbone. High performance, zero flight risk, intrinsically powered.' },
  { name: 'Competitive Anchor', tag: 'High+Safe+Extrinsic', desc: 'Predictable, stable output. Reward-dependent retention.' },
  { name: 'Frustrated Visionary', tag: 'High+AtRisk+Intrinsic', desc: 'High value but grinding against friction. Autonomy mismatch.' },
  { name: 'Undervalued Achiever', tag: 'High+AtRisk+Extrinsic', desc: 'Output king with a reward gap. Window for retention is closing.' },
  { name: 'Dormant Potential', tag: 'Low+Safe+Intrinsic', desc: 'Stable but underperforming. Environment or role mismatch.' },
  { name: 'Quiet Coaster', tag: 'Low+Safe+Extrinsic', desc: 'Presenteeism risk. Needs environmental/incentive shift.' },
  { name: 'Burning Idealist', tag: 'Low+AtRisk+Intrinsic', desc: 'Burnout trajectory. Meaning remains, but energy is eroded.' },
  { name: 'Exit Risk', tag: 'Low+AtRisk+Extrinsic', desc: 'Priority intervention. Immediate reward/fix needed to retain.' },
];

const QUANT_SCORES = [
  { label: 'Engagement Index', value: '7.2', desc: 'Real-time psychological investment metric.' },
  { label: 'Attrition Risk', value: '14%', desc: 'Derived probability of exit within 90 days.' },
  { label: 'Motivation Score', value: 'Intrinsic', desc: 'Categorical driver: Meaning vs. Reward.' },
  { label: 'Confidence Score', value: '88%', desc: 'Self-reported capability vs. goal difficulty.' },
  { label: 'Overload Index', value: '2.4', desc: 'Wait-time to output ratio. Burnout predictor.' },
  { label: 'Burnout Risk', value: 'Low', desc: 'Aggregated sentiment from Q10/Q11 inputs.' },
  { label: 'Stability Index', value: 'Optimal', desc: 'Manager-Employee trust alignment score.' },
];

const DASHBOARD_PANELS = [
  { id: 'overview', title: 'Executive Overview', desc: 'Cohort snapshots and critical findings.' },
  { id: 'archetype', title: 'Archetype Analysis', desc: '8-way taxonomy breakdown with retention windows.' },
  { id: 'risk', title: 'Risk Intelligence', desc: 'Attrition intent mapping and silent burnout alerts.' },
  { id: 'trust', title: 'Trust & Consent', desc: 'Ethical dimension monitoring tracking discomfort.' },
];

export const HRArchetypePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStream, setActiveStream] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStream(prev => (prev + 1) % DATA_STREAMS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 overflow-x-hidden">
      
      <BackToTerminal />

      {/* ── CINEMATIC HUD STATUS ─────────────────────────────── */}
      <div className="fixed top-12 right-12 z-[100] hidden md:flex gap-4">
         <div className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40 font-black">Sync_Status: 40ms_Live</span>
         </div>
      </div>

      {/* ── HERO: THE INTELLIGENCE ENGINE ───────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 md:pb-48 px-6 overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center">
               <div className="inline-flex items-center gap-4 mb-8 md:mb-12 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl">
                 <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase font-black text-white/60">
                   Workforce Retention Intelligence
                 </span>
               </div>
               
               <h1 className="font-noto text-[15vw] sm:text-7xl md:text-[14rem] font-black leading-[0.75] tracking-tighter mb-10 md:mb-16 uppercase break-words">
                 Archetype<br/>
                 <span className="text-white relative italic font-playfair lowercase font-normal">System.</span>
               </h1>
               
               <p className="font-mono text-base md:text-3xl text-white/40 max-w-4xl leading-relaxed font-medium mb-16 md:mb-24 px-4 md:px-0 mx-auto text-center">
                  Transforming workforce sentiment into <span className="text-white font-black italic">retention decisions</span>.<br/>
                  A diagnostic platform that classifies employee risk across 8 behavioral archetypes — so HR leads act before attrition becomes visible.
               </p>

               <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-24 md:mb-32 w-full px-4 md:px-0">
                  <MagneticButton>
                     <a href="https://yourarchetype.vercel.app/dashboard" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white text-black font-mono text-xs font-black tracking-widest uppercase shadow-2xl block w-full md:w-auto text-center">
                        Launch Dashboard
                     </a>
                  </MagneticButton>
                  <MagneticButton>
                     <a href="https://yourarchetype.vercel.app/" target="_blank" className="px-8 md:px-10 py-4 md:py-5 rounded-2xl border border-white/20 bg-white/5 text-white font-mono text-xs font-black tracking-widest uppercase backdrop-blur-xl block w-full md:w-auto text-center">
                        Take the Diagnostic
                     </a>
                  </MagneticButton>
               </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Live System Tape */}
        <div className="relative w-full px-6 md:px-12 z-20 overflow-hidden">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/10 pt-12 md:pt-16 gap-12">
              <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono text-[10px] tracking-widest uppercase font-black text-white/20">System_Runtime_Logs</span>
                 </div>
                 <div className="font-mono text-xs text-white/40 h-6 flex items-center">
                    <AnimatePresence mode="wait">
                       <motion.span
                          key={activeStream}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                       >
                          {DATA_STREAMS[activeStream]}
                       </motion.span>
                    </AnimatePresence>
                 </div>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-8 md:gap-16">
                 {QUANT_SCORES.slice(0, 3).map(stat => (
                    <div key={stat.label} className="flex flex-col gap-1 text-left md:text-right">
                       <span className="font-mono text-[9px] text-white/20 uppercase font-black tracking-widest">{stat.label}</span>
                       <span className="font-noto text-2xl md:text-3xl font-black text-white">{stat.value}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 01: THE 8-ARCHETYPE TAXONOMY ─────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 mb-16 md:mb-32 items-end">
              <ScrollReveal direction="left">
                 <div className="flex flex-col gap-8">
                    <span className="font-mono text-black/30 text-[11px] tracking-[0.6em] uppercase font-black">Behavioral Science</span>
                    <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">The Taxonomy<br/><span className="text-black/20 italic">of Intent.</span></h2>
                 </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                 <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed max-w-xl">
                    A 3-axis behavioral model mapping <span className="text-black font-black italic">Engagement × Retention Risk × Motivation Driver</span>. We don't just segment users; we predict trajectories.
                 </p>
              </ScrollReveal>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ARCHETYPES.map((arch, i) => (
                <ScrollReveal key={arch.name} delay={i * 0.05}>
                   <div className="p-6 md:p-8 border border-black/5 bg-black/[0.01] hover:bg-black/[0.03] transition-colors h-full flex flex-col group">
                      <span className="font-mono text-[9px] uppercase font-black text-black/20 mb-6 group-hover:text-[#7e7ca6] transition-colors">{arch.tag}</span>
                      <h3 className="font-noto text-xl md:text-2xl font-black uppercase mb-4 leading-none">{arch.name}</h3>
                      <p className="font-mono text-xs text-black/40 leading-relaxed">{arch.desc}</p>
                   </div>
                </ScrollReveal>
              ))}
           </div>
        </div>
      </section>

      {/* ── SECTION 02: THE QUANTITATIVE ENGINE ───────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
           <ScrollReveal direction="left">
              <div className="flex flex-col gap-10 md:gap-12">
                 <div className="flex flex-col gap-6">
                    <span className="font-mono text-white/20 text-[11px] tracking-[0.6em] uppercase font-black">Methodological Rigor</span>
                    <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Engine<br/><span className="text-white/40">Scoring.</span></h2>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {QUANT_SCORES.map(score => (
                      <div key={score.label} className="border-l border-white/10 pl-6 py-2">
                         <span className="font-mono text-[9px] uppercase font-black text-white/20 block mb-1">{score.label}</span>
                         <span className="font-noto text-xl md:text-2xl font-bold block mb-1">{score.value}</span>
                         <span className="font-mono text-[10px] text-white/40 block leading-tight">{score.desc}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </ScrollReveal>

           <ScrollReveal direction="right">
              <div className="relative p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-white text-black overflow-hidden group shadow-2xl">
                 <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex items-center justify-between border-b border-black/5 pb-8">
                       <h4 className="font-noto text-lg md:text-xl font-black uppercase">Gemini AI Analysis</h4>
                       <Badge className="bg-black text-white">Live Insights</Badge>
                    </div>
                    <div className="space-y-6">
                       <p className="font-mono text-sm font-medium italic leading-relaxed">
                          "Based on the aggregate Stability Index, the 'Frustrated Visionary' cohort shows a 22% increase in burnout risk correlated with workload telemetry. Recommendation: Deploy autonomy-first intervention."
                       </p>
                       <div className="flex flex-col gap-2 pt-6 border-t border-black/5">
                          <div className="flex justify-between font-mono text-[10px] font-black uppercase">
                             <span>Intervention Lead Time</span>
                             <span>90 Days</span>
                          </div>
                          <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} className="h-full bg-black" />
                          </div>
                           <p className="font-mono text-[9px] text-black/40 uppercase font-bold mt-2 leading-tight">Window before predicted exit — designed for proactive retention.</p>
                        </div>
                    </div>
                 </div>
              </div>
           </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 03: THE 7-PANEL DASHBOARD ──────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center gap-8 md:gap-12 mb-16 md:mb-32 px-4 md:px-0">
               <span className="font-mono text-black/30 text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.6em] uppercase font-black text-center">Engineering Artifact</span>
               <h2 className="font-noto text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none text-center">The Dashboard.</h2>
               <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed max-w-2xl text-center">
                  A comprehensive 7-panel command center powered by Firestore <span className="text-black font-black italic">onSnapshot</span> listeners for sub-40ms reactive updates.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {DASHBOARD_PANELS.map((panel, i) => (
                 <ScrollReveal key={panel.id} delay={i * 0.1}>
                    <div className="group relative aspect-[4/5] rounded-[24px] md:rounded-[32px] bg-black text-white p-8 md:p-10 overflow-hidden flex flex-col justify-between shadow-2xl transition-transform hover:-translate-y-2 duration-700">
                       <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                          <div className="absolute inset-0 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:20px_20px]" />
                       </div>
                       <div className="relative z-10">
                          <span className="font-mono text-[9px] uppercase font-black text-white/40 block mb-4">Panel_0{i+1}</span>
                          <h3 className="font-noto text-2xl md:text-3xl font-black uppercase leading-tight">{panel.title}</h3>
                       </div>
                       <p className="font-mono text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{panel.desc}</p>
                    </div>
                 </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 04: ETHICAL DIMENSION (TRUST) ──────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden border-t border-white/5">
         <div className="max-w-4xl mx-auto">
            <ScrollReveal>
               <div className="flex flex-col items-center text-center gap-10 md:gap-12">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
                     <svg className="w-8 h-8 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">The Trust<br/><span className="text-white/20">Dimension.</span></h2>
                  <p className="font-mono text-lg md:text-xl text-white/40 leading-relaxed px-4 md:px-0">
                     Most workforce tools measure performance. <span className="text-white">This one measures trust.</span> The 13th diagnostic dimension captures how employees feel about being monitored — giving organisations an ethical guardrail that prevents surveillance-driven attrition from compounding the problem it was meant to solve.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-12 w-full pt-16 md:pt-24 border-t border-white/10 px-4 md:px-0">
                     <div>
                        <h4 className="font-noto font-black uppercase text-sm mb-4">Ethical Analytics</h4>
                        <p className="font-mono text-xs text-white/30 leading-relaxed">Modeling tracking discomfort as a core diagnostic metric to prevent surveillance-driven attrition.</p>
                     </div>
                     <div>
                        <h4 className="font-noto font-black uppercase text-sm mb-4">Presentation Ready</h4>
                        <p className="font-mono text-xs text-white/30 leading-relaxed">Integrated Presentation Mode with arrow-key navigation and automated AI notes export for executive briefings.</p>
                     </div>
                  </div>
               </div>
            </ScrollReveal>
         </div>
      </section>

      {/* ── SECTION 05: RECRUITER'S TECH DOSSIER ───────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden border-t border-black/5">
         <div className="max-w-4xl mx-auto">
            <ScrollReveal>
               <div className="flex flex-col items-center text-center gap-12">
                  <Badge variant="outline" className="border-black/10 text-black/40 uppercase tracking-widest px-4 py-1">Technical Stack</Badge>
                  <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">The Stack.</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 w-full mt-12 px-4 md:px-0">
                     {[
                       { l: 'Core', v: 'React + TS' },
                       { l: 'AI', v: 'Gemini 1.5' },
                       { l: 'Database', v: 'Firestore' },
                       { l: 'Motion', v: 'Framer' },
                       { l: 'Charts', v: 'Recharts' },
                       { l: 'Sync', v: 'Real-time' },
                       { l: 'Diagnostic', v: '13-Axis' },
                       { l: 'Latency', v: '40ms' },
                     ].map(item => (
                       <div key={item.l} className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                          <span className="font-mono text-[9px] uppercase font-black text-black/20 tracking-widest">{item.l}</span>
                          <span className="font-noto text-lg md:text-xl font-bold">{item.v}</span>
                       </div>
                     ))}
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
