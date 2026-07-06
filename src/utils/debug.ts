/**
 * debug a tiny, namespaced logging helper for tracing the app at runtime.
 *
 * Fits in: imported anywhere you want to "watch" what a feature is doing.
 *          Used pass-by-pass across the codebase (hero, f1, terminal, …).
 * Note:    it is SILENT by default. Nothing prints in production unless you
 *          explicitly switch it on, so we never ship console noise to visitors.
 *
 * Usage:   const log = debug('hero');  then  log('boot finished', phase);
 *          → prints  [hero] boot finished 3  but only when enabled.
 *
 * Two ways to turn logging on:
 *
 *   • Build-time:  put  VITE_DEBUG=1  in your .env file, restart `npm run dev`.
 *                  (this enables EVERY namespace)
 *
 *   • Runtime:     open the browser console on ANY build (even production) and
 *                  type one of:
 *                      localStorage.debug = '*'          // everything
 *                      localStorage.debug = 'hero,f1'    // just these areas
 *                      localStorage.debug = ''           // turn it back off
 *                  then refresh the page.
 */

/** A logger is just a function you call like `console.log`. */
type Logger = (...args: unknown[]) => void;

/**
 * Read the runtime allow-list the user may have set in the browser console
 * (e.g. `localStorage.debug = 'hero,f1'`). Returns the raw string, or '' if
 * nothing is set or localStorage is unavailable (e.g. during server prerender).
 * try/catch because private-mode / blocked-cookie browsers throw on localStorage.
 */
function readRuntimeFilter(): string {
  try {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem('debug') ?? '';
  } catch {
    return '';
  }
}

/**
 * Decide whether a given namespace ("hero", "f1", …) should print right now.
 */
function isEnabled(namespace: string): boolean {
  // Global build-time switch: VITE_DEBUG=1 turns on every namespace.
  if (import.meta.env.VITE_DEBUG === '1' || import.meta.env.VITE_DEBUG === 'true') {
    return true;
  }

  // Otherwise fall back to the runtime allow-list from localStorage.
  const filter = readRuntimeFilter();
  if (!filter) return false;            // nothing set → stay silent
  if (filter === '*') return true;      // '*' means "show everything"

  return filter.split(',').some((part) => part.trim() === namespace);
}

/**
 * Create a logger bound to one area of the app.
 *
 * @param namespace short label for the feature, e.g. 'hero', 'f1', 'terminal'.
 * @returns a function you call exactly like `console.log`.
 *
 * @example
 *   const log = debug('terminal');
 *   log('command run', cmd);   // [terminal] command run "help"
 */
export function debug(namespace: string): Logger {
  return (...args: unknown[]) => {
    // Re-checked per call so flipping `localStorage.debug` takes effect live.
    if (!isEnabled(namespace)) return;

    // The `[namespace]` prefix makes it obvious in the console which feature
    // each line came from when several are logging at once.
    console.log(`%c[${namespace}]`, 'color:#888;font-weight:bold', ...args);
  };
}
