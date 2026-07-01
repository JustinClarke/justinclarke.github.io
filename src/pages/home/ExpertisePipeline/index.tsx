/**
 * ExpertisePipeline interactive skill DAG section on the home page.
 *
 * Fits in: Home.tsx, lazily loaded so its Lucide icons don't bloat the initial bundle.
 * Note: the DAG edges are SVG paths drawn between real DOM nodes. A
 *   ResizeObserver watches the grid and increments a tick counter to force
 *   re-renders whenever the layout changes, keeping edge coordinates accurate.
 *
 * For beginners ----------------------------------------------------------------
 * This is the most state-heavy component on the homepage. Three skill columns
 * (data in ./data.ts, cards in ./SkillColumn.tsx) sit on top of an SVG layer
 * that draws curved "pipes" between related skills (./DagEdge.tsx). This file
 * is the orchestrator: it remembers which skill you are hovering, walks the
 * edge list to find everything upstream/downstream of it (the "lineage"), and
 * hands each child the yes/no answers it needs to light up or dim.
 * -----------------------------------------------------------------------------
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

// LEARN: silent-by-default logger. Enable in the browser console with
//    localStorage.debug = 'pipeline'  then refresh (see src/utils/debug.ts).
const log = debug('pipeline');

export const ExpertisePipeline: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // LEARN: a Map from skill name to its real DOM element. Each card registers
  //    itself here as it mounts (see registerNode below), so the SVG layer can
  //    measure where to draw edges. A ref (not state) because updating it
  //    should NOT cause a re-render it's bookkeeping, not display data.
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // LEARN: five separate pieces of state, by what the user is doing:
  //    expandedSkill   tapped-open card (mobile), userHoveredSkill  mouse
  //    hover (desktop), activeIdleSkill  the auto-demo's pick when you go
  //    idle, isIntersecting  is the section on screen, activeStage  which
  //    column the mobile tab bar shows.
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [userHoveredSkill, setUserHoveredSkill] = useState<string | null>(null);
  const [activeIdleSkill, setActiveIdleSkill] = useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  // Incrementing this forces DagEdge to re-render and recalculate
  // getBoundingClientRect() after window resizes.
  // LEARN: we never read this number the empty slot in `[, setTick]` skips
  //    the value. Bumping state is just the lever that makes React re-render.
  const [, setTick] = useState(0);

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // LEARN: useMemo computes a value once and reuses it on later renders the
  //    `[]` dependency list means "never recompute". flatMap flattens the
  //    three per-stage lists into one array of all 15 skill names.
  const allSkillNames = React.useMemo(() => {
    return SKILLS.flatMap(stage => stage.items.map(item => item.name));
  }, []);

  // Intersection observer to track if the section is in view
  // LEARN: IntersectionObserver is a browser API that calls you back when an
  //    element enters/leaves the viewport much cheaper than listening to
  //    every scroll event. threshold 0.15 = "count it once 15% is visible".
  //    The `([entry])` destructures the first item out of the callback's array.
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

  // Idle timer logic
  // LEARN: the auto-demo. When the section is on screen and the visitor does
  //    nothing for 0.9s, start picking a random skill every 3s as if a ghost
  //    were hovering. ANY activity (mouse, key, scroll, touch) resets the
  //    timer and stops the show. Timer ids live in refs so each re-run of the
  //    effect can cancel the previous run's timers.
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
        // LEARN: `currentSkill` is captured by nextRandomSkill below a
        //    closure. It lives on between interval ticks, letting the picker
        //    re-roll until it lands on a DIFFERENT skill than last time.
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

    // LEARN: `{ passive: true }` promises the browser this listener never
    //    calls preventDefault(), so scrolling stays smooth while we listen.
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

  // Watch for grid resizes so edges stay geometrically accurate
  // LEARN: ResizeObserver = IntersectionObserver's sibling for size changes.
  //    Edge coordinates are measured from the live DOM, so any reflow must
  //    trigger a re-render hence the tick bump (explained at setTick above).
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

  // Debounced hover small delay prevents edge flickering during fast mouse moves
  // LEARN: moving between two cards fires leave→enter within a few ms. Leave
  //    doesn't clear the hover immediately; it schedules the clear 150ms out,
  //    and entering the next card cancels it so the highlight never blinks.
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (skillName: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    setUserHoveredSkill(skillName);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setUserHoveredSkill(null), 150);
  };

  // LEARN: an effect that ONLY returns a cleanup it does nothing on mount,
  //    but cancels any pending hover-clear timer when the section unmounts.
  useEffect(() => () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }, []);

  // LEARN: a real hover always beats the idle demo's pick.
  const hoveredSkill = userHoveredSkill || activeIdleSkill;

  // ── DAG lineage helpers ──────────────────────────────────────────────────────

  // LEARN: given the hovered skill, find every skill connected to it through
  //    the edge list both its sources ("up") and its consumers ("down").
  //    This is a breadth-first graph walk: keep a queue of nodes to visit, and
  //    a Set of already-visited ones so shared paths aren't walked twice.
  const getActiveLineage = (hovered: string | null) => {
    if (!hovered) return { nodes: [] as string[], edges: [] as [string, string][] };

    const walk = (start: string, direction: 'up' | 'down') => {
      const visited = new Set<string>();
      let queue = [start];
      while (queue.length > 0) {
        // LEARN: the `!` after shift() tells TypeScript "this is not undefined"
        //    safe here because the loop condition guarantees a non-empty queue.
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

  // LEARN: these are computed fresh during every render, not stored in state.
  //    State is for facts React must remember; anything derivable from state
  //    should just be derived keeping one source of truth.
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
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-fg/30 font-bold whitespace-nowrap">Expertise</span>
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

          {/* Lineage console bar (desktop only) */}
          {/* LEARN: the hovered stage's colour flows in through the --tech-rgb
              CSS variable (the Tailwind contract's pattern for JS-dynamic
              values); every rgb()/rgba() below reuses it. aria-live="polite"
              makes screen readers announce the narrative text when it changes. */}
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
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-fg/50 font-bold whitespace-nowrap">Lineage Console</span>
              <span className="text-fg/25 font-mono text-[10px] select-none">|</span>
              <div className="h-4 flex items-center overflow-hidden w-full">
                {/* LEARN: AnimatePresence lets a component animate OUT before
                    it is removed. mode="wait" plays exit then enter in
                    sequence, and keying on the skill name tells React "this is
                    a NEW element" each time, which is what triggers the swap. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hoveredSkill || 'idle'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="flex items-center gap-1.5 w-full"
                  >
                    <span className={cn('font-mono text-[10.5px] transition-colors duration-300 truncate', activeStageObj ? 'text-fg/90' : 'text-fg/50')}>
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
            <div className="flex items-center gap-4 font-mono text-[9px] text-fg/40 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-fg/45">NODE:</span>
                <span className={cn('font-bold transition-colors duration-300', activeStageObj ? 'text-fg' : 'text-fg/40')}>
                  {hoveredSkill ? hoveredSkill.toLowerCase().replace(/\s+/g, '_') : 'none'}
                </span>
              </div>
              <span className="text-fg/20">/</span>
              <div className="flex items-center gap-1.5">
                <span className="text-fg/45">STATUS:</span>
                <span className={cn('font-bold transition-colors duration-300', activeStageObj ? activeStageObj.color : 'text-fg/40')}>
                  {activeStageObj ? 'ACTIVE_ROUTING' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile stage tab selector */}
          {/* LEARN: phones show one column at a time, picked by these tabs.
              The motion.div with layoutId="activeTabGlow" is one shared
              element that Framer Motion slides between tabs when the active
              one changes (a "magic motion" layout animation). */}
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
                    isActive ? cn('bg-fg/[0.04] border border-edge', stage.color) : 'text-fg/40 border border-transparent hover:text-fg/70'
                  )}
                >
                  <span className="text-[9px] font-black tracking-[0.15em] opacity-60">0{i + 1}</span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">{shortName}</span>
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
            {/* SVG edge layer (desktop only, z-0, behind cards) */}
            {/* LEARN: pointer-events-none lets clicks pass through the SVG to
                the cards underneath; aria-hidden hides this purely decorative
                layer from screen readers. One <DagEdge> per edge in the data. */}
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
                  // LEARN: children don't change the parent's data directly
                  //    they call functions the parent handed them. This one files
                  //    each card's DOM node into the nodeRefs Map by name.
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
