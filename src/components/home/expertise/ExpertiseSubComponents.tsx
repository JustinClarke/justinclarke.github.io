import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';
import { SLIDE_UP } from '@/config/animations';
import { CATEGORY_COLORS } from '@/config/constants';
import { SkillGroup as SkillGroupType, Skill as SkillType } from '@/shared/types';

/**
 * Individual skill tooltip mapping.
 */
const getSkillTooltip = (name: string) => {
  const tooltips: Record<string, string> = {
    'Python': "Primary language. Pandas for data, everything else for everything else.",
    'SQL': "The one that never goes out of style.",
    'TypeScript': "JavaScript but it tells you when you're wrong. Immediately.",
    'R': "Statistical computing. Mostly used for research and impressing academics.",
    'C/C++': "Close to the metal. From the B.Tech days.",
    'Java': "Verbose. But it runs everywhere and you can't argue with that.",
    'Flutter': "Cross-platform mobile. The 'yes I can build apps too' card.",
    'MS Fabric': "Microsoft's all-in-one data platform. The main character of most projects here.",
    'Azure': "Cloud infrastructure. Where pipelines are born and IAM policies are suffered.",
    'Git/GitHub': "Version control. Also: time machine when things go sideways.",
    'CI/CD': "Automated pipelines that deploy so you don't have to at 2am.",
    'Next.js': "React's grown-up cousin. SSR, edge functions, the works.",
    'Vercel': "Deploy in seconds. Scales without thinking about it.",
    'AWS': "Lambda, S3, CloudFront. The infrastructure behind LiteStore.",
    'Power BI': "The dashboard tool that stakeholders actually open.",
    'KQL': "Kusto Query Language. Built for Eventhouse and real-time streams.",
    'MongoDB': "Document store. Flexible schema, powerful aggregations.",
    'Jupyter': "Where data exploration happens. And where EDA lives.",
    'ML/Stats': "Regression, clustering, recommendation. The Neural Music Engine started here.",
    'Figma': "Where UI/UX ideas become real. Components, auto-layout, the works.",
    'Adobe CC': "Photoshop to Premiere. The full creative stack.",
    'UI/UX': "Design thinking applied to interfaces. The part that makes engineers uncomfortable.",
    'Photography': "Shot on a camera, not a phone. Usually.",
    'Illustration': "Digital. Sometimes traditional. Always overthought.",
  };
  return tooltips[name] || "";
};

const getCategoryTooltip = (category: string) => {
  if (category.includes('Languages')) return "The foundation. Everything else is built on top of this. (Mostly Python and SQL, let's be honest.)";
  if (category.includes('Cloud')) return "Where the code goes to live and occasionally fail gracefully. 99.9% uptime, 100% of the time.";
  if (category.includes('Analytics')) return "The part where data stops being data and starts being insight. Dashboard gasp factor: High.";
  if (category.includes('Design')) return "Because 'it works' and 'it looks good' shouldn't be mutually exclusive. (Even for engineers.)";
  return "";
};

/**
 * Individual Skill Card with animated bar.
 */
export const SkillCard: React.FC<{ skill: SkillType; accentColor: string; showBarTooltip?: boolean }> = ({ skill, accentColor, showBarTooltip }) => (
  <div 
    className="flex flex-col gap-1 md:gap-2"
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] md:text-[13px] font-bold text-[#0f0f0f] tracking-tight truncate">
        {skill.name}
      </span>
    </div>

    {/* Skill Bar Container (Desktop Only) */}
    <div 
      className="h-[2px] w-full bg-slate-100/80 relative rounded-full overflow-hidden hidden md:block"
    >
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
      <div 
        className="flex items-center justify-between mb-6 cursor-help"
        data-tooltip={getCategoryTooltip(col.category)}
        data-tooltip-color={accentColor}
      >
        <span className="font-mono text-[10px] text-black/25 tracking-tighter font-bold">{col.index}</span>
        <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: accentColor }}>
          {col.category}
        </h3>
      </div>

      <div className="h-px w-full bg-black/20 mb-8" />

      {/* Skills List */}
      <div className="flex flex-col gap-3.5 md:gap-6 flex-1">
        {col.skills.map((skill, sIdx) => (
          <SkillCard 
            key={skill.name} 
            skill={skill} 
            accentColor={accentColor} 
            showBarTooltip={sIdx === 0}
          />
        ))}
      </div>

      {/* Section Footer */}
      <div 
        className="mt-10 pt-4 border-t border-black/20 flex items-center justify-between text-[9px] font-mono text-black/20 uppercase tracking-widest font-bold"
      >
        <span>{col.footerCountLabel}</span>
        <div className="w-1.5 h-1.5 rounded-full opacity-40" style={{ backgroundColor: accentColor }} />
      </div>
    </motion.div>
  );
};
