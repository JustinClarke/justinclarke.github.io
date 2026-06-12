/**
 * ExpandableTabs the floating segmented nav used by SourceView's FloatingNav:
 * a row of icon buttons that expand to show their label on hover (or when
 * active), collapsing to icon-only on touch devices.
 *
 * Fits in: rendered inside the portalled FloatingNav in SourceView.
 * Note:    `activeId` and `onChange` are controlled by the parent - this
 *          component owns no "which tab is selected" state, only hover state.
 *
 * For beginners ----------------------------------------------------------------
 * Two things to notice. (1) Icons are looked up by name from the lucide-react
 * library: `LucideIcons[item.icon]` returns the actual icon component to render.
 * (2) `window.matchMedia('(hover: none)')` asks the browser "is this a
 * no-hover (touch) device?" and the effect keeps `isTouch` updated if that
 * changes, so touch users get the compact icon-only layout.
 * -----------------------------------------------------------------------------
 */
import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: keyof typeof LucideIcons;
  color?: string;
  /** Optical-centering nudge for glyphs whose content isn't centered in their viewBox (e.g. Gauge). */
  iconClassName?: string;
}

export interface ExpandableTabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const ExpandableTabs: React.FC<ExpandableTabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 p-2 bg-f1-surface/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform-gpu ${className}`}
      style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
    >
      {items.map((item) => {
        const IconComponent = LucideIcons[item.icon] as React.ComponentType<any>;
        const isActive = activeId === item.id;
        const isHovered = hoveredId === item.id;
        // LEARN: expand rule - never on touch; if anything is hovered, only the
        //    hovered tab expands; otherwise fall back to expanding the active one.
        const isExpanded = isTouch ? false : (hoveredId !== null ? isHovered : isActive);

        const activeTextColor = item.color || 'text-white';
        const activeIconColor = item.color || 'text-f1-red';

        return (
          <button
            key={item.id}
            onMouseEnter={() => !isTouch && setHoveredId(item.id)}
            onMouseLeave={() => !isTouch && setHoveredId(null)}
            onClick={() => onChange(item.id)}
            className={`relative rounded-xl font-jetbrains text-xs uppercase tracking-wider select-none cursor-pointer focus:outline-none group transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isTouch ? 'w-12 h-12' : 'flex items-center justify-center px-4 py-2.5'
            }`}
          >
            <div
              className={`absolute inset-0 bg-white/5 border border-white/10 rounded-xl transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isExpanded || (isTouch && isActive) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />

            {IconComponent && (
              <span className={`${isTouch ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'relative'} z-10 flex items-center justify-center transition-colors duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? activeIconColor : 'text-f1-cream/60 group-hover:text-f1-cream/90'
              }`}>
                <IconComponent className={`w-[18px] h-[18px] ${item.iconClassName ?? ''}`} strokeWidth={2} />
              </span>
            )}

            {!isTouch && (
              <div
                className={`relative z-10 grid transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isExpanded ? 'grid-cols-[1fr] opacity-100 ml-2' : 'grid-cols-[0fr] opacity-0 ml-0'
                }`}
              >
                <div className="overflow-hidden flex items-center">
                  <span className={`font-bold whitespace-nowrap ${
                    isActive ? activeTextColor : 'text-f1-cream/80'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ExpandableTabs;
