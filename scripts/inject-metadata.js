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
    title: 'Justin Clarke - Analytics Engineer & Data Architect',
    description: 'Portfolio of Justin Clarke. Case studies in analytics engineering, data architecture, and high-fidelity data systems.'
  },
  {
    path: '/project/spotify-engine',
    title: 'Predictive Music Engine | Justin Clarke',
    description: 'Machine Learning research solving the cold-start problem through 3-dimensional hierarchical similarity.'
  },
  {
    path: '/project/sql-disaster',
    title: 'SQL Disaster Response | Justin Clarke',
    description: 'An 11-entity relational database modeling Philippine disaster relief logistics with composite keys and live dashboard.'
  },
  {
    path: '/project/litestore',
    title: 'LiteStore Store-as-a-Service | Justin Clarke',
    description: 'Production Next.js platform with 30+ statically prerendered routes and GA4 telemetry layer.'
  },
  {
    path: '/project/capital-budgeting',
    title: 'Capital Architecture | Justin Clarke',
    description: 'Engineering a ₱581M feasibility engine for maritime dredging operations and capital allocation.'
  },
  {
    path: '/project/hr-archetype',
    title: 'HR Archetype System | Justin Clarke',
    description: 'AI-driven HR analytics engine predicting employee attrition using Gemini and behavioral intelligence.'
  },
  {
    path: '/archive',
    title: 'Project Archive | Justin Clarke',
    description: 'A complete index of technical case studies, research artifacts, and engineering experiments.'
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
