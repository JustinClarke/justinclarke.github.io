/**
 * engine.ts the "brain" of the hero terminal: every command, its output, and
 * the logic that turns what you type into a result.
 *
 * Fits in: used by useTerminalSession (src/hooks/useTerminalSession.ts), which
 *          feeds keystrokes in and renders the lines that come back. This file
 *          is pure data + functions no React, no DOM which is exactly why it
 *          can be unit-tested on its own (see engine.test.ts).
 * Note:    one list, COMMAND_MANIFEST, is the single source of truth. Autocomplete,
 *          `help`, `man`, and command resolution all read from it, so adding a
 *          command in one place wires it into everything. Behaviour here is under
 *          test change wording freely, but keep the shapes and ids identical.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// The line grammar (TerminalLineType/TerminalLine) lives in @/types/terminal so
// content/terminal.ts can build line blocks without importing the engine.
// Re-exported here so the engine's consumers (hooks, UI, tests) keep importing
// from one place.
import type { TerminalLine, TerminalLineType } from '@/types/terminal';
import { SITE } from '@/content';
import {
  WHOAMI_LINES, CONNECT_LINES, ABOUT_LINES, LS_PROJECTS_LINES, EXPERTISE_LINES,
  TIMELINE_LINES, OFF_THE_PACE_LINES, ASK_USAGE_LINES, ADVANCED_LINES, PLAY_LINES,
  LONG_VERSION_LINES, EGG_LINES, SUDO_ESCALATION, FUNNY_ERRORS,
  SIDEBAR_FUN_MESSAGES, SIDEBAR_FUN_DEFAULT, CONVERSATIONAL_PREAMBLES, PREAMBLE_DEFAULT,
} from '@/content/terminal';

export type { TerminalLine, TerminalLineType } from '@/types/terminal';

export type SideEffectType = 'scroll' | 'snake' | 'pong' | 'tetris' | 'space_invaders' | 'theme' | 'download' | 'contact' | 'the-long-version' | 'github' | 'ai';

export interface CommandEffect {
  type: SideEffectType;
  payload?: string;
  aiQuery?: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  effect?: CommandEffect;
  showPills?: boolean;
  exitCode?: number;
}

export interface CommandContext {
  cmdHistory?: string[];
  sessionStartMs?: number;
  githubActivity?: GitHubEvent[] | 'loading' | 'error' | 'rate-limited';
  sudoCount?: number;
  isDarkMode?: boolean;
}

export interface GitHubEvent {
  type: string;
  repo: string;
  createdAt: string;
  branch?: string;
  commitMessages?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Command manifest
// ─────────────────────────────────────────────────────────────────────────────

// One entry per command: `run` is a function, not static copy, which is what
// lets a single loop dispatch every command instead of a switch statement.
export interface CommandSpec {
  id: string;
  aliases: string[];
  summary: string;
  category: 'core' | 'system' | 'egg';
  hidden?: boolean;
  run: (ctx: CommandContext) => CommandResult;
}

// helpers
const line = (t: TerminalLineType, text: string): TerminalLine => ({ t, text });
const parts = (t: TerminalLineType, text: string, ...rest: NonNullable<TerminalLine['parts']>): TerminalLine =>
  ({ t: 'm' as TerminalLineType, text: '', parts: [{ t, text }, ...rest] });
const sp = (): TerminalLine => line('m', ' ');

// Zero out time-of-day on both dates so partial days don't skew the result.
function daysUntil(isoDate: string): number {
  const target = new Date(isoDate);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

function fmtUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

export const COMMAND_MANIFEST: CommandSpec[] = [
  // ── whoami ─────────────────────────────────────────────────────────────────
  {
    id: 'whoami',
    aliases: ['me', 'who'],
    summary: `Identity brief one-screen snapshot of who ${SITE.firstName} is.`,
    category: 'core',
    // Static copy lives in content/terminal.ts (the 6a exemplar: line blocks
    // there, logic here).
    run: () => ({ lines: WHOAMI_LINES }),
  },

  // ── about me ───────────────────────────────────────────────────────────────
  {
    id: 'about me',
    aliases: ['about', 'learn more', 'learnmore', 'identity', 'bio', 'profile', 'introducing', 'discover', 'developer', 'profile.read()', 'profile.read'],
    summary: 'Full background, education, current work, and availability.',
    category: 'core',
    // Static copy lives in content/terminal.ts (the 6a exemplar: line blocks
    // there, logic here).
    run: () => ({ lines: ABOUT_LINES }),
  },

  // ── ls projects ────────────────────────────────────────────────────────────
  {
    id: 'ls projects',
    aliases: ['projects', 'work', 'cases', 'portfolio', 'showcase', 'apps', 'products', 'code', 'repos', 'list', 'studio'],
    summary: 'Featured case studies 6 production projects.',
    category: 'core',
    run: () => ({
      lines: LS_PROJECTS_LINES,
      effect: { type: 'scroll', payload: 'projects' },
    }),
  },

  // ── expertise ──────────────────────────────────────────────────────────────
  {
    id: 'expertise',
    aliases: ['skills', 'stack', 'toolkit', 'technologies', 'languages', 'tech', 'tools'],
    summary: 'Analytics + full-stack skill matrix.',
    category: 'core',
    run: () => ({
      lines: EXPERTISE_LINES,
      effect: { type: 'scroll', payload: 'expertise' },
    }),
  },

  // ── timeline ───────────────────────────────────────────────────────────────
  {
    id: 'timeline',
    aliases: ['record', 'experience', 'education', 'career', 'background', 'path', 'jobs', 'journey', 'academics'],
    summary: 'Full career and academic timeline.',
    category: 'core',
    run: () => ({
      lines: TIMELINE_LINES,
      effect: { type: 'scroll', payload: 'experience' },
    }),
  },

  // ── help ───────────────────────────────────────────────────────────────────
  {
    id: 'help',
    aliases: ['?', 'commands'],
    summary: 'List available commands.',
    category: 'system',
    run: () => {
      // Builds itself from the manifest rather than a hand-typed list, so it can never fall out of date.
      const coreCommands = COMMAND_MANIFEST.filter(c => c.category === 'core' && !c.hidden);
      const systemCommands = COMMAND_MANIFEST.filter(c => c.category === 'system' && !c.hidden && c.id !== 'help');
      const lines: TerminalLine[] = [
        line('m', 'Available commands:'),
        sp(),
        ...coreCommands.map(c => ({
          t: 'm' as TerminalLineType,
          text: '',
          parts: [
            { t: 'brand' as TerminalLineType, text: c.id.padEnd(14) },
            { t: 'muted' as TerminalLineType, text: `- ${c.summary.split('.')[0].toLowerCase()}` },
          ],
        })),
        sp(),
        ...systemCommands.map(c => ({
          t: 'm' as TerminalLineType,
          text: '',
          parts: [
            { t: 'b' as TerminalLineType, text: c.id.padEnd(14) },
            { t: 'muted' as TerminalLineType, text: `- ${c.summary.split('.')[0].toLowerCase()}` },
          ],
        })),
        sp(),
        { t: 'm', text: '', parts: [{ t: 'muted', text: 'easter eggs: ' }, { t: 'b', text: 'snake · matrix · coffee · sudo · advanced · dbt · fabric' }] },
        sp(),
        { t: 'm', text: '', parts: [{ t: 'muted', text: 'tip: ' }, { t: 'brand', text: 'Tab' }, { t: 'muted', text: ' completes commands · ' }, { t: 'brand', text: '↑↓' }, { t: 'muted', text: ' recalls history · ' }, { t: 'brand', text: 'man <cmd>' }, { t: 'muted', text: ' shows details' }] },
        sp(),
      ];
      return { lines, showPills: true };
    },
  },

  // ── man <command> ──────────────────────────────────────────────────────────
  {
    id: 'man',
    aliases: [],
    summary: 'Show manual page for a command.',
    category: 'system',
    run: () => ({
      lines: [
        line('r', 'man: missing operand.'),
        line('m', "usage: man <command>  e.g. 'man expertise'"),
      ],
    }),
  },

  // ── history ────────────────────────────────────────────────────────────────
  {
    id: 'history',
    aliases: [],
    summary: 'Print the session command history.',
    category: 'system',
    run: (ctx) => {
      const hist = ctx.cmdHistory ?? [];
      if (hist.length === 0) return { lines: [line('m', 'No commands in history yet.')] };
      return {
        lines: [
          line('m', 'Command history (most recent first):'),
          sp(),
          ...hist.map((cmd, i) => ({
            t: 'm' as TerminalLineType,
            text: '',
            parts: [
              { t: 'muted' as TerminalLineType, text: `  [${String(i + 1).padStart(2, ' ')}]  ` },
              { t: 'brand' as TerminalLineType, text: cmd },
            ],
          })),
          sp(),
        ],
      };
    },
  },

  // ── status ─────────────────────────────────────────────────────────────────
  {
    id: 'status',
    aliases: ['sys', 'sysinfo', 'uptime'],
    summary: 'Live system status uptime, environment.',
    category: 'system',
    run: (ctx) => {
      const uptimeMs = ctx.sessionStartMs ? Date.now() - ctx.sessionStartMs : 0;
      return {
        lines: [
          line('g', '[SYSTEM]: Status report'),
          sp(),
          { t: 'm', text: '', parts: [{ t: 'brand', text: 'UPTIME      ' }, { t: 'viz-success', text: fmtUptime(uptimeMs) }] },
          { t: 'm', text: '', parts: [{ t: 'brand', text: 'ENV         ' }, { t: 'muted', text: 'studio.v4.2 · branch: main' }] },
          { t: 'm', text: '', parts: [{ t: 'brand', text: 'MBA         ' }, { t: 'b', text: 'BITS Pilani · active sprint' }] },
          { t: 'm', text: '', parts: [{ t: 'brand', text: 'OTP         ' }, { t: 'viz-mac-yellow', text: 'Off the Pace · sprint 1 active' }] },
          sp(),
          line('viz-success', 'all systems nominal.'),
          sp(),
        ],
      };
    },
  },

  // ── off the pace ───────────────────────────────────────────────────────────
  {
    id: 'off the pace',
    aliases: ['otp', 'f1'],
    summary: 'F1 strategy analytics engine full project breakdown.',
    category: 'core',
    run: () => ({ lines: OFF_THE_PACE_LINES }),
  },

  // ── connect ────────────────────────────────────────────────────────────────
  {
    id: 'connect',
    aliases: ['ping me', 'contact', 'reach out', 'reachout', 'connect me', 'contact me', 'chat', 'message', 'email', 'ping', 'talk', 'dm', 'social', 'socials', 'getintouch'],
    summary: 'Open contact channel.',
    category: 'core',
    run: () => ({
      lines: CONNECT_LINES,
      effect: { type: 'contact' },
    }),
  },

  // ── resumé ─────────────────────────────────────────────────────────────────
  {
    id: 'resumé',
    aliases: ['resume', 'résumé', 'download', 'cv', 'pdf', 'getcv', 'downloadcv'],
    summary: 'Download PDF resume.',
    category: 'core',
    run: () => ({ lines: [], effect: { type: 'download' } }),
  },

  // ── ask (bare usage query interception happens in resolveCommand) ────────
  {
    id: 'ask',
    aliases: ['ai', 'agent', 'gemini'],
    summary: `Ask the AI assistant about ${SITE.firstName}, his projects, or his stack.`,
    category: 'core',
    run: () => ({ lines: ASK_USAGE_LINES }),
  },

  // ── advanced ───────────────────────────────────────────────────────────────
  {
    id: 'advanced',
    aliases: [],
    summary: 'Advanced systems manifest.',
    category: 'system',
    run: () => ({ lines: ADVANCED_LINES }),
  },

  // ── gh / activity ─────────────────────────────────────────────────────────
  {
    id: 'gh',
    aliases: ['activity', 'github', 'commits', 'pushes'],
    summary: 'Latest GitHub activity recent pushes and repos.',
    category: 'system',
    run: (ctx) => {
      if (!ctx.githubActivity || ctx.githubActivity === 'loading') {
        return {
          lines: [line('m', `fetching activity from github.com/${SITE.social.github}...`)],
          effect: { type: 'github' },
        };
      }
      if (ctx.githubActivity === 'error') {
        return { lines: [line('r', 'gh: could not reach api.github.com.'), line('m', 'check your connection or try again later.')] };
      }
      if (ctx.githubActivity === 'rate-limited') {
        return { lines: [line('o', 'gh: rate limited (60 req/hr). cached data shown.'), sp()] };
      }
      const events = ctx.githubActivity as GitHubEvent[];
      if (events.length === 0) {
        return { lines: [line('m', 'No recent public activity found.')] };
      }
      return {
        lines: [
          line('g', 'Recent GitHub activity:'),
          sp(),
          ...events.slice(0, 6).map(e => ({
            t: 'm' as TerminalLineType,
            text: '',
            parts: [
              { t: 'brand' as TerminalLineType, text: `  ${e.type.replace('Event', '').toLowerCase().padEnd(8)}  ` },
              { t: 'viz-success' as TerminalLineType, text: e.repo },
              { t: 'muted' as TerminalLineType, text: `  ${e.createdAt}` },
            ],
          })),
          sp(),
        ],
      };
    },
  },

  // ── snake ──────────────────────────────────────────────────────────────────
  {
    id: 'snake',
    aliases: ['play snake', 'playsnake', 'minigame', 'snak'],
    summary: 'Launch Snake arcade game.',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [], effect: { type: 'snake' } }),
  },

  // ── play ───────────────────────────────────────────────────────────────────
  {
    id: 'play',
    aliases: ['game', 'arcade', 'games'],
    summary: 'List available retro arcade games.',
    category: 'system',
    run: () => ({ lines: PLAY_LINES }),
  },

  // ── pong ──────────────────────────────────────────────────────────────────
  {
    id: 'pong',
    aliases: ['play pong'],
    summary: 'Launch Pong arcade game.',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [], effect: { type: 'pong' } }),
  },

  // ── tetris ────────────────────────────────────────────────────────────────
  {
    id: 'tetris',
    aliases: ['play tetris'],
    summary: 'Launch Tetris arcade game.',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [], effect: { type: 'tetris' } }),
  },

  // ── space invaders ────────────────────────────────────────────────────────
  {
    id: 'space invaders',
    aliases: ['spaceinvaders', 'play space invaders', 'invaders'],
    summary: 'Launch Space Invaders arcade game.',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [], effect: { type: 'space_invaders' } }),
  },

  // ── the long version ───────────────────────────────────────────────────────
  {
    id: 'the long version',
    aliases: ['the-long-version', 'longversion', 'marginalia', 'vault'],
    summary: 'Navigate to the marginalia & after-hours vault.',
    category: 'core',
    run: () => ({
      lines: LONG_VERSION_LINES,
      effect: { type: 'the-long-version' },
    }),
  },

  // ── theme ──────────────────────────────────────────────────────────────────
  {
    id: 'theme',
    aliases: ['theme toggle', 'dark', 'light', 'mode', 'toggle', 'color', 'colors', 'style'],
    summary: 'Toggle color theme.',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [line('g', 'theme toggled.')], effect: { type: 'theme' } }),
  },

  // ── easter eggs ────────────────────────────────────────────────────────────
  {
    id: 'coffee',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.coffee }),
  },
  {
    id: 'matrix',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.matrix }),
  },
  {
    id: 'life',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.life }),
  },
  {
    id: 'secret',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.secret }),
  },
  {
    id: 'salary',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.salary }),
  },
  {
    id: 'dbt',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.dbt }),
  },
  {
    id: 'fabric',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: EGG_LINES.fabric }),
  },
];

// FUNNY_ERRORS (joke "commands" not real features, canned responses looked up
// by name in resolveCommand below) now lives in content/terminal.ts it's
// copy, not logic.

// ─────────────────────────────────────────────────────────────────────────────
// Completion (Phase 1.1)
// ─────────────────────────────────────────────────────────────────────────────

// Every visible command name/alias starting with `prefix`, deduped and sorted.
function getCompletionCandidates(prefix: string): string[] {
  if (!prefix) return [];
  const p = prefix.toLowerCase();
  const candidates: string[] = [];
  for (const spec of COMMAND_MANIFEST) {
    if (spec.hidden) continue;
    const names = [spec.id, ...spec.aliases];
    for (const name of names) {
      if (name.startsWith(p) && name !== p) candidates.push(name);
    }
  }
  return [...new Set(candidates)].sort();
}

// One match → complete the rest of the word. Several → fill in only the longest
// common prefix they all share, like a real shell's tab completion.
export function getCompletion(prefix: string): { completion: string; candidates: string[] } {
  const candidates = getCompletionCandidates(prefix);
  if (candidates.length === 0) return { completion: '', candidates: [] };
  if (candidates.length === 1) return { completion: candidates[0].slice(prefix.length), candidates };

  // Longest common prefix
  let common = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    let j = 0;
    while (j < common.length && j < candidates[i].length && common[j] === candidates[i][j]) j++;
    common = common.slice(0, j);
  }
  return { completion: common.slice(prefix.length), candidates };
}

// ─────────────────────────────────────────────────────────────────────────────
// Levenshtein fuzzy match (Phase 1.2)
// ─────────────────────────────────────────────────────────────────────────────

// Edit distance between a and b, used to power "did you mean…?" a small
// distance means a likely typo.
export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Closest command by edit distance, but only within 2 edits otherwise the
// suggestion would be more misleading than a plain "not found".
function findClosestCommand(input: string): string | null {
  let best: string | null = null;
  let bestDist = 3; // threshold: ≤2 edits
  for (const spec of COMMAND_MANIFEST) {
    if (spec.hidden) continue;
    for (const name of [spec.id, ...spec.aliases]) {
      const dist = levenshtein(input, name);
      if (dist < bestDist) { bestDist = dist; best = spec.id; }
    }
  }
  return best;
}

// ─────────────────────────────────────────────────────────────────────────────
// resolveCommand
// ─────────────────────────────────────────────────────────────────────────────

// The front door: tries each possibility in priority order and returns the first
// that fits special cases (clear/man/sudo/hire) → exact manifest match → joke
// errors → keyword hints → "did you mean?" → generic not-found. Order matters.
export function resolveCommand(raw: string, ctx: CommandContext = {}): CommandResult {
  const cmd = raw.trim().toLowerCase();

  if (cmd === 'clear') return { lines: [] };

  // ── man <something> ────────────────────────────────────────────────────────
  if (cmd.startsWith('man ')) {
    const target = cmd.slice(4).trim();
    if (!target) return { lines: [line('r', "man: missing operand."), line('m', "usage: man <command>")] };
    const spec = COMMAND_MANIFEST.find(s =>
      s.id === target || s.aliases.includes(target)
    );
    if (!spec || spec.hidden) {
      return {
        lines: [
          line('r', `man: no manual entry for '${target}'`),
          line('m', "type 'help' to see available commands."),
        ],
      };
    }
    return {
      lines: [
        sp(),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'NAME     ' }, { t: 'g', text: spec.id }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'SUMMARY  ' }, { t: 'muted', text: spec.summary }] },
        ...(spec.aliases.length > 0
          ? [{ t: 'm' as TerminalLineType, text: '', parts: [{ t: 'brand' as TerminalLineType, text: 'ALIASES  ' }, { t: 'b' as TerminalLineType, text: spec.aliases.join(', ') }] }]
          : []),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'USAGE    ' }, { t: 'muted', text: spec.id }] },
        sp(),
      ],
    };
  }

  // ── sudo escalating responses ────────────────────────────────────────────
  if (cmd === 'sudo') {
    const n = ctx.sudoCount ?? 1;
    if (n === 2) return { lines: SUDO_ESCALATION.second };
    if (n >= 3) return { lines: SUDO_ESCALATION.lockedOut };
    return { lines: FUNNY_ERRORS['sudo'] };
  }

  // ── ask <question> → AI agent ──────────────────────────────────────────────
  if (cmd.startsWith('ask ') || cmd.startsWith('ai ') || cmd.startsWith('agent ') || cmd.startsWith('gemini ')) {
    const prefixLen = cmd.startsWith('ask ') ? 4 : cmd.startsWith('ai ') ? 3 : cmd.startsWith('agent ') ? 6 : 7;
    const query = raw.trim().slice(prefixLen).trim();
    if (!query) {
      return {
        lines: [
          line('r', 'ask: missing question.'),
          line('m', "usage: ask <your question>"),
        ],
      };
    }
    return {
      lines: [
        { t: 'muted' as TerminalLineType, text: 'thinking...', streaming: true },
      ],
      effect: { type: 'ai', aiQuery: query },
    };
  }

  // ── hire special case (contact effect) ────────────────────────────────────
  if (cmd === 'hire' || cmd === 'hire justin') {
    return { lines: FUNNY_ERRORS[cmd] ?? [], effect: { type: 'contact' } };
  }

  // ── Manifest lookup (canonical id + aliases) ───────────────────────────────
  for (const spec of COMMAND_MANIFEST) {
    const names = [spec.id, ...spec.aliases];
    if (names.some(n => cmd === n || cmd === n.toLowerCase())) {
      return spec.run(ctx);
    }
  }

  // ── Funny errors ───────────────────────────────────────────────────────────
  for (const key of Object.keys(FUNNY_ERRORS)) {
    if (cmd === key || cmd.startsWith(key + ' ')) return { lines: FUNNY_ERRORS[key] };
  }

  // ── Natural language → AI ─────────────────────────────────────────────────
  // If the input looks like a question or sentence rather than a command typo,
  // send it straight to the AI agent instead of showing "command not found".
  const QUESTION_STARTERS = ['what', 'who', 'where', 'when', 'why', 'how', 'is', 'does', 'can', 'will', 'would', 'has', 'have', 'did', 'could', 'should', 'tell'];
  const isNaturalLanguage =
    raw.includes('?') ||
    raw.trim().split(/\s+/).length >= 4 ||
    QUESTION_STARTERS.some(w => cmd.startsWith(w + ' '));
  if (isNaturalLanguage) {
    return {
      lines: [{ t: 'muted' as TerminalLineType, text: 'thinking...', streaming: true }],
      effect: { type: 'ai', aiQuery: raw.trim() },
    };
  }

  // ── Keyword guesses ────────────────────────────────────────────────────────
  // Not an exact command, but the text contains a telltale word ("project", "skill"…)
  // so nudge toward the right command instead of a bare "not found".
  const guesses: TerminalLine[] = [];
  if (cmd.includes('project') || cmd.includes('work') || cmd.includes('case') || cmd.includes('portfolio') || cmd.includes('app') || cmd.includes('showcase') || cmd.includes('studio')) guesses.push(line('o', "→ try 'ls projects'"));
  if (cmd.includes('about') || cmd.includes('justin') || cmd.includes('learn') || cmd.includes('who') || cmd.includes('bio') || cmd.includes('profile')) guesses.push(line('o', "→ try 'about me'"));
  if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('tool') || cmd.includes('stack') || cmd.includes('language')) guesses.push(line('o', "→ try 'expertise'"));
  if (cmd.includes('job') || cmd.includes('career') || cmd.includes('cv') || cmd.includes('resumé') || cmd.includes('résumé') || cmd.includes('experience') || cmd.includes('education') || cmd.includes('degree') || cmd.includes('study') || cmd.includes('uni')) guesses.push(line('o', "→ try 'timeline' or 'resumé'"));
  if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('dm') || cmd.includes('reach') || cmd.includes('connect') || cmd.includes('message') || cmd.includes('chat') || cmd.includes('ping')) guesses.push(line('o', "→ try 'connect'"));
  if (cmd.includes('f1') || cmd.includes('formula') || cmd.includes('race')) guesses.push(line('o', "→ try 'off the pace'"));
  if (cmd.includes('music') || cmd.includes('spotify') || cmd.includes('track')) guesses.push(line('o', "→ try 'ls projects' → Spotify: Predictive Engine"));

  if (guesses.length > 0) {
    return { lines: [line('r', `command not found: ${raw.trim()}`), ...guesses] };
  }

  // ── Levenshtein "did you mean" ─────────────────────────────────────────────
  const closest = findClosestCommand(cmd);
  if (closest) {
    return {
      lines: [
        line('r', `command not found: ${raw.trim()}`),
        { t: 'o', text: '', parts: [{ t: 'muted', text: "did you mean: " }, { t: 'brand', text: `'${closest}'` }, { t: 'muted', text: "?" }], chips: [closest] },
      ],
      exitCode: 127,
    };
  }

  return {
    lines: [
      line('r', `command not found: ${raw.trim()}`),
      line('m', "type 'help' to see what's available."),
    ],
    exitCode: 127,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar + conversational helpers (unchanged API)
// ─────────────────────────────────────────────────────────────────────────────

// Flavour text picked while a command runs; pure cosmetics, no logic depends on them.
export function getSidebarFunMessage(cmd: string): string {
  const normalized = cmd.trim().toLowerCase();
  const list = SIDEBAR_FUN_MESSAGES[normalized] ?? SIDEBAR_FUN_DEFAULT;
  return list[Math.floor(Math.random() * list.length)];
}

export function getConversationalPreamble(cmd: string): string {
  const normalized = cmd.trim().toLowerCase();
  for (const { keywords, text } of CONVERSATIONAL_PREAMBLES) {
    if (keywords.some(k => normalized.includes(k))) return text;
  }
  return PREAMBLE_DEFAULT;
}

