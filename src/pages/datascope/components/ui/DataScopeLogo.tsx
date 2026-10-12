/**
 * DataScopeLogo.tsx
 * The official DataScope logo mark — the lightning-bolt shape from
 * the DataScope preloader (public/favicon.svg in the DataScope repo).
 *
 * Props mirror ReticleMark so existing call-sites can swap 1-for-1.
 */
interface DataScopeLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function DataScopeLogo({
  size = 24,
  className = '',
  glow = false,
}: DataScopeLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 animate-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, #863bff 0%, #00d4ff 100%)' }}
        />
      )}
      {/* viewBox matches the 48×46 source to preserve proportions */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 46"
        width={size}
        height={size}
        fill="none"
        className="relative z-10"
        aria-label="DataScope logo"
      >
        {/* Outer bolt shape */}
        <path
          fill="#863bff"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
        {/* Inner highlight sheen (masked — simplified to a gradient overlay) */}
        <path
          fill="url(#ds-logo-sheen)"
          opacity="0.5"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
        <defs>
          <linearGradient id="ds-logo-sheen" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ede6ff" />
            <stop offset="50%" stopColor="#863bff" stopOpacity="0" />
            <stop offset="100%" stopColor="#47bfff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
