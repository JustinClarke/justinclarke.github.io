export function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const selectors = [
    '.card-anim',
    '.pipeline-col-anim',
    '.exp-row-anim',
    '.edu-card-anim',
    '.footer-cta-anim',
    '.badge-reveal',
    '.footer-social-anim',
    '.footer-bar-anim',
    '.divider-grow',
    '.text-reveal',
    '.hero-anim',
    '.section-label-anim',
    '.title-reveal'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        target.classList.add('anim-in');
        
        // Counter animation trigger
        const counters = target.querySelectorAll('[data-count-target]');
        counters.forEach(c => animateCounter(c as HTMLElement));

        // Footer word animation trigger
        if (target.classList.contains('footer-quote-trigger') && !target.classList.contains('is-split')) {
          splitAndAnimateWords(target);
        }
        
        // Hardware acceleration cleanup after animation finishes
        target.addEventListener('transitionend', () => {
          target.style.willChange = 'auto';
        }, { once: true });
      } else {
        // Reset animation state when out of view
        target.classList.remove('anim-in');
        // Reset sub-elements
        const words = target.querySelectorAll('.word-anim');
        words.forEach(w => w.classList.remove('anim-in'));
      }
    });
  }, { 
    threshold: 0.05, 
    rootMargin: '0px 0px 0px 0px' 
  });

  const observeNewElements = () => {
    const targets = document.querySelectorAll(selectors.join(', '));
    
    // Quick escape for accessibility or extreme lag devices
    if (prefersReduced) {
      targets.forEach(t => {
        t.classList.add('anim-in');
        if (t.classList.contains('footer-quote-trigger')) splitAndAnimateWords(t as HTMLElement);
      });
      return;
    }

    targets.forEach(t => {
      if (!t.classList.contains('is-observed')) {
        t.classList.add('is-observed');
        observer.observe(t);
      }
    });
  };

  // Initial observation
  observeNewElements();

  // Robust observation for dynamic React renders
  const mutationObserver = new MutationObserver(() => {
    observeNewElements();
  });

  const rootElement = document.getElementById('root') || document.body;
  mutationObserver.observe(rootElement, {
    childList: true,
    subtree: true
  });
}

/**
 * Satisfying count-up animation for numeric metrics.
 */
function animateCounter(el: HTMLElement) {
  const targetAttr = el.getAttribute('data-count-target');
  if (!targetAttr) return;

  const target = parseFloat(targetAttr);
  const suffix = el.getAttribute('data-count-suffix') || '';
  const duration = 1500;
  const start = performance.now();

  function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(eased * target);
    
    el.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Splits footer quote text into individual spans for staggered word-by-word reveal.
 */
function splitAndAnimateWords(el: HTMLElement) {
  if (el.classList.contains('is-split')) return;
  
  // If it has complex HTML (like spans for colors), 
  // we animate the direct children only instead of word-splitting.
  if (el.children.length > 0) {
    el.classList.add('is-split', 'flex', 'flex-wrap', 'items-baseline', 'gap-x-1.5');
    Array.from(el.children).forEach((child, i) => {
      const childEl = child as HTMLElement;
      childEl.classList.add('word-anim', 'block');
      childEl.style.transitionDelay = `${i * 120 + 200}ms`; // Slower, more delayed reveal
      childEl.style.transitionDuration = '0.7s';
      requestAnimationFrame(() => childEl.classList.add('anim-in'));
    });
    return;
  }

  const text = el.textContent || '';
  el.textContent = '';
  el.classList.add('is-split');
  
  // Use regex to split into words
  const words = text.trim().split(/\s+/);
  
  words.forEach((word, i) => {
    const span = document.createElement('span');
    // Ensure display: inline-block doesn't swallow the space
    span.textContent = word + (i === words.length - 1 ? '' : ' ');
    span.className = 'word-anim';
    span.style.whiteSpace = 'pre'; // Force preservation of the space
    span.style.transitionDelay = `${i * 60 + 100}ms`; // Slower, more delayed reveal
    span.style.transitionDuration = '0.6s';
    el.appendChild(span);
    
    requestAnimationFrame(() => {
      span.classList.add('anim-in');
    });
  });
}
