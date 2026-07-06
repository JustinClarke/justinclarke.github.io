import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { ROUTES } from '../src/content/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOTS_ROOT = path.join(__dirname, '../_docs/screenshots');

const LEGACY_NAMES = {
  '/': '01_home',
  '/project/spotify-engine': '02_spotify-engine',
  '/project/sql-disaster': '03_sql-disaster',
  '/project/litestore': '04_litestore',
  '/project/capital-budgeting': '05_capital-budgeting',
  '/project/hr-archetype': '06_hr-archetype',
  '/the-long-version': '07_the-long-version',
  '/f1': '08_f1-telemetry',
  '/off-the-pace': '09_f1-source',
  '/connect': '10_connect',
  '/studio': '12_studio',
  '/studio/crescendo': '13_crescendo',
  '/studio/stroktalk': '14_stroktalk'
};

const slugFor = (routePath) =>
  LEGACY_NAMES[routePath] ?? routePath.replace(/^\//, '').replace(/\//g, '-');

const ALL_PAGES = [
  ...ROUTES.filter(r => !r.hidden && !r.aliasOf).map(r => ({ name: slugFor(r.path), path: r.path })),
  // Deliberately unroutable: exercises the 404 page.
  { name: '11_not-found', path: '/non-existent-page' }
];

// Viewport matrix: pass --matrix to shoot all three breakpoints in one run,
// or --width=NNN to pin a single custom width. Defaults to the 1440 desktop shot.
const VIEWPORTS = {
  390: { width: 390, height: 844 },   // mobile
  768: { width: 768, height: 1024 },  // tablet
  1440: { width: 1440, height: 900 }  // desktop
};

const args = process.argv.slice(2);
const matrixMode = args.includes('--matrix');
const widthArg = args.find(a => a.startsWith('--width='));
const filterArg = args.find(a => !a.startsWith('--'));

const PAGES = filterArg
  ? ALL_PAGES.filter(p => p.name.includes(filterArg) || p.path.includes(filterArg))
  : ALL_PAGES;

if (PAGES.length === 0) {
  console.error(`No pages match filter: ${filterArg}`);
  process.exit(1);
}

const widths = matrixMode
  ? Object.keys(VIEWPORTS).map(Number)
  : widthArg
    ? [Number(widthArg.split('=')[1])]
    : [1440];


// ScrollReveal (src/ui/ScrollReveal.tsx) fades sections in via framer-motion's
// `whileInView`, which only fires once a section crosses the browser's real
// viewport during a scroll. Playwright's `fullPage` screenshot captures
// beyond the viewport without moving it, so below-the-fold ScrollReveal
// content stays at its pre-reveal opacity:0 unless we scroll through the
// page first. Capped step count keeps this bounded even on the longest page.
async function scrollThroughPage(page, viewportHeight) {
  const step = Math.max(200, Math.floor(viewportHeight * 0.8));
  const maxSteps = 60;
  for (let i = 0; i < maxSteps; i++) {
    const { atBottom } = await page.evaluate((y) => {
      window.scrollBy(0, y);
      return { atBottom: window.scrollY + window.innerHeight >= document.body.scrollHeight - 2 };
    }, step);
    await page.waitForTimeout(150);
    if (atBottom) break;
  }
  // Let the final in-view transitions finish, then reset for a top-down shot.
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
}

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Timeout waiting for server at ' + url));
        return;
      }
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          clearInterval(interval);
          resolve();
        }
      }).on('error', () => {
        // Ignore error and retry
      });
    }, 500);
  });
}

async function run() {
  console.log('Starting Vite dev server...');
  const serverProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'ignore',
    shell: true,
    detached: true // Start in its own process group to clean up properly
  });

  try {
    console.log(`Waiting for server to be responsive at ${BASE_URL}...`);
    await waitForServer(BASE_URL);
    console.log('Server is ready! Launching Playwright browser...');

    const browser = await chromium.launch({ headless: true });

    for (const width of widths) {
      const viewport = VIEWPORTS[width] || { width, height: 900 };
      const dir = matrixMode || widthArg
        ? path.join(SCREENSHOTS_ROOT, String(width))
        : SCREENSHOTS_ROOT;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }

      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 2 // High-DPI / Retina quality
      });

      // Add init script to skip preloader globally in this context
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem('preloader_shown', 'true');
        } catch (e) {
          console.error('Failed to set sessionStorage in init script', e);
        }
      });

      for (const pageInfo of PAGES) {
        const pageUrl = `${BASE_URL}${pageInfo.path}`;
        console.log(`[${width}px] Navigating to ${pageInfo.name} (${pageUrl})...`);

        const page = await context.newPage();

        try {
          await page.goto(pageUrl, { waitUntil: 'networkidle' });

          // Scroll through so ScrollReveal's whileInView sections fire before capture.
          await scrollThroughPage(page, viewport.height);

          // Wait for any CSS/JS transitions & animations to settle
          await page.waitForTimeout(3000);

          const screenshotPath = path.join(dir, `${pageInfo.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`✓ Saved screenshot: ${screenshotPath}`);
        } catch (err) {
          console.error(`Error capturing ${pageInfo.name}:`, err);
        } finally {
          await page.close();
        }
      }

      await context.close();
    }

    console.log('Closing browser...');
    await browser.close();
  } catch (error) {
    console.error('An error occurred during execution:', error);
  } finally {
    console.log('Stopping Vite dev server...');
    if (serverProcess.pid) {
      try {
        // Kill the process tree (since we ran spawn with detached: true, we kill the process group)
        process.kill(-serverProcess.pid, 'SIGINT');
      } catch {
        // If detached group kill fails, try direct kill
        try {
          serverProcess.kill('SIGINT');
        } catch (e2) {
          console.error('Failed to terminate server process:', e2);
        }
      }
    }
    console.log('Done!');
    process.exit(0);
  }
}

run();
