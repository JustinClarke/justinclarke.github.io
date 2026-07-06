import { describe, it, expect, vi } from 'vitest';
import { formatTimeAgo } from './NowPlaying';
import { fetchLastFmTrack } from '../hooks/useLastFm';

// ── degradation contract ───────────────────────────────────────────────────────
// SITE.integrations.lastFm: null must mean "no fetch, no track" useLastFm then
// settles with loading=false/track=null and NowPlaying's early return hides the badge.
describe('fetchLastFmTrack with a null integration', () => {
  it('resolves null without touching the network', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    await expect(fetchLastFmTrack(null)).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe('formatTimeAgo', () => {
  it('returns empty string for undefined minutes', () => {
    expect(formatTimeAgo(undefined)).toBe('');
  });

  it('returns just now for 0 minutes', () => {
    expect(formatTimeAgo(0)).toBe('just now');
  });

  it('returns m ago for minutes less than 60', () => {
    expect(formatTimeAgo(5)).toBe('5m ago');
    expect(formatTimeAgo(59)).toBe('59m ago');
  });

  it('returns h ago for minutes between 60 and 1439', () => {
    expect(formatTimeAgo(60)).toBe('1h ago');
    expect(formatTimeAgo(120)).toBe('2h ago');
    expect(formatTimeAgo(1439)).toBe('23h ago');
  });

  it('returns d ago for minutes 1440 or more', () => {
    expect(formatTimeAgo(1440)).toBe('1d ago');
    expect(formatTimeAgo(2880)).toBe('2d ago');
    expect(formatTimeAgo(10000)).toBe('6d ago');
  });
});
