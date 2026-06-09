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
 *
 * For beginners ----------------------------------------------------------------
 * Think of a command's life in two stages:
 *   1. DECIDE   `resolveCommand('help')` returns { lines: [...], effect: ... }.
 *                 This is pure logic, no page changes. (lives in engine.ts)
 *   2. PERFORM  this hook prints those lines one moment after another (to feel
 *                 like real typing) and then carries out the effect.
 * Splitting "decide" from "perform" is a common, powerful pattern: the hard
 * logic can be unit-tested without a browser.
 * -----------------------------------------------------------------------------
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
import { GITHUB_USERNAME } from '@/config/constants';
import { debug } from '@/utils';

const log = debug('terminal');

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
 * Fetch Justin's recent public GitHub activity for the `github` command.
 *
 * LEARN: `async`/`await` is how JavaScript waits for slow things (like a network
 *    request) without freezing the page. An `async` function always returns a
 *    Promise a placeholder for "a value that will arrive later." `await`
 *    pauses inside the function until that value is ready.
 *
 * We cache the result in sessionStorage for 5 minutes so repeatedly running the
 * command doesn't hammer GitHub's API (which rate-limits anonymous callers).
 */
async function fetchGitHubActivity(username: string): Promise<GitHubEvent[]> {
  const cacheKey = 'term_gh_activity';
  const cacheTs = 'term_gh_activity_ts';
  // Return the cached copy if it's younger than 5 minutes (5 * 60 * 1000 ms).
  try {
    const cached = sessionStorage.getItem(cacheKey);
    const ts = Number(sessionStorage.getItem(cacheTs) || '0');
    if (cached && Date.now() - ts < 5 * 60 * 1000) return JSON.parse(cached);
  } catch {}

  // LEARN: fetch(...) makes an HTTP request and returns a Promise of the
  //    response. We `await` it to get the actual response object.
  const res = await fetch(`https://api.github.com/users/${username}/events/public`);
  // 403 from GitHub means "too many anonymous requests" surface that specific
  // case so the engine can print a friendly "rate-limited" message.
  if (res.status === 403) throw Object.assign(new Error('rate-limited'), { code: 'rate-limited' });
  if (!res.ok) throw new Error('fetch-error');

  const data: any[] = await res.json();
  // Keep only the event kinds we display, take the 10 newest, and reshape each
  // raw GitHub event into the tidy { type, repo, createdAt, ... } shape we want.
  // LEARN: .filter() keeps matching items, .slice() takes a sub-range, .map()
  //    transforms each item chaining them reads like a little pipeline.
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
  // LEARN: useNavigate() gives us a function to change pages programmatically
  //    (the code equivalent of clicking a link).
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');           // what's typed in the box
  const [history, setHistory] = useState<TerminalLine[]>([]); // the printed lines above it
  const [isTyping, setIsTyping] = useState(false);            // true while we "type out" output
  const [lastExitCode, setLastExitCode] = useState<number | null>(null); // 0 = ok, non-zero = error

  // LEARN: useRef holds a value that survives re-renders WITHOUT causing one when
  //    it changes (unlike state). Perfect for bookkeeping the UI doesn't show:
  //    when the session began, and how many times 'sudo' was typed (an easter egg).
  const sessionStartMs = useRef(Date.now());
  const sudoCount = useRef(0);

  // LEARN: useCallback memoises this function so it keeps the SAME identity
  //    between renders (unless its dependencies change). That matters because
  //    Hero lists `handleCommand` in effect dependency arrays a fresh function
  //    every render would make those effects re-run constantly.
  const handleCommand = useCallback(async (
    cmd: string,
    source: 'terminal' | 'sidebar' = 'terminal'
  ) => {
    const raw = cmd.trim();          // remove leading/trailing spaces
    if (!raw) return;                // ignore empty input
    if (source === 'terminal' && isTyping) return; // don't accept a new command mid-typing
    log('command', { raw, source });

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
      // LEARN: setHistory(prev => [...prev, newItem]) is the standard React way
      //    to add to a list in state: make a NEW array containing the old items
      //    (`...prev` spreads them) plus the new ones. We never edit the old
      //    array in place React only re-renders when it sees a new array.
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

    // ── Snake game guard ──────────────────────────────────────────────────────
    // The game needs a keyboard + room, so block it on small screens with a
    // friendly note instead of launching something unplayable.
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

    // ── Normal typed command: DECIDE, then PERFORM ──────────────────────────────
    // Bundle up the context the engine may want (past commands, session age, how
    // many times you've tried 'sudo'), then ask the pure engine what to output.
    const ctx: CommandContext = {
      cmdHistory: readCmdHistory(),
      sessionStartMs: sessionStartMs.current,
      sudoCount: sudoCount.current,
    };

    const result = resolveCommand(raw, ctx);
    // LEARN: `result.exitCode ?? 0` means "use exitCode, but if it's null/
    //    undefined, use 0 instead." `??` is the nullish-coalescing operator.
    setLastExitCode(result.exitCode ?? 0);

    setIsTyping(true);   // lock input + show a "typing" cursor
    setInputValue('');

    // Echo the command the user typed, wait a beat, then print the response —
    // the small delays make it feel like a real machine responding.
    setHistory(prev => [...prev, { t: 'prompt', text: `~$ ${raw}` }]);
    // LEARN: `await new Promise(res => setTimeout(res, 220))` is a one-line way to
    //    "pause for 220ms." setTimeout calls `res` after the delay, which
    //    resolves the Promise, which lets the awaited line continue.
    await new Promise(res => setTimeout(res, 220));

    const preamble = getConversationalPreamble(raw);
    setHistory(prev => [
      ...prev,
      { t: 'success', text: `[SYSTEM]: ${preamble}` },
      ...result.lines,
    ]);

    setIsTyping(false);  // typing finished, re-enable input

    // ── Side effect (if any) ────────────────────────────────────────────────────
    // Some commands DO something after printing scroll, navigate, download,
    // launch the game. The engine only NAMED the effect; we carry it out here.
    const commandEffect = result.effect ?? null;

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
        link.href = '/resources/JustinClarke_resume.pdf';
        link.download = 'JustinClarke_resume.pdf';
        link.click();
      } else if (commandEffect.type === 'snake') {
        onLaunchGame('snake');
      } else if (commandEffect.type === 'the-long-version') {
        navigate('/the-long-version');
      } else if (commandEffect.type === 'github') {
        // The `github` command needs live data, so it's a two-step dance:
        //   1. fetch the activity (or capture why it failed),
        //   2. ask the engine AGAIN, now WITH that data, to format the lines.
        let activity: CommandContext['githubActivity'];
        try {
          activity = await fetchGitHubActivity(GITHUB_USERNAME);
        } catch (err: any) {
          // Turn the error into a value the engine knows how to render nicely.
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
