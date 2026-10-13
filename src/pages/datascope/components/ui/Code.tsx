/**
 * Code a small, dependency-free highlighter for the TypeScript and SQL
 * excerpts on /datascope.
 *
 * Fits in: the engine seams (TS) and the repair viewer (SQL).
 * Note:    it builds React nodes from a single tokenising regex, so nothing is
 *          injected as HTML. `mark` wraps one character range (the part a
 *          repair changed) in an add/remove highlight, splitting tokens at its
 *          edges so colouring and highlighting compose.
 */
import { Fragment, type ReactNode } from 'react';
import { cn } from '@/utils';

export type CodeLang = 'ts' | 'sql';

export interface CodeMark {
  start: number;
  end: number;
  tone: 'add' | 'remove';
}

type Kind = 'comment' | 'string' | 'keyword' | 'type' | 'number' | 'plain';

const PATTERNS: Record<CodeLang, RegExp> = {
  ts: /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(export|interface|type|readonly|extends|const)\b|\b(string|number|boolean|unknown|void|Promise|Record|Uint8Array|ArrayBuffer|File|AbortSignal|QueryResult|ChartSpec)\b|\b(\d+(?:\.\d+)?)\b/g,
  sql: /(--[^\n]*)|('(?:[^']|'')*')|\b(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|LIMIT|AS|DESC|ASC|WITH|JOIN|ON|AND|OR|CASE|WHEN|THEN|ELSE|END)\b|\b(SUM|COUNT|ROUND|ABS|MAX|MIN|AVG)\b|\b(\d+(?:\.\d+)?)\b/gi,
};

const GROUP_KINDS: Kind[] = ['comment', 'string', 'keyword', 'type', 'number'];

const KIND_CLASS: Record<Kind, string> = {
  comment: 'text-text-tertiary italic',
  string: 'text-ds-ok',
  keyword: 'text-ds-violet-soft',
  type: 'text-ds-amber',
  number: 'text-ds-amber',
  plain: '',
};

const MARK_CLASS: Record<CodeMark['tone'], string> = {
  add: 'rounded-[3px] bg-ds-ok/15 text-ds-ok ring-1 ring-ds-ok/30',
  remove: 'rounded-[3px] bg-viz-error/15 text-viz-error ring-1 ring-viz-error/30',
};

interface Token {
  text: string;
  kind: Kind;
  start: number;
}

function tokenize(code: string, lang: CodeLang): Token[] {
  const pattern = new RegExp(PATTERNS[lang].source, PATTERNS[lang].flags);
  const tokens: Token[] = [];
  let cursor = 0;
  for (let m = pattern.exec(code); m; m = pattern.exec(code)) {
    if (m.index > cursor) tokens.push({ text: code.slice(cursor, m.index), kind: 'plain', start: cursor });
    const group = m.slice(1).findIndex((g) => g !== undefined);
    tokens.push({ text: m[0], kind: GROUP_KINDS[group] ?? 'plain', start: m.index });
    cursor = m.index + m[0].length;
  }
  if (cursor < code.length) tokens.push({ text: code.slice(cursor), kind: 'plain', start: cursor });
  return tokens;
}

function renderToken(token: Token, key: number, mark?: CodeMark): ReactNode {
  const end = token.start + token.text.length;
  const colour = KIND_CLASS[token.kind];
  if (!mark || mark.end <= token.start || mark.start >= end) {
    return colour ? <span key={key} className={colour}>{token.text}</span> : <Fragment key={key}>{token.text}</Fragment>;
  }
  const from = Math.max(mark.start, token.start) - token.start;
  const to = Math.min(mark.end, end) - token.start;
  return (
    <span key={key} className={colour || undefined}>
      {token.text.slice(0, from)}
      <mark className={MARK_CLASS[mark.tone]}>{token.text.slice(from, to)}</mark>
      {token.text.slice(to)}
    </span>
  );
}

interface CodeProps {
  code: string;
  lang: CodeLang;
  mark?: CodeMark;
  className?: string;
  label?: string;
}

export function Code({ code, lang, mark, className, label }: CodeProps) {
  return (
    <pre
      aria-label={label}
      className={cn(
        'overflow-x-auto rounded-lg border border-white/[0.07] bg-ds-canvas px-4 py-3.5 font-jetbrains text-fine leading-relaxed text-text-secondary [tab-size:2]',
        className,
      )}
    >
      <code>{tokenize(code, lang).map((token, i) => renderToken(token, i, mark))}</code>
    </pre>
  );
}

/**
 * The changed span between two versions of the same statement, diffed by
 * token (identifiers and numbers whole, so "3600.0" vs "3600000.0" marks the
 * full number). A side with nothing changed, like the before of a pure
 * insertion, gets no mark.
 */
export function diffSpans(before: string, after: string): { before?: CodeMark; after?: CodeMark } {
  const split = (text: string) => text.match(/[\w.]+|\s+|[^\w\s]/g) ?? [];
  const b = split(before);
  const a = split(after);

  let prefix = 0;
  while (prefix < b.length && prefix < a.length && b[prefix] === a[prefix]) prefix++;
  let suffix = 0;
  while (
    suffix < b.length - prefix &&
    suffix < a.length - prefix &&
    b[b.length - 1 - suffix] === a[a.length - 1 - suffix]
  ) {
    suffix++;
  }

  const toMark = (tokens: string[], tone: CodeMark['tone']): CodeMark | undefined => {
    const lead = tokens.slice(0, prefix).join('').length;
    const middle = tokens.slice(prefix, tokens.length - suffix).join('');
    const start = lead + (middle.length - middle.trimStart().length);
    const end = lead + middle.trimEnd().length;
    return end > start ? { start, end, tone } : undefined;
  };

  return { before: toMark(b, 'remove'), after: toMark(a, 'add') };
}
