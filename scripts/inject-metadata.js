import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

const ROUTES = [
  {
    path: '/',
    title: 'Justin Clarke ⋅ Home',
    description: 'Portfolio of Justin Clarke. Case studies in data & analytics development, data architecture, and high-fidelity data systems.'
  },
  {
    path: '/project/spotify-engine',
    title: 'Spotify: Predictive Engine',
    description: 'Machine Learning research solving the cold-start problem through 3-dimensional hierarchical similarity.'
  },
  {
    path: '/project/sql-disaster',
    title: 'SQL Disaster Response System',
    description: 'An 11-entity relational database modeling Philippine disaster relief logistics with composite keys and live dashboard.'
  },
  {
    path: '/project/litestore',
    title: 'LiteStore: Retail-as-a-Service',
    description: 'Production Next.js platform with 30+ statically prerendered routes and GA4 telemetry layer.'
  },
  {
    path: '/project/capital-budgeting',
    title: 'Capital Architecture Model',
    description: 'Engineering a ₱581M feasibility engine for maritime dredging operations and capital allocation.'
  },
  {
    path: '/project/hr-archetype',
    title: 'HR Archetype System',
    description: 'AI-driven HR analytics engine predicting employee attrition using Gemini and behavioural intelligence.'
  },
  {
    path: '/the-long-version',
    title: 'Justin Clarke ⋅ the long version',
    description: 'A collection of non-technical interests, creative writing, and experimental components.'
  },
  {
    path: '/f1',
    title: 'Overview',
    description: 'A causal ML engine isolating the true forces behind Formula 1 lap times: fuel mass, tyre degradation, dirty air, and driver skill down to the millisecond.'
  },
  {
    path: '/off-the-pace',
    title: 'Architecture & Engineering',
    description: 'The engineering behind the F1 Causal Pace Engine: 46 dbt models, 340 CI tests, XGBoost tyre cliff prediction, and a Frisch-Waugh ghost car simulator.'
  },
  {
    path: '/connect',
    title: 'Justin Clarke ⋅ Connect',
    description: 'Get in touch or save contact details for Justin Clarke, Analytics Engineer based in Dubai.'
  },
  {
    path: '/contact',
    title: 'Justin Clarke ⋅ Connect',
    description: 'Get in touch or save contact details for Justin Clarke, Analytics Engineer based in Dubai.'
  }
];

function injectMetadata() {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('Build not found. Run npm run build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML, 'utf8');

  ROUTES.forEach(route => {
    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>(.*?)<\/title>/, `<title>${route.title}</title>`);

    // Replace Description
    html = html.replace(/<meta name="description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta name="description" content="${route.description}" />`);

    // Replace OG Tags
    html = html.replace(/<meta property="og:title"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:title" content="${route.title}" />`);
    html = html.replace(/<meta property="og:description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:description" content="${route.description}" />`);
    html = html.replace(/<meta property="og:url"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="og:url" content="https://justinclarke.github.io${route.path}" />`);

    // Replace Twitter Tags
    html = html.replace(/<meta property="twitter:title"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:title" content="${route.title}" />`);
    html = html.replace(/<meta property="twitter:description"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:description" content="${route.description}" />`);
    html = html.replace(/<meta property="twitter:url"([\s\S]*?)content="(.*?)"([\s\S]*?)\/?>/, `<meta property="twitter:url" content="https://justinclarke.github.io${route.path}" />`);

    // Inject Performance Preloads for F1 routes
    if (route.path === '/f1' || route.path === '/off-the-pace') {
      const assetsDir = path.join(DIST_DIR, 'assets');
      let preloads = '';

      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);

        if (route.path === '/f1') {
          // Find F1 Overview lazy chunks
          const f1OverviewChunk = files.find(f => f.startsWith('OffThePaceOverview-') && f.endsWith('.js'));
          const overviewViewChunk = files.find(f => f.startsWith('OverviewView-') && f.endsWith('.js'));
          const featuredProjectsChunk = files.find(f => f.startsWith('FeaturedProjects-') && f.endsWith('.js'));

          if (f1OverviewChunk) {
            preloads += `\n  <link rel="modulepreload" href="/assets/${f1OverviewChunk}">`;
          }
          if (overviewViewChunk) {
            preloads += `\n  <link rel="modulepreload" href="/assets/${overviewViewChunk}">`;
          }
          if (featuredProjectsChunk) {
            preloads += `\n  <link rel="modulepreload" href="/assets/${featuredProjectsChunk}">`;
          }
          // Preload high-priority AVIF poster image
          preloads += `\n  <link rel="preload" href="/assets/audif1.avif" as="image" fetchpriority="high" type="image/avif">`;

        } else if (route.path === '/off-the-pace') {
          // Find F1 Source engineering lazy chunks
          const f1SourceChunk = files.find(f => f.startsWith('OffThePaceSource-') && f.endsWith('.js'));
          const sourceViewChunk = files.find(f => f.startsWith('SourceView-') && f.endsWith('.js'));

          if (f1SourceChunk) {
            preloads += `\n  <link rel="modulepreload" href="/assets/${f1SourceChunk}">`;
          }
          if (sourceViewChunk) {
            preloads += `\n  <link rel="modulepreload" href="/assets/${sourceViewChunk}">`;
          }
          // Preload high-priority AVIF poster image
          preloads += `\n  <link rel="preload" href="/assets/audif1.avif" as="image" fetchpriority="high" type="image/avif">`;
        }
      }

      if (preloads) {
        html = html.replace('</head>', `${preloads}\n</head>`);
      }
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

injectMetadata();
