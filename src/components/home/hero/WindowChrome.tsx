import React from 'react';

interface WindowChromeProps {
  url?: string;
  right?: React.ReactNode;
}

export const WindowChrome: React.FC<WindowChromeProps> = ({ 
  url = 'justinclarke@portfolio: ~', 
  right 
}) => (
  <div className="flex items-center h-10 px-4 border-b border-white/5 bg-white/[0.015] shrink-0">
    <div className="flex gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
    </div>
    <div className="flex-1 text-center font-mono text-[8px] md:text-[9px] text-[#5a5a57] tracking-[0.2em] uppercase opacity-60 truncate px-2">
      {url}
    </div>
    <div className="flex items-center gap-2 md:gap-4 text-[#8a8a86] font-mono text-[10px] shrink-0">
      {right}
    </div>
  </div>
);
