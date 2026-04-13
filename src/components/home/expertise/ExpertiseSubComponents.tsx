import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils';
import { CATEGORY_COLORS } from '@/config/constants';
import { SkillGroup as SkillGroupType, Skill as SkillType } from '@/shared/types';

/**
 * ExpertiseSubComponents
 * 
 * A collection of atomic and molecular components for the Expertise Pipeline.
 * 
 * Architecture:
 * - SkillCard: Displays individual technical proficiencies with animated bars.
 * - SkillColumn: Container for a category, implementing the mobile accordion/tap logic.
 * - Tooltip System: Integrated via data-attributes for a global floating UI.
 */

/**
 * Individual skill tooltip mapping.
 */
const getSkillTooltip = (name: string) => {
  const tooltips: Record<string, string> = {
    'Python & R': "Core statistical and data analysis stack. From research scripts to production-ready models.",
    'SQL': "The one that never goes out of style.",
    'TypeScript': "JavaScript but it tells you when you're wrong. Immediately.",
    'C/C++': "Close to the metal. From the B.Tech days.",
    'Java': "Enterprise logic and cross-platform architecture. Experienced in scalable backend services and Flutter-based mobile UI.",
    'Microsoft Fabric': "Microsoft's all-in-one data platform. The main character of most projects here.",
    'Git/GitHub': "Version control. Also: time machine when things go sideways.",
    'CI/CD': "Automated pipelines that deploy so you don't have to at 2am.",
    'Next.js': "React's grown-up cousin. SSR, edge functions, the works.",
    'Vercel': "Deploy in seconds. Scales without thinking about it.",
    'Power BI': "The dashboard tool that stakeholders actually open.",
    'KQL': "Kusto Query Language. Built for Eventhouse and real-time streams.",
    'MongoDB': "Document store. Flexible schema, powerful aggregations.",
    'Jupyter': "Where data exploration happens. And where EDA lives.",
    'ML/Stats': "Regression, clustering, recommendation. The Neural Music Engine started here.",
    'Figma/Adobe XD': "Where UI/UX ideas become real. Components, auto-layout, the works.",
    'Adobe Creative Cloud': "Photoshop to After Effects. The full creative stack.",
    'UI/UX': "Design thinking applied to interfaces. The part that makes engineers uncomfortable.",
    'Photography': "Shot on a camera, not a phone. Usually.",
    'Illustration': "Digital. Sometimes traditional. Always overthought.",
  };
  return tooltips[name] || "";
};

const getCategoryTooltip = (category: string) => {
  if (category.includes('Languages')) return "The foundation. Everything else is built on top of this. (Mostly Python and SQL, let's be honest.)";
  if (category.includes('Systems')) return "Where the code takes shape. Infrastructure, deployment, and the tools that make scaling possible.";
  if (category.includes('Analytics')) return "The part where data stops being data and starts being insight. Dashboard gasp factor: High.";
  if (category.includes('Design')) return "Because 'it works' and 'it looks good' shouldn't be mutually exclusive. (Even for engineers.)";
  return "";
};

/**
 * High-performance mobile title formatter.
 */
const CategoryTitle: React.FC<{ category: string; accentColor: string }> = ({ category, accentColor }) => {
  const shouldBreak = category.includes(' & ') && category.length > 14;

  if (!shouldBreak) return <>{category}</>;

  const [first, last] = category.split(' & ');
  return (
    <>
      {first}
      <span className="block sm:inline whitespace-nowrap transition-transform duration-500 group-hover/header:translate-x-1">
        <span className="hidden sm:inline"> </span>
        & {last}
      </span>
    </>
  );
};

/**
 * Individual Skill Card with animated bar.
 */
export const SkillCard: React.FC<{ skill: SkillType; accentColor: string }> = ({ skill, accentColor }) => (
  <div
    className="flex flex-col gap-2 group/skill cursor-help"
    data-tooltip={getSkillTooltip(skill.name)}
    data-tooltip-pos="below"
    style={{ '--skill-accent': accentColor } as React.CSSProperties}
  >
    <div className="flex items-center justify-between">
      <span className="text-[13.5px] md:text-[14px] font-extrabold text-white/90 tracking-tight truncate group-hover/skill:text-[var(--skill-accent)] transition-colors duration-300">
        {skill.name}
      </span>
    </div>

    {/* Proficiency Track: Desktop-only indicator for skill depth */}
    <div
      className="h-[1.5px] w-full bg-studio relative rounded-full overflow-hidden hidden md:block"
    >
      <div
        className="proficiency-bar-fill absolute top-0 left-0 h-full rounded-full"
        data-reveal="inactive"
        style={{
          backgroundColor: accentColor,
          ['--target-width' as any]: `${skill.level}%`
        }}
      />
    </div>

    {/* Metadata */}
    {skill.sub && (
      <div className="text-reveal font-mono text-[11px] text-white/40 uppercase tracking-[0.15em] font-bold leading-tight mt-0.5 group-hover/skill:text-white/60 transition-colors duration-300" data-reveal="inactive" style={{ transitionDelay: '100ms' }}>
        {skill.sub}
      </div>
    )}
  </div>
);

/**
 * Vertical Column representing a skill category.
 */
export const SkillColumn: React.FC<{ 
  col: SkillGroupType; 
  colIdx: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ col, colIdx, isExpanded, onToggle }) => {
  const accentColor = CATEGORY_COLORS[col.colorClass];

  return (
    <div
      className={cn(
        "flex flex-col relative border-studio expertise-col-hover transition-colors duration-500",
        isExpanded ? "bg-white/[0.02]" : "bg-transparent",
        // Mobile (1-col): Every item but the last gets a bottom border
        colIdx !== 3 ? "border-b" : "",
        // Tablet (2-col): Top row (0,1) gets bottom border; Left items (0,2) get right border
        colIdx < 2 ? "md:border-b" : "md:border-b-0",
        colIdx % 2 === 0 ? "md:border-r" : "md:border-r-0",
        // Desktop (4-col): No items get bottom border; Every item but the last gets right border
        "lg:border-b-0",
        colIdx !== 3 ? "lg:border-r" : "lg:border-r-0"
      )}
    >
      {/* Header Area Block */}
      <div
        className="cursor-pointer md:cursor-help group/header p-6 md:p-10"
        onClick={onToggle}
        data-tooltip={getCategoryTooltip(col.category)}
        data-tooltip-color={accentColor}
        data-tooltip-pos="below"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-1">
            <div className="flex flex-col gap-2 md:contents">
              <span className="font-mono text-[10px] text-text-dim tracking-tighter font-bold whitespace-nowrap">{col.index}</span>
              <h3 className="font-mono text-[14px] md:text-[12px] uppercase tracking-[0.25em] font-black leading-relaxed md:text-right" style={{ color: accentColor }}>
                <CategoryTitle category={col.category} accentColor={accentColor} />
              </h3>
            </div>
          </div>
          
          {/* Chevron for mobile */}
          <motion.div 
            className="md:hidden"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-white/20" />
          </motion.div>
        </div>
        
        <div className="hidden md:block h-px w-full bg-studio mt-6 md:mt-8 transition-all duration-700 group-hover/header:bg-white/10 group-hover/header:scale-x-[1.02] origin-left" />
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden md:flex-1 md:flex md:flex-col"
          >
            <div className="px-6 pb-10 md:px-10 md:pb-10 pt-0 flex flex-col gap-6 md:gap-8 grow justify-between">
              <div className="flex flex-col gap-6 md:gap-8">
                {col.skills.map((skill) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    accentColor={accentColor}
                  />
                ))}
              </div>

              {/* Section Footer: Visual grouping and item count */}
              <div
                className="mt-6 md:mt-12 pt-8 border-t border-studio flex items-center justify-between text-[10px] font-mono text-text-dim uppercase tracking-[0.2em] font-bold"
              >
                <span>{col.footerCountLabel}</span>
                <div className="w-2 h-2 rounded-full opacity-40 shadow-sm" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
