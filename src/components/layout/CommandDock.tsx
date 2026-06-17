import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { smoothScrollTo } from '@/utils/scroll';
import { AIChatDrawer } from './AIChatDrawer';

interface PageSection {
  id: string;
  name: string;
}

const SECTIONS_BY_PAGE: Record<string, PageSection[]> = {
  '/': [
    { id: 'hero', name: 'Intro' },
    { id: 'projects', name: 'Projects' },
    { id: 'expertise', name: 'Expertise' },
    { id: 'experience', name: 'Experience' },
    { id: 'contact', name: 'Contact' },
  ],
};

export function CommandDock() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === '/';
  const isConnect = pathname === '/connect' || pathname === '/contact';
  const isBanner = pathname === '/linkedin-banner';

  const currentSections = useMemo(() => SECTIONS_BY_PAGE[pathname] || [], [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(maxScroll > 0 ? (scrollPx / maxScroll) * 100 : 0);
      setIsAtTop(scrollPx < 20);

      // Scrollspy logic
      if (currentSections.length > 0) {
        const viewportHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        const isNearBottom = scrollPx + viewportHeight >= scrollHeight - 120;

        if (isNearBottom) {
          setActiveSection(currentSections[currentSections.length - 1].id);
        } else {
          let activeId = currentSections[0].id;
          for (const section of currentSections) {
            const el = document.getElementById(section.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.3) {
                activeId = section.id;
              }
            }
          }
          setActiveSection(activeId);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, currentSections]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const scrollToTop = () => smoothScrollTo(0, 1.2);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  const showScrollOrHome = !isHome || !isAtTop;
  const isHomeIcon = isAtTop && !isHome;
  const isVisible = !isConnect && !isBanner && !(chatOpen && isMobile) && (!isHome || !isAtTop);

  if (isConnect || isBanner) return null;

  return (
    <>
      <AIChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'fixed bottom-8 right-4 md:bottom-8 md:right-8 z-[100]',
              'flex flex-col items-end gap-2 p-1',
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Sections Menu */}
            <AnimatePresence>
              {!isMobile && isHovered && !chatOpen && currentSections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={cn(
                    'flex flex-col gap-1 p-1.5 min-w-[130px]',
                    'backdrop-blur-xl bg-black/80 border border-white/10',
                    'rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
                  )}
                >
                  {currentSections.map((section) => {
                    const isActive = activeSection === section.id;
                    const offset = (section.id === 'f1-narrative' || section.id === 'f1-workflow') ? 100 : 10;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          smoothScrollTo(section.id, 1.2, offset);
                          setIsHovered(false);
                        }}
                        className={cn(
                          'w-full text-left pl-4 pr-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 relative',
                          isActive
                            ? 'text-brand-primary bg-brand-primary/10 font-bold'
                            : 'text-white/60 hover:text-white hover:bg-white/5',
                        )}
                      >
                        <span className="relative z-10">{section.name}</span>
                        {isActive && (
                          <motion.span
                            layoutId="active-section-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-brand-primary rounded-r-md"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* The main dock bar */}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-2',
                'backdrop-blur-xl bg-black/70 border border-white/10',
                'rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
              )}
            >
              <motion.button
                id="ai-trigger-button"
                onClick={() => {
                  setIsHovered(false);
                  if (isHome) {
                    smoothScrollTo(0, 1.2);
                    setTimeout(() => document.getElementById('hero-terminal-input')?.focus(), 1200);
                  } else {
                    const next = !chatOpen;
                    setChatOpen(next);
                    if (next) {
                      // Synchronously focus the drawer input on the same tick as the click event
                      document.getElementById('ai-chat-drawer-input')?.focus();
                    }
                  }
                }}
                animate={{
                  width: !isMobile && isHovered && !chatOpen ? 125 : 40,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={cn(
                  'relative flex items-center justify-center h-10 rounded-full transition-colors overflow-hidden select-none cursor-pointer',
                  chatOpen
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-white/50 hover:text-brand-primary',
                )}
                aria-label={isHome ? 'Focus terminal' : 'Open AI chat'}
                aria-expanded={!isHome ? chatOpen : undefined}
              >
                <div className="flex items-center justify-center gap-2 px-1 whitespace-nowrap">
                  <Sparkles size={16} className={cn('transition-all shrink-0', !chatOpen && 'animate-pulse')} />
                  {!isMobile && isHovered && !chatOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: 0.05 }}
                      className="text-xs font-mono font-bold tracking-tight text-brand-primary"
                    >
                      Ask Justin
                    </motion.span>
                  )}
                </div>
              </motion.button>

              {/* Dynamic button: ↑ scroll-to-top with progress ring, or ⌂ home icon when at top */}
              <AnimatePresence mode="wait">
                {showScrollOrHome && (
                  <motion.button
                    key={isHomeIcon ? 'home' : 'scroll'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={isHomeIcon ? () => navigate('/') : scrollToTop}
                    className={cn(
                      'relative flex items-center justify-center w-10 h-10 rounded-full',
                      'text-white/60 hover:text-brand-primary transition-colors',
                    )}
                    aria-label={isHomeIcon ? 'Go home' : 'Back to top'}
                  >
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                      viewBox="0 0 52 52"
                    >
                      <circle cx="26" cy="26" r={radius} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/5" />
                      <circle
                        cx="26" cy="26" r={radius} fill="none" stroke="currentColor" strokeWidth="1.5"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round" className="text-brand-primary transition-all duration-300"
                      />
                    </svg>
                    {isHomeIcon ? (
                      <Home size={16} className="relative z-10" />
                    ) : (
                      <svg className="relative z-10 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

