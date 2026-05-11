/**
 * @fileoverview Visual components for project cards and dashboard headers.
 * These simulate real-time metrics, processes, or data visualizations
 * using tailwind-based CSS animations and layout primitives.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

// ==========================================
// Card Previews (Grid)
// ==========================================



export const SqlVisual = () => (
  <div className='w-32 h-32 flex items-center justify-center relative scale-110'>
    {/* Glowing Grid Background */}
    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
    
    <svg className="w-24 h-24 relative z-10 overflow-visible" viewBox="0 0 100 100">
      {/* Relational Connections */}
      <motion.path
        d="M20 30 L50 50 M80 30 L50 50 M50 50 L50 80"
        stroke="rgba(239,68,68,0.4)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 4"
        animate={{ strokeDashoffset: [20, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Entity Nodes (Tables) */}
      {[
        { x: 10, y: 15, w: 20, h: 25, label: 'PK' },
        { x: 70, y: 15, w: 20, h: 25, label: 'FK' },
        { x: 40, y: 70, w: 20, h: 25, label: 'IDX' }
      ].map((node, i) => (
        <g key={i}>
          <motion.rect
            x={node.x} y={node.y} width={node.w} height={node.h}
            rx="2"
            fill="rgba(239,68,68,0.1)"
            stroke="rgba(239,68,68,0.8)"
            strokeWidth="1"
            className="will-change-[opacity]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            style={{ filter: 'drop-shadow(0 0 2px rgba(239,68,68,0.5))' }}
          />
          <rect x={node.x} y={node.y} width={node.w} height="4" fill="rgba(239,68,68,0.3)" rx="1" />
          <text x={node.x + 4} y={node.y + 16} fontSize="6" className="font-mono fill-red-500 font-black">{node.label}</text>
        </g>
      ))}
      
      {/* Central Command Node */}
      <motion.circle
        cx="50" cy="50" r="4"
        fill="#ef4444"
        className="will-change-[r]"
        animate={{ r: [4, 6, 4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
      />
    </svg>
    
    <div className='absolute bottom-[-10px] font-mono text-[7px] px-2 py-1 rounded-sm bg-red-500/10 text-red-500 border border-red-500/20 font-black tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.2)]'>
      DATA_ENGINE: V1.1
    </div>
  </div>
);

export const LiteStoreVisual = () => (
  <div className='w-32 h-32 flex items-center justify-center relative scale-110'>
    {/* Orbital Structure */}
    <div className="relative w-20 h-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-cyan-500/10 rounded-full will-change-transform"
      />
      
      {/* Revolving Brands/Services Nodes */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [angle, angle + 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 will-change-transform"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-sm rotate-45 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </motion.div>
      ))}

      {/* The Core Service Platform */}
      <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/30 flex items-center justify-center backdrop-blur-md">
        <div className="relative w-6 h-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-cyan-400 rounded-full blur-md will-change-[transform,opacity]"
          />
          <div className="absolute inset-1 border-2 border-cyan-400 rounded-sm rotate-45" />
        </div>
      </div>
      
      {/* Horizontal Data Streams */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20 overflow-hidden">
        <motion.div
          animate={{ x: [-100, 100] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-10 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
      </div>
    </div>
    
    <div className='absolute bottom-[-10px] font-mono text-[7px] px-2 py-1 rounded-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-black tracking-[0.2em] uppercase whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)]'>
      SaaS_CORE: ACTIVE
    </div>
  </div>
);



export const SpotifyVisual = () => (
  <div className='w-24 h-24 flex flex-col items-center justify-center relative'>
    {/* Miniature Vector Grid */}
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:5px_5px]" />

      {/* Central Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-viz-spotify rounded-sm rotate-45 flex items-center justify-center">
        <div className="w-0.5 h-0.5 bg-brand-bg rounded-sm" />
      </div>

      {/* Orbiting Points */}
      <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
      <div className="absolute bottom-2 left-1 w-1 h-1 bg-viz-spotify/60 rounded-full" />
    </div>

    <div className='absolute bottom-0 font-mono text-[6px] px-1 py-0.5 rounded-[1px] bg-viz-spotify/10 text-viz-spotify border border-viz-spotify/20 font-bold tracking-tight uppercase whitespace-nowrap translate-y-2'>
      Similarity: 0.942
    </div>
  </div>
);





export const LiteStoreHeroVisual = () => (
  <div className="flex flex-col items-center gap-[12px]">
    <div className="flex items-center gap-[10px]">
      <span className="font-mono text-[13px] font-medium px-[14px] py-[6px] rounded bg-white/5 text-cyan-400/60 border border-cyan-500/10">3.0s</span>
      <div className="w-8 h-px bg-white/10 relative">
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]"
        />
      </div>
      <span className="font-mono text-[14px] font-black px-[14px] py-[6px] rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]">0.6s</span>
    </div>
    <span className="font-mono text-[9px] text-cyan-400/40 tracking-[0.3em] uppercase font-black">Optimization_Cycle</span>
    <div className="mt-2 w-[220px] p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex justify-between font-mono text-[8px] text-white/20 mb-2 uppercase tracking-widest font-black">
        <span>Network_Ingest</span><span>98%</span>
      </div>
      <div className="bg-white/5 rounded-full overflow-hidden h-1">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '98%' }}
          transition={{ duration: 2 }}
          className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />
      </div>
    </div>
  </div>
);

export const SpotifyHeroVisual = () => (
  <div className="flex flex-col items-center gap-8 relative scale-[0.9] md:scale-100">
    <div className="relative w-[180px] h-[180px]">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.1] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Vector Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
        <line x1="50" y1="50" x2="20" y2="20" stroke="var(--color-viz-spotify)" strokeWidth="0.5" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="50" y1="50" x2="80" y2="30" stroke="var(--color-viz-spotify)" strokeWidth="0.5" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="50" y1="50" x2="70" y2="80" stroke="var(--color-viz-spotify)" strokeWidth="0.5" strokeDasharray="2 2">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Central User Profile Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-4 h-4 bg-viz-spotify rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(29,185,84,0.5)]">
          <div className="w-1.5 h-1.5 bg-brand-bg rounded-sm" />
        </div>
        <div className="absolute inset-0 w-full h-full bg-viz-spotify/20 rounded-sm rotate-45 animate-ping" />
      </div>

      {/* Recommended Data Nodes */}
      <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-white/40 rounded-full animate-pulse" />
      <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[20%] right-[30%] w-2 h-2 bg-viz-spotify rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </div>

    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        {['Similarity: 0.942', 'Distance: 0.058'].map((m) => (
          <span key={m} className="font-mono text-[9px] font-bold text-viz-spotify uppercase tracking-widest px-2 py-1 bg-viz-spotify/5 border border-viz-spotify/20">
            {m}
          </span>
        ))}
      </div>
      <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em] mt-2">Vector Resonance Analysis</span>
    </div>
  </div>
);


export const FinanceVisual = () => (
  <div className='min-h-[60px] w-[90px] flex flex-col items-center justify-center gap-1.5 relative overflow-hidden'>
    <div className="relative w-12 h-10 border border-[#E6A100]/20 rounded bg-[#E6A100]/5 flex items-end gap-1 p-1">
      <div className="w-2 h-[40%] bg-[#E6A100]/40 rounded-sm" />
      <div className="w-2 h-[65%] bg-[#E6A100]/60 rounded-sm" />
      <div className="w-2 h-[90%] bg-[#E6A100] rounded-sm shadow-[0_0_10px_rgba(230,161,0,0.4)]" />
      <div className="w-2 h-[50%] bg-[#E6A100]/40 rounded-sm" />
    </div>
    <div className='font-mono text-[6px] px-1 py-0.5 rounded-[1px] bg-[#E6A100]/10 text-[#E6A100] border border-[#E6A100]/20 font-black tracking-tight uppercase'>
      IRR: 24.8%
    </div>
  </div>
);

export const FinanceHeroVisual = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-md">
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="p-6 rounded-2xl bg-white border border-[#1B3B5A]/10 shadow-sm flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] text-[#1B3B5A]/40 uppercase font-black tracking-widest">Net Present Value</span>
        <span className="font-noto text-3xl font-black text-[#1B3B5A]">.4M</span>
        <div className="w-full h-1 bg-[#1B3B5A]/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} className="h-full bg-[#E6A100]" />
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-white border border-[#1B3B5A]/10 shadow-sm flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] text-[#1B3B5A]/40 uppercase font-black tracking-widest">Internal Rate</span>
        <span className="font-noto text-3xl font-black text-[#E6A100]">24.8%</span>
        <div className="w-full h-1 bg-[#1B3B5A]/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-[#1B3B5A]" />
        </div>
      </div>
    </div>
    {/* Industrial Gauge */}
    <div className="w-full p-8 rounded-[32px] bg-[#1B3B5A] text-white flex flex-col gap-6 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
      </div>
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <span className="font-mono text-[10px] uppercase font-black tracking-[0.2em] text-[#E6A100]">Heavy_Asset_Yield</span>
        <span className="font-mono text-[10px] opacity-40 uppercase">Sens_Analytic: v4.1</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] uppercase text-white/40">Capital Outlay</span>
          <span className="font-noto text-2xl font-black">,450,000</span>
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="flex flex-col gap-1 text-right">
          <span className="font-mono text-[8px] uppercase text-white/40">Payback Period</span>
          <span className="font-noto text-2xl font-black text-[#E6A100]">3.2 Years</span>
        </div>
      </div>
    </div>
  </div>
);

export const HRArchetypeVisual = () => (
  <div className='w-24 h-24 flex flex-col items-center justify-center relative'>
    <div className="relative w-10 h-10 border border-violet-500/20 rounded-lg bg-violet-500/5 flex items-center justify-center">
      {/* Behavioral Quadrant Visual */}
      <div className="grid grid-cols-2 gap-0.5 p-1 w-full h-full">
        <div className="bg-violet-500/40 rounded-sm" />
        <div className="bg-violet-500/10 rounded-sm" />
        <div className="bg-violet-500/10 rounded-sm" />
        <div className="bg-violet-500/60 rounded-sm shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
      </div>
    </div>
    <div className='absolute bottom-0 font-mono text-[6px] px-1 py-0.5 rounded-[1px] bg-violet-500/10 text-violet-400 border border-violet-500/20 font-black tracking-tight uppercase whitespace-nowrap translate-y-2'>
      Taxonomy: 8-Axis
    </div>
  </div>
);

export const HRArchetypeHeroVisual = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-lg">
    <div className="grid grid-cols-3 gap-4 w-full">
      {[
        { l: 'Attrition Risk', v: '14%', c: 'text-red-500' },
        { l: 'Engagement', v: '7.2', c: 'text-violet-500' },
        { l: 'Overload', v: '2.4', c: 'text-violet-400' },
      ].map(m => (
        <div key={m.l} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">{m.l}</span>
          <span className={cn("font-noto text-xl font-black", m.c)}>{m.v}</span>
        </div>
      ))}
    </div>

    <div className="relative w-full aspect-video rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
      {/* Profile Card Mockup */}
      <div className="w-64 p-6 rounded-2xl bg-white text-black shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-500 font-black">JC</div>
          <div className="flex flex-col text-left">
            <span className="font-noto text-sm font-black">Justin Clarke</span>
            <span className="font-mono text-[8px] uppercase text-black/40 italic">The Purposeful Driver</span>
          </div>
        </div>
        <div className="h-px w-full bg-black/5" />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-mono text-[8px] uppercase font-bold">
            <span>Engagement Index</span><span>7.2</span>
          </div>
          <div className="h-1 bg-violet-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '90%' }} className="h-full bg-violet-500" />
          </div>
        </div>
      </div>

      {/* Floating Tag */}
      <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-violet-500 text-white font-mono text-[8px] font-black uppercase tracking-widest animate-bounce">
        Archetype Match
      </div>
    </div>
  </div>
);
