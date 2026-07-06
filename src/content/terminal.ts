/**
 * content/terminal.ts the terminal's static copy: pre-written line blocks the
 * engine prints verbatim, the joke-command responses, the sidebar/preamble
 * flavour-text pools, and the Preloader's boot log.
 *
 * Fits in: engine.ts (and Preloader.tsx) import these blocks; the engine keeps
 *          all the dynamic logic (resolving commands, context-dependent output
 *          like uptime, github activity, the sudo counter) and this file keeps
 *          the words.
 * Note:    site facts (name, email, socials) interpolate from SITE so a fork
 *          only edits site.ts; the `ask` usage block reads AI_AGENT so the
 *          model label and query budget can't drift from the real limits.
 *          Types come from @/types/terminal, NOT from engine.ts content must
 *          stay a leaf module (no import cycle).
 * -----------------------------------------------------------------------------
 */
import type { TerminalLine, TerminalLineType } from '@/types/terminal';
import { AI_AGENT } from '@/config/constants';
import { SITE } from './site';

// Tiny factories mirroring engine.ts's helpers, so the blocks below read the
// same as they did in the manifest. (Not imported from the engine: leaf rule.)
const line = (t: TerminalLineType, text: string): TerminalLine => ({ t, text });
const sp: TerminalLine = { t: 'm', text: ' ' };

/** `whoami` the one-screen identity brief. */
export const WHOAMI_LINES: TerminalLine[] = [
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'IDENTITY:  ' }, { t: 'g', text: `${SITE.name} · ${SITE.role}` }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'FOCUS:     ' }, { t: 'b', text: 'pipelines and the products they power' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'LOCATION:  ' }, { t: 'pu', text: `${SITE.location} · open to relocation · sponsorship not required (UAE)` }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'STACK:     ' }, { t: 'viz-mac-yellow', text: 'Python ' }, { t: 'viz-mac-red', text: 'SQL ' }, { t: 'b', text: 'dbt ' }, { t: 'pu', text: 'PowerBI' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'IN FLIGHT: ' }, { t: 'muted', text: 'MBA Business Analytics · Off the Pace' }] },
  sp,
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'TRY NEXT:  ' }, { t: 'muted', text: 'about me · timeline · ls projects' }], chips: ['about me', 'timeline', 'ls projects'] },
];

/** `connect` the contact-channels block. */
export const CONNECT_LINES: TerminalLine[] = [
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'CHANNEL:       ' }, { t: 'g', text: SITE.email }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'LINKEDIN:      ' }, { t: 'g', text: `linkedin.com/in/${SITE.social.linkedin} ↗` }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'AVAILABILITY:  ' }, { t: 'viz-success', text: 'OPEN · full-time alongside MBA' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'SPONSORSHIP:   ' }, { t: 'muted', text: 'not required (UAE Family Residence Visa)' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'RESPONSE TIME: ' }, { t: 'viz-mac-yellow', text: '< 24h' }] },
];

/** `about me` full background, education, current work, availability. */
export const ABOUT_LINES: TerminalLine[] = [
  sp,
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'NAME       ' }, { t: 'g', text: SITE.name.toLowerCase() }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'ROLE       ' }, { t: 'b', text: 'analytics engineer + creative technologist' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'BASED      ' }, { t: 'pu', text: `${SITE.location.split(',')[0].toLowerCase()} · willing to relocate` }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'EDU        ' }, { t: 'muted', text: 'msc computer science · distinction · qmul' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'muted', text: 'mba business analytics · bits pilani · in progress' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'NOW        ' }, { t: 'muted', text: 'building off the pace on microsoft fabric.' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'muted', text: 'isolating driver skill from car performance.' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'SIGNAL     ' }, { t: 'viz-mac-yellow', text: "// i notice patterns before they're named." }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: '           ' }, { t: 'viz-mac-yellow', text: "// i build applications when i'm bored." }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'AVAIL      ' }, { t: 'viz-success', text: 'available now · contract or full-time' }] },
  sp,
  { t: 'prompt', text: '~$ the long version?' },
  { t: 'm', text: '', parts: [{ t: 'brand', text: '  → /the-long-version · marginalia after-hours ↗', href: '/the-long-version' }] },
  sp,
];

/** `ls projects` the featured case-study index. */
export const LS_PROJECTS_LINES: TerminalLine[] = [
  line('m', 'Accessing case study archive...'),
  sp,
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '[01] ' }, { t: 'brand', text: 'Retail as a Service ' }, { t: 'muted', text: '- next.js · production saas' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '[02] ' }, { t: 'brand', text: 'Disaster Response System ' }, { t: 'muted', text: '- mysql · relational design' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-success', text: '[03] ' }, { t: 'brand', text: 'Spotify: Predictive Engine ' }, { t: 'muted', text: '- python · scikit-learn · 12D vectors' }] },
  { t: 'm', text: '', parts: [{ t: 'b', text: '[04] ' }, { t: 'brand', text: 'Behavioural Intelligence System ' }, { t: 'muted', text: '- gemini · behavioural ai' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '[05] ' }, { t: 'brand', text: 'Capital Architecture ' }, { t: 'muted', text: '- dcf · financial engineering' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '[06] ' }, { t: 'brand', text: 'Off the Pace ' }, { t: 'viz-mac-yellow', text: '- f1 · telemetry pipeline · in development' }] },
  sp,
  line('m', '↓ establishing scroll lock...'),
];

/** `expertise` the skill matrix. */
export const EXPERTISE_LINES: TerminalLine[] = [
  line('m', 'Retrieving technical skill manifest...'),
  sp,
  { t: 'm', text: '', parts: [{ t: 'pu', text: 'ANALYTICS:   ' }, { t: 'brand', text: 'Microsoft Fabric · Power BI · DAX · KQL · Mixpanel' }] },
  { t: 'm', text: '', parts: [{ t: 'g', text: 'LANGUAGES:   ' }, { t: 'brand', text: 'Python · SQL · TypeScript · R' }] },
  { t: 'm', text: '', parts: [{ t: 'b', text: 'DATA:        ' }, { t: 'brand', text: 'data modelling · KPI dev · product analytics · dashboarding' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: 'INFRA:       ' }, { t: 'brand', text: 'PostgreSQL · AWS · Docker · REST APIs · CI/CD' }] },
  sp,
  line('m', '↓ mapping expertise pipeline...'),
];

/** `timeline` career + academic record. */
export const TIMELINE_LINES: TerminalLine[] = [
  line('m', 'Querying career + academic record...'),
  sp,
  line('brand', '[ PROFESSIONAL ]'),
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'BI & Analytics Dev     ' }, { t: 'b', text: 'VNS Solutions           ' }, { t: 'muted', text: '2024–2025' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'Product & Analytics    ' }, { t: 'b', text: 'LiteStore               ' }, { t: 'muted', text: '2021–2023' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'Frontend & Brand Dev   ' }, { t: 'b', text: 'Drop                    ' }, { t: 'muted', text: '2021' }] },
  sp,
  line('brand', '[ ACADEMIC ]'),
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'BITS Pilani, UAE              ' }, { t: 'b', text: 'MBA Business Analytics   ' }, { t: 'viz-mac-red', text: 'IN PROGRESS' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'Queen Mary, Univ. of London   ' }, { t: 'b', text: 'MSc Computer Science     ' }, { t: 'viz-success', text: 'DISTINCTION' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'GITAM University, India       ' }, { t: 'b', text: 'BTech CS&E               ' }, { t: 'viz-success', text: 'DISTINCTION' }] },
  sp,
  line('m', '↓ scrolling to full-spectrum timeline...'),
];

/** `off the pace` the flagship-project breakdown. */
export const OFF_THE_PACE_LINES: TerminalLine[] = [
  line('m', 'Accessing project telemetry...'),
  sp,
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'PROJECT:   ' }, { t: 'g', text: 'Off the Pace Analytics' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'THESIS:    ' }, { t: 'b', text: 'Was every F1 pit stop call actually optimal?' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'STACK:     ' }, { t: 'muted', text: 'FastF1 · dbt · DuckDB · XGBoost · Microsoft Fabric' }] },
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'DATA:      ' }, { t: 'muted', text: '2021 season · lap times · tyre degradation · stint models' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: 'STATUS:    ' }, { t: 'viz-mac-yellow', text: 'IN DEVELOPMENT · sprint 1 active' }] },
  sp,
  { t: 'm', text: '', parts: [{ t: 'brand', text: 'REPO:      ' }, { t: 'g', text: `github.com/${SITE.social.github.toLowerCase()}/off-the-pace ↗` }] },
];

/** Bare `ask` the usage hint (limits read from AI_AGENT so they can't drift). */
export const ASK_USAGE_LINES: TerminalLine[] = [
  line('m', 'usage: ask <question>'),
  line('muted', "e.g. 'ask does Justin have Fabric experience?'"),
  sp,
  {
    t: 'm', text: '', parts: [
      { t: 'muted', text: 'powered by ' },
      { t: 'brand', text: AI_AGENT.model },
      { t: 'muted', text: ` · ${AI_AGENT.maxSessionQueries} queries per session` },
    ]
  },
];

/** `advanced` the hidden-systems index. */
export const ADVANCED_LINES: TerminalLine[] = [
  line('m', 'Loading Advanced Systems Manifest...'),
  sp,
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'matrix  ' }, { t: 'muted', text: '- establish telemetry' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'coffee  ' }, { t: 'muted', text: '- check fuel levels' }] },
  { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'sudo    ' }, { t: 'muted', text: '- root protocols' }] },
  { t: 'm', text: '', parts: [{ t: 'b', text: '● ' }, { t: 'brand', text: 'dbt     ' }, { t: 'muted', text: '- run transformations' }] },
  { t: 'm', text: '', parts: [{ t: 'pu', text: '● ' }, { t: 'brand', text: 'fabric  ' }, { t: 'muted', text: '- check the lakehouse' }] },
  sp,
  { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '■ ' }, { t: 'viz-mac-yellow', text: '■ ' }, { t: 'viz-success', text: '■ ' }, { t: 'brand', text: '100% SPECTRUM OPTIMIZED' }] },
];

/** `play` the arcade menu. */
export const PLAY_LINES: TerminalLine[] = [
  line('g', 'Arcade mode: ready.'),
  { t: 'm', text: 'Select a game to launch:', chips: ['play snake', 'play pong', 'play tetris', 'play space invaders'] },
];

/** `the long version` route-announce lines. */
export const LONG_VERSION_LINES: TerminalLine[] = [
  line('g', 'Accessing marginalia & after-hours records...'),
  line('muted', 'Ready to route to the-long-version.'),
];

/** Hidden easter-egg responses, keyed by command id. */
export const EGG_LINES: Record<'coffee' | 'matrix' | 'life' | 'secret' | 'salary' | 'dbt' | 'fabric', TerminalLine[]> = {
  coffee: [
    line('viz-mac-yellow', 'brew: running on it since 2018.'),
    line('muted', 'no REST API available. send the real thing to Dubai.'),
  ],
  matrix: [
    line('g', 'wake up, Neo.'),
    line('muted', 'the data pipeline was the real matrix all along.'),
    line('g', 'red pill = dbt. blue pill = Excel. choose wisely.'),
  ],
  life: [line('pu', 'life: undefined. pipelines operational. MBA in progress. send help (or coffee).')],
  secret: [line('r', 'nice try. encrypted dreams require level 10 clearance and a MSc. you might be close.')],
  salary: [
    line('m', 'connecting to market-rate.io...'),
    line('viz-success', 'result: whatever you were thinking, add 20%.'),
    line('muted', '(two distinctions, MBA in progress, no sponsorship required. do the math.)'),
  ],
  dbt: [
    line('g', 'models: compiled. tests: passing. lineage: documented.'),
    line('muted', 'sources freshness: acceptable. Justin: caffeinated. ship it.'),
  ],
  fabric: [
    line('pu', 'Microsoft Fabric: online.'),
    line('muted', 'lakehouse: mounted. KQL: sharp. eventstream: flowing.'),
    line('g', "it's not just a certification. it's a lifestyle."),
  ],
};

/** Repeat-`sudo` escalation copy (the counter itself lives in the engine). */
export const SUDO_ESCALATION: { second: TerminalLine[]; lockedOut: TerminalLine[] } = {
  second: [line('r', 'sudo: still no.'), line('muted', 'persistence noted. credentials remain: 0.')],
  lockedOut: [
    line('r', "sudo: you've been locked out."),
    line('muted', "root password hint: it's not 'password'. or 'justin'. or 'fabric'."),
    line('pu', 'IT support ticket #8080 has been filed.'),
  ],
};

/** Joke "commands" canned responses looked up by name (not real features). */
export const FUNNY_ERRORS: Record<string, TerminalLine[]> = {
  sudo: [
    line('r', "sudo: permission denied."),
    line('muted', "Justin's life choices are root-only. and honestly? fair."),
  ],
  'rm -rf': [
    line('r', "rm: cannot remove studio: target too impressive to delete."),
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
    line('b', `→ ${SITE.email}`),
    line('muted', "no sponsorship required. that's already one less problem."),
  ],
  'hire justin': [
    line('g', "outstanding choice. forwarding CV to your conscience..."),
    line('viz-success', `→ ${SITE.email} · two distinctions · ships fast`),
  ],
  'play snake': [line('g', "launching snake.exe · arrow keys · don't blame us for the lost productivity")],
  'play pong': [line('g', "launching pong.exe · paddle to the metal")],
  'play tetris': [line('g', "launching tetris.exe · don't stack overflow")],
  'play space invaders': [line('g', "launching space_invaders.exe · defend the port")],
  pwd: [line('g', `/home/${SITE.firstName.toLowerCase()}/studio · exactly where you should be.`)],
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
  'npm run dev': [line('g', `dev server running at ${SITE.domain} ↗`)],
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
    line('muted', "dbt tests: green. studio: shipped. Justin: operational."),
  ],
  mba: [
    line('viz-mac-yellow', "MBA Business Analytics · BITS Pilani, UAE · 2026–2028."),
    line('muted', "yes, he's doing it alongside full-time work. yes, he's fine. mostly."),
  ],
  dubai: [
    line('pu', "Dubai, UAE · UTC+4 · sponsorship not required (UAE)."),
    line('muted', "open to relocation. also open to remote. very flexible. very available."),
  ],
  quantum: [
    line('b', "BTech research: encryption via quantum key generation."),
    line('muted', "it was 2021. Justin was different back then. the ambition was the same."),
  ],
};

// Sidebar-click flavour text: a friendly "loading…" line per command (the
// random pick happens in the engine). resume/resumé share one pool.
const RESUME_FUN = ["Accessing CV repository... File loaded.", "Preparing PDF transmission... Secure downlink active.", "Pulling up academic + professional resumé..."];

export const SIDEBAR_FUN_MESSAGES: Record<string, string[]> = {
  resume: RESUME_FUN,
  'resumé': RESUME_FUN,
  connect: ["Accessing records... Opening communication channel.", "Initiating secure uplink... Ready to connect.", "Routing signal to Dubai headquarters... Standing by."],
  timeline: ["Querying career database... Time-machine active.", "Accessing academic records... Fast-forwarding.", "Loading interactive career timeline... Scroll-lock engaged."],
  'the long version': ["Opening the secret vault... Access granted.", "Loading marginalia & after-hours projects...", "Decoupling core engines... Navigating to the-long-version."],
  projects: ["Scanning case studies... 6 repositories found.", "Accessing studio records... Preparing scroll-link.", "Scrolling to featured work... Initiating view-port alignment."],
};

export const SIDEBAR_FUN_DEFAULT = ["Taking you there...", "Accessing records...", "Initiating sequence..."];

// Conversational preambles: the first entry whose keyword appears in the typed
// command wins (order matters), so keep broader matches lower down.
export const CONVERSATIONAL_PREAMBLES: { keywords: string[]; text: string }[] = [
  { keywords: ['project', 'ls'], text: "Ah, excellent choice! Pulling up the case study archives. Let me display the index:" },
  { keywords: ['about', 'whois', 'whoami'], text: "Certainly! Querying my identity manifest... Here is a brief profile of who I am:" },
  { keywords: ['timeline', 'career', 'experience'], text: "Querying database... I have compiled my academic and professional journey here:" },
  { keywords: ['connect', 'contact'], text: "Initiating secure uplink... Here are the official channels to get in touch with me:" },
  { keywords: ['resume', 'cv'], text: "Right away! Retrieving the latest PDF version of my CV:" },
  { keywords: ['expertise', 'skill'], text: "Scanning skill matrix... Here is a summary of my active stack and certifications:" },
  { keywords: ['snake'], text: "Warning: Retro arcade environment detected! Initiating snake.exe:" },
];

export const PREAMBLE_DEFAULT = "Processing query... Here is what I found:";

/** The Preloader's terminal-style boot log (copy, not config). */
export const BOOT_LOGS = [
  "[ OK ] [BOOT] SYSTEM_HUD V4.2 LOADED SUCCESSFULLY.",
  "[ OK ] [DATA] DBT COMPILE → 6 LAYERS RESOLVED.",
  "[ OK ] [STRM] FABRIC EVENTHOUSE LISTENING ON :443.",
  "[ INFO ] [VITE] HMR UPDATE → /SRC/INDEX.CSS (X6)",
  "[ OK ] [GPU]  FRAME BUDGET LOCKED → 16.67MS.",
  "[ OK ] [USR]  VISITOR AUTHENTICATED → SESSION OPEN.",
];
