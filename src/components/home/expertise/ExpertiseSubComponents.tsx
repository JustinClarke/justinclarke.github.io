import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';
import { SLIDE_UP } from '@/config/animations';
import { CATEGORY_COLORS } from '@/config/constants';
import { SkillGroup as SkillGroupType, Skill as SkillType } from '@/shared/types';

/**
 * Individual Skill Card with animated bar.
 */
export const SkillCard: React.FC<{ skill: SkillType; accentColor: string }> = ({ skill, accentColor }) => (
  <div className="flex flex-col gap-1 md:gap-2">
    <div className="flex items-center justify-between">
      <span className="text-[11px] md:text-[13px] font-bold text-[#0f0f0f] tracking-tight truncate">
        {skill.name}
      </span>
    </div>

    {/* Skill Bar Container (Desktop Only) */}
    <div className="h-[2px] w-full bg-slate-100/80 relative rounded-full overflow-hidden hidden md:block">
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ backgroundColor: accentColor }}
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: [0.23, 1, 0.32, 1]
        }}
      />
    </div>

    {/* Metadata */}
    {skill.sub && (
      <div className="font-mono text-[8px] md:text-[9px] text-black/50 uppercase tracking-wider font-medium leading-tight mt-0.5">
        {skill.sub}
      </div>
    )}
  </div>
);

/**
 * Vertical Column representing a skill category.
 */
export const SkillColumn: React.FC<{ col: SkillGroupType; colIdx: number }> = ({ col, colIdx }) => {
  const accentColor = CATEGORY_COLORS[col.colorClass];

  return (
    <motion.div
      variants={SLIDE_UP}
      custom={colIdx}
      className={cn(
        "flex flex-col p-5 md:p-8 relative border-black/20",
        colIdx < 2 && "border-b md:border-b-0",
        colIdx !== 3 && (colIdx % 2 === 0 ? "border-r" : "md:border-r")
      )}
    >
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] text-black/25 tracking-tighter font-bold">{col.index}</span>
        <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: accentColor }}>
          {col.category}
        </h3>
      </div>

      <div className="h-px w-full bg-black/20 mb-8" />

      {/* Skills List */}
      <div className="flex flex-col gap-3.5 md:gap-6 flex-1">
        {col.skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} accentColor={accentColor} />
        ))}
      </div>

      {/* Section Footer */}
      <div className="mt-10 pt-4 border-t border-black/20 flex items-center justify-between text-[9px] font-mono text-black/20 uppercase tracking-widest font-bold">
        <span>{col.footerCountLabel}</span>
        <div className="w-1.5 h-1.5 rounded-full opacity-40" style={{ backgroundColor: accentColor }} />
      </div>
    </motion.div>
  );
};
