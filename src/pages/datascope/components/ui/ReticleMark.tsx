/**
 * ReticleMark.tsx
 * The official DataScope SVG reticle badge and wordmark icon.
 */
interface ReticleMarkProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function ReticleMark({ size = 24, className = '', glow = false }: ReticleMarkProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-70 animate-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, #863bff 0%, var(--color-datascope) 100%)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative z-10"
        aria-label="DataScope reticle logo"
      >
        {/* Outer targeting circle */}
        <circle cx="50" cy="50" r="32" fill="none" stroke="#edeae6" strokeWidth="8" opacity="0.9" />
        
        {/* Crosshair ticks */}
        <path
          d="M50 4 V16 M50 84 V96 M4 50 H16 M84 50 H96"
          stroke="#edeae6"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Dynamic analytics quadrant wedge */}
        <path d="M50 50 L50 18 A32 32 0 0 1 82 66 Z" fill="#f2a33c" />

        {/* Central core engine lens */}
        <circle cx="50" cy="50" r="11" fill="#863bff" />
        <circle cx="50" cy="50" r="4" fill="var(--color-datascope)" />
      </svg>
    </div>
  );
}
