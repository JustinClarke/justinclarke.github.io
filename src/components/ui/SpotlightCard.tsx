import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpotlight } from '@/shared/hooks';

interface SpotlightCardProps {
  children?: React.ReactNode;
  number?: string;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * SpotlightCard implements a high-performance 'Cursor Spotlight' effect.
 * Uses useSpotlight hook to avoid React re-renders.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  number, 
  title, 
  description, 
  className = "" 
}) => {
  const { handleMouseMove, background, borderGlow, borderMask } = useSpotlight();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-7 group/spotlight overflow-hidden flex flex-col ${className}`}
    >
      {/* Background Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-0"
        style={{
          background,
        }}
      />

      {/* Border Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: borderGlow,
          WebkitMaskImage: borderMask,
          maskImage: borderMask,
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        {number && (
          <div className="font-ibm text-[12px] font-bold text-white/30 tracking-[0.2em] mb-5 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-white/5">
            {number}
          </div>
        )}
        
        {title && (
          <h3 className="font-noto font-bold text-[16px] text-white uppercase tracking-[0.1em] mb-2.5">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="font-ibm text-[16px] text-white/85 leading-relaxed font-normal">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};
