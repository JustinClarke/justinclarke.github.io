import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from './Badge';
import { Experience } from '@/shared/types';
import { EASING } from '@/config/animations';

interface ExperienceItemProps {
  exp: Experience;
  isOpen: boolean;
  onClick: () => void;
}

/**
 * ExperienceItem displays a single professional work record in an accordion-style interface.
 * Implements smooth layout transitions and selection indicators.
 */
export const ExperienceItem: React.FC<ExperienceItemProps> = ({ exp, isOpen, onClick }) => {
  return (
    <motion.div
      layout
      className={`relative group border-t border-black/[0.03] transition-all duration-500 hover:bg-black/[0.015] ${isOpen ? 'bg-black/[0.01]' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Entrance Border Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black/[0.03]" aria-hidden="true" />
      {/* Selection Indicator (Border Left) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            exit={{ height: 0 }}
            className='absolute left-0 top-0 w-[4px] bg-teal-500 z-10'
          />
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`exp-details-${exp.company.replace(/\s+/g, '-').toLowerCase()}`}
        className='w-full text-left py-10 px-4 md:px-8 focus-ring rounded-lg outline-none cursor-help'
        data-tooltip={
          exp.company === 'VNS Solutions' ? "Jan 2024 – Jan 2026. Where I went deep on Microsoft Fabric." :
          exp.company === 'LiteStore' ? "Apr 2021 – Apr 2023. Where 3s load times became a 0.6s obsession." :
          exp.company === 'Drop' ? "Jan – Apr 2021. My first real-world production React codebase." : 
          "A deep dive into this professional chapter."
        }
      >
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4'>
          <div className='flex-1 flex flex-col gap-2'>
            <div className='flex items-center gap-3 mb-2'>
              <span className='exp-index font-mono text-[11px] font-bold text-black/30 tracking-[0.25em] uppercase transition-colors duration-300'>
                {exp.index}
              </span>
              <div className='h-px w-4 bg-black/10' aria-hidden='true' />
              <Badge 
                variant='teal'
                className="cursor-default"
              >
                {exp.tag}
              </Badge>
            </div>

            <div className='flex flex-col gap-0.5'>
              <h3 className='font-noto text-xl md:text-2xl font-black text-black tracking-tight leading-tight group'>
                <span className='smooth-underline group-hover:text-teal-600 transition-colors duration-300'>
                  {exp.company}
                </span>
              </h3>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2'>
                <span className='text-[17px] font-bold text-black/85 tracking-tight'>
                  {exp.role}
                </span>
                <span className='hidden sm:block w-4 h-px bg-black/10' aria-hidden='true' />
                <span className='font-mono text-[12px] font-bold text-black/40 uppercase tracking-[0.25em]'>
                  {exp.year}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-4 self-end md:self-center'>
            <span className='hidden md:inline font-mono text-[11px] font-bold text-black/20 uppercase tracking-[0.25em] group-hover:text-black/40 transition-colors'>
              {isOpen ? 'Close details' : 'View record'}
            </span>
            <div 
              className={`chevron-ring w-10 h-10 rounded-full border border-black/5 flex items-center justify-center transition-all duration-500 cursor-pointer ${isOpen ? 'bg-black text-white border-black rotate-180 shadow-md' : 'bg-white text-black/40 group-hover:border-black/20'}`}
            >
              <ChevronDown size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`exp-details-${exp.company.replace(/\s+/g, '-').toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASING.smooth }} 
            className='overflow-hidden'
          >
            <div className='pb-12 pt-2 px-4 md:px-8 ml-0 md:ml-12 border-l border-[#f0f0f0] md:border-l-0'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6'>
                {exp.details.map((detail, j) => (
                  <motion.div 
                    key={j} 
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: j * 0.08,
                      ease: EASING.smooth 
                    }}
                    className='flex items-start gap-4'
                  >
                    <div className='mt-2.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.4)]' />
                    <p className='text-[15px] md:text-[16px] text-black/65 leading-relaxed font-medium tracking-tight'>
                      {detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
