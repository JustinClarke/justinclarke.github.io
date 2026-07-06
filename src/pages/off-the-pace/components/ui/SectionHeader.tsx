/**
 * SectionHeader the shared heading block for Off The Pace sections: a coloured
 * "eyebrow" line (optionally numbered), a big title, and an optional lede.
 *
 * Fits in: reused at the top of most section components on both OTP pages.
 * Note:    `title` is typed React.ReactNode (not string) so callers can pass
 *          rich markup - e.g. a title with a <br /> or a coloured <span>.
 */
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
      <span className={`font-jetbrains text-micro ${accentClass} uppercase tracking-mega mb-4 block font-semibold`}>
        {number ? `${number} / ${eyebrow}` : eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-noto font-black text-text-primary uppercase tracking-tighter mb-4">
        {title}
      </h2>
      {lede && (
        <p className="text-text-tertiary text-sm font-jetbrains leading-relaxed max-w-2xl">
          {lede}
        </p>
      )}
    </div>
  );
}
