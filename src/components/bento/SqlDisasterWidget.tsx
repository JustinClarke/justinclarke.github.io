import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils';

const ENTITIES = [
  { id: 'disaster', label: 'DISASTER', count: 5, color: '#ff3c3c' },
  { id: 'region', label: 'REGION', count: 7, color: '#ffaa2e' },
  { id: 'agency', label: 'AGENCY', count: 5, color: '#3b8eff' },
  { id: 'team', label: 'RESP_TEAM', count: 10, color: '#00e5cc' },
  { id: 'volunteer', label: 'VOLUNTEER', count: 15, color: '#c06ef0' },
  { id: 'shelter', label: 'SHELTER', count: 9, color: '#2dce68' },
  { id: 'supply', label: 'SUPPLY', count: 10, color: '#ff6a25' },
];

const QUERY_LOG = [
  { label: 'shelter_stress_tier.sql', latency: '142ms', type: 'NTILE', tag: 'Window Fn' },
  { label: 'relief_allocation_join.sql', latency: '88ms', type: 'JOIN', tag: 'Inner Join' },
  { label: 'check_constraint_verify.sql', latency: '12ms', type: 'CHECK', tag: 'Constraint' },
  { label: 'volunteer_assignment_cte.sql', latency: '61ms', type: 'CTE', tag: 'CTE' },
  { label: 'region_dispatch_rank.sql', latency: '34ms', type: 'RANK', tag: 'Window Fn' },
];

const SCHEMA_FEATURES = [
  { label: 'M:N Rel Modeling', detail: '4 junction tables · composite PK setup' },
  { label: 'Check Invariants', detail: 'occupancy ≤ capacity across 9 shelters' },
  { label: 'FK Integrity Map', detail: 'Agency → Team → Disaster → Region path' },
  { label: 'Geographic Zones', detail: 'NDRRMC + PRC · 7 regions · 5 disasters' },
];

export function SqlDisasterWidget() {
  const [uiMode, setUiMode] = useState<'schema' | 'queries'>('schema');
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [entityTicker, setEntityTicker] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQueryIndex(prev => (prev + 1) % QUERY_LOG.length);
    }, 11000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntityTicker(prev => (prev + 1) % ENTITIES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % SCHEMA_FEATURES.length);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const activeEntity = ENTITIES[entityTicker];
  const activeQuery = QUERY_LOG[activeQueryIndex];

  return (
    <div className="flex flex-col h-full justify-between gap-1.5 md:gap-2 min-h-0 text-left select-none">

      {/* Header */}
      <div className="flex flex-col gap-1 w-full border-b border-white/5 pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ef4444]" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold border border-[#ef4444]/40 text-[#ef4444] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 bg-[#ef4444]/5">
            RELATIONAL DATABASE
          </span>
          <h3 className="font-noto text-sm xs:text-base sm:text-lg font-black tracking-tight text-white uppercase leading-none">
            DISASTER RESPONSE
          </h3>
        </div>

        {/* Dynamic Telemetry Subheader */}
        <div className="hidden lg:flex flex-nowrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 leading-none select-none pr-16 xs:pr-20 sm:pr-24 whitespace-nowrap">
          <span className="text-neutral-500 font-medium">SCHEMA OPERATIONAL</span>
          <span>•</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={entityTicker}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="uppercase font-medium font-mono text-neutral-500"
            >
              {activeEntity.label}: {activeEntity.count}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="hidden lg:flex items-center justify-between py-1.5 px-3 bg-white/[0.02] border border-white/5 rounded-xl shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <Zap size={11} className="text-[#ef4444] animate-pulse" />
          <span className="font-mono text-[9px] md:text-[10px] font-bold text-neutral-400 tracking-wider uppercase">DIS-REL-PH · Module</span>
        </div>
        <div className="bg-neutral-950 border border-white/5 p-0.5 rounded-lg flex shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('schema'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'schema' ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Schema
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setUiMode('queries'); }}
            className={cn(
              "px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] md:text-[10px] uppercase font-bold tracking-wider transition-all",
              uiMode === 'queries' ? "bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444]" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            Queries
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="hidden lg:flex flex-grow min-h-0 flex-col gap-2.5">
        <AnimatePresence mode="wait">

          {uiMode === 'schema' ? (
            <motion.div
              key="schema-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Entity rail */}
              <div className="grid grid-cols-7 gap-1 bg-black/40 border border-white/5 rounded-xl p-2 shrink-0">
                {ENTITIES.map((e, i) => (
                  <div key={e.id} className="flex flex-col items-center gap-0.5">
                    <span
                      className={cn(
                        "font-mono text-[11px] md:text-xs font-black transition-all duration-300",
                        entityTicker === i ? "scale-110" : "opacity-60"
                      )}
                      style={{ color: e.color }}
                    >
                      {e.count}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-600 uppercase tracking-tighter text-center leading-tight">
                      {e.id.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active schema feature */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 md:p-3 flex-grow flex flex-col justify-between min-h-[80px]">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Schema Feature</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1 mt-1.5"
                  >
                    <span className="font-mono text-[11px] md:text-xs font-black text-white">
                      {SCHEMA_FEATURES[activeFeature].label}
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] text-neutral-400 leading-tight">
                      {SCHEMA_FEATURES[activeFeature].detail}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-1 mt-2">
                  {SCHEMA_FEATURES.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-0.5 flex-1 rounded-full transition-all duration-300",
                        activeFeature === i ? "bg-[#ef4444]" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="queries-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 flex-grow min-h-0"
            >
              {/* Active query card */}
              <div className="bg-[#09090b] border border-white/10 rounded-xl p-2.5 md:p-3 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Active Query</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeQueryIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444] font-bold uppercase"
                    >
                      {activeQuery.tag}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQueryIndex}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-mono text-[10px] md:text-xs text-white font-bold truncate mb-1">
                      {activeQuery.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm md:text-base font-black text-[#ef4444]">{activeQuery.latency}</span>
                      <span className="font-mono text-[9px] text-neutral-500 uppercase">{activeQuery.type}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Query queue */}
              <div className="flex-grow bg-black/40 border border-white/5 rounded-xl p-2 md:p-2.5 flex flex-col gap-1.5 min-h-0 overflow-hidden">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest shrink-0">Query Syllabus · 47 total</span>
                {QUERY_LOG.map((q, i) => (
                  <div
                    key={q.label}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all duration-300",
                      activeQueryIndex === i ? "bg-[#ef4444]/10 border border-[#ef4444]/20" : "border border-transparent"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-[9px] truncate",
                      activeQueryIndex === i ? "text-white font-bold" : "text-neutral-500"
                    )}>
                      {q.label}
                    </span>
                    <span className={cn(
                      "font-mono text-[9px] font-black shrink-0",
                      activeQueryIndex === i ? "text-[#ef4444]" : "text-neutral-600"
                    )}>
                      {q.latency}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 justify-between items-center border-t border-white/5 pt-1.5 text-neutral-400 font-mono text-[8px] md:text-[9px] shrink-0">
        <div className="flex items-center gap-1.5">
          <Database size={9} className="shrink-0" />
          <span>11 Entities · 47 Queries</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#ef4444]">
          <ShieldCheck size={9} className="shrink-0" />
          <span>P95 &lt; 200ms · FK Integrity</span>
        </div>
      </div>

      {/* Mobile-only Tech Stack */}
      <div className="lg:hidden flex flex-wrap gap-1 mt-1 shrink-0">
        {['MySQL', 'OLAP', 'Data Model'].map(tech => (
          <span key={tech} className="font-mono text-[8px] sm:text-[9px] px-2 py-0.5 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded text-[#ef4444] font-bold uppercase tracking-wider">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
