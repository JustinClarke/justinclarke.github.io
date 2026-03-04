/**
 * TerminalEngine.ts
 *
 * Pure logic and data for the portfolio terminal.
 * No React, no DOM, fully testable.
 *
 * Updated: single CommandSpec manifest drives autocomplete, man, help, and resolution.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TerminalLineType =
  | 'muted' | 'success' | 'info' | 'brand' | 'error' | 'obscured' | 'prompt' | 'cmd' | 'edu'
  | 'viz-mac-red' | 'viz-mac-yellow' | 'viz-success'
  | 'p' | 'g' | 'b' | 'pu' | 'm' | 'o' | 'r' | 't';

export interface TerminalLine {
  t: TerminalLineType;
  text: string;
  parts?: { t: TerminalLineType; text: string; href?: string }[];
  href?: string;
  chips?: string[];
  streaming?: boolean;
}

export type SideEffectType = 'scroll' | 'snake' | 'theme' | 'download' | 'contact' | 'the-long-version' | 'github';

export interface CommandEffect {
  type: SideEffectType;
  payload?: string;
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
const parts = (t: TerminalLineType, text: string, ...rest: TerminalLine['parts']): TerminalLine =>
  ({ t: 'm' as TerminalLineType, text: '', parts: [{ t, text }, ...(rest ?? [])] });
const sp = (): TerminalLine => line('m', ' ');

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
    summary: 'Identity brief one-screen snapshot of who Justin is.',
    category: 'core',
    run: () => ({
      lines: [
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'IDENTITY:  ' }, { t: 'g', text: 'Justin Clarke · Analytics Engineer · Full-Stack' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'FOCUS:     ' }, { t: 'b', text: 'pipelines and the products they power' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'LOCATION:  ' }, { t: 'pu', text: 'Dubai, UAE · open to relocation · visa sponsored' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'STACK:     ' }, { t: 'viz-mac-yellow', text: 'Python ' }, { t: 'viz-mac-red', text: 'SQL ' }, { t: 'b', text: 'dbt ' }, { t: 'pu', text: 'PowerBI' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'IN FLIGHT: ' }, { t: 'muted', text: 'MBA Business Analytics · Off the Pace' }] },
        sp(),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'TRY NEXT:  ' }, { t: 'muted', text: 'about me · timeline · ls projects' }], chips: ['about me', 'timeline', 'ls projects'] },
      ],
    }),
  },

  // ── about me ───────────────────────────────────────────────────────────────
  {
    id: 'about me',
    aliases: ['about', 'learn more', 'learnmore', 'identity', 'bio', 'profile', 'introducing', 'discover', 'developer', 'profile.read()', 'profile.read'],
    summary: 'Full background, education, current work, and availability.',
    category: 'core',
    run: () => ({
      lines: [
        sp(),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'NAME       ' }, { t: 'g', text: 'justin clarke' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'ROLE       ' }, { t: 'b', text: 'analytics engineer + creative technologist' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'BASED      ' }, { t: 'pu', text: 'dubai · willing to relocate' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'EDU        ' }, { t: 'muted', text: 'msc computer science · distinction · qmul' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'muted', text: 'mba business analytics · bits pilani · in progress' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'NOW        ' }, { t: 'muted', text: 'building off the pace on microsoft fabric.' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'muted', text: 'isolating driver skill from car performance.' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'SIGNAL     ' }, { t: 'viz-mac-yellow', text: "// i notice patterns before they're named." }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'viz-mac-yellow', text: "// i build applications when i'm bored." }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'AVAIL      ' }, { t: 'viz-success', text: 'available now · contract or full-time' }] },
        sp(),
        { t: 'prompt', text: '~$ the long version?' },
        { t: 'm', text: '', parts: [{ t: 'brand', text: '  → /the-long-version · marginalia after-hours ↗', href: '/the-long-version' }] },
        sp(),
      ],
    }),
  },

  // ── ls projects ────────────────────────────────────────────────────────────
  {
    id: 'ls projects',
    aliases: ['projects', 'work', 'cases', 'portfolio', 'showcase', 'apps', 'products', 'code', 'repos', 'list'],
    summary: 'Featured case studies 6 production projects.',
    category: 'core',
    run: () => ({
      lines: [
        line('m', 'Accessing case study archive...'),
        sp(),
        { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '[01] ' }, { t: 'brand', text: 'Retail as a Service ' }, { t: 'muted', text: '- next.js · production saas' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '[02] ' }, { t: 'brand', text: 'Disaster Response System ' }, { t: 'muted', text: '- mysql · relational design' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-success', text: '[03] ' }, { t: 'brand', text: 'Spotify: Predictive Engine ' }, { t: 'muted', text: '- python · scikit-learn · 12D vectors' }] },
        { t: 'm', text: '', parts: [{ t: 'b', text: '[04] ' }, { t: 'brand', text: 'Behavioural Intelligence System ' }, { t: 'muted', text: '- gemini · behavioural ai' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '[05] ' }, { t: 'brand', text: 'Capital Architecture ' }, { t: 'muted', text: '- dcf · financial engineering' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '[06] ' }, { t: 'brand', text: 'Off the Pace ' }, { t: 'viz-mac-yellow', text: '- f1 · telemetry pipeline · in development' }] },
        sp(),
        line('m', '↓ establishing scroll lock...'),
      ],
      effect: { type: 'scroll', payload: 'projects' },
    }),
  },

  // ── expertise ──────────────────────────────────────────────────────────────
  {
    id: 'expertise',
    aliases: ['skills', 'stack', 'toolkit', 'technologies', 'languages', 'tech', 'tools'],
    summary: 'Analytics + full-stack skill matrix.',
    category: 'core',
    run: () => {
      return {
        lines: [
          line('m', 'Retrieving technical skill manifest...'),
          sp(),
          { t: 'm', text: '', parts: [{ t: 'pu', text: 'ANALYTICS:   ' }, { t: 'brand', text: 'Microsoft Fabric · Power BI · DAX · KQL · Mixpanel' }] },
          { t: 'm', text: '', parts: [{ t: 'g', text: 'LANGUAGES:   ' }, { t: 'brand', text: 'Python · SQL · TypeScript · R' }] },
          { t: 'm', text: '', parts: [{ t: 'b', text: 'DATA:        ' }, { t: 'brand', text: 'data modelling · KPI dev · product analytics · dashboarding' }] },
          { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: 'INFRA:       ' }, { t: 'brand', text: 'PostgreSQL · AWS · Docker · REST APIs · CI/CD' }] },
          sp(),
          line('m', '↓ mapping expertise pipeline...'),
        ],
        effect: { type: 'scroll', payload: 'expertise' },
      };
    },
  },

  // ── timeline ───────────────────────────────────────────────────────────────
  {
    id: 'timeline',
    aliases: ['record', 'experience', 'education', 'career', 'background', 'path', 'jobs', 'journey', 'academics'],
    summary: 'Full career and academic timeline.',
    category: 'core',
    run: () => {
      return {
        lines: [
          line('m', 'Querying career + academic record...'),
          sp(),
          line('brand', '[ PROFESSIONAL ]'),
          { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'BI & Analytics Dev     ' }, { t: 'b', text: 'VNS Solutions           ' }, { t: 'muted', text: '2024–2025' }] },
          { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'Product & Analytics    ' }, { t: 'b', text: 'LiteStore               ' }, { t: 'muted', text: '2021–2023' }] },
          { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'Frontend & Brand Dev   ' }, { t: 'b', text: 'Drop                    ' }, { t: 'muted', text: '2021' }] },
          sp(),
          line('brand', '[ ACADEMIC ]'),
          { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'BITS Pilani, UAE              ' }, { t: 'b', text: 'MBA Business Analytics   ' }, { t: 'viz-mac-red', text: 'IN PROGRESS' }] },
          { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'Queen Mary, Univ. of London   ' }, { t: 'b', text: 'MSc Computer Science     ' }, { t: 'viz-success', text: 'DISTINCTION' }] },
          { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'GITAM University, India       ' }, { t: 'b', text: 'BTech CS&E               ' }, { t: 'viz-success', text: 'DISTINCTION' }] },
          sp(),
          line('m', '↓ scrolling to full-spectrum timeline...'),
        ],
        effect: { type: 'scroll', payload: 'experience' },
      };
    },
  },

  // ── help ───────────────────────────────────────────────────────────────────
  {
    id: 'help',
    aliases: ['?', 'commands'],
    summary: 'List available commands.',
    category: 'system',
    run: () => {
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
          { t: 'm', text: '', parts: [{ t: 'brand', text: 'ENV         ' }, { t: 'muted', text: 'portfolio.v4.2 · branch: main' }] },
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
    run: () => ({
      lines: [
        line('m', 'Accessing project telemetry...'),
        sp(),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'PROJECT:   ' }, { t: 'g', text: 'Off the Pace Analytics' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'THESIS:    ' }, { t: 'b', text: 'Was every F1 pit stop call actually optimal?' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'STACK:     ' }, { t: 'muted', text: 'FastF1 · dbt · DuckDB · XGBoost · Microsoft Fabric' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'DATA:      ' }, { t: 'muted', text: '2021 season · lap times · tyre degradation · stint models' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: 'STATUS:    ' }, { t: 'viz-mac-yellow', text: 'IN DEVELOPMENT · sprint 1 active' }] },
        sp(),
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'REPO:      ' }, { t: 'g', text: 'github.com/justinclarke/off-the-pace ↗' }] },
      ],
    }),
  },

  // ── connect ────────────────────────────────────────────────────────────────
  {
    id: 'connect',
    aliases: ['ping me', 'contact', 'reach out', 'reachout', 'connect me', 'contact me', 'chat', 'message', 'email', 'ping', 'talk', 'dm', 'social', 'socials', 'getintouch'],
    summary: 'Open contact channel.',
    category: 'core',
    run: () => ({
      lines: [
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'CHANNEL:       ' }, { t: 'g', text: 'justinsavioclarke@outlook.com' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'LINKEDIN:      ' }, { t: 'g', text: 'linkedin.com/in/justinsavioclarke ↗' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'AVAILABILITY:  ' }, { t: 'viz-success', text: 'OPEN · full-time alongside MBA' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'VISA:          ' }, { t: 'muted', text: 'UAE Family Residence · sponsored' }] },
        { t: 'm', text: '', parts: [{ t: 'brand', text: 'RESPONSE TIME: ' }, { t: 'viz-mac-yellow', text: '< 24h' }] },
      ],
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

  // ── advanced ───────────────────────────────────────────────────────────────
  {
    id: 'advanced',
    aliases: [],
    summary: 'Advanced systems manifest.',
    category: 'system',
    run: () => ({
      lines: [
        line('m', 'Loading Advanced Systems Manifest...'),
        sp(),
        { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'matrix  ' }, { t: 'muted', text: '- establish telemetry' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'coffee  ' }, { t: 'muted', text: '- check fuel levels' }] },
        { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'sudo    ' }, { t: 'muted', text: '- root protocols' }] },
        { t: 'm', text: '', parts: [{ t: 'b', text: '● ' }, { t: 'brand', text: 'dbt     ' }, { t: 'muted', text: '- run transformations' }] },
        { t: 'm', text: '', parts: [{ t: 'pu', text: '● ' }, { t: 'brand', text: 'fabric  ' }, { t: 'muted', text: '- check the lakehouse' }] },
        sp(),
        { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '■ ' }, { t: 'viz-mac-yellow', text: '■ ' }, { t: 'viz-success', text: '■ ' }, { t: 'brand', text: '100% SPECTRUM OPTIMIZED' }] },
      ],
    }),
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
          lines: [line('m', 'fetching activity from github.com/JustinClarke...')],
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
    aliases: ['play snake', 'playsnake', 'game', 'play', 'arcade', 'minigame', 'snak'],
    summary: 'Launch Snake arcade game (desktop only).',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [], effect: { type: 'snake' } }),
  },

  // ── the long version ───────────────────────────────────────────────────────
  {
    id: 'the long version',
    aliases: ['the-long-version', 'longversion', 'marginalia', 'vault'],
    summary: 'Navigate to the marginalia & after-hours vault.',
    category: 'core',
    run: () => ({
      lines: [
        line('g', 'Accessing marginalia & after-hours records...'),
        line('muted', 'Ready to route to the-long-version.'),
      ],
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
    run: () => ({
      lines: [
        line('viz-mac-yellow', 'brew: running on it since 2018.'),
        line('muted', 'no REST API available. send the real thing to Dubai.'),
      ],
    }),
  },
  {
    id: 'matrix',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({
      lines: [
        line('g', 'wake up, Neo.'),
        line('muted', 'the data pipeline was the real matrix all along.'),
        line('g', 'red pill = dbt. blue pill = Excel. choose wisely.'),
      ],
    }),
  },
  {
    id: 'life',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [line('pu', 'life: undefined. pipelines operational. MBA in progress. send help (or coffee).')] }),
  },
  {
    id: 'secret',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({ lines: [line('r', 'nice try. encrypted dreams require level 10 clearance and a MSc. you might be close.')] }),
  },
  {
    id: 'salary',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({
      lines: [
        line('m', 'connecting to market-rate.io...'),
        line('viz-success', 'result: whatever you were thinking, add 20%.'),
        line('muted', '(two distinctions, MBA in progress, visa sponsored. do the math.)'),
      ],
    }),
  },
  {
    id: 'dbt',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({
      lines: [
        line('g', 'models: compiled. tests: passing. lineage: documented.'),
        line('muted', 'sources freshness: acceptable. Justin: caffeinated. ship it.'),
      ],
    }),
  },
  {
    id: 'fabric',
    aliases: [],
    summary: '',
    category: 'egg',
    hidden: true,
    run: () => ({
      lines: [
        line('pu', 'Microsoft Fabric: online.'),
        line('muted', 'lakehouse: mounted. KQL: sharp. eventstream: flowing.'),
        line('g', "it's not just a certification. it's a lifestyle."),
      ],
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// "funny error" commands (canonical errors that aren't real commands)
// ─────────────────────────────────────────────────────────────────────────────

const FUNNY_ERRORS: Record<string, TerminalLine[]> = {
  sudo: [
    line('r', "sudo: permission denied."),
    line('muted', "Justin's life choices are root-only. and honestly? fair."),
  ],
  'rm -rf': [
    line('r', "rm: cannot remove portfolio: target too impressive to delete."),
    line('muted', "try 'ls projects' instead. much more productive."),
  ],
  'git blame': [
    line('o', "git blame: 100% Justin Clarke."),
    line('muted', "he commits, he ships, he owns it. no exceptions."),
  ],
  'git commit': [
    line('viz-success', "nothing to commit. working tree clean."),
    line('muted', "life is shipping."),
  ],
  vim: [
    line('r', "vim: opened successfully."),
    line('muted', "good luck getting out. we'll be here. (hint: :q!)"),
  ],
  emacs: [line('r', "emacs: Justin uses VS Code. this isn't 1991.")],
  excel: [
    line('viz-mac-yellow', "Excel: recognised. respected. surpassed."),
    line('muted', "Power BI, SQL, and Python exist for a reason. type 'expertise'."),
  ],
  hire: [
    line('g', "redirecting to good-decision-making.exe..."),
    line('b', "→ justinsavioclarke@outlook.com"),
    line('muted', "visa sponsored required. that's already one less problem."),
  ],
  'hire justin': [
    line('g', "outstanding choice. forwarding CV to your conscience..."),
    line('viz-success', "→ justinsavioclarke@outlook.com · two distinctions · ships fast"),
  ],
  'play snake': [line('g', "launching snake.exe · arrow keys · don't blame us for the lost productivity")],
  pwd: [line('g', "/home/justin/portfolio · exactly where you should be.")],
  exit: [
    line('r', "exit: blocked."),
    line('muted', "you haven't seen the projects yet. scroll first."),
  ],
  quit: [
    line('r', "quit: not yet."),
    line('muted', "Off the Pace is in development. the good part is coming."),
  ],
  hello: [line('g', "hello to you too. type 'help' if you're lost. type 'whoami' if you're curious.")],
  hi: [line('g', "hey 👋  type 'help' to get oriented. or just start exploring.")],
  ls: [line('b', "too vague. try 'ls projects' - that's where the interesting stuff lives.")],
  cat: [line('b', "try 'profile.read()' or just type 'whoami'. same energy, better output.")],
  'npm install': [
    line('viz-success', "already installed. Justin ships production-ready, not localhost."),
    line('muted', "0 vulnerabilities. 0 regrets."),
  ],
  'npm run dev': [line('g', "dev server running at justinclarke.github.io ↗")],
  python: [
    line('g', "Python 3.11 detected · pandas · numpy · scikit-learn · fastf1 loaded."),
    line('muted', "currently training an XGBoost model to embarrass F1 strategists."),
  ],
  node: [line('g', "Node v20 · TypeScript · Next.js standing by. LiteStore ran on this. it survived.")],
  curl: [
    line('b', "curl: (200) OK · 0.6s LCP · SSR + edge caching."),
    line('muted', "down from 3.0s. Justin did that."),
  ],
  power_bi: [
    line('b', "Power BI dashboards feeding automated Fabric pipelines."),
    line('muted', "DAX is not a dark art. it's just misunderstood."),
  ],
  whoops: [line('o', "it happens. type 'help' and we'll get you back on track.")],
  test: [
    line('viz-success', "test suite: all passing."),
    line('muted', "dbt tests: green. portfolio: shipped. Justin: operational."),
  ],
  mba: [
    line('viz-mac-yellow', "MBA Business Analytics · BITS Pilani, UAE · 2026–2028."),
    line('muted', "yes, he's doing it alongside full-time work. yes, he's fine. mostly."),
  ],
  dubai: [
    line('pu', "Dubai, UAE · UTC+4 · visa sponsored."),
    line('muted', "open to relocation. also open to remote. very flexible. very available."),
  ],
  quantum: [
    line('b', "BTech research: encryption via quantum key generation."),
    line('muted', "it was 2021. Justin was different back then. the ambition was the same."),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Completion (Phase 1.1)
// ─────────────────────────────────────────────────────────────────────────────

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
    if (n === 2) return { lines: [line('r', "sudo: still no."), line('muted', "persistence noted. credentials remain: 0.")] };
    if (n >= 3) return { lines: [line('r', "sudo: you've been locked out."), line('muted', "root password hint: it's not 'password'. or 'justin'. or 'fabric'."), line('pu', "IT support ticket #8080 has been filed.")] };
    return { lines: FUNNY_ERRORS['sudo'] };
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

  // ── Keyword guesses ────────────────────────────────────────────────────────
  const guesses: TerminalLine[] = [];
  if (cmd.includes('project') || cmd.includes('work') || cmd.includes('case') || cmd.includes('portfolio') || cmd.includes('app') || cmd.includes('showcase')) guesses.push(line('o', "→ try 'ls projects'"));
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

export function getSidebarFunMessage(cmd: string): string {
  const normalized = cmd.trim().toLowerCase();
  const messages: Record<string, string[]> = {
    resume: ["Accessing CV repository... File loaded.", "Preparing PDF transmission... Secure downlink active.", "Pulling up academic + professional resumé..."],
    'resumé': ["Accessing CV repository... File loaded.", "Preparing PDF transmission... Secure downlink active.", "Pulling up academic + professional resumé..."],
    connect: ["Accessing records... Opening communication channel.", "Initiating secure uplink... Ready to connect.", "Routing signal to Dubai headquarters... Standing by."],
    timeline: ["Querying career database... Time-machine active.", "Accessing academic records... Fast-forwarding.", "Loading interactive career timeline... Scroll-lock engaged."],
    'the long version': ["Opening the secret vault... Access granted.", "Loading marginalia & after-hours projects...", "Decoupling core engines... Navigating to the-long-version."],
    projects: ["Scanning case studies... 6 repositories found.", "Accessing showcase records... Preparing scroll-link.", "Scrolling to featured work... Initiating view-port alignment."],
  };
  const list = messages[normalized] ?? ["Taking you there...", "Accessing records...", "Initiating sequence..."];
  return list[Math.floor(Math.random() * list.length)];
}

export function getConversationalPreamble(cmd: string): string {
  const normalized = cmd.trim().toLowerCase();
  if (normalized.includes('project') || normalized.includes('ls')) return "Ah, excellent choice! Pulling up the case study archives. Let me display the index:";
  if (normalized.includes('about') || normalized.includes('whois') || normalized.includes('whoami')) return "Certainly! Querying my identity manifest... Here is a brief profile of who I am:";
  if (normalized.includes('timeline') || normalized.includes('career') || normalized.includes('experience')) return "Querying database... I have compiled my academic and professional journey here:";
  if (normalized.includes('connect') || normalized.includes('contact')) return "Initiating secure uplink... Here are the official channels to get in touch with me:";
  if (normalized.includes('resume') || normalized.includes('cv')) return "Right away! Retrieving the latest PDF version of my CV:";
  if (normalized.includes('expertise') || normalized.includes('skill')) return "Scanning skill matrix... Here is a summary of my active stack and certifications:";
  if (normalized.includes('snake')) return "Warning: Retro arcade environment detected! Initiating snake.exe:";
  return "Processing query... Here is what I found:";
}

