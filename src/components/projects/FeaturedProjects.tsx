import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, MousePointerClick } from 'lucide-react';
import { ScrollReveal } from '@/ui';
import { InteractiveHint } from '@/ui/InteractiveHint';
import { TOOLTIPS } from '@/config/tooltips';

import { F1TelemetryWidget } from '../bento/F1TelemetryWidget';
import { LiteStoreWidget } from '../bento/LiteStoreWidget';
import { SpotifyWidget } from '../bento/SpotifyWidget';
import { SqlDisasterWidget } from '../bento/SqlDisasterWidget';
import { BehaviouralRiskWidget } from '../bento/BehaviouralRiskWidget';

const CARDS = ['f1', 'litestore', 'spotify', 'sql', 'hr'] as const;
const CYCLING_CARDS = ['litestore', 'spotify', 'sql', 'hr'] as const satisfies CardId[];
type CardId = typeof CARDS[number];

const CARD_META: Record<CardId, { accent: string }> = {
  f1: { accent: 'var(--color-viz-mac-red)' },
  litestore: { accent: '#7e7ca6' },
  spotify: { accent: 'var(--color-viz-spotify)' },
  sql: { accent: '#ef4444' },
  hr: { accent: 'var(--color-acc-bi)' },
};

interface BentoCardProps {
  id: CardId;
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
  boxShadow: string;
  borderColor: string;
  gradientFrom: string;
  to: string;
}

function BentoCard({
  id,
  isActive,
  className = '',
  children,
  boxShadow,
  borderColor,
  gradientFrom,
  to,
}: BentoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const meta = CARD_META[id];
  const filmVisible = !isActive && !isHovered;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click target or any of its ancestors is an interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      window.open(to, '_blank');
      return;
    }

    navigate(to);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`rounded-3xl bg-neutral-900/40 border border-white/5 p-3 md:p-4 backdrop-blur-2xl transition-all duration-500 relative flex flex-col justify-between overflow-hidden shadow-2xl group cursor-pointer z-10 w-full h-full flex-grow ${className}`}
      style={{
        boxShadow: isHovered ? boxShadow : 'none',
        borderColor: isHovered || isActive ? borderColor : 'rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom} 0%, transparent 60%)`,
          opacity: isHovered ? 0.5 : 0.3,
        }}
      />

      <div className="relative z-10 flex flex-col h-full min-h-0 w-full flex-grow">
        {children}
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 rounded-3xl hidden lg:block"
        style={{
          background: 'rgba(5,5,5,0.72)',
          opacity: filmVisible ? 1 : 0,
          zIndex: 20,
        }}
      />

      <div
        className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full border pointer-events-none transition-all duration-300"
        style={{
          zIndex: 35,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
          color: meta.accent,
          borderColor: `color-mix(in srgb, ${meta.accent} 20%, transparent)`,
          background: `color-mix(in srgb, ${meta.accent} 9%, transparent)`,
        }}
      >
        <span className="font-mono text-[9px] font-black uppercase tracking-wider">View Project</span>
        <ArrowUpRight size={10} className="shrink-0" />
      </div>
    </div>
  );
}

export function FeaturedProjects() {
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    cycleRef.current = setInterval(() => {
      setActiveCardIdx(i => (i + 1) % CYCLING_CARDS.length);
    }, 4000);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const pct = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
        document.documentElement.style.setProperty('--bento-cx', `${pct.x}%`);
        document.documentElement.style.setProperty('--bento-cy', `${pct.y}%`);
        rafRef.current = null;
      });
    };
    let idleTimer: ReturnType<typeof setTimeout>;
    const handleIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        document.documentElement.style.setProperty('--bento-cx', '50%');
        document.documentElement.style.setProperty('--bento-cy', '10%');
      }, 2000);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousemove', handleIdle);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousemove', handleIdle);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(idleTimer);
    };
  }, []);

  const cyclingCard = CYCLING_CARDS[activeCardIdx];

  const cardProps = (id: CardId, shadow: string, border: string, gradient: string) => {
    const isActive = id === 'f1' || cyclingCard === id;
    return {
      id,
      isActive,
      boxShadow: shadow,
      borderColor: border,
      gradientFrom: gradient,
    };
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="section-layout text-white scroll-mt-25 border-t border-white/5 relative overflow-hidden"
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          zIndex: 0,
        }}
      />

      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle 600px at var(--bento-cx, 50%) var(--bento-cy, 10%), rgba(0,200,180,0.07) 0%, rgba(99,102,241,0.02) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />

      <div className="project-container relative" style={{ zIndex: 10 }}>
        {/* Section Header */}
        <div className="narrative-gap border-b border-white/10 pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold whitespace-nowrap">
              Manifest
            </span>
            <div className="flex-1 h-px bg-white/10" />
            <InteractiveHint
              text="PORTFOLIO DECK // CLICK TO EXPLORE WORK"
              mobileText="TAP TO EXPLORE"
              icon={MousePointerClick}
              delay={0.25}
              direction="left"
              className="md:hidden"
            />
          </ScrollReveal>
 
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85]">
                Featured <em className="font-playfair italic font-normal text-brand-primary">projects.</em>
              </h2>
            </ScrollReveal>
            <InteractiveHint
              text="PORTFOLIO DECK // CLICK TO EXPLORE WORK"
              mobileText="TAP A PROJECT TO EXPLORE WORK"
              icon={MousePointerClick}
              delay={0.25}
              direction="left"
              className="hidden md:block"
            />
          </div>
        </div>
 
        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1.2fr] gap-4 sm:gap-6 lg:gap-2" style={{ minHeight: '520px' }}>
 
          {/* COLUMN 1: F1 Telemetry + Connect */}
          <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 lg:gap-2">
            <div className="flex flex-col flex-1 min-h-0">
              <BentoCard
                {...cardProps('f1',
                  '0 10px 40px -15px rgba(255,95,87,0.12), inset 0 0 20px rgba(255,95,87,0.03)',
                  'rgba(255,95,87,0.2)',
                  'rgba(255,95,87,0.05)'
                )}
                to="/f1"
                className="flex-grow h-full"
              >
                <F1TelemetryWidget />
              </BentoCard>
            </div>
 
            <motion.div
              className="h-14 shrink-0 rounded-3xl overflow-hidden relative"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                to="/connect"
                className="group relative flex items-center justify-between w-full h-full px-4 sm:px-6 lg:px-4 xl:px-6 bg-gradient-to-r from-neutral-900/80 to-neutral-950/80 backdrop-blur-2xl border border-white/5 rounded-3xl transition-all duration-500 shadow-xl hover:shadow-[0_12px_30px_-10px_rgba(0,200,180,0.3),inset_0_0_20px_rgba(0,200,180,0.05)] hover:border-acc-lang/45 overflow-hidden"
              >
                {/* Cursor-tracked spotlight sweep */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle 120px at var(--bento-cx, 50%) var(--bento-cy, 50%), rgba(0,200,180,0.15), transparent 80%)'
                  }}
                />
 
                <div className="absolute inset-0 bg-gradient-to-r from-acc-lang/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
 
                <div className="flex items-center gap-4 relative z-10">
                  {/* Status Pulse Indicator */}
                  <span className="flex h-2.5 w-2.5 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-acc-lang opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-acc-lang" />
                  </span>
 
                  {/* Sliding Text Roll Mechanism */}
                  <div className="flex flex-col overflow-hidden h-5 relative">
                    <div className="transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:-translate-y-5">
                      {/* State 1: Active Protocol */}
                      <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-[10px] xl:text-[11px] 2xl:text-xs font-black tracking-[0.05em] xs:tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.1em] xl:tracking-[0.15em] 2xl:tracking-[0.2em] text-neutral-400 group-hover:text-white uppercase transition-colors whitespace-nowrap block h-5 leading-5">
                        LET'S WORK TOGETHER
                      </span>
                      {/* State 2: Direct Recruiter Callout */}
                      <span className="font-mono text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-[10px] xl:text-[11px] 2xl:text-xs font-black tracking-[0.05em] xs:tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.1em] xl:tracking-[0.15em] 2xl:tracking-[0.2em] text-brand-primary uppercase whitespace-nowrap block h-5 leading-5">
                        OPEN TO ROLES // CONNECT
                      </span>
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center gap-3 relative z-10 shrink-0">
                  {/* Availability Badge */}
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md border border-acc-lang/20 bg-acc-lang/5 font-mono text-[8px] text-acc-lang font-black tracking-wider select-none">
                    VISA · SPONSORED
                  </span>
 
                  <ArrowRight size={14} className="text-neutral-500 group-hover:text-acc-lang group-hover:translate-x-1.5 transition-all duration-300 shrink-0" />
                </div>
              </Link>
            </motion.div>
          </div>
 
          {/* COLUMN 2: LiteStore + Spotify */}
          <div className="lg:col-span-1 grid grid-rows-2 gap-4 sm:gap-6 lg:gap-2 min-h-0">
            <div className="row-span-1 min-h-0 flex flex-col">
              <BentoCard
                {...cardProps('litestore',
                  '0 10px 30px -15px rgba(126,124,166,0.15), inset 0 0 20px rgba(126,124,166,0.02)',
                  'rgba(126,124,166,0.25)',
                  'rgba(126,124,166,0.05)'
                )}
                to="/project/litestore"
                className="flex-grow h-full"
              >
                <LiteStoreWidget />
              </BentoCard>
            </div>
 
            <div className="row-span-1 min-h-0 flex flex-col">
              <BentoCard
                {...cardProps('spotify',
                  '0 10px 30px -15px rgba(29,185,84,0.15), inset 0 0 20px rgba(29,185,84,0.02)',
                  'rgba(29,185,84,0.25)',
                  'rgba(29,185,84,0.05)'
                )}
                to="/project/spotify-engine"
                className="flex-grow h-full"
              >
                <SpotifyWidget />
              </BentoCard>
            </div>
          </div>
 
          {/* COLUMN 3: SQL Disaster + Behavioral Risk */}
          <div className="lg:col-span-1 grid grid-rows-2 gap-4 sm:gap-6 lg:gap-2">
            <div className="row-span-1 min-h-0 flex flex-col">
              <BentoCard
                {...cardProps('sql',
                  '0 10px 40px -15px rgba(239,68,68,0.15), inset 0 0 20px rgba(239,68,68,0.02)',
                  'rgba(239,68,68,0.25)',
                  'rgba(239,68,68,0.05)'
                )}
                to="/project/sql-disaster"
                className="flex-grow h-full"
              >
                <SqlDisasterWidget />
              </BentoCard>
            </div>
 
            <div className="row-span-1 min-h-0 flex flex-col">
              <BentoCard
                {...cardProps('hr',
                  '0 10px 30px -15px rgba(168,85,247,0.15), inset 0 0 20px rgba(168,85,247,0.02)',
                  'rgba(168,85,247,0.25)',
                  'rgba(168,85,247,0.05)'
                )}
                to="/project/hr-archetype"
                className="flex-grow h-full"
              >
                <BehaviouralRiskWidget />
              </BentoCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
