export function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // We are moving to a unified reveal system using data attributes
  const selectors = [
    '.reveal-trigger', // New unified selector
    '[data-reveal]',   // Any element with this attribute
    // Legacy support during migration:
    '.card-anim',
    '.pipeline-col-anim',
    '.exp-row-anim',
    '.edu-card-anim',
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
        // Toggle both the data attribute and the legacy class
        target.setAttribute('data-reveal', 'active');
        target.classList.add('anim-in');
        
        // Counter animation trigger
        const counters = target.querySelectorAll('[data-count-target]');
        counters.forEach(c => animateCounter(c as HTMLElement));

        // Footer word animation trigger
        if (target.classList.contains('footer-quote-trigger') && !target.classList.contains('is-split')) {
          splitAndAnimateWords(target);
        }
        
        // Force hardware acceleration cleanup after standard duration
        setTimeout(() => {
          target.style.willChange = 'auto';
        }, 2000);
      } else {
        // Reset state for re-entry animations
        target.setAttribute('data-reveal', 'inactive');
        target.classList.remove('anim-in');
        
        const words = target.querySelectorAll('.word-anim, [data-word-reveal]');
        words.forEach(w => {
          (w as HTMLElement).setAttribute('data-reveal', 'inactive');
          w.classList.remove('anim-in');
        });
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  const observeNewElements = () => {
    const targets = document.querySelectorAll(selectors.join(', '));
    
    if (prefersReduced) {
      targets.forEach(t => {
        const el = t as HTMLElement;
        el.setAttribute('data-reveal', 'active');
        el.classList.add('anim-in');
        if (el.classList.contains('footer-quote-trigger')) splitAndAnimateWords(el);
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

  observeNewElements();

  const mutationObserver = new MutationObserver(() => {
    observeNewElements();
  });

  const rootElement = document.getElementById('root') || document.body;
  mutationObserver.observe(rootElement, {
    childList: true,
    subtree: true
  });
}

function animateCounter(el: HTMLElement) {
  const targetAttr = el.getAttribute('data-count-target');
  if (!targetAttr) return;

  const target = parseFloat(targetAttr);
  const suffix = el.getAttribute('data-count-suffix') || '';
  const duration = 1500;
  const start = performance.now();

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    const current = Math.round(eased * target);
    
    el.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function splitAndAnimateWords(el: HTMLElement) {
  if (el.classList.contains('is-split')) return;
  
  if (el.children.length > 0) {
    el.classList.add('is-split', 'flex', 'flex-wrap', 'items-baseline', 'gap-x-1.5');
    Array.from(el.children).forEach((child, i) => {
      const childEl = child as HTMLElement;
      childEl.classList.add('word-anim');
      childEl.setAttribute('data-reveal', 'inactive');
      childEl.style.transitionDelay = `${i * 100 + 200}ms`;
      requestAnimationFrame(() => childEl.setAttribute('data-reveal', 'active'));
    });
    return;
  }

  const text = el.textContent || '';
  el.textContent = '';
  el.classList.add('is-split');
  
  const words = text.trim().split(/\s+/);
  
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word + (i === words.length - 1 ? '' : ' ');
    span.className = 'word-anim';
    span.setAttribute('data-reveal', 'inactive');
    span.style.whiteSpace = 'pre';
    span.style.transitionDelay = `${i * 50 + 100}ms`;
    el.appendChild(span);
    
    requestAnimationFrame(() => span.setAttribute('data-reveal', 'active'));
  });
}
