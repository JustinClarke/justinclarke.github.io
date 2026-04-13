import React from 'react';
import { Education } from '@/shared/types';
import { cn } from '@/shared/utils';
import { ScrollReveal } from '@/shared/components';

interface EducationTimelineProps {
  education: Education[];
}

/**
 * EducationTimeline Component
 * 
 * Implements "Option A" from the design mockup: A vertical, structured timeline.
 * Features:
 * - Left-aligned narrative path.
 * - Pulse animations for active/ongoing status.
 * - Distinction badges.
 */
export const EducationTimeline: React.FC<EducationTimelineProps> = ({ education }) => {
  return (
    <div className="relative pl-12 py-4">
      {/* ── Vertical Path (the "Line") ── */}
      <div 
        className="absolute left-[17.5px] top-6 bottom-6 w-px bg-light-border" 
        aria-hidden="true"
      />

      <div className="flex flex-col gap-10 md:gap-14">
        {education.map((edu, i) => (
          <ScrollReveal 
            key={`${edu.school}-${i}`}
            delay={i * 0.15}
            distance={10}
            className="group relative"
          >
            {/* ── Timeline Dot ── */}
            <div 
              className={cn(
                "absolute left-[-39px] top-1.5 w-[18px] h-[18px] rounded-full border-2 bg-white flex items-center justify-center z-10 transition-all duration-300",
                edu.isOngoing 
                  ? "border-brand-primary bg-teal-50" 
                  : "border-black bg-black"
              )}
            >
              <div 
                className={cn(
                  "w-[6px] h-[6px] rounded-full",
                  edu.isOngoing ? "bg-brand-primary" : "bg-white"
                )} 
              />
            </div>

            {/* ── Content ── */}
            <div className="flex flex-col gap-2 text-left">
              {/* Year & Status Label */}
              <div className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] font-bold text-light-text-muted tracking-[0.12em] uppercase">
                {edu.isOngoing && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                )}
                <span>{edu.year}</span>
              </div>

              {/* School Name */}
              <h3 className="font-sans text-2xl md:text-3xl lg:text-4xl font-black text-black leading-tight tracking-tight transition-colors duration-300 group-hover:text-brand-primary">
                {edu.school}
              </h3>

              {/* Degree */}
              <div className="font-sans text-[15px] md:text-[16px] font-bold text-black/80 tracking-tight">
                {edu.degree}
              </div>

              {/* Note / Description */}
              <p className="font-sans text-[14px] md:text-[15px] text-black/50 leading-relaxed max-w-2xl font-medium mt-1">
                {edu.note}
              </p>

              {/* Badge Row (Filtering out 'Distinction') */}
              {edu.badge && edu.badge !== 'Distinction' && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="bg-teal-50 text-teal-700 border border-teal-100 font-mono text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-[4px] inline-flex items-center">
                    {edu.badge}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};
