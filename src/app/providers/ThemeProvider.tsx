/**
 * ThemeProvider manages light/dark theme state for the whole app.
 * Fits in: outermost provider in RootProviders, wraps all children.
 * Note: stores the user's choice in localStorage so it persists
 *   across page reloads; falls back to the OS preference via matchMedia.
 *
 * For beginners ----------------------------------------------------------------
 * "Dark mode" here works by toggling a single CSS class (`dark`) on the <html>
 * element. The CSS does the rest. This file's whole job is deciding WHEN that
 * class is on: remember the user's last choice, otherwise follow their operating
 * system setting. Same Context pattern as ModalProvider read it via useTheme().
 * -----------------------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme'; // the key we save the choice under in localStorage

// LEARN: matchMedia lets JavaScript read a CSS media query. This one asks the OS:
//    "is the user's system set to dark mode?" true/false.
function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// LEARN: The actual "make the page dark" step: add/remove the `dark` class on the
//    root <html> element. `classList.toggle('dark', condition)` adds the class
//    when condition is true and removes it when false. `colorScheme` tells the
//    browser to theme its own bits (scrollbars, form controls) to match.
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return getSystemTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow OS changes only when the user hasn't made an explicit choice
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
