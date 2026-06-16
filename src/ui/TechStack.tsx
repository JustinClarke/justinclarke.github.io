/**
 * TechStack a little inline "└─ stack: python sql dbt fabric" badge row.
 *
 * Fits in: under headings/hero copy to show the tools at a glance.
 * Note:    each badge keeps its brand colour. When `animate` is true the badges
 *          fade in one after another, staggered by the per-badge `animationDelay`.
 *
 * For beginners ----------------------------------------------------------------
 * `getAnimStyles` returns an inline style object only when `animate` is on the
 * delay has to be an inline style because it's a per-badge value (100ms, 250ms,
 * ...), not a fixed class. That matches the project rule: JS-varying values go
 * through `style`, fixed styling goes through Tailwind classes.
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { Code2, Cylinder, Circle } from 'lucide-react';
import { cn } from '@/utils';

interface TechStackProps {
  className?: string;
  animate?: boolean;
}

export const TechStack: React.FC<TechStackProps> = ({ className, animate = false }) => {
  const getAnimStyles = (delay: string) => {
    if (!animate) return {};
    return { animationDelay: delay };
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2 py-0.5 select-none font-mono text-[11px] md:text-xs leading-none", className)}>
      <span 
        className={cn("hidden md:inline text-term-fg/40 mr-1 shrink-0", animate && "tech-badge-anim")}
        style={getAnimStyles('100ms')}
      >
        └─ stack:
      </span>
      <div className="inline-flex flex-wrap items-center gap-1 md:gap-1.5">
        {/* Python */}
        <span
          className={cn(
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-python/30 bg-python/5 font-bold tracking-wide shadow-[0_0_8px_rgba(75,139,190,0.05)] transition-all duration-300 hover:border-python/70 hover:bg-python/12 hover:shadow-[0_0_14px_rgba(75,139,190,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('250ms')}
        >
          <Code2 className="w-3 h-3 text-python group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-python transition-colors duration-300">python</span>
        </span>

        {/* SQL */}
        <span
          className={cn(
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-term-dim/30 bg-term-dim/5 font-bold tracking-wide shadow-[0_0_8px_rgba(138,138,134,0.05)] transition-all duration-300 hover:border-term-dim/70 hover:bg-term-dim/12 hover:shadow-[0_0_14px_rgba(138,138,134,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('400ms')}
        >
          <Cylinder className="w-3 h-3 text-term-dim group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-term-dim transition-colors duration-300">sql</span>
        </span>

        {/* dbt */}
        <span
          className={cn(
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-dbt/30 bg-dbt/5 font-bold tracking-wide shadow-[0_0_8px_rgba(255,105,75,0.05)] transition-all duration-300 hover:border-dbt/70 hover:bg-dbt/12 hover:shadow-[0_0_14px_rgba(255,105,75,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('550ms')}
        >
          <Circle className="w-3 h-3 text-dbt fill-dbt group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-dbt transition-colors duration-300">dbt</span>
        </span>

        {/* Fabric */}
        <span
          className={cn(
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-fabric/30 bg-fabric/5 font-bold tracking-wide shadow-[0_0_8px_rgba(42,172,148,0.05)] transition-all duration-300 hover:border-fabric/70 hover:bg-fabric/12 hover:shadow-[0_0_14px_rgba(42,172,148,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('700ms')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 group-hover/badge:scale-110 transition-transform duration-300"
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
                <stop offset="0.056" stopColor="#2AAC94" /> // tw-allow-hex
                <stop offset="0.155" stopColor="#239C87" /> // tw-allow-hex
                <stop offset="0.372" stopColor="#177E71" /> // tw-allow-hex
                <stop offset="0.588" stopColor="#0E6961" /> // tw-allow-hex
                <stop offset="0.799" stopColor="#095D57" /> // tw-allow-hex
                <stop offset="1" stopColor="#085954" /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-b" x1="15.667" x2="8.644" y1="16.726" y2="9.087" gradientUnits="userSpaceOnUse">
                <stop offset="0.042" stopColor="#ABE88E" /> // tw-allow-hex
                <stop offset="0.549" stopColor="#2AAA92" /> // tw-allow-hex
                <stop offset="0.906" stopColor="#117865" /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-c" x1="-1.592" x2="5.092" y1="16.354" y2="14.075" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6AD6F9" /> // tw-allow-hex
                <stop offset="1" stopColor="#6AD6F9" stopOpacity={0} /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-d" x1="3.507" x2="21.297" y1="7.61" y2="7.61" gradientUnits="userSpaceOnUse">
                <stop offset="0.043" stopColor="#25FFD4" /> // tw-allow-hex
                <stop offset="0.874" stopColor="#55DDB9" /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-e" x1="3.507" x2="19.532" y1="5.124" y2="12.565" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6AD6F9" /> // tw-allow-hex
                <stop offset="0.23" stopColor="#60E9D0" /> // tw-allow-hex
                <stop offset="0.651" stopColor="#6DE9BB" /> // tw-allow-hex
                <stop offset="0.994" stopColor="#ABE88E" /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-f" x1="4.989" x2="13.703" y1="6.516" y2="8.444" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff" stopOpacity={0} />
                <stop offset="0.459" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="if6f791-g" x1="7.879" x2="8.085" y1="13.981" y2="7.87" gradientUnits="userSpaceOnUse">
                <stop offset="0.205" stopColor="#063D3B" stopOpacity={0} /> // tw-allow-hex
                <stop offset="0.586" stopColor="#063D3B" stopOpacity={0.237} /> // tw-allow-hex
                <stop offset="0.872" stopColor="#063D3B" stopOpacity={0.75} /> // tw-allow-hex
              </linearGradient>
              <linearGradient id="if6f791-h" x1="1.405" x2="8.851" y1="13.373" y2="14.774" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff" stopOpacity={0} />
                <stop offset="0.459" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="if6f791-i" x1="6.784" x2="5.331" y1="19.988" y2="12.884" gradientUnits="userSpaceOnUse">
                <stop offset="0.064" stopColor="#063D3B" stopOpacity={0} /> // tw-allow-hex
                <stop offset="0.17" stopColor="#063D3B" stopOpacity={0.135} /> // tw-allow-hex
                <stop offset="0.562" stopColor="#063D3B" stopOpacity={0.599} /> // tw-allow-hex
                <stop offset="0.85" stopColor="#063D3B" stopOpacity={0.9} /> // tw-allow-hex
                <stop offset="1" stopColor="#063D3B" /> // tw-allow-hex
              </linearGradient>
            </defs>
          </svg>
          <span className="text-term-fg group-hover/badge:text-fabric transition-colors duration-300">fabric</span>
        </span>
      </div>
    </div>
  );
};
