import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, ProjectDetails, NotFound } from '@/pages';
import { CustomCursor, Preloader } from '@/components/ui-global';
import { ContactModal } from '@/modals';
import { initTooltips } from '@/shared/utils/tooltips';

/**
 * Main application layout and routing.
 * Root providers (Modal, ErrorBoundary) are handled in RootProviders via main.tsx.
 */
export default function App() {
  useEffect(() => {
    initTooltips();
  }, []);

  return (
    <div className="bg-brand-bg min-h-screen text-white selection:bg-white/20">
      <Preloader />
      <CustomCursor />
      <ContactModal />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
