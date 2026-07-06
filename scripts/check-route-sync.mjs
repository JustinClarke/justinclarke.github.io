#!/usr/bin/env node

// check-route-sync.mjs — keeps the docs honest against the route manifest.
//
// src/content/routes.ts is THE list of pages (App.tsx, inject-metadata,
// sitemap, and screenshots all derive from it). The one consumer that CAN'T
// derive from it mechanically is prose: the route table in
// _docs/architecture.md. This gate fails when that table and the manifest
// disagree, so a route added or deleted without a docs update blocks CI
// instead of drifting silently (the pre-manifest failure mode this repo's
// audit caught three times).
//
// Runs as part of `npm run lint`.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Node 24 native TS type stripping — same direct-import pattern as
// inject-metadata.js. routes.ts must stay erasable-syntax-only.
import { ROUTES } from '../src/content/routes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOC_PATH = path.join(__dirname, '..', '_docs', 'architecture.md');

const doc = fs.readFileSync(DOC_PATH, 'utf-8');

// Slice out the "## Route table" section (up to the next ## heading).
const sectionMatch = doc.match(/^## Route table\n([\s\S]*?)(?=^## |^### )/m);
if (!sectionMatch) {
  console.error('❌ check-route-sync: no "## Route table" section found in _docs/architecture.md');
  process.exit(1);
}

// One table row per route: | `/path` | ... |. The `*` catch-all row is
// App.tsx's own and is not a manifest entry.
const docPaths = [...sectionMatch[1].matchAll(/^\|\s*`([^`]+)`/gm)]
  .map(m => m[1])
  .filter(p => p !== '*');

const manifestPaths = ROUTES.map(r => r.path);

const missingFromDocs = manifestPaths.filter(p => !docPaths.includes(p));
const staleInDocs = docPaths.filter(p => !manifestPaths.includes(p));

if (missingFromDocs.length || staleInDocs.length) {
  console.error('❌ _docs/architecture.md route table is out of sync with src/content/routes.ts\n');
  for (const p of missingFromDocs) {
    console.error(`   missing from docs table: ${p}`);
  }
  for (const p of staleInDocs) {
    console.error(`   in docs table but not in the manifest: ${p}`);
  }
  console.error('\n   Fix: update the "## Route table" section in _docs/architecture.md (one row per manifest entry).');
  process.exit(1);
}

console.log(`✓ Route table in _docs/architecture.md matches the manifest (${manifestPaths.length} routes)`);
