/**
 * SidebarMenu the "CONTROLS" panel beside the terminal: the four quick-action
 * buttons (resumé, connect, the long version, featured project).
 *
 * Fits in: the right-hand column of the Hero. Clicking a button either runs a
 *          terminal command (`onCommand`) or navigates to a page.
 * Note:    the buttons are DATA, not hand-written markup one `menuItems` array
 *          describes them and a single `.map` renders them. Add a button by adding
 *          an object, not by copy-pasting JSX.
 */
import React from 'react';
import { cn, track } from '@/utils';
import { TOOLTIPS } from '@/utils/tooltipContent';
import { useNavigate } from 'react-router-dom';
import { ProjectShowcase } from './ProjectShowcase';
import { projectsData } from '@/content/projects';
import { CommandButton, CommandButtonProps } from './CommandButton';

interface SidebarMenuProps {
  onCommand: (cmd: string, source?: 'terminal' | 'sidebar') => void;
  isVisible?: boolean;
}

// Extends the button's own prop type (minus `num`, supplied here as `n`) so
// MenuItem can't drift out of sync with CommandButton.
interface MenuItem extends Omit<CommandButtonProps, 'num'> {
  n: string;
  mobileOrder: number;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ onCommand, isVisible = true }) => {
  const navigate = useNavigate();
  // Fall back to the first project so there's always something to feature.
  const crownJewelProject = projectsData.find(p => p.id === 'off-the-pace') || projectsData[0];

  const menuItems: MenuItem[] = [
    { n: '01', cmd: 'resumé', desc: 'download pdf', important: false, hot: false, className: "resume-blink-active", tooltip: TOOLTIPS.resume, onClick: () => onCommand('resume', 'sidebar'), mobileOrder: 2 },
    { n: '02', cmd: 'connect', desc: 'get in touch', important: true, hot: false, tooltip: TOOLTIPS.contactme, onClick: () => onCommand('connect', 'sidebar'), mobileOrder: 3 },
    { n: '03', cmd: 'the long version', desc: 'how I got here', important: false, hot: false, tooltip: TOOLTIPS.everythingelse, onClick: () => onCommand('the long version', 'sidebar'), mobileOrder: 4 },
    { n: '04', cmd: 'featured project', desc: 'VIEW OVERVIEW', large: true, badge: <ProjectShowcase project={crownJewelProject} />, hot: false, alignTop: true, tooltip: TOOLTIPS.projects, onClick: () => { track('project-click', { project: crownJewelProject.id }); navigate('/f1'); }, mobileOrder: 1 },
    { n: '05', cmd: 'studio', desc: 'ui/ux & visuals', important: false, hot: false, tooltip: 'Design Portfolio', onClick: () => { track('studio-click'); navigate('/studio'); }, mobileOrder: 5 },
  ];

  return (
    <div className={cn(
      "relative flex flex-col gap-4 md:gap-6 pt-6 md:pt-2 shrink-0 md:flex-1 border-t md:border-t-0 border-edge-soft md:pl-8 lg:pl-12 min-h-0 transition-opacity duration-1000",
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
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
              c.mobileOrder === 4 && "order-4 md:order-none",
              c.cmd === 'studio' && "hidden md:block"
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
