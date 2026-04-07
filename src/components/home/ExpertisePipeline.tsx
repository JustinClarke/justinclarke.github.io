import React from 'react';
import { motion } from 'framer-motion';
import { expertiseColumns } from '@/data';
import { STAGGER_CONTAINER } from '@/config/animations';
import { SkillColumn } from './expertise/ExpertiseSubComponents';

/**
 * @fileoverview Refactored Expertise Pipeline.
 * Displays a technical matrix in a balanced 4-column grid.
 * Preserves cinematic deceleration motion and brand-teal styling.
 */
export const ExpertisePipeline: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-white/5 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
      data-tooltip="Technical vertical stacks. Optimized for scale and performance."
    >
      {expertiseColumns.map((col, colIdx) => (
        <SkillColumn 
          key={col.category} 
          col={col} 
          colIdx={colIdx} 
        />
      ))}
    </motion.div>
  );
};
