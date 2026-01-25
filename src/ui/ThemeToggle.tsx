/**
 * ThemeToggle sun/moon icon button that flips the site between light and dark.
 * Fits in: placed in any persistent nav surface (SidebarMenu, header).
 * Note: AnimatePresence lets Framer Motion animate the outgoing icon
 *   before it's removed from the DOM, giving the crossfade illusion.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/providers';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils';

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className, size = 14 }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex items-center justify-center',
        'w-7 h-7 rounded-sm',
        'border border-white/10 hover:border-white/25',
        'text-white/50 hover:text-white/80',
        'transition-colors duration-200',
        'focus-ring',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={reduced ? false : { opacity: 0, rotate: -30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 30, scale: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon size={size} strokeWidth={1.75} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={reduced ? false : { opacity: 0, rotate: 30, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: -30, scale: 0.8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun size={size} strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
