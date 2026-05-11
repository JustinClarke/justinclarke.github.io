import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, NotFound, ArchivePage } from '@/pages';
import { SpotifyEnginePage, SqlDisasterPage, LiteStorePage, CapitalBudgetingPage, HRArchetypePage } from '@/pages/projects';
import { CustomCursor, Preloader, BackToTop } from '@/components/layout';
import { ContactModal } from '@/modals';
import { initTooltips, initScrollAnimations } from '@/utils';

/**
 * Main application layout and routing.
 * Root providers (Modal, ErrorBoundary) are handled in RootProviders via main.tsx.
 */
export default function App() {
  useEffect(() => {
    // Disable browser's native scroll restoration to prevent conflicts with Framer Motion
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePreloaderComplete = () => {
      initTooltips();
      initScrollAnimations();
    };

    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    const timeout = setTimeout(handlePreloaderComplete, 3500);

    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      clearTimeout(timeout);
    };
  }, []);

  const location = useLocation();
  const navType = useNavigationType();

  // Clean Slate Scroll Reset:
  // Reset to top on EVERY page change, but delay it so it happens in the dark.
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000); // Perfectly synced with the 1s exit duration
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="bg-brand-bg min-h-screen text-white selection:bg-white/20">
      <Preloader />
      <CustomCursor />
      <ContactModal />
      <BackToTop />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ 
            duration: 1.0, 
            delay: 0.1, // Wait for the scroll reset to finish in the dark
            ease: [0.43, 0.13, 0.23, 0.96] 
          }}
          className="min-h-screen flex flex-col"
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/project/spotify-engine" element={<SpotifyEnginePage />} />
            <Route path="/project/sql-disaster" element={<SqlDisasterPage />} />
            <Route path="/project/litestore" element={<LiteStorePage />} />
            <Route path="/project/capital-budgeting" element={<CapitalBudgetingPage />} />
            <Route path="/project/hr-archetype" element={<HRArchetypePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
