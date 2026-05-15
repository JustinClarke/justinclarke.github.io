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
    <div className="flex gap-2 group/traffic">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 cursor-pointer relative group-hover/traffic:after:content-['×'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 cursor-pointer relative group-hover/traffic:after:content-['−'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 cursor-pointer relative group-hover/traffic:after:content-['+'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-[8px] after:text-black/40 after:font-bold after:opacity-0 hover:after:opacity-100 transition-colors" />
    </div>
    <div className="flex-1 text-center font-mono text-[8px] md:text-[9px] text-[#5a5a57] tracking-[0.2em] uppercase opacity-60 truncate px-2">
      {url}
    </div>
    <div className="flex items-center gap-2 md:gap-4 text-[#8a8a86] font-mono text-[10px] shrink-0">
      {right}
    </div>
  </div>
);
