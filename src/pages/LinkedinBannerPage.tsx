import React, { useState } from 'react';
import { Code2, Cylinder, Circle } from 'lucide-react';
import { LINKEDIN_BANNER_COLORS } from '@/config/constants';

/**
 * LinkedinBannerPage – a standalone screenshottable page sized exactly
 * to LinkedIn's banner dimensions (1584×396, 4:1 ratio).
 *
 * Design brief: right-aligned content, arrow toward profile picture,
 * premium "unskippable" terminal/data aesthetic.
 * Now supports both Light and Dark mode options.
 */
export const LinkedinBannerPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false); // Default to light mode as requested

  // Array for a subtle github contribution graph visual
  const contribs = [
    [0, 1, 0, 2, 1], [1, 2, 3, 1, 0], [0, 1, 4, 2, 1],
    [2, 3, 2, 1, 0], [1, 4, 3, 2, 1], [2, 1, 0, 1, 2],
    [3, 4, 2, 1, 0], [1, 2, 0, 3, 1], [0, 1, 1, 2, 0],
    [2, 3, 4, 2, 1], [1, 2, 0, 1, 0], [0, 1, 1, 0, 0],
    [1, 0, 2, 1, 1], [2, 3, 1, 2, 0], [1, 4, 2, 3, 1],
    [0, 2, 1, 4, 2], [1, 0, 3, 2, 1], [2, 1, 0, 1, 0],
  ];

  const theme = isDark ? {
    frameBg: LINKEDIN_BANNER_COLORS.dark.frameBg,
    outerBg: '',
    dotColor: 'rgba(255, 255, 255, 0.07)',
    lineStroke: 'white',
    lineOpacity: 'opacity-[0.06]',
    glow1: 'radial-gradient(ellipse at center, rgba(0,200,180,0.12) 0%, transparent 65%)',
    glow2: 'radial-gradient(ellipse at center, rgba(75,139,190,0.08) 0%, transparent 70%)',
    glowPython: 'radial-gradient(circle at center, rgba(75,139,190,0.12) 0%, transparent 70%)',
    glowDbt: 'radial-gradient(circle at center, rgba(255,105,75,0.10) 0%, transparent 70%)',
    glowFabric: 'radial-gradient(circle at center, rgba(42,172,148,0.12) 0%, transparent 70%)',
    glowBlend: 'mix-blend-screen',
    scanlineOpacity: 'opacity-20',
    scanlineColor: 'rgba(0,200,180,0.015)',
    chartFill: 'white',
    chartOpacity: 'opacity-[0.06]',
    circuitStroke: 'white',
    circuitOpacity: 'opacity-[0.08]',
    circuitNode: 'rgba(0,200,180,0.4)',
    profileBorder: LINKEDIN_BANNER_COLORS.dark.profileBorder,
    profileBg: LINKEDIN_BANNER_COLORS.dark.profileBg,
    profileText: 'text-white/15',
    profileShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,200,180,0.03)',
    arrowGlow: 'rgba(0,200,180,0.15)',
    arrowGradStart: 'rgba(0,200,180,0.08)',
    arrowGradMid: 'rgba(0,200,180,0.35)',
    arrowGradEnd: 'var(--color-brand-primary)',
    arrowHead: 'var(--color-brand-primary)',
    titleText: 'text-white',
    titleDevGrad: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-python))',
    stackBg: 'rgba(255,255,255,0.02)',
    stackBorder: 'border-white/[0.08]',
    stackShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
    stackLabel: 'text-white/25',
    badgeText: 'text-term-fg',
    taglineText: 'text-term-dim',
    taglineAmp: 'text-brand-primary/50',
    accentGrad: 'linear-gradient(90deg, transparent 0%, rgba(0,200,180,0.25) 30%, rgba(0,200,180,0.5) 60%, transparent 100%)',
    uiWireframeBg: 'rgba(255,255,255,0.015)',
    uiWireframeBorder: 'rgba(255,255,255,0.08)',
    uiWireframeElement: 'rgba(255,255,255,0.15)',
    uiWireframeGrad: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
    codeSnippetText: 'text-white/30',
    syntax: LINKEDIN_BANNER_COLORS.dark.syntax
  } : {
    frameBg: 'linear-gradient(135deg, var(--color-light-bg) 0%, var(--color-term-white) 100%)',
    outerBg: '',
    dotColor: 'rgba(15, 23, 42, 0.1)',
    lineStroke: 'rgba(15, 23, 42, 0.08)',
    lineOpacity: 'opacity-100',
    glow1: 'radial-gradient(ellipse at center, rgba(6,182,212,0.18) 0%, transparent 70%)',
    glow2: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 75%)',
    glowPython: 'radial-gradient(circle at center, rgba(59,130,246,0.18) 0%, transparent 70%)',
    glowDbt: 'radial-gradient(circle at center, rgba(249,115,22,0.12) 0%, transparent 70%)',
    glowFabric: 'radial-gradient(circle at center, rgba(20,184,166,0.15) 0%, transparent 70%)',
    glowBlend: 'normal',
    scanlineOpacity: 'opacity-20',
    scanlineColor: 'rgba(6,182,212,0.02)',
    chartFill: LINKEDIN_BANNER_COLORS.light.chartFill,
    chartOpacity: 'opacity-100',
    circuitStroke: 'rgba(15, 23, 42, 0.16)',
    circuitOpacity: 'opacity-100',
    circuitNode: 'rgba(6,182,212,0.8)',
    profileBorder: 'var(--color-light-bg)',
    profileBg: 'radial-gradient(circle at 35% 35%, var(--color-light-bg), var(--color-term-white))',
    profileText: 'text-black/20',
    profileShadow: '0 10px 30px rgba(15, 23, 42, 0.08), inset 0 0 20px rgba(0,200,180,0.02)',
    arrowGlow: 'rgba(6,182,212,0.25)',
    arrowGradStart: 'rgba(99,102,241,0.2)',
    arrowGradMid: 'rgba(6,182,212,0.6)',
    arrowGradEnd: LINKEDIN_BANNER_COLORS.light.arrowGradEnd,
    arrowHead: LINKEDIN_BANNER_COLORS.light.arrowHead,
    titleText: 'text-slate-900',
    titleDevGrad: LINKEDIN_BANNER_COLORS.light.titleDevGrad,
    stackBg: 'rgba(255, 255, 255, 0.25)',
    stackBorder: 'border-slate-200/80',
    stackShadow: '0 4px 20px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
    stackLabel: 'text-slate-500/80',
    badgeText: 'text-slate-800',
    taglineText: 'text-slate-600',
    taglineAmp: 'text-indigo-600/70',
    accentGrad: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.25) 30%, rgba(6,182,212,0.5) 60%, transparent 100%)',
    uiWireframeBg: 'rgba(255, 255, 255, 0.85)',
    uiWireframeBorder: 'rgba(15, 23, 42, 0.12)',
    uiWireframeElement: 'rgba(15, 23, 42, 0.14)',
    uiWireframeGrad: 'linear-gradient(90deg, rgba(15, 23, 42, 0.08) 0%, transparent 100%)',
    codeSnippetText: 'text-slate-700',
    syntax: LINKEDIN_BANNER_COLORS.light.syntax,
  };

  return (
    <div 
      className={`w-full min-h-screen ${theme.outerBg} flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300 overflow-hidden`}
      style={{ background: theme.frameBg }}
    >

      {/* ── Helper Control Panel (not part of the screenshotted banner) ── */}
      <div className="absolute top-8 flex items-center gap-4 select-none z-50">
        <p className="text-black/40 dark:text-white/30 font-mono text-[11px] tracking-widest uppercase">
          LinkedIn Banner screenshot the frame below
        </p>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 text-xs font-mono rounded border transition-colors cursor-pointer"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            color: isDark ? 'var(--color-light-bg)' : 'var(--color-light-text)',
          }}
        >
          Toggle: {isDark ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      {/* ═══ THE BANNER ═══ 1584×396 fixed ratio */}
      <div
        className="relative w-full max-w-[1584px] transition-all duration-300"
        style={{ aspectRatio: '1584/396', containerType: 'inline-size' }}
      >
        {/* ── BG LAYER 1: Isometric Grid Floor ── */}
        <div
          className="absolute bottom-0 -left-[100%] -right-[100%] h-[140px] pointer-events-none transition-all duration-300"
          style={{
            backgroundImage: `linear-gradient(transparent 95%, ${theme.lineStroke} 100%), linear-gradient(90deg, transparent 95%, ${theme.lineStroke} 100%)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(600px) rotateX(75deg)',
            transformOrigin: 'bottom',
            opacity: isDark ? 0.2 : 0.4,
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)'
          }}
        />

        {/* ── BG LAYER 2: micro dot grid ── */}
        <div
          className="absolute -inset-[100%] pointer-events-none opacity-[0.35] transition-all duration-300"
          style={{
            backgroundImage: `radial-gradient(${theme.dotColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* ── BG LAYER 3: ambient glow – teal top-right, blue bottom-left ── */}
        <div className={`absolute -top-[40%] -right-[5%] w-[55%] h-[180%] rounded-full pointer-events-none transition-all duration-300 ${theme.glowBlend === 'mix-blend-screen' ? 'mix-blend-screen' : ''}`}
          style={{ background: theme.glow1, filter: 'blur(60px)' }}
        />
        <div className={`absolute -bottom-[60%] left-[15%] w-[35%] h-[160%] rounded-full pointer-events-none transition-all duration-300 ${theme.glowBlend === 'mix-blend-screen' ? 'mix-blend-screen' : ''}`}
          style={{ background: theme.glow2, filter: 'blur(50px)' }}
        />

        {/* ── BG LAYER 3b: skill set ambient glows sprinkled on the right ── */}
        <div className={`absolute -top-[10%] right-[10%] w-[35%] h-[90%] rounded-full pointer-events-none transition-all duration-300 ${theme.glowBlend === 'mix-blend-screen' ? 'mix-blend-screen' : ''}`}
          style={{ background: theme.glowPython, filter: 'blur(50px)' }}
        />
        <div className={`absolute top-[20%] -right-[5%] w-[30%] h-[80%] rounded-full pointer-events-none transition-all duration-300 ${theme.glowBlend === 'mix-blend-screen' ? 'mix-blend-screen' : ''}`}
          style={{ background: theme.glowDbt, filter: 'blur(50px)' }}
        />
        <div className={`absolute -bottom-[20%] right-[15%] w-[35%] h-[90%] rounded-full pointer-events-none transition-all duration-300 ${theme.glowBlend === 'mix-blend-screen' ? 'mix-blend-screen' : ''}`}
          style={{ background: theme.glowFabric, filter: 'blur(50px)' }}
        />

        {/* ── BG LAYER 4: scanline sweep ── */}
        <div className={`absolute -inset-[100%] pointer-events-none transition-all duration-300 ${theme.scanlineOpacity}`}
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${theme.scanlineColor} 0, ${theme.scanlineColor} 1px, transparent 1px, transparent 3px)`,
          }}
        />

        {/* ── BG LAYER 5: Radar/Polar Chart Graphic ── */}
        <div className="absolute bottom-[15%] left-[24%] pointer-events-none transition-all duration-300 opacity-60">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke={theme.circuitStroke} strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="70" cy="70" r="40" fill="none" stroke={theme.circuitStroke} strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="70" cy="70" r="20" fill="none" stroke={theme.circuitStroke} strokeWidth="0.5" strokeDasharray="2 4" />

            <line x1="70" y1="10" x2="70" y2="130" stroke={theme.circuitStroke} strokeWidth="0.5" opacity="0.6" />
            <line x1="10" y1="70" x2="130" y2="70" stroke={theme.circuitStroke} strokeWidth="0.5" opacity="0.6" />
            <line x1="27" y1="27" x2="113" y2="113" stroke={theme.circuitStroke} strokeWidth="0.5" opacity="0.3" />
            <line x1="27" y1="113" x2="113" y2="27" stroke={theme.circuitStroke} strokeWidth="0.5" opacity="0.3" />

            <path d="M 70 30 L 95 50 L 85 90 L 50 100 L 25 60 Z" fill={theme.arrowHead} opacity="0.1" stroke={theme.arrowHead} strokeWidth="1" />
            <path d="M 70 45 L 85 60 L 75 80 L 60 85 L 45 65 Z" fill={theme.arrowHead} opacity="0.15" stroke={theme.arrowHead} strokeWidth="1" />

            <circle cx="95" cy="50" r="2" fill={theme.arrowHead} />
            <circle cx="85" cy="90" r="2" fill={theme.arrowHead} />
            <circle cx="50" cy="100" r="2" fill={theme.arrowHead} />
            <circle cx="25" cy="60" r="2" fill={theme.arrowHead} />
            <circle cx="70" cy="30" r="2" fill={theme.arrowHead} />
          </svg>
        </div>

        {/* ── BG LAYER 6: circuit/node decoration on far left ── */}
        <svg className={`absolute top-[10%] left-[2%] pointer-events-none transition-all duration-300 ${theme.circuitOpacity}`} width="140" height="320" viewBox="0 0 140 320">
          {/* vertical trunk */}
          <line x1="20" y1="0" x2="20" y2="320" stroke={theme.circuitStroke} strokeWidth="0.6" strokeDasharray="3 6" />
          {/* branches */}
          {[40, 90, 140, 200, 260].map((y, i) => (
            <g key={i}>
              <line x1="20" y1={y} x2={60 + (i % 3) * 25} y2={y} stroke={theme.circuitStroke} strokeWidth="0.5" />
              <circle cx={60 + (i % 3) * 25} cy={y} r="3" fill="none" stroke={theme.circuitStroke} strokeWidth="0.6" />
              <circle cx={60 + (i % 3) * 25} cy={y} r="1.2" fill={theme.circuitNode} />
            </g>
          ))}
        </svg>

        {/* ── BG LAYER 7: GitHub Contribution Graph (Bottom Center-Right) ── */}
        <div className="absolute bottom-[10%] right-[38%] flex gap-1 pointer-events-none opacity-40 transition-all duration-300 z-10">
          {contribs.map((col, x) => (
            <div key={x} className="flex flex-col gap-1">
              {col.map((val, y) => {
                let bg = theme.uiWireframeElement;
                if (val === 1) bg = 'rgba(0, 200, 180, 0.2)';
                if (val === 2) bg = 'rgba(0, 200, 180, 0.4)';
                if (val === 3) bg = 'rgba(0, 200, 180, 0.7)';
                if (val === 4) bg = theme.arrowHead;
                return <div key={y} className="w-2.5 h-2.5 rounded-[2px] transition-colors duration-300" style={{ background: bg }} />;
              })}
            </div>
          ))}
        </div>

        {/* ── BG LAYER 8: Floating Data Panel (Top Right center) ── */}
        <div
          className="absolute top-[12%] right-[45%] w-[180px] rounded-lg backdrop-blur-md transition-all duration-300 pointer-events-none rotate-[3deg] z-10"
          style={{
            background: theme.uiWireframeBg,
            border: `1px solid ${theme.uiWireframeBorder}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          <div className="p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className={`font-mono text-[7px] tracking-wider opacity-60 transition-colors duration-300 ${theme.titleText}`}>CPU_USAGE</span>
              <span className="font-mono text-[7px] font-bold transition-colors duration-300" style={{ color: theme.arrowHead }}>42%</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden transition-colors duration-300" style={{ background: theme.uiWireframeElement }}>
              <div className="h-full w-[42%] transition-colors duration-300" style={{ background: theme.arrowHead }} />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className={`font-mono text-[7px] tracking-wider opacity-60 transition-colors duration-300 ${theme.titleText}`}>MEM_ALLOC</span>
              <span className="font-mono text-[7px] font-bold transition-colors duration-300" style={{ color: theme.arrowHead }}>1.2GB</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden transition-colors duration-300" style={{ background: theme.uiWireframeElement }}>
              <div className="h-full w-[65%] transition-colors duration-300" style={{ background: theme.arrowHead }} />
            </div>
          </div>
        </div>

        {/* ── BG LAYER 9: Abstract UI/UX Wireframe (Floating Component) ── */}
        <div
          className="absolute top-[35%] left-[32%] w-[240px] h-[180px] rounded-xl backdrop-blur-md transition-all duration-300 pointer-events-none rotate-[-3deg] z-10"
          style={{
            background: theme.uiWireframeBg,
            border: `1px solid ${theme.uiWireframeBorder}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
          }}
        >
          <div className="p-4 flex flex-col gap-3 h-full">
            {/* Window Controls */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full transition-colors duration-300" style={{ background: theme.uiWireframeElement }} />
                <div className="w-2.5 h-2.5 rounded-full transition-colors duration-300" style={{ background: theme.uiWireframeElement }} />
              </div>
              <div className="w-12 h-3 rounded-full transition-colors duration-300" style={{ background: theme.uiWireframeElement, opacity: 0.5 }} />
            </div>
            {/* Split Content layout */}
            <div className="flex gap-3 h-full">
              {/* Sidebar */}
              <div className="w-1/3 flex flex-col gap-2 border-r transition-colors duration-300" style={{ borderColor: theme.uiWireframeBorder }}>
                <div className="w-full h-2 rounded-sm transition-colors duration-300" style={{ background: theme.uiWireframeElement }} />
                <div className="w-5/6 h-2 rounded-sm transition-colors duration-300" style={{ background: theme.uiWireframeElement, opacity: 0.7 }} />
                <div className="w-4/6 h-2 rounded-sm transition-colors duration-300" style={{ background: theme.uiWireframeElement, opacity: 0.5 }} />
              </div>
              {/* Main Content */}
              <div className="w-2/3 flex flex-col gap-2">
                <div className="w-full h-12 rounded transition-all duration-300" style={{ background: theme.uiWireframeGrad }} />
                <div className="flex gap-2">
                  <div className="w-1/2 h-8 rounded transition-colors duration-300" style={{ background: theme.uiWireframeElement, opacity: 0.5 }} />
                  <div className="w-1/2 h-8 rounded transition-colors duration-300" style={{ background: theme.uiWireframeElement, opacity: 0.5 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BG LAYER 10: Mini IDE Code Window ── */}
        <div
          className="absolute top-[12%] left-[8%] w-[300px] rounded-lg backdrop-blur-md transition-all duration-300 pointer-events-none rotate-[2deg] z-10"
          style={{
            background: theme.uiWireframeBg,
            border: `1px solid ${theme.uiWireframeBorder}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          {/* Mac window header */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b transition-colors duration-300" style={{ borderColor: theme.uiWireframeBorder }}>
            <div className="w-2 h-2 rounded-full bg-viz-mac-red opacity-80" />
            <div className="w-2 h-2 rounded-full bg-viz-mac-yellow opacity-80" />
            <div className="w-2 h-2 rounded-full bg-viz-mac-green opacity-80" />
            <span className={`ml-2 font-mono text-[8px] opacity-50 transition-colors duration-300 ${theme.titleText}`}>Analytics.tsx</span>
          </div>
          <div className={`p-3 font-mono text-[9px] leading-[1.6] transition-colors duration-300 ${theme.codeSnippetText} opacity-[0.85] select-none`}>
            <div className="flex">
              <div className="w-4 text-right pr-2 opacity-30 select-none">1<br />2<br />3<br />4<br />5</div>
              <div>
                <span style={{ color: theme.syntax.keyword }}>import</span> {'{'} <span style={{ color: theme.syntax.func }}>useAnalytics</span> {'}'} <span style={{ color: theme.syntax.keyword }}>from</span> <span style={{ color: theme.syntax.string }}>'@hooks'</span>;<br />
                <span style={{ color: theme.syntax.keyword }}>function</span> <span style={{ color: theme.syntax.func }}>DataViz</span>() {'{'}<br />
                &nbsp;&nbsp;<span style={{ color: theme.syntax.keyword }}>const</span> {'{'} data {'}'} = <span style={{ color: theme.syntax.func }}>useAnalytics</span>();<br />
                &nbsp;&nbsp;<span style={{ color: theme.syntax.keyword }}>return</span> {'<'}<span style={{ color: theme.syntax.tag }}>Chart</span> <span style={{ color: theme.syntax.attr }}>data</span>={'{'}data{'}'} <span style={{ color: theme.syntax.attr }}>tension</span>={'{'}<span style={{ color: theme.syntax.attr }}>0.4</span>{'}'} {'/>'};<br />
                {'}'}
              </div>
            </div>
          </div>
        </div>



        {/* ════════════════════════════════════════════════════════════════════
            PROFILE PICTURE PLACEHOLDER
            LinkedIn places the profile pic roughly here in the bottom-left.
            ════════════════════════════════════════════════════════════════════ */}
        {/* <div
          className="absolute z-30 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            left: '4.5%',
            bottom: '-22%',
            width: '17%',
            aspectRatio: '1',
            border: `10px solid ${theme.profileBorder}`,
            background: theme.profileBg,
            boxShadow: theme.profileShadow,
          }}
        >
          <span className={`font-mono text-[10px] tracking-[0.2em] uppercase select-none transition-colors duration-300 ${theme.profileText}`}>your photo</span>
        </div> */}

        {/* ════════════════════════════════════════════════════════════════════
            THE ARROW & DATA PIPELINE precise alignment starting just before "data"
            ════════════════════════════════════════════════════════════════════ */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 1584 396"
          fill="none"
        >
          {/* glow behind the main arrow */}
          <path
            d="M 715 180 C 600 180, 470 230, 401 251"
            stroke={theme.arrowGlow}
            strokeWidth="20"
            strokeLinecap="round"
            filter="blur(10px)"
          />

          {/* Secondary dashed trajectory line (UI/UX detail) */}
          <path
            d="M 715 168 C 600 168, 470 218, 396 239"
            stroke={theme.arrowHead}
            strokeWidth="2"
            strokeDasharray="4 6"
            opacity="0.25"
          />

          {/* Main solid arrow line */}
          <path
            d="M 715 180 C 600 180, 470 230, 401 251"
            stroke="url(#arrowGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Data transmission nodes along the bezier curve */}
          <circle cx="625" cy="188" r="3" fill={theme.frameBg} stroke={theme.arrowHead} strokeWidth="2" />
          <circle cx="535" cy="210" r="3" fill={theme.frameBg} stroke={theme.arrowHead} strokeWidth="2" />
          <circle cx="445" cy="238" r="3" fill={theme.frameBg} stroke={theme.arrowHead} strokeWidth="2" />

          {/* Redesigned Arrow head: sharp stealth chevron pointing left-down along curve tangent */}
          <path
            d="M 0 0 L -22 -11 L -14 0 L -22 11 Z"
            fill={theme.arrowHead}
            transform="translate(390, 255) rotate(162.6)"
            stroke={theme.arrowHead}
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Origin/Start Point Indicator */}
          <circle cx="715" cy="180" r="6" fill="none" stroke={theme.arrowHead} strokeWidth="2" opacity="0.5" />
          <circle cx="715" cy="180" r="3" fill={theme.arrowHead} />

          <defs>
            <linearGradient id="arrowGrad" x1="715" y1="180" x2="390" y2="255" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={theme.arrowGradStart} />
              <stop offset="40%" stopColor={theme.arrowGradMid} />
              <stop offset="100%" stopColor={theme.arrowGradEnd} />
            </linearGradient>
          </defs>
        </svg>

        {/* ════════════════════════════════════════════════════════════════════
            MAIN CONTENT right-aligned
            ════════════════════════════════════════════════════════════════════ */}
        <div className="absolute top-0 right-0 bottom-0 w-[62%] flex flex-col justify-center items-end pr-[5%] z-20">

          {/* Title */}
          <h1
            className="font-black tracking-tighter leading-[1.1] text-right whitespace-nowrap transition-colors duration-300"
            style={{ fontFamily: '"Outfit", sans-serif', fontSize: '4.8cqw' }}
          >
            <span className={theme.titleText}>data product </span>
            <span className="text-transparent bg-clip-text transition-all duration-300" style={{ backgroundImage: theme.titleDevGrad }}>
              engineer.
            </span>
          </h1>

          {/* ── Tech Stack – clean pill badges ── */}
          <div
            className="flex items-center flex-wrap justify-end transition-all duration-300"
            style={{
              marginTop: '1.4cqw',
              gap: '0.8cqw',
            }}
          >
            {/* Python */}
            <span className="inline-flex items-center rounded-full bg-python/[0.12] transition-all duration-300"
              style={{
                padding: '0.5cqw 1.2cqw',
                fontSize: '1.2cqw',
                gap: '0.5cqw',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
              }}>
              <Code2 style={{ width: '1.4cqw', height: '1.4cqw' }} className="text-python" />
              <span className={`transition-colors duration-300 ${theme.badgeText}`}>Python</span>
            </span>
            {/* SQL */}
            <span className="inline-flex items-center rounded-full bg-term-dim/[0.12] transition-all duration-300"
              style={{
                padding: '0.5cqw 1.2cqw',
                fontSize: '1.2cqw',
                gap: '0.5cqw',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
              }}>
              <Cylinder style={{ width: '1.4cqw', height: '1.4cqw' }} className="text-term-dim" />
              <span className={`transition-colors duration-300 ${theme.badgeText}`}>SQL</span>
            </span>
            {/* dbt */}
            <span className="inline-flex items-center rounded-full bg-dbt/[0.12] transition-all duration-300"
              style={{
                padding: '0.5cqw 1.2cqw',
                fontSize: '1.2cqw',
                gap: '0.5cqw',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
              }}>
              <Circle style={{ width: '1.4cqw', height: '1.4cqw' }} className="text-dbt fill-dbt" />
              <span className={`transition-colors duration-300 ${theme.badgeText}`}>dbt</span>
            </span>
            {/* Fabric */}
            <span className="inline-flex items-center rounded-full bg-fabric/[0.12] transition-all duration-300"
              style={{
                padding: '0.5cqw 1.2cqw',
                fontSize: '1.2cqw',
                gap: '0.5cqw',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
              }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '1.4cqw', height: '1.4cqw' }}
              >
                <path fill="url(#if6f791-a)" fillRule="evenodd" d="m2.82 15.802-.293 1.072c-.11.343-.262.847-.345 1.295a2.815 2.815 0 0 0 2.32 3.795c.396.057.844.054 1.346-.02l2.307-.318a1.46 1.46 0 0 0 1.21-1.064l1.588-5.832z" clipRule="evenodd" />
                <path fill="url(#if6f791-b)" d="M5.07 16.078c-2.431.376-2.93 2.211-2.93 2.211l2.328-8.556 12.168-1.646-1.66 6.027a.85 0 0 1-.693.622l-.068.011-9.213 1.342z" />
                <path fill="url(#if6f791-c)" fillOpacity={0.8} d="M5.07 16.078c-2.431.376-2.93 2.211-2.93 2.211l2.328-8.556 12.168-1.646-1.66 6.027a.85 0 0 1-.693.622l-.068.011-9.213 1.342z" />
                <path fill="url(#if6f791-d)" d="m6.45 10.619 13.47-1.99a.8.8 0 0 0 .662-.586l1.39-5.03a.797.797 0 0 0-.87-1.006L8.25 3.905a3.59 3.59 0 0 0-2.89 2.597L3.507 13.22c.372-1.36.6-2.178 2.943-2.602Z" />
                <path fill="url(#if6f791-e)" d="m6.45 10.619 13.47-1.99a.8.8 0 0 0 .662-.586l1.39-5.03a.797.797 0 0 0-.87-1.006L8.25 3.905a3.59 3.59 0 0 0-2.89 2.597L3.507 13.22c.372-1.36.6-2.178 2.943-2.602Z" />
                <path fill="url(#if6f791-f)" fillOpacity={0.4} d="m6.45 10.619 13.47-1.99a.8.8 0 0 0 .662-.586l1.39-5.03a.797.797 0 0 0-.87-1.006L8.25 3.905a3.59 3.59 0 0 0-2.89 2.597L3.507 13.22c.372-1.36.6-2.178 2.943-2.602Z" />
                <path fill="url(#if6f791-g)" d="M6.45 10.619c-1.95.353-2.435.981-2.757 1.966L2.139 18.29s.497-1.816 2.899-2.205l9.177-1.337.068-.01a.85 0 0 0 .694-.623l1.365-4.958z" />
                <path fill="url(#if6f791-h)" fillOpacity={0.2} d="M6.45 10.619c-1.95.353-2.435.981-2.757 1.966L2.139 18.29s.497-1.816 2.899-2.205l9.177-1.337.068-.01a.85 0 0 0 .694-.623l1.365-4.958z" />
                <path fill="url(#if6f791-i)" fillRule="evenodd" d="M5.038 16.086c-2.03.328-2.697 1.673-2.856 2.082a2.817 2.817 0 0 0 2.32 3.796c.396.057.844.054 1.346-.02l2.307-.318a1.46 1.46 0 0 0 1.21-1.064l1.448-5.317z" clipRule="evenodd" />
                <defs>
                  <linearGradient id="if6f791-a" x1="6.477" x2="6.477" y1="22.003" y2="14.73" gradientUnits="userSpaceOnUse">
                    <stop offset="0.056" stopColor="var(--color-fabric)" />
                    <stop offset="0.155" stopColor="#239C87" />
                    <stop offset="0.372" stopColor="#177E71" />
                    <stop offset="0.588" stopColor="#0E6961" />
                    <stop offset="0.799" stopColor="#095D57" />
                    <stop offset="1" stopColor="#085954" />
                  </linearGradient>
                  <linearGradient id="if6f791-b" x1="15.667" x2="8.644" y1="16.726" y2="9.087" gradientUnits="userSpaceOnUse">
                    <stop offset="0.042" stopColor="#ABE88E" />
                    <stop offset="0.549" stopColor="#2AAA92" />
                    <stop offset="0.906" stopColor="#117865" />
                  </linearGradient>
                  <linearGradient id="if6f791-c" x1="-1.592" x2="5.092" y1="16.354" y2="9.075" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6AD6F9" />
                    <stop offset="1" stopColor="#6AD6F9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="if6f791-d" x1="3.507" x2="21.297" y1="7.61" y2="7.61" gradientUnits="userSpaceOnUse">
                    <stop offset="0.043" stopColor="#25FFD4" />
                    <stop offset="0.874" stopColor="#55DDB9" />
                  </linearGradient>
                  <linearGradient id="if6f791-e" x1="3.507" x2="19.532" y1="5.124" y2="12.565" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6AD6F9" />
                    <stop offset="0.23" stopColor="#60E9D0" />
                    <stop offset="0.651" stopColor="#6DE9BB" />
                    <stop offset="0.994" stopColor="#ABE88E" />
                  </linearGradient>
                  <linearGradient id="if6f791-f" x1="4.989" x2="13.703" y1="6.516" y2="8.444" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" stopOpacity={0} />
                    <stop offset="0.459" stopColor="#fff" />
                    <stop offset="1" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="if6f791-g" x1="7.879" x2="8.085" y1="13.981" y2="7.87" gradientUnits="userSpaceOnUse">
                    <stop offset="0.205" stopColor="#063D3B" stopOpacity={0} />
                    <stop offset="0.586" stopColor="#063D3B" stopOpacity={0.237} />
                    <stop offset="0.872" stopColor="#063D3B" stopOpacity={0.75} />
                  </linearGradient>
                  <linearGradient id="if6f791-h" x1="1.405" x2="8.851" y1="13.373" y2="14.774" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" stopOpacity={0} />
                    <stop offset="0.459" stopColor="#fff" />
                    <stop offset="1" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="if6f791-i" x1="6.784" x2="5.331" y1="19.988" y2="12.884" gradientUnits="userSpaceOnUse">
                    <stop offset="0.064" stopColor="#063D3B" stopOpacity={0} />
                    <stop offset="0.17" stopColor="#063D3B" stopOpacity={0.135} />
                    <stop offset="0.562" stopColor="#063D3B" stopOpacity={0.599} />
                    <stop offset="0.85" stopColor="#063D3B" stopOpacity={0.9} />
                    <stop offset="1" stopColor="#063D3B" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={`transition-colors duration-300 ${theme.badgeText}`}>Fabric</span>
            </span>
          </div>

        </div>

        {/* ── Thin teal accent line along the very bottom ── */}
        <div className="absolute bottom-0 -left-[100%] -right-[100%] h-[2px] z-30 transition-all duration-300"
          style={{ background: theme.accentGrad }}
        />

      </div>
    </div>
  );
};
