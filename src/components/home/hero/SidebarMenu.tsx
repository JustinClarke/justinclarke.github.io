import React from 'react';
import { cn } from '@/utils';

interface CommandButtonProps {
  num: string;
  cmd: string;
  desc: string;
  hot?: boolean;
  important?: boolean;
  onClick?: () => void;
}

const CommandButton: React.FC<CommandButtonProps> = ({ num, cmd, desc, hot, important, onClick }) => (
  <button
    onClick={onClick}
    data-cmd={`> exec_${cmd}()`}
    className={cn(
      "flex items-center justify-between w-full p-3 rounded-lg border transition-all duration-300 group/btn text-left relative overflow-hidden",
      important
        ? "bg-brand-primary/10 border-brand-primary text-[#f4f4f3] shadow-[0_0_20px_rgba(0,200,180,0.1)] scale-[1.02]"
        : hot
          ? "bg-brand-primary/5 border-brand-primary/30 text-[#f4f4f3]"
          : "bg-transparent border-white/5 text-[#f4f4f3] hover:bg-white/[0.02] hover:border-white/10"
    )}
  >
    {important && (
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
    )}
    <div className="flex items-center gap-3 relative z-10">
      <span className={cn(
        "font-mono text-[10px]",
        important ? "text-brand-primary" : "text-[#5a5a57]"
      )}>[{num}]</span>
      <span className={cn(
        "font-mono text-[12px] font-bold tracking-tight",
        (hot || important) ? "text-brand-primary" : "text-[#f4f4f3]"
      )}>
        {cmd}
      </span>
    </div>
    <span className={cn(
      "font-mono text-[9px] tracking-tight group-hover/btn:translate-x-1 transition-transform opacity-60 relative z-10 hidden md:block",
      important ? "text-[#f4f4f3] font-bold" : "text-[#8a8a86]"
    )}>
      {desc} →
    </span>
  </button>
);

interface SidebarMenuProps {
  onCommand: (cmd: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ onCommand }) => {
  const menuItems = [
    { n: '01', cmd: 'record', desc: 'career + education', hot: false },
    { n: '02', cmd: 'projects', desc: 'selected case studies', hot: false },
    { n: '03', cmd: 'expertise', desc: 'stack & depth', hot: false },
    // { n: '04', cmd: 'snake', desc: 'arrow keys · play', hot: false },
    { n: '05', cmd: 'contact', desc: 'get in touch', hot: false },
    { n: '06', cmd: 'resume', desc: 'download pdf', important: true, hot: false },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-6 md:pt-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 lg:pl-12 min-h-0">
      <div className="font-mono text-[9px] text-[#5a5a57] uppercase tracking-[0.3em] font-black opacity-60">
        SYSTEM CONTROLS
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {menuItems.map((c) => (
          <div key={c.cmd} className={cn(c.cmd === 'resume' && "col-span-2 md:col-span-1")}>
            <CommandButton
              num={c.n}
              cmd={c.cmd}
              desc={c.desc}
              hot={c.hot}
              important={c.important}
              onClick={() => onCommand(c.cmd)}
            />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 md:pt-8 border-t border-white/5 hidden md:block">
        <div className="font-mono text-[8px] text-[#5a5a57] uppercase tracking-widest leading-relaxed opacity-60">
          [ status: operational ]<br />
          [ core_v2: active ]<br />
          [ telemetry: encrypted ]
        </div>
      </div>
    </div>
  );
};
