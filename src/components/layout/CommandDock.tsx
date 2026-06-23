import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { smoothScrollTo } from '@/utils/scroll';
import { AIChatDrawer } from './AIChatDrawer';

export function CommandDock() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === '/';
  const isConnect = pathname === '/connect' || pathname === '/contact';
  const isBanner = pathname === '/linkedin-banner';

  useEffect(() => {
    const onScroll = () => {
      const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(maxScroll > 0 ? (scrollPx / maxScroll) * 100 : 0);
      setIsAtTop(scrollPx < 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

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

