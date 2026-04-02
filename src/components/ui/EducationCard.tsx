import React from 'react';
import { Badge } from './Badge';
import { Education } from '@/shared/types';
import { cn } from '@/shared/utils';

interface EducationCardProps {
  edu: Education;
}

/**
 * 100% Static EducationCard for maximum performance.
 * Uses standard HTML elements and pure CSS transitions to ensure 
 * zero impact on the main-thread or cursor tracking.
 */
export const EducationCard: React.FC<EducationCardProps> = ({ edu }) => {
  return (
    <div
      className={cn(
        "edu-item group relative border rounded-2xl p-8 flex flex-col h-full cursor-help",
        "transition-all duration-300 ease-out",
        "bg-white border-[#eee] hover:border-teal-500/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)]",
        edu.isOngoing && "ring-1 ring-teal-500/10 border-teal-500/20 shadow-[0_8px_30px_rgba(0,180,160,0.04)]"
      )}
      data-tooltip={
        edu.school === 'Birla Institute of Technology and Science' ? "Expected 2028. Because one postgrad wasn't enough (apparently)." :
        edu.school === 'Queen Mary University of London' ? "Distinction. Semi-structured data. The Spotify project was born here." :
        edu.school === 'Gandhi Institute For Technology' || edu.school === 'Gandhi Institute of Technology and Management' ? "Where it all started. Algorithms, encryption, and a lot of Java." : 
        "My foundation in research and logic."
      }
    >
      {/* Type badge */}
      <div className="flex items-center gap-2 mb-6">
        <Badge 
          variant="teal"
          className="cursor-default"
        >
          {edu.type}
        </Badge>
        {edu.isOngoing && (
          <div 
            className="flex items-center gap-1.5 ml-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="font-mono text-[9px] font-bold text-teal-600 uppercase tracking-widest leading-none">Active Program</span>
          </div>
        )}
        <div className="h-px flex-1 bg-black/[0.04]" />
      </div>

      {/* School & Degree */}
      <div className="mb-6 text-left w-full">
        <h3 className="font-noto text-2xl md:text-3xl font-black text-black leading-[1.1] mb-2 tracking-tight transition-colors duration-300 group-hover:text-teal-600">
          {edu.school}
        </h3>
        <p className="text-[17px] font-bold text-black/85 tracking-tight">
          {edu.degree}
        </p>
      </div>

      {/* Note */}
      <p className="text-[15px] text-black/60 leading-relaxed mb-8 flex-1 font-medium text-left">
        {edu.note}
      </p>

      {/* Footer metadata */}
      <div className="flex items-center justify-between pt-6 border-t border-black/[0.06] mt-auto">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] font-bold text-black/25 uppercase tracking-widest">
            {edu.isOngoing ? "Expected Grad" : "Completion Record"}
          </span>
          <span className="font-mono text-[12px] text-black/60 font-bold">{edu.year}</span>
        </div>
      </div>

      {/* Subtle Background Accent */}
      {edu.isOngoing && (
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/[0.02] to-transparent pointer-events-none -z-10 rounded-2xl" />
      )}
    </div>
  );
};
