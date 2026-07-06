/**
 * types/terminal.ts the terminal's line "grammar": what kinds of line exist
 * and what one printed line looks like.
 *
 * Fits in: engine.ts (which re-exports these for its consumers) and
 *          content/terminal.ts both build lines against these shapes. Keeping
 *          the grammar here lets content stay a leaf module no import cycle
 *          between the engine and the copy it prints.
 *
 * Each member of the union names a colour/style the renderer knows how to paint;
 * the short ones ('g', 'b', 'm', …) are colour shorthands used heavily by the
 * engine's line factories.
 */
export type TerminalLineType =
  | 'muted' | 'success' | 'info' | 'brand' | 'error' | 'obscured' | 'prompt' | 'cmd' | 'edu'
  | 'viz-mac-red' | 'viz-mac-yellow' | 'viz-success'
  | 'ai-head' | 'ai-foot'
  | 'p' | 'g' | 'b' | 'pu' | 'm' | 'o' | 'r' | 't';

// One printed line. A plain line only needs `t` (its style) and `text`; a richer
// line adds `parts` (coloured segments), a link `href`, `chips` (clickable
// suggestions), or a `streaming` flag for the typewriter effect.
export interface TerminalLine {
  t: TerminalLineType;
  text: string;
  parts?: { t: TerminalLineType; text: string; href?: string }[];
  href?: string;
  chips?: string[];
  streaming?: boolean;
  // When true, the line renders inside the AI response block with a left "│" rail
  // (used for the streamed agent answer and its parsed body lines).
  gutter?: boolean;
}
