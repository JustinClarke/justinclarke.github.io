import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal } from '@/ui';
import { SpotifyVisual, LiteStoreVisual, SqlVisual, FinanceVisual, HRArchetypeVisual } from './Visuals';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  type: 'architecture' | 'intelligence';
}

const PROJECTS: Project[] = [
  {
    id: 'sql-disaster',
    title: 'Disaster Response System',
    desc: 'Complex MySQL relational engine modeled for Philippine disaster relief ops. Features 11 entities, composite PK chains, and a logistics command dashboard.',
    tags: ['MySQL', 'Relational Design', 'Systems'],
    type: 'architecture'
  },
  {
    id: 'litestore',
    title: 'Retail as a Service',
    desc: "Production-scale 'Store-as-a-Service' platform for D2C growth. Focused on high-fidelity performance engineering and behavioral telemetry pipelines.",
    tags: ['Next.js', 'Telemetry', 'Performance'],
    type: 'architecture'
  },
  {
    id: 'spotify-engine',
    title: 'Predictive Music Engine',
    desc: 'Terminal-first research engine benchmarking 3 models against the Spotify baseline. Uses a hierarchical TF-IDF + Acoustic stable sort on 1M songs.',
    tags: ['Python', 'Vector Modeling', 'TF-IDF'],
    type: 'intelligence'
  },
  {
    id: 'hr-archetype',
    title: 'Behavioral Intelligence System',
    desc: 'A workforce retention platform that classifies employee flight risk across 8 behavioral archetypes. Built with a 13-axis diagnostic engine, Gemini AI recommendations, and sub-40ms real-time sync — designed for HR leads making intervention decisions before attrition becomes visible.',
    tags: ['Gemini AI', 'Firestore', 'Real-time'],
    type: 'intelligence'
  }
];

const TABS: { id: 'architecture' | 'intelligence'; label: string; accent: string; width: number }[] = [
  { id: 'architecture', label: 'Data Architecture', accent: 'text-brand-primary', width: 220 },
  { id: 'intelligence', label: 'Analytics & Intelligence', accent: 'text-[#a855f7]', width: 260 },
];

export function FeaturedProjects() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'intelligence'>('architecture');
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoplay) return;

    autoplayRef.current = setInterval(() => {
      setActiveTab(current => {
        const idx = TABS.findIndex(t => t.id === current);
        const nextIdx = (idx + 1) % TABS.length;
        return TABS[nextIdx].id;
      });
    }, 5000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay]);

  const handleTabClick = (tabId: 'architecture' | 'intelligence') => {
    setIsAutoplay(false);
    setActiveTab(tabId);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const filteredProjects = PROJECTS.filter(p => p.type === activeTab);

  return (
    <section id="projects" className="narrative-section py-20 md:py-28 bg-brand-bg text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header Wrapper */}
        <div className="flex flex-col gap-4 mb-4 md:mb-6 border-b border-white/10 pb-12">
          {/* Section Registry Header */}
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              PROJECT MANIFEST
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>

          {/* Main Heading Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                Featured <em className="font-playfair italic font-normal text-brand-primary">Projects.</em>
              </h2>
            </ScrollReveal>

            {/* Archive Island Button - Repositioned to the right */}
            <ScrollReveal direction="up" delay={0.2}>
              <Link
                to="/archive"
                className="group relative w-full md:w-auto px-8 py-4 md:py-5 bg-[#f59e0b]/5 border border-[#f59e0b]/30 rounded-2xl flex items-center justify-center md:justify-start gap-4 hover:bg-[#f59e0b]/10 transition-all duration-500 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                <span className="font-mono font-black text-[10px] tracking-[0.3em] text-[#f59e0b] uppercase">
                  Archive
                </span>
                <svg className="w-4 h-4 text-[#f59e0b] transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* HUD Navigation Row - Repositioned below the header rule */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          {/* HUD Tabs */}
          <div className="relative flex p-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl w-full md:w-fit shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Unified Slider */}
            <motion.div
              className={cn(
                "absolute inset-y-1.5 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) rounded-xl z-0",
                activeTab === 'architecture' ? "bg-brand-primary/20 border border-brand-primary/30 shadow-[0_0_30px_rgba(0,200,180,0.25)]" : "bg-[#a855f7]/20 border border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
              )}
              initial={false}
              animate={{
                left: typeof window !== 'undefined' && window.innerWidth > 768 
                  ? (activeTab === 'architecture' ? '6px' : '226px')
                  : (activeTab === 'architecture' ? '6px' : 'calc(50% + 3px)'),
                width: typeof window !== 'undefined' && window.innerWidth > 768
                  ? (activeTab === 'architecture' ? '220px' : '260px')
                  : 'calc(50% - 9px)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "relative z-10 py-3 md:py-4 flex-1 md:flex-initial font-mono font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase transition-all duration-500",
                  activeTab === tab.id ? tab.accent : "text-white/30 hover:text-white/60"
                )}
                style={{ width: typeof window !== 'undefined' && window.innerWidth > 768 ? tab.width : 'auto' }}
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: activeTab === tab.id ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                >
                  {tab.label}
                </motion.span>
              </button>
            ))}
          </div>
        </div>

        {/* Project Display Area */}
        <div className="relative min-h-[400px] md:min-h-[500px] mb-8 md:mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Desktop Grid (Hidden on Mobile) */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {filteredProjects.map((project, idx) => (
                  <ScrollReveal key={project.id} delay={idx * 0.1} direction="up" distance={20}>
                    <Link
                      to={`/project/${project.id}`}
                      onMouseEnter={() => setIsAutoplay(false)}
                      onMouseLeave={() => setIsAutoplay(true)}
                      className="group relative flex flex-col h-[460px] rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-white/20 hover:-translate-y-2 shadow-2xl"
                    >
                      {/* Corner Brackets (HUD Detail) */}
                      <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-white/10 group-hover:border-brand-primary/40 transition-colors duration-700 rounded-tl-sm" />
                      <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-white/10 group-hover:border-brand-primary/40 transition-colors duration-700 rounded-tr-sm" />

                      {/* Visual Aura Glow */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none blur-[100px]",
                        activeTab === 'architecture' ? "bg-brand-primary" : "bg-[#a855f7]"
                      )} />

                      {/* Media Container */}
                      <div className="relative h-[260px] border-b border-white/10 overflow-hidden flex items-center justify-center bg-black/20">
                        {/* Scanning Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 z-0"
                          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        {/* Centering Harness for Visuals */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                          <div className="transform group-hover:scale-105 transition-transform duration-1000 ease-out flex items-center justify-center">
                            {project.id === 'spotify-engine' ? <div className="scale-[1.6]"><SpotifyVisual /></div> :
                              project.id === 'litestore' ? <div className="scale-[1.5]"><LiteStoreVisual /></div> :
                                project.id === 'sql-disaster' ? <div className="scale-[1.5]"><SqlVisual /></div> :
                                  project.id === 'hr-archetype' ? <div className="scale-[1.5]"><HRArchetypeVisual /></div> : null}
                          </div>
                        </div>

                        {/* Floating Metadata Badge */}
                        <div className="absolute top-10 left-10 z-20">
                          <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase block mb-1">Asset_Record</span>
                          <span className="font-mono text-[10px] text-white/60 font-bold uppercase tracking-widest">
                            [ ARCH_{project.id.slice(0, 2).toUpperCase()} ]
                          </span>
                        </div>

                        <div className="absolute top-10 right-10 z-20">
                          <div className={cn(
                            "px-5 py-2 rounded-full border font-mono text-[9px] font-black tracking-widest uppercase backdrop-blur-xl shadow-lg",
                            activeTab === 'architecture' ? "border-brand-primary/30 text-brand-primary bg-brand-primary/10" : "border-[#a855f7]/30 text-[#a855f7] bg-[#a855f7]/10"
                          )}>
                            {activeTab}
                          </div>
                        </div>
                      </div>

                      {/* Info Container */}
                      <div className="p-6 flex flex-col justify-between flex-1 relative z-10 bg-gradient-to-b from-transparent to-white/[0.01]">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={cn("w-1 h-1 rounded-full animate-pulse", activeTab === 'architecture' ? "bg-brand-primary" : "bg-[#a855f7]")} />
                            <h3 className="font-mono text-xl font-black text-white tracking-tighter uppercase group-hover:translate-x-2 transition-transform duration-700">
                              {project.title}
                            </h3>
                          </div>
                          <p className="font-mono text-[13px] text-white/40 leading-relaxed max-w-md line-clamp-2">
                            {project.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 mt-6">
                          <span className={cn(
                            "font-mono text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500",
                            activeTab === 'architecture' ? "text-brand-primary group-hover:text-brand-primary/100 text-brand-primary/50" : "text-[#a855f7] group-hover:text-[#a855f7]/100 text-[#a855f7]/50"
                          )}>
                            Initialize Deep Dive
                          </span>
                          <div className={cn(
                            "h-px flex-1 origin-left scale-x-50 group-hover:scale-x-100 transition-all duration-1000",
                            activeTab === 'architecture' ? "bg-brand-primary/20 group-hover:bg-brand-primary/60" : "bg-[#a855f7]/20 group-hover:bg-[#a855f7]/60"
                          )} />
                          <ArrowUpRight className={cn("w-4 h-4 transition-all duration-700 group-hover:rotate-45", activeTab === 'architecture' ? "text-brand-primary" : "text-[#a855f7]")} />
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Mobile Project Registry (High-Density List) */}
              <motion.div
                layout
                className="flex md:hidden flex-col gap-4"
              >
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={`/project/${project.id}`}
                      className="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-white/[0.02] active:bg-white/[0.05] transition-all overflow-hidden"
                    >
                      {/* Active State Background Glow */}
                      <motion.div
                        className={cn(
                          "absolute inset-0 opacity-0 group-active:opacity-5 transition-opacity pointer-events-none",
                          activeTab === 'architecture' ? "bg-brand-primary" : "bg-[#a855f7]"
                        )}
                      />

                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
                          [ MODULE_{project.id.slice(0, 3).toUpperCase()} ]
                        </span>
                        <motion.div
                          whileTap={{ scale: 1.2, rotate: 45 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <ArrowUpRight className={cn("w-4 h-4", activeTab === 'architecture' ? "text-brand-primary" : "text-[#a855f7]")} />
                        </motion.div>
                      </div>

                      <h3 className="font-mono text-lg font-black text-white uppercase tracking-tight mb-2 relative z-10">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                        {project.tags.map(tag => (
                          <span key={tag} className="font-mono text-[8px] text-white/30 border border-white/10 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 relative z-10">
                        <span className={cn(
                          "font-mono text-[9px] font-bold tracking-[0.15em] uppercase",
                          activeTab === 'architecture' ? "text-brand-primary" : "text-[#a855f7]"
                        )}>
                          Initialize Record
                        </span>
                        <motion.div
                          className={cn("h-px flex-1", activeTab === 'architecture' ? "bg-brand-primary/20" : "bg-[#a855f7]/20")}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 + idx * 0.05, duration: 0.8 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
