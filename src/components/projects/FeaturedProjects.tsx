import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal } from '@/ui';
import { projectsData } from '@/data/projects';
import { ProjectCard } from './cards';
import { TOOLTIPS } from '@/config/tooltips';

const TABS: { id: 'architecture' | 'intelligence'; label: string; accent: string }[] = [
  { id: 'architecture', label: 'Data Architecture', accent: 'text-brand-primary' },
  { id: 'intelligence', label: 'Analytics & Intelligence', accent: 'text-acc-bi' },
];

export function FeaturedProjects() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'intelligence'>('architecture');
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoplay || isHovered) return;

    autoplayRef.current = setInterval(() => {
      setActiveTab(current => {
        const idx = TABS.findIndex(t => t.id === current);
        const nextIdx = (idx + 1) % TABS.length;
        return TABS[nextIdx].id;
      });
    }, 6000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay, isHovered]);

  const handleTabClick = (tabId: 'architecture' | 'intelligence') => {
    setIsAutoplay(false);
    setActiveTab(tabId);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  // Map projectData categories to the tabs
  const filteredProjects = projectsData.filter(p => {
    if (activeTab === 'architecture') {
      return ['Production SaaS', 'Relational Architecture', 'Financial Engineering'].includes(p.projectType);
    }
    return ['MSc Research', 'Behavioral AI'].includes(p.projectType);
  }).slice(0, 2);

  return (
    <section id="projects" className="section-layout text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden">
      <div className="project-container relative z-10">

        {/* Section Header - Perfectly Standardized with Expertise Pipeline */}
        <div className="narrative-gap border-b border-white/10 pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              PROJECT MANIFEST
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85]">
                Featured <em className="font-playfair italic font-normal text-brand-primary">projects.</em>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <Link
                to="/archive"
                className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all duration-500 shadow-xl"
                data-tooltip={TOOLTIPS.easter}
              >
                <div className="w-1 h-1 rounded-full bg-viz-warning animate-pulse" />
                <span className="font-mono font-black text-[9px] tracking-[0.3em] text-viz-warning uppercase">
                  Archive
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* HUD Tab Navigation - Balanced Centering */}
        <div className="flex justify-center pb-12 md:pb-12">
          <div className="relative flex items-center p-1 bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-xl w-full md:w-fit shadow-2xl">
            <LayoutGroup>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "relative z-10 h-10 px-8 flex items-center justify-center font-mono font-black text-[9px] tracking-[0.25em] uppercase transition-colors duration-300",
                    activeTab === tab.id ? tab.accent : "text-[#5a5a57] hover:text-white/40"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute inset-0 rounded-lg z-[-1] border shadow-[0_0_25px_rgba(0,0,0,0.5)]",
                        activeTab === 'architecture' ? "bg-brand-primary/10 border-brand-primary/20" : "bg-acc-bi/10 border-acc-bi/20"
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8
                      }}
                    />
                  )}
                  <span className="relative top-[0.5px]">{tab.label}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
        </div>

        {/* Project Display Area - Smooth Fade Transition */}
        <div 
          className="min-h-[620px] relative grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.1
                  }
                },
                exit: {
                  opacity: 0,
                  transition: { duration: 0.3 }
                }
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 col-start-1 row-start-1"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={{
                    initial: { opacity: 0, y: 20, scale: 0.98 },
                    animate: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA - Tightened */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/archive"
            className="group font-mono text-[9px] text-[#5a5a57] hover:text-brand-primary transition-colors uppercase tracking-[0.4em] flex items-center gap-4"
          >
            <span className="w-8 h-px bg-[#5a5a57]/20 group-hover:bg-brand-primary/50 transition-colors" />
            access all projects
            <span className="w-8 h-px bg-[#5a5a57]/20 group-hover:bg-brand-primary/50 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
}
