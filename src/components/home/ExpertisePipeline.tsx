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
    <div
      className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-studio bg-white rounded-xl overflow-hidden shadow-[0_15px_45px_0_rgba(0,0,0,0.03)]"
      data-tooltip="Technical vertical stacks. Optimized for scale and performance."
    >
      {expertiseColumns.map((col, colIdx) => (
        <SkillColumn 
          key={col.category} 
          col={col} 
          colIdx={colIdx} 
        />
      ))}
    </div>
  );
};
