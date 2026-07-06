/**
 * CrescendoPage Brand Identity Case Study for Crescendo Magazine.
 *
 * Fits in: a showcase page reachable via /studio/crescendo.
 *          Rendered lazily by App.tsx inside the page-transition wrapper.
 *
 * Sections:
 *   1. Hero full-bleed dark hero with the Crescendo mark
 *   2. Creative Stack & Brief Adobe CC tool badges + project overview
 *   3. Colour System five palettes with reasoning
 *   4. Logo Anatomy element breakdown + light/dark toggle
 *   5. Promotional Posts horizontal scroll carousel
 *   6. PDF Viewer embedded, premium-framed magazine viewer
 *   7. Footer TheCloser
 */
import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ScrollReveal } from '@/ui';
import { SEO, TheCloser } from '@/components/layout';
import { routeMeta } from '@/content';
import { SectionLabel } from './shared';

/* ─────────────────────────── CONSTANTS ─────────────────────────── */

const ASSET = '/assets/art/crescendo';

const PALETTES = [
  {
    name: 'Primary',
    section: 'Cover & Core Identity',
    reasoning: 'The cover palette. Purple into hot pink into warm orange bold and a little loud, which is exactly what a cover should be.',
    colors: [
      { hex: '#72147E', label: 'Royal Purple' },
      { hex: '#F21170', label: 'Hot Pink' },
      { hex: '#FA9905', label: 'Amber' },
      { hex: '#FF5200', label: 'Burnt Orange' },
    ],
  },
  {
    name: 'Governance',
    section: 'Student Government',
    reasoning: 'Near-black, charcoal, and a single hit of crimson. It reads serious and authoritative the right tone for student government coverage.',
    colors: [
      { hex: '#171717', label: 'Jet' },
      { hex: '#444444', label: 'Charcoal' },
      { hex: '#DA0037', label: 'Crimson' },
      { hex: '#EDEDED', label: 'Cloud' },
    ],
  },
  {
    name: 'Tech',
    section: 'Technology & Innovation',
    reasoning: 'Deep navy into cyan. Instantly reads as "digital" without leaning on the usual tech clichés.',
    colors: [
      { hex: '#04009A', label: 'Deep Navy' },
      { hex: '#77ACF1', label: 'Sky' },
      { hex: '#3EDBF0', label: 'Cyan' },
      { hex: '#C0FEFC', label: 'Ice' },
    ],
  },
  {
    name: 'Culture',
    section: 'Arts & Culture',
    reasoning: 'Teal, sunflower, tangerine, terracotta warm and earthy. It felt like the right fit for arts and culture: rich, grounded, and a bit unpredictable.',
    colors: [
      { hex: '#006E7F', label: 'Teal' },
      { hex: '#F8CB2E', label: 'Sunflower' },
      { hex: '#EE5007', label: 'Tangerine' },
      { hex: '#B22727', label: 'Terracotta' },
    ],
  },
  {
    name: 'Self Dev',
    section: 'Self Development',
    reasoning: 'Ocean blues into mint. Calm, a little hopeful the kind of palette that fits a section about growth and self-reflection.',
    colors: [
      { hex: '#22577A', label: 'Ocean' },
      { hex: '#38A3A5', label: 'Seafoam' },
      { hex: '#57CC99', label: 'Mint' },
      { hex: '#80ED99', label: 'Spring' },
    ],
  },
];

const ADOBE_TOOLS = [
  { abbr: 'Id', name: 'InDesign', color: '#FF3366', role: 'Magazine layout & typesetting' },
  { abbr: 'Ai', name: 'Illustrator', color: '#FF9A00', role: 'Logo & vector artwork' },
  { abbr: 'Ps', name: 'Photoshop', color: '#31A8FF', role: 'Photo compositing & mockups' },
  { abbr: 'Ac', name: 'Acrobat', color: '#EC1C24', role: 'PDF compilation & preflight' },
];

const LOGO_ELEMENT = {
  src: `${ASSET}/logo/element-c.webp`,
  label: 'The "C" Letterform',
  desc: 'I merged a bold serif "C" with a musical crescendo hairpin the arc opens outward, echoing the magazine\'s name and the idea of building momentum.',
};

const CAROUSEL_ITEMS = [
  { src: `${ASSET}/posts/mag-mockup.webp`, label: 'Magazine Cover Mockup' },
  { src: `${ASSET}/posts/sections/alumni.webp`, label: 'Alumni Section' },
  { src: `${ASSET}/posts/sections/design.webp`, label: 'Design & Art Section' },
  { src: `${ASSET}/posts/sections/events.webp`, label: 'Events Section' },
  { src: `${ASSET}/posts/sections/gov.webp`, label: 'Governance Section' },
  { src: `${ASSET}/posts/sections/s&c.webp`, label: 'Sports & Culture Section' },
  { src: `${ASSET}/posts/sections/sports.webp`, label: 'Sports Section' },
  { src: `${ASSET}/posts/sections/tech.webp`, label: 'Tech Section' },
  { src: `${ASSET}/posts/back-page.webp`, label: 'Back Page' },
];

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */




/** Detailed, interactive colour swatch with RGB calculation and copy functionality. */
function DetailedSwatch({ color }: { color: { hex: string; label: string } }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rgb = useMemo(() => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color.hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
  }, [color.hex]);

  return (
    <div className="group relative flex flex-col">
      <button 
        className="w-full aspect-square rounded-xl md:rounded-2xl mb-3 border border-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50"
        style={{ backgroundColor: color.hex }}
        onClick={handleCopy}
        aria-label={`Copy hex code ${color.hex} for ${color.label}`}
      >
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-mono text-micro md:text-xs font-bold text-white tracking-widest uppercase">Copied</span>
        </div>
      </button>
      <div className="flex flex-col gap-0.5 px-1">
        <span className="font-sans font-bold text-white text-sm tracking-tight">{color.label}</span>
        <span className="font-mono text-fine text-text-tertiary">{color.hex}</span>
        <span className="font-mono text-micro text-text-tertiary">RGB {rgb}</span>
      </div>
    </div>
  );
}

/** Interactive master-detail view for the colour palettes. */
function InteractivePalettes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePalette = PALETTES[activeIndex];

  return (
    <div className="flex flex-col gap-8 md:gap-16">
      {/* Tab Selector */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-center lg:justify-start">
        {PALETTES.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActiveIndex(i)}
            className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full border transition-all duration-300 font-mono text-micro md:text-xs uppercase tracking-mega ${
              i === activeIndex
                ? 'border-white bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                : 'border-white/20 hover:border-white/50 text-text-tertiary hover:text-white bg-white/[0.02]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center min-h-[400px]">
        {/* Left: Info & Swatches (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 md:space-y-12">
          <motion.div
            key={`info-${activeIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 font-mono text-micro tracking-mega uppercase text-text-secondary mb-4">
                {activePalette.section}
              </span>
              <h3 className="font-noto text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                {activePalette.name}
              </h3>
            </div>
            <p className="text-text-tertiary text-base md:text-lg leading-relaxed max-w-xl font-sans">
              {activePalette.reasoning}
            </p>
          </motion.div>

          <motion.div
            key={`swatches-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="grid grid-cols-4 gap-3 md:gap-6"
          >
            {activePalette.colors.map((c) => (
              <DetailedSwatch key={c.hex} color={c} />
            ))}
          </motion.div>
        </div>

        {/* Right: Abstract Visual Representation (5 cols) */}
        <div className="lg:col-span-5 h-[300px] md:h-[450px] lg:h-[600px] rounded-[2rem] overflow-hidden flex shadow-2xl border border-white/10 relative group bg-black">
           {/* Color strips */}
           <div className="absolute inset-0 flex flex-col w-full h-full">
             {activePalette.colors.map((c, i) => (
               <motion.div
                 key={c.hex + activeIndex}
                 initial={{ height: '0%' }}
                 animate={{ height: '100%' }}
                 transition={{ 
                   duration: 0.7, 
                   delay: i * 0.08, 
                   ease: [0.22, 1, 0.36, 1]
                 }}
                 className="flex-grow relative origin-top w-full"
                 style={{ backgroundColor: c.hex }}
               >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 mix-blend-overlay" />
               </motion.div>
             ))}
           </div>
           
           {/* Glossy overlay */}
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-60" />
           
           {/* Dynamic typography overlay */}
           <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay opacity-30 pointer-events-none overflow-hidden">
              <motion.span 
                key={`text-${activeIndex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="font-noto font-black text-[8rem] md:text-[12rem] lg:text-[16rem] text-white leading-none whitespace-nowrap rotate-90 lg:rotate-0"
              >
                0{activeIndex + 1}
              </motion.span>
           </div>
        </div>
      </div>
    </div>
  );
}

/** Horizontal scroll carousel for promo posts. */
function PostsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[idx] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(idx);
    }
  }, []);

  // Track scroll position to update active dot
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollLeft = el.scrollLeft;
          const childWidth = (el.firstElementChild as HTMLElement)?.offsetWidth || 1;
          const gap = 24; // gap-6 = 1.5rem = 24px
          setActiveIndex(Math.round(scrollLeft / (childWidth + gap)));
          ticking = false;
        });
        ticking = true;
      }
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {CAROUSEL_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-72 sm:w-80 md:w-96 snap-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-500 bg-white/[0.02]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="font-mono text-micro font-bold tracking-widest uppercase text-white drop-shadow-lg">
                  {item.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {CAROUSEL_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-white/80 scale-125'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/** A single page of the PDF rendered onto an HTML5 canvas. */
function PDFPageCanvas({ pdfDoc, pageNum }: { pdfDoc: any; pageNum: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        if (!canvasRef.current.width) setPageLoading(true);
        const page = await pdfDoc.getPage(pageNum);
        if (!active) return;

        // Cancel previous render task if active
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const viewport = page.getViewport({ scale: 1.5 }); // High resolution scale
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Set dimensions for high DPI screens
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        context.scale(dpr, dpr);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (active) {
          setPageLoading(false);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException' && active) {
          console.error('Error rendering page:', err);
          setPageLoading(false);
        }
      }
    }

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum]);

  return (
    <div className="relative flex items-center justify-center bg-black/40 rounded-lg overflow-hidden w-full max-w-full">
      {pageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full h-auto block shadow-xl" />
    </div>
  );
}

/** Premium PDF viewer with glass chrome. */
function PDFViewer({ src }: { src: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [loadingScript, setLoadingScript] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [isMobile, setIsMobile] = useState(false);

  // Fullscreen support
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Window resize handler for mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamic script loader for PDF.js
  useEffect(() => {
    const globalPdf = (window as any)['pdfjs-dist/build/pdf'];
    if (globalPdf) {
      globalPdf.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfjs(globalPdf);
      setLoadingScript(false);
      return;
    }

    const existingScript = document.getElementById('pdfjs-cdn-script');
    if (existingScript) {
      const handleLoad = () => {
        const lib = (window as any)['pdfjs-dist/build/pdf'];
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjs(lib);
        setLoadingScript(false);
      };
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = 'pdfjs-cdn-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    // SRI-pin the external library: it runs with full page privileges, so a
    // compromised CDN must not be able to silently ship different code. Hash is
    // cdnjs's published SRI for this exact version; crossorigin is required for
    // the browser to verify a cross-origin resource.
    script.integrity = 'sha512-q+4liFwdPC/bNdhUpZx6aXDx/h77yEQtn4I1slHydcbZK34nLaR3cAeYSJshoxIOq3mjEf7xJE8YWIUHMn+oCQ==';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      const lib = (window as any)['pdfjs-dist/build/pdf'];
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setPdfjs(lib);
      setLoadingScript(false);
    };
    
    script.onerror = () => {
      setError('Failed to load PDF reader library. Please refresh.');
      setLoadingScript(false);
    };

    document.head.appendChild(script);
  }, []);

  // Load PDF document once PDF.js is ready
  useEffect(() => {
    if (!pdfjs) return;

    let active = true;
    setLoadingPdf(true);

    const loadingTask = pdfjs.getDocument(src);
    loadingTask.promise.then(
      (doc: any) => {
        if (!active) return;
        setPdfDoc(doc);
        setLoadingPdf(false);
      },
      (err: any) => {
        if (!active) return;
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF document.');
        setLoadingPdf(false);
      }
    );

    return () => {
      active = false;
    };
  }, [pdfjs, src]);

  // Derived layout calculations
  const numPages = pdfDoc ? pdfDoc.numPages : 0;
  const totalSpreads = pdfDoc ? Math.ceil((numPages - 1) / 2) + 1 : 0;
  const currentSpread = currentPage === 1 ? 0 : Math.floor(currentPage / 2);

  const pagesToRender = !pdfDoc
    ? []
    : isMobile
    ? [currentPage]
    : currentSpread === 0
    ? [1]
    : [currentSpread * 2, currentSpread * 2 + 1].filter(p => p <= numPages);

  const goToNext = useCallback(() => {
    if (!pdfDoc) return;
    if (isMobile) {
      setCurrentPage(prev => Math.min(numPages, prev + 1));
    } else {
      const nextSpread = currentSpread + 1;
      if (nextSpread < totalSpreads) {
        setCurrentPage(nextSpread === 1 ? 2 : nextSpread * 2);
      }
    }
  }, [pdfDoc, isMobile, currentSpread, totalSpreads, numPages]);

  const goToPrev = useCallback(() => {
    if (!pdfDoc) return;
    if (isMobile) {
      setCurrentPage(prev => Math.max(1, prev - 1));
    } else {
      const prevSpread = currentSpread - 1;
      if (prevSpread >= 0) {
        setCurrentPage(prevSpread === 0 ? 1 : prevSpread * 2);
      }
    }
  }, [pdfDoc, isMobile, currentSpread]);

  // Keyboard navigation
  useEffect(() => {
    if (!pdfDoc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfDoc, goToPrev, goToNext]);

  const increaseZoom = () => setScale(prev => Math.min(2.5, prev + 0.15));
  const decreaseZoom = () => setScale(prev => Math.max(0.6, prev - 0.15));

  const getPageIndicatorText = () => {
    if (!pdfDoc) return '';
    if (isMobile) {
      return `Page ${currentPage} of ${numPages}`;
    }
    if (currentSpread === 0) {
      return `Page 1 of ${numPages}`;
    }
    const L = currentSpread * 2;
    const R = L + 1;
    if (R <= numPages) {
      return `Pages ${L}–${R} of ${numPages}`;
    }
    return `Page ${L} of ${numPages}`;
  };

  if (error) {
    return (
      <div className="relative rounded-b-2xl md:rounded-b-3xl border border-t-0 border-white/8 bg-black/60 min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-mono text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/[0.03] text-xs font-mono uppercase tracking-wider text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loadingScript || loadingPdf) {
    return (
      <div className="relative rounded-b-2xl md:rounded-b-3xl border border-t-0 border-white/8 bg-black/60 min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
          <span className="font-mono text-micro tracking-widest text-text-tertiary uppercase">
            {loadingScript ? 'Initializing Reader…' : 'Loading Publication…'}
          </span>
        </div>
      </div>
    );
  }

  const hasPrev = isMobile ? currentPage > 1 : currentSpread > 0;
  const hasNext = isMobile ? currentPage < numPages : currentSpread < totalSpreads - 1;

  return (
    <div ref={containerRef} className="relative group flex flex-col select-none">
      {/* Glass toolbar */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-3 rounded-t-2xl md:rounded-t-3xl border border-b-0 border-white/5 bg-white/[0.01] backdrop-blur-xl">
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-viz-mac-red" />
            <span className="w-3 h-3 rounded-full bg-viz-mac-yellow" />
            <span className="w-3 h-3 rounded-full bg-viz-mac-green" />
          </div>
          <span className="font-mono text-micro tracking-widest uppercase text-text-tertiary ml-2">
            Crescendo Volume Two
          </span>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-1">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`p-1 rounded transition-all ${
              hasPrev ? 'text-text-tertiary hover:text-white hover:bg-white/[0.05]' : 'text-text-muted cursor-not-allowed'
            }`}
            title="Previous Page (Left Arrow)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="font-mono text-micro tracking-widest uppercase text-text-secondary min-w-[110px] text-center select-none">
            {getPageIndicatorText()}
          </span>
          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`p-1 rounded transition-all ${
              hasNext ? 'text-text-tertiary hover:text-white hover:bg-white/[0.05]' : 'text-text-muted cursor-not-allowed'
            }`}
            title="Next Page (Right Arrow)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1">
            <button
              onClick={decreaseZoom}
              className="p-1 text-text-tertiary hover:text-white hover:bg-white/[0.05] rounded transition-all"
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="font-mono text-micro text-text-tertiary w-10 text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={increaseZoom}
              className="p-1 text-text-tertiary hover:text-white hover:bg-white/[0.05] rounded transition-all"
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Download button */}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 font-mono text-micro font-bold tracking-widest uppercase text-text-tertiary hover:text-text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              PDF
            </a>
            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 font-mono text-micro font-bold tracking-widest uppercase text-text-tertiary hover:text-text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isFullscreen ? (
                  <>
                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                  </>
                ) : (
                  <>
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </>
                )}
              </svg>
              {isFullscreen ? 'Exit' : 'Expand'}
            </button>
          </div>
        </div>
      </div>

      {/* PDF content area */}
      <div className="relative rounded-b-2xl md:rounded-b-3xl border border-t-0 border-white/5 bg-black/20 p-4 md:p-8 min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-auto select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${isMobile}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: scale }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full flex justify-center origin-center will-change-transform"
          >
            {isMobile || pagesToRender.length === 1 ? (
              <div className="shadow-2xl hover:shadow-white/[0.02] transition-shadow duration-300 w-full max-w-md mx-auto">
                <PDFPageCanvas pdfDoc={pdfDoc} pageNum={pagesToRender[0]} />
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center relative shadow-2xl rounded-lg overflow-hidden max-w-5xl w-full mx-auto bg-white">
                <div className="flex-1 flex justify-end border-r border-black/35 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)]">
                  <PDFPageCanvas pdfDoc={pdfDoc} pageNum={pagesToRender[0]} />
                </div>
                <div className="flex-1 flex justify-start shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]">
                  {pagesToRender[1] && (
                    <PDFPageCanvas pdfDoc={pdfDoc} pageNum={pagesToRender[1]} />
                  )}
                </div>
                {/* Book spine crease shadow */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none z-20" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────── TYPOGRAPHY SHOWCASE ─────────────────────────── */

const SHOWCASE_FONTS = [
  {
    name: 'Alta Caption',
    type: 'Display Serif',
    role: 'Master Identity',
    fontFamily: "'Alta Caption', serif",
    description: 'The face behind the Crescendo logotype and all the major article covers. High contrast, bracketed serifs, architectural it has that elegant-but-confident editorial presence I was after.',
    defaultText: 'Crescendo',
    styles: {
      container: 'border-[#72147E]/30 bg-[#72147E]/[0.02] hover:bg-[#72147E]/[0.05]',
      roleBadge: 'border-[#F21170]/30 bg-[#F21170]/10 text-[#F21170]',
      inputWrapper: 'bg-black/20 border border-white/5 backdrop-blur-sm',
      inputGradient: 'from-[#72147E] to-[#F21170]',
      textConfig: 'text-5xl md:text-6xl lg:text-7xl font-normal',
      alignment: 'text-center',
    },
    decorations: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-[#72147E]/10 via-transparent to-[#F21170]/10 opacity-50 pointer-events-none transition-opacity duration-700" />
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none translate-x-10 -translate-y-10">
          <span className="font-serif text-[200px] font-bold select-none leading-none">Aa</span>
        </div>
      </>
    )
  },
  {
    name: 'Graphik',
    type: 'Neo-Grotesque',
    role: 'System & Body',
    fontFamily: "'Graphik', sans-serif",
    description: 'The workhorse of the whole system. Graphik handles everything from body copy to headers and metadata dependable, clean, never in the way.',
    defaultText: 'editorial system 2022',
    styles: {
      container: 'border-white/10 bg-white/[0.01] hover:bg-white/[0.03]',
      roleBadge: 'border-white/20 bg-black/40 text-text-tertiary',
      inputWrapper: 'bg-transparent border-l-2 border-white/10 group-hover:border-white/30',
      inputGradient: 'from-white/40 to-white/10',
      textConfig: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
      alignment: 'text-left pl-4',
    },
    decorations: (
      <div className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-700" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    )
  },
  {
    name: 'Pluto Sans',
    type: 'Geometric Sans',
    role: 'Sports & Culture',
    fontFamily: "'Pluto Sans', sans-serif",
    description: 'Brought in specifically for the Sports and Culture titles. The round shapes and heavy weight give it that punchy, crowd-energy feel without tipping into aggressive.',
    defaultText: 'CRESCENDO SPORTS',
    styles: {
      container: 'border-[#FA9905]/20 bg-[#FA9905]/[0.02] hover:bg-[#FA9905]/[0.05]',
      roleBadge: 'border-[#FA9905]/30 bg-[#FA9905]/10 text-[#FA9905] backdrop-blur-sm',
      inputWrapper: 'bg-transparent',
      inputGradient: 'from-[#FA9905] to-[#EE5007]',
      textConfig: 'text-4xl md:text-5xl lg:text-6xl font-black uppercase drop-shadow-md',
      alignment: 'text-left md:text-center',
    },
    decorations: (
      <>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FA9905]/10 to-transparent opacity-40 pointer-events-none transition-opacity duration-700" />
        <div className="absolute -right-20 -top-20 w-64 h-64 border-[40px] border-[#FA9905]/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 border-[20px] border-[#EE5007]/5 rounded-full blur-lg pointer-events-none" />
      </>
    )
  },
  {
    name: 'Garvis Pro',
    type: 'Editorial Italic',
    role: 'Features',
    fontFamily: "'Garvis Pro', serif",
    description: 'The italic for the quieter moments poetry pages, long profiles, pull quotes. It brings pace and a literary rhythm to the spreads that need it most.',
    defaultText: 'Poetry & Literary Spreads',
    styles: {
      container: 'border-[#EDEDED]/10 bg-[#171717] hover:border-white/20 shadow-inner',
      roleBadge: 'border-white/10 bg-black/50 text-text-tertiary',
      inputWrapper: 'bg-transparent border-l-2 border-white/10 group-hover:border-white/30',
      inputGradient: 'from-white/30 to-transparent',
      textConfig: 'text-4xl md:text-5xl lg:text-6xl italic leading-tight',
      alignment: 'text-left pl-4',
    },
    decorations: (
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay transition-opacity duration-700" style={{ backgroundImage: 'url("/assets/noise.png")' }} />
    )
  },
  {
    name: 'Halingtone William',
    type: 'Script Italic',
    role: 'Arts & Accents',
    fontFamily: "'Halingtone William', cursive",
    description: 'Used sparingly designer notes, arts spreads, a few accent spots. The flowing calligraphy is a nice contrast against all the clean structured layouts elsewhere.',
    defaultText: 'Visual Arts Column',
    styles: {
      container: 'border-[#3EDBF0]/20 bg-[#04009A]/10 hover:border-[#3EDBF0]/40 backdrop-blur-md',
      roleBadge: 'border-[#3EDBF0]/30 bg-[#3EDBF0]/10 text-[#3EDBF0] backdrop-blur-sm',
      inputWrapper: 'bg-transparent',
      inputGradient: 'from-[#3EDBF0] to-[#04009A]',
      textConfig: 'text-5xl md:text-6xl lg:text-7xl italic drop-shadow-lg leading-none',
      alignment: 'text-center',
    },
    decorations: (
      <>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3EDBF0]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#3EDBF0]/20 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#04009A]/30 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#04009A]/40 transition-colors duration-700" />
      </>
    )
  }
];

function TypographyShowcase() {
  const [index, setIndex] = useState(0);
  const activeFont = SHOWCASE_FONTS[index];
  const [text, setText] = useState(activeFont.defaultText);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
      {/* 30% Left Panel - Font List */}
      <div className="w-full lg:w-[30%] flex flex-col justify-center gap-2">
        <span className="font-mono text-micro md:text-micro text-text-tertiary uppercase tracking-widest mb-2 pl-4">
          Select Identity
        </span>
        {SHOWCASE_FONTS.map((font, i) => (
          <button
            key={i}
            onClick={() => {
              if (text === SHOWCASE_FONTS[index].defaultText) {
                setText(SHOWCASE_FONTS[i].defaultText);
              }
              setIndex(i);
            }}
            className={`text-left px-5 py-4 rounded-xl md:rounded-2xl transition-all duration-300 flex flex-col gap-1 border ${
              i === index
                ? 'bg-white/[0.08] border-white/20 shadow-lg'
                : 'bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/10'
            }`}
          >
            <span 
              className={`font-bold text-xl md:text-2xl transition-colors ${i === index ? 'text-white' : 'text-text-tertiary'}`}
              style={{ fontFamily: font.fontFamily }}
            >
              {font.name}
            </span>
            <span className={`font-mono text-micro uppercase tracking-widest transition-colors ${i === index ? 'text-text-tertiary' : 'text-text-ghost'}`}>
              {font.role}
            </span>
          </button>
        ))}
      </div>
      
      {/* 70% Right Panel - Viewing Pane */}
      <div className="w-full lg:w-[70%] flex flex-col">
        <div 
          className={`relative w-full rounded-3xl overflow-hidden border transition-all duration-700 group ${activeFont.styles.container} h-[500px] md:h-[550px] flex flex-col shrink-0`}
        >
          {activeFont.decorations}
          
          <div className="relative p-6 md:p-10 flex-grow flex flex-col justify-between z-10 h-full">
            {/* Header */}
            <div className="flex items-start justify-between h-24 shrink-0">
              <div className="flex flex-col">
                <span className={`inline-block px-3 py-1 rounded-full border font-mono text-micro tracking-mega uppercase w-fit mb-3 transition-colors duration-700 ${activeFont.styles.roleBadge}`}>
                  {activeFont.role}
                </span>
                <AnimatePresence mode="wait">
                  <motion.h3 
                    key={activeFont.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl md:text-4xl font-bold mb-1" 
                    style={{ fontFamily: activeFont.fontFamily }}
                  >
                    {activeFont.name}
                  </motion.h3>
                </AnimatePresence>
                <span className="font-mono text-micro text-text-tertiary uppercase tracking-widest transition-opacity duration-700">
                  {activeFont.type}
                </span>
              </div>
            </div>

            {/* Input Area */}
            <div className="my-auto py-6 md:py-10">
              <div className={`relative group/input p-4 ${activeFont.styles.inputWrapper} transition-all duration-700`}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${activeFont.styles.inputGradient} opacity-50 group-hover/input:opacity-100 transition-opacity duration-700 rounded-l-2xl`} />
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`w-full bg-transparent border-none text-white tracking-tight focus:outline-none focus:ring-0 p-2 cursor-text transition-all duration-700 ${activeFont.styles.textConfig} ${activeFont.styles.alignment}`}
                  style={{ fontFamily: activeFont.fontFamily }}
                  title={`Edit ${activeFont.name} specimen`}
                />
              </div>
            </div>

            {/* Footer Description */}
            <div className="mt-auto h-28 flex flex-col justify-end shrink-0">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={activeFont.description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-text-tertiary text-sm md:text-base leading-relaxed max-w-2xl"
                >
                  {activeFont.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Defers mounting its children until they scroll near the viewport. Used to gate
 * the PDF viewer: PDFViewer loads pdf.js from a CDN and calls getDocument on the
 * full ~23MB magazine the moment it mounts, so mounting it eagerly pulled all of
 * it ~1.6s into every visit to this page (125s simulated-mobile LCP). Now that
 * work starts only when the reader is about to come into view. The placeholder
 * reserves the viewer's own min-height so nothing shifts when it swaps in.
 */
function DeferUntilVisible({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // No IntersectionObserver (very old browsers / some test envs): start visible
  // so the viewer is never hidden forever. Otherwise start hidden and reveal on
  // scroll. Using a lazy initial value keeps the fallback out of the effect body.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      // Start ~a viewport early so the reader is ready as it arrives.
      // No preload margin: the viewer sits just below a full-height hero, so any
      // margin would intersect on initial load and pull the ~23MB PDF up front -
      // exactly what we're avoiding. Load only once it's actually scrolled into view.
      { rootMargin: '0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref}>
      {visible ? (
        children
      ) : (
        <div className="relative rounded-2xl md:rounded-3xl border border-white/8 bg-black/60 min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
          <span className="font-mono text-micro tracking-widest text-text-tertiary uppercase">
            Scroll to load the magazine…
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export const CrescendoPage = () => {
  const [logoMode, setLogoMode] = useState<'dark' | 'light'>('dark');
  const pdfUrl = `${ASSET}/crescendo_compressed.pdf`;

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-white/20 overflow-x-hidden flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
          font-family: 'Alta Caption';
          src: url('/assets/art/crescendo/fonts/Alta_caption.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Graphik';
          src: url('/assets/art/crescendo/fonts/GraphikRegular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Graphik';
          src: url('/assets/art/crescendo/fonts/GraphikBold.woff2') format('woff2');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Garvis Pro';
          src: url('/assets/art/crescendo/fonts/Garvis%20Pro%20Italic.woff2') format('woff2');
          font-weight: normal;
          font-style: italic;
          font-display: swap;
        }
        @font-face {
          font-family: 'Pluto Sans';
          src: url('/assets/art/crescendo/fonts/Pluto%20Sans%20W04%20Bold.woff2') format('woff2');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Halingtone William';
          src: url('/assets/art/crescendo/fonts/Halingtone%20William%20Italic.woff2') format('woff2');
          font-weight: normal;
          font-style: italic;
          font-display: swap;
        }
      `}} />
      <SEO {...routeMeta('/studio/crescendo')} />

      {/* ══════════════════════════════════════════════
          SECTION 1 HERO (Cinematic Split-Screen)
      ══════════════════════════════════════════════ */}
      <section className="relative w-full h-[100svh] min-h-[640px] max-h-[1100px] flex items-center overflow-hidden">
        {/* Deep immersive background */}
        <div className="absolute inset-0 bg-[#030303]" />
        
        {/* Ambient glow top-left purple */}
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse,#72147E18_0%,transparent_70%)] pointer-events-none blur-[60px]" aria-hidden />
        {/* Ambient glow bottom-right pink/amber */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] bg-[radial-gradient(ellipse,#F2117012_0%,#FA990508_40%,transparent_70%)] pointer-events-none blur-[60px]" aria-hidden />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/assets/noise.png")' }} />
        
        {/* Subtle editorial grid lines */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-[6%] w-px bg-white/[0.03]" />
        <div className="hidden lg:block absolute top-0 bottom-0 right-[6%] w-px bg-white/[0.03]" />
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.02]" />

        {/* ─── Content Grid ─── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center h-full pt-28 pb-10 lg:pt-0 lg:pb-0">
          
          {/* LEFT Editorial Content */}
          <div className="flex flex-col justify-center gap-6 lg:gap-7 text-center lg:text-left order-2 lg:order-1">
            
            {/* Category Badge */}
            <ScrollReveal direction="up" className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#F21170]/25 bg-gradient-to-r from-[#72147E]/15 to-[#F21170]/8 shadow-[0_0_30px_rgba(242,17,112,0.1)] relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F21170] shadow-[0_0_8px_#F21170] animate-pulse" />
                <span className="font-mono text-micro md:text-micro tracking-[0.35em] uppercase font-bold text-text-primary">
                  Brand Identity & Editorial
                </span>
              </div>
            </ScrollReveal>

            {/* Logo */}
            <ScrollReveal direction="up" delay={0.08}>
              <h1 className="sr-only">Crescendo</h1>
              <img
                src={`${ASSET}/logo/text-dark-transparent.webp`}
                alt="Crescendo"
                className="w-full max-w-[320px] md:max-w-[480px] lg:max-w-[520px] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] mx-auto lg:mx-0"
                loading="eager"
              />
            </ScrollReveal>

            {/* Tagline */}
            <ScrollReveal direction="up" delay={0.15}>
              <p className="text-text-tertiary font-light text-sm md:text-base lg:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                Full brand identity for GITAM University's flagship student magazine logo, type system, colour palettes, and every spread across 120+ pages.
              </p>
            </ScrollReveal>

            {/* Adobe Tools inline strip */}
            <ScrollReveal direction="up" delay={0.22} className="flex justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                {ADOBE_TOOLS.map((tool, i) => (
                  <motion.div
                    key={tool.abbr}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="group/badge relative"
                  >
                    <div 
                      className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${tool.color}20, rgba(0,0,0,0.7))`,
                        borderColor: `${tool.color}35`,
                        boxShadow: `0 4px 16px ${tool.color}15`
                      }}
                    >
                      <span className="font-bold text-xs md:text-sm tracking-tight" style={{ color: tool.color }}>
                        {tool.abbr}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-black/95 px-3 py-2 rounded-lg border border-white/10 shadow-2xl z-50">
                      <span className="block text-white font-bold text-micro mb-0.5">{tool.name}</span>
                      <span className="block text-text-tertiary text-micro font-mono tracking-wide">{tool.role}</span>
                    </div>
                  </motion.div>
                ))}
                <span className="ml-1 font-mono text-micro text-text-ghost tracking-widest uppercase hidden md:inline">Built with</span>
              </div>
            </ScrollReveal>

            {/* Metadata compact horizontal stats */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2 border-t border-white/[0.06]">
                {[
                  { label: 'Role', value: 'Senior Illustrator' },
                  { label: 'Pages', value: '120+' },
                  { label: 'Client', value: 'GITAM University' },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-2">
                    <span className="font-mono text-micro uppercase tracking-mega text-text-tertiary">{item.label}</span>
                    <span className="font-sans text-xs text-text-secondary font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT Magazine Mockup */}
          <div className="relative flex items-center justify-center order-1 lg:order-2">
            <ScrollReveal direction="up" delay={0.15} className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px] mx-auto">
              {/* Ambient glow behind magazine */}
              <div className="absolute inset-[-20%] bg-gradient-to-tr from-[#72147E] via-[#F21170] to-[#FA9905] rounded-full blur-[80px] opacity-20 animate-pulse" style={{ animationDuration: '6s' }} />
              
              {/* Secondary pulse ring */}
              <motion.div 
                className="absolute inset-[-10%] rounded-[2rem] border border-white/[0.04]"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                initial={{ opacity: 0, y: 40, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, rotateY: 3, rotateX: -2 }}
                className="relative z-10 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)] cursor-pointer group transform-gpu"
                style={{ 
                  perspective: '1000px',
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)' 
                }}
              >
                <img
                  src={`${ASSET}/posts/mag-mockup.webp`}
                  alt="Crescendo Magazine Cover Mockup"
                  className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                  loading="eager"
                />
                {/* Glossy reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Inner border highlight */}
                <div className="absolute inset-0 border border-white/[0.06] rounded-2xl md:rounded-3xl pointer-events-none" />
                {/* Bottom gradient for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </motion.div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-mono text-micro tracking-ultra uppercase text-text-tertiary">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 THE PUBLICATION (PDF VIEWER)
      ══════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-16 pt-20 md:pt-28 pb-20 md:pb-28">
        {/* Ambient glow for PDF viewer */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#72147E10_0%,transparent_60%)]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <SectionLabel number="01" title="The Publication" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Flip through the pages.
            </h2>
            <p className="text-text-tertiary font-mono text-xs md:text-sm max-w-2xl mb-10 md:mb-14">
              The whole thing, right here. 120+ pages compiled in InDesign flip through at your own pace.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <DeferUntilVisible>
              <PDFViewer src={pdfUrl} />
            </DeferUntilVisible>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 LOGO ANATOMY
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="02" title="Logo Design" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Anatomy of the mark.
            </h2>
            <p className="text-text-tertiary font-mono text-xs md:text-sm max-w-2xl mb-10 md:mb-14">
              The mark needed to work everywhere from a tiny Instagram avatar to a full-bleed cover. So I built it to hold up at any size.
            </p>
          </ScrollReveal>

          {/* Element breakdown & Dark/Light mode toggle grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-14 md:mb-20">
            <ScrollReveal direction="up" className="h-full">
              <div className="h-full flex flex-col rounded-2xl md:rounded-3xl border border-white/8 bg-white/[0.02] overflow-hidden group hover:border-white/15 transition-all duration-500">
                <div className="flex-grow flex items-center justify-center p-10 bg-black">
                  <img
                    src={LOGO_ELEMENT.src}
                    alt={LOGO_ELEMENT.label}
                    className="w-full max-w-[280px] md:max-w-xs object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-6 border-t border-white/5 bg-white/[0.02]">
                  <h4 className="font-noto text-base md:text-lg font-bold text-white mb-2">{LOGO_ELEMENT.label}</h4>
                  <p className="text-text-tertiary text-xs md:text-sm leading-relaxed">{LOGO_ELEMENT.desc}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1} className="h-full">
              <div className="h-full flex flex-col rounded-2xl md:rounded-3xl border border-white/8 bg-white/[0.02] overflow-hidden">
                {/* Toggle header */}
                <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/5">
                  <h4 className="font-noto text-sm md:text-base font-bold text-white">
                    Light & Dark Variants
                  </h4>
                  <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/8">
                    <button
                      onClick={() => setLogoMode('dark')}
                      className={`px-4 py-1.5 rounded-full font-mono text-micro md:text-micro font-bold tracking-widest uppercase transition-all duration-300 ${
                        logoMode === 'dark'
                          ? 'bg-white text-black'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setLogoMode('light')}
                      className={`px-4 py-1.5 rounded-full font-mono text-micro md:text-micro font-bold tracking-widest uppercase transition-all duration-300 ${
                        logoMode === 'light'
                          ? 'bg-white text-black'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>
                {/* Logo display */}
                <div
                  className="relative flex-grow flex items-center justify-center py-16 md:py-24 px-8 transition-colors duration-700"
                  style={{
                    backgroundColor: logoMode === 'dark' ? 'black' : 'white',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={logoMode}
                      src={
                        logoMode === 'dark'
                          ? `${ASSET}/logo/text-dark-transparent.webp`
                          : `${ASSET}/logo/text-light-transparent.webp`
                      }
                      alt={`Crescendo wordmark ${logoMode} mode`}
                      className="w-full max-w-[280px] md:max-w-md max-h-24 md:max-h-32 object-contain"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    />
                  </AnimatePresence>
                </div>
                <div className="px-5 md:px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                  <p className="text-text-tertiary text-xs leading-relaxed">
                    The custom 'C' leads into a clean modern serif. I kept the proportions identical across both modes so switching doesn't shift anything around.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3.5 TYPOGRAPHY & TYPEFACES
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-12 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="03" title="Typography & Editorial Voice" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 text-left">
              <div>
                <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3">
                  Speaking the language.
                </h2>
                <p className="text-text-tertiary font-mono text-xs md:text-sm max-w-xl">
                  Every section had its own personality, so the type choices needed to match. I paired clean Swiss geometry with high-contrast serifs and a couple of expressive picks to give the magazine some real character. Type something in the box the fonts are live.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Immersive Typography Showcase */}
          <ScrollReveal direction="up">
            <TypographyShowcase />
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 PROMOTIONAL POSTS
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="04" title="Section Covers & Promo" />
            <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Every section tells a story.
            </h2>
            <p className="text-text-tertiary font-mono text-xs md:text-sm max-w-2xl mb-10 md:mb-14">
              I treated each section like its own mini-brand different palette, different mood but kept the structure consistent so it all still reads as one magazine.
            </p>
          </ScrollReveal>

          <PostsCarousel />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 COLOUR SYSTEM
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <SectionLabel number="05" title="Colour System" />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
              <h2 className="font-noto text-3xl md:text-5xl font-black uppercase tracking-tighter shrink-0">
                Five palettes, one voice.
              </h2>
              <p className="text-text-tertiary font-mono text-xs md:text-sm max-w-xl md:text-right">
                Each section got its own colour story built to feel distinct but never disconnected. The shared layout grid keeps everything grounded.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-8">
            <ScrollReveal direction="up">
              <InteractivePalettes />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="w-full border-t border-white/5 mt-auto">
        <TheCloser />
      </footer>
    </div>
  );
};

export default CrescendoPage;
