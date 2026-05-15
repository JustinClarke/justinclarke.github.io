import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils';
import { ScrollReveal, SectionContainer } from '@/ui';
import { projectsData } from '@/data/projects';

interface RelatedProjectsProps {
  currentProjectId: string;
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({ currentProjectId }) => {
  // Get all other projects and take 2 - memoized to prevent jerky re-renders
  const related = React.useMemo(() => {
    return projectsData
      .filter(p => p.id !== currentProjectId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  }, [currentProjectId]);

  if (related.length === 0) return null;

  return (
    <SectionContainer
      className="bg-[#050505] py-24 md:py-32 border-t border-white/5"
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Project Navigation
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-noto text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
              Explore Other <br className="md:hidden" />
              <span className="text-white/30 italic font-playfair lowercase font-normal">Records.</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {related.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <Link
                to={`/project/${project.id}`}
                className="group relative flex flex-col p-8 rounded-[32px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 hover:border-white/20 hover:-translate-y-2 overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-1000 pointer-events-none bg-white blur-[80px]" />
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase">Asset_Module</span>
                    <span className="font-mono text-[11px] text-white/60 font-bold uppercase tracking-widest">
                      [ {project.id.toUpperCase()} ]
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  <h3 className="font-mono text-2xl font-black text-white uppercase tracking-tighter group-hover:translate-x-2 transition-transform duration-700">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[13px] text-white/40 leading-relaxed max-w-sm line-clamp-2">
                    {project.copy}
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4 relative z-10">
                  <div className="flex-1 h-px bg-white/5 group-hover:bg-white/20 transition-colors duration-700" />
                  <span className="font-mono text-[8px] font-black tracking-[0.3em] uppercase text-white/20 group-hover:text-white/60 transition-colors duration-700">
                    Load_Dataset
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
