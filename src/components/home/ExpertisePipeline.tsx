import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { expertiseColumns } from '@/data';
import { SkillColumn } from './expertise/ExpertiseSubComponents';

/**
 * @fileoverview Refactored Expertise Pipeline.
 * Displays a technical matrix in a balanced 4-column grid.
 * Features a card-style #222 background and mobile accordion behavior.
 */
export const ExpertisePipeline: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(curr => curr === category ? null : category);
  };

  return (
    <div className="w-full space-y-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-white/5 bg-[#222] rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5"
      >
        {expertiseColumns.map((col, colIdx) => (
          <SkillColumn
            key={col.category}
            col={col}
            colIdx={colIdx}
            isExpanded={expandedCategory === col.category}
            onToggle={() => toggleCategory(col.category)}
          />
        ))}
      </motion.div>
    </div>
  );
};
