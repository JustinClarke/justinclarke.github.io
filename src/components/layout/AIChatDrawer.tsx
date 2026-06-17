import { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { useAIAgent, type AIMessage } from '@/hooks/useAIAgent';
import { AI_AGENT } from '@/config/constants';

const NAV_ROUTES = [
  { keywords: ['home', 'start', 'main'], path: '/', label: 'Home' },
  { keywords: ['spotify', 'spotify engine'], path: '/project/spotify-engine', label: 'Spotify Engine' },
  { keywords: ['sql', 'sql disaster'], path: '/project/sql-disaster', label: 'SQL Disaster' },
  { keywords: ['litestore', 'lite store'], path: '/project/litestore', label: 'LiteStore' },
  { keywords: ['capital', 'budgeting', 'capital budgeting'], path: '/project/capital-budgeting', label: 'Capital Budgeting' },
  { keywords: ['hr', 'archetype', 'hr archetype'], path: '/project/hr-archetype', label: 'HR Archetype' },
  { keywords: ['long version', 'resume', 'cv', 'full resume'], path: '/the-long-version', label: 'The Long Version' },
  { keywords: ['f1', 'formula 1', 'off the pace', 'racing', 'pace'], path: '/f1', label: 'Off The Pace' },
  { keywords: ['connect', 'contact', 'reach out', 'get in touch'], path: '/connect', label: 'Connect' },
] as const;

const NAV_TRIGGERS = ['go to', 'take me to', 'open', 'show me', 'navigate to', 'visit', 'head to', 'bring me to'];

function detectNavIntent(text: string): { path: string; label: string } | null {
  const lower = text.toLowerCase().trim();
  const hasNavPhrase = NAV_TRIGGERS.some(p => lower.includes(p));
  // also catch bare short messages like "f1" or "connect"
  const isShort = lower.split(' ').length <= 3;
  if (!hasNavPhrase && !isShort) return null;
  for (const route of NAV_ROUTES) {
    if (route.keywords.some(k => lower.includes(k))) return route;
  }
  return null;
}

function renderModelText(text: string) {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => {
    const lines = para.split('\n');
    const isList = lines.every(l => /^[-*•]\s/.test(l.trim()) || l.trim() === '');
    if (isList) {
      return (
        <ul key={pi} className="space-y-1 list-none pl-0 mt-1 first:mt-0">
          {lines.filter(l => l.trim()).map((line, li) => (
            <li key={li} className="flex gap-1.5">
              <span className="text-brand-primary shrink-0 mt-px">▸</span>
              <span>{line.replace(/^[-*•]\s+/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={pi} className="mt-1.5 first:mt-0 leading-relaxed">
        {lines.map((line, li) => (
          <span key={li}>{line}{li < lines.length - 1 && <br />}</span>
        ))}
      </p>
    );
  });
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'Does Justin know dbt?',
  "What's Off the Pace?",
  'Is he open to relocation?',
];

const SESSION_MESSAGES_KEY = 'ai_chat_messages';

function loadMessages(): { role: 'user' | 'model'; text: string }[] {
  try { return JSON.parse(sessionStorage.getItem(SESSION_MESSAGES_KEY) || '[]'); } catch { return []; }
}

function saveMessages(msgs: { role: 'user' | 'model'; text: string }[]) {
  try { sessionStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
}

export function AIChatDrawer({ isOpen, onClose }: AIChatDrawerProps) {
  const { askAgent, isQuerying, remainingQueries } = useAIAgent();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIMessage[]>(() => loadMessages());
  const [streamingText, setStreamingText] = useState('');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Click outside to close handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const trigger = document.getElementById('ai-trigger-button');
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        (!trigger || !trigger.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Adjust bottom offset dynamically when virtual keyboard opens (e.g. iOS Safari)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.visualViewport) {
      setKeyboardHeight(0);
      return;
    }

    const handleViewportChange = () => {
      const vv = window.visualViewport!;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardHeight(Math.max(0, offset));
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    handleViewportChange();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    const timer = setTimeout(() => {
      if (isOpen && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, streamingText, isOpen]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isQuerying) return;

    const userMsg: AIMessage = { role: 'user', text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setStreamingText('');

    const navTarget = detectNavIntent(trimmed);
    if (navTarget) {
      const reply: AIMessage = { role: 'model', text: `navigating to ${navTarget.label} ↗` };
      const withReply = [...nextMessages, reply];
      setMessages(withReply);
      saveMessages(withReply);
      setTimeout(() => navigate(navTarget.path), 400);
      return;
    }

    let accumulated = '';
    const finalLines = await askAgent(trimmed, (token) => {
      accumulated += token;
      setStreamingText(accumulated);
    });

    const aiFoot = finalLines.find(l => l.t === 'ai-foot')?.text;
    const footerText = (aiFoot && aiFoot !== 'response complete') ? aiFoot : undefined;
    const textLines = finalLines.filter(l => l.t !== 'ai-foot' && l.t !== 'ai-head');
    const responseText = textLines.map(l => l.text).join('\n').replace(/^\[AGENT\]:\s*/, '');

    const withReply: AIMessage[] = [...nextMessages, { role: 'model', text: responseText, footer: footerText }];
    setMessages(withReply);
    saveMessages(withReply);
    setStreamingText('');
  }, [messages, isQuerying, askAgent, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
    if (e.key === 'Escape') onClose();
  };

  return (
    <motion.div
      ref={drawerRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: isOpen ? 0 : 20,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.95,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        pointerEvents: isOpen ? 'auto' : 'none',
        bottom: isOpen && keyboardHeight > 0 ? `${keyboardHeight + 8}px` : undefined,
      }}
      className={cn(
        'fixed bottom-4 md:bottom-24 right-4 md:right-8 z-[99]',
        'w-[calc(100vw-2rem)] max-w-[400px]',
        'bg-brand-card/90 backdrop-blur-2xl border border-white/10 rounded-2xl',
        'shadow-[0_20px_50px_rgba(0,0,0,0.8)]',
        'flex flex-col overflow-hidden',
        'max-h-[60vh] md:max-h-[65vh]',
      )}
      role="dialog"
      aria-label="AI chat with Justin's portfolio assistant"
      aria-hidden={!isOpen}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05] shrink-0 bg-black/20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary" />
          </span>
          <span className="text-brand-primary text-[13px] font-mono font-bold tracking-tight">Ask Justin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs font-mono tabular-nums">
            {remainingQueries}/{AI_AGENT.maxSessionQueries}
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            aria-label="Close chat"
            tabIndex={isOpen ? 0 : -1}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
      >
        {messages.length === 0 && !isQuerying && (
          <div className="space-y-4 py-4">
            <p className="text-white/30 text-[11px] font-mono text-center leading-relaxed max-w-[260px] mx-auto">
              Ask me anything about Justin's work, stack, or availability.
            </p>
            <div className="flex flex-wrap gap-2 justify-center px-4">
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  tabIndex={isOpen ? 0 : -1}
                  className="text-[11px] font-mono px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/45 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div className={cn("flex flex-col gap-1.5 max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
              <div
                className={cn(
                  'text-xs font-mono px-3.5 py-2.5 rounded-2xl leading-relaxed w-fit',
                  msg.role === 'user'
                    ? 'rounded-tr-none bg-brand-primary/10 border border-brand-primary/20 text-brand-primary/95 shadow-[0_0_12px_rgba(0,200,180,0.05)]'
                    : 'rounded-tl-none bg-white/[0.02] border border-white/[0.05] text-white/60',
                )}
              >
                {msg.role === 'user' ? msg.text : renderModelText(msg.text)}
              </div>
              {msg.footer && (
                <span className="text-[10px] font-mono text-white/20 px-2 select-none">
                  {msg.footer}
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {isQuerying && streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] text-xs font-mono px-3.5 py-2.5 rounded-2xl rounded-tl-none bg-white/[0.02] border border-white/[0.05] text-white/60 leading-relaxed">
              {renderModelText(streamingText)}
              <span className="animate-pulse text-brand-primary ml-0.5">█</span>
            </div>
          </motion.div>
        )}

        {isQuerying && !streamingText && (
          <div className="flex justify-start">
            <div className="text-xs font-mono px-3.5 py-2.5 text-white/30 flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span>thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.05] px-4 py-3 shrink-0 bg-bento-panel/80">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.02] border border-white/[0.06] rounded-full focus-within:border-brand-primary/30 focus-within:bg-white/[0.04] focus-within:shadow-[0_0_16px_rgba(0,200,180,0.04)] transition-all duration-300">
          <div className="relative flex-grow flex items-center min-w-0">
            <input
              id="ai-chat-drawer-input"
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={AI_AGENT.maxPromptLength}
              placeholder="Ask about Justin..."
              disabled={isQuerying || remainingQueries <= 0}
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                'w-full bg-transparent font-mono text-[16px] md:text-xs text-white/80 placeholder:text-white/25',
                'outline-none border-none p-0 focus:ring-0 focus:outline-none',
                'disabled:opacity-40',
              )}
              aria-label="Ask a question"
            />
          </div>
          <button
            onClick={() => send(input)}
            disabled={isQuerying || !input.trim() || remainingQueries <= 0}
            tabIndex={isOpen ? 0 : -1}
            className={cn(
              'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer',
              input.trim() && !isQuerying && remainingQueries > 0
                ? 'bg-brand-primary text-black hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(0,200,180,0.3)]'
                : 'text-white/20 bg-white/[0.02] cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send size={11} className={cn(input.trim() && !isQuerying && 'translate-x-[0.5px]')} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
