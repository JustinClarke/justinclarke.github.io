import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  resolveCommand,
  getSidebarFunMessage,
  getConversationalPreamble,
  type TerminalLine,
  type SideEffectType,
  type CommandContext,
  type GitHubEvent,
} from '../pages/home/Hero/engine';
import { elevatorScroll } from '@/utils/scroll';
import { GITHUB_USERNAME } from '@/config/constants';

interface UseTerminalSessionOptions {
  onLaunchGame: (game: string) => void;
}

function readCmdHistory(): string[] {
  try { return JSON.parse(sessionStorage.getItem('term_cmd_history') || '[]'); } catch { return []; }
}

async function fetchGitHubActivity(username: string): Promise<GitHubEvent[]> {
  const cacheKey = 'term_gh_activity';
  const cacheTs = 'term_gh_activity_ts';
  try {
    const cached = sessionStorage.getItem(cacheKey);
    const ts = Number(sessionStorage.getItem(cacheTs) || '0');
    if (cached && Date.now() - ts < 5 * 60 * 1000) return JSON.parse(cached);
  } catch {}

  const res = await fetch(`https://api.github.com/users/${username}/events/public`);
  if (res.status === 403) throw Object.assign(new Error('rate-limited'), { code: 'rate-limited' });
  if (!res.ok) throw new Error('fetch-error');

  const data: any[] = await res.json();
  const events: GitHubEvent[] = data
    .filter((e: any) => e.type === 'PushEvent' || e.type === 'CreateEvent' || e.type === 'WatchEvent')
    .slice(0, 10)
    .map((e: any) => ({
      type: e.type as string,
      repo: (e.repo?.name ?? '').replace(`${username}/`, ''),
      createdAt: new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      branch: e.payload?.ref?.replace('refs/heads/', ''),
      commitMessages: (e.payload?.commits ?? []).slice(0, 2).map((c: any) => c.message?.split('\n')[0]),
    }));

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(events));
    sessionStorage.setItem(cacheTs, String(Date.now()));
  } catch {}

  return events;
}

export function useTerminalSession({ onLaunchGame }: UseTerminalSessionOptions) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastExitCode, setLastExitCode] = useState<number | null>(null);
  const sessionStartMs = useRef(Date.now());
  const sudoCount = useRef(0);

  const handleCommand = useCallback(async (
    cmd: string,
    source: 'terminal' | 'sidebar' = 'terminal'
  ) => {
    const raw = cmd.trim();
    if (!raw) return;
    if (source === 'terminal' && isTyping) return;

    if (raw.toLowerCase() === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    if (source === 'sidebar') {
      setInputValue('');
      const funMsg = getSidebarFunMessage(raw);
      setHistory(prev => [
        ...prev,
        { t: 'prompt', text: `~$ ${raw}` },
        { t: 'g', text: `[SYSTEM]: ${funMsg}` },
      ]);

      const normalizedCmd = raw.toLowerCase();
      if (normalizedCmd === 'resume' || normalizedCmd === 'resumé') {
        const link = document.createElement('a');
        link.href = '/resources/JustinClarke_resume.pdf';
        link.download = 'JustinClarke_resume.pdf';
        link.click();
      } else if (normalizedCmd === 'connect') {
        navigate('/connect');
      } else if (normalizedCmd === 'timeline') {
        elevatorScroll('experience', 1.8, 30);
      } else if (normalizedCmd === 'the long version' || normalizedCmd === 'the-long-version') {
        navigate('/the-long-version');
      } else if (normalizedCmd === 'projects') {
        elevatorScroll('projects', 1.8, 30);
      }
      return;
    }

    if (raw.toLowerCase() === 'snake' || raw.toLowerCase() === 'play snake') {
      if (window.innerWidth < 1024) {
        setHistory(prev => [
          ...prev,
          { t: 'prompt', text: `~$ ${raw}` },
          { t: 'o', text: '[SYSTEM] - snake.exe is a desktop-only experience.' },
          { t: 'muted', text: 'Come back on a bigger screen. Worth it.' },
        ]);
        setInputValue('');
        return;
      }
    }

    if (raw.toLowerCase() === 'sudo') sudoCount.current += 1;

    const ctx: CommandContext = {
      cmdHistory: readCmdHistory(),
      sessionStartMs: sessionStartMs.current,
      sudoCount: sudoCount.current,
    };

    const result = resolveCommand(raw, ctx);
    setLastExitCode(result.exitCode ?? 0);

    setIsTyping(true);
    setInputValue('');

    setHistory(prev => [...prev, { t: 'prompt', text: `~$ ${raw}` }]);
    await new Promise(res => setTimeout(res, 220));

    const preamble = getConversationalPreamble(raw);
    setHistory(prev => [
      ...prev,
      { t: 'success', text: `[SYSTEM]: ${preamble}` },
      ...result.lines,
    ]);

    setIsTyping(false);

    const commandEffect = result.effect ?? null;

    if (commandEffect) {
      const fadeDelay = Math.max(500, result.lines.length * 35 + 300);
      await new Promise(res => setTimeout(res, fadeDelay));

      if (commandEffect.type === 'scroll' && commandEffect.payload) {
        elevatorScroll(commandEffect.payload, 1.8, 30);
      } else if (commandEffect.type === 'contact') {
        navigate('/connect');
      } else if (commandEffect.type === 'download') {
        const link = document.createElement('a');
        link.href = '/resources/JustinClarke_resume.pdf';
        link.download = 'JustinClarke_resume.pdf';
        link.click();
      } else if (commandEffect.type === 'snake') {
        onLaunchGame('snake');
      } else if (commandEffect.type === 'the-long-version') {
        navigate('/the-long-version');
      } else if (commandEffect.type === 'github') {
        // Fetch GitHub activity and append result lines
        let activity: CommandContext['githubActivity'];
        try {
          activity = await fetchGitHubActivity(GITHUB_USERNAME);
        } catch (err: any) {
          activity = err?.code === 'rate-limited' ? 'rate-limited' : 'error';
        }
        const ghResult = resolveCommand(raw, { ...ctx, githubActivity: activity });
        setHistory(prev => [...prev, ...ghResult.lines]);
      }
    }
  }, [navigate, isTyping, onLaunchGame]);

  return {
    inputValue, setInputValue,
    history, setHistory,
    isTyping,
    lastExitCode,
    handleCommand,
  };
}
