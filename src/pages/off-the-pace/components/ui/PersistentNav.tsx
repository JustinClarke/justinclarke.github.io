/**
 * PersistentNav the small floating "Overview / Architecture" pill fixed to the
 * top of both Off The Pace pages, letting you hop between the two views.
 *
 * Fits in: rendered near the top of OffThePaceOverview and OffThePaceSource.
 * Note:    Clicking the tab you are already on scrolls to the top instead of
 *          navigating; clicking the other tab routes to that page.
 *
 * For beginners ----------------------------------------------------------------
 * useLocation/useNavigate come from React Router: the first tells us the
 * current URL (so we know which tab is active), the second changes pages
 * without a full browser reload. Like the preloader, the nav is portalled into
 * document.body so its fixed position is measured against the whole window.
 * -----------------------------------------------------------------------------
 */
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { smoothScrollTo } from '@/utils';

export function PersistentNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // LEARN: derived value, not state - we recompute "are we on the overview
  //    page?" from the URL on every render, so it can never fall out of sync.
  const isOverview = pathname === '/f1';

  const navigateWithTransition = (to: string) => {
    navigate(to);
  };

  return createPortal(
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      aria-label="Off The Pace navigation"
    >
      <div
        className="absolute inset-x-0 top-0 pointer-events-none -z-10 h-[120px] transition-opacity duration-400"
        style={{
          background: 'radial-gradient(50% 100% at 50% 0%, rgba(22,24,29,0.8) 0%, rgba(22,24,29,0.45) 45%, rgba(22,24,29,0) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)',
        }}
      />

      <div className="h-[52px] mt-4 md:mt-6 flex items-center justify-center">
        {/* Consistent dark glass pill */}
        <div
          className="flex items-center font-jetbrains text-[10px] uppercase tracking-[0.14em] transition-all duration-300"
          style={{
            background: 'rgba(12,13,17,0.62)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '999px',
            padding: '3px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
          }}
        >
          <button
            onClick={() => {
              if (isOverview) {
                smoothScrollTo(0, 2.2);
              } else {
                navigateWithTransition('/f1');
              }
            }}
            aria-current={isOverview ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ${isOverview ? 'font-bold text-white' : 'text-white/40 hover:text-white/70'}`}
            style={isOverview ? {
              background: 'rgba(255,255,255,0.1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset',
            } : {}}
          >
            Overview
          </button>
          <button
            onClick={() => {
              if (!isOverview) {
                smoothScrollTo(0, 2.2);
              } else {
                navigateWithTransition('/off-the-pace');
              }
            }}
            aria-current={!isOverview ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ${!isOverview ? 'font-bold text-white' : 'text-white/40 hover:text-white/70'}`}
            style={!isOverview ? {
              background: 'rgba(255,255,255,0.1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset',
            } : {}}
          >
            Architecture
          </button>
        </div>
      </div>
    </nav>,
    document.body
  );
}
