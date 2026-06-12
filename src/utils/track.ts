/**
 * track records a named analytics event (e.g. 'email-copy'), if analytics
 * is loaded.
 *
 * Fits in: call track('something') from a click handler to count an action.
 * Note:    safe to call always. If the Umami script isn't present (dev builds,
 *          blocked, not yet loaded) the optional-chaining just does nothing.
 *
 * For beginners ----------------------------------------------------------------
 * The Umami script attaches a `window.umami` object at runtime. TypeScript
 * doesn't know about it, so we cast `window` to a shape that has an optional
 * `umami`, then `umami?.track(...)` calls it only if it actually exists.
 * -----------------------------------------------------------------------------
 */
export function track(event: string, data?: Record<string, unknown>) {
  (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } })
    .umami?.track(event, data);
}
