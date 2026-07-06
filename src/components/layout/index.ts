/**
 * layout/index.ts barrel for the always-on chrome around the app.
 *
 * CustomCursor and Preloader are intentionally left out (imported directly
 * where used) so the barrel stays focused on the common ones.
 */
export * from './CommandDock';
export * from './TheCloser';
export * from './SEO';
export * from './Schema';
export * from './GlobalSpotlight';

