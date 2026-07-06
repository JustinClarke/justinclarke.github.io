// Barrel for the content layer: everything a fork edits (identity, routes,
// page copy, career records, project cards, terminal copy, AI persona).
// Node build scripts bypass this barrel and import the leaf files directly
// (site.ts / routes.ts / assistant.ts) keep those files import-clean.
export { SITE, type SiteConfig } from './site';
export { ROUTES, routeMeta, type RouteDef, type RoutePath } from './routes';
export { heroMetadata, closerMetadata } from './home';
export { experiences, education, ENTRIES, type Entry } from './career';
export { projectsData } from './projects';
export { WHOAMI_LINES, CONNECT_LINES, BOOT_LOGS } from './terminal';
export { ASSISTANT } from './assistant';
