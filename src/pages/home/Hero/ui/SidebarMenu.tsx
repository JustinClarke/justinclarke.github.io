import React from 'react';
import { cn } from '@/utils';
import { TOOLTIPS } from '@/config/tooltips';
import { useNavigate } from 'react-router-dom';
import { ProjectShowcase } from './ProjectShowcase';
import { projectsData } from '@/data/projects';
import { CommandButton, CommandButtonProps } from './CommandButton';

interface SidebarMenuProps {
  onCommand: (cmd: string, source?: 'terminal' | 'sidebar') => void;
}

interface MenuItem extends Omit<CommandButtonProps, 'num'> {
  n: string;
  mobileOrder: number;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ onCommand }) => {
  const navigate = useNavigate();
  const crownJewelProject = projectsData.find(p => p.id === 'off-the-pace') || projectsData[0];

  const menuItems: MenuItem[] = [
    { n: '01', cmd: 'resumé', desc: 'download pdf', important: false, hot: false, className: "resume-blink-active", tooltip: TOOLTIPS.resume, onClick: () => onCommand('resume', 'sidebar'), mobileOrder: 2 },
    { n: '02', cmd: 'connect', desc: 'get in touch', important: true, hot: false, tooltip: TOOLTIPS.contactme, onClick: () => onCommand('connect', 'sidebar'), mobileOrder: 3 },
    { n: '03', cmd: 'the long version', desc: 'how I got here', important: false, hot: false, tooltip: TOOLTIPS.everythingelse, onClick: () => onCommand('the long version', 'sidebar'), mobileOrder: 4 },
    { n: '04', cmd: 'featured project', desc: 'VIEW OVERVIEW', large: true, badge: <ProjectShowcase project={crownJewelProject} />, hot: false, alignTop: true, tooltip: TOOLTIPS.projects, onClick: () => navigate('/f1'), mobileOrder: 1 },
  ];

  return (
    <div className="relative flex flex-col gap-4 md:gap-6 pt-6 md:pt-2 shrink-0 md:flex-1 border-t md:border-t-0 border-white/5 md:pl-8 lg:pl-12 min-h-0">
      {/* Sidebar spine  -  gradient accent on the dividing edge (desktop only) */}
      <div
        aria-hidden
        className="hidden md:block absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(0,200,180,0.45) 12%, rgba(255,255,255,0.08) 50%, rgba(0,200,180,0.25) 88%, transparent 100%)',
          boxShadow: '0 0 12px rgba(0,200,180,0.15)',
        }}
      />

      {/* Header  -  chip + label + animated rule + breathing dot */}
      <div className="flex items-center gap-3 group/header">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[8px] tracking-[0.2em] font-black uppercase px-1.5 py-0.5 rounded-sm border border-brand-primary/35 text-brand-primary bg-brand-primary/6"
            style={{ boxShadow: 'inset 0 0 8px rgba(0,200,180,0.08)' }}
          >
            SYS
          </span>
          <div className="font-mono text-[10px] text-term-fg uppercase tracking-[0.3em] font-black transition-opacity">
            CONTROLS
          </div>
        </div>
        <div className="relative flex-1 h-px overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(0,200,180,0.35), rgba(255,255,255,0.06) 60%, transparent)',
            }}
          />
        </div>
        <span className="font-mono text-[8px] text-term-faint tracking-[0.25em] uppercase hidden md:inline">04 CH</span>
        <div className="indicator-light bg-brand-primary group-hover/header:shadow-[0_0_10px_var(--color-acc-lang)] animate-pulse" style={{ boxShadow: '0 0 6px rgba(0,200,180,0.55)' }} />
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-col gap-2 md:flex-1 md:min-h-0">
        {menuItems.map((c) => (
          <div
            key={c.cmd}
            className={cn(
              (c.large || c.cmd === 'the long version') && "col-span-2 md:col-span-1",
              c.large && "md:flex-1 md:min-h-0 md:flex md:flex-col",
              c.mobileOrder === 1 && "order-1 md:order-none",
              c.mobileOrder === 2 && "order-2 md:order-none",
              c.mobileOrder === 3 && "order-3 md:order-none",
              c.mobileOrder === 4 && "order-4 md:order-none"
            )}
          >
            <CommandButton
              num={c.n}
              cmd={c.cmd}
              desc={c.desc}
              hot={c.hot}
              important={c.important}
              large={c.large}
              badge={c.badge}
              alignTop={c.alignTop}
              tooltip={c.tooltip}
              onClick={c.onClick}
              className={c.className}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
