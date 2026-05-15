/**
 * TerminalEngine.ts
 *
 * Pure logic and data for the portfolio terminal.
 * No React, no DOM, fully testable.
 *
 * Updated: resume-accurate data + enhanced personality
 */

// Semantic names (preferred, maps directly to data-term attribute values)
// Legacy shortcodes (still used in COMMANDS/FUNNY_ERRORS data - migrate gradually)
export type TerminalLineType =
  | 'muted' | 'success' | 'info' | 'brand' | 'error' | 'obscured' | 'prompt' | 'cmd' | 'edu'
  | 'viz-mac-red' | 'viz-mac-yellow' | 'viz-success'
  | 'p' | 'g' | 'b' | 'pu' | 'm' | 'o' | 'r' | 't';

export interface TerminalLine {
  t: TerminalLineType;
  text: string;
  parts?: { t: TerminalLineType; text: string }[];
}

export type SideEffectType = 'scroll' | 'snake' | 'theme' | 'download' | 'contact';

export interface CommandEffect {
  type: SideEffectType;
  payload?: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  effect?: CommandEffect;
  showPills?: boolean;
}

export const COMMANDS: Record<string, TerminalLine[]> = {

  // ─────────────────────────────────────────────
  // whoami
  // ─────────────────────────────────────────────
  whoami: [
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'IDENTITY:  ' },
        { t: 'g', text: 'Justin Clarke · Analytics Engineer · Full-Stack' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'FOCUS:     ' },
        { t: 'b', text: 'pipelines and the products they power' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'LOCATION:  ' },
        { t: 'pu', text: 'Dubai, UAE · open to relocation · no sponsorship needed' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'STACK:     ' },
        { t: 'viz-mac-yellow', text: 'Python ' },
        { t: 'viz-mac-red', text: 'SQL ' },
        { t: 'viz-success', text: 'Microsoft Fabric ' },
        { t: 'b', text: 'Power BI' },
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'IN FLIGHT: ' },
        { t: 'muted', text: 'MBA Business Analytics · PL-300 · Off the Pace' }
      ]
    },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'TRY NEXT:  ' },
        { t: 'muted', text: 'record · ls projects · expertise' }
      ]
    },
  ],

  // ─────────────────────────────────────────────
  // ls projects
  // ─────────────────────────────────────────────
  'ls projects': [
    { t: 'm', text: 'Accessing case study archive...' },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '[01] ' },
        { t: 'brand', text: 'Predictive Music Engine ' },
        { t: 'muted', text: '- python · ml · 1.2M tracks' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '[02] ' },
        { t: 'brand', text: 'LiteStore (Retail-as-a-Service) ' },
        { t: 'muted', text: '- next.js · aws · ssr' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-success', text: '[03] ' },
        { t: 'brand', text: 'Disaster Response System ' },
        { t: 'muted', text: '- mysql · relational design · philippines' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'b', text: '[04] ' },
        { t: 'brand', text: 'Behavioural Intelligence System ' },
        { t: 'muted', text: '- gemini · firestore' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '[05] ' },
        { t: 'brand', text: 'Off the Pace ' },
        { t: 'viz-mac-yellow', text: '- f1 · dbt · xgboost · in development' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'm', text: '↓ establishing scroll lock...' },
  ],

  // ─────────────────────────────────────────────
  // off the pace
  // ─────────────────────────────────────────────
  'off the pace': [
    { t: 'm', text: 'Accessing project telemetry...' },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'PROJECT:   ' },
        { t: 'g', text: 'Off the Pace Analytics' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'THESIS:    ' },
        { t: 'b', text: 'Was every F1 pit stop call actually optimal?' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'STACK:     ' },
        { t: 'muted', text: 'FastF1 · dbt · DuckDB · XGBoost · Microsoft Fabric' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'DATA:      ' },
        { t: 'muted', text: '2021 season · lap times · tyre degradation · stint models' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: 'STATUS:    ' },
        { t: 'viz-mac-yellow', text: 'IN DEVELOPMENT · sprint 1 active' }
      ]
    },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'REPO:      ' },
        { t: 'g', text: 'github.com/justinclarke/off-the-pace ↗' }
      ]
    },
  ],

  // ─────────────────────────────────────────────
  // expertise - sourced from resume tech skills
  // ─────────────────────────────────────────────
  expertise: [
    { t: 'm', text: 'Retrieving technical skill manifest...' },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'pu', text: 'ANALYTICS:   ' },
        { t: 'brand', text: 'Microsoft Fabric · Power BI · DAX · KQL · Mixpanel' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'g', text: 'LANGUAGES:   ' },
        { t: 'brand', text: 'Python · SQL · TypeScript · R' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'b', text: 'DATA:        ' },
        { t: 'brand', text: 'data modelling · KPI dev · product analytics · dashboarding' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: 'INFRA:       ' },
        { t: 'brand', text: 'PostgreSQL · AWS · Docker · REST APIs · CI/CD' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: 'CERT:        ' },
        { t: 'muted', text: 'PL-300 Power BI Data Analyst · Expected Jun 2026' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'm', text: '↓ mapping expertise pipeline...' },
  ],

  // ─────────────────────────────────────────────
  // record - resume-accurate career + education
  // ─────────────────────────────────────────────
  record: [
    { t: 'm', text: 'Querying career + academic record...' },
    { t: 'm', text: ' ' },
    { t: 'brand', text: '[ PROFESSIONAL ]' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '● ' },
        { t: 'brand', text: 'Analytics Engineer     ' },
        { t: 'b', text: 'Freelance                ' },
        { t: 'muted', text: '2024–present' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '● ' },
        { t: 'brand', text: 'Tech Lead, Full-Stack  ' },
        { t: 'b', text: 'LiteStore                ' },
        { t: 'muted', text: '2021–2023' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-success', text: '● ' },
        { t: 'brand', text: 'Frontend Developer     ' },
        { t: 'b', text: 'Drop                     ' },
        { t: 'muted', text: '2021' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'brand', text: '[ ACADEMIC ]' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '● ' },
        { t: 'brand', text: 'BITS Pilani, UAE              ' },
        { t: 'b', text: 'MBA Business Analytics   ' },
        { t: 'viz-mac-red', text: 'IN PROGRESS' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '● ' },
        { t: 'brand', text: 'Queen Mary, Univ. of London   ' },
        { t: 'b', text: 'MSc Computer Science     ' },
        { t: 'viz-success', text: 'DISTINCTION' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '● ' },
        { t: 'brand', text: 'GITAM University, India       ' },
        { t: 'b', text: 'BTech CS&E               ' },
        { t: 'viz-success', text: 'DISTINCTION' }
      ]
    },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'CERT: ' },
        { t: 'muted', text: 'PL-300 Power BI Data Analyst · ' },
        { t: 'viz-mac-yellow', text: 'Expected Jun 2026' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'm', text: '↓ scrolling to full-spectrum timeline...' },
  ],

  // ─────────────────────────────────────────────
  // help
  // ─────────────────────────────────────────────
  help: [
    { t: 'm', text: 'Available commands:' },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'record        ' }, { t: 'muted', text: '- full career & education timeline' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'ls projects   ' }, { t: 'muted', text: '- featured case studies' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'expertise     ' }, { t: 'muted', text: '- analytics + full-stack toolkit' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'whoami        ' }, { t: 'muted', text: '- identity brief' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'off the pace  ' }, { t: 'muted', text: '- f1 strategy analytics engine' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'ping me       ' }, { t: 'muted', text: '- open contact channel' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'resume        ' }, { t: 'muted', text: '- download PDF' }] },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'muted', text: 'easter eggs: ' }, { t: 'b', text: 'snake · matrix · coffee · sudo · advanced · dbt · fabric' }] },
    { t: 'm', text: ' ' },
  ],

  // ─────────────────────────────────────────────
  // advanced
  // ─────────────────────────────────────────────
  advanced: [
    { t: 'm', text: 'Loading Advanced Systems Manifest...' },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'matrix  ' }, { t: 'muted', text: '- establish telemetry' }] },
    { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'coffee  ' }, { t: 'muted', text: '- check fuel levels' }] },
    { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'sudo    ' }, { t: 'muted', text: '- root protocols' }] },
    { t: 'm', text: '', parts: [{ t: 'b', text: '● ' }, { t: 'brand', text: 'dbt     ' }, { t: 'muted', text: '- run transformations' }] },
    { t: 'm', text: '', parts: [{ t: 'pu', text: '● ' }, { t: 'brand', text: 'fabric  ' }, { t: 'muted', text: '- check the lakehouse' }] },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '■ ' },
        { t: 'viz-mac-yellow', text: '■ ' },
        { t: 'viz-success', text: '■ ' },
        { t: 'brand', text: '100% SPECTRUM OPTIMIZED' }
      ]
    },
  ],

  // ─────────────────────────────────────────────
  // ping me
  // ─────────────────────────────────────────────
  'ping me': [
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'CHANNEL:       ' }, { t: 'g', text: 'justinsavioclarke@outlook.com' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'LINKEDIN:      ' }, { t: 'g', text: 'linkedin.com/in/justinsavioclarke ↗' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'AVAILABILITY:  ' }, { t: 'viz-success', text: 'OPEN · full-time alongside MBA' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'VISA:          ' }, { t: 'muted', text: 'UAE Family Residence · no sponsorship required' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'RESPONSE TIME: ' }, { t: 'viz-mac-yellow', text: '< 24h' }] },
  ],

  // ─────────────────────────────────────────────
  // easter eggs
  // ─────────────────────────────────────────────
  coffee: [
    { t: 'viz-mac-yellow', text: 'brew: running on it since 2018.' },
    { t: 'muted', text: 'no REST API available. send the real thing to Dubai.' }
  ],

  matrix: [
    { t: 'g', text: 'wake up, Neo.' },
    { t: 'muted', text: 'the data pipeline was the real matrix all along.' },
    { t: 'g', text: 'red pill = dbt. blue pill = Excel. choose wisely.' }
  ],

  life: [{ t: 'pu', text: 'life: undefined. pipelines operational. MBA in progress. send help (or coffee).' }],

  secret: [{ t: 'r', text: 'nice try. encrypted dreams require level 10 clearance and a MSc. you might be close.' }],

  salary: [
    { t: 'm', text: 'connecting to market-rate.io...' },
    { t: 'viz-success', text: 'result: whatever you were thinking, add 20%.' },
    { t: 'muted', text: '(two distinctions, MBA in progress, no sponsorship needed. do the math.)' },
  ],

  dbt: [
    { t: 'g', text: 'models: compiled. tests: passing. lineage: documented.' },
    { t: 'muted', text: 'sources freshness: acceptable. Justin: caffeinated. ship it.' }
  ],

  fabric: [
    { t: 'pu', text: 'Microsoft Fabric: online.' },
    { t: 'muted', text: 'lakehouse: mounted. KQL: sharp. eventstream: flowing.' },
    { t: 'g', text: "it's not just a certification. it's a lifestyle." }
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNNY ERRORS - triggered on known-but-invalid commands
// ─────────────────────────────────────────────────────────────────────────────
export const FUNNY_ERRORS: Record<string, TerminalLine[]> = {
  sudo: [
    { t: 'r', text: "sudo: permission denied." },
    { t: 'muted', text: "Justin's life choices are root-only. and honestly? fair." }
  ],
  'rm -rf': [
    { t: 'r', text: "rm: cannot remove portfolio: target too impressive to delete." },
    { t: 'muted', text: "try 'ls projects' instead. much more productive." }
  ],
  'git blame': [
    { t: 'o', text: "git blame: 100% Justin Clarke." },
    { t: 'muted', text: "he commits, he ships, he owns it. no exceptions." }
  ],
  'git commit': [
    { t: 'viz-success', text: "nothing to commit. working tree clean." },
    { t: 'muted', text: "life is shipping." }
  ],
  vim: [
    { t: 'r', text: "vim: opened successfully." },
    { t: 'muted', text: "good luck getting out. we'll be here. (hint: :q!)" }
  ],
  emacs: [{ t: 'r', text: "emacs: Justin uses VS Code. this isn't 1991." }],
  excel: [
    { t: 'viz-mac-yellow', text: "Excel: recognised. respected. surpassed." },
    { t: 'muted', text: "Power BI, SQL, and Python exist for a reason. type 'expertise'." }
  ],
  hire: [
    { t: 'g', text: "redirecting to good-decision-making.exe..." },
    { t: 'b', text: "→ justinsavioclarke@outlook.com" },
    { t: 'muted', text: "no sponsorship required. that's already one less problem." }
  ],
  'hire justin': [
    { t: 'g', text: "outstanding choice. forwarding CV to your conscience..." },
    { t: 'viz-success', text: "→ justinsavioclarke@outlook.com · two distinctions · ships fast" }
  ],
  'play snake': [{ t: 'g', text: "launching snake.exe · arrow keys · don't blame us for the lost productivity" }],
  pwd: [{ t: 'g', text: "/home/justin/portfolio · exactly where you should be." }],
  exit: [
    { t: 'r', text: "exit: blocked." },
    { t: 'muted', text: "you haven't seen the projects yet. scroll first." }
  ],
  quit: [
    { t: 'r', text: "quit: not yet." },
    { t: 'muted', text: "Off the Pace is in development. the good part is coming." }
  ],
  hello: [{ t: 'g', text: "hello to you too. type 'help' if you're lost. type 'whoami' if you're curious." }],
  hi: [{ t: 'g', text: "hey 👋  type 'help' to get oriented. or just start exploring." }],
  ls: [{ t: 'b', text: "too vague. try 'ls projects' - that's where the interesting stuff lives." }],
  cat: [{ t: 'b', text: "try 'cat about.txt' or just type 'whoami'. same energy, better output." }],
  'npm install': [
    { t: 'viz-success', text: "already installed. Justin ships production-ready, not localhost." },
    { t: 'muted', text: "0 vulnerabilities. 0 regrets." }
  ],
  'npm run dev': [{ t: 'g', text: "dev server running at justinclarke.github.io ↗" }],
  python: [
    { t: 'g', text: "Python 3.11 detected · pandas · numpy · scikit-learn · fastf1 loaded." },
    { t: 'muted', text: "currently training an XGBoost model to embarrass F1 strategists." }
  ],
  node: [{ t: 'g', text: "Node v20 · TypeScript · Next.js standing by. LiteStore ran on this. it survived." }],
  curl: [
    { t: 'b', text: "curl: (200) OK · 0.6s LCP · SSR + edge caching." },
    { t: 'muted', text: "down from 3.0s. Justin did that." }
  ],
  fabric: [
    { t: 'g', text: "Microsoft Fabric: Justin's primary technical pillar." },
    { t: 'muted', text: "Eventhouse · KQL · Eventstream · Lakehouse. not a buzzword. a stack." }
  ],
  power_bi: [
    { t: 'b', text: "Power BI: PL-300 inbound. June 2026." },
    { t: 'muted', text: "DAX is not a dark art. it's just misunderstood." }
  ],
  whoops: [{ t: 'o', text: "it happens. type 'help' and we'll get you back on track." }],
  test: [
    { t: 'viz-success', text: "test suite: all passing." },
    { t: 'muted', text: "dbt tests: green. portfolio: shipped. Justin: operational." }
  ],
  mba: [
    { t: 'viz-mac-yellow', text: "MBA Business Analytics · BITS Pilani, UAE · 2026–2028." },
    { t: 'muted', text: "yes, he's doing it alongside full-time work. yes, he's fine. mostly." }
  ],
  dubai: [
    { t: 'pu', text: "Dubai, UAE · UTC+4 · no sponsorship required." },
    { t: 'muted', text: "open to relocation. also open to remote. very flexible. very available." }
  ],
  quantum: [
    { t: 'b', text: "BTech research: encryption via quantum key generation." },
    { t: 'muted', text: "it was 2021. Justin was different back then. the ambition was the same." }
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// resolveCommand - pure function, no side effects
// ─────────────────────────────────────────────────────────────────────────────
export function resolveCommand(raw: string): CommandResult {
  const cmd = raw.trim().toLowerCase();

  // ── Hard-wired effects ──────────────────────────────────────────────────
  if (cmd === 'clear') {
    return { lines: [] };
  }

  if (cmd === 'play snake' || cmd === 'playsnake' || cmd === 'snake') {
    return { lines: [], effect: { type: 'snake' } };
  }

  if (cmd === 'theme' || cmd === 'theme toggle') {
    return { lines: [{ t: 'g', text: 'theme toggled.' }], effect: { type: 'theme' } };
  }

  if (cmd === 'resume' || cmd === 'download') {
    return { lines: [], effect: { type: 'download' } };
  }

  if (cmd === 'ping me' || cmd === 'contact') {
    return { lines: COMMANDS['ping me'], effect: { type: 'contact' } };
  }

  // hire triggers contact effect too
  if (cmd === 'hire' || cmd === 'hire justin') {
    return { lines: FUNNY_ERRORS[cmd] || [], effect: { type: 'contact' } };
  }

  // ── Scroll-linked commands ──────────────────────────────────────────────
  if (cmd === 'ls projects' || cmd === 'projects' || cmd === 'ls') {
    return { lines: COMMANDS['ls projects'], effect: { type: 'scroll', payload: 'projects' } };
  }

  if (cmd === 'expertise' || cmd === 'skills' || cmd === 'stack') {
    return { lines: COMMANDS['expertise'], effect: { type: 'scroll', payload: 'expertise' } };
  }

  if (
    cmd === 'record' || cmd === 'experience' || cmd === 'education' ||
    cmd === 'history' || cmd === 'timeline' || cmd === 'career'
  ) {
    return { lines: COMMANDS['record'], effect: { type: 'scroll', payload: 'experience' } };
  }

  // ── Command map exact matches ───────────────────────────────────────────
  if (COMMANDS[cmd]) {
    return {
      lines: COMMANDS[cmd],
      showPills: cmd === 'help'
    };
  }

  // ── Funny error exact/prefix matches ───────────────────────────────────
  for (const key of Object.keys(FUNNY_ERRORS)) {
    if (cmd === key || cmd.startsWith(key + ' ')) {
      return { lines: FUNNY_ERRORS[key] };
    }
  }

  // ── Intelligent guesses ─────────────────────────────────────────────────
  const guesses: TerminalLine[] = [];
  if (cmd.includes('project') || cmd.includes('work') || cmd.includes('case')) guesses.push({ t: 'o', text: "→ try 'ls projects'" });
  if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('tool')) guesses.push({ t: 'o', text: "→ try 'expertise'" });
  if (cmd.includes('job') || cmd.includes('career') || cmd.includes('cv') || cmd.includes('résumé')) guesses.push({ t: 'o', text: "→ try 'record' or 'resume'" });
  if (cmd.includes('degree') || cmd.includes('study') || cmd.includes('uni')) guesses.push({ t: 'o', text: "→ try 'record'" });
  if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('dm')) guesses.push({ t: 'o', text: "→ try 'ping me'" });
  if (cmd.includes('f1') || cmd.includes('formula') || cmd.includes('race')) guesses.push({ t: 'o', text: "→ try 'off the pace'" });
  if (cmd.includes('music') || cmd.includes('spotify') || cmd.includes('track')) guesses.push({ t: 'o', text: "→ try 'ls projects' → Predictive Music Engine" });

  if (guesses.length > 0) {
    return {
      lines: [
        { t: 'r', text: `command not found: ${raw.trim()}` },
        ...guesses
      ]
    };
  }

  // ── Default fallback ────────────────────────────────────────────────────
  return {
    lines: [
      { t: 'r', text: `command not found: ${raw.trim()}` },
      { t: 'm', text: "type 'help' to see what's available." }
    ]
  };
}