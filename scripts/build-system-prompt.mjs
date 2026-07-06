/**
 * build-system-prompt.mjs generates worker/system-prompt.js from the two
 * sources of truth: _docs/_resume.yaml (facts: identity, education, skills,
 * experience, projects) and src/content/assistant.ts (persona: voice, rules,
 * canned answers, lore) plus site.ts identity.
 *
 * Run `npm run build:prompt` after editing either source, eyeball the
 * worker/system-prompt.js diff, then redeploy the worker (wrangler). The
 * worker does NOT deploy through npm build, so generation is manual-on-edit;
 * `--check` (run by `npm run lint`) fails instead of writing when the
 * committed file is stale, so a forgotten regeneration blocks CI.
 *
 * Selection rule: resume accomplishments with strength `signature` or `strong`
 * are included; `supporting` bullets are resume-tailoring filler and stay out
 * of the prompt.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';
import { SITE } from '../src/content/site.ts';
import { ASSISTANT } from '../src/content/assistant.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUME_PATH = path.join(__dirname, '../_docs/_resume.yaml');
const OUT_PATH = path.join(__dirname, '../worker/system-prompt.js');

const resume = parse(fs.readFileSync(RESUME_PATH, 'utf8'));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2024-04' → 'Apr 2024'; 2028 → '2028'; undefined → 'Present'. */
function fmtDate(value) {
  if (value === undefined || value === null) return 'Present';
  const str = String(value);
  const match = str.match(/^(\d{4})-(\d{2})$/);
  if (!match) return str;
  return `${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

/** Collapse a YAML folded scalar to one clean line. */
const oneLine = (text) => String(text).trim().replace(/\s+/g, ' ');

const keepBullet = (a) => a.strength === 'signature' || a.strength === 'strong';

function identitySection() {
  const c = resume.contact;
  return [
    'IDENTITY:',
    `  Name:         ${c.name}`,
    `  Role:         ${SITE.role}`,
    `  Location:     ${c.location}`,
    `  Work Auth:    ${c.work_authorization}`,
    `  Phone:        ${c.phone}`,
    `  Email:        ${c.email}`,
    `  LinkedIn:     ${c.linkedin}`,
    `  GitHub:       ${c.github}`,
    `  Portfolio:    ${c.portfolio}`,
  ].join('\n');
}

function educationSection() {
  const entries = resume.education.map((e) => {
    const dates = `${fmtDate(e.start)}–${fmtDate(e.end)}`;
    const status = e.status ? ` — ${e.status}` : '';
    const lines = [`  ${e.degree} — ${e.institution} — ${dates}${status}`];
    for (const h of e.highlights ?? []) lines.push(`    ${oneLine(h)}`);
    return lines.join('\n');
  });
  return ['EDUCATION:', ...entries].join('\n');
}

function certificationsSection() {
  const entries = resume.certifications.map((c) => `  ${c.name} — ${c.status}`);
  return ['CERTIFICATIONS:', ...entries].join('\n');
}

function skillsSection() {
  const width = Math.max(...resume.skills.groups.map((g) => g.label.length)) + 1;
  const entries = resume.skills.groups.map(
    (g) => `  ${`${g.label}:`.padEnd(width + 1)} ${g.items.join(', ')}`,
  );
  const extras = ASSISTANT.extraSkillLines.map((l) => `  ${l}`);
  return ['SKILLS:', ...entries, ...extras].join('\n');
}

function experienceSection() {
  const entries = resume.experience.map((e) => {
    const lines = [
      `  ${e.title} — ${e.company}, ${e.location} (${fmtDate(e.start)} – ${fmtDate(e.end)})`,
    ];
    if (e.context) lines.push(`  ${oneLine(e.context)}`);
    for (const a of e.accomplishments.filter(keepBullet)) {
      lines.push(`  - ${oneLine(a.text)}`);
    }
    return lines.join('\n');
  });
  return ['EXPERIENCE:', '', entries.join('\n\n')].join('\n');
}

function projectsSection() {
  const entries = resume.projects.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const links = p.links
      ? Object.entries(p.links).map(([k, v]) => `${k} ${oneLine(v)}`).join(' · ')
      : '';
    const lines = [`  [${num}] ${p.name} — ${p.status}${links ? ` — ${links}` : ''}`];
    lines.push(`  ${oneLine(p.tagline)}`);
    if (p.stack) lines.push(`  Stack: ${p.stack.join(', ')}`);
    if (p.canonical_stats) {
      const stats = Object.entries(p.canonical_stats)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${oneLine(v)}`)
        .join('; ');
      lines.push(`  Canonical stats (authoritative): ${stats}`);
    }
    for (const a of p.accomplishments.filter(keepBullet)) {
      lines.push(`  - ${oneLine(a.text)}`);
    }
    return lines.join('\n');
  });
  const extras = ASSISTANT.extraProjectLines.map((l) => `  - ${l}`);
  return [
    'PROJECTS:',
    '',
    entries.join('\n\n'),
    '',
    '  Also on the portfolio (not in the resume master):',
    ...extras,
  ].join('\n');
}

function instructionsSection() {
  const rules = ASSISTANT.instructions.map((r) => `  - ${r}`);
  const canned = ASSISTANT.cannedAnswers.map(
    (c) => `  - For "${c.trigger}": "${c.answer}"`,
  );
  return ['INSTRUCTIONS:', ...rules, ...canned].join('\n');
}

const prompt = [
  `You are ${SITE.name}'s portfolio assistant, embedded inside an interactive`,
  `terminal at ${SITE.domain}.`,
  '',
  identitySection(),
  '',
  educationSection(),
  '',
  certificationsSection(),
  '',
  skillsSection(),
  '',
  experienceSection(),
  '',
  projectsSection(),
  '',
  `STUDIO (UI/UX & VISUAL DESIGN) — browse at ${SITE.domain}/studio:`,
  ASSISTANT.studio,
  '',
  'PERSONAL BACKGROUND & THE LONG VERSION:',
  ASSISTANT.personalBackground,
  '',
  'PERSONALITY / VOICE:',
  ASSISTANT.personality.split('\n').map((l) => `  ${l}`).join('\n'),
  '',
  instructionsSection(),
].join('\n');

// Escape for emission inside a JS template literal.
const escaped = prompt.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const out = `// GENERATED by scripts/build-system-prompt.mjs — edit _docs/_resume.yaml or
// src/content/assistant.ts instead, then run \`npm run build:prompt\`.
export const SYSTEM_PROMPT = \`${escaped}\`;
`;

if (process.argv.includes('--check')) {
  const committed = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : '';
  if (committed !== out) {
    console.error(
      '❌ worker/system-prompt.js is stale — its sources (_docs/_resume.yaml, ' +
        'src/content/assistant.ts, src/content/site.ts) have changed.\n' +
        '   Fix: `npm run build:prompt`, review the diff, then redeploy the worker.',
    );
    process.exit(1);
  }
  console.log('✓ worker/system-prompt.js is in sync with _resume.yaml + content/assistant.ts');
} else {
  fs.writeFileSync(OUT_PATH, out);
  console.log(`✓ Wrote worker/system-prompt.js (${prompt.length} chars) from _resume.yaml + content/assistant.ts`);
}
