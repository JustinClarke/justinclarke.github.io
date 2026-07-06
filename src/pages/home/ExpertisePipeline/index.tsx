/**
 * ExpertisePipeline interactive skill DAG section on the home page.
 *
 * Fits in: Home.tsx, lazily loaded so its Lucide icons don't bloat the initial bundle.
 * Note: the DAG edges are SVG paths drawn between real DOM nodes. A
 *   ResizeObserver watches the grid and increments a tick counter to force
 *   re-renders whenever the layout changes, keeping edge coordinates accurate.
 *
 * This file is the orchestrator: it remembers which skill you are hovering,
 * walks the edge list to find everything upstream/downstream of it (the
 * "lineage"), and hands each child the yes/no answers it needs to light up or dim.
 */
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, debug } from '@/utils';
import { MousePointer2 } from 'lucide-react';
import { ScrollReveal } from '@/ui';
import { InteractiveHint } from '@/ui/InteractiveHint';
import { SKILLS, ALL_EDGES, NARRATIVES } from './data';
import { DagEdge } from './DagEdge';
import { SkillColumn } from './SkillColumn';

// Silent-by-default logger (localStorage.debug = 'pipeline'); see utils/debug.ts.
const log = debug('pipeline');

export const ExpertisePipeline: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Map from skill name to its DOM element. Each card registers itself here on
  // mount (registerNode below) so the SVG layer can measure where to draw edges.
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Five pieces of state, one per interaction: expandedSkill (tapped card,
  // mobile), userHoveredSkill (desktop hover), activeIdleSkill (auto-demo pick),
  // isIntersecting (section on screen), activeStage (mobile tab column).
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [userHoveredSkill, setUserHoveredSkill] = useState<string | null>(null);
  const [activeIdleSkill, setActiveIdleSkill] = useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  // Never read the value only bumped to force a re-render (and a fresh
  // getBoundingClientRect measure) so DagEdge recalculates after a resize.
  const [, setTick] = useState(0);

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Flatten the three per-stage lists into one array of all 15 skill names.
  const allSkillNames = React.useMemo(() => {
    return SKILLS.flatMap(stage => stage.items.map(item => item.name));
  }, []);

  // Track whether the section is in view (threshold 0.15 = 15% visible); gates
  // the idle auto-demo below.
  useEffect(() => {
    const el = document.getElementById('expertise');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Idle auto-demo: when the section is on screen and the visitor idles for 0.9s,
  // ghost-hover a random skill every 3s. Any activity (mouse/key/scroll/touch)
  // resets the timer and stops the show. Timer ids live in refs so each effect
  // re-run can cancel the previous run's timers.
  useEffect(() => {
    if (!isIntersecting || userHoveredSkill) {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setActiveIdleSkill(null);
      return;
    }

    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setActiveIdleSkill(null);

      idleTimeoutRef.current = setTimeout(() => {
        // Carried between interval ticks so the picker re-rolls until it lands
        // on a different skill than last time.
        let currentSkill: string | null = null;

        const nextRandomSkill = () => {
          if (allSkillNames.length === 0) return null;
          if (allSkillNames.length === 1) return allSkillNames[0];
          let next = currentSkill;
          while (next === currentSkill) {
            const idx = Math.floor(Math.random() * allSkillNames.length);
            next = allSkillNames[idx];
          }
          currentSkill = next;
          return next;
        };

        const first = nextRandomSkill();
        log('idle demo: start', first);
        setActiveIdleSkill(first);

        cycleIntervalRef.current = setInterval(() => {
          const next = nextRandomSkill();
          log('idle demo:', next);
          setActiveIdleSkill(next);
        }, 3000);
      }, 900); // 0.90 seconds
    };

    resetIdleTimer();

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetIdleTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isIntersecting, userHoveredSkill, allSkillNames]);

  // Edge coordinates are measured from the live DOM, so any grid reflow must
  // trigger a re-render hence the tick bump on every ResizeObserver fire.
  useEffect(() => {
    setTick(t => t + 1);
    const el = gridRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setTick(t => t + 1));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleExpand = (skillName: string) => {
    log('toggle', skillName);
    setExpandedSkill(prev => {
      const next = prev === skillName ? null : skillName;
      // On phones there is no hover, so tapping a card also drives the
      // hover-based lineage highlighting.
      if (window.innerWidth < 768) setUserHoveredSkill(next);
      return next;
    });
  };

  // Debounced hover: moving between cards fires leave→enter within a few ms, so
  // leave schedules the clear 150ms out and enter cancels it the lineage
  // highlight never blinks during fast mouse moves.
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (skillName: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    setUserHoveredSkill(skillName);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setUserHoveredSkill(null), 150);
  };

  useEffect(() => () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }, []);

  // A real hover always beats the idle demo's pick.
  const hoveredSkill = userHoveredSkill || activeIdleSkill;

  // ── DAG lineage helpers ──────────────────────────────────────────────────────

  // Given the hovered skill, find every skill connected to it through the edge
  // list both its sources ("up") and consumers ("down") via a BFS graph walk.
  const getActiveLineage = (hovered: string | null) => {
    if (!hovered) return { nodes: [] as string[], edges: [] as [string, string][] };

    const walk = (start: string, direction: 'up' | 'down') => {
      const visited = new Set<string>();
      const queue = [start];
      while (queue.length > 0) {
        const cur = queue.shift()!;
        for (const [from, to] of ALL_EDGES) {
          const neighbour = direction === 'up' ? (to === cur ? from : null) : (from === cur ? to : null);
          if (neighbour && !visited.has(neighbour)) { visited.add(neighbour); queue.push(neighbour); }
        }
      }
      return visited;
    };

    const ancestors = walk(hovered, 'up');
    const descendants = walk(hovered, 'down');
    const activeNodes = [hovered, ...ancestors, ...descendants];
    const activeEdges = ALL_EDGES.filter(([from, to]) => {
      const up = (from === hovered || ancestors.has(from)) && (to === hovered || ancestors.has(to));
      const down = (from === hovered || descendants.has(from)) && (to === hovered || descendants.has(to));
      return up || down;
    });

    return { nodes: activeNodes, edges: activeEdges };
  };

  // Derived every render from hoveredSkill not stored in state.
  const activeLineage = hoveredSkill ? getActiveLineage(hoveredSkill) : null;
  const isEdgeActive = (from: string, to: string) =>
    activeLineage?.edges.some(([f, t]) => f === from && t === to) ?? false;
  const isNodeInLineage = (name: string) =>
    activeLineage ? activeLineage.nodes.includes(name) : true;
  const getEdgeRgb = (fromName: string) =>
    SKILLS.find(s => s.items.some(i => i.name === fromName))?.rgb ?? '0, 200, 180';

  const activeStageObj = hoveredSkill
    ? SKILLS.find(s => s.items.some(i => i.name === hoveredSkill)) ?? null
    : null;

  return (
    <section
      id="expertise"
      className="section-layout text-fg scroll-mt-25 border-t border-edge-soft relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
        <div className="float-orb absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" style={{ animationDelay: '0s' } as React.CSSProperties} />
        <div className="float-orb absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px]" style={{ animationDelay: '-4s' } as React.CSSProperties} />
      </div>

      <div className="project-container relative z-10">

        {/* Section header */}
        <div className="narrative-gap border-b border-edge pb-12 flex flex-col gap-4">
          <ScrollReveal direction="right" distance={12} className="flex items-center gap-6">
            <span className="font-mono text-micro tracking-[0.4em] uppercase text-fg-mid font-bold whitespace-nowrap">Expertise</span>
            <div className="flex-1 h-px bg-edge" />
            <InteractiveHint text="TAP TO FOCUS" mobileText="TAP TO FOCUS" icon={MousePointer2} delay={0.25} direction="left" className="md:hidden" />
          </ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <ScrollReveal delay={0.1}>
              <h2 className="font-noto text-5xl md:text-7xl font-black tracking-tighter text-fg leading-[0.85]">
                What I bring to the{' '}
                <em className="font-playfair italic font-normal text-brand-primary">stack.</em>
              </h2>
            </ScrollReveal>
            <InteractiveHint text="HOVER SKILLS TO TRACE PIPELINE" mobileText="TAP SKILLS TO REVEAL DETAILS" icon={MousePointer2} delay={0.25} direction="left" className="hidden md:block" />
          </div>
        </div>

        <ScrollReveal delay={0.2} className="w-full">

          {/* Lineage console bar (desktop only). The hovered stage's colour flows in
              through the --tech-rgb CSS variable; every rgb()/rgba() below reuses it.
              aria-live="polite" announces the narrative text to screen readers when it changes. */}
          <div
            className={cn(
              'hidden md:flex items-center justify-between px-5 py-3.5 rounded-xl border mb-6',
              'bg-surface-2/60 backdrop-blur-md transition-all duration-300',
              activeStageObj ? 'border-edge' : 'border-edge-soft'
            )}
            style={{
              '--tech-rgb': activeStageObj ? activeStageObj.rgb : '148, 163, 184',
              borderColor: activeStageObj ? `rgba(var(--tech-rgb), 0.2)` : 'var(--color-edge-soft)',
            } as React.CSSProperties}
            aria-live="polite"
          >
            <div className="flex items-center gap-3 w-[70%]">
              <span className="relative flex h-2 w-2">
                {activeStageObj && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: `rgb(var(--tech-rgb))` }} />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 transition-colors duration-300" style={{ backgroundColor: activeStageObj ? `rgb(var(--tech-rgb))` : 'var(--color-fg-faint)', boxShadow: activeStageObj ? `0 0 8px rgb(var(--tech-rgb))` : 'none' }} />
              </span>
              <span className="font-mono text-micro uppercase tracking-[0.25em] text-fg-mid font-bold whitespace-nowrap">Lineage Console</span>
              <span className="text-fg/25 font-mono text-micro select-none">{/* tw-allow-contrast */}|</span>
              <div className="h-4 flex items-center overflow-hidden w-full">
                {/* Keying on the skill name swaps this line on every change;
                    mode="wait" plays the old line out before the new one in. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredSkill || 'idle'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="flex items-center gap-1.5 w-full"
                  >
                    <span className={cn('font-mono text-micro transition-colors duration-300 truncate', activeStageObj ? 'text-fg' : 'text-fg-mid')}>
                      {hoveredSkill ? NARRATIVES[hoveredSkill] : 'Awaiting node connection. Hover any skill below to trace pipeline lineage.'}
                    </span>
                    <span
                      className="w-1.5 h-3 animate-pulse ml-0.5 inline-block shrink-0"
                      style={{ backgroundColor: activeStageObj ? `rgb(var(--tech-rgb))` : 'rgb(0, 200, 180)', animationDuration: '1s' }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono text-micro text-fg-mid shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-fg-mid">NODE:</span>
                <span className={cn('font-bold transition-colors duration-300', activeStageObj ? 'text-fg' : 'text-fg-mid')}>
                  {hoveredSkill ? hoveredSkill.toLowerCase().replace(/\s+/g, '_') : 'none'}
                </span>
              </div>
              <span className="text-fg/20">{/* tw-allow-contrast */}/</span>
              <div className="flex items-center gap-1.5">
                <span className="text-fg-mid">STATUS:</span>
                <span className={cn('font-bold transition-colors duration-300', activeStageObj ? activeStageObj.color : 'text-fg-mid')}>
                  {activeStageObj ? 'ACTIVE_ROUTING' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile stage tab selector: phones show one column at a time, picked by these tabs. */}
          <div className="flex md:hidden items-center justify-between border border-edge-soft bg-surface-2/30 rounded-xl p-1 mb-5 relative z-20">
            {SKILLS.map((stage, i) => {
              const isActive = activeStage === i;
              const shortName = stage.cat.split(' ')[0];
              return (
                <button
                  key={stage.cat}
                  onClick={() => { setActiveStage(i); setExpandedSkill(null); setUserHoveredSkill(null); }}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-center font-mono transition-all duration-300 relative flex flex-col items-center justify-center gap-0.5',
                    isActive ? cn('bg-fg/[0.04] border border-edge', stage.color) : 'text-fg-mid border border-transparent hover:text-fg-soft'
                  )}
                >
                  <span className="text-micro font-black tracking-[0.15em] opacity-60">0{i + 1}</span>
                  <span className="text-fine font-extrabold uppercase tracking-wider">{shortName}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full', stage.bg)}
                      style={{ boxShadow: `0 0 8px rgba(${stage.rgb}, 0.8)` }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid + SVG DAG overlay */}
          <div
            ref={gridRef}
            className="relative select-none pb-12 md:pb-20"
            onMouseLeave={handleMouseLeave}
          >
            {/* SVG edge layer (desktop only, z-0, behind cards). pointer-events-none
                lets clicks reach the cards; aria-hidden keeps this decorative
                layer out of the a11y tree. One <DagEdge> per edge. */}
            <svg
              ref={svgRef}
              className="hidden md:block absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0"
              aria-hidden="true"
            >
              {ALL_EDGES.map(([from, to]) => (
                <DagEdge
                  key={`${from}→${to}`}
                  fromName={from}
                  toName={to}
                  nodeRefs={nodeRefs}
                  svgRef={svgRef}
                  isActive={isEdgeActive(from, to)}
                  isHovering={hoveredSkill !== null}
                  rgb={getEdgeRgb(from)}
                />
              ))}
            </svg>

            {/* Card grid (z-[1], above SVG) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-[1]">
              {SKILLS.map((stage, i) => (
                <SkillColumn
                  key={stage.cat}
                  stage={stage}
                  stageIndex={i}
                  isActive={activeStage === i}
                  expandedSkill={expandedSkill}
                  hoveredSkill={hoveredSkill}
                  onToggleExpand={toggleExpand}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  registerNode={(name, el) => nodeRefs.current.set(name, el)}
                  isNodeInLineage={isNodeInLineage}
                />
              ))}
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
};
