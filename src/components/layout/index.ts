/**
 * layout/index.ts barrel for the always-on chrome around the app.
 *
 * For beginners ----------------------------------------------------------------
 * Re-exports these so callers can `import { SEO, BackToTop } from
 * '@/components/layout'`. CustomCursor and Preloader are intentionally left out
 * (imported directly where used) so the barrel stays focused on the common ones.
 * -----------------------------------------------------------------------------
 */
export * from './BackToTop';
export * from './TheCloser';
export * from './SEO';
export * from './Schema';
