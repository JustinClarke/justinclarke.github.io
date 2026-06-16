import { SYSTEM_PROMPT } from './system-prompt.js';

const MAX_PROMPT_LENGTH = 500;
const MAX_HISTORY_ITEMS = 12;
const MAX_HISTORY_TEXT_LENGTH = 500;

function getCorsHeaders(allowedOrigin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS || 'https://justinclarke.github.io,http://localhost:3000')
      .split(',')
      .map(o => o.trim());

    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    const corsHeaders = getCorsHeaders(allowedOrigin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, corsHeaders);
    }

    // Server-side rate limiting via Cloudflare Rate Limiting binding.
    // CF-Connecting-IP is set by Cloudflare and cannot be spoofed by the client.
    const ip = request.headers.get('CF-Connecting-IP') ?? 'anon';
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return jsonResponse({ error: 'rate_limited' }, 429, {
        ...corsHeaders,
        'Retry-After': '60',
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'invalid_json' }, 400, corsHeaders);
    }

    const { prompt, history = [] } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return jsonResponse({ error: 'missing_prompt' }, 400, corsHeaders);
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return jsonResponse({ error: 'prompt_too_long' }, 400, corsHeaders);
    }
    if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
      return jsonResponse({ error: 'invalid_history' }, 400, corsHeaders);
    }
    for (const item of history) {
      if (!item || typeof item !== 'object') return jsonResponse({ error: 'invalid_history_item' }, 400, corsHeaders);
      if (item.role !== 'user' && item.role !== 'model') return jsonResponse({ error: 'invalid_history_role' }, 400, corsHeaders);
      if (typeof item.text !== 'string' || item.text.length > MAX_HISTORY_TEXT_LENGTH) return jsonResponse({ error: 'invalid_history_text' }, 400, corsHeaders);
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role === 'model' ? 'assistant' : 'user', content: h.text })),
      { role: 'user', content: prompt },
    ];

    let aiStream;
    try {
      aiStream = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages,
        stream: true,
        max_tokens: 400,
        temperature: 0.7,
      });
    } catch (e) {
      return jsonResponse({ error: 'ai_error', detail: String(e) }, 502, corsHeaders);
    }

    return new Response(aiStream, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  },
};
