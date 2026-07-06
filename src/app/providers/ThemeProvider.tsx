/**
 * ThemeProvider manages light/dark theme state for the whole app.
 * Fits in: outermost provider in RootProviders, wraps all children.
 * Note: stores the user's choice in localStorage so it persists across page
 *   reloads; falls back to the OS preference via matchMedia. Dark mode is driven
 *   by a single `dark` class on <html>; this file only decides when it's on.
 *   Read the theme via useTheme() (same Context pattern as ModalProvider).
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SEO_THEME_COLORS } from '@/config/constants';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme'; // the key we save the choice under in localStorage

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Flips the `dark` class on <html>; `colorScheme` themes native browser bits
// (scrollbars, form controls) and the theme-color meta drives the mobile chrome.
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? SEO_THEME_COLORS.dark : SEO_THEME_COLORS.light);
  }
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

  // Follow OS changes live. When the system preference changes,
  // we align with it and clear any stored manual override.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      localStorage.removeItem(STORAGE_KEY);
      setThemeState(e.matches ? 'dark' : 'light');
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
