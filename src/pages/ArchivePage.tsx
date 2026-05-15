import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, BackToTerminal } from '@/ui';
import { ArrowUpRight } from 'lucide-react';
import { SEO, TheCloser } from '@/components/layout';
import { projectsData } from '@/data/projects';
import { Project } from '@/types';

const CATEGORIES = [
  { id: 'data', label: 'Intelligence & Engineering', accent: 'text-brand-primary', bg: 'bg-brand-primary', border: 'hover:border-brand-primary/30', glow: 'rgba(0,200,180,0.1)' },
  { id: 'brand', label: 'Systems & Identity', accent: 'text-[#ec4899]', bg: 'bg-[#ec4899]', border: 'hover:border-[#ec4899]/30', glow: 'rgba(236,72,153,0.1)' },
  { id: 'academic', label: 'Theory & Research', accent: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]', border: 'hover:border-[#f59e0b]/30', glow: 'rgba(245,158,11,0.1)' },
];

const ARCHIVE_CATEGORIES: Record<string, string> = {
  'spotify-engine': 'data',
  'sql-disaster': 'data',
  'litestore': 'brand',
  'capital-budgeting': 'academic',
  'hr-archetype': 'data',
};

const ProjectCard = ({ project, cat }: { project: Project; cat: any }) => {
  const metrics = project.pageMetrics?.slice(0, 3) || [];
  
  return (
    <ScrollReveal direction="up" distance={20}>
      <Link
        to={`/project/${project.id}`}
        className={cn(
          "group relative flex flex-col bg-[#0c0c0c] border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-500 h-full",
          cat.border
        )}
      >
        {/* Top accent line */}
        <div className={cn("h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500", cat.bg)} />

        {/* Meta row */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3">
          <div className="font-mono text-[8px] text-[#5a5a57] uppercase tracking-[0.4em] font-black">
            {project.projectType}
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className={cn("w-1.5 h-1.5 rounded-full", cat.bg)}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={cn("font-mono text-[8px] uppercase tracking-widest font-black opacity-60", cat.accent)}>
              {project.pageStatus?.text || 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative w-full h-48 border-y border-white/[0.04] overflow-hidden group-hover:border-opacity-20 transition-colors duration-500">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
               style={{ background: `radial-gradient(circle at center, ${cat.glow} 0%, transparent 70%)` }} />
          <div className="absolute inset-0 scale-[0.6] group-hover:scale-[0.65] transition-transform duration-1000 ease-out flex items-center justify-center">
            {project.heroVisual}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
          <h3 className="font-sans text-xl font-black text-[#f4f4f3] tracking-tight group-hover:text-opacity-80 transition-colors duration-300 leading-tight mb-2 uppercase">
            {project.title}
          </h3>

          <p className="font-sans text-[#6a6a66] text-[12px] leading-relaxed mb-5 flex-1 line-clamp-3">
            {project.copy}
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 border-y border-white/[0.05] divide-x divide-white/[0.05] mb-5">
            {metrics.map((m, i) => (
              <div key={i} className="py-3.5 px-1 flex flex-col gap-0.5 first:pl-0 last:pr-0">
                <span className={cn("font-mono text-base font-black tracking-tighter", cat.accent)}>
                  {m.val}
                </span>
                <span className="font-mono text-[7px] text-[#5a5a57] uppercase tracking-widest font-black opacity-60">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 flex-wrap">
              {project.tech.slice(0, 3).map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.04] font-mono text-[8px] text-[#5a5a57] uppercase tracking-widest font-black">
                  {t}
                </span>
              ))}
            </div>
            <ArrowUpRight className={cn("w-4 h-4 transition-all duration-700 group-hover:rotate-45", cat.accent)} />
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};

const MobileRegistryRow = ({ project, cat }: { project: Project; cat: any }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <Link
      to={`/project/${project.id}`}
      className="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-white/[0.02] active:bg-white/[0.05] transition-all overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3 relative z-10">
         <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
           [ {project.id.slice(0, 4).toUpperCase()} ]
         </span>
         <ArrowUpRight className={cn("w-4 h-4", cat.accent)} />
      </div>
      
      <h3 className="font-mono text-lg font-black text-white uppercase tracking-tight mb-2 relative z-10">
        {project.title}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        {project.tech.slice(0, 2).map(tag => (
          <span key={tag} className="font-mono text-[8px] text-white/30 border border-white/10 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <span className={cn("font-mono text-[9px] font-bold tracking-[0.15em] uppercase", cat.accent)}>
          Initialize
        </span>
        <div className={cn("h-px flex-1", cat.bg + " bg-opacity-20")} />
      </div>
    </Link>
  </motion.div>
);

export const ArchivePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30 font-sans">
      <SEO 
        title="Project Archive" 
        description="A complete index of technical case studies, research artifacts, and engineering experiments by Justin Clarke."
        path="/archive"
        schemaType="CreativeWork"
      />
      <BackToTerminal />

      {/* Cinematic Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,180,0.05)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(5,5,5,1)_90%)]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 md:gap-4 mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#00c8b4]" />
               <span className="font-mono text-[10px] tracking-[0.6em] text-brand-primary uppercase font-black">
                 PROJECT_ARCHIVE_SYSTEM_v2.5
               </span>
               <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#00c8b4]" />
            </div>

            <h1 className="font-noto text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.85] md:leading-[0.8] mb-12 uppercase">
              Full<br />
              <span className="text-white/10 italic font-playfair lowercase font-normal">Registry.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-4xl mx-auto mt-12 border-t border-white/10 pt-12">
               {[
                 { label: 'Total Assets', value: projectsData.length.toString().padStart(2, '0') },
                 { label: 'System Ops', value: 'Active' },
                 { label: 'Encryption', value: 'SHA-256' }
               ].map(stat => (
                 <div key={stat.label} className="flex flex-col gap-2">
                   <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">{stat.label}</span>
                   <span className="font-mono text-2xl font-black text-[#f4f4f3]">{stat.value}</span>
                 </div>
               ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Registry Sections */}
      <div className="project-container pb-32 md:pb-64 space-y-32 md:space-y-64">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} className="flex flex-col gap-12 md:gap-16">
            {/* Section Header - Synchronized with Home */}
            <div className="narrative-gap border-b border-white/10 pb-12 flex flex-col gap-4">
              <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
                <span className={cn("font-mono text-[10px] tracking-[0.4em] uppercase font-bold whitespace-nowrap", cat.accent)}>
                  {cat.label}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2 className="font-noto text-5xl md:text-8xl font-black tracking-tighter text-white uppercase">
                  {cat.id}<span className="font-playfair italic font-normal text-white/10 lowercase">.</span>
                </h2>
              </ScrollReveal>
            </div>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
              {projectsData.filter(p => ARCHIVE_CATEGORIES[p.id] === cat.id).map((project) => (
                <ProjectCard key={project.id} project={project} cat={cat} />
              ))}
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col gap-4">
              {projectsData.filter(p => ARCHIVE_CATEGORIES[p.id] === cat.id).map((project) => (
                <MobileRegistryRow key={project.id} project={project} cat={cat} />
              ))}
            </div>
          </section>
        ))}
      </div>
      
      <TheCloser />
    </div>
  );
};
