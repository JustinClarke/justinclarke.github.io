import React, { useEffect, useRef, useState, useCallback } from 'react';
import { elevatorScroll } from '@/shared/utils/scroll';
import { useModal } from '@/providers/ModalProvider';
import { SnakeGame } from './SnakeGame';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils';

/**
 * HeroSection Component
 * 
 * Features a high-fidelity interactive terminal and a dynamic neural-network background.
 * Part of the "Mac HUD" aesthetic system.
 */

/* ── Static data (outside component to avoid re-creation) ── */

type TerminalLine = { t: string; text: string };
type CommandMap = Record<string, TerminalLine[]>;

const COMMANDS: CommandMap = {
  whoami: [
    { t: 'g', text: 'Justin Clarke. Not an AI. Mostly.' },
    { t: 'b', text: 'Data Analyst · Full-Stack Engineer · Microsoft Fabric specialist' },
    { t: 'pu', text: 'Based in Dubai · Works with data that actually moves things' },
    { t: 'm', text: 'Speaks fluent Python, KQL, and sarcasm' },
    { t: 'b', text: 'justinclarke.github.io · justinsavioclarke@outlook.com' },
  ],
  'ls projects': [
    { t: 'm', text: '4 projects. All shipped. None abandoned at 80%.' },
    { t: 'g', text: '  [01] Customer Lifetime Value Analytics    fabric · kql · power bi' },
    { t: 'b', text: '  [02] Neural Music Engine                 python · ml · spotify api' },
    { t: 'pu', text: '  [03] Retail as a Service                 next.js · aws · vercel' },
    { t: 'b', text: '  [04] Product Telemetry Intelligence      fabric · data pipelines' },
    { t: 'm', text: '↓ scrolling to projects...' },
  ],
  expertise: [
    { t: 'm', text: 'The stack. All of it. Yes, including the design stuff.' },
    { t: 'g', text: '  [01] Languages    Python · SQL · TypeScript · R · C++' },
    { t: 'b', text: '  [02] Cloud        Fabric · Azure · Next.js · Vercel · AWS' },
    { t: 'pu', text: '  [03] Analytics   Power BI · KQL · DAX · MongoDB · ML/Stats' },
    { t: 'b', text: '  [04] Design       Figma · Adobe CC · UI/UX · Photography' },
    { t: 'm', text: '↓ scrolling to expertise...' },
  ],
  experience: [
    { t: 'm', text: 'Three roles. Increasing responsibility. No drama.' },
    { t: 'g', text: '  VNS Solutions    Product Developer        Jan 2024 – Jan 2026' },
    { t: 'b', text: '  LiteStore        Technical Lead           Apr 2021 – Apr 2023' },
    { t: 'pu', text: '  Drop             Frontend Developer       Jan 2021 – Apr 2021' },
    { t: 'm', text: '↓ scrolling to experience...' },
  ],
  education: [
    { t: 'm', text: 'Three institutions. One Distinction. Zero regrets about the reading lists.' },
    { t: 'g', text: '  BITS Pilani      MBA Business Analytics   2026–2028 · active' },
    { t: 'b', text: '  Queen Mary       MSc Computer Science     2022–2023 · Distinction' },
    { t: 'pu', text: '  GITAM            B.Tech Comp. Sci.        2018–2022' },
    { t: 'm', text: '↓ scrolling to education...' },
  ],
  'ping me': [
    { t: 'm', text: 'PING justinsavioclarke@outlook.com (open to offers)' },
    { t: 'g', text: '64 bytes: availability=open · coffee=yes · remote=happy' },
    { t: 'g', text: '→ justinsavioclarke@outlook.com' },
    { t: 'g', text: '→ linkedin.com/in/justinsavioclarke' },
  ],
  help: [
    { t: 'm', text: 'available commands:' },
    { t: 't', text: '  whoami' },
    { t: 'b', text: '  ↳ the human behind the pipelines' },
    { t: 't', text: '  snake' },
    { t: 'g', text: '  ↳ a retro classic · play now' },
    { t: 't', text: '  ping me' },
    { t: 'b', text: '  ↳ open · available · responsive' },
    { t: 't', text: '  advanced' },
    { t: 'b', text: '  ↳ reveal management modules' },
    { t: 't', text: '  clear' },
    { t: 'b', text: '  ↳ clean slate' },
    { t: 'm', text: '\u00a0' },
  ],
  advanced: [
    { t: 'm', text: 'Advanced Systems Manifest — Experimental:' },
    { t: 't', text: '  play snake' },
    { t: 'b', text: '  ↳ launch terminal logic game' },
    { t: 't', text: '  matrix' },
    { t: 'b', text: '  ↳ establish telemetry loop' },
    { t: 't', text: '  coffee' },
    { t: 'b', text: '  ↳ check caffeine levels' },
    { t: 't', text: '  git blame' },
    { t: 'b', text: '  ↳ automated audit logs' },
    { t: 't', text: '  sudo' },
    { t: 'b', text: '  ↳ restricted protocols' },
    { t: 't', text: '  vim' },
    { t: 'b', text: '  ↳ entering the black hole' },
    { t: 'm', text: '\u00a0' },
    { t: 'm', text: 'Neural net status: 100% monochrome compliant.' },
  ],
  coffee: [
    { t: 'm', text: 'brew: Justin runs on it. No API available. Send the real thing.' },
  ],
  matrix: [
    { t: 'g', text: 'wake up, Neo. your data pipeline is the real matrix.' },
  ],
  life: [
    { t: 'pu', text: 'life: undefined. but the pipelines are working fine.' },
  ],
  secret: [
    { t: 'r', text: 'Nice try, Agent. Access to encrypted dreams requires level 10 clearance.' },
  ],
  salary: [
    { t: 'm', text: 'Redirecting to bank-of-imagination.com...' },
    { t: 'r', text: 'Error: Balance too high to display in a terminal.' },
  ],
};

type FunnyError = { t: string; text: string };
type FunnyErrorMap = Record<string, FunnyError[]>;

const FUNNY_ERRORS: FunnyErrorMap = {
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
  matrix: [{ t: 'g', text: "wake up, Neo. your data pipeline is the real matrix." }],
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
  fabric: [{ t: 'g', text: "Microsoft Fabric: Justin's main character. → see Projects" }],
  whoops: [{ t: 'o', text: "it happens. type 'help' and we'll get you back on track." }],
  test: [{ t: 'm', text: "test: all systems passing. portfolio: 100% shipped." }],
  life: [{ t: 'pu', text: "life: undefined. but the pipelines are working fine." }],
};

const BRAND_COLORS = [
  'var(--color-brand-primary)',
  'var(--color-acc-cloud)',
  'var(--color-acc-bi)',
  'var(--color-acc-creative)',
  '#38BDF8', // Sky 400
  '#00FFD1'  // Vibrant Aqua
];

/* ── Component ── */

export const HeroSection: React.FC = () => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);
  const nn1Ref = useRef<HTMLCanvasElement>(null);
  const nn2Ref = useRef<HTMLCanvasElement>(null);

  const { setIsContactModalOpen } = useModal();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasStartedBoot, setHasStartedBoot] = useState(false); // Track if boot sequence has ever started


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [booted, setBooted] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [terminalText, setTerminalText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const hasBootedRef = useRef(false);

  // --- Terminal output helpers ---
  const addLine = useCallback((cls: string, label: string, text: string) => {
    if (!outRef.current) return;
    const d = document.createElement('div');
    // Using utility classes for the line container
    const typeClasses: Record<string, string> = {
      p: 'term-p',
      t: 'term-t',
      r: 'term-r',
      g: 'term-g',
      b: 'term-b',
      m: 'term-m',
      o: 'term-o',
      cmd: 'term-cmd'
    };

    const clsApplied = typeClasses[cls] || '';
    const labelCls = typeClasses['p'];

    d.innerHTML = `<span class="${labelCls}">${label}</span><span class="${clsApplied}">${text}</span>`;
    outRef.current.appendChild(d);
    outRef.current.scrollTop = outRef.current.scrollHeight;
  }, []);

  const addComplexLine = useCallback((parts: { t: string; text: string }[], label: string) => {
    if (!outRef.current) return;
    const d = document.createElement('div');
    const typeClasses: Record<string, string> = {
      p: 'term-p',
      t: 'term-t',
      r: 'term-r',
      g: 'term-g',
      b: 'term-b',
      m: 'term-m',
      o: 'term-o',
      cmd: 'term-cmd'
    };

    let content = `<span class="term-p">${label}</span>`;
    parts.forEach(p => {
      const cls = typeClasses[p.t] || '';
      content += `<span class="${cls}">${p.text}</span>`;
    });
    d.innerHTML = content;
    outRef.current.appendChild(d);
    outRef.current.scrollTop = outRef.current.scrollHeight;
  }, []);

  const addTypedLine = useCallback((cls: string, label: string, text: string, speed = 8) => {
    return new Promise<void>((resolve) => {
      if (!outRef.current) return resolve();
      const d = document.createElement('div');
      const typeClasses: Record<string, string> = {
        p: 'term-p',
        t: 'term-t',
        r: 'term-r',
        g: 'term-g',
        b: 'term-b',
        m: 'term-m',
        o: 'term-o',
        cmd: 'term-cmd'
      };

      const labelCls = 'term-p';
      const textCls = typeClasses[cls] || '';

      d.innerHTML = `<span class="${labelCls}">${label}</span><span class="${textCls} ${cls}"></span>`;
      outRef.current.appendChild(d);
      const span = d.querySelector(`.${cls}`) as HTMLElement;
      let i = 0;
      const interval = setInterval(() => {
        if (!span) { clearInterval(interval); return resolve(); }
        span.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
        if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
      }, speed);
    });
  }, []);

  const addTypedComplexLine = useCallback((parts: { t: string; text: string }[], label: string, speed = 8) => {
    return new Promise<void>(async (resolve) => {
      if (!outRef.current) return resolve();
      const d = document.createElement('div');
      d.className = 'flex gap-2 font-ibm text-[13.5px] leading-relaxed whitespace-pre-wrap break-all transition-colors duration-300 mb-0.5 term-line';
      d.innerHTML = `<span class="term-p">${label}</span>`;
      outRef.current.appendChild(d);

      const typeClasses: Record<string, string> = {
        p: 'term-p',
        t: 'term-t',
        r: 'term-r',
        g: 'term-g',
        b: 'term-b',
        m: 'term-m',
        o: 'term-o',
        cmd: 'term-cmd'
      };

      for (const part of parts) {
        const cls = typeClasses[part.t] || '';
        const span = document.createElement('span');
        span.className = cls;
        d.appendChild(span);

        await new Promise<void>((res) => {
          let i = 0;
          const interval = setInterval(() => {
            span.textContent += part.text[i];
            i++;
            if (i >= part.text.length) {
              clearInterval(interval);
              res();
            }
            if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
          }, speed);
        });
      }
      resolve();
    });
  }, []);

  const addCmdLine = useCallback((cmd: string) => {
    addLine('cmd', '~$', ' ' + cmd);
  }, [addLine]);

  // --- Command runner ---
  const runCmd = useCallback(async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    addCmdLine(raw.trim());

    // --- Clear ---
    if (cmd === 'clear') {
      setActiveGame(null);
      setTimeout(() => { if (outRef.current) outRef.current.innerHTML = ''; }, 100);
      return;
    }

    // --- Navigation commands ---
    if (cmd === 'ls projects') {
      setTimeout(() => elevatorScroll('projects', 1.8, 100), 800);
    } else if (cmd === 'expertise') {
      setTimeout(() => elevatorScroll('expertise', 1.8, 100), 800);
    } else if (cmd === 'play snake' || cmd === 'playsnake' || cmd === 'snake') {
      if (window.innerWidth < 1024) {
        addLine('r', '  ', 'Error: Snake_OS is optimized for Desktop environments.');
        addLine('o', '  ', '→ Use a device with a physical keyboard (1024px+ width) to play.');
        return;
      }
      await addTypedLine('g', '\u00a0\u00a0', 'Initializing Snake_OS...', 25);
      setTimeout(() => {
        if (outRef.current) outRef.current.innerHTML = '';
        setActiveGame('snake');
      }, 800);
      return;
    } else if (cmd === 'theme' || cmd === 'theme toggle') {
      setIsDark(prev => !prev);
      addLine('g', '\u00a0\u00a0', 'Theme toggled.');
      return;
    } else if (cmd === 'experience') {
      setTimeout(() => elevatorScroll('experience', 1.8, 100), 800);
    } else if (cmd === 'education') {
      setTimeout(() => elevatorScroll('education', 1.8, 100), 800);
    } else if (cmd === 'ping me' || cmd === 'hire' || cmd === 'hire justin') {
      setTimeout(() => elevatorScroll('contact', 1.8, 100), 800);
    } else if (cmd === 'resume' || cmd === 'download') {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '/resources/Justin_Clarke_Resume.pdf';
        link.download = 'Justin_Clarke_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1200);
    }

    // --- Known commands ---
    const cmdLines = COMMANDS[cmd];
    if (cmdLines && cmdLines.length > 0) {
      for (const line of cmdLines) {
        if ((line as any).parts) {
          await addTypedComplexLine((line as any).parts, '\u00a0\u00a0', 6);
        } else {
          await addTypedLine(line.t, '\u00a0\u00a0', line.text, 6);
        }
      }
      if (cmd === 'help') {
        setPillsVisible(true);
      }
      return;
    }
    // Silent commands already handled above
    if (cmd in COMMANDS) return;

    // --- Funny errors ---
    for (const key of Object.keys(FUNNY_ERRORS)) {
      if (cmd === key || cmd.startsWith(key + ' ')) {
        const lines = FUNNY_ERRORS[key];
        for (const line of lines) {
          await addTypedLine(line.t, '\u00a0\u00a0', line.text, 10);
        }
        return;
      }
    }

    // --- Fuzzy suggestions ---
    const guesses: { t: string; text: string }[] = [];
    if (cmd.includes('project') || cmd.includes('work'))
      guesses.push({ t: 'o', text: "→ try 'ls projects'" });
    if (cmd.includes('skill') || cmd.includes('tech'))
      guesses.push({ t: 'o', text: "→ try 'expertise'" });
    if (cmd.includes('job') || cmd.includes('career'))
      guesses.push({ t: 'o', text: "→ try 'experience'" });
    if (cmd.includes('degree') || cmd.includes('study'))
      guesses.push({ t: 'o', text: "→ try 'education'" });
    if (cmd.includes('contact') || cmd.includes('email'))
      guesses.push({ t: 'o', text: "→ try 'ping me'" });

    if (guesses.length > 0) {
      addLine('r', '\u00a0\u00a0', `command not found: ${raw.trim()}`);
      for (const g of guesses) {
        await addTypedLine(g.t, '\u00a0\u00a0', g.text, 5);
      }
    } else {
      addLine('r', '\u00a0\u00a0', `command not found: ${raw.trim()}`);
      setTimeout(() => addLine('m', '\u00a0\u00a0', "type 'help' · or just start scrolling."), 140);
    }
  }, [addLine, addCmdLine, addTypedLine]);

  // --- Canvas neural-net animations ---
  useEffect(() => {
    const controllers: { stop: () => void }[] = [];

    const drawNN = (ctx: CanvasRenderingContext2D, nodes: { x: number; y: number; vx: number; vy: number; c: string }[], dark: boolean) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      nodes.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > ctx.canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > ctx.canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.1;
        ctx.fill();
      });

      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = (1 - dist / 100) * (dark ? 0.8 : 0.6);
            ctx.stroke();
          }
        }
      }
    };

    const initCanvas = (canvas: HTMLCanvasElement, n: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return;
      canvas.width = r.width;
      canvas.height = r.height;
      const nodes = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        c: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      }));

      let running = true;
      const loop = () => {
        if (!running) return;
        drawNN(ctx, nodes, isDark);
        requestAnimationFrame(loop);
      };
      loop();
      controllers.push({ stop: () => { running = false; } });
    };

    if (nn1Ref.current) initCanvas(nn1Ref.current, 20);
    if (nn2Ref.current) initCanvas(nn2Ref.current, 40);

    return () => {
      controllers.forEach(c => c.stop());
    };
  }, [isDark, isMobile, isTerminalOpen]);

  // --- Boot sequence (runs once when terminal is first visible) ---
  useEffect(() => {
    // Synchronous ref guard is the only reliable way to prevent double-execution in Strict Mode
    const shouldShow = !isMobile || isTerminalOpen;
    if (hasBootedRef.current || !shouldShow) return;

    hasBootedRef.current = true;
    setHasStartedBoot(true);

    const boot = async () => {
      await new Promise(r => setTimeout(r, 600));
      await addTypedLine('m', '>', ' neural_link_v4.0 initializing...', 15);
      await addTypedLine('g', '>', ' portfolio loaded · all systems nominal', 10);
      await addTypedComplexLine([{ t: 'm', text: ' type ' }, { t: 't', text: 'help' }, { t: 'm', text: ' or a command below' }], '>', 10);
      await new Promise(r => setTimeout(r, 400));

      const ql = [
        { c: 'whoami', d: 'the human behind the pipelines' },
        { c: 'snake', d: 'a retro classic · play now' },
        { c: 'ping me', d: 'open · available · responsive' },
        { c: 'advanced', d: 'reveal more commands' },
        { c: 'clear', d: 'clean slate' }
      ];
      for (const item of ql) {
        await addTypedLine('t', '\u00a0\u00a0', `  ${item.c}`, 5);
        await addTypedLine('b', '\u00a0\u00a0', `  ↳ ${item.d}`, 5);
      }

      setPillsVisible(true);
      setBooted(true);
      setTimeout(() => inpRef.current?.focus(), 100);
    };

    boot();
  }, [addTypedLine, addCmdLine, isMobile, isTerminalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setTerminalText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      setInputValue('');
      setTerminalText('');
      runCmd(cmd);
    }
  };

  // --- Tailwind Migration Constants ---
  const containerClasses = cn(
    "relative flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden transition-colors duration-500",
    "lg:px-12 xl:px-20", // Additional desktop padding
    isDark
      ? "bg-brand-bg bg-[radial-gradient(rgba(255,255,255,0.05)_0.8px,transparent_0.8px)] bg-[length:24px_24px]"
      : "bg-white bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]"
  );

  return (
    <section className={containerClasses}>
      {/* Background vignette effect */}
      <div className={cn(
        "absolute inset-0 pointer-events-none z-[1] transition-opacity duration-700",
        isDark
          ? "bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#050505_85%)] opacity-100"
          : "bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(255,255,255,0.4)_90%)] opacity-40"
      )} />

      {/* 
        Main Hero Card 
        Uses glassmorphism (backdrop-blur) and high-fidelity shadows.
      */}
      <div className={cn(
        "relative flex flex-col z-[2] w-[94%] max-w-[1600px] m-0 overflow-hidden rounded-[24px] font-ibm transition-all duration-500 mx-auto",
        "-translate-y-5 backdrop-blur-xl border h-[80dvh] max-h-[80dvh]",
        isDark
          ? 'bg-brand-bg/85 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]'
          : 'bg-white/90 border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.01)]'
      )}>

        {/* Topbar: Technical HUD feel with macOS-style window controls */}
        <div className={cn(
          "relative shrink-0 px-5 rounded-t-[24px] border-b transition-all duration-300 z-10",
          "grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-y-1 py-4 lg:py-0 lg:flex lg:items-center lg:justify-between lg:h-[48px]",
          isDark ? 'bg-brand-modal border-border-studio' : 'bg-white border-light-border'
        )}>
          <div className="relative flex gap-2 col-start-1 row-start-1 self-center">
            {/* Traffic Light Interaction Dots: Using semantic terminal status colors */}
            <div className="relative w-3 h-3 rounded-full bg-viz-mac-red ring-1 ring-black/5" data-tooltip="Self-destruct (Requires snacks to activate)" />
            <div className="relative w-3 h-3 rounded-full bg-viz-mac-yellow ring-1 ring-black/5" data-tooltip="Minimize career anxiety" />
            <div className="relative w-3 h-3 rounded-full bg-viz-success ring-1 ring-black/5" data-tooltip="Maximize GPU usage" />
          </div>

          <div className={cn(
            "z-[5] whitespace-nowrap pointer-events-none font-ibm text-[9px] lg:text-[10px] tracking-[.12em] opacity-60 text-shadow-sm",
            "col-start-2 row-start-1 self-center justify-self-end text-right",
            "lg:absolute lg:right-auto lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 lg:text-center",
            isDark ? "text-viz-success shadow-viz-success/10" : "text-[#444]"
          )}>
            justinclarke / portfolio
          </div>

          <div className="relative flex items-center gap-5 z-10 col-span-2 row-start-2 justify-center lg:flex-row lg:col-span-1 lg:row-start-1 lg:justify-end mt-2 lg:mt-0">
            <div className={cn(
              "p-1.5 rounded-md cursor-pointer transition-all duration-200 hidden sm:flex",
              isDark ? "text-[#999] hover:text-white hover:bg-white/10" : "text-[#444] hover:text-term-text hover:bg-black/5"
            )} onClick={() => setIsDark(p => !p)} data-tooltip={isDark ? 'Flashbang!' : 'Enter the void.'}>
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </div>
            <div className={cn(
              "p-1.5 rounded-md cursor-pointer transition-all duration-200 hidden sm:flex",
              isDark ? "text-[#999] hover:text-white hover:bg-white/10" : "text-[#444] hover:text-term-text hover:bg-black/5"
            )} onClick={() => window.open('https://github.com/justinclarke', '_blank')} data-tooltip="Behold, the spaghetti code.">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22" /></svg>
            </div>
            <div className={cn(
              "p-1.5 rounded-md cursor-pointer transition-all duration-200 hidden sm:flex",
              isDark ? "text-[#999] hover:text-white hover:bg-white/10" : "text-[#444] hover:text-term-text hover:bg-black/5"
            )} onClick={() => window.open('https://www.linkedin.com/in/justinsavioclarke/', '_blank')} data-tooltip="Generic connection request incoming.">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </div>
            <a
              href="/resources/Justin_Clarke_Resume.pdf"
              download="Justin_Clarke_Resume.pdf"
              className={cn(
                "hidden lg:inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-ibm font-bold text-[11px] tracking-[0.05em] uppercase cursor-pointer no-underline transition-all duration-300",
                "border-[1.5px] shadow-sm hover:shadow-lg active:scale-95",
                isDark
                  ? "bg-term-text text-term-white border-brand-primary hover:bg-term-white hover:text-term-text hover:border-brand-primary"
                  : "bg-term-text text-term-white border-term-text hover:bg-white hover:text-term-text hover:border-term-text"
              )}
              data-tooltip="Evidence that I actually do work."
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[16px] h-[16px]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              Resume
            </a>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] flex-1 w-full overflow-hidden",
          !isMobile && "h-full"
        )}>
          {/* Left Column: Bio Content */}
          <div className={cn(
            "relative flex flex-col justify-between items-start flex-1 transition-all duration-500",
            "border-r transition-colors duration-300 scrollbar-none",
            isDark ? "bg-white/[0.04] border-white/5" : "bg-black/[0.01] border-black/5",
            isMobile
              ? "p-6 sm:p-8"
              : "lg:h-full lg:overflow-hidden h-auto lg:pt-12 lg:pb-[80px] lg:pl-16 lg:pr-10 pb-8", // Added lg:pr-10 for balance
            "[@media(max-height:800px)]:pt-4 [@media(max-height:800px)]:pb-[24px] [@media(max-height:800px)]:pl-10"
          )}>
            <div className={cn(
              "flex flex-col w-full transition-all duration-300",
              isMobile
                ? isTerminalOpen
                  ? "gap-4 py-2 opacity-40 pointer-events-none"
                  : "flex-1 justify-around py-8 opacity-100"
                : "gap-6 lg:gap-8 [@media(max-height:800px)]:gap-4 justify-start"
            )}>
              <div className={cn(
                "font-black whitespace-pre-line leading-[0.75] ml-[clamp(-2px,-0.15vw,0)]",
                isDark ? "text-white" : "text-black"
              )}>
                <span className="font-ibm tracking-[-0.06em] text-[clamp(3.5rem,20vw,6.5rem)] lg:text-[clamp(2.5rem,8vw,5.5rem)] [@media(max-height:800px)]:text-[3.5rem]">Justin</span>
                {"\n"}
                <span className="font-playfair italic tracking-[-0.04em] text-[clamp(3.5rem,20vw,6.5rem)] lg:text-[clamp(2.5rem,8vw,5.5rem)] [@media(max-height:800px)]:text-[3.5rem]">Clarke</span>
              </div>
              <div className="flex flex-col gap-4 [@media(max-height:800px)]:gap-2">
                <div className={cn(
                  "relative flex items-center gap-[8px] px-4 py-1.5 rounded-full w-fit font-ibm font-bold tracking-[0.12em] uppercase text-[9px] sm:text-[11px] lg:text-[10px] [@media(max-height:800px)]:text-[9px] border transition-all duration-300 shadow-sm",
                  isDark
                    ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-[0_0_20px_rgba(0,200,180,0.1)]"
                    : "bg-brand-primary/5 border-brand-primary/20 text-[#00796b]"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isDark ? "bg-brand-primary shadow-[0_0_8px_rgba(0,200,180,0.8)]" : "bg-[#00897b]"
                  )} />
                  Data Analyst & Full-Stack Engineer
                </div>
                <div className="tagline-block flex flex-col gap-[2px]">
                  <div className={cn(
                    "tg1 font-ibm font-semibold text-[14px] tracking-[-0.01em] leading-[1.2]",
                    isDark ? "text-white/90" : "text-black/80"
                  )}>Pipelines to dashboards</div>
                  <div className={cn(
                    "tg2 font-ibm text-[14px] tracking-[-0.01em] leading-[1.2]",
                    isDark ? "text-white/60" : "text-black/50"
                  )}>Engineering to insights</div>
                </div>
              </div>
            </div>

            <div className="hero-actions flex items-center flex-wrap gap-3 mt-6">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className={cn(
                  "group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-ibm font-bold text-[11px] tracking-[0.05em] uppercase cursor-pointer transition-all duration-300 border-[1.5px] shadow-sm hover:shadow-lg active:scale-95",
                  isDark
                    ? "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"
                    : "bg-term-white text-term-text border-term-text hover:bg-term-text hover:text-term-white hover:border-term-text"
                )}
              >
                Get in touch
                <span className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full ml-3 transition-all duration-300",
                  isDark
                    ? "bg-white/10 text-white group-hover:bg-white group-hover:text-term-text"
                    : "bg-term-text text-term-white group-hover:bg-term-white group-hover:text-term-text"
                )}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </span>
              </button>

              <a
                href="/resources/Justin_Clarke_Resume.pdf"
                download="Justin_Clarke_Resume.pdf"
                className={cn(
                  "inline-flex md:hidden lg:hidden items-center gap-2 px-6 py-2.5 rounded-full font-ibm font-bold text-[11px] tracking-[0.05em] uppercase cursor-pointer no-underline transition-all duration-300 border-[1.5px] shadow-sm hover:shadow-lg active:scale-95",
                  isDark
                    ? "bg-term-text text-term-white border-brand-primary hover:bg-term-white hover:text-term-text"
                    : "bg-term-text text-term-white border-term-text hover:bg-white hover:text-term-text"
                )}
              >
                Resume
                <span className="flex items-center justify-center w-7 h-7 rounded-full ml-3 bg-white/20 text-white transition-all duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 18 15 15" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Mobile Terminal Toggle - Redesigned as a high-fidelity HUD bar */}
            <div className="lg:hidden mt-auto w-full pt-4">
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className={cn(
                  "w-full group relative flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-500 overflow-hidden shadow-lg active:scale-[0.98]",
                  isDark
                    ? isTerminalOpen
                      ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-[0_0_20px_rgba(0,180,160,0.1)]"
                      : "bg-white/5 border-white/10 text-white/60"
                    : isTerminalOpen
                      ? "bg-brand-primary/5 border-brand-primary/20 text-[#00897b]"
                      : "bg-black/5 border-black/10 text-black/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isTerminalOpen ? "bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(0,180,160,0.8)]" : "bg-white/20"
                  )} />
                  <span className="font-ibm font-bold text-[11px] tracking-[0.1em] uppercase">
                    {isTerminalOpen ? 'CLOSE TERMINAL' : 'OPEN TERMINAL ^$'}
                  </span>
                </div>
                <div className={cn(
                  "transition-transform duration-500",
                  isTerminalOpen ? "rotate-0" : "rotate-180"
                )}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                </div>
              </button>
            </div>

            {/* Desktop Nav Hint Panel */}
            <div className="nav-hints hidden lg:flex flex-col gap-3 [@media(max-height:800px)]:gap-1.5 w-full max-w-[380px] [@media(max-height:800px)]:max-w-[320px] mt-8 [@media(max-height:800px)]:mt-4">
              {[
                { cmd: 'LS PROJECTS', desc: 'Featured work', icon: 'grid' },
                { cmd: 'EXPERTISE', desc: 'Skills pipeline', icon: 'code' },
                { cmd: 'EXPERIENCE', desc: 'Work history', icon: 'briefcase' },
                { cmd: 'ADVANCED', desc: 'Reveal more commands', icon: 'terminal' }
              ].map((hint, idx) => (
                <div
                  key={hint.cmd}
                  className={cn(
                    "group flex items-center justify-between px-6 py-3.5 [@media(max-height:800px)]:py-2.5 [@media(max-height:800px)]:px-4 rounded-xl border cursor-pointer transition-all duration-500 hover:translate-x-2 shadow-sm hover:shadow-lg",
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-brand-primary/10 hover:border-brand-primary/30"
                      : "bg-white border-black/5 hover:bg-brand-primary/5 hover:border-brand-primary/20"
                  )}
                  onClick={() => runCmd(hint.cmd)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "transition-all duration-300",
                      isDark ? "text-brand-primary/60 group-hover:text-brand-primary" : "text-brand-primary/70 group-hover:text-black"
                    )}>
                      {hint.icon === 'grid' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>}
                      {hint.icon === 'code' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>}
                      {hint.icon === 'briefcase' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>}
                      {hint.icon === 'terminal' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>}
                    </div>
                    <span className="font-ibm font-bold text-[12px] tracking-[0.1em] uppercase text-brand-primary">{hint.cmd}</span>
                  </div>
                  <span className={cn(
                    "font-ibm text-[10px] uppercase tracking-[0.05em] font-medium transition-colors duration-300",
                    isDark ? "text-white/30 group-hover:text-white/60" : "text-light-text-muted group-hover:text-black"
                  )}>{hint.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Terminal Area */}
          <motion.div
            className={cn(
              "rcol relative flex flex-col overflow-hidden",
              isMobile && isTerminalOpen && "flex-1"
            )}
            initial={false}
            animate={{
              height: isMobile ? (isTerminalOpen ? '35dvh' : '0dvh') : '100%',
              opacity: isMobile ? (isTerminalOpen ? 1 : 0) : 1
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <canvas ref={nn2Ref} className="absolute inset-0 z-0 pointer-events-none" />

            {(isTerminalOpen || !isMobile) && (
              <div className="relative flex flex-col flex-1 h-full min-h-0 overflow-hidden z-[1]">
                <div className="flex items-center justify-between shrink-0 pl-2 pr-4 sm:pr-6 py-3 px-[clamp(10px,1.5vh,16px)] cursor-default">
                  <div className={cn(
                    "flex items-center gap-[6px] font-ibm text-[9px] tracking-[0.1em] [@media(max-height:800px)]:text-[8px]",
                    isDark ? "text-white/40" : "text-black/30"
                  )}><span className="opacity-100 animate-[test-hero-bl_1s_infinite]" />precision-core · active</div>
                  <div className={cn(
                    "font-ibm text-[9px] tracking-[0.06em] [@media(max-height:800px)]:text-[8px]",
                    isDark ? "text-white/40" : "text-black/30"
                  )}>● connected</div>
                </div>

                <div className={cn(
                  "flex items-center gap-3 sm:gap-4 pl-2 pr-4 sm:pr-6 py-3 border-b transition-colors duration-300",
                  isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.01] border-black/5"
                )}>
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-lg border shrink-0 transition-all duration-300",
                    isDark ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-[0_0_12px_rgba(0,180,160,0.2)]" : "bg-brand-primary/5 border-brand-primary/20 text-brand-primary"
                  )}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className={cn(
                    "font-ibm text-[10.5px] sm:text-[11.5px] leading-tight transition-colors duration-300 px-3 py-1 rounded-[6px]",
                    isDark ? "bg-brand-primary/5 text-white/80" : "bg-black/5 text-black/70"
                  )}>
                    {isMobile ? (
                      <span className="flex items-center gap-2">
                        <b className={isDark ? "text-white" : "text-black"}>TIP:</b> <span className={cn("font-bold", isDark ? "text-brand-primary" : "text-[#00796b]")}>TYPE TO NAVIGATE</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <b className={isDark ? "text-white" : "text-black"}>MAC HUD V4.0:</b> <span className={cn("font-bold", isDark ? "text-brand-primary" : "text-[#00796b]")}>SYNCED</span> <span className="opacity-40">·</span> <span className={isDark ? "text-white/40" : "text-black/40"}>type in to navigate.</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className={cn(
                  "relative flex flex-col flex-1 gap-[2px] overflow-y-auto min-h-0 scroll-smooth scanline",
                  isDark ? "terminal-dark" : "terminal-light",
                  activeGame ? "p-0" : "pl-2 pr-4 sm:pr-6 py-4"
                )} ref={outRef}>
                  {activeGame === 'snake' && (
                    <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col overflow-hidden">
                      <SnakeGame onExit={() => setActiveGame(null)} />
                    </div>
                  )}
                </div>

                <div className={cn(
                  "pl-2 pr-4 sm:pr-6 py-3 cursor-default border-t transition-all duration-300",
                  isDark ? "border-white/5 bg-transparent" : "border-black/5 bg-transparent",
                  pillsVisible ? 'flex flex-wrap gap-2' : 'hidden'
                )}>
                  {[
                    { label: 'whoami', cmd: 'whoami', accent: false },
                    { label: 'snake', cmd: 'snake', accent: true, desktopOnly: true },
                    { label: 'ping me', cmd: 'ping me', accent: false },
                    { label: 'advanced', cmd: 'advanced', accent: false },
                    { label: 'clear', cmd: 'clear', accent: false }
                  ].filter(p => !p.desktopOnly || !isMobile).map((p, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "font-ibm text-[9px] px-3 py-1.5 rounded-sm border cursor-pointer transition-all duration-200 uppercase tracking-widest font-bold",
                        p.accent
                          ? isDark
                            ? "text-brand-primary border-brand-primary/40 bg-brand-primary/10 hover:bg-brand-primary/20 hover:border-brand-primary/60 shadow-[0_0_12px_rgba(0,180,160,0.15)]"
                            : "text-[#00897b] border-[#4db6ac] bg-[#e0f2f1] hover:bg-[#b2dfdb] shadow-sm"
                          : isDark
                            ? "text-white/40 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:text-white"
                            : "text-black/50 border-black/10 bg-black/5 hover:bg-black/10 hover:border-black/30 hover:text-black"
                      )}
                      onClick={() => runCmd(p.cmd)}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>

                <div className={cn(
                  "relative flex items-center gap-2 shrink-0 cursor-text border-t pl-2 pr-4 sm:pr-6 py-4 transition-all duration-300",
                  isDark ? "border-white/5 text-white/90" : "border-black/5 text-black/80"
                )} onClick={() => inpRef.current?.focus()}>
                  <span className="shrink-0 font-ibm text-[13px] [@media(max-height:800px)]:text-[11px] opacity-80 font-bold text-brand-primary">~$</span>
                  <div className="relative flex items-center min-w-0 flex-1">
                    <span className="font-ibm text-[13px] [@media(max-height:800px)]:text-[11px] whitespace-pre-wrap transition-colors duration-300 font-medium">{terminalText}</span>
                    <div className="ml-1 w-2 h-[1.2em] bg-brand-primary animate-pulse duration-[800ms] align-middle shadow-[0_0_8px_rgba(0,200,180,0.4)]" />
                  </div>
                  <input
                    ref={inpRef}
                    className="absolute opacity-0 w-0 h-0"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal command input"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
