import React, { useEffect, useRef, useState, useCallback } from 'react';
import { elevatorScroll } from '@/shared/utils/scroll';
import { useModal } from '@/providers/ModalProvider';
import { SnakeGame } from './SnakeGame';
import { motion } from 'framer-motion';
import './HeroSection.css';

/* ── Static data (outside component to avoid re-creation) ── */

const COMMANDS: Record<string, any[]> = {
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
    { t: 't', text: '  ls projects' },
    { t: 'b', text: '  ↳ 4 things worth your time' },
    { t: 't', text: '  expertise' },
    { t: 'b', text: '  ↳ what\'s in the stack' },
    { t: 't', text: '  experience' },
    { t: 'b', text: '  ↳ where it was built' },
    { t: 't', text: '  education' },
    { t: 'b', text: '  ↳ how it started' },
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

const FUNNY_ERRORS: Record<string, { cls: string; text: string }[]> = {
  sudo: [{ cls: 'r', text: "Permission denied. Justin's life choices are root-only." }],
  'rm -rf': [{ cls: 'r', text: "rm: cannot remove portfolio: it's too good to delete." }],
  'git blame': [{ cls: 'o', text: "100% Justin. He commits, he ships, he takes the blame." }],
  'git commit': [{ cls: 'm', text: "nothing to commit. working tree clean. life is shipping." }],
  vim: [{ cls: 'r', text: "vim opened. good luck exiting. we'll be here. :q!" }],
  emacs: [{ cls: 'r', text: "emacs: Justin uses VS Code. This isn't the 90s." }],
  hire: [
    { cls: 'g', text: "redirecting to good-decision-making.exe..." },
    { cls: 'b', text: "→ justinsavioclarke@outlook.com · he's available" }
  ],
  'hire justin': [
    { cls: 'g', text: "outstanding choice. forwarding CV to your conscience..." },
    { cls: 'b', text: "→ justinsavioclarke@outlook.com" }
  ],
  'play snake': [{ cls: 'g', text: "launching snake.exe · use arrow keys · don't blame us" }],
  matrix: [{ cls: 'g', text: "wake up, Neo. your data pipeline is the real matrix." }],
  pwd: [{ cls: 'g', text: "/home/justin/portfolio · exactly where you should be." }],
  exit: [{ cls: 'r', text: "exit: nice try. scroll down first." }],
  quit: [{ cls: 'r', text: "quit: not yet. you haven't seen the projects." }],
  hello: [{ cls: 'g', text: "hello to you too. type 'help' if you're lost." }],
  hi: [{ cls: 'g', text: "hey 👋 type 'help' · or just vibe with the neural net." }],
  ls: [{ cls: 'b', text: "too vague. try 'ls projects' — it's the good stuff." }],
  cat: [{ cls: 'b', text: "cat: try 'cat expertise' if you want the full manifest." }],
  'npm install': [{ cls: 'm', text: "already installed. Justin ships production-ready, not localhost." }],
  'npm run dev': [{ cls: 'g', text: "dev server running at justinclarke.github.io ↗" }],
  python: [
    { cls: 'g', text: "Python 3.11 · pandas · numpy · scikit-learn all loaded." },
    { cls: 'm', text: "see Projects → Neural Music Engine for proof." }
  ],
  node: [{ cls: 'g', text: "Node.js v20 · TypeScript · Next.js standing by." }],
  curl: [{ cls: 'b', text: "curl: (200) OK · 0.6s · portfolio is up and running." }],
  fabric: [{ cls: 'g', text: "Microsoft Fabric: Justin's main character. → see Projects" }],
  whoops: [{ cls: 'o', text: "it happens. type 'help' and we'll get you back on track." }],
  test: [{ cls: 'm', text: "test: all systems passing. portfolio: 100% shipped." }],
  life: [{ cls: 'pu', text: "life: undefined. but the pipelines are working fine." }],
};

const BRAND_COLORS = ['#ffffff', '#e2e8f0', '#94a3b8', '#64748b'];

/* ── Component ── */

export const HeroSection: React.FC = () => {
  const outRef = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);
  const nn1Ref = useRef<HTMLCanvasElement>(null);
  const nn2Ref = useRef<HTMLCanvasElement>(null);

  const { setIsContactModalOpen } = useModal();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Auto-reveal terminal on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsTerminalOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    d.className = 'lo';
    d.innerHTML = `<span class="p">${label}</span><span class="${cls}">${text}</span>`;
    outRef.current.appendChild(d);
    outRef.current.scrollTop = outRef.current.scrollHeight;
  }, []);

  const addComplexLine = useCallback((parts: { t: string; text: string }[], label: string) => {
    if (!outRef.current) return;
    const d = document.createElement('div');
    d.className = 'lo';
    let content = `<span class="p">${label}</span>`;
    parts.forEach(p => {
      content += `<span class="${p.t}">${p.text}</span>`;
    });
    d.innerHTML = content;
    outRef.current.appendChild(d);
    outRef.current.scrollTop = outRef.current.scrollHeight;
  }, []);

  const addTypedLine = useCallback((cls: string, label: string, text: string, speed = 8) => {
    return new Promise<void>((resolve) => {
      if (!outRef.current) return resolve();
      const d = document.createElement('div');
      d.className = 'lo';
      d.innerHTML = `<span class="p">${label}</span><span class="${cls}"></span>`;
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
      d.className = 'lo';
      d.innerHTML = `<span class="p">${label}</span>`;
      outRef.current.appendChild(d);

      for (const part of parts) {
        const span = document.createElement('span');
        span.className = part.t;
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
    } else if (cmd === 'play snake' || cmd === 'playsnake') {
      if (window.innerWidth < 1024) {
        addLine('r', '  ', 'Error: Snake_OS is optimized for Desktop environments.');
        addLine('o', '  ', '→ Use a device with a physical keyboard (1024px+ width) to play.');
        return;
      }
      await addTypedLine('g', '\u00a0\u00a0', 'Initializing Snake_OS...', 25);
      setTimeout(() => setActiveGame('snake'), 800);
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
      setTimeout(() => window.open('/resume.pdf', '_blank'), 1200);
    }

    // --- Known commands ---
    const cmdLines = COMMANDS[cmd];
    if (cmdLines && cmdLines.length > 0) {
      for (const line of cmdLines) {
        if (line.parts) {
          await addTypedComplexLine(line.parts, '\u00a0\u00a0', 6);
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
          await addTypedLine(line.cls, '\u00a0\u00a0', line.text, 10);
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
        ctx.globalAlpha = dark ? 0.4 : 0.25;
        ctx.fill();
      });

      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
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
            ctx.globalAlpha = (1 - dist / 100) * (dark ? 0.35 : 0.2);
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

    if (nn1Ref.current) initCanvas(nn1Ref.current, 12);
    if (nn2Ref.current) initCanvas(nn2Ref.current, 20);

    return () => {
      controllers.forEach(c => c.stop());
    };
  }, [isDark]);

  // --- Boot sequence (runs once) ---
  useEffect(() => {
    if (hasBootedRef.current) return;
    hasBootedRef.current = true;

    const boot = async () => {
      await new Promise(r => setTimeout(r, 600));
      await addTypedLine('m', '>', ' neural_link_v4.0 initializing...', 15);
      await addTypedLine('g', '>', ' portfolio loaded · all systems nominal', 10);
      await addTypedComplexLine([{ t: 'm', text: ' type ' }, { t: 't', text: 'help' }, { t: 'm', text: ' or pick a command below' }], '>', 10);
      await new Promise(r => setTimeout(r, 400));

      const ql = [
        { c: 'whoami', d: 'the human behind the pipelines' },
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
  }, [addTypedLine, addCmdLine]);

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
  const containerClasses = `test-hero-container w-full min-h-screen relative flex items-center justify-center overflow-x-hidden pt-[clamp(20px,4vh,60px)] pb-5 px-0 ${isDark ? 'dark-mode' : ''}`;
  // We keep the dynamic background image in CSS `test-hero-container` for now since it involves complex radial gradients, 
  // but move layout properties to Tailwind.

  return (
    <section className={containerClasses}>
      {/* Background pseudo element moved to a div for Tailwind ease if needed, but keeping CSS pseudo for now */}
      <div className={`test-hero relative flex flex-col z-10 w-[94%] max-w-[1600px] m-0 backdrop-blur-[20px] border rounded-[24px] overflow-hidden -translate-y-5 min-h-[500px] h-[clamp(520px,88vh,900px)] max-h-[94vh] font-[Syne] ${isDark ? 'bg-[#141414]/80 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)]' : 'bg-[#f7f7f5]/80 border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)]'}`}>

        {/* Topbar */}
        <div className={`topbar border-b h-[48px] rounded-t-[24px] flex items-center justify-between relative transition-all duration-300 shrink-0 ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#ebebeb]'}`}>
          <div className="dots flex gap-[8px] z-10">
            <div className="dot dr bg-[#ff5f57] w-[12px] h-[12px] rounded-full" data-tooltip="Self-destruct (Requires snacks to activate)" />
            <div className="dot dy bg-[#febc2e] w-[12px] h-[12px] rounded-full" data-tooltip="Minimize career anxiety" />
            <div className="dot dg bg-[#28c840] w-[12px] h-[12px] rounded-full" data-tooltip="Maximize GPU usage" />
          </div>

          <div className={`tb-mid text-[clamp(9px,0.8vw,10px)] tracking-[.12em] whitespace-nowrap ${isDark ? 'text-[#888]' : 'text-[#999]'}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            justinclarke / portfolio
          </div>

          <div className="tb-r flex items-center gap-4 z-10">
            <div className="tic hidden sm:flex cursor-pointer" onClick={() => setIsDark(p => !p)} data-tooltip={isDark ? 'Flashbang!' : 'Enter the void.'}>
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
            <div className="tic hidden sm:flex cursor-pointer" onClick={() => window.open('https://github.com/justinclarke', '_blank')} data-tooltip="Behold, the spaghetti code.">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22" /></svg>
            </div>
            <div className="tic hidden sm:flex cursor-pointer" onClick={() => window.open('https://linkedin.com/in/justinclarke', '_blank')} data-tooltip="Generic connection request incoming.">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </div>
            <button className="rbtn hidden lg:inline-flex" onClick={() => window.open('/resume.pdf', '_blank')} data-tooltip="The scroll of destiny.">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              Resume
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
          <div className="lcol flex flex-col justify-start lg:justify-between items-start h-auto lg:h-full p-4 lg:p-[clamp(20px,4vh,44px)] gap-y-8 lg:gap-y-0 overflow-y-auto scrollbar-none">
            <div className="content-stack flex flex-col gap-4">

              <div className="name-block">
                <span className="n1">Justin</span>
                <span className="n2">Clarke</span>
              </div>
              <div className="bio-stack flex flex-col gap-4">
                <div className="role"><span className="ad" />Data Analyst & Full-Stack Engineer</div>
                <div className="tagline-block flex flex-col gap-2">
                  <div className="tg1">Pipelines to dashboards</div>
                  <div className="tg2">Engineering to insights</div>
                </div>
              </div>
            </div>
            <div className="hero-actions flex flex-wrap gap-4 items-center lg:mt-6">
              <button className="rbtn ghost" onClick={() => setIsContactModalOpen(true)} data-tooltip="Slide into my DMs (professionally)">
                Get in touch
                <span className="rbtn-icon-wrap">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </span>
              </button>

              <button className="rbtn mobile-only-btn" onClick={() => window.open('/resume.pdf', '_blank')} data-tooltip="The scroll of destiny.">
                Resume
                <span className="rbtn-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 18 15 15" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Desktop Nav Hint Panel */}
            <div className="nav-hints">
              <div
                className="hint-row"
                onClick={() => runCmd('ls projects')}
                data-tooltip="View the core project registry [ls projects]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-3.5 h-3.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  <span className="hint-cmd">ls projects</span>
                </div>
                <span className="hint-desc">Featured work</span>
              </div>
              <div
                className="hint-row"
                onClick={() => runCmd('expertise')}
                data-tooltip="Inspect the technical stack [expertise]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-3.5 h-3.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                  <span className="hint-cmd">expertise</span>
                </div>
                <span className="hint-desc">Skills pipeline</span>
              </div>
              <div
                className="hint-row"
                onClick={() => runCmd('experience')}
                data-tooltip="Access professional timeline [experience]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-3.5 h-3.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                  <span className="hint-cmd">experience</span>
                </div>
                <span className="hint-desc">Work history</span>
              </div>
              <div
                className="hint-row"
                onClick={() => runCmd('advanced')}
                data-tooltip="Reveal supplemental system commands [advanced]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-3.5 h-3.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>
                  <span className="hint-cmd">advanced</span>
                </div>
                <span className="hint-desc">Reveal more commands</span>
              </div>
            </div>

            {/* Mobile Terminal Toggle */}
            <button
              className={`terminal-toggle mobile-only ${isTerminalOpen ? 'active' : ''}`}
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            >
              <div className="pulse-dot" />
              <span>{isTerminalOpen ? 'Hide Terminal' : 'Open Terminal ^$ help'}</span>
            </button>
          </div>

          <motion.div
            className="rcol"
            initial={false}
            animate={{
              height: window.innerWidth < 1024 ? (isTerminalOpen ? '300px' : 0) : 'auto',
              opacity: window.innerWidth < 1024 ? (isTerminalOpen ? 1 : 0) : 1,
              flex: window.innerWidth < 1024 ? (isTerminalOpen ? 1 : 0) : 1
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <canvas ref={nn2Ref} className="nn-r" />
            <div className="term">
              <div className="term-hdr">
                <div className="th-l"><span className="ad" />precision-core · active</div>
                <div className="th-r">● connected</div>
              </div>

              <div className="term-banner">
                <div className="banner-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="banner-text">
                  <b>This terminal navigates the site,</b> <span>type in.</span>
                </div>
              </div>

              <div className="term-out" ref={outRef}>
                {activeGame === 'snake' && (
                  <div className="game-overlay">
                    <SnakeGame onExit={() => setActiveGame(null)} />
                  </div>
                )}
              </div>
              <div className={`pills ${pillsVisible ? '' : 'hidden'}`}>
                <span className="pill" onClick={() => runCmd('whoami')}>whoami</span>
                <span className="pill" onClick={() => runCmd('ping me')}>ping me</span>
                <span className="pill" onClick={() => runCmd('advanced')}>advanced</span>
                <span className="pill" onClick={() => runCmd('clear')}>clear</span>
              </div>
              <div className="term-inp" onClick={() => inpRef.current?.focus()}>
                <span className="inp-p">~$</span>
                <div className="inp-field-wrapper">
                  <span className="inp-text-mirror">{terminalText}</span>
                  <div className="cur-blink" />
                </div>
                <input
                  ref={inpRef}
                  className="inp-hidden"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
