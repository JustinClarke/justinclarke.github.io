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
