/**
 * inject-metadata.js post-build metadata injection, driven by the
 * src/content/routes.ts manifest (imported directly — Node 24 strips the
 * TypeScript types natively).
 *
 * For every non-hidden route (aliases included) it stamps a copy of the built
 * index.html with that route's canonical title/description/og tags, so
 * scrapers that don't run JS see the same metadata visitors do. It also
 * injects the manifest's modulepreload/image-preload hints and generates
 * dist/sitemap.xml from the same manifest (there is deliberately NO committed
 * sitemap a stale copy can't exist).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTES } from '../src/content/routes.ts';
import { SITE } from '../src/content/site.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

/** Resolve an alias route to its target's metadata (title/desc/preloads). */
function metaSource(route) {
  if (!route.aliasOf) return route;
  const target = ROUTES.find(r => r.path === route.aliasOf);
  if (!target) throw new Error(`Route ${route.path} aliases unknown path ${route.aliasOf}`);
  return target;
}

function buildPreloads(route) {
  const assetsDir = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) return '';
  const files = fs.readdirSync(assetsDir);
  let preloads = '';

  for (const prefix of route.preloadChunks ?? []) {
    const chunk = files.find(f => f.startsWith(prefix) && f.endsWith('.js'));
    if (chunk) {
      preloads += `\n  <link rel="modulepreload" href="/assets/${chunk}">`;
    }
  }
  if (route.preloadImage) {
    const ext = path.extname(route.preloadImage).slice(1);
    preloads += `\n  <link rel="preload" href="${route.preloadImage}" as="image" fetchpriority="high" type="image/${ext}">`;
  }
  return preloads;
}

function injectMetadata() {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('Build not found. Run npm run build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML, 'utf8');

  const injectRoutes = ROUTES.filter(r => !r.hidden);

  injectRoutes.forEach(route => {
    const meta = metaSource(route);
    if (!meta.title || !meta.description) {
      throw new Error(`Route ${route.path} is missing title/description in the manifest`);
    }
    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>(.*?)<\/title>/, `<title>${meta.title}</title>`);

    // Replace Description
    html = html.replace(/<meta name="description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta name="description" content="${meta.description}" />`);

    // Replace OG Tags
    html = html.replace(/<meta property="og:title"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="og:description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:description" content="${meta.description}" />`);
    html = html.replace(/<meta property="og:url"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:url" content="${SITE.url}${route.path}" />`);

    // Replace Twitter Tags
    html = html.replace(/<meta property="twitter:title"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="twitter:description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:description" content="${meta.description}" />`);
    html = html.replace(/<meta property="twitter:url"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:url" content="${SITE.url}${route.path}" />`);

    // Inject the manifest's performance preloads (modulepreload chunks + poster image)
    const preloads = buildPreloads(meta);
    if (preloads) {
      html = html.replace('</head>', `${preloads}\n</head>`);
    }

    if (route.path === '/') {
      fs.writeFileSync(INDEX_HTML, html);
    } else {
      const routeDir = path.join(DIST_DIR, route.path);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), html);
    }

    console.log(`✓ Injected metadata for ${route.path}`);
  });
}

function generateSitemap() {
  const sitemapRoutes = ROUTES.filter(r => !r.hidden && !r.aliasOf);

  const urls = sitemapRoutes.map(route => {
    if (!route.sitemap) {
      throw new Error(`Route ${route.path} is missing sitemap data in the manifest`);
    }
    const loc = route.path === '/' ? `${SITE.url}/` : `${SITE.url}${route.path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${route.sitemap.lastmod}</lastmod>`,
      `    <priority>${route.sitemap.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
  console.log(`✓ Generated sitemap.xml (${sitemapRoutes.length} URLs)`);
}

injectMetadata();
generateSitemap();
