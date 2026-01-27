import React from 'react';
import { Code2, Cylinder, Circle, ChartColumnIncreasing } from 'lucide-react';
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
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-[#4B8BBE]/30 bg-[#4B8BBE]/5 font-bold tracking-wide shadow-[0_0_8px_rgba(75,139,190,0.05)] transition-all duration-300 hover:border-[#4B8BBE]/70 hover:bg-[#4B8BBE]/12 hover:shadow-[0_0_14px_rgba(75,139,190,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('250ms')}
        >
          <Code2 className="w-3 h-3 text-[#4B8BBE] group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-[#4B8BBE] transition-colors duration-300">python</span>
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
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-[#FF694B]/30 bg-[#FF694B]/5 font-bold tracking-wide shadow-[0_0_8px_rgba(255,105,75,0.05)] transition-all duration-300 hover:border-[#FF694B]/70 hover:bg-[#FF694B]/12 hover:shadow-[0_0_14px_rgba(255,105,75,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('550ms')}
        >
          <Circle className="w-3 h-3 text-[#FF694B] fill-[#FF694B] group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-[#FF694B] transition-colors duration-300">dbt</span>
        </span>

        {/* Power BI */}
        <span
          className={cn(
            "group/badge px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-[#FDBF2B]/30 bg-[#FDBF2B]/5 font-bold tracking-wide shadow-[0_0_8px_rgba(253,191,43,0.05)] transition-all duration-300 hover:border-[#FDBF2B]/70 hover:bg-[#FDBF2B]/12 hover:shadow-[0_0_14px_rgba(253,191,43,0.22)] hover:scale-[1.04] hover:-translate-y-px inline-flex items-center gap-1 md:gap-1.5 cursor-pointer",
            animate && "tech-badge-anim"
          )}
          style={getAnimStyles('700ms')}
        >
          <ChartColumnIncreasing className="w-3 h-3 text-[#FDBF2B] group-hover/badge:scale-110 transition-transform duration-300" />
          <span className="text-term-fg group-hover/badge:text-[#FDBF2B] transition-colors duration-300">power-bi</span>
        </span>
      </div>
    </div>
  );
};
