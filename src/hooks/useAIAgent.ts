import { useState, useRef, useCallback } from 'react';
import { AI_AGENT } from '@/config/constants';
import type { TerminalLine } from '@/pages/home/Hero/engine';

type LinePart = NonNullable<TerminalLine['parts']>[number];

// Split a line into coloured segments: **bold** → brand, `code` → yellow,
// everything else → bright body text ('t' maps to term-fg in the renderer).
function parseInline(text: string): LinePart[] {
  const parts: LinePart[] = [];
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 't', text: text.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ t: 'brand', text: m[1] });
    else parts.push({ t: 'viz-mac-yellow', text: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: 't', text: text.slice(last) });
  return parts.length ? parts : [{ t: 't', text }];
}

function stripMd(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1');
}

export interface AIResponseMeta {
  model?: string;
  elapsedMs?: number;
  tokens?: number;
}

// Turn the model's raw markdown-ish answer into styled terminal lines: a badge
// header, a left-railed body (bullets, numbered items, short "Heading:" lines),
// and a footer carrying model/latency/token metadata.
function parseAIResponseToLines(raw: string, meta?: AIResponseMeta): TerminalLine[] {
  const body = raw.replace(/^\[AGENT\]:\s*/i, '').trim();
  const lines: TerminalLine[] = [{ t: 'ai-head', text: 'AGENT' }];
  const paragraphs = body.split(/\n{2,}/).filter(p => p.trim());

  paragraphs.forEach((para, pi) => {
    // Blank rail spacer between paragraphs keeps the block breathing.
    if (pi > 0) lines.push({ t: 'g', text: '', gutter: true });

    for (const l of para.split('\n')) {
      const trimmed = l.trim();
      if (!trimmed) continue;

      // Bullets: -, *, • or "1." numbered items → "▸" marker.
      const bullet = /^([-*•]|\d+\.)\s+/.exec(trimmed);
      if (bullet) {
        const content = trimmed.slice(bullet[0].length);
        lines.push({
          t: 'g',
          text: `  ▸ ${stripMd(content)}`,
          gutter: true,
          parts: [{ t: 'brand', text: '  ▸ ' }, ...parseInline(content)],
        });
        continue;
      }

      // Short "Heading:" lines become brand-coloured section headers.
      if (/^[\w .,'&/()-]{1,42}:$/.test(trimmed)) {
        lines.push({ t: 'g', text: trimmed, gutter: true, parts: [{ t: 'brand', text: trimmed }] });
        continue;
      }

      lines.push({ t: 'g', text: stripMd(trimmed), gutter: true, parts: parseInline(trimmed) });
    }
  });

  // Footer: model · latency · token estimate (omit any piece we don't have).
  const metaBits: string[] = [];
  if (meta?.model) metaBits.push(meta.model);
  if (meta?.elapsedMs != null) metaBits.push(`${(meta.elapsedMs / 1000).toFixed(1)}s`);
  if (meta?.tokens != null) metaBits.push(`~${meta.tokens} tok`);
  lines.push({ t: 'ai-foot', text: metaBits.join('   ·   ') || 'response complete' });

  return lines;
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
  footer?: string;
}

interface UseAIAgentReturn {
  askAgent: (query: string, onToken?: (token: string) => void) => Promise<TerminalLine[]>;
  isQuerying: boolean;
  remainingQueries: number;
  conversationHistory: AIMessage[];
  clearHistory: () => void;
}

const SESSION_KEY = 'ai_query_count';

export function getQueryCount(): number {
  try { return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10); } catch { return 0; }
}

export function incrementQueryCount(): void {
  try { sessionStorage.setItem(SESSION_KEY, String(getQueryCount() + 1)); } catch { /* ignore */ }
}

/**
 * Core fetch logic extracted for testability. Handles the full SSE streaming
 * cycle and returns finalised terminal lines. Stateless — all state mutation
 * (React state, history ref) is done by the hook wrapper around this.
 */
export async function callAIAgent(
  query: string,
  history: AIMessage[],
  onToken?: (token: string) => void,
  signal?: AbortSignal,
): Promise<{ lines: TerminalLine[]; fullText: string; timedOut: boolean }> {
  const err = (text: string) => ({ lines: [{ t: 'r' as const, text }], fullText: '', timedOut: false });

  if (query.length > AI_AGENT.maxPromptLength) {
    return err(`ask: question too long (max ${AI_AGENT.maxPromptLength} characters).`);
  }

  let fullText = '';
  let timedOut = false;
  const started = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const buildMeta = (): AIResponseMeta => ({
    model: AI_AGENT.model,
    elapsedMs: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - started,
    tokens: Math.max(1, Math.round(fullText.length / 4)),
  });

  try {
    const res = await fetch(`${AI_AGENT.proxyUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query, history }),
      signal,
    });

    if (res.status === 429) return err('[AGENT]: too many requests. wait a moment and try again.');
    if (!res.ok) return err('[AGENT]: something went wrong upstream. try again.');
    if (!res.body) return err('[AGENT]: no response body received.');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const sseLines = buffer.split('\n');
      buffer = sseLines.pop() || '';
      for (const sseLine of sseLines) {
        if (!sseLine.startsWith('data: ')) continue;
        const data = sseLine.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const token: string = json.response ?? '';
          if (token) { fullText += token; onToken?.(token); }
        } catch { /* malformed chunk — skip */ }
      }
    }
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      timedOut = true;
      if (fullText) {
        return {
          lines: [...parseAIResponseToLines(fullText, buildMeta()), { t: 'r', text: '↳ response timed out — partial answer above.' }],
          fullText,
          timedOut,
        };
      }
      return { lines: [{ t: 'r', text: '[AGENT]: response timed out. try again.' }], fullText: '', timedOut };
    }
    if (fullText) {
      return {
        lines: [...parseAIResponseToLines(fullText, buildMeta()), { t: 'r', text: '↳ response interrupted.' }],
        fullText,
        timedOut: false,
      };
    }
    return err("[AGENT]: couldn't reach the server. try again later.");
  }

  if (!fullText) return err('[AGENT]: no response received.');
  return { lines: parseAIResponseToLines(fullText, buildMeta()), fullText, timedOut };
}

export function useAIAgent(): UseAIAgentReturn {
  const [isQuerying, setIsQuerying] = useState(false);
  const [remaining, setRemaining] = useState(() => AI_AGENT.maxSessionQueries - getQueryCount());
  const historyRef = useRef<AIMessage[]>([]);

  const askAgent = useCallback(async (
    query: string,
    onToken?: (token: string) => void,
  ): Promise<TerminalLine[]> => {
    const count = getQueryCount();
    if (count >= AI_AGENT.maxSessionQueries) {
      return [{ t: 'r', text: `[AGENT]: session limit reached (${AI_AGENT.maxSessionQueries}/${AI_AGENT.maxSessionQueries}). refresh the page for a new session.` }];
    }

    setIsQuerying(true);
    incrementQueryCount();
    setRemaining(AI_AGENT.maxSessionQueries - getQueryCount());

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_AGENT.requestTimeoutMs);

    const history = historyRef.current.slice(-AI_AGENT.maxHistoryTurns * 2).map(h => ({
      ...h,
      text: h.text.slice(0, 490),
    }));
    const { lines, fullText, timedOut } = await callAIAgent(query, history, onToken, controller.signal);

    clearTimeout(timeout);
    setIsQuerying(false);

    if (!timedOut && fullText) {
      historyRef.current = [...history, { role: 'user', text: query }, { role: 'model', text: fullText }];
    }

    return lines;
  }, []);

  return {
    askAgent,
    isQuerying,
    remainingQueries: remaining,
    conversationHistory: historyRef.current,
    clearHistory: useCallback(() => { historyRef.current = []; }, []),
  };
}
