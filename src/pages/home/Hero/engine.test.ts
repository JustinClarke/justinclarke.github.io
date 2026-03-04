import { describe, it, expect } from 'vitest';
import { resolveCommand, getCompletion, levenshtein, COMMAND_MANIFEST } from './engine';

describe('resolveCommand manifest lookup', () => {
  it('resolves whoami', () => {
    const r = resolveCommand('whoami');
    expect(r.lines.length).toBeGreaterThan(0);
  });

  it('resolves canonical id regardless of case', () => {
    const r = resolveCommand('WHOAMI');
    expect(r.lines.length).toBeGreaterThan(0);
  });

  it('resolves alias "skills" → expertise', () => {
    const r = resolveCommand('skills');
    const text = r.lines.map(l => l.text + (l.parts ?? []).map(p => p.text).join('')).join('');
    expect(text).toContain('Python');
  });

  it('resolves alias "stack" → expertise', () => {
    const r = resolveCommand('stack');
    const text = r.lines.map(l => (l.parts ?? []).map(p => p.text).join('')).join('');
    expect(text).toContain('ANALYTICS');
  });

  it('resolves "ls projects" → scroll effect', () => {
    const r = resolveCommand('ls projects');
    expect(r.effect?.type).toBe('scroll');
    expect(r.effect?.payload).toBe('projects');
  });

  it('resolves "connect" → contact effect', () => {
    const r = resolveCommand('connect');
    expect(r.effect?.type).toBe('contact');
  });

  it('resolves "resume" → download effect', () => {
    const r = resolveCommand('resume');
    expect(r.effect?.type).toBe('download');
  });

  it('resolves "snake" → snake effect', () => {
    const r = resolveCommand('snake');
    expect(r.effect?.type).toBe('snake');
  });

  it('clear returns empty lines', () => {
    const r = resolveCommand('clear');
    expect(r.lines).toHaveLength(0);
  });
});

describe('resolveCommand funny errors', () => {
  it('returns funny error for sudo', () => {
    const r = resolveCommand('sudo');
    const text = r.lines.map(l => l.text).join('');
    expect(text).toContain('permission denied');
  });

  it('returns funny error for vim', () => {
    const r = resolveCommand('vim');
    expect(r.lines[0].text).toContain('vim');
  });
});

describe('resolveCommand man command', () => {
  it('returns manual page for whoami', () => {
    const r = resolveCommand('man whoami');
    const text = r.lines.map(l => (l.parts ?? []).map(p => p.text).join('')).join(' ');
    expect(text).toContain('whoami');
  });

  it('returns error for unknown man target', () => {
    const r = resolveCommand('man nonexistentcmd12345');
    expect(r.lines[0].t).toBe('r');
  });

  it('man with no arg returns usage', () => {
    const r = resolveCommand('man ');
    expect(r.lines[0].t).toBe('r');
  });
});

describe('resolveCommand history command', () => {
  it('prints history from ctx', () => {
    const r = resolveCommand('history', { cmdHistory: ['whoami', 'ls projects'] });
    const flat = r.lines.map(l => (l.parts ?? []).map(p => p.text).join('')).join(' ');
    expect(flat).toContain('whoami');
    expect(flat).toContain('ls projects');
  });

  it('shows empty message with no history', () => {
    const r = resolveCommand('history', { cmdHistory: [] });
    expect(r.lines[0].text).toMatch(/no commands/i);
  });
});

describe('resolveCommand status command', () => {
  it('includes uptime and ENV lines', () => {
    const r = resolveCommand('status', { sessionStartMs: Date.now() - 30000 });
    const flat = r.lines.map(l => (l.parts ?? []).map(p => p.text).join('')).join(' ');
    expect(flat).toContain('UPTIME');
    expect(flat).toContain('ENV');
  });
});

describe('resolveCommand fuzzy fallback', () => {
  it('returns did-you-mean for close typo', () => {
    const r = resolveCommand('expertse'); // off by 1
    const flat = r.lines.map(l => (l.text || '') + (l.parts ?? []).map(p => p.text).join('')).join(' ');
    expect(flat).toContain('expertise');
  });

  it('returns not found for nonsense', () => {
    const r = resolveCommand('xyzzy_nonsense_123');
    expect(r.lines[0].t).toBe('r');
  });

  it('exit code 127 on not-found', () => {
    const r = resolveCommand('xyzzy_nonsense_123');
    expect(r.exitCode).toBe(127);
  });
});

describe('getCompletion', () => {
  it('completes "wh" to longest common prefix', () => {
    // 'wh' matches 'who' and 'whoami'; LCP is 'who', so completion is 'o'
    const { completion, candidates } = getCompletion('wh');
    expect(completion).toBe('o');
    expect(candidates).toContain('whoami');
    expect(candidates).toContain('who');
  });

  it('completes unambiguous prefix all the way', () => {
    const { completion } = getCompletion('whoam');
    expect(completion).toBe('i');
  });

  it('completes "who" to "whoami" (whois excluded from about-me aliases)', () => {
    const { completion } = getCompletion('who');
    expect(completion).toBe('ami');
  });

  it('returns empty for empty prefix', () => {
    const { completion, candidates } = getCompletion('');
    expect(completion).toBe('');
    expect(candidates).toHaveLength(0);
  });

  it('returns empty for exact match with no extension', () => {
    const { completion } = getCompletion('whoami');
    expect(completion).toBe('');
  });

  it('returns multiple candidates for ambiguous prefix', () => {
    const { candidates } = getCompletion('c');
    expect(candidates.length).toBeGreaterThan(1);
  });

  it('does not complete hidden commands', () => {
    const { candidates } = getCompletion('matr');
    expect(candidates).toHaveLength(0); // matrix is hidden
  });
});

describe('levenshtein', () => {
  it('identical strings → 0', () => expect(levenshtein('abc', 'abc')).toBe(0));
  it('one insertion → 1', () => expect(levenshtein('abc', 'abcd')).toBe(1));
  it('one deletion → 1', () => expect(levenshtein('abcd', 'abc')).toBe(1));
  it('one substitution → 1', () => expect(levenshtein('abc', 'axc')).toBe(1));
  it('expertse vs expertise → 1', () => expect(levenshtein('expertse', 'expertise')).toBe(1));
});

describe('COMMAND_MANIFEST integrity', () => {
  it('all command ids are unique', () => {
    const ids = COMMAND_MANIFEST.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no alias appears in two different commands', () => {
    const seen = new Map<string, string>();
    for (const spec of COMMAND_MANIFEST) {
      for (const alias of spec.aliases) {
        if (seen.has(alias)) {
          throw new Error(`Alias '${alias}' appears in both '${seen.get(alias)}' and '${spec.id}'`);
        }
        seen.set(alias, spec.id);
      }
    }
  });

  it('core commands have non-empty summaries', () => {
    for (const spec of COMMAND_MANIFEST.filter(c => c.category === 'core')) {
      expect(spec.summary.length).toBeGreaterThan(0);
    }
  });
});
