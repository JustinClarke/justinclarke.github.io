import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';
import { ScrollReveal, MagneticButton, BackToTerminal } from '@/ui';
import { TheCloser } from '@/components/layout';

const DATA_STREAMS = [
  'WACC_ADJUST: 11.06% (STABLE)',
  'EQUITY_VAL: ₱234.7M',
  'MPSA_TERM: 25 YRS',
  'NPV_SENSITIVITY: ₱550/T BASE',
  'SMC_OFFER: 2-YR (REJECTED)',
  'QUARRY_YIELD: 3.0M T/YR',
];

const SENSITIVITY_DATA = [
  { price: '₱450', vsBase: '-18.2%', delta: '-₱780.5M', npv: '-₱582.7M', status: 'neg' },
  { price: '₱500', vsBase: '-9.1%', delta: '-₱390.3M', npv: '-₱192.4M', status: 'neg' },
  { price: '₱525', vsBase: '-4.5%', delta: '-₱195.1M', npv: '+₱2.7M', status: 'pos' },
  { price: '₱550', vsBase: 'BASE', delta: '—', npv: '+₱197.8M', status: 'base' },
  { price: '₱575', vsBase: '+4.5%', delta: '+₱195.1M', npv: '+₱392.9M', status: 'pos' },
  { price: '₱600', vsBase: '+9.1%', delta: '+₱390.3M', npv: '+₱588.1M', status: 'pos' },
];

export const CapitalBudgetingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStream, setActiveStream] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStream(prev => (prev + 1) % DATA_STREAMS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#E6A100]/30 overflow-x-hidden">
      
      <BackToTerminal />

      {/* ── CINEMATIC HUD ACTIONS ─────────────────────────────── */}
      <div className="fixed top-12 right-12 z-[100] hidden md:flex gap-4">
         <a href="/resources/IDC_Capital_Budgeting_Model.xlsx" download className="px-5 py-2 rounded-lg bg-[#E6A100] text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(230,161,0,0.3)] hover:scale-105 transition-transform">
            Download Model (.XLSX)
         </a>
      </div>

      {/* ── HERO: QUANTITATIVE COMMAND ──────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-32 md:pb-48 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1B3B5A40_0%,transparent_70%)]" />
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center">
               <div className="inline-flex items-center gap-4 mb-8 md:mb-12 px-6 py-2 rounded-full border border-[#E6A100]/20 bg-[#E6A100]/5 backdrop-blur-2xl">
                 <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-black text-[#E6A100] text-center">
                   IDC-CAP-99 // CHIQUITA ISLAND PROJECT
                 </span>
               </div>
               
               <h1 className="font-noto text-[12vw] sm:text-7xl md:text-[13rem] font-black leading-[0.75] tracking-tighter mb-10 md:mb-16 uppercase text-center break-words">
                 Capital<br/>
                 <span className="text-[#E6A100] relative italic font-playfair lowercase font-normal">Architecture.</span>
               </h1>
               
               <p className="font-mono text-base md:text-3xl text-white/40 max-w-4xl leading-relaxed font-medium mb-16 md:mb-24 px-4 md:px-0 text-center mx-auto">
                  Engineering a <span className="text-white underline decoration-[#E6A100] underline-offset-[12px] decoration-2">₱581M feasibility engine</span> for maritime dredging operations. A comparative study of cost-of-capital versus long-term asset yield.
               </p>

               <div className="md:hidden w-full px-4 mb-12">
                  <a href="/resources/IDC_Capital_Budgeting_Model.xlsx" download className="px-8 py-4 rounded-xl bg-[#E6A100] text-white font-mono text-[11px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(230,161,0,0.3)] block w-full text-center">
                     Download XLSX Model
                  </a>
               </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Operational Tape Footer */}
        <div className="relative w-full px-6 md:px-12 z-20">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t border-white/10 pt-12 md:pt-16">
              <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#E6A100]" />
                    <span className="font-mono text-[10px] tracking-widest uppercase font-black text-white/20">Operational_Data_Tape</span>
                 </div>
                 <div className="font-mono text-xs text-[#E6A100] h-6 flex items-center">
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
                 {[{ l: 'WACC', v: '11.06%' }, { l: 'CAPEX', v: '₱581.5M' }, { l: 'NPV', v: '₱484M' }].map(stat => (
                    <div key={stat.l} className="flex flex-col gap-1">
                       <span className="font-mono text-[9px] text-white/20 uppercase font-black tracking-widest">{stat.l}</span>
                       <span className="font-noto text-2xl md:text-4xl font-black text-white">{stat.v}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 01: CORE METRICS GRID ────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-1 border border-black/10 bg-black/10">
              {[
                { l: 'Total Capex', v: '₱581.5M', s: 'Equity ₱479M + Debt ₱102.5M' },
                { l: 'WACC Build', v: '11.06%', s: 'CAPM · Hamada relever · β 0.956' },
                { l: 'Best-Case NPV', v: '₱484M', s: '10-Year Horizon', b: 'ACCEPT', c: 'green-600' },
                { l: '2-Year NPV', v: '–₱59.6M', s: 'Current SMC Offer', b: 'REJECT', c: 'red-600' },
              ].map(m => (
                <div key={m.l} className="bg-white p-8 md:p-10 flex flex-col gap-4">
                   <span className="font-mono text-[10px] uppercase font-black tracking-widest text-black/30">{m.l}</span>
                   <span className={cn("font-noto text-3xl md:text-4xl font-black", m.c ? `text-${m.c}` : "text-black")}>{m.v}</span>
                   <span className="font-mono text-[10px] text-black/40">{m.s}</span>
                   {m.b && <div className={cn("mt-auto self-start px-4 py-1.5 rounded-[1px] text-[9px] font-black tracking-[0.2em] uppercase border", m.b === 'ACCEPT' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20")}>{m.b}</div>}
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#0a0a0a] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 md:mb-24 gap-6">
              <span className="font-mono text-[#E6A100] text-[11px] tracking-[0.5em] uppercase font-black">Architecture Stack</span>
              <h2 className="font-noto text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none">
                Capital<br/><span className="text-white/20">Structure.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
           {/* WACC BUILD */}
           <div className="flex flex-col gap-8 p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                 <h3 className="font-noto text-xl md:text-2xl font-black uppercase tracking-tighter">WACC Build.</h3>
                 <span className="font-mono text-[9px] text-[#E6A100] font-black uppercase">CAPM // Hamada</span>
              </div>
              <div className="space-y-6">
                 {[
                   { k: 'Risk-free rate (10-yr BVAL)', v: '6.11%' },
                   { k: 'Equity risk premium (PH)', v: '6.12%' },
                   { k: 'Relevered β (Hamada)', v: '0.956' },
                   { k: 'Cost of equity (Re)', v: '11.97%' },
                   { k: 'After-tax cost of debt', v: '6.83%' },
                 ].map(r => (
                   <div key={r.k} className="flex justify-between items-center group">
                      <span className="font-mono text-xs text-white/40 uppercase group-hover:text-white/60 transition-colors">{r.k}</span>
                      <span className="font-mono text-sm font-bold">{r.v}</span>
                   </div>
                 ))}
                 <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="font-mono text-sm text-[#E6A100] font-black uppercase">Final WACC</span>
                    <span className="font-noto text-2xl md:text-3xl font-black text-[#E6A100]">11.06%</span>
                 </div>
              </div>
           </div>

           {/* CAPITAL STRUCTURE */}
           <div className="flex flex-col gap-8 p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                 <h3 className="font-noto text-xl md:text-2xl font-black uppercase tracking-tighter">Asset Allocation.</h3>
                 <span className="font-mono text-[9px] text-white/20 font-black uppercase">Y0 Deployment</span>
              </div>
              <div className="space-y-6">
                 {[
                   { k: 'Heavy equipment', v: '₱381.0M' },
                   { k: 'Auxiliary equip & buildings', v: '₱48.0M' },
                   { k: 'Causeway / site prep', v: '₱50.0M' },
                   { k: 'Bank loan @ 9.1% / 10-yr', v: '₱102.5M', h: true },
                 ].map(r => (
                   <div key={r.k} className="flex justify-between items-center">
                      <span className="font-mono text-xs text-white/40 uppercase">{r.k}</span>
                      <span className={cn("font-mono text-sm font-bold", r.h ? "text-[#E6A100]" : "text-white")}>{r.v}</span>
                   </div>
                 ))}
                 <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="font-mono text-sm text-white/20 font-black uppercase">Total Equity</span>
                    <span className="font-noto text-2xl md:text-3xl font-black">₱479.0M</span>
                 </div>
              </div>
           </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: SENSITIVITY MATRIX ───────────────────────── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
           <div className="flex flex-col gap-6 max-w-2xl">
              <span className="font-mono text-black/30 text-[11px] tracking-[0.5em] uppercase font-black">Risk Analysis</span>
              <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Price Sensitivity.</h2>
              <p className="font-mono text-lg md:text-xl text-black/50 leading-relaxed">
                 Testing the model across a ₱450–₱650 price variance. The base scenario (₱550/T) yields optimal IRR, while any price below ₱525/T triggers a reject signal.
              </p>
           </div>

           <div className="overflow-x-auto rounded-[24px] md:rounded-[32px] border border-black/10">
              <table className="w-full font-mono text-sm">
                 <thead>
                    <tr className="bg-black text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest text-left">
                       <th className="p-4 md:p-8">Price (₱/t)</th>
                       <th className="p-4 md:p-8">vs. Base</th>
                       <th className="p-4 md:p-8">Approx ΔNPV</th>
                       <th className="p-4 md:p-8 text-right">5-Yr NPV Status</th>
                    </tr>
                 </thead>
                 <tbody className="bg-white">
                    {SENSITIVITY_DATA.map((row, i) => (
                      <tr key={row.price} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                         <td className="p-4 md:p-8 font-black text-lg md:text-xl">{row.price}</td>
                         <td className={cn("p-4 md:p-8 font-bold", row.status === 'neg' ? 'text-red-500' : (row.status === 'pos' ? 'text-green-600' : 'text-[#E6A100]'))}>{row.vsBase}</td>
                         <td className="p-4 md:p-8 text-black/40 font-bold">{row.delta}</td>
                         <td className={cn("p-4 md:p-8 text-right font-black text-lg md:text-xl", row.status === 'neg' ? 'text-red-500' : (row.status === 'pos' ? 'text-green-600' : 'text-[#E6A100]'))}>{row.npv}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
        </div>
        </div>
      </section>

      {/* ── SECTION 04: DEPRECIATION & STRATEGIC RECOMMENDATION ──── */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
           {/* DEPRECIATION SCHEDULE */}
           <div className="flex flex-col gap-10 md:gap-12">
              <div className="flex flex-col gap-6">
                 <span className="font-mono text-[#E6A100] text-[11px] tracking-[0.5em] uppercase font-black">Asset Lifecycle</span>
                 <h2 className="font-noto text-5xl md:text-5xl font-black uppercase tracking-tighter leading-none">Depreciation<br/>Schedule.</h2>
              </div>
              <div className="space-y-4 p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/5 shadow-2xl">
                 {[
                   { l: 'Heavy equip — Y1–Y5', v: '₱67.1M/yr' },
                   { l: 'Auxiliary equip — Y1–Y10', v: '₱4.8M/yr' },
                   { l: 'Total dep. Y1–Y5', v: '₱76.3M/yr', h: true },
                   { l: 'Y5 rehab capex', v: '₱152.4M', r: true },
                   { l: 'Y10 heavy salvage (12%)', v: '₱45.7M', g: true },
                 ].map(r => (
                   <div key={r.l} className="flex justify-between items-center py-2">
                      <span className="font-mono text-[10px] md:text-[11px] text-white/40 uppercase">{r.l}</span>
                      <span className={cn("font-mono text-sm font-bold", r.h ? "text-[#E6A100]" : (r.r ? "text-red-500" : (r.g ? "text-green-500" : "text-white")))}>{r.v}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* FINAL DIRECTIVE */}
           <div className="flex flex-col gap-10 md:gap-12">
              <div className="p-8 md:p-12 rounded-[32px] md:rounded-[40px] bg-[#E6A100] text-black shadow-2xl">
                 <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-8 block">Investment Directive // CFO</span>
                 <p className="font-noto text-xl md:text-2xl font-black leading-tight uppercase mb-8">
                    "Secure a contract of 5 years or longer. The 2-year offer destroys value at 5.2% IRR. Plan the ₱152.4M rehab from FCF."
                 </p>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                       <span className="font-mono text-[10px] font-black">01</span>
                       <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase opacity-80 leading-relaxed">Proceed ONLY if SMC commits to 5-year minimum.</span>
                    </div>
                    <div className="flex gap-4 items-start">
                       <span className="font-mono text-[10px] font-black">02</span>
                       <span className="font-mono text-[10px] md:text-[11px] font-bold uppercase opacity-80 leading-relaxed">Real-time telemetry on barges is non-negotiable.</span>
                    </div>
                 </div>
              </div>
              <div className="flex justify-center w-full">
                 <MagneticButton>
                    <a href="/resources/IDC_Capital_Budgeting_Model.xlsx" download className="px-10 md:px-12 py-5 md:py-6 rounded-full border border-[#E6A100] text-[#E6A100] font-mono text-xs font-black tracking-widest uppercase hover:bg-[#E6A100] hover:text-black transition-all block w-full md:w-auto text-center shadow-xl">
                       Extract Source Model
                    </a>
                 </MagneticButton>
              </div>
           </div>
        </div>
      </section>

      <footer className="w-full border-t border-white/5">
        <TheCloser />
      </footer>
    </div>
  );
};
