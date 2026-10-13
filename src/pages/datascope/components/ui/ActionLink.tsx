/**
 * ActionLink the two button weights used on /datascope.
 *
 * Fits in: the hero and the closing band.
 * Note:    primary is solid amber with the app's own dark ink on it (8.7:1;
 *          white on this amber is 2.1:1 and fails AA). External links open a
 *          new tab and carry the arrow; an in-page `#id` link smooth-scrolls
 *          and keeps the real href for no-JS and middle-click.
 */
import type { ReactNode, MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn, smoothScrollTo, track } from '@/utils';

const BASE =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 font-grotesk text-base font-semibold transition-[background-color,border-color,filter,transform] duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-amber';

const VARIANTS = {
  primary:
    'bg-ds-amber text-ds-amber-ink shadow-[0_10px_32px_-12px_var(--color-ds-amber)] hover:brightness-110',
  secondary:
    'border border-white/15 bg-white/[0.05] text-text-primary hover:border-white/30 hover:bg-white/[0.09]',
} as const;

interface ActionLinkProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  /** Leading icon; external links get a trailing arrow automatically. */
  icon?: ReactNode;
  /** Umami outbound channel, for external links. */
  trackAs?: string;
  className?: string;
}

export function ActionLink({ href, children, variant = 'secondary', icon, trackAs, className }: ActionLinkProps) {
  const external = /^https?:/.test(href);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (external) {
      if (trackAs) track('outbound-click', { channel: trackAs });
      return;
    }
    if (href.startsWith('#') && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      smoothScrollTo(href, 1.4, 80);
    }
  };

  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(BASE, VARIANTS[variant], className)}
    >
      {icon}
      {children}
      {external && <ArrowUpRight aria-hidden="true" className="size-4" />}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
