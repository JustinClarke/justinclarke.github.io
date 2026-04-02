/**
 * @fileoverview Reusable tooltip system for a premium, technical feel.
 * Manages a single floating DOM element and uses event delegation for efficiency.
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
  
  // Guard against duplicate listeners
  if ((window as any).__TOOLTIPS_INITIALIZED__) return;
  (window as any).__TOOLTIPS_INITIALIZED__ = true;

  // 1. Mobile check: Disable tooltips only on small touch screens
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
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
      backgroundColor: '#0f0f0f',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '10px 16px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '13px',
      color: '#ffffff',
      maxWidth: '320px',
      lineHeight: '1.6',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      opacity: '0',
      transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      transform: 'translateY(10px)',
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

  const updatePosition = (x: number, y: number) => {
    if (!tooltip) return;
    const rect = tooltip.getBoundingClientRect();
    const left = Math.min(Math.max(x - rect.width / 2, 10), window.innerWidth - rect.width - 10);
    let top = y - rect.height - 20;
    if (top < 10) top = y + 25; // Flip below if no space above
    
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
    tooltip.style.borderTop = color ? `2px solid ${color}` : '1px solid #2a2a2a';

    updatePosition(state.lastX, state.lastY);
    
    requestAnimationFrame(() => {
      if (!tooltip) return;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
  };

  const hideTooltip = () => {
    if (!tooltip) return;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (tooltip && tooltip.style.opacity === '0') {
        tooltip.style.visibility = 'hidden';
      }
    }, 150);
  };

  document.addEventListener('mousemove', (e: MouseEvent) => {
    state.lastX = e.clientX;
    state.lastY = e.clientY;

    const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement | null;
    
    if (target) {
      if (state.currentTarget !== target) {
        state.currentTarget = target;
        if (state.hideTimer) clearTimeout(state.hideTimer);
        if (state.showTimer) clearTimeout(state.showTimer);
        state.showTimer = setTimeout(() => showTooltip(target), 80);
      }
      updatePosition(e.clientX, e.clientY);
    } else {
      if (state.currentTarget) {
        state.currentTarget = null;
        if (state.showTimer) clearTimeout(state.showTimer);
        if (state.hideTimer) clearTimeout(state.hideTimer);
        state.hideTimer = setTimeout(hideTooltip, 120);
      }
    }
  }, { passive: true });

  const forceHide = () => {
    if (state.showTimer) clearTimeout(state.showTimer);
    if (state.hideTimer) clearTimeout(state.hideTimer);
    hideTooltip();
    state.currentTarget = null;
  };

  window.addEventListener('scroll', forceHide, { passive: true });
  window.addEventListener('resize', forceHide, { passive: true });
};
