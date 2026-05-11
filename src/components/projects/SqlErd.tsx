import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface EntityField {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface Entity {
  id: string;
  name: string;
  fields: EntityField[];
  color: string;
  gridPos: string;
}

const ENTITIES: Entity[] = [
  { id: 'volunteer', name: 'Volunteer', color: 'border-white/10', gridPos: 'md:col-start-1 md:row-start-1', fields: [{ name: 'volunteer_id', type: 'INT', isPk: true }, { name: 'name', type: 'STRING' }, { name: 'skillset', type: 'STRING' }] },
  { id: 'supply', name: 'Supply', color: 'border-white/10', gridPos: 'md:col-start-1 md:row-start-2', fields: [{ name: 'supply_id', type: 'INT', isPk: true }, { name: 'name', type: 'STRING' }, { name: 'category', type: 'STRING' }] },
  { id: 'agency', name: 'Agency', color: 'border-white/10', gridPos: 'md:col-start-1 md:row-start-3', fields: [{ name: 'agency_id', type: 'INT', isPk: true }, { name: 'name', type: 'STRING' }, { name: 'agency_type', type: 'STRING' }] },
  { id: 'assignment', name: 'VolunteerAssignment', color: 'border-white/10', gridPos: 'md:col-start-2 md:row-start-1', fields: [{ name: 'volunteer_id', type: 'INT', isFk: true }, { name: 'team_id', type: 'INT', isFk: true }] },
  { id: 'allocation', name: 'SupplyAllocation', color: 'border-white/10', gridPos: 'md:col-start-2 md:row-start-2', fields: [{ name: 'supply_id', type: 'INT', isFk: true }, { name: 'disaster_id', type: 'INT', isFk: true }] },
  { id: 'team', name: 'ResponseTeam', color: 'border-white/10', gridPos: 'md:col-start-2 md:row-start-3', fields: [{ name: 'team_id', type: 'INT', isPk: true }, { name: 'agency_id', type: 'INT', isFk: true }] },
  { id: 'deployment', name: 'TeamDeployment', color: 'border-white/10', gridPos: 'md:col-start-3 md:row-start-1', fields: [{ name: 'team_id', type: 'INT', isFk: true }, { name: 'disaster_id', type: 'INT', isFk: true }] },
  { id: 'disaster', name: 'Disaster', color: 'border-white/10', gridPos: 'md:col-start-3 md:row-start-2', fields: [{ name: 'disaster_id', type: 'INT', isPk: true }, { name: 'name', type: 'STRING' }] },
  { id: 'disaster_region', name: 'DisasterRegion', color: 'border-white/10', gridPos: 'md:col-start-3 md:row-start-3', fields: [{ name: 'disaster_id', type: 'INT', isFk: true }, { name: 'region_id', type: 'INT', isFk: true }] },
  { id: 'region', name: 'Region', color: 'border-white/10', gridPos: 'md:col-start-4 md:row-start-2', fields: [{ name: 'region_id', type: 'INT', isPk: true }, { name: 'name', type: 'STRING' }] },
  { id: 'shelter', name: 'Shelter', color: 'border-white/10', gridPos: 'md:col-start-4 md:row-start-3', fields: [{ name: 'shelter_id', type: 'INT', isPk: true }, { name: 'region_id', type: 'INT', isFk: true }] },
];

const CONNECTIONS = [
  { from: 'volunteer', to: 'assignment', label: '1:M' },
  { from: 'supply', to: 'allocation', label: '1:M' },
  { from: 'agency', to: 'team', label: '1:M' },
  { from: 'team', to: 'assignment', label: '1:M' },
  { from: 'team', to: 'deployment', label: '1:M' },
  { from: 'disaster', to: 'allocation', label: '1:M' },
  { from: 'disaster', to: 'deployment', label: '1:M' },
  { from: 'disaster', to: 'disaster_region', label: '1:M' },
  { from: 'region', to: 'allocation', label: '1:M' },
  { from: 'region', to: 'disaster_region', label: '1:M' },
  { from: 'region', to: 'shelter', label: '1:M' },
];

export const SqlErd = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<Record<string, { x: number, y: number }>>({});

  useEffect(() => {
    const updateCoords = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newCoords: Record<string, { x: number, y: number }> = {};

      ENTITIES.forEach(entity => {
        const el = document.getElementById(`entity-${entity.id}`);
        if (el) {
          const elRect = el.getBoundingClientRect();
          newCoords[entity.id] = {
            x: elRect.left - rect.left + elRect.width / 2,
            y: elRect.top - rect.top + elRect.height / 2
          };
        }
      });
      setCoords(newCoords);
    };

    updateCoords();
    window.addEventListener('resize', updateCoords);
    return () => window.removeEventListener('resize', updateCoords);
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-[24px] md:rounded-[40px] border border-white/10 bg-[#0a0c10] shadow-2xl">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 md:py-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-white/60 font-black">
            RELATIONAL_MAP
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 font-mono text-[8px] md:text-[9px] text-white/30 uppercase tracking-widest font-black">
          <span>Schema Engine: Operational</span>
        </div>
      </div>

      <div ref={containerRef} className="relative p-8 md:p-16 overflow-x-auto md:overflow-visible min-h-[100px] md:min-h-[700px]">
        {/* Dynamic Connector Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5] hidden md:block">
          {CONNECTIONS.map((conn, i) => {
            const start = coords[conn.from];
            const end = coords[conn.to];
            if (!start || !end) return null;

            return (
              <g key={i}>
                <motion.path 
                  d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} 
                  stroke="white" 
                  strokeWidth="1" 
                  strokeOpacity="0.15"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
                <rect 
                  x={(start.x + end.x) / 2 - 12} 
                  y={(start.y + end.y) / 2 - 7} 
                  width="24" 
                  height="14" 
                  rx="4" 
                  fill="#0a0c10" 
                  stroke="white" 
                  strokeOpacity="0.3" 
                />
                <text 
                  x={(start.x + end.x) / 2} 
                  y={(start.y + end.y) / 2 + 3} 
                  textAnchor="middle" 
                  className="font-mono text-[7px] fill-white/60 font-black"
                >
                  {conn.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* The Grid - Hidden on mobile, only desktop interactive view */}
        <div className="hidden md:grid md:grid-cols-4 gap-x-8 lg:gap-x-16 gap-y-12 md:gap-y-16 relative z-10">
          {ENTITIES.map((entity, idx) => (
            <motion.div
              id={`entity-${entity.id}`}
              key={entity.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={cn(
                "rounded-xl border bg-[#12151a] overflow-hidden shadow-xl transition-all duration-300 hover:border-white/30",
                entity.color,
                entity.gridPos
              )}
            >
              <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <span className="font-noto text-[10px] font-black uppercase tracking-tight text-white">
                  {entity.name}
                </span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex flex-col p-1">
                {entity.fields.map((field) => (
                  <div key={field.name} className="px-3 py-1.5 flex items-center justify-between rounded-md hover:bg-white/[0.03] transition-colors group">
                    <div className="flex items-center gap-2">
                      {field.isPk ? <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" /> : field.isFk ? <div className="w-1.5 h-1.5 rounded-sm bg-purple-500" /> : <div className="w-1 h-1 rounded-full bg-white/20" />}
                      <span className="font-mono text-[10px] text-white/80 group-hover:text-white">{field.name}</span>
                    </div>
                    <span className="font-mono text-[7px] text-white/20 uppercase font-black">{field.type}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Disclaimer */}
      <div className="flex md:hidden flex-col items-center justify-center p-12 text-center gap-4 bg-white/[0.02]">
         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
            <span className="font-mono text-lg text-white/20">!</span>
         </div>
         <span className="font-mono text-[10px] text-white/60 uppercase font-black tracking-widest">Optimized for Desktop Interface</span>
      </div>

      {/* Footer */}
      <div className="px-6 md:px-10 py-4 border-t border-white/5 bg-[#080a0e] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm bg-amber-500/50" />
              <span className="font-mono text-[8px] text-white/40 uppercase font-bold">PK</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm bg-purple-500/50" />
              <span className="font-mono text-[8px] text-white/40 uppercase font-bold">FK</span>
           </div>
        </div>
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
           Relational Integrity: Enforced
        </div>
      </div>
    </div>
  );
};
