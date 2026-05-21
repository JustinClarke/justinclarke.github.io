import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOTS_DIR = path.join(__dirname, '../_docs/screenshots');

const PAGES = [
  { name: '01_home', path: '/' },
  { name: '02_spotify-engine', path: '/project/spotify-engine' },
  { name: '03_sql-disaster', path: '/project/sql-disaster' },
  { name: '04_litestore', path: '/project/litestore' },
  { name: '05_capital-budgeting', path: '/project/capital-budgeting' },
  { name: '06_hr-archetype', path: '/project/hr-archetype' },
  { name: '07_the-long-version', path: '/the-long-version' },
  { name: '08_f1-telemetry', path: '/f1' },
  { name: '09_f1-source', path: '/off-the-pace' },
  { name: '10_connect', path: '/connect' },
  { name: '11_not-found', path: '/non-existent-page' }
];

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
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`Created directory: ${SCREENSHOTS_DIR}`);
  }

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
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2 // High-DPI / Retina quality
    });

    // Add init script to skip preloader globally in this context
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem('preloader_shown', 'true');
        window.__PRELOADER_COMPLETE__ = true;
      } catch (e) {
        console.error('Failed to set sessionStorage in init script', e);
      }
    });

    for (const pageInfo of PAGES) {
      const pageUrl = `${BASE_URL}${pageInfo.path}`;
      console.log(`Navigating to ${pageInfo.name} (${pageUrl})...`);
      
      const page = await context.newPage();
      
      try {
        await page.goto(pageUrl, { waitUntil: 'networkidle' });
        
        // Wait for any CSS/JS transitions & animations to settle
        console.log('Waiting 3 seconds for animations/charts to settle...');
        await page.waitForTimeout(3000);

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✓ Saved screenshot: ${screenshotPath}`);
      } catch (err) {
        console.error(`Error capturing ${pageInfo.name}:`, err);
      } finally {
        await page.close();
      }
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
      } catch (e) {
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
