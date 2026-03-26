interface SectionHeaderProps {
  number?: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  accent?: 'red' | 'amber' | 'emerald' | 'cyan';
  className?: string;
}

const ACCENT_COLORS: Record<string, string> = {
  red:     'text-f1-red',
  amber:   'text-amber-400',
  emerald: 'text-emerald-400',
  cyan:    'text-cyan-400',
};

export function SectionHeader({ number, eyebrow, title, lede, accent = 'red', className = '' }: SectionHeaderProps) {
  const accentClass = ACCENT_COLORS[accent];

  return (
    <div className={`max-w-xl ${className}`}>
      <span className={`font-jetbrains text-[10px] ${accentClass} uppercase tracking-[0.2em] mb-4 block font-semibold`}>
        {number ? `${number} / ${eyebrow}` : eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-noto font-black text-white/90 uppercase tracking-tighter mb-4">
        {title}
      </h2>
      {lede && (
        <p className="text-white/60 text-sm font-jetbrains leading-relaxed max-w-2xl">
          {lede}
        </p>
      )}
    </div>
  );
}
