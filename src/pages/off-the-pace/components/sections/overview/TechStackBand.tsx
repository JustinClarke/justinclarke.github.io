import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/utils';

interface StackItem {
  name: string;
  sub: string;
  color: string;
  rgb: string;
  step: string;
  icon: React.ReactNode;
}

const stack: StackItem[] = [
  {
    name: 'Python',
    sub: 'ingestion',
    color: '#3776AB',
    rgb: '55, 118, 171',
    step: '01',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M14.25.18c-.98-.08-1.97-.03-2.96-.03-.89.03-1.78-.05-2.66.12A6.52 6.52 0 003.88 5c-.75 1.54-.7 3.32-.7 4.97V11h3.1v-1.12c.03-1.6.86-3.23 2.45-3.66.92-.25 1.9-.12 2.85-.16h3.48c1.3-.04 2.47.88 2.68 2.18.23 1.45-.63 2.89-2.07 3.2-1 .2-2.03.11-3.04.12H9.08c-1.74.03-3.53.53-4.8 1.77a6.22 6.22 0 00-1.74 4.88c.07 1.63.76 3.23 2 4.25A7 7 0 009 23.95c1.47-.07 2.95 0 4.42-.03.73-.04 1.46.03 2.18-.1a6.38 6.38 0 004.55-4.43c.72-1.63.66-3.46.67-5.2V13h-3.1v1.17c-.03 1.5-.78 3.02-2.22 3.51-.9.3-1.89.17-2.83.2H9.17c-1.32.04-2.52-.89-2.73-2.2-.24-1.48.65-2.94 2.12-3.23 1.05-.2 2.12-.11 3.19-.12h3.58c1.8-.02 3.68-.53 4.96-1.86a6.39 6.39 0 001.7-5.08 6.46 6.46 0 00-2.32-4.7A7.32 7.32 0 0014.25.18zM8.34 3.03a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33zm7.32 15.61a1.16 1.16 0 11.02 2.33 1.16 1.16 0 01-.02-2.33z" />
      </svg>
    ),
  },
  {
    name: 'FastF1',
    sub: 'telemetry',
    color: 'var(--color-f1-red)',
    rgb: '225, 6, 0',
    step: '02',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0-10 10c0 2.2.7 4.2 2 5.9l1.4-1.4A8 8 0 0 1 12 4c4.4 0 8 3.6 8 8 0 1.5-.4 3-1.2 4.2l1.4 1.4a10 10 0 0 0 1.8-5.6A10 10 0 0 0 12 2z" />
        <path d="M12 9v3l2 2" />
      </svg>
    ),
  },
  {
    name: 'dbt',
    sub: 'transform',
    color: '#FF694B',
    rgb: '255, 105, 75',
    step: '03',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-21.75c-5.38 0-9.75 4.37-9.75 9.75a9.72 9.72 0 0 0 2.22 6.17l.08.1.02.02c2.03 2.33 4.97 3.46 7.43 3.46 5.38 0 9.75-4.37 9.75-9.75 0-2.58-1.01-4.94-2.86-6.79A9.7 9.7 0 0 0 12 2.25zm0 13.5a3.75 3.75 0 1 1 3.75-3.75 3.75 0 0 1-3.75 3.75z" />
      </svg>
    ),
  },
  {
    name: 'SQL',
    sub: 'query',
    color: '#00758F',
    rgb: '0, 117, 143',
    step: '04',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    name: 'DuckDB',
    sub: 'warehouse',
    color: '#FFF176',
    rgb: '255, 241, 118',
    step: '05',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
        <path d="M12 3c-4.42 0-8 1.79-8 4s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4z" />
        <path d="M4 7v5c0 2.21 3.58 4 8 4s8-1.79 8-4V7" />
        <path d="M4 12v5c0 2.21 3.58 4 8 4s8-1.79 8-4v-5" />
      </svg>
    ),
  },
  {
    name: 'XGBoost',
    sub: 'ML',
    color: '#4CAF50',
    rgb: '76, 175, 80',
    step: '06',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    name: 'ONNX',
    sub: 'inference',
    color: '#29B6F6',
    rgb: '41, 182, 246',
    step: '07',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <path d="M12 8L6.5 16.5M12 8l5.5 8.5M8 19h8" />
      </svg>
    ),
  },
  {
    name: 'React',
    sub: 'app',
    color: '#61DAFB',
    rgb: '97, 218, 251',
    step: '08',
    icon: (
      <svg viewBox="-11.5 -10.23 23 20.47" className="w-4 h-4 fill-none stroke-current" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        <circle r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'GitHub Actions',
    sub: 'CI',
    color: '#7C3AED',
    rgb: '124, 58, 237',
    step: '09',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

const TECH_EDGES: [string, string][] = [
  ['Python', 'dbt'],
  ['Python', 'XGBoost'],
  ['FastF1', 'dbt'],
  ['FastF1', 'DuckDB'],
  ['SQL', 'dbt'],
  ['SQL', 'DuckDB'],
  ['dbt', 'React'],
  ['dbt', 'GitHub Actions'],
  ['DuckDB', 'React'],
  ['DuckDB', 'GitHub Actions'],
  ['XGBoost', 'ONNX'],
];

const columns = [
  {
    title: 'Ingestion & Sources',
    items: ['Python', 'FastF1', 'SQL'],
  },
  {
    title: 'Transform & Warehouse',
    items: ['dbt', 'DuckDB', 'XGBoost'],
  },
  {
    title: 'Presentation & Deploy',
    items: ['ONNX', 'React', 'GitHub Actions'],
  },
];

interface TechStackDagEdgeProps {
  fromName: string;
  toName: string;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  isActive: boolean;
  isHovering: boolean;
  rgb: string;
}

const TechStackDagEdge: React.FC<TechStackDagEdgeProps> = ({
  fromName,
  toName,
  nodeRefs,
  svgRef,
  isActive,
  isHovering,
  rgb,
}) => {
  const fromEl = nodeRefs.current.get(fromName);
  const toEl = nodeRefs.current.get(toName);
  const svgEl = svgRef.current;

  if (!fromEl || !toEl || !svgEl) return null;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const svgRect = svgEl.getBoundingClientRect();

  // Source center-right to target center-left
  const x1 = fromRect.right - svgRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
  const x2 = toRect.left - svgRect.left;
  const y2 = toRect.top + toRect.height / 2 - svgRect.top;

  const dx = x2 - x1;
  const cp1x = x1 + dx * 0.45;
  const cp2x = x2 - dx * 0.45;
  const d = `M ${x1},${y1} C ${cp1x},${y1} ${cp2x},${y2} ${x2},${y2}`;

  const isInactive = isHovering && !isActive;

  return (
    <path
      d={d}
      fill="none"
      stroke={isActive ? `rgb(${rgb})` : 'rgba(255,255,255,0.4)'}
      strokeWidth={isActive ? 1.5 : 0.8}
      opacity={isActive ? 1 : isInactive ? 0.02 : 0.05}
      style={{
        filter: isActive ? `drop-shadow(0 0 5px rgba(${rgb}, 0.6))` : 'none',
        strokeDasharray: 800,
        strokeDashoffset: isActive ? 0 : 800,
        transition:
          'stroke-dashoffset 0.65s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'opacity 0.3s ease, stroke 0.25s ease, filter 0.25s ease, stroke-width 0.25s ease',
      }}
    />
  );
};

export function TechStackBand() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [activeIdleTech, setActiveIdleTech] = useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [, setTick] = useState(0);

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allTechNames = React.useMemo(() => {
    return stack.map(item => item.name);
  }, []);

  // Intersection observer to track if the section is in view
  useEffect(() => {
    const el = containerRef.current;
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
  useEffect(() => {
    if (!isIntersecting || hoveredTech) {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setActiveIdleTech(null);
      return;
    }

    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setActiveIdleTech(null);

      idleTimeoutRef.current = setTimeout(() => {
        let currentTech: string | null = null;
        
        const nextRandomTech = () => {
          if (allTechNames.length === 0) return null;
          if (allTechNames.length === 1) return allTechNames[0];
          let next = currentTech;
          while (next === currentTech) {
            const idx = Math.floor(Math.random() * allTechNames.length);
            next = allTechNames[idx];
          }
          currentTech = next;
          return next;
        };

        setActiveIdleTech(nextRandomTech());

        cycleIntervalRef.current = setInterval(() => {
          setActiveIdleTech(nextRandomTech());
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
  }, [isIntersecting, hoveredTech, allTechNames]);

  // Watch for grid resizes so edges stay geometrically accurate
  useEffect(() => {
    setTick(t => t + 1);
    const el = gridRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setTick(t => t + 1));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredTech(name);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredTech(null), 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const getActiveLineage = (hovered: string | null) => {
    if (!hovered) return { nodes: [] as string[], edges: [] as [string, string][] };

    const walk = (start: string, direction: 'up' | 'down') => {
      const visited = new Set<string>();
      let queue = [start];
      while (queue.length > 0) {
        const cur = queue.shift()!;
        for (const [from, to] of TECH_EDGES) {
          const neighbour = direction === 'up' ? (to === cur ? from : null) : (from === cur ? to : null);
          if (neighbour && !visited.has(neighbour)) {
            visited.add(neighbour);
            queue.push(neighbour);
          }
        }
      }
      return visited;
    };

    const ancestors = walk(hovered, 'up');
    const descendants = walk(hovered, 'down');
    const activeNodes = [hovered, ...ancestors, ...descendants];
    const activeEdges = TECH_EDGES.filter(([from, to]) => {
      const up = (from === hovered || ancestors.has(from)) && (to === hovered || ancestors.has(to));
      const down = (from === hovered || descendants.has(from)) && (to === hovered || descendants.has(to));
      return up || down;
    });

    return { nodes: activeNodes, edges: activeEdges };
  };

  const activeTech = hoveredTech || activeIdleTech;
  const activeLineage = activeTech ? getActiveLineage(activeTech) : null;
  const isEdgeActive = (from: string, to: string) =>
    activeLineage?.edges.some(([f, t]) => f === from && t === to) ?? false;
  const isNodeInLineage = (name: string) =>
    activeLineage ? activeLineage.nodes.includes(name) : true;

  const getEdgeRgb = (fromName: string) => {
    const item = stack.find(i => i.name === fromName);
    return item ? item.rgb : '255, 255, 255';
  };

  const getItemByName = (name: string) => stack.find(item => item.name === name)!;

  return (
    <div ref={containerRef} className="flex flex-col gap-5 p-6 sm:p-8 bg-graphite-800/40 border border-white/5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] mt-6">
      <span className="font-jetbrains text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold text-center md:text-left">
        Technology Stack
      </span>

      {/* Mobile Grid View (identical to original layout) */}
      <div className="grid md:hidden grid-cols-3 gap-2.5 sm:gap-4 select-none">
        {stack.map((item) => (
          <div
            key={item.name}
            style={{
              '--tech-color': item.color,
              '--tech-rgb': item.rgb,
            } as React.CSSProperties}
            className="group flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-2 sm:px-4 sm:py-3 bg-[rgba(var(--tech-rgb),0.02)] border border-[rgba(var(--tech-rgb),0.12)] rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-[rgba(var(--tech-rgb),0.06)] hover:border-[rgba(var(--tech-rgb),0.4)] hover:shadow-[0_8px_24px_-6px_rgba(var(--tech-rgb),0.35)] hover:-translate-y-0.5 select-none cursor-pointer text-center sm:text-left min-w-0"
          >
            <div 
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/5 text-[var(--tech-color)] transition-transform duration-300 group-hover:scale-110 shrink-0"
              style={{ filter: 'drop-shadow(0 0 6px rgba(var(--tech-rgb), 0.2))' }}
            >
              {item.icon}
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between min-w-0 w-full gap-1.5 sm:gap-2">
              <span className="font-jetbrains text-xs sm:text-sm font-extrabold text-white/95 group-hover:text-[var(--tech-color)] transition-colors duration-200 truncate tracking-tight">
                {item.name}
              </span>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="font-jetbrains text-[7.5px] text-[var(--tech-color)]/90 bg-[rgba(var(--tech-rgb),0.07)] border border-[rgba(var(--tech-rgb),0.15)] px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold group-hover:bg-[rgba(var(--tech-rgb),0.15)] group-hover:text-[var(--tech-color)] transition-all duration-200 truncate">
                  {item.sub}
                </span>
                <span className="font-mono text-[7px] text-white/20 group-hover:text-[var(--tech-color)]/50 transition-colors duration-200 shrink-0">
                  {item.step}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop DAG View */}
      <div
        ref={gridRef}
        className="hidden md:block relative select-none pb-4"
        onMouseLeave={handleMouseLeave}
      >
        {/* SVG edge layer */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0"
          aria-hidden="true"
        >
          {TECH_EDGES.map(([from, to]) => (
            <TechStackDagEdge
              key={`${from}→${to}`}
              fromName={from}
              toName={to}
              nodeRefs={nodeRefs}
              svgRef={svgRef}
              isActive={isEdgeActive(from, to)}
              isHovering={activeTech !== null}
              rgb={getEdgeRgb(from)}
            />
          ))}
        </svg>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-3 gap-8 relative z-[1]">
          {columns.map((column, colIndex) => (
            <div
              key={column.title}
              className="flex flex-col gap-4 p-5 bg-[#0c1110]/30 border border-white/5 rounded-2xl transition-all duration-500 hover:border-white/10 group/col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
                  {column.title}
                </span>
                <span className="font-mono text-[14px] font-black text-white/30 group-hover/col:text-white/60 transition-colors">
                  0{colIndex + 1}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3">
                {column.items.map((name) => {
                  const item = getItemByName(name);
                  const isHovered = activeTech === name;
                  const inLineage = isNodeInLineage(name);

                  return (
                    <div
                      key={name}
                      ref={(el) => { nodeRefs.current.set(name, el); }}
                      onMouseEnter={() => handleMouseEnter(name)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        '--tech-color': item.color,
                        '--tech-rgb': item.rgb,
                      } as React.CSSProperties}
                      className={cn(
                        'group/card relative z-10 flex flex-col p-3 border rounded-xl',
                        'bg-graphite-900/80 transition-all duration-300 cursor-pointer',
                        'border-white/5',
                        'hover:bg-[rgba(var(--tech-rgb),0.03)]',
                        'hover:border-[rgba(var(--tech-rgb),0.35)]',
                        'hover:shadow-[0_4px_12px_-4px_rgba(var(--tech-rgb),0.25)]',
                        'hover:-translate-y-0.5',
                        isHovered ? 'bg-[rgba(var(--tech-rgb),0.03)] border-[rgba(var(--tech-rgb),0.35)] shadow-[0_4px_12px_-4px_rgba(var(--tech-rgb),0.25)] -translate-y-0.5' : '',
                        activeTech && !inLineage ? 'opacity-30 grayscale-[20%]' : 'opacity-100'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 text-[var(--tech-color)] transition-all duration-300 group-hover/card:scale-105"
                          style={{ filter: `drop-shadow(0 0 5px rgba(var(--tech-rgb), ${isHovered ? 0.45 : 0.2}))` }}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className={cn(
                            "font-jetbrains text-xs font-extrabold text-white/95 transition-colors duration-200 truncate tracking-tight group-hover/card:text-[var(--tech-color)]",
                            isHovered && "text-[var(--tech-color)]"
                          )}>
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn(
                              "font-jetbrains text-[7.5px] text-[var(--tech-color)]/90 bg-[rgba(var(--tech-rgb),0.07)] border border-[rgba(var(--tech-rgb),0.15)] px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold transition-all duration-200 truncate group-hover/card:bg-[rgba(var(--tech-rgb),0.15)] group-hover/card:text-[var(--tech-color)]",
                              isHovered && "bg-[rgba(var(--tech-rgb),0.15)] text-[var(--tech-color)]"
                            )}>
                              {item.sub}
                            </span>
                            <span className={cn(
                              "font-mono text-[7px] text-white/20 transition-colors duration-200 shrink-0 group-hover/card:text-[var(--tech-color)]/50",
                              isHovered && "text-[var(--tech-color)]/50"
                            )}>
                              {item.step}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
