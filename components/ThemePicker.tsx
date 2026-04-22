'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Site-wide theme picker. Replaces ThemeToggle with a 6-option dropdown.
 *
 * Themes fall into two bases:
 *   - Dark-base (adds .dark class so Tailwind dark: variants still fire):
 *     sakura-dark, nord, solarized-dark, monokai
 *   - Light-base (no .dark class): sakura-light, paper
 *
 * All themes except sakura-light/sakura-dark also set a `data-theme=X`
 * attribute on <html> so the CSS blocks in globals.css override the
 * Sakura color tokens.
 *
 * Bootstrap for FOUC prevention lives in app/layout.tsx (inline script
 * that runs before React hydrates).
 */

export type ThemeId =
  | 'sakura-light'
  | 'sakura-dark'
  | 'nord'
  | 'solarized-dark'
  | 'monokai'
  | 'paper';

interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  base: 'light' | 'dark';
  swatches: {
    bg: string;
    accent: string;
    text: string;
  };
}

const THEMES: ThemeOption[] = [
  {
    id: 'sakura-light',
    name: 'Sakura Light',
    description: 'Warm paper · rose accent',
    base: 'light',
    swatches: { bg: '#f8f5f2', accent: '#8a5560', text: '#1a1412' },
  },
  {
    id: 'sakura-dark',
    name: 'Sakura Dark',
    description: 'Warm near-black · muted rose',
    base: 'dark',
    swatches: { bg: '#0c0a0a', accent: '#d4a0a7', text: '#f0ebe8' },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic blue · calm',
    base: 'dark',
    swatches: { bg: '#2e3440', accent: '#88c0d0', text: '#eceff4' },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'CIELAB-calibrated classic',
    base: 'dark',
    swatches: { bg: '#002b36', accent: '#268bd2', text: '#fdf6e3' },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Sublime magenta on warm black',
    base: 'dark',
    swatches: { bg: '#272822', accent: '#f92672', text: '#f8f8f2' },
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Editorial cream · black ink',
    base: 'light',
    swatches: { bg: '#f4efe6', accent: '#8b5e34', text: '#1a1a1a' },
  },
];

function applyTheme(id: ThemeId) {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) return;
  const html = document.documentElement;
  if (theme.base === 'dark') html.classList.add('dark');
  else html.classList.remove('dark');
  if (id === 'sakura-light' || id === 'sakura-dark') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', id);
  }
  localStorage.setItem('theme-pack', id);
  // Cleanup legacy key; we'll keep writing new one
  localStorage.removeItem('theme');
}

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'sakura-light';
  const pack = localStorage.getItem('theme-pack') as ThemeId | null;
  if (pack && THEMES.some((t) => t.id === pack)) return pack;
  // Legacy support: map old 'theme' key to sakura-dark if set to 'dark'
  const legacy = localStorage.getItem('theme');
  return legacy === 'dark' ? 'sakura-dark' : 'sakura-light';
}

export default function ThemePicker() {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState<ThemeId>('sakura-light');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setCurrent(readStoredTheme());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const select = (id: ThemeId) => {
    setCurrent(id);
    applyTheme(id);
    setOpen(false);
  };

  if (!mounted) return <div className="h-11 w-11" />;

  const currentTheme = THEMES.find((t) => t.id === current);

  return (
    <div ref={menuRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((s) => !s)}
        whileTap={{ scale: 0.92 }}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-secondary backdrop-blur-sm transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        {/* Current theme shown as a tri-color ring: bg, accent, text */}
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: currentTheme?.swatches.bg }}
            aria-hidden="true"
          />
          <span
            className="absolute inset-0.5 rounded-full"
            style={{ backgroundColor: currentTheme?.swatches.accent }}
            aria-hidden="true"
          />
          <Palette size={10} strokeWidth={2.5} aria-hidden="true" style={{ color: currentTheme?.swatches.bg, position: 'relative' }} />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Theme options"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-border-subtle bg-surface/95 shadow-xl backdrop-blur-md"
          >
            <div className="border-b border-border-subtle px-4 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Theme
              </p>
            </div>
            <ul className="max-h-[22rem] overflow-y-auto py-1">
              {THEMES.map((theme) => {
                const isActive = theme.id === current;
                return (
                  <li key={theme.id}>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => select(theme.id)}
                      className={cn(
                        'group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        isActive
                          ? 'bg-accent-muted/60'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      {/* Tri-color swatch preview */}
                      <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border-subtle">
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: theme.swatches.bg }}
                        />
                        <span
                          className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-tl-md"
                          style={{ backgroundColor: theme.swatches.accent }}
                        />
                        <span
                          className="absolute left-1 top-1 h-1.5 w-4 rounded-sm"
                          style={{ backgroundColor: theme.swatches.text, opacity: 0.9 }}
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            isActive
                              ? 'text-accent'
                              : 'text-text-primary'
                          )}
                        >
                          {theme.name}
                        </p>
                        <p className="text-[11px] text-text-tertiary">
                          {theme.description}
                        </p>
                      </div>

                      {isActive && (
                        <Check
                          size={14}
                          aria-hidden="true"
                          className="shrink-0 text-accent"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
