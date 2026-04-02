/**
 * @fileoverview Visual components for project cards and dashboard headers.
 * These simulate real-time metrics, processes, or data visualizations
 * using tailwind-based CSS animations and layout primitives.
 */

import React from 'react';

// ==========================================
// Card Previews (Grid)
// ==========================================

export const LtvVisual = () => (
  <div className='rounded overflow-hidden bg-white/5 h-[52px] w-[80px] flex items-end gap-[2px] px-2 pt-1 border border-white/10 relative'>
    {[38, 55, 47, 72, 65, 88, 95].map((h, i) => (
      <div
        key={i}
        className='flex-1 rounded-t-sm bg-brand-primary opacity-70 origin-bottom animate-[growBar_0.8s_ease-in-out_infinite_alternate]'
        style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
      />
    ))}
  </div>
);

export const TelemetryVisual = () => (
  <div className='flex gap-[5px] items-center justify-center min-h-[52px] w-[80px]'>
    <div className='w-[7px] h-[7px] rounded-full bg-brand-primary animate-[blink_2s_infinite]' />
    <div className='w-[7px] h-[7px] rounded-full bg-blue-400 animate-[blink_2s_infinite]' style={{ animationDelay: '0.4s' }} />
    <div className='w-[7px] h-[7px] rounded-full bg-purple-400 animate-[blink_2s_infinite]' style={{ animationDelay: '0.8s' }} />
  </div>
);

export const LiteStoreVisual = () => (
  <div className='flex gap-2 items-center justify-center min-h-[52px] w-[80px] scale-[0.9] md:scale-100'>
    <div className='font-mono text-[9px] px-2 py-1 rounded-[3px] font-bold bg-[#2a1a1a] text-red-500/80 border border-[#4a2020] uppercase tracking-tighter'>3.0s</div>
    <span className='text-[10px] text-white/20' aria-hidden='true'>→</span>
    <div className='font-mono text-[9px] px-2 py-1 rounded-[3px] font-bold bg-[#0f1f12] text-brand-primary border border-[#2a4a2e] animate-pulse uppercase tracking-tighter shadow-[0_0_10px_rgba(45,212,191,0.2)]'>0.6s</div>
  </div>
);

export const SpotifyVisual = () => (
  <div className='min-h-[52px] w-[80px] flex flex-col items-center justify-center gap-2 relative overflow-hidden'>
    <div className='relative w-8 h-8 flex items-center justify-center'>
      {/* Sonar Rings */}
      <div className='absolute w-full h-full rounded-full border border-[#1DB954]/30 animate-[radarPulse_2s_infinite]' />
      <div className='absolute w-full h-full rounded-full border border-[#1DB954]/20 animate-[radarPulse_2s_infinite]' style={{ animationDelay: '1s' }} />
      
      {/* Core Node */}
      <div className='w-2 h-2 bg-[#1DB954] rounded-full animate-pulse shadow-[0_0_10px_rgba(29,185,84,0.4)]' />
    </div>
    <div className='font-mono text-[7px] px-1.5 py-0.5 rounded-[2px] bg-[#0a200f] text-[#1DB954] border border-[#1a3d21] font-bold tracking-tight uppercase'>
      Neural Analysis
    </div>
  </div>
);

// ==========================================
// Dashboard Hero Visuals (Detailed Page)
// ==========================================

export const LtvHeroVisual = () => (
  <div className="w-full">
    <div className="flex items-end gap-[3px] h-[140px] p-4 pb-0">
      {[38, 62, 50, 78, 70, 91, 99].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-[#1d9e75] opacity-80 origin-bottom animate-[growUp_2s_ease-in-out_infinite_alternate]"
          style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
    <div className="flex gap-[3px] px-4 pt-3">
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
        <span key={m} className="flex-1 text-center font-ibm text-[8px] text-white/20 uppercase tracking-widest font-bold">
          {m}
        </span>
      ))}
    </div>
  </div>
);

export const TelemetryHeroVisual = () => (
  <div className="flex flex-col items-center gap-[10px]">
    <div className="flex items-center gap-[8px]">
      <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-[blink_2s_ease-in-out_infinite]" />
      <div className="w-[40px] h-[1px] bg-[#1e1e1e]" />
      <div className="w-2 h-2 rounded-full bg-[#60a5fa] animate-[blink_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
      <div className="w-[40px] h-[1px] bg-[#1e1e1e]" />
      <div className="w-2 h-2 rounded-full bg-[#a78bfa] animate-[blink_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
    </div>
    <div className="flex gap-[8px] justify-between w-[116px]">
      <span className="font-ibm text-[9px] text-[#333]">Ingest</span>
      <span className="font-ibm text-[9px] text-[#333]">Transform</span>
      <span className="font-ibm text-[9px] text-[#333]">Store</span>
    </div>
    <div className="mt-1 text-center">
      <div className="font-ibm text-[32px] font-medium text-white leading-none">12</div>
      <div className="font-ibm text-[9px] text-white/20 tracking-[0.15em] uppercase mt-[2px]">HRS/WEEK RECLAIMED</div>
    </div>
  </div>
);

export const LiteStoreHeroVisual = () => (
  <div className="flex flex-col items-center gap-[12px]">
    <div className="flex items-center gap-[8px]">
      <span className="font-ibm text-[13px] font-medium px-[14px] py-[6px] rounded bg-[#1f0a0a] text-[#f87171] border border-[#3d1515]">3.0s</span>
      <span className="font-ibm text-[14px] text-[#333]">→</span>
      <span className="font-ibm text-[13px] font-medium px-[14px] py-[6px] rounded bg-[#0a1f0e] text-[#4ade80] border border-[#1a3d20]">0.6s</span>
    </div>
    <span className="font-ibm text-[9px] text-[#333] tracking-[0.1em] uppercase">Page load time</span>
    <div className="mt-2 w-[180px]">
      <div className="flex justify-between font-ibm text-[9px] text-[#333] mb-1">
        <span>Before</span><span>After</span>
      </div>
      <div className="bg-[#1a1a1a] rounded-[2px] overflow-hidden h-1">
        <div className="w-[20%] h-full bg-[#4ade80] rounded-[2px] animate-[growRight_1.5s_ease-in-out_infinite_alternate] origin-left" />
      </div>
    </div>
  </div>
);

export const SpotifyHeroVisual = () => (
  <div className="flex flex-col items-center gap-6 relative scale-[0.9] md:scale-100">
    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
      {/* Sonar Rings */}
      <div className="absolute w-full h-full rounded-full border border-[#1DB954]/20 animate-[radarPulse_2.5s_linear_infinite]" />
      <div className="absolute w-full h-full rounded-full border border-[#1DB954]/20 animate-[radarPulse_2.5s_linear_infinite]" style={{ animationDelay: '0.8s' }} />
      <div className="absolute w-full h-full rounded-full border border-[#1DB954]/20 animate-[radarPulse_2.5s_linear_infinite]" style={{ animationDelay: '1.6s' }} />
      
      {/* Static Guideline Rings */}
      <div className="absolute w-[80px] h-[80px] rounded-full border border-white/5" />
      <div className="absolute w-full h-full rounded-full border border-white/5" />

      {/* Central "Vinyl" Record */}
      <div className="relative w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center animate-[vinylSpin_8s_linear_infinite] shadow-[0_0_25px_rgba(29,185,84,0.3)]">
        <div className="w-1.5 h-1.5 bg-[#050505] rounded-full" />
      </div>

      {/* Orbital Data Nodes */}
      <div className="absolute w-[6px] h-[6px] bg-[#1DB954] rounded-full animate-[orbitSpin35_4s_linear_infinite]" />
      <div className="absolute w-[5px] h-[5px] bg-[#a78bfa] rounded-full animate-[orbitSpin48_6s_linear_infinite]" />
    </div>

    <div className="flex justify-center gap-4">
      {['Energy', 'Key', 'Acoustics'].map((label, i) => (
        <span key={label} className="font-ibm text-[9px] font-bold text-white/20 uppercase tracking-[0.1em] animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
          {label}
        </span>
      ))}
    </div>
  </div>
);
