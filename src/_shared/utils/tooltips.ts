/**
 * @fileoverview Reusable tooltip system for a premium, technical feel.
 * Manages a single floating DOM element and uses event delegation for efficiency.
 * Refined for site-wide consistency and route-based stability.
 */

interface TooltipState {
  currentTarget: HTMLElement | null;
  showTimer: ReturnType<typeof setTimeout> | null;
  hideTimer: ReturnType<typeof setTimeout> | null;
  lastX: number;
  lastY: number;
}


export const initTooltips = () => {
  if (typeof window === 'undefined') return;
  
  // 1. Mobile & Touch Detection
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    document.body.classList.add('touch-device');
  }

  // Guard against duplicate listeners
  if ((window as any).__TOOLTIPS_INITIALIZED__) return;
  (window as any).__TOOLTIPS_INITIALIZED__ = true;

  // Disable tooltips only on small touch screens
  if (window.innerWidth < 1024 && isTouch) return;

  // 2. Create/Get the singleton tooltip element
  let tooltip = document.getElementById('tooltip-container');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip-container';
    Object.assign(tooltip.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '100000',
      backgroundColor: 'var(--color-brand-bg)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--color-border-studio)',
      borderRadius: '8px',
      padding: '12px 16px',
      fontFamily: "var(--font-mono)",
      fontSize: '12.5px',
      fontWeight: '500',
      color: 'var(--color-text-primary)',
      maxWidth: '300px',
      lineHeight: '1.6',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      opacity: '0',
      transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      transform: 'translateY(8px)',
      visibility: 'hidden',
    });
    document.body.appendChild(tooltip);
  }

  const state: TooltipState = {
    currentTarget: null,
    showTimer: null,
    hideTimer: null,
    lastX: 0,
    lastY: 0,
  };

  const updatePosition = (x: number, y: number, target?: HTMLElement | null) => {
    if (!tooltip) return;
    const rect = tooltip.getBoundingClientRect();
    
    // Horizontal clamping
    const left = Math.min(
      Math.max(x - rect.width / 2, 16), 
      window.innerWidth - rect.width - 16
    );
    
    // Vertical placement
    const posPref = target?.getAttribute('data-tooltip-pos');
    let top: number;

    if (posPref === 'below') {
      top = y + 24;
      // Flip above if hitting bottom
      if (top + rect.height > window.innerHeight - 16) {
        top = y - rect.height - 24;
      }
    } else {
      top = y - rect.height - 24;
      // Flip below if hitting top
      if (top < 16) {
        top = y + 24;
      }
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const showTooltip = (target: HTMLElement) => {
    if (!tooltip) return;
    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    tooltip.innerText = text;
    tooltip.style.visibility = 'visible';
    
    const color = target.getAttribute('data-tooltip-color');
    tooltip.style.borderTop = color ? `2px solid ${color}` : '1px solid var(--color-border-studio)';

    updatePosition(state.lastX, state.lastY, target);
    
    requestAnimationFrame(() => {
      if (!tooltip) return;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
  };

  const hideTooltip = () => {
    if (!tooltip) return;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(8px)';
    
    // Avoid layout thrashing: hide completely after fade
    setTimeout(() => {
      if (tooltip && tooltip.style.opacity === '0') {
        tooltip.style.visibility = 'hidden';
      }
    }, 200);
  };

  const handleMouseMove = (e: MouseEvent) => {
    state.lastX = e.clientX;
    state.lastY = e.clientY;

    const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement | null;
    
    if (target) {
      if (state.currentTarget !== target) {
        state.currentTarget = target;
        if (state.hideTimer) clearTimeout(state.hideTimer);
        if (state.showTimer) clearTimeout(state.showTimer);
        state.showTimer = setTimeout(() => showTooltip(target), 60); // Snappier reveal
      }
      updatePosition(e.clientX, e.clientY, target);
    } else {
      if (state.currentTarget) {
        state.currentTarget = null;
        if (state.showTimer) clearTimeout(state.showTimer);
        if (state.hideTimer) clearTimeout(state.hideTimer);
        state.hideTimer = setTimeout(hideTooltip, 100);
      }
    }
  };

  document.addEventListener('mousemove', handleMouseMove, { passive: true });

  const forceHide = () => {
    if (state.showTimer) clearTimeout(state.showTimer);
    if (state.hideTimer) clearTimeout(state.hideTimer);
    hideTooltip();
    state.currentTarget = null;
  };

  // Global events to prevent sticking
  window.addEventListener('scroll', forceHide, { passive: true });
  window.addEventListener('resize', forceHide, { passive: true });
  window.addEventListener('blur', forceHide);
  
  // Custom event for route cleaning (dispatch this on router match)
  window.addEventListener('popstate', forceHide);
};
