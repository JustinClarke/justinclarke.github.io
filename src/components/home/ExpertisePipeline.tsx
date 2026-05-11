import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    accent: 'border-brand-primary/20'
  },
  {
    cat: 'Architecture & Infra',
    items: ['Microsoft Fabric', 'PostgreSQL', 'AWS', 'Docker', 'Data Modelling'],
    icon: Server,
    desc: 'Scalable data fabric design.',
    color: 'text-purple-400',
    bg: 'bg-purple-500',
    accent: 'border-purple-500/20'
  },
  {
    cat: 'Intelligence & BI',
    items: ['Power BI', 'Mixpanel', 'Excel', 'Dashboarding', 'Reporting'],
    icon: LineChart,
    desc: 'Predictive signals & reporting.',
    color: 'text-amber-400',
    bg: 'bg-amber-500',
    accent: 'border-amber-500/20'
  },
  {
    cat: 'Product Strategy',
    items: ['KPI Development', 'Product Analytics', 'Event Tracking', 'Optimization'],
    icon: Target,
    desc: 'Impact-driven growth logic.',
    color: 'text-rose-400',
    bg: 'bg-rose-500',
    accent: 'border-rose-500/20'
  }
];

export const ExpertisePipeline: React.FC = () => {
  return (
    <section id="expertise" className="narrative-section py-20 md:py-28 bg-brand-bg text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-4 md:mb-6 border-b border-white/10 pb-12">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Capability Registry
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white">
              Expertise <em className="font-playfair italic font-normal text-brand-primary">Pipeline.</em>
            </h2>
          </ScrollReveal>
        </div>

        {/* Stacked Pipeline View */}
        <div className="relative flex flex-col mb-16 md:mb-24">
          {/* Vertical Pipeline Connection */}
          <div className="absolute left-[60px] md:left-[140px] top-0 bottom-0 w-px bg-white/5 z-0" />

          {SKILLS.map((stage, i) => (
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
                    {stage.items.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.1, color: '#ffffff' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white/30 cursor-default"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom Rule */}
        <div className="h-px w-full bg-white/10" />
      </div>
    </section>
  );
};

