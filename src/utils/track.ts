export function track(event: string, data?: Record<string, unknown>) {
  (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } })
    .umami?.track(event, data);
}
