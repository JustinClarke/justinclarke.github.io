import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ExpandableTabs } from '../ui/ExpandableTabs';
import { STATS, LINKS } from '../../data/projectStats';
import { smoothScrollTo } from '@/utils';
import type { TabItem } from '../ui/ExpandableTabs';
import { CapabilitiesSection } from '../sections/CapabilitiesSection';
import { IngestionSection } from '../sections/IngestionSection';
import { PipelineSection } from '../sections/PipelineSection';
import { EngineeringDecisionsSection } from '../sections/EngineeringDecisionsSection';
import { ScienceSection } from '../sections/ScienceSection';
import { OutputSection } from '../sections/OutputSection';
import { MLImpactSection } from '../sections/MLImpactSection';
import { ValidationSection } from '../sections/ValidationSection';
import { DocsGovernanceSection } from '../sections/DocsGovernanceSection';
import { CaseStudiesSection } from '../sections/CaseStudiesSection';

const NAV_ITEMS: TabItem[] = [
  { id: 'capabilities', label: 'Capabilities', icon: 'Gauge', color: 'text-f1-red', iconClassName: '-translate-y-[1.5px]' },
  { id: 'pipeline', label: 'Pipeline', icon: 'Cpu', color: 'text-amber-400' },
  { id: 'science', label: 'Science', icon: 'BookOpen', color: 'text-emerald-400' },
  { id: 'case-studies', label: 'Findings', icon: 'LineChart', color: 'text-purple-400' },
  { id: 'ml', label: 'ML', icon: 'BarChart2', color: 'text-blue-400' },
  { id: 'validation', label: 'Validation', icon: 'CheckSquare', color: 'text-cyan-400' },
];

function FloatingNav() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    let ticking = false;
    let innerHeight = window.innerHeight;
    let docHeight = document.documentElement.scrollHeight;

    const handleResize = () => {
      innerHeight = window.innerHeight;
      docHeight = document.documentElement.scrollHeight;
    };
    
    const ro = new ResizeObserver(() => {
      docHeight = document.documentElement.scrollHeight;
    });
    ro.observe(document.body);
    window.addEventListener('resize', handleResize, { passive: true });

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollPosition = scrollY + innerHeight;

          if (scrollY < 50) {
            setActiveSection('');
          } else if (scrollY >= 50 && scrollY < innerHeight * 0.7) {
            setActiveSection('capabilities');
          }

          if (scrollY < 100) {
            setNavVisible(true);
          } else if (docHeight - scrollPosition < 450) {
            setNavVisible(false);
          } else {
            setNavVisible(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const timer = setTimeout(handleScroll, 500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '');
            setActiveSection(id);
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(`section-${item.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavChange = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`section-${id}`);
    if (el) smoothScrollTo(el, 2.2, 80);
  }, []);

  return createPortal(
    <div className="flex flex-col items-center gap-1.5 transform-gpu" style={{ position: 'fixed', bottom: 'calc(clamp(16px, 4vw, 45px) + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%) translateZ(0)', WebkitTransform: 'translateX(-50%) translateZ(0)', zIndex: 9999, opacity: navVisible ? 1 : 0, pointerEvents: navVisible ? 'auto' : 'none', transition: 'opacity 0.4s ease', maxWidth: 'calc(100vw - 32px)' }}>
      {!activeSection ? (
        <>
          {/* Mobile: Scroll or tap to explore */}
          <div className="md:hidden flex items-center gap-1.5 animate-pulse transform-gpu" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(12,17,16,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px 14px', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,230,224,0.5)', fontWeight: 700 }}>
              Scroll or tap to explore
            </span>
          </div>
          {/* Desktop: Scroll or tap to view */}
          <div className="hidden md:flex items-center gap-1.5 animate-pulse transform-gpu" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(12,17,16,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px 14px', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,230,224,0.5)', fontWeight: 700 }}>
              Scroll or tap to view
            </span>
          </div>
        </>
      ) : (() => {
        const activeItem = NAV_ITEMS.find(i => i.id === activeSection);
        return activeItem ? (
          <div className="md:!hidden flex items-center gap-1.5 transform-gpu" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(12,17,16,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px 14px', WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,230,224,0.5)', fontWeight: 700 }}>
              {activeItem.label}
            </span>
          </div>
        ) : null;
      })()}
      <ExpandableTabs
        items={NAV_ITEMS}
        activeId={activeSection}
        onChange={handleNavChange}
      />
    </div>,
    document.body
  );
}

export function SourceView() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal-element').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-graphite-900 text-white">

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-32 flex flex-col gap-20 animate-page-fade">

        {/* 01 + 02 : Capabilities & Ingestion */}
        <section
          id="section-capabilities"
          className="scroll-mt-24 flex flex-col gap-16"
        >
          <CapabilitiesSection id="capabilities" />
          <IngestionSection id="ingestion" />
        </section>

        {/* 03 : Pipeline / Transform DAG + invariant */}
        <section
          id="section-pipeline"
          className="scroll-mt-24 flex flex-col gap-8"
        >
          <div id="pipeline">
            <div className="max-w-xl mb-8">
              <span className="font-jetbrains text-[10px] text-f1-red uppercase tracking-[0.2em] mb-4 block">
                03 / Transform : DAG & Invariant
              </span>
              <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter mb-4">
                {STATS.dbtModels} dbt models.<br />One enforced invariant.
              </h2>
              <p className="text-white/50 text-sm font-jetbrains leading-relaxed">
                Every model is a node in a directed acyclic graph. Every edge has a test. The 7-term identity  - components sum to within ±0.0001s of the actual lap time  - runs on CI against every race in the dataset. If it breaks, the build breaks.
              </p>
            </div>
            <PipelineSection />
          </div>
          <EngineeringDecisionsSection id="engineering" />
        </section>

        {/* 04 + 05 : Science + Output */}
        <section
          id="section-science"
          className="scroll-mt-24 flex flex-col gap-8"
        >
          <ScienceSection id="science" />
          <OutputSection id="output" />
        </section>

        {/* 05.5 : Findings / Case Studies */}
        <section
          id="section-case-studies"
          className="scroll-mt-24"
        >
          <CaseStudiesSection id="case-studies" />
        </section>

        {/* 06 : Machine Learning */}
        <section
          id="section-ml"
          className="scroll-mt-24"
        >
          <MLImpactSection id="ml-impact" />
        </section>

        {/* 07 + 08 : Validation & Docs/Governance */}
        <section
          id="section-validation"
          className="scroll-mt-24 flex flex-col gap-8"
        >
          <ValidationSection id="validation" />
          <DocsGovernanceSection id="docs-governance" />
        </section>

      </div>

      {/* Closer */}
      <section className="relative z-10 text-center py-12 px-6 overflow-hidden border-t border-white/5">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(225,6,0,0.08)_0%,transparent_75%)] pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-noto font-black text-white uppercase tracking-tighter mb-6 leading-none">
          Lap times lie.<br />You can now know why.
        </h2>
        <p className="font-jetbrains text-xs md:text-sm text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          A causal engine built from first principles. {STATS.racesIngested} races ingested. {STATS.seasons} seasons. {STATS.tests} dbt tests + {STATS.mlTests} ML tests. 5 XGBoost models. No cloud required.
        </p>        <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-3xl flex flex-col gap-3 mx-auto mt-4 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
            <a
              href={LINKS.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-f1-red text-white font-jetbrains text-xs font-bold uppercase tracking-wider px-4 py-3 rounded hover:bg-red-700 transition-all duration-200 shadow-[0_0_20px_rgba(225,6,0,0.2)]"
            >
              ↗ View on GitHub
            </a>
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/80 hover:text-white font-jetbrains text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200"
            >
              Read the Docs →
            </a>
            <a
              href="/f1"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/50 hover:text-white/80 font-jetbrains text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200"
            >
              See the Overview ↗
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-graphite-950/80 backdrop-blur-sm py-4 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left font-jetbrains text-[10px] text-white/40 tracking-wider">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-white/30">Built by</span>
          <span className="text-white/80 font-semibold">Justin Clarke</span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="text-white/30">Licensed</span>
          <span className="text-white/80 font-semibold">AGPL-3.0</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-f1-red font-black tracking-tighter">OFF THE PACE</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span className="text-white/30">F1 Causal Pace Engine</span>
          <span className="hidden sm:inline text-white/10">·</span>
          <span className="text-white/80 font-semibold">{STATS.seasonRange}</span>
        </div>
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold uppercase tracking-widest text-[9px] bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10 shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Pipeline Healthy
        </div>
      </footer>

      <FloatingNav />
    </div>
  );
}
