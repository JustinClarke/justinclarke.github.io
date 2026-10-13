/**
 * cn joins CSS class names into one string the helper you'll see everywhere.
 *
 * Fits in: used in nearly every component to build `className`.
 * Note:    it does two jobs. clsx drops falsy values, so you can write
 *          cn('base', isActive && 'on') and the 'on' only appears when active.
 *          twMerge then de-conflicts Tailwind classes so a later one wins
 *          (cn('p-2', 'p-4') -> 'p-4'), instead of both fighting in the DOM.
 */
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The `--text-*` ramp in src/index.css (text-micro, text-fine, …) and the
// `--tracking-*` steps are custom theme tokens. Without telling twMerge they're
// font sizes, it reads `text-micro` as a colour and silently drops it whenever a
// later `text-<colour>` class follows, leaving the element at inherited 16px.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "fine", "caption", "label", "display"] }],
      tracking: [{ tracking: ["mega", "ultra"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
