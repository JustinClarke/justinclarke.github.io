#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Configuration
const WARN_ONLY = false; // Set to false to block (exit 1) on violations
const ALLOW_COMMENT = '// tw-allow-hex';

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
      // Skip lines with allow comment
      if (line.includes(ALLOW_COMMENT)) {
        return;
      }

      // Find all hex colors in this line
      const hexRegex = /#([0-9a-f]{6})/gi;
      let match;

      while ((match = hexRegex.exec(line)) !== null) {
        const hex = `#${match[1].toLowerCase()}`;
        if (tokens[hex]) {
          violations.push({
            file: path.relative(projectRoot, file),
            line: idx + 1,
            hex,
            token: tokens[hex],
            type: 'hex',
          });
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

  const hexViolations = scanSourceFiles(tokens);
  const violations = [...hexViolations];

  if (violations.length === 0) {
    console.log('✓ No tokenized hex violations found!');
    process.exit(0);
  }

  // Group by hex for readability
  const grouped = {};
  violations.forEach(v => {
    if (!grouped[v.hex]) grouped[v.hex] = [];
    grouped[v.hex].push(v);
  });

  console.log(`⚠️  Found ${violations.length} violation(s):\n`);

  for (const [hex, vios] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)) {
    const token = vios[0].token;
    console.log(`${hex} → ${token} (${vios.length} uses)`);
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
