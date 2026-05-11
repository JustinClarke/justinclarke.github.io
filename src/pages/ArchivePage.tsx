import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { ScrollReveal, BackToTerminal } from '@/ui';
import { ArrowUpRight } from 'lucide-react';
import {
  SpotifyVisual, LiteStoreVisual,
  SqlVisual, FinanceVisual, HRArchetypeVisual
} from '@/components/projects/Visuals';

interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  type: 'data' | 'brand' | 'academic';
}

const PROJECTS: Project[] = [
  { id: 'spotify-engine', title: 'Predictive Music Engine', desc: 'Terminal-first research engine benchmarking 3 models against the Spotify baseline. Uses a hierarchical TF-IDF + Acoustic stable sort on 1M songs.', tags: ['Streamlit', 'Python', 'Spotipy'], type: 'data' },
  { id: 'sql-disaster', title: 'Disaster Response System', desc: 'MySQL relational architecture modeled for Philippine relief ops, featuring 11 entities and 4 junction tables.', tags: ['MySQL', 'Relational Design'], type: 'data' },
  { id: 'litestore', title: 'Retail as a Service', desc: "Production-scale 'Store-as-a-Service' platform for D2C growth across India's premier shopping destinations.", tags: ['Next.js', 'MUI', 'Swiper'], type: 'brand' },
  { id: 'capital-budgeting', title: 'IDC: Capital Architecture', desc: 'Full-spectrum financial feasibility modeling for large-scale industrial assets using DCF and sensitivity analysis.', tags: ['Finance', 'Modeling'], type: 'academic' },
  { id: 'hr-archetype', title: 'Behavioral Intelligence Engine', desc: '8-way behavioral taxonomy engine with a 7-panel Gemini-powered dashboard and 40ms real-time telemetry.', tags: ['Gemini AI', 'Firestore'], type: 'academic' }
];

const CATEGORIES = [
  { id: 'data', label: 'Intelligence & Engineering', accent: 'text-brand-primary', bg: 'bg-brand-primary' },
  { id: 'brand', label: 'Systems & Identity', accent: 'text-[#ec4899]', bg: 'bg-[#ec4899]' },
  { id: 'academic', label: 'Theory & Research', accent: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]' },
];

const ProjectCard = ({ project, accent, bg }: { project: Project; accent: string; bg: string }) => (
  <ScrollReveal direction="up" distance={20}>
    <Link
      to={`/project/${project.id}`}
      className="group relative flex flex-col h-[600px] rounded-[40px] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-white/20 hover:-translate-y-3 shadow-2xl"
    >
      {/* Corner Brackets */}
      <div className={cn("absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-white/10 transition-colors duration-700 rounded-tl-sm group-hover:border-opacity-100", accent.replace('text-', 'border-'))} />
      <div className={cn("absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-white/10 transition-colors duration-700 rounded-tr-sm group-hover:border-opacity-100", accent.replace('text-', 'border-'))} />

      {/* Visual Aura Glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none blur-[100px]",
        bg
      )} />

      {/* Media Container */}
      <div className="relative h-[380px] border-b border-white/10 overflow-hidden flex items-center justify-center bg-black/20">
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 z-0" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="transform group-hover:scale-105 transition-transform duration-1000 ease-out flex items-center justify-center">
            {project.id === 'spotify-engine' ? <div className="scale-[2.2]"><SpotifyVisual /></div> : 
             project.id === 'sql-disaster' ? <div className="scale-[2]"><SqlVisual /></div> : 
             project.id === 'litestore' ? <div className="scale-[2]"><LiteStoreVisual /></div> : 
             project.id === 'capital-budgeting' ? <div className="scale-[2]"><FinanceVisual /></div> : 
             project.id === 'hr-archetype' ? <div className="scale-[2]"><HRArchetypeVisual /></div> : null}
          </div>
        </div>

        <div className="absolute top-10 left-10 z-20">
           <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase block mb-1">Asset_Record</span>
           <span className="font-mono text-[10px] text-white/60 font-bold uppercase tracking-widest">
             [ ARCH_{project.id.slice(0,2).toUpperCase()} ]
           </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-10 flex flex-col justify-between flex-1 relative z-10 bg-gradient-to-b from-transparent to-white/[0.01]">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className={cn("w-1 h-1 rounded-full animate-pulse", bg)} />
             <h3 className="font-mono text-2xl font-black text-white tracking-tighter uppercase group-hover:translate-x-2 transition-transform duration-700">
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
            accent + " group-hover:text-opacity-100 text-opacity-50"
          )}>
            Initialize Deep Dive
          </span>
          <div className={cn(
            "h-px flex-1 origin-left scale-x-50 group-hover:scale-x-100 transition-all duration-1000", 
            bg + " bg-opacity-20 group-hover:bg-opacity-60"
          )} />
          <ArrowUpRight className={cn("w-4 h-4 transition-all duration-700 group-hover:rotate-45", accent)} />
        </div>
      </div>
    </Link>
  </ScrollReveal>
);

const MobileRegistryRow = ({ project, accent, bg }: { project: Project; accent: string; bg: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <Link
      to={`/project/${project.id}`}
      className="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-white/[0.02] active:bg-white/[0.05] transition-all overflow-hidden"
    >
      <motion.div className={cn("absolute inset-0 opacity-0 group-active:opacity-5 transition-opacity pointer-events-none", bg)} />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
         <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
           [ {project.id.slice(0, 4).toUpperCase()} ]
         </span>
         <ArrowUpRight className={cn("w-4 h-4", accent)} />
      </div>
      
      <h3 className="font-mono text-lg font-black text-white uppercase tracking-tight mb-2 relative z-10">
        {project.title}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        {project.tags.slice(0, 2).map(tag => (
          <span key={tag} className="font-mono text-[8px] text-white/30 border border-white/10 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <span className={cn("font-mono text-[9px] font-bold tracking-[0.15em] uppercase", accent)}>
          Initialize
        </span>
        <div className={cn("h-px flex-1", bg + " bg-opacity-20")} />
      </div>
    </Link>
  </motion.div>
);

export const ArchivePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-primary/30 font-sans">
      <BackToTerminal />

      <section className="relative pt-24 md:pt-48 pb-16 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,180,0.15)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
               <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-brand-primary uppercase font-black">
                 PROJECT_ARCHIVE_SYSTEM_v2.0
               </span>
               <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            </div>

            <h1 className="font-noto text-5xl sm:text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.85] md:leading-[0.8] mb-8 md:mb-12 uppercase">
              Full<br />
              <span className="text-white/10 italic font-playfair lowercase font-normal">Registry.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto mt-8 md:mt-12 border-t border-white/5 pt-8 md:pt-12">
               {[
                 { label: 'Total Assets', value: PROJECTS.length.toString().padStart(2, '0') },
                 { label: 'System Ops', value: 'Active' },
                 { label: 'Encryption', value: 'SHA-256' }
               ].map(stat => (
                 <div key={stat.label} className="flex flex-col gap-1">
                   <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{stat.label}</span>
                   <span className="font-mono text-sm font-black text-white">{stat.value}</span>
                 </div>
               ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32 md:pb-64 space-y-24 md:space-y-48">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} className="flex flex-col gap-12 md:gap-20">
            <ScrollReveal direction="left">
              <div className="flex items-end gap-6 md:gap-8">
                <h2 className="font-noto text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                  {cat.id}<span className={cat.accent}>.</span>
                </h2>
                <div className="flex flex-col mb-1 md:mb-2">
                  <span className={cn("font-mono text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-black", cat.accent)}>
                    {cat.label}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {PROJECTS.filter(p => p.type === cat.id).map((project) => (
                <ProjectCard key={project.id} project={project} accent={cat.accent} bg={cat.bg} />
              ))}
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col gap-4">
              {PROJECTS.filter(p => p.type === cat.id).map((project) => (
                <MobileRegistryRow key={project.id} project={project} accent={cat.accent} bg={cat.bg} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
