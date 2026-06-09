/**
 * debug a tiny, namespaced logging helper for tracing the app at runtime.
 *
 * Fits in: imported anywhere you want to "watch" what a feature is doing.
 *          Used pass-by-pass across the codebase (hero, f1, terminal, …).
 * Note:    it is SILENT by default. Nothing prints in production unless you
 *          explicitly switch it on, so we never ship console noise to visitors.
 *
 * For beginners ----------------------------------------------------------------
 * In plain HTML you'd debug by sprinkling `console.log(...)` everywhere and then
 * deleting them all later. That gets messy fast. This helper is a cleaner way:
 *
 *   1. You ask for a logger that is "labelled" with an area of the app:
 *
 *        const log = debug('hero');        // LEARN: `log` is now a function
 *
 *   2. You call that logger like console.log:
 *
 *        log('boot finished', phase);      // prints:  [hero] boot finished 3
 *
 *   3. By default it prints NOTHING. You turn it on when you want to look.
 *
 * Why is `debug('hero')` a function that returns another function? That pattern
 * is called a "closure" the returned function remembers the label 'hero' you
 * gave it, so every later call is automatically prefixed for you. Think of it
 * like a rubber stamp you made once and now bang on every message.
 * -----------------------------------------------------------------------------
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
 *
 * LEARN: We wrap this in try/catch because some browser modes (private windows,
 *    blocked cookies) throw when you touch localStorage. A crash here would
 *    take the whole app down, so we swallow the error and pretend it's empty.
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
 *
 * LEARN: `import.meta.env.VITE_DEBUG` is Vite's way of reading values from your .env
 *    file at build time. It is the global on/off switch.
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

  // LEARN: `'hero,f1'.split(',')` becomes the array ['hero', 'f1']. `.some(...)`
  //    returns true if AT LEAST ONE entry matches our namespace. `.trim()`
  //    removes stray spaces so 'hero, f1' still works.
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
    // LEARN: We re-check on every call (not once up front) so that flipping
    //    `localStorage.debug` in the console takes effect without a code change.
    if (!isEnabled(namespace)) return;

    // The `[namespace]` prefix makes it obvious in the console which feature
    // each line came from when several are logging at once.
    // eslint-disable-next-line no-console
    console.log(`%c[${namespace}]`, 'color:#888;font-weight:bold', ...args);
  };
}
