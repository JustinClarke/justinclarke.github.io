export function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  const fillCounters = () => {
    const counters = document.querySelectorAll('[data-count-target]');
    counters.forEach(c => {
      const counterEl = c as HTMLElement;
      const targetAttr = counterEl.getAttribute('data-count-target');
      if (targetAttr) {
        const suffix = counterEl.getAttribute('data-count-suffix') || '';
        counterEl.textContent = parseFloat(targetAttr).toLocaleString() + suffix;
      }
    });
  };

  fillCounters();

  // Maintain MutationObserver to quickly populate counters on dynamic client-side route changes
  const mutationObserver = new MutationObserver(() => {
    fillCounters();
  });

  const rootElement = document.getElementById('root') || document.body;
  mutationObserver.observe(rootElement, {
    childList: true,
    subtree: true
  });
}
