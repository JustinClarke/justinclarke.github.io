import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callAIAgent, getQueryCount, incrementQueryCount } from './useAIAgent';

const SESSION_KEY = 'ai_query_count';

// callAIAgent's `aiChat` param defaults to the real `SITE.integrations.aiChat`
// (see useAIAgent.ts) so it works unmodified in the deployed app. Tests that
// exercise the network path inject this mock explicitly instead of relying on
// that default only the one dedicated "off" test below should ever see the
// real SITE value, and a fork that sets `aiChat: null` must not fail these.
const MOCK_AI_CHAT = { workerUrl: 'https://mock.test/worker' };

// Minimal sessionStorage shim for the node test environment.
const store: Record<string, string> = {};
const sessionStorageMock = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};
vi.stubGlobal('sessionStorage', sessionStorageMock);

function setQueryCount(n: number) {
  sessionStorageMock.setItem(SESSION_KEY, String(n));
}

beforeEach(() => {
  sessionStorageMock.removeItem(SESSION_KEY);
  vi.restoreAllMocks();
  vi.stubGlobal('sessionStorage', sessionStorageMock);
});

afterEach(() => {
  sessionStorageMock.removeItem(SESSION_KEY);
});

// Builds a minimal SSE ReadableStream from token strings
function makeSseStream(tokens: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const token of tokens) {
        // The worker proxy unwraps Gemini into { response: <token> } SSE chunks,
        // which is what callAIAgent parses.
        const chunk = JSON.stringify({ response: token });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
      }
      controller.close();
    },
  });
}

// ── session storage helpers ────────────────────────────────────────────────────

describe('getQueryCount / incrementQueryCount', () => {
  it('returns 0 when no key set', () => {
    expect(getQueryCount()).toBe(0);
  });

  it('increments correctly', () => {
    incrementQueryCount();
    incrementQueryCount();
    expect(getQueryCount()).toBe(2);
  });

  it('reads pre-set value', () => {
    setQueryCount(17);
    expect(getQueryCount()).toBe(17);
  });
});

// ── callAIAgent prompt validation ───────────────────────────────────────────

describe('callAIAgent prompt validation', () => {
  it('rejects prompts over 500 chars', async () => {
    const long = 'a'.repeat(501);
    const { lines } = await callAIAgent(long, [], undefined, undefined, MOCK_AI_CHAT);
    expect(lines[0].text).toMatch(/too long/i);
  });
});

// ── callAIAgent degradation contract ────────────────────────────────────────

describe('callAIAgent with aiChat integration off', () => {
  it('prints the not-configured line without touching the network', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const { lines } = await callAIAgent('test', [], undefined, undefined, null);
    expect(lines[0].text).toMatch(/not configured on this deployment/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ── callAIAgent network errors ──────────────────────────────────────────────

describe('callAIAgent network errors', () => {
  it('returns fallback on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const { lines } = await callAIAgent('test', [], undefined, undefined, MOCK_AI_CHAT);
    expect(lines[0].text).toMatch(/couldn't reach|server/i);
  });

  it('returns rate-limit message on 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, body: null }));
    const { lines } = await callAIAgent('test', [], undefined, undefined, MOCK_AI_CHAT);
    expect(lines[0].text).toMatch(/too many requests/i);
  });

  it('returns upstream error on 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, body: null }));
    const { lines } = await callAIAgent('test', [], undefined, undefined, MOCK_AI_CHAT);
    expect(lines[0].text).toMatch(/upstream|wrong/i);
  });
});

// ── callAIAgent streaming ───────────────────────────────────────────────────

describe('callAIAgent streaming', () => {
  it('assembles streamed tokens into a single response line', async () => {
    const tokens = ['Hello', ', Justin', ' here!'];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: makeSseStream(tokens),
    }));

    const received: string[] = [];
    const { lines, fullText } = await callAIAgent('test', [], t => received.push(t), undefined, MOCK_AI_CHAT);

    expect(received).toEqual(tokens);
    expect(fullText).toBe('Hello, Justin here!');
    // First line is now the AGENT badge header; the answer lives in a railed body line.
    expect(lines[0].t).toBe('ai-head');
    expect(lines.some(l => l.text.includes('Hello, Justin here!'))).toBe(true);
    expect(lines.some(l => l.t === 'ai-foot')).toBe(true);
  });

  it('returns no-response error on empty stream', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: makeSseStream([]),
    }));
    const { lines } = await callAIAgent('test', [], undefined, undefined, MOCK_AI_CHAT);
    expect(lines[0].text).toMatch(/no response/i);
  });
});

// ── callAIAgent history truncation hint ─────────────────────────────────────

describe('callAIAgent history passthrough', () => {
  it('passes history to fetch body', async () => {
    let capturedBody: any;
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return { ok: true, status: 200, body: makeSseStream(['ok']) };
    }));

    const history = [
      { role: 'user' as const, text: 'hi' },
      { role: 'model' as const, text: 'hello' },
    ];
    await callAIAgent('question', history, undefined, undefined, MOCK_AI_CHAT);
    expect(capturedBody.history).toEqual(history);
    expect(capturedBody.prompt).toBe('question');
  });
});
