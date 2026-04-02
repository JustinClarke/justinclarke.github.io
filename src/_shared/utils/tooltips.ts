/**
 * @fileoverview Reusable tooltip system for a premium, technical feel.
 * Manages a single floating DOM element and uses event delegation for efficiency.
 */

export const initTooltips = () => {
  // 1. Mobile check: Disable tooltips on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // 2. Create the singleton tooltip element
  let tooltip = document.getElementById('tooltip-container');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip-container';
    // Style as requested: #0f0f0f bg, 1px solid #2a2a2a border
    Object.assign(tooltip.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '9999',
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
      transition: 'opacity 100ms ease-out, transform 100ms ease-out',
      transform: 'translateY(8px)',
      visibility: 'hidden',
    });
    document.body.appendChild(tooltip);
  }

  let activeElement: HTMLElement | null = null;

  const hideTooltip = () => {
    if (!tooltip) return;
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(8px)';
    setTimeout(() => {
      if (tooltip && tooltip.style.opacity === '0') {
        tooltip.style.visibility = 'hidden';
      }
    }, 100);
    activeElement = null;
  };

  const showTooltip = (target: HTMLElement) => {
    if (!tooltip) return;
    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    activeElement = target;
    tooltip.innerText = text;
    tooltip.style.visibility = 'visible';
    
    // Reset accent line
    tooltip.style.borderTopWidth = '1px';
    tooltip.style.borderTopColor = '#2a2a2a';

    // Apply color accent if present
    const accentColor = target.getAttribute('data-tooltip-color');
    if (accentColor) {
      tooltip.style.borderTop = `2px solid ${accentColor}`;
    }

    updatePosition();
    
    // Animate in
    requestAnimationFrame(() => {
      if (!tooltip) return;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateY(0)';
    });
  };

  const updatePosition = () => {
    if (!tooltip || !activeElement) return;
    const rect = activeElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.top - tooltipRect.height - 10;
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

    // Flip to below if near top
    if (top < 10) {
      top = rect.bottom + 10;
    }

    // Keep within horizontal bounds
    const padding = 10;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  // 3. Event Delegation
  document.body.addEventListener('mouseenter', (e) => {
    const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement;
    if (target) showTooltip(target);
  }, true);

  document.body.addEventListener('mouseleave', (e) => {
    const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement;
    if (target) hideTooltip();
  }, true);

  // 4. Scroll & Resize cleanup
  window.addEventListener('scroll', hideTooltip, { passive: true });
  window.addEventListener('resize', hideTooltip, { passive: true });
};
