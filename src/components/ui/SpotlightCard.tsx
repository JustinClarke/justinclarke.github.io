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
  const { handleMouseMove, mouseX, mouseY } = useSpotlight();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 group/spotlight overflow-hidden flex flex-col ${className}`}
    >
      {/* Background Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-0 shadow-inner"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(0, 200, 180, 0.08), transparent 80%)`,
          // @ts-ignore
          "--mouse-x": mouseX, 
          "--mouse-y": mouseY,
        }}
      />

      {/* Border Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(0, 200, 180, 0.4), transparent 80%)`,
          WebkitMaskImage: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          maskImage: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          // @ts-ignore
          "--mouse-x": mouseX, 
          "--mouse-y": mouseY,
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        {number && (
          <div className="font-ibm text-[12px] font-bold text-white/30 tracking-[0.25em] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-white/[0.08]">
            {number}
          </div>
        )}
        
        {title && (
          <h3 className="font-noto font-bold text-[16px] text-white uppercase tracking-[0.1em] mb-3">
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
