/**
 * cn joins CSS class names into one string the helper you'll see everywhere.
 *
 * Fits in: used in nearly every component to build `className`.
 * Note:    it does two jobs. clsx drops falsy values, so you can write
 *          cn('base', isActive && 'on') and the 'on' only appears when active.
 *          twMerge then de-conflicts Tailwind classes so a later one wins
 *          (cn('p-2', 'p-4') -> 'p-4'), instead of both fighting in the DOM.
 *
 * For beginners ----------------------------------------------------------------
 * `...inputs` means "collect all arguments into an array", so cn() takes any
 * number of class strings/conditions. Think of it as a smarter way to glue
 * together the `class="..."` you'd write by hand in HTML.
 * -----------------------------------------------------------------------------
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
