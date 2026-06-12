/**
 * data/bento.ts the list of "bento" widget cards and each one's accent + label.
 *
 * Fits in: read by the bento grid and its cycle hook to know which cards exist,
 *          which ones auto-rotate, and how to colour/label them.
 * Note:    accents are CSS-variable references (tokens), never raw hex per the
 *          project's Tailwind rule.
 *
 * For beginners ----------------------------------------------------------------
 * This file is just DATA, no UI. `as const` freezes the arrays so TypeScript
 * knows the EXACT card names; `typeof CARDS[number]` then derives a type that
 * means "one of those names" (CardId), so a typo elsewhere becomes a compile
 * error. `Record<CardId, ...>` means "an object with one entry per card id".
 * -----------------------------------------------------------------------------
 */
export const CARDS = ['f1', 'litestore', 'spotify', 'sql', 'hr'] as const;
export const CYCLING_CARDS = ['litestore', 'spotify', 'sql', 'hr'] as const satisfies CardId[];
export type CardId = typeof CARDS[number];

export const CARD_META: Record<CardId, { accent: string; label: string }> = {
  f1: { accent: 'var(--color-viz-mac-red)', label: 'VIEW SOURCE CODE' },
  litestore: { accent: 'var(--color-litestore)', label: 'EXPLORE CASE STUDY' },
  spotify: { accent: 'var(--color-viz-spotify)', label: 'EXPLORE CASE STUDY' },
  sql: { accent: 'var(--color-sql-red)', label: 'READ POST-MORTEM' },
  hr: { accent: 'var(--color-acc-bi)', label: 'EXPLORE RETENTION ENGINE' },
};
