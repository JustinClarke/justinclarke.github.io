/**
 * useTerminalSession runs the interactive terminal: takes a typed command,
 * asks the engine what to print, then plays it back into the on-screen history
 * and performs any side effect (scroll, navigate, download, launch the game).
 *
 * Fits in: called by the Hero component. Returns the input value, the printed
 *          history, typing flags, and the `handleCommand` function the UI calls.
 * Note:    the engine (`Hero/engine.ts`) is PURE it just turns a command
 *          string into lines of text and a description of an effect. This hook
 *          is the "impure" half that actually touches the page (navigation,
 *          timers, the network). Keeping them apart makes the engine testable.
 */
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
import { SITE } from '@/content';
import { debug, track } from '@/utils';
import { useAIAgent } from './useAIAgent';

const log = debug('terminal');

// The download attribute wants a bare filename; derive it from the public path
// so the two can never drift.
const RESUME_FILENAME = SITE.resumePdf.split('/').pop() ?? 'resume.pdf';

interface UseTerminalSessionOptions {
  onLaunchGame: (game: string) => void;
}

// Read previously-typed commands back out of sessionStorage (used by the engine
// for context, e.g. an easter egg if you repeat yourself). Returns [] on any
// problem rather than crashing.
function readCmdHistory(): string[] {
  try { return JSON.parse(sessionStorage.getItem('term_cmd_history') || '[]'); } catch { return []; }
}

/**
 * Fetch recent public GitHub activity for the `github` command. Cached in
 * sessionStorage for 5 minutes so repeat runs don't hammer GitHub's API (which
 * rate-limits anonymous callers).
 */
async function fetchGitHubActivity(username: string): Promise<GitHubEvent[]> {
  const cacheKey = 'term_gh_activity';
  const cacheTs = 'term_gh_activity_ts';
  // Return the cached copy if it's younger than 5 minutes (5 * 60 * 1000 ms).
  try {
    const cached = sessionStorage.getItem(cacheKey);
    const ts = Number(sessionStorage.getItem(cacheTs) || '0');
    if (cached && Date.now() - ts < 5 * 60 * 1000) return JSON.parse(cached);
  } catch { }

  const res = await fetch(`https://api.github.com/users/${username}/events/public`);
  // 403 from GitHub means "too many anonymous requests" surface that specific
  // case so the engine can print a friendly "rate-limited" message.
  if (res.status === 403) throw Object.assign(new Error('rate-limited'), { code: 'rate-limited' });
  if (!res.ok) throw new Error('fetch-error');

  const data: any[] = await res.json();
  // Keep only the event kinds we display, take the 10 newest, and reshape each
  // raw GitHub event into the tidy { type, repo, createdAt, ... } shape we want.
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
  } catch { }

  return events;
}

export function useTerminalSession({ onLaunchGame }: UseTerminalSessionOptions) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');           // what's typed in the box
  const [history, setHistory] = useState<TerminalLine[]>([]); // the printed lines above it
  const [isTyping, setIsTyping] = useState(false);            // true while we "type out" output
  const [lastExitCode, setLastExitCode] = useState<number | null>(null); // 0 = ok, non-zero = error
  const { askAgent, isQuerying } = useAIAgent();

  // Bookkeeping the UI never shows: when the session began, and how many times
  // 'sudo' was typed (an easter egg). Refs so updating them doesn't re-render.
  const sessionStartMs = useRef(Date.now());
  const sudoCount = useRef(0);

  // Memoised because Hero lists `handleCommand` in effect dependency arrays a
  // fresh identity every render would make those effects re-run constantly.
  const handleCommand = useCallback(async (
    cmd: string,
    source: 'terminal' | 'sidebar' = 'terminal'
  ) => {
    const raw = cmd.trim();          // remove leading/trailing spaces
    if (!raw) return;                // ignore empty input
    if (source === 'terminal' && (isTyping || isQuerying)) return; // don't accept a new command mid-typing or mid-AI call
    log('command', { raw, source });
    track('terminal-command', { command: raw, source });

    if (raw.toLowerCase() === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    }

    // ── Sidebar clicks ────────────────────────────────────────────────────────
    // Commands triggered by clicking a sidebar menu item (not typed) get a short
    // canned message and immediately do their action no typing animation.
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
        link.href = SITE.resumePdf;
        link.download = RESUME_FILENAME;
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

    if (raw.toLowerCase() === 'sudo') sudoCount.current += 1;

    // ── Normal typed command: DECIDE, then PERFORM ──────────────────────────────
    // Bundle up the context the engine may want (past commands, session age, how
    // many times you've tried 'sudo'), then ask the pure engine what to output.
    const ctx: CommandContext = {
      cmdHistory: readCmdHistory(),
      sessionStartMs: sessionStartMs.current,
      sudoCount: sudoCount.current,
    };

    const result = resolveCommand(raw, ctx);
    setLastExitCode(result.exitCode ?? 0);

    setIsTyping(true);   // lock input + show a "typing" cursor
    setInputValue('');

    // Echo the command the user typed, wait a beat, then print the response  
    // the small delays make it feel like a real machine responding.
    setHistory(prev => [...prev, { t: 'prompt', text: `~$ ${raw}` }]);
    await new Promise(res => setTimeout(res, 220));

    const commandEffect = result.effect ?? null;
    const isAiQuery = commandEffect?.type === 'ai';

    const preamble = getConversationalPreamble(raw);
    setHistory(prev => [
      ...prev,
      ...(isAiQuery ? [] : [{ t: 'success' as const, text: `[SYSTEM]: ${preamble}` }]),
      ...result.lines,
    ]);

    setIsTyping(false);  // typing finished, re-enable input

    // ── Side effect (if any) ────────────────────────────────────────────────────
    // Some commands DO something after printing scroll, navigate, download,
    // launch the game. The engine only NAMED the effect; we carry it out here.

    if (commandEffect) {
      log('effect', commandEffect.type);
      // Wait for the output lines to visually finish before acting, so we don't
      // yank the page away mid-print. Longer output → longer wait.
      const fadeDelay = Math.max(500, result.lines.length * 35 + 300);
      await new Promise(res => setTimeout(res, fadeDelay));

      if (commandEffect.type === 'scroll' && commandEffect.payload) {
        elevatorScroll(commandEffect.payload, 1.8, 30);
      } else if (commandEffect.type === 'contact') {
        navigate('/connect');
      } else if (commandEffect.type === 'download') {
        const link = document.createElement('a');
        link.href = SITE.resumePdf;
        link.download = RESUME_FILENAME;
        link.click();
      } else if (['snake', 'pong', 'tetris', 'space_invaders'].includes(commandEffect.type)) {
        onLaunchGame(commandEffect.type);
      } else if (commandEffect.type === 'the-long-version') {
        navigate('/the-long-version');
      } else if (commandEffect.type === 'ai' && commandEffect.aiQuery) {
        // Replace the "thinking..." placeholder with the live agent block: a
        // badge header (pulsing dot while streaming) + a railed body line that
        // grows as tokens arrive.
        setHistory(prev => [
          ...prev.slice(0, -1),
          { t: 'ai-head' as const, text: 'AGENT', streaming: true },
          { t: 'g' as const, text: '', gutter: true, streaming: true },
        ]);

        const onToken = (token: string) => {
          setHistory(prev => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx]?.streaming) {
              updated[lastIdx] = { ...updated[lastIdx], text: updated[lastIdx].text + token };
            }
            return updated;
          });
        };

        const finalLines = await askAgent(commandEffect.aiQuery, onToken);
        // Swap the two streamed placeholder lines for the hook's authoritative
        // assembled block, dropping the streaming flags so the cursor stops.
        setHistory(prev => [...prev.slice(0, -2), ...finalLines]);
      } else if (commandEffect.type === 'github') {
        // The `github` command needs live data, so it's a two-step dance:
        //   1. fetch the activity (or capture why it failed),
        //   2. ask the engine AGAIN, now WITH that data, to format the lines.
        let activity: CommandContext['githubActivity'];
        try {
          activity = await fetchGitHubActivity(SITE.social.github);
        } catch (err: any) {
          // Turn the error into a value the engine knows how to render nicely.
          activity = err?.code === 'rate-limited' ? 'rate-limited' : 'error';
        }
        const ghResult = resolveCommand(raw, { ...ctx, githubActivity: activity });
        setHistory(prev => [...prev, ...ghResult.lines]);
      }
    }
  }, [navigate, isTyping, isQuerying, onLaunchGame, askAgent]);

  return {
    inputValue, setInputValue,
    history, setHistory,
    isTyping,
    lastExitCode,
    handleCommand,
  };
}
