/**
 * animations.ts fills in any "count-up" number displays on the page.
 *
 * Fits in: called once at app start (App.tsx) and re-runs as routes change.
 * Note:    despite the name it doesn't animate it instantly writes each
 *          counter's final value. Elements opt in with a `data-count-target`
 *          attribute (+ optional `data-count-suffix`).
 *
 * For beginners ----------------------------------------------------------------
 * A MutationObserver watches the page for newly-added elements; when React
 * swaps in a new route, this re-fills any counters that just appeared. That's
 * why it keeps working after client-side navigation, not just on first load.
 * -----------------------------------------------------------------------------
 */
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
