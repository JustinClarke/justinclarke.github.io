#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Configuration
const WARN_ONLY = false; // Set to false to block (exit 1) on violations
// Escape hatches: put the marker anywhere on the offending line — `// tw-allow-hex`
// in TS, `{/* tw-allow-hex */}` in JSX. Each must be justified in code review.
const ALLOW_HEX = 'tw-allow-hex'; // raw hex that duplicates a @theme token
const ALLOW_MICRO = 'tw-allow-micro'; // sub-10px text (decorative glyphs only)
const ALLOW_CONTRAST = 'tw-allow-contrast'; // sub-45 white/fg text (decorative only)

// Type floor: no arbitrary font size below this many px (use text-micro instead).
const MIN_TEXT_PX = 10;
// Contrast floor: text-white/N or text-fg/N below this alpha fails WCAG AA on
// the #050505 surface. Content belongs on the text-*/fg ramps; genuinely
// decorative uses take a ramp token (ghost/dim/muted) or the escape hatch.
const MIN_TEXT_ALPHA = 45;

// Parse @theme block from src/index.css
function parseThemeTokens() {
  const cssPath = path.join(projectRoot, 'src', 'index.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const themeMatch = css.match(/@theme\s*{([\s\S]*?)}/);
  if (!themeMatch) {
    console.error('❌ Could not find @theme block in src/index.css');
    process.exit(1);
  }

  const themeBlock = themeMatch[1];
  const tokens = {};

  // Match --color-* tokens: --color-f1-red: #e10600
  const colorRegex = /--color-([\w-]+):\s*#([0-9a-f]{6})/gi;
  let match;
  while ((match = colorRegex.exec(themeBlock)) !== null) {
    const tokenName = match[1];
    const hex = match[2].toLowerCase();
    tokens[`#${hex}`] = `color-${tokenName}`;
  }

  // Also match semantic adaptive tokens: --surface-*, --text-*, --border-*
  const semanticRegex = /--(surface|text|border)-([\w-]+):\s*#([0-9a-f]{6})/gi;
  while ((match = semanticRegex.exec(themeBlock)) !== null) {
    const prefix = match[1];
    const tokenName = match[2];
    const hex = match[3].toLowerCase();
    // Only register if not already mapped (color-* tokens take precedence)
    if (!tokens[`#${hex}`]) {
      tokens[`#${hex}`] = `${prefix}-${tokenName}`;
    }
  }

  return tokens;
}

// Recursively walk directory
function walkDir(dir, ext, excludePaths) {
  const results = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      // Skip node_modules, dist, etc.
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.next') {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (ext.some(e => entry.name.endsWith(e))) {
        const resolved = path.resolve(fullPath);
        // Skip excluded paths
        if (!excludePaths.some(ep => path.resolve(ep) === resolved)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return results;
}

// Scan src/**/*.{ts,tsx} for tokenized hex
function scanSourceFiles(tokens) {
  const srcPath = path.join(projectRoot, 'src');
  const excludePaths = [
    path.join(projectRoot, 'src', 'index.css'),
    path.join(projectRoot, 'src', 'config', 'constants.ts'),
  ];

  const files = walkDir(srcPath, ['.tsx', '.ts'], excludePaths);
  const violations = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const loc = { file: path.relative(projectRoot, file), line: idx + 1 };

      // 1. Tokenized hex reused as a raw literal
      if (!line.includes(ALLOW_HEX)) {
        const hexRegex = /#([0-9a-f]{6})/gi;
        let match;
        while ((match = hexRegex.exec(line)) !== null) {
          const hex = `#${match[1].toLowerCase()}`;
          if (tokens[hex]) {
            violations.push({ ...loc, offender: hex, fix: tokens[hex], type: 'hex' });
          }
        }
      }

      // 2. Type floor: arbitrary font sizes below 10px (any variant prefix —
      //    md:text-[8px], after:text-[9px] — the size literal is what matters)
      if (!line.includes(ALLOW_MICRO)) {
        const pxRegex = /text-\[(\d+(?:\.\d+)?)px\]/g;
        let match;
        while ((match = pxRegex.exec(line)) !== null) {
          if (parseFloat(match[1]) < MIN_TEXT_PX) {
            violations.push({
              ...loc,
              offender: match[0],
              fix: 'text-micro (10px floor)',
              type: 'micro',
            });
          }
        }
      }

      // 3. Contrast floor: white/fg text below 45% alpha fails AA on #050505.
      //    Covers variant-prefixed forms (hover:, placeholder:, md:) too.
      if (!line.includes(ALLOW_CONTRAST)) {
        const alphaRegex = /text-(?:white|fg)\/(\d+)\b/g;
        let match;
        while ((match = alphaRegex.exec(line)) !== null) {
          if (parseInt(match[1], 10) < MIN_TEXT_ALPHA) {
            violations.push({
              ...loc,
              offender: match[0],
              fix: 'text-text-tertiary/-ghost or fg-mid/-faint',
              type: 'contrast',
            });
          }
        }
      }
    });
  }

  return violations;
}


// Main
function main() {
  const tokens = parseThemeTokens();
  console.log(`✓ Parsed ${Object.keys(tokens).length} color tokens from @theme\n`);

  const violations = scanSourceFiles(tokens);

  if (violations.length === 0) {
    console.log('✓ No violations: tokenized hex ✓, type floor (≥10px) ✓, contrast floor (≥45) ✓');
    process.exit(0);
  }

  // Group by offender for readability
  const grouped = {};
  violations.forEach(v => {
    if (!grouped[v.offender]) grouped[v.offender] = [];
    grouped[v.offender].push(v);
  });

  console.log(`⚠️  Found ${violations.length} violation(s):\n`);

  for (const [offender, vios] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`${offender} → ${vios[0].fix} (${vios.length} uses)`);
    vios.slice(0, 10).forEach(v => {
      console.log(`   ${v.file}:${v.line}`);
    });
    if (vios.length > 10) {
      console.log(`   ... and ${vios.length - 10} more`);
    }
    console.log();
  }

  if (!WARN_ONLY) {
    console.log(`❌ Gate is blocking. Fix violations and retry.\n`);
    process.exit(1);
  } else {
    console.log(`ℹ️  Gate is in warn mode. To enforce, set WARN_ONLY = false.\n`);
    process.exit(0);
  }
}

main();
