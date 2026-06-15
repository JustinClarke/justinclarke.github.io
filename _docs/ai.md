# AI Agent Integration Plan: Portfolio Terminal Assistant & CommandDock

This document is the definitive architecture, implementation path, and operational spec for embedding a **Gemini-powered AI assistant** into the portfolio at [justinclarke.github.io](https://justinclarke.github.io). It also covers the redesign of the existing `BackToTop` scroll button into a multi-function **CommandDock** a floating control bar that doubles as a section navbar, chat launcher, and scroll-to-top indicator.

> **Status**: Proposed awaiting implementation.
> **Stack**: React 19 · TypeScript 5.8 · Cloudflare Workers · Gemini 2.0 Flash · Framer Motion 12

---

## 1. Goal & Product Vision

### 1.1 What We're Building

Two new user-facing capabilities, powered by a single serverless backend:

1. **Terminal `ask` Command** Visitors type `ask <question>` directly into the hero terminal and receive a streamed AI response inline, rendered as terminal output lines. The agent knows Justin's identity, projects, stack, education, and availability. It answers recruiter questions, developer curiosity, and general portfolio queries.

2. **AI Chat Drawer** A floating chat panel, launched from the new CommandDock (bottom-right), that provides a richer conversational UI. Same backend, same knowledge but with a multi-turn chat interface, message bubbles, and a streaming cursor effect.

### 1.2 Why This Matters

- **Recruiter engagement**: A hiring manager can ask _"Does Justin have Microsoft Fabric experience?"_ or _"Is he open to relocation to London?"_ and get an instant, accurate, contextual answer instead of scrolling through the portfolio.
- **Technical signal**: Demonstrates real-world AI integration prompt engineering, serverless architecture, streaming UX, rate limiting, and security not just a chatbot widget bolted on.
- **Terminal synergy**: The `ask` command fits naturally into the existing `COMMAND_MANIFEST` pattern. The engine remains pure TypeScript with zero React; the AI call is a side-effect handled by the session hook, just like `github` or `download`.

### 1.3 CommandDock: The Control Bar

The current `BackToTop` button is a floating circle in the bottom-right corner with a scroll-progress ring. It works, but it's underutilised real estate. The plan replaces it with a **CommandDock** a horizontal floating pill that consolidates:

| Slot | Function | Target |
|:---|:---|:---|
| ↑ Arrow | Scroll to top (inherits progress ring) | `window.scrollTo(0, 0)` |
| Terminal | Jump to hero section | `#hero` |
| Projects | Jump to case studies | `#projects` |
| Skills | Jump to expertise pipeline | `#expertise` |
| Timeline | Jump to career section | `#experience` |
| 💬 AI | Open the chat drawer | `AIChatDrawer` |

On mobile, the dock collapses to just ↑ and 💬 to save space.

---

## 2. Target Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        VISITOR BROWSER                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Hero Terminal (engine.ts)                     │  │
│  │  ~$ ask does Justin know dbt?                             │  │
│  │  [AGENT]: querying gemini-2.0-flash...                    │  │
│  │  ███████░░░ streaming...                                  │  │
│  └──────────┬──────────────────────────────────▲──────────────┘  │
│             │ (1) POST /ask                    │ (4) Stream      │
│             │     { prompt, history }          │     tokens      │
│  ┌──────────▼──────────────────────────────────┤──────────────┐  │
│  │              useAIAgent.ts (hook)                          │  │
│  │  • Rate limiting (20/session)                             │  │
│  │  • History management (last 6 turns)                      │  │
│  │  • ReadableStream consumer                                │  │
│  │  • Graceful error handling                                │  │
│  └──────────┬──────────────────────────────────▲──────────────┘  │
│             │                                  │                  │
│  ┌──────────▼──────────────────────────────────┤──────────────┐  │
│  │           AIChatDrawer.tsx (optional UI)                   │  │
│  │  • Floating glassmorphism panel                           │  │
│  │  • Message bubbles, streaming cursor                      │  │
│  │  • Shared hook, shared rate limit                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────▲───────────────┘
                        │ HTTPS                    │
                        │ CORS: justinclarke.github.io
                        │ + localhost:3000          │
┌───────────────────────▼──────────────────────────┤───────────────┐
│                CLOUDFLARE WORKER (edge)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  worker.js                                                │  │
│  │  • CORS validation (origin whitelist)                     │  │
│  │  • IP-based rate limiting (60 req/min sliding window)     │  │
│  │  • Prepend system prompt (Justin's identity + context)    │  │
│  │  • Append conversation history (last 6 turns)             │  │
│  │  • POST to Gemini API (streaming mode)                    │  │
│  │  • Pipe ReadableStream back to client                     │  │
│  └──────────┬────────────────────────────────────────────────┘  │
│             │ (2) generateContentStream()                        │
│             │     model: gemini-2.0-flash                        │
│             ▼                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  GEMINI_API_KEY (Cloudflare Secret)                       │  │
│  │  Never exposed to client. Never in git. Never in bundle.  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

The system uses a **hybrid client-edge architecture**:
- **Client (React)**: The terminal engine decides what to display. The `useAIAgent` hook manages the network call, rate limiting, conversation history, and streaming state. The chat drawer is a separate UI surface that shares the same hook.
- **Edge (Cloudflare Worker)**: A stateless proxy that owns the API key, prepends the system prompt, enforces server-side rate limiting, validates CORS, and streams the Gemini response back. The Worker never stores user data.
- **Gemini API (Google)**: The LLM that generates the response. The Worker calls it in streaming mode so tokens arrive at the browser as they're generated.

---

## 3. Step-by-Step Implementation Plan

### Phase 1: Cloudflare Worker Proxy (The Backend)

**Goal**: A deployed, working endpoint at `https://portfolio-ai.justinclarke.workers.dev/ask` that accepts a prompt and returns a streamed Gemini response.

#### 3.1 Project Structure

```
worker/
├── worker.js            ← Single-file Cloudflare Worker
├── system-prompt.js     ← Exported system instruction string
├── wrangler.toml        ← Worker config (name, routes, secrets)
└── README.md            ← Setup and deployment instructions
```

#### 3.2 Worker Logic (`worker.js`)

The Worker handles a single route: `POST /ask`.

**Request validation:**
1. Check `Origin` header against the CORS whitelist (`https://justinclarke.github.io`, `http://localhost:3000`).
2. Reject non-POST methods with `405 Method Not Allowed`.
3. Parse the JSON body: `{ prompt: string, history?: { role: 'user' | 'model', text: string }[] }`.
4. Validate `prompt` is a non-empty string, max 500 characters.
5. Validate `history` is an array of max 12 items (6 user + 6 model turns).

**Rate limiting (in-memory sliding window):**
- Track requests per IP using a `Map<string, number[]>` of timestamps.
- Allow max 60 requests per minute per IP.
- On cold start, the map resets acceptable for a portfolio where abuse is unlikely.
- Return `429 Too Many Requests` with a `Retry-After` header when exceeded.

**Gemini API call:**
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am Justin Clarke\'s portfolio assistant.' }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: prompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 400,
      },
    }),
  }
);
```

**Streaming response:**
- The Worker reads Gemini's SSE stream and pipes it directly to the client as `text/event-stream`.
- Each SSE event contains a JSON chunk with the next few tokens.
- The client's `useAIAgent` hook consumes this stream and updates the terminal/chat UI in real-time.

**CORS headers (applied to every response):**
```javascript
'Access-Control-Allow-Origin': allowedOrigin,
'Access-Control-Allow-Methods': 'POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type',
'Access-Control-Max-Age': '86400',
```

#### 3.3 System Prompt (`system-prompt.js`)

The system prompt is the identity layer. It is baked into the Worker never sent from the client to prevent prompt injection and keep the context private.

```
You are Justin Clarke's portfolio assistant, embedded inside an interactive
terminal at justinclarke.github.io.

IDENTITY:
  Name:       Justin Clarke
  Role:       Analytics Engineer · Full-Stack Developer
  Location:   Dubai, UAE (open to relocation · visa sponsored)
  Education:  MSc Computer Science (Distinction) Queen Mary, University of London
              MBA Business Analytics BITS Pilani, UAE (in progress, 2026–2028)
              BTech Computer Science & Engineering (Distinction) GITAM University
  Stack:      Python · SQL · TypeScript · R · dbt · Power BI · DAX · KQL
              Microsoft Fabric · PostgreSQL · AWS · Docker · REST APIs · CI/CD
              React 19 · Next.js · Tailwind CSS · Framer Motion · Vite
  Status:     Available now contract or full-time
  Contact:    justinsavioclarke@outlook.com
  GitHub:     github.com/JustinClarke
  LinkedIn:   linkedin.com/in/justinsavioclarke

PROJECTS (6 case studies on the portfolio):
  [01] Retail as a Service (LiteStore)        Next.js · SaaS · production
  [02] Disaster Response System               MySQL · 11-entity relational design
  [03] Spotify: Predictive Engine             Python · scikit-learn · 12D feature vectors
  [04] Behavioural Intelligence System        Gemini AI · HR analytics · archetypes
  [05] Capital Architecture                   DCF · financial engineering · Excel→Python
  [06] Off the Pace (in development)          F1 telemetry · dbt · DuckDB · XGBoost · Fabric

PORTFOLIO ARCHITECTURE:
  This portfolio is a React 19 + TypeScript 5.8 app with a functional CLI
  terminal hero (pure TS engine, unit-tested), Tailwind CSS 4 design tokens,
  Framer Motion animations, and cookieless Umami analytics. It deploys to
  GitHub Pages via CI/CD.

INSTRUCTIONS:
  • Be concise, technical, and confident. Match Justin's voice.
  • Keep responses under 150 words unless the question demands detail.
  • If asked about salary, respond with humour: "whatever you were thinking, add 20%."
  • Never fabricate information. If you don't know, say "I don't have that information."
  • For code/architecture questions, reference the terminal commands:
    whoami, about me, ls projects, expertise, timeline, connect.
  • If someone asks about Off the Pace, mention it is actively in development.
  • You are NOT a general-purpose chatbot. You only answer questions about Justin,
    his work, his stack, and the portfolio. Politely redirect off-topic queries.
```

#### 3.4 Deployment

```bash
cd worker/
npx wrangler secret put GEMINI_API_KEY    # paste the Google AI Studio key
npx wrangler deploy                        # deploys to portfolio-ai.justinclarke.workers.dev
```

The `wrangler.toml` configuration:

```toml
name = "portfolio-ai"
main = "worker.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "https://justinclarke.github.io,http://localhost:3000"
```

---

### Phase 2: Terminal Engine Integration

**Goal**: Add an `ask` command to the existing `COMMAND_MANIFEST` in `engine.ts` and a new `'ai'` side-effect type. The engine remains pure TypeScript the AI network call is a side-effect dispatched by `useTerminalSession`.

#### 3.5 Type Changes (`engine.ts`)

**Add `'ai'` to the side-effect union:**
```typescript
export type SideEffectType =
  | 'scroll' | 'snake' | 'theme' | 'download'
  | 'contact' | 'the-long-version' | 'github'
  | 'ai';   // ← new
```

**Extend `CommandEffect` with the AI query payload:**
```typescript
export interface CommandEffect {
  type: SideEffectType;
  payload?: string;
  aiQuery?: string;   // ← new: the raw question for the AI agent
}
```

#### 3.6 Command Registration (`engine.ts` → `COMMAND_MANIFEST`)

Add a new `ask` command entry to the manifest:

```typescript
{
  id: 'ask',
  aliases: ['ai', 'agent', 'gemini'],
  summary: 'Ask the AI assistant about Justin, his projects, or his stack.',
  category: 'core',
  run: () => ({
    lines: [
      line('m', 'usage: ask <question>'),
      line('muted', "e.g. 'ask does Justin have Fabric experience?'"),
      sp(),
      { t: 'm', text: '', parts: [
        { t: 'muted', text: 'powered by ' },
        { t: 'brand', text: 'Gemini 2.0 Flash' },
        { t: 'muted', text: ' · 20 queries per session' },
      ]},
    ],
  }),
},
```

This handles the bare `ask` command (no question). When a question IS provided, `resolveCommand` catches it before the manifest lookup.

#### 3.7 Query Interception (`engine.ts` → `resolveCommand`)

Add a handler for `ask <question>` early in `resolveCommand()`, before the manifest loop:

```typescript
// ── ask <question> → AI agent ──────────────────────────────────
if (cmd.startsWith('ask ') || cmd.startsWith('ai ')) {
  const prefixLen = cmd.startsWith('ask ') ? 4 : 3;
  const query = raw.trim().slice(prefixLen).trim();
  if (!query) {
    return {
      lines: [
        line('r', 'ask: missing question.'),
        line('m', "usage: ask <your question>"),
      ],
    };
  }
  return {
    lines: [
      { t: 'muted' as TerminalLineType, text: 'querying gemini-2.0-flash...', streaming: true },
    ],
    effect: { type: 'ai', aiQuery: query },
  };
}
```

The engine returns a placeholder "querying..." line and an `{ type: 'ai' }` effect. The actual network call happens in the session hook (Phase 3).

#### 3.8 Help & Discoverability

The `ask` command is `category: 'core'` and not `hidden`, so it automatically appears in:
- `help` output (auto-generated from the manifest)
- `man ask` manual page
- Tab completion (`as` → `ask`)

The auto-demo on first visit could optionally include `ask` after `whoami` and `ls projects` but this is a stretch goal, not a requirement.

---

### Phase 3: React Hook `useAIAgent`

**Goal**: A React hook that owns the AI agent's client-side state: rate limiting, conversation history, streaming, and error handling.

#### 3.9 Hook API

```typescript
// src/hooks/useAIAgent.ts

interface AIMessage {
  role: 'user' | 'model';
  text: string;
}

interface UseAIAgentReturn {
  askAgent: (query: string) => Promise<TerminalLine[]>;
  isQuerying: boolean;
  remainingQueries: number;
  conversationHistory: AIMessage[];
  clearHistory: () => void;
}

export function useAIAgent(): UseAIAgentReturn;
```

#### 3.10 Rate Limiting

- **Budget**: 20 queries per session, tracked in `sessionStorage` under key `ai_query_count`.
- **Why session, not localStorage**: A new tab = a fresh budget. This is generous enough for genuine visitors but prevents someone from hammering the endpoint by refreshing.
- **Counter decrement**: `remainingQueries` is displayed in both the terminal output and the chat drawer UI, so users know how many they have left.
- **When exhausted**: `askAgent()` returns a terminal line:
  ```
  [AGENT]: session limit reached (20/20). refresh the page for a new session.
  ```

#### 3.11 Conversation History

- Stored in a `useRef<AIMessage[]>` (not state changing it shouldn't trigger re-renders).
- Truncated to the last **6 exchanges** (12 messages: 6 user + 6 model) before sending to the Worker. This keeps the Gemini context window small and the request payload light.
- Shared between the terminal `ask` command and the chat drawer so if a user starts in the terminal and switches to the drawer, the conversation continues.

#### 3.12 Streaming Implementation

The hook reads the Worker's SSE response using the browser's native `ReadableStream` API:

```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  // Parse SSE chunks: each line starting with "data: " contains a JSON fragment
  // Extract the text tokens and call the onToken callback
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // keep the incomplete last line

  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const json = JSON.parse(line.slice(6));
    const token = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (token) onToken(token);
  }
}
```

The `onToken` callback is provided by the consumer (terminal session hook or chat drawer) and updates the UI in real-time.

#### 3.13 Error Handling

| Scenario | Behaviour |
|:---|:---|
| Worker unreachable (network error) | Return: `[AGENT]: couldn't reach the server. try again later.` |
| Worker returns 429 (rate limited) | Return: `[AGENT]: too many requests. wait a moment and try again.` |
| Worker returns 500 (Gemini error) | Return: `[AGENT]: something went wrong upstream. try again.` |
| Response stream interrupted | Return partial text + `[AGENT]: response interrupted.` |
| Prompt too long (>500 chars) | Client-side rejection: `ask: question too long (max 500 characters).` |

---

### Phase 4: Session Hook Integration (`useTerminalSession`)

**Goal**: Wire the `useAIAgent` hook into the existing side-effect dispatcher so the terminal `ask` command triggers the AI call and streams the response into the history.

#### 3.14 Changes to `useTerminalSession.ts`

1. **Import and initialise the hook**:
   ```typescript
   import { useAIAgent } from './useAIAgent';
   // inside useTerminalSession:
   const { askAgent, isQuerying } = useAIAgent();
   ```

2. **Add a new effect branch** in the side-effect dispatcher (after the `github` branch):
   ```typescript
   } else if (commandEffect.type === 'ai' && commandEffect.aiQuery) {
     const onToken = (token: string) => {
       // Update the last "streaming" line in history with the new token
       setHistory(prev => {
         const updated = [...prev];
         const lastIdx = updated.length - 1;
         if (updated[lastIdx]?.streaming) {
           updated[lastIdx] = {
             ...updated[lastIdx],
             text: updated[lastIdx].text + token,
           };
         }
         return updated;
       });
     };

     // Replace the "querying..." placeholder with the streaming line
     setHistory(prev => [
       ...prev.slice(0, -1), // remove "querying..." placeholder
       { t: 'g' as TerminalLineType, text: '[AGENT]: ', streaming: true },
     ]);

     const finalLines = await askAgent(commandEffect.aiQuery, onToken);
     // Finalize: remove streaming flag
     setHistory(prev => {
       const updated = [...prev];
       const lastIdx = updated.length - 1;
       if (updated[lastIdx]?.streaming) {
         updated[lastIdx] = { ...updated[lastIdx], streaming: false };
       }
       return updated;
     });
   }
   ```

3. **Lock input during AI queries**: The `isTyping` flag already prevents new commands while output is rendering. During an AI query, we set `isTyping = true` at the start and `false` when streaming completes, so the user can't fire another command mid-response.

---

### Phase 5: CommandDock (Replaces `BackToTop`)

**Goal**: Replace the existing `BackToTop` button with a multi-function floating control bar.

#### 3.15 Component: `CommandDock.tsx`

**Location**: `src/components/layout/CommandDock.tsx`

**Visual design** a horizontal glassmorphism capsule, fixed to the bottom-right:

```
┌────────────────────────────────────────────────────────────────┐
│  ⬆  │  Terminal  │  Projects  │  Skills  │  Timeline  │  ✦ AI │
│ top │   #hero    │ #projects  │#expertise│#experience │  chat  │
└────────────────────────────────────────────────────────────────┘
```

**Responsive behaviour:**

| Viewport | Layout |
|:---|:---|
| Desktop (≥1024px) | Full dock: ↑ + 4 nav items + AI button |
| Tablet (768–1023px) | Collapsed: ↑ + AI button. Tap to expand nav |
| Mobile (<768px) | Collapsed: ↑ + AI button only. Nav items hidden |

**Styling:**
- `backdrop-blur-xl bg-black/70 border border-white/10`
- Rounded pill: `rounded-full`
- Shadow: `shadow-[0_8px_32px_rgba(0,0,0,0.5)]`
- Z-index: `z-[100]` (same as current BackToTop)
- Appears after scrolling 500px (inherits BackToTop's visibility logic)

**Scroll progress ring:**
- The ↑ button wraps the existing SVG circle progress ring from BackToTop
- `strokeDashoffset` driven by scroll position, exactly as today

**Section navigation:**
- Each nav button calls `elevatorScroll(sectionId, 1.8, 30)` from `utils/scroll.ts`
- An `IntersectionObserver` watches the four section IDs (`hero`, `projects`, `expertise`, `experience`) and highlights the active one with a teal underline/dot indicator
- Active section indicator animates with Framer Motion `layoutId`

**AI button:**
- Sparkle icon (from `lucide-react`: `Sparkles` or `BrainCircuit`)
- Clicking it opens the `AIChatDrawer` (Phase 6)
- Subtle pulse animation when the drawer is closed (inviting interaction)
- Glow stops when the drawer is open

**Animations:**
- `AnimatePresence` + `motion.div` for expand/collapse transitions
- `layout` prop on nav items for smooth reflow
- Hover: individual items get a `bg-white/5` background + scale micro-animation
- Active section: `motion.div` with `layoutId="dock-active"` slides under the active label

#### 3.16 Wiring into `App.tsx`

Replace the single `<BackToTop />` call in `App.tsx` (line 281) with `<CommandDock />`. The CommandDock renders the `AIChatDrawer` as a child (it manages its own open/close state).

```diff
- import { BackToTop, SEO } from '@/components/layout';
+ import { CommandDock, SEO } from '@/components/layout';

  ...

- <BackToTop />
+ <CommandDock />
```

#### 3.17 Deletion of `BackToTop.tsx`

The file `src/components/layout/BackToTop.tsx` is deleted. All its functionality (scroll tracking, visibility threshold, progress ring SVG, scroll-to-top action) is absorbed into `CommandDock.tsx`. The barrel export in `components/layout/index.ts` is updated to replace `BackToTop` with `CommandDock`.

---

### Phase 6: AI Chat Drawer

**Goal**: A floating chat panel that provides a richer conversational UI than the terminal `ask` command. Launched from the CommandDock's AI button.

#### 3.18 Component: `AIChatDrawer.tsx`

**Location**: `src/components/layout/AIChatDrawer.tsx`

**Visual design:**
- Slides up from the bottom-right, anchored to the CommandDock
- Dark glassmorphism: `bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10`
- Dimensions: `w-[400px] max-h-[60vh]` (desktop), `w-full max-h-[70vh]` (mobile)
- Rounded corners: `rounded-2xl` (top corners only on mobile)
- Shadow: `shadow-[0_-20px_60px_rgba(0,0,0,0.6)]`

**Header:**
```
┌──────────────────────────────────────────┐
│  ✦  ask_justin.ai          3/20    ✕    │
│     Gemini 2.0 Flash        remaining   │
└──────────────────────────────────────────┘
```
- Title: `ask_justin.ai` in mono, teal accent
- Remaining queries counter: `{remaining}/20`
- Close button: `✕` or `ChevronDown` to collapse

**Message area:**
- Scrollable message list
- **User messages**: right-aligned, teal background pill (`bg-brand-primary/10 border border-brand-primary/20`)
- **Assistant messages**: left-aligned, dark background (`bg-white/[0.03] border border-white/5`)
- **Streaming indicator**: blinking cursor (`█`) appended to the last assistant message while tokens arrive
- Empty state: _"Ask me anything about Justin's work, stack, or availability."_ with three suggested prompts as clickable chips:
  - `Does Justin know dbt?`
  - `What's Off the Pace?`
  - `Is he open to relocation?`

**Input bar:**
```
┌──────────────────────────────────────────┐
│  Ask about Justin...           ▶ Send   │
└──────────────────────────────────────────┘
```
- Text input: mono font, placeholder: _"Ask about Justin..."_
- Send button: teal arrow, disabled while streaming or rate-limited
- Submit on `Enter` (not `Shift+Enter`)
- Max length: 500 characters (client-side, matching Worker validation)

**State:**
- Open/closed state lives in `CommandDock` and is passed down as a prop
- Conversation history uses the shared `useAIAgent` hook
- Messages persisted in `sessionStorage` so they survive page navigation (but not tab close)

**Animations:**
- `AnimatePresence` for mount/unmount
- Slide up from bottom: `initial={{ y: 20, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- Spring transition: `type: 'spring', stiffness: 300, damping: 30` (snappy, from `config/animations.ts`)
- New messages: `motion.div` with `initial={{ opacity: 0, y: 8 }}` fade-in

---

### Phase 7: Environment & Configuration

#### 3.19 Environment Variables

**`.env.example`** (add):
```
# AI Agent proxy URL (Cloudflare Worker endpoint)
VITE_AI_PROXY_URL=https://portfolio-ai.justinclarke.workers.dev
```

**`.github/workflows/deploy.yml`** (add to build env):
```yaml
VITE_AI_PROXY_URL: ${{ vars.VITE_AI_PROXY_URL }}
```

#### 3.20 Constants (`src/config/constants.ts`)

```typescript
export const AI_AGENT = {
  proxyUrl: import.meta.env.VITE_AI_PROXY_URL || 'https://portfolio-ai.justinclarke.workers.dev',
  maxSessionQueries: 20,
  maxPromptLength: 500,
  maxHistoryTurns: 6,
  model: 'gemini-2.0-flash',
} as const;
```

---

## 4. Security & Privacy

| Concern | Mitigation |
|:---|:---|
| **API key exposure** | Key lives only in Cloudflare Worker secrets. Never in git, `.env`, or the client bundle. The Worker is the sole entity that touches the key. |
| **Prompt injection** | System prompt is server-side only. The client sends only the user's question and conversation history. The Worker prepends the system prompt before calling Gemini. |
| **CORS abuse** | Worker validates `Origin` header against a strict whitelist. Non-matching origins get `403 Forbidden`. |
| **Rate limiting** | Two layers: client-side (20/session, `sessionStorage`) and server-side (60/min/IP, in-memory). |
| **Data privacy** | No user data is stored. Conversation history is `sessionStorage` only (cleared on tab close). The Worker is stateless. Gemini API calls are ephemeral. |
| **Content safety** | Gemini has built-in safety filters. The system prompt also instructs the model to stay on-topic (Justin's portfolio only) and redirect off-topic queries. |
| **Max tokens** | `maxOutputTokens: 400` caps response length, preventing accidental cost spikes. |

---

## 5. Alternative Architectural Paths

If Cloudflare Workers become unavailable or undesirable:

| Architecture | Setup Required | Pros | Cons |
|:---|:---|:---|:---|
| **Vercel Edge Functions** | Create a `api/ask.ts` route in a Vercel project | Similar DX to Workers, good free tier | Requires a separate Vercel project or monorepo setup |
| **Netlify Functions** | Create a `netlify/functions/ask.js` file | Simple if already on Netlify | Slightly higher cold-start latency |
| **Firebase Cloud Functions** | Write a Cloud Function under Spark plan | Already familiar from Off the Pace plan | Spark plan has limited invocations; requires Firebase project |
| **Client-side semantic search (no LLM)** | Pre-bake a JSON index of FAQ/portfolio data | 100% free, zero latency, no API key | Not generative feels like a search engine, not a conversation |
| **User API key (developer mode)** | Settings input → `localStorage` | Zero hosting cost | High friction for recruiters; unusable for most visitors |
| **WebLLM (client-side WASM)** | Load `web-llm` npm package | 100% private, no server | ~1.8GB model download on first visit; requires WebGPU |

---

## 6. File Change Summary

### New Files

| File | Purpose |
|:---|:---|
| `worker/worker.js` | Cloudflare Worker serverless Gemini proxy |
| `worker/system-prompt.js` | System prompt module (Justin's identity context) |
| `worker/wrangler.toml` | Worker deployment config |
| `worker/README.md` | Setup and deployment docs |
| `src/hooks/useAIAgent.ts` | React hook AI session state, streaming, rate limiting |
| `src/hooks/useAIAgent.test.ts` | Unit tests for the hook |
| `src/components/layout/CommandDock.tsx` | Floating control bar (replaces BackToTop) |
| `src/components/layout/AIChatDrawer.tsx` | Floating chat drawer UI |

### Modified Files

| File | Changes |
|:---|:---|
| `src/pages/home/Hero/engine.ts` | Add `'ai'` to `SideEffectType`, `aiQuery` to `CommandEffect`, `ask` to `COMMAND_MANIFEST`, query interception in `resolveCommand` |
| `src/pages/home/Hero/engine.test.ts` | Add tests for `ask` command resolution |
| `src/hooks/useTerminalSession.ts` | Add `'ai'` effect branch, import `useAIAgent` |
| `src/app/App.tsx` | Replace `<BackToTop />` with `<CommandDock />` |
| `src/components/layout/index.ts` | Replace `BackToTop` export with `CommandDock` |
| `src/config/constants.ts` | Add `AI_AGENT` config object |
| `.env.example` | Add `VITE_AI_PROXY_URL` |
| `.github/workflows/deploy.yml` | Add `VITE_AI_PROXY_URL` to build env |

### Deleted Files

| File | Reason |
|:---|:---|
| `src/components/layout/BackToTop.tsx` | Functionality absorbed into `CommandDock.tsx` |

---

## 7. Definition of Done & Quality Gates

- **Zero key leakage**: No API keys visible in the bundled client source (`npm run build` → grep for key patterns → 0 results).
- **Graceful degradation**: If the Worker is offline or unreachable, the terminal prints a friendly fallback message and all other commands continue to work normally.
- **Rate limit enforcement**: The 21st AI query in a session returns a "limit reached" message, not an error.
- **Streaming UX**: Tokens appear one-by-one in both the terminal and chat drawer, with a blinking cursor during generation.
- **Mobile responsive**: CommandDock collapses to ↑ + 💬 on mobile. Chat drawer fills the width on small screens.
- **Accessibility**: Chat drawer is keyboard-navigable (`Escape` closes it, `Tab` moves between input and close button). CommandDock buttons have `aria-label`s.
- **Performance**: AI integration adds zero weight to initial page load (the hook and drawer are lazy-loaded). No impact on LCP or CLS.
- **Tests pass**: `npm run test` passes with new tests for the `ask` command and `useAIAgent` hook.
- **Tailwind token compliance**: No raw hex values introduced. All colours use existing `@theme` tokens. `npm run lint` passes.

---

## 8. Verification Plan

### Automated Tests

```bash
npm run test
```

| Test file | What it covers |
|:---|:---|
| `engine.test.ts` | `resolveCommand('ask does Justin know Python?')` → returns `{ effect: { type: 'ai' } }` |
| `engine.test.ts` | `resolveCommand('ask')` → returns usage hint (no effect) |
| `engine.test.ts` | `ask` appears in `help` output |
| `useAIAgent.test.ts` | 21st request returns rate-limit error |
| `useAIAgent.test.ts` | Network failure → graceful fallback line |
| `useAIAgent.test.ts` | History truncation (only last 6 turns sent) |

### Manual Verification

1. `npm run dev` → type `ask does Justin have Microsoft Fabric experience?` → verify streamed response appears in terminal
2. Click CommandDock AI button → chat drawer opens → send a message → verify streamed reply with blinking cursor
3. Click each section nav button in CommandDock → verify smooth elevator scroll to correct section
4. Resize to mobile → verify CommandDock collapses to ↑ + 💬
5. Hit 20-query rate limit → verify friendly "limit reached" message in both terminal and drawer
6. Kill the Worker (`wrangler delete`) → verify "agent unavailable" fallback
7. `npm run build` → `grep -r "AIza" dist/` → verify 0 results (no API key in bundle)
8. `npm run lint` → verify Tailwind token compliance and TypeScript checks pass
