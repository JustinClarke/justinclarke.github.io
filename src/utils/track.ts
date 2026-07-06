/**
 * track records a named analytics event (e.g. 'email-copy'), if analytics
 * is loaded.
 *
 * Fits in: call track('something') from a click handler to count an action.
 * Note:    safe to call always. If the Umami script isn't present (dev builds,
 *          blocked, not yet loaded) the optional-chaining just does nothing.
 */
export function track(event: string, data?: Record<string, unknown>) {
  (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } })
    .umami?.track(event, data);
}
