/**
 * SkillColumn renders one stage column of skill cards inside ExpertisePipeline.
 *
 * Fits in: inside the 3-column grid; receives DAG state from the parent orchestrator.
 * Note: each card registers its DOM node via registerNode so the parent's
 *   SVG DAG overlay can calculate edge coordinates from getBoundingClientRect().
 */
import React from 'react';
import { cn } from '@/utils';
import type { SkillStage } from './data';

interface SkillColumnProps {
  stage: SkillStage;
  stageIndex: number;
  isActive: boolean;
  expandedSkill: string | null;
  hoveredSkill: string | null;
  onToggleExpand: (name: string) => void;
  onMouseEnter: (name: string) => void;
  onMouseLeave: () => void;
  registerNode: (name: string, el: HTMLDivElement | null) => void;
  isNodeInLineage: (name: string) => boolean;
}

// Stateless: props in, JSX out all interactivity is lifted to the parent.
export const SkillColumn: React.FC<SkillColumnProps> = ({
  stage, stageIndex, isActive,
  expandedSkill, hoveredSkill,
  onToggleExpand, onMouseEnter, onMouseLeave,
  registerNode, isNodeInLineage,
}) => (
  <div
    className={cn(
      'relative z-10 md:hover:z-30 flex flex-col p-5 md:p-6 bg-surface-2/40 border border-edge-soft rounded-2xl transition-all duration-500 hover:border-edge group/col',
      // Phones show only the tab-selected column; md: up all three always show.
      isActive ? 'flex' : 'hidden md:flex'
    )}
  >
    {/* Column Header */}
    <div className="flex flex-col gap-3 pb-4 border-b border-edge-soft relative z-10">
      <div className="flex items-center gap-2.5">
        <div className={cn(
          'w-2 h-2 rounded-full shrink-0 relative z-10 transition-shadow duration-300',
          'shadow-[0_0_6px_rgba(var(--tech-rgb),0.25)] group-hover/col:shadow-[0_0_12px_rgba(var(--tech-rgb),0.5)]',
          stage.bg
        )}
        style={{ '--tech-rgb': stage.rgb } as React.CSSProperties} />
        <span className={cn(
          'font-mono text-2xl lg:text-3xl font-black leading-none tabular-nums',
          'transition-opacity duration-300 opacity-70 group-hover/col:opacity-100',
          stage.color
        )}>
          0{stageIndex + 1}
        </span>
        <span className="font-mono text-micro lg:text-micro uppercase tracking-mega text-fg-mid ml-auto leading-none font-bold">
          {stage.stage}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-micro lg:text-micro font-black uppercase tracking-[0.25em] text-fg-mid leading-tight">
          {stage.cat}
        </span>
        <h3 className="font-mono text-micro lg:text-fine font-bold uppercase leading-snug tracking-wider text-fg-soft transition-colors duration-300 group-hover/col:text-fg">
          {stage.title}
        </h3>
      </div>
    </div>

    {/* Skill Cards */}
    <div className="flex flex-col gap-3 mt-5 relative z-20">
      {stage.items.map((skill) => {
        const isExpanded = expandedSkill === skill.name;
        const inLineage = isNodeInLineage(skill.name);
        const isTriggered = hoveredSkill === skill.name;

        return (
          <div
            key={skill.name}
            // Forward this node into the parent's name→element Map (used to draw
            // the DAG edges between skills).
            ref={(el) => registerNode(skill.name, el)}
            onMouseEnter={() => onMouseEnter(skill.name)}
            onMouseLeave={onMouseLeave}
            onClick={() => onToggleExpand(skill.name)}
            // Stage colour enters as one --tech-rgb var that every
            // rgba(var(--tech-rgb), …) class below reads no per-stage variants.
            style={{
              '--tech-color': 'var(--color-brand-primary)',
              '--tech-rgb': stage.rgb,
            } as React.CSSProperties}
            className={cn(
              'group/card relative z-10 md:hover:z-50 flex flex-col p-2.5 border rounded-xl',
              'bg-surface-2/60 transition-all duration-300 cursor-pointer',
              'border-edge-soft',
              'md:hover:bg-[rgba(var(--tech-rgb),0.03)]',
              'md:hover:border-[rgba(var(--tech-rgb),0.35)]',
              'md:hover:shadow-[0_4px_12px_-4px_rgba(var(--tech-rgb),0.25)]',
              'md:hover:-translate-y-px',
              hoveredSkill && !inLineage ? 'opacity-30 grayscale-[20%]' : 'opacity-100',
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg bg-fg/[0.03] border border-edge-soft flex items-center justify-center shrink-0',
                  'transition-all duration-300',
                  'md:group-hover/card:scale-105',
                  'md:group-hover/card:bg-[rgba(var(--tech-rgb),0.06)]',
                  'md:group-hover/card:border-[rgba(var(--tech-rgb),0.3)]',
                  'shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]',
                  stage.color
                )}
                style={{
                  filter: `drop-shadow(0 0 5px rgba(${stage.rgb}, ${hoveredSkill && inLineage && !isTriggered ? 0.45 : 0.2}))`,
                }}
              >
                {skill.icon}
              </div>

              <span className="font-mono text-fine lg:text-caption font-extrabold text-term-fg/85 md:group-hover/card:text-fg transition-colors tracking-tight">
                {skill.name}
              </span>

              <span
                className="ml-auto w-1 h-1 rounded-full shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: isTriggered ? `rgb(${stage.rgb})` : 'var(--color-fg-faint)',
                  boxShadow: isTriggered ? `0 0 6px rgba(${stage.rgb}, 0.8)` : 'none',
                }}
              />
            </div>

            {/* Mobile: expandable description. max-height accordion (max-h-0 ↔
                max-h-40) CSS-only, at the cost of a fixed height cap. */}
            <div className={cn(
              'md:hidden overflow-hidden transition-all duration-300',
              isExpanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            )}>
              <p className="font-mono text-micro text-fg-mid leading-relaxed px-1 pb-1">
                {skill.desc}
              </p>
            </div>

            {/* Desktop: floating tooltip. Always rendered, just invisible until
                group-hover flips it on; the rotated square below is its arrow. */}
            <div className={cn(
              'hidden md:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[280px] p-4',
              'bg-surface-3/95 backdrop-blur-xl',
              'border border-[rgba(var(--tech-rgb),0.3)] rounded-xl',
              'shadow-[0_0_30px_rgba(var(--tech-rgb),0.15)]',
              'opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible',
              'transition-all duration-300 z-[100] pointer-events-none',
              'translate-y-[8px] group-hover/card:translate-y-0'
            )}>
              <div className={cn(
                'absolute top-full -translate-y-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-3 rotate-45',
                'border-r border-b border-[rgba(var(--tech-rgb),0.3)]'
              )} />
              <h4 className="font-mono text-fine font-bold text-fg mb-2 flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: `rgb(${stage.rgb})`,
                    boxShadow: `0 0 8px rgba(${stage.rgb}, 0.8)`,
                  }}
                />
                {skill.name}
              </h4>
              <p className="font-mono text-fine leading-relaxed text-fg-mid">{skill.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
