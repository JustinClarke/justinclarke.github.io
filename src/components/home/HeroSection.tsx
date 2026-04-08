import React, { useEffect, useRef, useState, useCallback } from 'react';
import { elevatorScroll } from '@/shared/utils/scroll';
import { useModal } from '@/providers/ModalProvider';
import { SnakeGame } from './SnakeGame';
import { motion } from 'framer-motion';
import './HeroSection.css';

/* ── Static data (outside component to avoid re-creation) ── */

const COMMANDS: Record<string, { t: string; text: string }[]> = {
  whoami: [
    { t: 'g', text: 'Justin Clarke' },
    { t: 'pu', text: 'Data Engineering & Analytics Lead' },
    { t: 'b', text: 'Microsoft Fabric · Power BI · Azure · Next.js · Python' },
    { t: 't', text: 'Specializing in high-fidelity data experiences.' },
    { t: 'm', text: '→ Built with passion in Dubai.' },
  ],
  'ls projects': [
    { t: 'm', text: 'Reading from /mnt/storage/core_repos...' },
    { t: 'b', text: 'drwxr  neural-music-engine/' },
    { t: 'pu', text: 'drwxr  data-pipeline-architectures/' },
    { t: 'g', text: 'drwxr  retail-as-a-service/' },
    { t: 't', text: 'drwxr  product-intelligence-v3/' },
    { t: 'o', text: '→ scrolling to active workloads...' },
  ],
  expertise: [
    { t: 'g', text: '[core]        Python · SQL · TypeScript · R' },
    { t: 'b', text: '[data]        Microsoft Fabric · Power BI · Azure' },
    { t: 'pu', text: '[web]         React · Next.js · Node · GSAP' },
    { t: 't', text: '[creative]    Figma · UI/UX · Cinematic Motion' },
    { t: 'm', text: '→ scrolling to Expertise Pipeline...' },
  ],
  'ping me': [
    { t: 'm', text: 'Establishing handshake with outlook.com...' },
    { t: 'g', text: '64 bytes from Justin: icmp_seq=1 ttl=255 time=0.042ms' },
    { t: 't', text: 'Status: Fully open to collaboration.' },
    { t: 'b', text: 'justinsavioclarke@outlook.com' },
  ],
  help: [
    { t: 'o', text: 'System Manifest — Standard Protocols:' },
    { t: 'g', text: '  whoami          → biometric summary' },
    { t: 'b', text: '  ls projects     → core project registry' },
    { t: 'pu', text: '  expertise       → technical stack manifest' },
    { t: 't', text: '  experience      → historical timeline' },
    { t: 't', text: '  ping me         → contact bridge' },
    { t: 'm', text: '  clear           → purge display' },
    { t: 'm', text: '' },
    { t: 'o', text: 'Advanced Modules (For the curious):' },
    { t: 'pu', text: '  sudo, play snake, git blame, coffee, matrix, life' },
  ],
  experience: [
    { t: 't', text: 'Synchronizing timeline data...' },
    { t: 'm', text: '→ Scrolling to professional history.' },
  ],
  education: [
    { t: 'b', text: 'Accessing academic archives...' },
    { t: 'm', text: '→ Scrolling to university credentials.' },
  ],
  coffee: [
    { t: 'o', text: 'Brewing a fresh cup of digital caffeine... ☕' },
    { t: 'm', text: 'Status: Enjoying a medium roast while optimizing pipelines.' },
    { t: 'g', text: 'Optimization level increased by 15%.' },
  ],
  matrix: [
    { t: 'g', text: 'You take the blue pill... wait, you already clicked Dark Mode.' },
    { t: 'r', text: 'There is no spoon. Only code.' },
  ],
  life: [
    { t: 'b', text: 'Analyzing existence...' },
    { t: 'pu', text: 'Result: 42. But also, have you tried learning Microsoft Fabric?' },
  ],
  secret: [
    { t: 'r', text: 'Nice try, Agent. Access to encrypted dreams requires level 10 clearance.' },
  ],
  salary: [
    { t: 'm', text: 'Redirecting to bank-of-imagination.com...' },
    { t: 'o', text: 'Error: Balance too high to display in a terminal.' },
  ],
};

const FUNNY_ERRORS: Record<string, { cls: string; text: string }> = {
  sudo: { cls: 'r', text: "Access Denied: Root permissions are reserved for Justin's brain only." },
  'rm -rf': { cls: 'r', text: 'CRITICAL ERROR: Attempting to delete the foundation of my career?' },
  'git blame': { cls: 'o', text: "Analyzing commits... It's Justin. It's always been Justin." },
  'npm run dev': { cls: 'g', text: 'Development server is already pushing to PRODUCTION 🚀' },
  cd: { cls: 'b', text: "cd: you're already in the right place. There is nowhere else." },
  hello: { cls: 'g', text: "Connection accepted. How can I assist your investigation?" },
  ls: { cls: 'b', text: "Try 'ls projects' for the good stuff." },
  cat: { cls: 'pu', text: "cat: I only have a digital coffee. No felines here. Try 'expertise'." },
  hack: { cls: 'r', text: "hack: (403) Forbidden. Also, hacking is so 1999." },
  dating: { cls: 'r', text: "An error occurred. Binary state not found. Try 'coffee' instead." },
  exit: { cls: 'o', text: "exit: you cannot leave the matrix. Scroll down to escape." },
  quit: { cls: 'o', text: "quit: Justin hasn't implemented a quit function for his passions." },
};

const BRAND_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'];

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
      for (let i = 0; i < cmdLines.length; i++) {
        const line = cmdLines[i];
        await addTypedLine(line.t, '\u00a0\u00a0', line.text, 6);
      }
      if (cmd === 'help') {
        setTimeout(() => setPillsVisible(true), 200);
      }
      return;
    }
    // Silent commands already handled above
    if (cmd in COMMANDS) return;

    // --- Funny errors ---
    for (const key of Object.keys(FUNNY_ERRORS)) {
      if (cmd === key || cmd.startsWith(key + ' ')) {
        const e = FUNNY_ERRORS[key];
        await addTypedLine(e.cls, '\u00a0\u00a0', e.text, 10);
        return;
      }
    }

    // --- Fuzzy suggestions ---
    const guesses: string[] = [];
    if (cmd.includes('project') || cmd.includes('work') || cmd.includes('portfolio') || cmd.includes('case'))
      guesses.push("Try 'ls projects' → lists core projects");
    if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('stack') || cmd.includes('know') || cmd.includes('capability'))
      guesses.push("Try 'expertise' → full skills manifest");
    if (cmd.includes('game') || cmd.includes('play') || cmd.includes('fun')) {
      if (window.innerWidth >= 1024) guesses.push("Try 'play snake' → start terminal game");
    }
    if (cmd.includes('light') || cmd.includes('dark') || cmd.includes('theme') || cmd.includes('color'))
      guesses.push("Try 'theme toggle' → switch hero mode");
    if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('reach') || cmd.includes('hire') || cmd.includes('touch'))
      guesses.push("Try 'ping me' → availability & contact info");
    if (cmd.includes('who') || cmd.includes('about') || cmd.includes('bio') || cmd.includes('justin'))
      guesses.push("Try 'whoami' → the full story");
    if (cmd.includes('cv') || cmd.includes('resume'))
      guesses.push('Hit the Resume button top-right ↑');
    if (cmd.includes('job') || cmd.includes('career') || cmd.includes('history'))
      guesses.push("Try 'experience' → professional history");
    if (cmd.includes('school') || cmd.includes('degree') || cmd.includes('learn'))
      guesses.push("Try 'education' → academic background");

    if (guesses.length > 0) {
      addLine('r', '\u00a0\u00a0', `command not found: ${raw.trim()}`);
      for (const g of guesses) {
        await addTypedLine('o', '\u00a0\u00a0', '→ ' + g, 5);
      }
    } else {
      addLine('r', '\u00a0\u00a0', `command not found: ${raw.trim()} — but honestly, same.`);
      setTimeout(() => addLine('m', '\u00a0\u00a0', "Type 'help' to see what actually works here."), 140);
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
      await addTypedLine('m', '>', ' Initializing neural_link_v4.0...', 15);
      await addTypedLine('m', '>', ' Synchronizing biometric data... [DONE]', 10);
      await addTypedLine('g', '>', ' Connection established via CloudLink.', 10);
      await addTypedLine('pu', '>', ' Fetching Justin_Clarke_Full_Stack_Core...', 12);
      await new Promise(r => setTimeout(r, 400));
      
      addCmdLine('help');
      const lines = COMMANDS.help;
      for (let i = 0; i < lines.length; i++) {
        await addTypedLine(lines[i].t, '\u00a0\u00a0', lines[i].text, 5);
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
          
          <div className={`tb-mid text-[clamp(9px,0.8vw,10px)] tracking-[.12em] whitespace-nowrap ${isDark ? 'text-[#555]' : 'text-[#bbb]'}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
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

        <div className="grid">
          <div className="lcol">
            <div className="content-stack">

              <div className="name-block">
                <span className="n1">Justin</span>
                <span className="n2">Clarke</span>
              </div>
              <div className="bio-stack">
                <div className="role"><span className="ad" />Data Analyst & Full-Stack Engineer</div>
                <div className="tagline-block">
                  <div className="tg1">Pipelines to dashboards</div>
                  <div className="tg2">Engineering to insights</div>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <button className="cta" onClick={() => setIsContactModalOpen(true)} data-tooltip="Slide into my DMs (professionally)">
                Get in touch <span className="ca">↗</span>
              </button>

              <button className="rbtn mobile-only-btn" onClick={() => window.open('/resume.pdf', '_blank')} data-tooltip="The scroll of destiny.">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                Resume
              </button>
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
              height: window.innerWidth < 1024 ? (isTerminalOpen ? 'auto' : 0) : 'auto',
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
              <div className="term-out" ref={outRef}>
                {activeGame === 'snake' && (
                  <div className="game-overlay">
                    <SnakeGame onExit={() => setActiveGame(null)} />
                  </div>
                )}
              </div>
              <div className={`pills ${pillsVisible ? '' : 'hidden'}`}>
                <span className="pill" onClick={() => runCmd('whoami')}>whoami</span>
                <span className="pill" onClick={() => runCmd('ls projects')}>ls projects</span>
                <span className="pill" onClick={() => runCmd('expertise')}>expertise</span>
                <span className="pill" onClick={() => runCmd('ping me')}>ping me</span>
                <span className="pill" onClick={() => runCmd('help')}>help</span>
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
