/**
 * NotFound the 404 error page, shown by the router's catch-all route.
 *
 * Fits in: rendered by App.tsx's <Route path="*"> when no URL matches.
 * Note:    the floating hex "bits" use Math.random() at render time; in
 *          React Strict Mode the component mounts twice so positions will
 *          differ between the two renders - cosmetically fine here but
 *          something to keep in mind for data-bearing uses.
 *
 * For beginners ----------------------------------------------------------------
 * A regular HTML page would just show static text for 404. Here we layer
 * Framer Motion animations on top: the giant "404" fades in, hex numbers
 * drift upward on a loop, and the bottom nav has a "step back" button that
 * calls the browser's own history API - the same as clicking Back.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { TOOLTIPS } from '@/config/tooltips';
import { SEO } from '@/components/layout';

export const NotFound = () => {
  return (
    <main className="min-h-screen bg-brand-bg text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <SEO title="404" />

      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,180,0.1)_0%,transparent_70%)]" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

         {/* LEARN: [...Array(6)] creates an array of 6 empty slots; .map gives us
             six <motion.div> elements without writing them out by hand. Each one
             gets a random starting position (left/top) and a random drift
             direction via Math.random(). The y animation loops from 0 → -100 → 0
             so each bit floats upward and loops back - like a particle effect. */}
         {[...Array(6)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -100, 0],
               opacity: [0, 0.2, 0],
               x: [0, Math.random() * 50 - 25, 0]
             }}
             transition={{ 
               duration: 10 + Math.random() * 10, 
               repeat: Infinity,
               delay: i * 2
             }}
             className="absolute font-mono text-[10px] text-brand-primary/40 select-none pointer-events-none"
             style={{ 
               left: `${Math.random() * 100}%`, 
               top: `${Math.random() * 100}%` 
             }}
           >
             0x{Math.random().toString(16).slice(2, 6).toUpperCase()}
           </motion.div>
         ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-tooltip={TOOLTIPS.notfoundbadge}
          data-tooltip-pos="below"
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 mb-8 md:mb-12"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-black text-red-400 text-center">Error 404 // Path_Resolution_Failed</span>
        </motion.div>

        {/* 404 */}
        <div className="relative mb-8 md:mb-12">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-noto text-8xl md:text-[20rem] font-black tracking-tighter leading-none text-white/5 uppercase"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tight text-white uppercase">
               Lost in<br />
               <span className="text-brand-primary italic font-playfair lowercase font-normal">the void.</span>
             </h2>
          </div>
        </div>

        <p className="font-mono text-xs md:text-xl text-white/40 leading-relaxed mb-12 md:mb-16 max-w-lg mx-auto">
          The coordinates you've requested do not exist within this namespace. The system has reached a terminal boundary.
        </p>

        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">

          {/* LEARN: window.history.back() is the same as the browser's Back button.
              No routing library needed for this - it's a plain browser API call. */}
          <button
            onClick={() => window.history.back()}
            data-tooltip={TOOLTIPS.stepback}
            className="font-mono text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-3 group"
          >
            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-primary/50 transition-colors">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Step Back
          </button>
        </div>

        {/* Footer Meta */}
        <div className="mt-24 md:mt-32 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-primary" />
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.25em]">System.Ready</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.25em]">Cache.Purged</span>
           </div>
        </div>

      </div>

      {/* Decorative HUD corners */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t border-l border-white/5 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b border-r border-white/5 pointer-events-none" />
    </main>
  );
};
