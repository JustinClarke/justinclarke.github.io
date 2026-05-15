import React, { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/utils';
import {
  Server,
  LineChart,
  Target,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { ScrollReveal } from '@/ui';

const SKILLS = [
  {
    cat: 'Languages & Engine',
    items: ['SQL', 'Python', 'DAX', 'REST APIs', 'KQL'],
    icon: TerminalIcon,
    desc: 'Deep query logic & automation.',
    color: 'text-brand-primary',
    bg: 'bg-brand-primary',
    accent: 'border-brand-primary/20',
    glow: '#00c8b4'
  },
  {
    cat: 'Architecture & Infra',
    items: ['Microsoft Fabric', 'PostgreSQL', 'AWS', 'Docker', 'Data Modelling'],
    icon: Server,
    desc: 'Scalable data fabric design.',
    color: 'text-purple-400',
    bg: 'bg-purple-500',
    accent: 'border-purple-500/20',
    glow: '#a855f7'
  },
  {
    cat: 'Intelligence & BI',
    items: ['Power BI', 'Mixpanel', 'Excel', 'Dashboarding', 'Reporting'],
    icon: LineChart,
    desc: 'Predictive signals & reporting.',
    color: 'text-amber-400',
    bg: 'bg-amber-500',
    accent: 'border-amber-500/20',
    glow: '#f59e0b'
  },
  {
    cat: 'Product Strategy',
    items: ['KPI Development', 'Product Analytics', 'Event Tracking', 'Optimization'],
    icon: Target,
    desc: 'Impact-driven growth logic.',
    color: 'text-rose-400',
    bg: 'bg-rose-500',
    accent: 'border-rose-500/20',
    glow: '#fb7185'
  }
];

export const ExpertisePipeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  // Total pills across all stages.
  // We want to shuffle their 3s active windows across a 60s cycle to ensure zero overlap.
  const shuffledDelays = useMemo(() => {
    const totalPills = SKILLS.reduce((acc, stage) => acc + stage.items.length, 0);
    // Generate delays: 0s, 3s, 6s... up to totalPills * 3
    const delays = Array.from({ length: totalPills }, (_, i) => i * 3);
    // Shuffle them to create random order
    return delays.sort(() => Math.random() - 0.5);
  }, []);

  return (
    <section 
      id="expertise" 
      ref={sectionRef}
      className="section-layout text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden"
    >
      
      <div className="project-container relative z-10">
        {/* Section Header */}
        <div className="narrative-gap border-b border-white/10 pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Capability Registry
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85]">
              What I bring to the <em className="font-playfair italic font-normal text-brand-primary">stack.</em>
            </h2>
          </ScrollReveal>
        </div>

        {/* Stacked Pipeline View */}
        <div className="relative flex flex-col mb-4 md:mb-6">
          {/* Vertical Pipeline Connection */}
          <div className="absolute left-[60px] md:left-[140px] top-0 bottom-0 w-px bg-white/5 z-0" />

          {SKILLS.map((stage, i) => {
            // Find global starting index for this stage's pills
            const stageStartIndex = SKILLS.slice(0, i).reduce((acc, s) => acc + s.items.length, 0);

            return (
              <div key={stage.cat} className="relative group py-6 md:py-8 border-t border-white/5 last:border-b">
                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24 relative z-10">
                  
                  {/* Left Column: Index & Category */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 w-full md:w-[120px] shrink-0">
                    <div className="relative">
                      <span className={cn("font-mono text-xs md:text-sm font-black", stage.color)}>
                        0{i + 1}
                      </span>
                      {/* Permanent Indicator Dot */}
                      <div className={cn("absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]", stage.bg)} />
                    </div>
                    <h3 className="font-mono text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      {stage.cat.split(' & ')[0]}
                    </h3>
                  </div>

                  {/* Right Column: Content & Skills */}
                  <div className="flex-1 flex flex-col gap-6 w-full">
                    <div className="flex items-center justify-between gap-6">
                      <p className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.1em] md:tracking-[0.15em] font-bold text-white/80 leading-tight">
                        {stage.desc}
                      </p>
                      <stage.icon className={cn("w-4 h-4 shrink-0 opacity-40", stage.color)} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {stage.items.map((skill, skillIdx) => {
                        const globalIdx = stageStartIndex + skillIdx;
                        const delay = shuffledDelays[globalIdx];

                        return (
                          <div
                            key={skill}
                            className={cn(
                              "px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 font-mono text-[9px] md:text-[10px] font-bold tracking-widest uppercase cursor-default",
                              isInView && "skill-pill-anim"
                            )}
                            style={{
                              '--pill-glow-color': stage.glow,
                              '--glow-delay': `${delay}s`,
                              '--glow-duration': '60s'
                            } as React.CSSProperties}
                          >
                            {skill}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
