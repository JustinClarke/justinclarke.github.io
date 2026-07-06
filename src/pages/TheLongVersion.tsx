/**
 * TheLongVersion a long-form editorial page "the personal statement" of the
 * portfolio. Styled as a printed broadsheet using custom CSS injected via a
 * <style> tag (the STYLES constant), rather than Tailwind, because this page
 * has its own distinct typographic design identity that must not leak into
 * the rest of the app.
 *
 * Fits in: rendered by App.tsx at /the-long-version as a lazy-loaded page.
 *          It receives optional href props from the route so links can be
 *          overridden during testing without touching the component itself.
 * Note:    three separate useEffects run here with distinct concerns:
 *          (1) font injection (runs once), (2) live clock + elapsed timer,
 *          (3) scroll-progress bar. The STYLES block (lines 8-541) is a
 *          complete self-contained stylesheet injected once at mount.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/layout";
import { routeMeta } from "@/content";

/* ────────────────────────────────────────────────────────────────────────── *
 *  STYLES. All scoped under .ee-root
 * ────────────────────────────────────────────────────────────────────────── */
const STYLES = `
.ee-root {
  --paper:       oklch(96.5% 0.012 78);
  --paper-deep:  oklch(93.5% 0.014 75);
  --paper-warm:  oklch(91% 0.018 72);
  --ink:         oklch(18% 0.012 50);
  --ink-soft:    oklch(38% 0.012 50);
  --ink-faint:   oklch(60% 0.012 50);
  --rule:        oklch(82% 0.014 65);
  --rule-faint:  oklch(88% 0.012 70);
  --claret:      oklch(40% 0.13 25);
  --claret-deep: oklch(32% 0.12 22);

  font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
  font-optical-sizing: auto;
  font-size: 19px;
  line-height: 1.65;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern" on, "liga" on, "onum" on;
  min-height: 100vh;
  overflow-x: hidden;
  animation: ee-fade-in 2.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes ee-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.ee-root *, .ee-root *::before, .ee-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.ee-root ::selection { background: var(--claret); color: var(--paper); }
.ee-root { scroll-behavior: smooth; }

.ee-root .named {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.08em;
  font-weight: 500;
  color: var(--ink);
  font-style: normal;
}

/* progress */
.ee-root .progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 100; background: transparent; pointer-events: none; }
.ee-root .progress-fill { height: 100%; width: 0%; background: var(--claret); transition: width 80ms linear; }

/* corner controls */
.ee-root .corner-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  pointer-events: none;
  z-index: 50;
}
.ee-root .corner {
  position: fixed;
  pointer-events: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-soft);
  background: color-mix(in oklch, var(--paper) 88%, transparent);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  padding: 10px 14px; text-decoration: none;
  transition: color 160ms, border-color 160ms;
  border: 1px solid var(--rule-faint);
}
.ee-root .corner:hover { color: var(--claret); border-color: var(--claret); }
.ee-root .corner.tl { top: 18px; left: 48px; }
.ee-root .corner.tr { top: 18px; right: 48px; display: flex; gap: 10px; align-items: center; }
.ee-root .corner.tr .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--claret); display: inline-block;
  box-shadow: 0 0 0 0 color-mix(in oklch, var(--claret) 50%, transparent);
  animation: ee-pulse 2.2s ease-out infinite;
}
@keyframes ee-pulse {
  0%   { box-shadow: 0 0 0 0 color-mix(in oklch, var(--claret) 60%, transparent); }
  100% { box-shadow: 0 0 0 12px color-mix(in oklch, var(--claret) 0%, transparent); }
}

/* page */
.ee-root .page { max-width: 1240px; margin: 0 auto; padding: 80px 48px; }

/* masthead */
.ee-root .masthead {
  border-top: 4px double var(--ink); border-bottom: 1px solid var(--ink);
  padding: 14px 4px;
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 4px 16px; align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft);
}
.ee-root .masthead .l { text-align: left; white-space: nowrap; grid-row: 1; }
.ee-root .masthead .r { text-align: right; white-space: nowrap; grid-row: 1; }
.ee-root .masthead .r2 { display: none; }
.ee-root .masthead .c {
  font-family: 'Newsreader', serif; font-style: italic; font-weight: 500;
  font-size: 14px; letter-spacing: 0.04em; text-transform: none; color: var(--ink);
  white-space: nowrap; grid-row: 1;
}

/* title plate */
.ee-root .title-plate {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100svh - 120px);
  padding: 60px 0;
  text-align: center;
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.ee-root .eyebrow {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  margin-bottom: 36px;
}
.ee-root .eyebrow .eyebrow-by {
  font-family: 'Newsreader', serif; font-style: italic; font-weight: 300;
  font-size: 15px; letter-spacing: 0.01em; color: var(--ink-soft);
}
.ee-root .eyebrow .eyebrow-rule {
  width: 24px; height: 1px; background: var(--claret); opacity: 0.6;
  margin: 2px 0;
}
.ee-root .title {
  font-family: 'Newsreader', serif; font-weight: 400; font-style: italic;
  font-size: clamp(80px, 16vw, 200px); line-height: 0.9; letter-spacing: -0.045em; color: var(--ink);
}
.ee-root .title .dot { color: var(--claret); }
.ee-root .lede { margin: 48px auto 0; max-width: 580px; font-size: clamp(20px, 2.2vw, 24px); line-height: 1.4; font-style: italic; color: var(--ink-soft); font-weight: 300; text-wrap: balance; }
.ee-root .title-plate::after { content: '❦'; position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: var(--paper); padding: 0 16px; color: var(--claret); font-size: 18px; }

/* contents */
.ee-root .contents { max-width: 720px; margin: 80px auto 0; }
.ee-root .contents-head { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-faint); text-align: center; margin-bottom: 28px; }
.ee-root .contents-head::before, .ee-root .contents-head::after { content: ' -  - '; margin: 0 12px; color: var(--rule); }
.ee-root .toc-item { display: grid; grid-template-columns: 32px 1fr auto; gap: 20px; align-items: baseline; padding: 18px 4px; border-bottom: 1px dotted var(--rule); text-decoration: none; color: var(--ink); transition: color 160ms, padding 160ms; }
.ee-root .toc-item:hover { color: var(--claret); padding-left: 12px; }
.ee-root .toc-item:hover .toc-page { color: var(--claret); }
.ee-root .toc-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-faint); letter-spacing: 0.06em; }
.ee-root .toc-body { display: grid; gap: 4px; }
.ee-root .toc-title { font-family: 'Newsreader', serif; font-style: italic; font-size: 24px; font-weight: 400; letter-spacing: -0.01em; }
.ee-root .toc-desc { font-family: 'Newsreader', serif; font-style: italic; font-size: 14.5px; color: var(--ink-soft); font-weight: 300; }
.ee-root .toc-page { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-faint); letter-spacing: 0.05em; }

/* section */
.ee-root .section { padding: 140px 0 40px; scroll-margin-top: 40px; }
.ee-root .section-inner { max-width: 640px; margin: 0 auto; position: relative; }
.ee-root .section-marker { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--claret); margin-bottom: 12px; }
.ee-root .section h2 { font-family: 'Newsreader', serif; font-weight: 400; font-style: italic; font-size: clamp(42px, 6vw, 64px); line-height: 1.02; letter-spacing: -0.025em; color: var(--ink); margin-bottom: 12px; text-wrap: balance; }
.ee-root .section .subhead { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.08em; color: var(--ink-faint); text-transform: lowercase; margin-bottom: 56px; }
.ee-root .section .subhead::before { content: ' -  '; }
.ee-root .section .subhead::after  { content: '  - '; }
.ee-root .section p { margin-bottom: 1.3em; text-wrap: pretty; }
.ee-root .section p.lead { font-size: 21px; line-height: 1.55; color: var(--ink); }
.ee-root .dropcap::first-letter { font-family: 'Newsreader', serif; font-size: 5.4em; font-weight: 500; font-style: italic; float: left; line-height: 0.82; padding: 8px 14px 0 0; color: var(--claret); }

/* marginalia */
.ee-root .margin-note { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.55; color: var(--ink-faint); letter-spacing: 0.01em; }
.ee-root .margin-note .mark { color: var(--claret); display: block; margin-bottom: 4px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; }
@media (min-width: 1100px) {
  .ee-root .with-margin .margin-note { position: absolute; left: calc(100% + 56px); width: 200px; margin-top: 6px; }
  .ee-root .with-margin .margin-note.right { left: auto; right: calc(100% + 56px); width: 200px; text-align: right; }
}
@media (max-width: 1099px) {
  .ee-root .margin-note { display: block; padding: 14px 18px; border-left: 2px solid var(--claret); background: var(--paper-deep); margin: 24px 0; }
}

/* pullquote */
.ee-root .pullquote { margin: 64px 0; padding: 48px 4px; border-top: 1px solid var(--claret); border-bottom: 1px solid var(--claret); text-align: center; position: relative; }
.ee-root .pullquote p { font-family: 'Newsreader', serif; font-style: italic; font-weight: 400; font-size: clamp(28px, 3.4vw, 38px); line-height: 1.22; letter-spacing: -0.015em; color: var(--ink); text-wrap: balance; margin: 0; }
.ee-root .pullquote .openquote, .ee-root .pullquote .closequote { color: var(--claret); font-style: normal; font-weight: 400; }

/* threads */
.ee-root .threads { display: grid; gap: 0; margin-top: 8px; }
.ee-root .thread { padding: 28px 0; border-top: 1px solid var(--rule); display: grid; gap: 14px; }
.ee-root .thread:last-child { border-bottom: 1px solid var(--rule); }
.ee-root .thread-equation { display: flex; flex-wrap: wrap; align-items: baseline; gap: 14px; font-family: 'Newsreader', serif; font-style: italic; font-size: clamp(22px, 2.6vw, 28px); line-height: 1.2; letter-spacing: -0.015em; }
.ee-root .thread-from { color: var(--ink-soft); }
.ee-root .thread-to { color: var(--ink); }
.ee-root .thread-arrow { font-family: 'JetBrains Mono', monospace; font-style: normal; color: var(--claret); font-size: 0.65em; letter-spacing: 0.05em; font-weight: 500; align-self: center; }
.ee-root .thread-body { font-size: 16.5px; line-height: 1.55; color: var(--ink-soft); max-width: 580px; }

/* off the clock */
.ee-root .lifelist { margin-top: 8px; }
.ee-root .lifeitem { display: grid; grid-template-columns: 56px 1fr; gap: 24px; padding: 22px 0; border-top: 1px solid var(--rule); }
.ee-root .lifeitem:last-child { border-bottom: 1px solid var(--rule); }
.ee-root .lifeitem-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: var(--claret); padding-top: 8px; }
.ee-root .lifeitem-title { font-family: 'Newsreader', serif; font-style: italic; font-size: 22px; line-height: 1.2; margin-bottom: 6px; color: var(--ink); }
.ee-root .lifeitem-body { font-size: 16.5px; line-height: 1.55; color: var(--ink-soft); }

/* beliefs */
.ee-root .beliefs { counter-reset: belief; }
.ee-root .belief { position: relative; padding: 32px 0 32px 64px; border-top: 1px solid var(--rule); counter-increment: belief; }
.ee-root .belief:last-child { border-bottom: 1px solid var(--rule); }
.ee-root .belief::before { content: counter(belief, decimal-leading-zero); position: absolute; left: 0; top: 38px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--claret); letter-spacing: 0.08em; }
.ee-root .belief-title { font-family: 'Newsreader', serif; font-style: italic; font-size: clamp(22px, 2.4vw, 26px); line-height: 1.22; margin-bottom: 12px; color: var(--ink); letter-spacing: -0.01em; text-wrap: balance; }
.ee-root .belief-body { font-size: 17px; line-height: 1.6; color: var(--ink-soft); max-width: 560px; }

/* an aside */
.ee-root .aside-block {
  max-width: 580px;
  margin: 104px auto 0;
  padding: 48px 48px 44px;
  position: relative;
  background: var(--paper-warm);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--claret);
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.015);
}
.ee-root .aside-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.ee-root .aside-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.28em;
  color: var(--claret);
  font-weight: 500;
  text-transform: uppercase;
}
.ee-root .aside-separator {
  font-size: 14px;
  color: var(--claret);
  margin-top: 4px;
  opacity: 0.85;
}
.ee-root .aside-block p {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 19px;
  line-height: 1.68;
  color: var(--ink);
  font-weight: 300;
  margin-bottom: 1.2em;
  text-wrap: pretty;
  text-align: left;
}
.ee-root .aside-block p:last-child {
  margin-bottom: 0;
}
.ee-root .aside-block p.close {
  margin-top: 24px;
  font-style: normal;
  font-size: 16px;
  color: var(--ink-soft);
  border-top: 1px dotted var(--rule);
  padding-top: 18px;
  text-align: left;
  line-height: 1.6;
}
@media (max-width: 720px) {
  .ee-root .aside-block {
    padding: 36px 24px 32px;
    margin: 64px auto 0;
  }
}

/* cta */
.ee-root .cta { margin: 120px auto 60px; max-width: 720px; background: var(--ink); color: var(--paper); padding: 72px 56px; text-align: center; position: relative; }
.ee-root .cta::before { content: ''; position: absolute; inset: 8px; border: 1px solid color-mix(in oklch, var(--paper) 18%, transparent); pointer-events: none; }
.ee-root .cta .marker { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklch, var(--paper) 65%, var(--claret)); margin-bottom: 16px; }
.ee-root .cta h2 { font-family: 'Newsreader', serif; font-style: italic; font-weight: 400; font-size: clamp(40px, 5vw, 56px); line-height: 1.05; letter-spacing: -0.025em; margin-bottom: 24px; color: var(--paper); }
.ee-root .cta p { max-width: 480px; margin: 0 auto 36px; font-size: 18px; line-height: 1.55; color: color-mix(in oklch, var(--paper) 75%, transparent); }
.ee-root .cta-actions { display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; }
.ee-root .cta-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.ee-root .cta-row.secondary { margin-top: 4px; }
.ee-root .cta-link { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--paper); text-decoration: none; padding: 14px 22px; border: 1px solid color-mix(in oklch, var(--paper) 28%, transparent); transition: all 160ms; }
.ee-root .cta-link:hover { background: var(--claret); border-color: var(--claret); }
.ee-root .cta-link.primary { background: var(--claret); border-color: var(--claret); }
.ee-root .cta-link.primary:hover { background: var(--claret-deep); border-color: var(--claret-deep); }
.ee-root .cta-link.ghost { border-color: color-mix(in oklch, var(--paper) 18%, transparent); color: color-mix(in oklch, var(--paper) 75%, transparent); }
.ee-root .cta-link.ghost:hover { color: var(--paper); background: transparent; border-color: color-mix(in oklch, var(--paper) 55%, transparent); }
.ee-root .cta-coda { padding-top: 48px; font-family: 'Newsreader', serif; font-style: italic; font-size: 16.5px; line-height: 1.7; letter-spacing: 0.01em; color: color-mix(in oklch, var(--paper) 60%, transparent); max-width: 460px; margin-left: auto; margin-right: auto; }

/* colophon */
.ee-root .colophon {
  max-width: 600px;
  margin: 120px auto 40px;
  text-align: center;
  padding: 0 24px 40px;
}
.ee-root .colophon-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}
.ee-root .colophon-divider .line {
  flex-grow: 1;
  height: 1px;
  background: var(--rule);
  max-width: 140px;
}
.ee-root .colophon-divider .mark {
  color: var(--claret);
  font-size: 16px;
  font-family: 'Newsreader', serif;
}
.ee-root .colophon-credits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}
.ee-root .credits-typeface {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--ink);
  letter-spacing: -0.005em;
}
.ee-root .credits-origin {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ee-root .credits-journey {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 480px;
  margin: 0 auto;
}
.ee-root .credits-thanks {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-faint);
  max-width: 440px;
  margin: 4px auto 0;
}
.ee-root .colophon-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 0;
  border-top: 1px solid var(--rule-faint);
  border-bottom: 1px solid var(--rule-faint);
  max-width: 320px;
  margin: 0 auto 36px;
}
.ee-root .status-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--ink-soft);
  letter-spacing: 0.04em;
}
.ee-root .status-item .timer {
  color: var(--claret);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  margin-left: 6px;
}
.ee-root .status-coda {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.ee-root .colophon-signature {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.ee-root .colophon-signature .sep {
  color: var(--claret);
  margin: 0 6px;
}

/* ornament */
.ee-root .fleuron { text-align: center; color: var(--claret); margin: 12px 0 24px; font-size: 16px; font-family: 'Newsreader', serif; }

/* responsive */

@media (max-width: 720px) {
  .ee-root .page { padding: 80px 24px 64px; }
  .ee-root .title-plate { padding: 40px 0; min-height: calc(100svh - 120px); }
  .ee-root .section { padding: 80px 0 24px; }
  .ee-root .cta { padding: 44px 20px; margin: 64px auto 32px; }
  .ee-root .cta h2 { font-size: clamp(32px, 4vw, 40px); margin-bottom: 18px; }
  .ee-root .cta p { font-size: 15px; }
  .ee-root .cta-link { font-size: 11px; padding: 12px 18px; }
  .ee-root .cta-coda { font-size: 14px; }
  .ee-root .lifeitem { grid-template-columns: 1fr; gap: 8px; }
  .ee-root .lifeitem-num { padding-top: 0; }
  .ee-root .belief { padding-left: 0; padding-top: 56px; }
  .ee-root .belief::before { top: 28px; left: 0; }
  .ee-root .corner.tl { top: 18px; left: 20px; padding: 8px 12px; font-size: 9px; }
  .ee-root .corner.tr { top: 18px; right: 20px; padding: 8px 10px; gap: 8px; }
  .ee-root { font-size: 17.5px; line-height: 1.6; }

  .ee-root .title { font-size: clamp(62px, 15vw, 80px); letter-spacing: -0.03em; }
  .ee-root .lede { font-size: 18px; margin-top: 28px; max-width: 100%; }
  .ee-root .eyebrow { margin-bottom: 20px; font-size: 10px; }

  .ee-root .masthead {
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto auto;
    gap: 0 8px;
    padding: 10px 2px;
  }
  .ee-root .masthead .c {
    grid-column: 2; grid-row: 1;
    font-size: 12px;
  }
  .ee-root .masthead .l {
    grid-column: 1; grid-row: 1;
    font-size: 7px; align-self: center;
  }
  .ee-root .masthead .r {
    grid-column: 3; grid-row: 1;
    font-size: 7px; align-self: center;
    overflow: visible; text-overflow: unset;
  }
  .ee-root .masthead .r2 {
    display: block;
    grid-column: 1 / span 3; grid-row: 2;
    text-align: center;
    font-size: 7px; letter-spacing: 0.14em;
    color: var(--ink-faint);
    border-top: 1px solid var(--rule-faint);
    padding-top: 6px; margin-top: 6px;
  }
}

@media (max-width: 540px) {
  /* Tighter corners on very narrow screens */
  .ee-root .corner.tl { top: 14px; left: 12px; padding: 7px 10px; font-size: 8px; }
  .ee-root .corner.tr { top: 14px; right: 12px; padding: 7px 8px; gap: 6px; }
  .ee-root .corner.tr .dot { width: 5px; height: 5px; }

  /* TOC refinements for mobile */
  .ee-root .contents-head { font-size: 9px; margin-bottom: 20px; }
  .ee-root .contents-head::before, .ee-root .contents-head::after { content: ' - '; margin: 0 8px; }
  .ee-root .toc-item { grid-template-columns: 24px 1fr auto; gap: 12px; padding: 14px 2px; }
  .ee-root .toc-item:hover { padding-left: 4px; }
  .ee-root .toc-num { font-size: 9px; }
  .ee-root .toc-title { font-size: 18px; }
  .ee-root .toc-desc { font-size: 13px; }
  .ee-root .toc-page { font-size: 9px; }

  /* Refine pullquote sizing */
  .ee-root .pullquote { margin: 48px 0; padding: 32px 12px; }
  .ee-root .pullquote p { font-size: clamp(20px, 2.8vw, 28px); }

  /* Refine section headings */
  .ee-root .section { padding: 64px 0 20px; }
  .ee-root .section h2 { font-size: clamp(32px, 5vw, 48px); margin-bottom: 8px; }
  .ee-root .section .subhead { font-size: 11px; margin-bottom: 40px; }
  .ee-root .section p { margin-bottom: 1.2em; }
  .ee-root .section p.lead { font-size: 18px; }

  /* Refine thread equation sizing */
  .ee-root .thread-equation { font-size: clamp(18px, 2.2vw, 24px); gap: 10px; }
  .ee-root .thread-body { font-size: 15px; }

  /* Refine belief items */
  .ee-root .belief-title { font-size: clamp(18px, 2vw, 22px); }
  .ee-root .belief-body { font-size: 15px; }
  .ee-root .lifeitem-title { font-size: 18px; }
  .ee-root .lifeitem-body { font-size: 15px; }

  /* Colophon refinements */
  .ee-root .colophon { max-width: 100%; padding: 0 16px 24px; margin: 80px auto 24px; }
  .ee-root .colophon-divider { gap: 16px; margin-bottom: 28px; }
  .ee-root .colophon-divider .line { max-width: 100px; }
  .ee-root .colophon-divider .mark { font-size: 14px; }
  .ee-root .credits-typeface { font-size: 14px; }
  .ee-root .credits-origin { font-size: 10px; }
  .ee-root .credits-journey { font-size: 14px; }
  .ee-root .credits-thanks { font-size: 13px; }
  .ee-root .colophon-status { max-width: 100%; padding: 18px 0; margin: 0 0 24px; }
  .ee-root .status-item { font-size: 10px; }
  .ee-root .status-coda { font-size: 14px; }
  .ee-root .colophon-signature { font-size: 10px; }
}
`;

/* ────────────────────────────────────────────────────────────────────────── *
 *  DATA. Pulled out so it stays editable
 * ────────────────────────────────────────────────────────────────────────── */

interface TheLongVersionProps {
  backHref?: string;            // defaults to "/"
  emailHref?: string;           // defaults to mailto placeholder
  linkedinHref?: string;
  githubHref?: string;
}

const TOC = [
  { id: "origin", num: "§ I", page: "p. 02", title: "Origin", desc: "how curiosity became a job title." },
  { id: "threads", num: "§ II", page: "p. 03", title: "Threads", desc: "one thing tends to lead to another." },
  { id: "pattern", num: "§ III", page: "p. 05", title: "The Pattern", desc: "an essay on noticing, written from a café." },
  { id: "off-clock", num: "§ IV", page: "p. 07", title: "Off the Clock", desc: "what fills the rest of the day." },
  { id: "beliefs", num: "§ V", page: "p. 09", title: "A Few Things I Had to Learn", desc: "things I picked up slowly, usually the hard way." },
  { id: "together", num: "§ VI", page: "p. 11", title: "Working Together", desc: "if any of this landed, here is the door." },
];

const THREADS = [
  { from: "John Grisham, junior high", to: "reading people.", body: "I read every courtroom thriller I could get my hands on, and Grisham taught me something he never intended to, which is that the detail that explains the ending tends to turn up long before it looks like it matters, and I've read rooms the same way ever since." },
  { from: "Automobile engineering", to: "Off The Pace.", body: "Long before the dashboards I wanted to know what actually made one car quicker than another, and whether the real answer was the driver or the machine underneath them, so Off The Pace became my attempt to settle that with maths rather than opinion, by pulling the driver's skill apart from the car. (Spoiler: it's mostly the car. Usually.)" },
  { from: "Hardgroove techno", to: "Systems thinking.", body: "Mixing 130 bpm in real time turns out to be far closer to building a real-time pipeline than it has any right to be, since both come down to holding a lot of moving parts in the air at once and never quite letting any of them drop." },
  { from: "Hosting friends", to: "Product design.", body: "Cooking the food, mixing the drinks and getting the music right is, as far as I can tell, the same instinct that goes into building a dashboard, because hosting a room and shipping a product come down to the same question in the end: does anyone actually want to come back?" },
  { from: "An inability to ignore detail", to: "this page.", body: "The kerning on a heading, the easing on a transition, the gap between two cards: I notice all of it and I can't leave any of it alone, which is why this page went through more type and spacing decisions than anyone sensibly asked for." },
];

const BELIEFS = [
  { title: "Boredom is information.", body: "For a long time I treated getting bored quickly as a flaw, until I looked back one day and realised that almost everything I'm actually proud of started the moment I got bored of something else, so now I read the boredom as a cue to begin the next thing rather than a fault to apologise for. The hobby becomes the project, the project becomes the portfolio, and the portfolio becomes the next job." },
  { title: "Pace yourself like a tyre.", body: "I took this from watching F1, but it only meant anything to me after I'd lived the wrong side of it. At nineteen I built a product almost single-handed, working as the frontend engineer, the designer, the voice on the client calls, the architect and the QA all at the same time, rebuilding the whole thing from scratch three separate times and shipping every version, until somewhere in there it stopped being something I could leave at the end of the day. I was redesigning interfaces in my sleep and debugging production issues in my dreams, waking up to carry on the exact thought I'd gone to bed on, because the entire system had quietly moved into my head and wouldn't leave. That is what a soft compound actually feels like: extraordinary pace for a handful of laps and then a cliff you never see coming, whereas the hard tyres never set a fastest lap but are the ones still running at the end. Most of the people I've watched flame out, myself firmly included, just picked the wrong compound for the race they were really in, and I only understood any of it once the product had grown too big to keep living inside one person, which is roughly when I hired and trained the person who took it over from me." },
  { title: "Taste is just attention you didn't skip.", body: "Taste gets talked about as though it's something you're born with, when most of the time it's really just a refusal to stop noticing, because a thing only looks right once someone has gone through the twenty small details that were nearly right and fixed them one by one, long after most people would happily have called it finished." },
  { title: "Understanding is cheap until you build it.", body: "For years I assumed that understanding something deeply was the whole point and that actually building it was just the admin you did afterwards, when in truth it works the other way round, because an idea that stays in my head never has to survive contact with anything real, and it's only the first time I build it, when reality starts arguing back, that I find out which parts I genuinely understood and which I'd only talked myself into." },
];

/* ────────────────────────────────────────────────────────────────────────── *
 *  COMPONENT
 * ────────────────────────────────────────────────────────────────────────── */

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,300;1,6..72,400;1,6..72,500;1,6..72,600;1,6..72,700&family=JetBrains+Mono:wght@400;500&display=swap";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function pad2(n: number): string { return String(n).padStart(2, "0"); }

export default function TheLongVersion({
  backHref = "/",
  emailHref = "mailto:hello@justinclarke.example",
  linkedinHref = "#",
  githubHref = "#",
}: TheLongVersionProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  // Effect 1 font injection. This page uses Newsreader + JetBrains Mono, which
  // the main app doesn't load, so inject the <link> once. The id guard stops a
  // duplicate under StrictMode's double-mount.
  useEffect(() => {
    const id = "ee-fonts";
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    link.id = id;
    document.head.appendChild(link);
  }, []);

  // Effect 2 live clock + read-time counter. `now` is set once on mount so the
  // date label doesn't flicker against the prerender snapshot.
  useEffect(() => {
    setNow(new Date());
    const start = Date.now();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Effect 3 scroll progress bar. Listener is { passive: true } so the browser
  // never waits on our handler before scrolling (keeps scroll smooth).
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  const dateLabel = now
    ? `${DAYS[now.getDay()]} \u00B7 ${pad2(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
    : "DUBAI";
  const elapsedLabel = `${pad2(Math.floor(elapsed / 60))}:${pad2(elapsed % 60)}`;

  return (
    <div className="ee-root">
      <SEO {...routeMeta('/the-long-version')} />
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="progress">
        <div className="progress-fill" style={{ width: `${progress.toFixed(2)}%` }} />
      </div>

      <div className="corner-container">
        {backHref.startsWith('/') ? (
          <Link to={backHref} className="corner tl" aria-label="Back to portfolio">← back  ~</Link>
        ) : (
          <a href={backHref} className="corner tl" aria-label="Back to portfolio">← back  ~</a>
        )}
        <span className="corner tr"><span className="dot" /><span>available · dubai</span></span>
      </div>

      <main className="page">

        {/* masthead */}
        <header className="masthead">
          <span className="l">Vol. I · No. 01</span>
          <span className="c">the long version</span>
          <span className="r">{dateLabel}</span>
          <span className="r2">Est. read 6-7 min</span>
        </header>

        {/* title plate */}
        <section className="title-plate">
          <div className="eyebrow">
            <span className="eyebrow-by">by Justin Clarke</span>
            <span className="eyebrow-rule" />
          </div>
          <h1 className="title">
            the long<br /><em>version<span className="dot">.</span></em>
          </h1>
          <p className="lede">
            What's left when the work is done. A short paper on noticing things, building when bored, and why one obsession leads to another.
          </p>
        </section>

        {/* contents */}
        <nav className="contents" aria-label="Contents">
          {TOC.map((t) => (
            <a key={t.id} className="toc-item" href={`#${t.id}`}>
              <span className="toc-num">{t.num}</span>
              <span className="toc-body">
                <span className="toc-title">{t.title}</span>
                <span className="toc-desc">{t.desc}</span>
              </span>
              <span className="toc-page">{t.page}</span>
            </a>
          ))}
        </nav>

        {/* § I  ORIGIN */}
        <section id="origin" className="section">
          <div className="section-inner with-margin">
            <div className="section-marker">§ I</div>
            <h2>Origin.</h2>
            <div className="subhead">how curiosity became a job title</div>

            <p className="lead dropcap">
              Before I ever touched a dataset, my brother <span className="named">Jayden</span> and I took apart a song: <em>The Sound of Silence</em>, the Central Park recording, which we used to strip down by ear one layer at a time until the crowd was gone, then the bass, then the acoustic guitar and the harmony, and what was left was a single voice carrying the whole thing on its own. After enough of that I couldn't really listen to anything the ordinary way any more, and I'd find myself hearing a song and immediately pulling it apart in my head, trying to work out what each separate part was actually doing in there.
            </p>
            <p>
              That instinct never really went away, it only changed mediums: a million Spotify playlists turned into a recommendation engine, and the same habit, aimed at a Formula 1 race, became a model that breaks a result down to a single lap and asks how much of it was the driver and how much was the car.
            </p>
            <p>
              The bachelor's in Computer Science came out a distinction, there's a master's after it and the MBA is still going, fitted into the weekends and evenings between projects, and I ended up working in data because I kept asking why nobody was using the numbers they already had and what it would take to change that; when nobody could give me a decent answer, I started building one myself.
            </p>
            <p>
              I'm in Dubai now, building Off The Pace, and the rest of the time I'm shipping full-stack products, designing interfaces, taking photographs or drawing by hand, all of which come down to the same thing in the end, which is to <em>find the signal and make it legible.</em>
            </p>
            <p>
              The London years, three of them, were where the breadth turned into a habit: one at Queen Mary and two more spent working out what to do with everything Queen Mary had handed me, and somewhere in that stretch work-mode and rest-mode stopped being two different people and settled into one person running two registers. This issue is mostly about the second register, since the first one already has its own website.
            </p>

            <aside className="margin-note">
              <span className="mark">Editor's note</span>
              Justin lived in London 2022 – 2025. He cycles everywhere. He still misses the rain about thirty percent of the time. The other seventy percent, he doesn't.
            </aside>
          </div>
        </section>

        {/* § II  THREADS */}
        <section id="threads" className="section">
          <div className="section-inner">
            <div className="section-marker">§ II</div>
            <h2>Threads.</h2>
            <div className="subhead">one thing tends to lead to another</div>

            <p className="lead">
              Most of the work I'm proud of started somewhere else entirely, in a hobby or a question I couldn't drop or a song I kept playing well past the point of reason, and what follows is roughly an account of what led to what.
            </p>

            <div className="threads">
              {THREADS.map((t, i) => (
                <div className="thread" key={i}>
                  <div className="thread-equation">
                    <span className="thread-from">{t.from}</span>
                    <span className="thread-arrow">───▶</span>
                    <span className="thread-to">{t.to}</span>
                  </div>
                  <p className="thread-body">{t.body}</p>
                </div>
              ))}
            </div>

            <div className="fleuron">❦</div>
          </div>
        </section>

        {/* § III  THE PATTERN */}
        <section id="pattern" className="section">
          <div className="section-inner with-margin">
            <div className="section-marker">§ III</div>
            <h2>The Pattern.</h2>
            <div className="subhead">on noticing · written from a café in dubai</div>

            <p className="lead">
              A few people have asked me how I work. The honest answer is that I notice things. Most of them don't matter. Some of them do. This is a recent one I haven't been able to stop thinking about.
            </p>

            <aside className="margin-note right">
              <span className="mark">field notes</span>
              Tuesday afternoon. Specialty coffee place near JLT. Two adjacent tables, four strangers, one observer trying to mind his own business.
            </aside>

            <p>
              I was at the café with <span className="named">Eda</span>. He was talking. I was supposed to be listening. Instead I was watching the two strangers at the table behind him.
            </p>
            <p>
              Both were having what looked like completely different conversations. One was tense. One was relaxed. But the rhythm underneath them was identical. One person speaking in long uninterrupted bursts while the other touched their glass with their fingertips. Not sips. <em>Touches.</em> Fingertips to the glass, then back down, every time their partner paused for breath.
            </p>
            <p>
              By the third repetition I realised both listeners were using the glass as a timing mechanism. A turn-taking signal. A way to regulate interruption anxiety without actually interrupting. Two people, two conversations, two completely different reasons for tension. And the same micro-gesture underneath, doing the same psychological work.
            </p>
            <p>
              <span className="named">Eda</span> hadn't noticed. Nobody at either table had noticed. The conversations themselves were louder than the pattern underneath them, so the pattern stayed invisible. It always does. That's what makes it interesting. And, to be fair to <span className="named">Eda</span>, that's also what makes it a slightly antisocial trait to bring to coffee.
            </p>

            <div className="pullquote">
              <p>
                <span className="openquote">‟</span>
                The pattern is rarely where the noise is. This is how I think about data, too.
                <span className="closequote">”</span>
              </p>
            </div>

            <p>
              Data work, done well, is mostly this. A dashboard tells you the big number went up. The interesting question is which small gesture, three weeks earlier, made the big number inevitable. Find that gesture and you can predict the next big number. Miss it and you'll spend your career reporting on weather you can't forecast.
            </p>
          </div>
        </section>

        {/* § IV  OFF THE CLOCK */}
        <section id="off-clock" className="section">
          <div className="section-inner">
            <div className="section-marker">§ IV</div>
            <h2>Off the Clock.</h2>
            <div className="subhead">what fills the rest of the day</div>

            <p className="lead">Outside the pipeline. Loosely ordered by how much of the week each one eats.</p>

            <div className="lifelist">

              <div className="lifeitem">
                <div className="lifeitem-num">01 · sound</div>
                <div>
                  <div className="lifeitem-title">Hardgroove, bouncy, hypnotic techno.</div>
                  <div className="lifeitem-body">I used to play out monthly, and through the London years the house parties ran weekly out of our place, the uni gang first and then their friends and eventually their friends' friends. No DJ name, and please don't ask for one, just hand me the decks and let me get on with it, because I never got tired of watching what 130 bpm does to a room full of strangers.</div>
                </div>
              </div>

              <div className="lifeitem">
                <div className="lifeitem-num">02 · kitchen</div>
                <div>
                  <div className="lifeitem-title">Cooking, baking, hosting.</div>
                  <div className="lifeitem-body">Most days. Indian primarily, but the kitchen is the kitchen. Anything that needs salt, fat, acid, and patience. The smoothies and the cocktails are why people keep coming back. I don't sell anything. I'd rather feed you.</div>
                </div>
              </div>

              <div className="lifeitem">
                <div className="lifeitem-num">03 · body</div>
                <div>
                  <div className="lifeitem-title">Push, pull, legs, arms. Four days a week.</div>
                  <div className="lifeitem-body">
                    I only started lifting last year, and it's the first routine that has ever properly stuck, which surprised me more than it surprised anyone else. I cycle more or less everywhere too, mostly because it's the one kind of travelling that never feels like wasted time, and I've slowly come round to the idea that the two rest days quietly do as much work as the four lifting days.
                  </div>
                </div>
              </div>

              <div className="lifeitem">
                <div className="lifeitem-num">04 · craft</div>
                <div>
                  <div className="lifeitem-title">Crescendo, the magazine.</div>
                  <div className="lifeitem-body">
                    My amazing team and I put Crescendo together over the better part of half a year, the way these things always seem to go, and what came out the other end was the 180-page official annual for GITAM University. I designed half of it and art-directed the rest, ran the marketing, drew the logo and knocked out the music club's logo on the side, all of it in InDesign, Illustrator, Photoshop, Lightroom, Premiere and After Effects, in the third year of an engineering degree. I had the time because I'd learned Java back in 9th grade and they were still patiently teaching it to me in the third year.
                  </div>
                </div>
              </div>

              <div className="lifeitem">
                <div className="lifeitem-num">05 · attention</div>
                <div>
                  <div className="lifeitem-title">Procedurals about people who notice.</div>
                  <div className="lifeitem-body">
                    <span className="named">Christian</span> thinks watching procedurals is a waste of time and I maintain that it's research, and we have never quite managed to resolve this. House, Suits, The Lincoln Lawyer, The Mentalist: every one of them is built around someone who spots the thing everyone else walked straight past and then has to prove it to a room that would much rather not hear it.
                  </div>
                </div>
              </div>

            </div>

            <div className="fleuron">❦</div>
          </div>
        </section>

        {/* § V  BELIEFS */}
        <section id="beliefs" className="section">
          <div className="section-inner">
            <div className="section-marker">§ V</div>
            <h2>A few things I had to learn.</h2>
            <div className="subhead">discovered slowly, usually the hard way</div>

            <p className="lead">
              None of these are especially original, and I had to learn every one of them the slow way, usually by getting it wrong first and only noticing much later.
            </p>

            <div className="beliefs">
              {BELIEFS.map((b, i) => (
                <div className="belief" key={i}>
                  <div className="belief-title">{b.title}</div>
                  <div className="belief-body">{b.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* § VI  WORKING TOGETHER */}
        <section id="together" className="section">
          <div className="section-inner">

            <aside className="aside-block">
              <div className="aside-header">
                <span className="aside-label">AN ASIDE</span>
                <span className="aside-separator">❦</span>
              </div>
              <p>The search has taken longer than I expected it to, though the gap turned out to be when I built or rewrote most of what you've just read, which is not the worst way to spend the waiting.</p>
              <p className="close">If the above sounded like the way you think, the next part is the easy bit.</p>
            </aside>

            <div className="cta">
              <div className="marker">§ VI · Working together</div>
              <h2>If any of this landed,<br />here is the door.</h2>
              <p>
                Based in Dubai. Available now for analytics engineering, full-stack, or creative-technologist roles. Open to remote, on-site, and relocation. The fastest way to find out if we'd work well is to send me one specific problem you're stuck on. I'll write back. I always do.
              </p>
              <div className="cta-actions">
                <div className="cta-row">
                  <a className="cta-link primary" href={emailHref}>email about a role →</a>
                  <a className="cta-link" href={`${emailHref}?subject=just%20saying%20hi`}>say hi</a>
                </div>
                <div className="cta-row secondary">
                  <a className="cta-link ghost" href={linkedinHref} target="_blank" rel="noopener noreferrer">linkedin</a>
                  <a className="cta-link ghost" href={githubHref} target="_blank" rel="noopener noreferrer">github</a>
                  {backHref.startsWith('/') ? (
                    <Link className="cta-link ghost" to={backHref}>back to the work</Link>
                  ) : (
                    <a className="cta-link ghost" href={backHref}>back to the work</a>
                  )}
                </div>
              </div>
              <p className="cta-coda">
                And if you're not hiring - say hi anyway. Some of the best conversations I've had started with no agenda at all.
              </p>
            </div>

          </div>
        </section>

        {/* colophon */}
        <footer className="colophon">
          <div className="colophon-divider">
            <span className="line" />
            <span className="mark">❦</span>
            <span className="line" />
          </div>
          
          <div className="colophon-credits">
            <p className="credits-typeface">
              Set in Newsreader and JetBrains Mono.
            </p>
            <p className="credits-origin">
              Composed in Dubai, May 2026.
            </p>
            <p className="credits-journey">
              With three years of love for London, where the breadth became a habit.
            </p>
            <p className="credits-thanks">
              And with thanks to the people named in these pages,
              <br />
              who didn't know they'd end up here.
            </p>
          </div>

          <div className="colophon-status">
            <span className="status-item">
              you've been here <span className="timer">{elapsedLabel}</span>
            </span>
            <span className="status-coda">thank you for the time.</span>
          </div>

          <div className="colophon-signature">
            Justin Clarke <span className="sep">·</span> MMXXVI
          </div>
        </footer>

      </main>
    </div>
  );
}
