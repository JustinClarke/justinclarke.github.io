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
      className="w-full grid grid-cols-2 md:grid-cols-4 border border-black/20 bg-white rounded-2xl overflow-hidden shadow-sm"
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      data-tooltip="If it isn't here, I'm probably currently learning it (or I've already automated it)."
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
