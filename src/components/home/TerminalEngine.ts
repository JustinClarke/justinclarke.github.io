/**
 * TerminalEngine.ts
 * 
 * Pure logic and data for the portfolio terminal.
 * No React, no DOM, fully testable.
 */

// Semantic names (preferred, maps directly to data-term attribute values)
// Legacy shortcodes (still used in COMMANDS/FUNNY_ERRORS data — migrate gradually)
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
  payload?: any;
}

export interface CommandResult {
  lines: TerminalLine[];
  effect?: CommandEffect;
  showPills?: boolean;
}

export const COMMANDS: Record<string, TerminalLine[]> = {
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
        { t: 'b', text: 'pipelines and the product they power' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'brand', text: 'LOCATION:  ' },
        { t: 'pu', text: 'Dubai, UAE · open to relocation' }
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
        { t: 'muted', text: 'MBA Business Analytics · PL-300 cert' }
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
  'ls projects': [
    { t: 'm', text: 'Accessing case study archive...' },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '[01] ' },
        { t: 'brand', text: 'Predictive Music Engine ' },
        { t: 'muted', text: '— python · ml · 1.2M tracks' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '[02] ' },
        { t: 'brand', text: 'LiteStore (Retail-as-a-Service) ' },
        { t: 'muted', text: '— next.js · aws · ssr' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-success', text: '[03] ' },
        { t: 'brand', text: 'Disaster Response System ' },
        { t: 'muted', text: '— mysql · relational design' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'b', text: '[04] ' },
        { t: 'brand', text: 'Behavioural Intelligence System ' },
        { t: 'muted', text: '— gemini · firestore' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'm', text: '↓ establishing scroll lock...' },
  ],
  expertise: [
    { t: 'm', text: 'Retrieving technical skill manifest...' },
    { t: 'm', text: ' ' },
    {
      t: 'm', text: '', parts: [
        { t: 'pu', text: 'ANALYTICS_BI: ' },
        { t: 'brand', text: 'Microsoft Fabric · Power BI · KQL · ML/Stats' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'g', text: 'DATA_LANG: ' },
        { t: 'brand', text: 'Python · SQL · TypeScript · R' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'b', text: 'INFRA: ' },
        { t: 'brand', text: 'Azure · AWS · Vercel · CI/CD' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'm', text: '↓ mapping expertise pipeline...' },
  ], 
  record: [
    { t: 'm', text: 'Querying career + scholastic record...' },
    { t: 'm', text: ' ' },
    { t: 'brand', text: '[ PROFESSIONAL ]' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '● ' },
        { t: 'brand', text: 'VNS Solutions    ' },
        { t: 'b', text: 'Analytics Engineer       ' },
        { t: 'muted', text: '2024–2026' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-yellow', text: '● ' },
        { t: 'brand', text: 'LiteStore        ' },
        { t: 'b', text: 'Tech Lead, Full-Stack    ' },
        { t: 'muted', text: '2021–2023' }
      ]
    },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-success', text: '● ' },
        { t: 'brand', text: 'Drop             ' },
        { t: 'b', text: 'Frontend Developer       ' },
        { t: 'muted', text: '2021' }
      ]
    },
    { t: 'm', text: ' ' },
    { t: 'brand', text: '[ SCHOLASTIC ]' },
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
        { t: 'b', text: 'MSc Computer Science     ' }
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
  help: [
    { t: 'm', text: 'Available commands:' },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'record' }, { t: 'muted', text: ' — full career & education timeline' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'ls projects' }, { t: 'muted', text: ' — featured case studies' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'expertise' }, { t: 'muted', text: ' — analytics + full-stack toolkit' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'whoami' }, { t: 'muted', text: ' — identity brief' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'ping me' }, { t: 'muted', text: ' — open contact channel' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'resume' }, { t: 'muted', text: ' — download PDF' }] },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'muted', text: 'easter eggs: ' }, { t: 'b', text: 'snake · matrix · coffee · sudo · advanced' }] },
    { t: 'm', text: ' ' },
  ],
  advanced: [
    { t: 'm', text: 'Loading Advanced Systems Manifest...' },
    { t: 'm', text: ' ' },
    { t: 'm', text: '', parts: [{ t: 'viz-mac-red', text: '● ' }, { t: 'brand', text: 'matrix' }, { t: 'muted', text: ' — establish telemetry' }] },
    { t: 'm', text: '', parts: [{ t: 'viz-mac-yellow', text: '● ' }, { t: 'brand', text: 'coffee' }, { t: 'muted', text: ' — check fuel' }] },
    { t: 'm', text: '', parts: [{ t: 'viz-success', text: '● ' }, { t: 'brand', text: 'sudo' }, { t: 'muted', text: ' — root protocols' }] },
    { t: 'm', text: ' ' },
    { t: 'm', text: 'Neural net status: ' },
    {
      t: 'm', text: '', parts: [
        { t: 'viz-mac-red', text: '■ ' },
        { t: 'viz-mac-yellow', text: '■ ' },
        { t: 'viz-success', text: '■ ' },
        { t: 'brand', text: '100% SPECTRUM OPTIMIZED' }
      ]
    },
  ],
  'ping me': [
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'Channel: ' }, { t: 'g', text: 'justinsavioclarke@outlook.com' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'Availability: ' }, { t: 'viz-success', text: 'OPEN' }] },
    { t: 'm', text: '', parts: [{ t: 'brand', text: 'Response Time: ' }, { t: 'viz-mac-yellow', text: '< 24h' }] },
  ],
  coffee: [{ t: 'm', text: 'brew: Justin runs on it. No API available. Send the real thing.' }],
  matrix: [{ t: 'g', text: 'wake up, Neo. your data pipeline is the real matrix.' }],
  life: [{ t: 'pu', text: 'life: undefined. but the pipelines are working fine.' }],
  secret: [{ t: 'r', text: 'Nice try, Agent. Access to encrypted dreams requires level 10 clearance.' }],
  salary: [
    { t: 'm', text: 'Redirecting to bank-of-imagination.com...' },
    { t: 'r', text: 'Error: Balance too high to display in a terminal.' },
  ],
};

export const FUNNY_ERRORS: Record<string, TerminalLine[]> = {
  sudo: [{ t: 'r', text: "Permission denied. Justin's life choices are root-only." }],
  'rm -rf': [{ t: 'r', text: "rm: cannot remove portfolio: it's too good to delete." }],
  'git blame': [{ t: 'o', text: "100% Justin. He commits, he ships, he takes the blame." }],
  'git commit': [{ t: 'm', text: "nothing to commit. working tree clean. life is shipping." }],
  vim: [{ t: 'r', text: "vim opened. good luck exiting. we'll be here. :q!" }],
  emacs: [{ t: 'r', text: "emacs: Justin uses VS Code. This isn't the 90s." }],
  hire: [
    { t: 'g', text: "redirecting to good-decision-making.exe..." },
    { t: 'b', text: "→ justinsavioclarke@outlook.com · he's available" }
  ],
  'hire justin': [
    { t: 'g', text: "outstanding choice. forwarding CV to your conscience..." },
    { t: 'b', text: "→ justinsavioclarke@outlook.com" }
  ],
  'play snake': [{ t: 'g', text: "launching snake.exe · use arrow keys · don't blame us" }],
  pwd: [{ t: 'g', text: "/home/justin/portfolio · exactly where you should be." }],
  exit: [{ t: 'r', text: "exit: nice try. scroll down first." }],
  quit: [{ t: 'r', text: "quit: not yet. you haven't seen the projects." }],
  hello: [{ t: 'g', text: "hello to you too. type 'help' if you're lost." }],
  hi: [{ t: 'g', text: "hey 👋 type 'help' · or just vibe with the neural net." }],
  ls: [{ t: 'b', text: "too vague. try 'ls projects' — it's the good stuff." }],
  cat: [{ t: 'b', text: "cat: try 'cat expertise' if you want the full manifest." }],
  'npm install': [{ t: 'm', text: "already installed. Justin ships production-ready, not localhost." }],
  'npm run dev': [{ t: 'g', text: "dev server running at justinclarke.github.io ↗" }],
  python: [
    { t: 'g', text: "Python 3.11 · pandas · numpy · scikit-learn all loaded." },
    { t: 'm', text: "see Projects → Neural Music Engine for proof." }
  ],
  node: [{ t: 'g', text: "Node.js v20 · TypeScript · Next.js standing by." }],
  curl: [{ t: 'b', text: "curl: (200) OK · 0.6s · portfolio is up and running." }],
  fabric: [{ t: 'g', text: "Microsoft Fabric: Justin's primary technical pillar. High-scale data architecture & intelligence." }],
  whoops: [{ t: 'o', text: "it happens. type 'help' and we'll get you back on track." }],
  test: [{ t: 'm', text: "test: all systems passing. portfolio: 100% shipped." }],
};

export function resolveCommand(raw: string): CommandResult {
  const cmd = raw.trim().toLowerCase();

  // 1. Exact matches for effects
  if (cmd === 'clear') {
    return { lines: [] }; // Handle clear specially in UI
  }

  if (cmd === 'play snake' || cmd === 'playsnake' || cmd === 'snake') {
    return { lines: [], effect: { type: 'snake' } };
  }

  if (cmd === 'theme' || cmd === 'theme toggle') {
    return { lines: [{ t: 'g', text: 'Theme toggled.' }], effect: { type: 'theme' } };
  }

  if (cmd === 'resume' || cmd === 'download') {
    return { lines: [], effect: { type: 'download' } };
  }

  if (cmd === 'ping me' || cmd === 'hire' || cmd === 'hire justin') {
    return { lines: COMMANDS[cmd] || [], effect: { type: 'contact' } };
  }

  // 2. Exact matches for scrolling
  if (cmd === 'ls projects') {
    return { lines: COMMANDS[cmd], effect: { type: 'scroll', payload: 'projects' } };
  }
  if (cmd === 'expertise') {
    return { lines: COMMANDS[cmd], effect: { type: 'scroll', payload: 'expertise' } };
  }
  if (cmd === 'record' || cmd === 'experience' || cmd === 'education' || cmd === 'history' || cmd === 'timeline') {
    return { lines: COMMANDS['record'], effect: { type: 'scroll', payload: 'experience' } };
  }

  // 3. Command map matches
  if (COMMANDS[cmd]) {
    return {
      lines: COMMANDS[cmd],
      showPills: cmd === 'help'
    };
  }

  // 4. Funny error matches
  for (const key of Object.keys(FUNNY_ERRORS)) {
    if (cmd === key || cmd.startsWith(key + ' ')) {
      return { lines: FUNNY_ERRORS[key] };
    }
  }

  // 5. Intelligent guesses
  const guesses: TerminalLine[] = [];
  if (cmd.includes('project') || cmd.includes('work')) guesses.push({ t: 'o', text: "→ try 'ls projects'" });
  if (cmd.includes('skill') || cmd.includes('tech')) guesses.push({ t: 'o', text: "→ try 'expertise'" });
  if (cmd.includes('job') || cmd.includes('career')) guesses.push({ t: 'o', text: "→ try 'experience'" });
  if (cmd.includes('degree') || cmd.includes('study')) guesses.push({ t: 'o', text: "→ try 'education'" });
  if (cmd.includes('contact') || cmd.includes('email')) guesses.push({ t: 'o', text: "→ try 'ping me'" });

  if (guesses.length > 0) {
    return {
      lines: [
        { t: 'r', text: `command not found: ${raw.trim()}` },
        ...guesses
      ]
    };
  }

  return {
    lines: [
      { t: 'r', text: `command not found: ${raw.trim()}` },
      { t: 'm', text: "type 'help' · or just start scrolling." }
    ]
  };
}
