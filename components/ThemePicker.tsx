'use client';

import { useEffect, useRef, useState } from 'react';
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
  | 'paper'
  | 'themis'
  | 'themis-dark';

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
    name: 'Aurora',
    description: 'Arctic blue · aurora borealis (née Nord)',
    base: 'dark',
    swatches: { bg: '#2e3440', accent: '#88c0d0', text: '#eceff4' },
  },
  {
    id: 'solarized-dark',
    name: 'Obsidian',
    description: 'CIELAB-precise · volcanic glass (née Solarized Dark)',
    base: 'dark',
    swatches: { bg: '#002b36', accent: '#4fb3f5', text: '#fdf6e3' },
  },
  {
    id: 'monokai',
    name: 'Ember',
    description: 'Warm black · pink spark (née Monokai)',
    base: 'dark',
    swatches: { bg: '#272822', accent: '#ff6b9d', text: '#f8f8f2' },
  },
  {
    id: 'paper',
    name: 'Papyrus',
    description: 'Editorial cream · iron-gall ink (née Paper)',
    base: 'light',
    swatches: { bg: '#f4efe6', accent: '#7a4e28', text: '#1a1a1a' },
  },
  {
    id: 'themis',
    name: 'Amethyst',
    description: 'Soft glass · Themis (light)',
    base: 'light',
    swatches: { bg: '#f6f4f8', accent: '#6d5896', text: '#1c1822' },
  },
  {
    id: 'themis-dark',
    name: 'Amethyst Dark',
    description: 'Deep amethyst · Themis (dark)',
    base: 'dark',
    swatches: { bg: '#0d0b14', accent: '#b9a8d6', text: '#ece7f3' },
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
    // 'themis' and 'themis-dark' both apply data-theme="themis" — the
    // .dark class is what differentiates the two bases.
    const attr = id === 'themis-dark' ? 'themis' : id;
    html.setAttribute('data-theme', attr);
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
    setOpen(false);
    // Smooth color crossfade scoped to the swap: enable the `.theme-transition`
    // rule (globals.css) for the ~320ms it takes, then remove it — so there's
    // no permanent hover/INP recalc tax. Skipped under reduced-motion.
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      applyTheme(id);
      return;
    }
    html.classList.add('theme-transition');
    applyTheme(id);
    window.setTimeout(() => html.classList.remove('theme-transition'), 320);
  };

  if (!mounted) return <div className="h-11 w-11" />;

  const currentTheme = THEMES.find((t) => t.id === current);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-secondary backdrop-blur-xs transition duration-150 hover:bg-surface-hover hover:text-text-primary active:scale-90"
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
      </button>

      {/* Always mounted; open/close animates in pure CSS via @starting-style
          (entry) + transition-discrete on `display` (exit) — no framer JS in
          this always-rendered Nav component. `hidden` (display:none) when
          closed keeps it out of the tab order + a11y tree. */}
      <div
        role="menu"
        aria-label="Theme options"
        className={cn(
          'absolute right-0 top-[calc(100%+8px)] z-50 w-56 origin-top-right overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-xl',
          'transition-[opacity,transform,display] duration-150 ease-out transition-discrete',
          open
            ? 'opacity-100 translate-y-0 scale-100 starting:opacity-0 starting:-translate-y-1.5 starting:scale-95'
            : 'pointer-events-none hidden -translate-y-1.5 scale-95 opacity-0'
        )}
      >
            <div className="border-b border-border-subtle px-3 py-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Theme
              </p>
            </div>
            <ul className="py-1">
              {THEMES.map((theme) => {
                const isActive = theme.id === current;
                return (
                  <li key={theme.id}>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => select(theme.id)}
                      title={theme.description}
                      className={cn(
                        'group flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors',
                        isActive
                          ? 'bg-accent-muted'
                          : 'hover:bg-surface-hover'
                      )}
                    >
                      {/* Tri-color swatch preview (compact) */}
                      <span className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-sm border border-border-subtle">
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: theme.swatches.bg }}
                        />
                        <span
                          className="absolute bottom-0 right-0 h-2 w-2 rounded-tl"
                          style={{ backgroundColor: theme.swatches.accent }}
                        />
                        <span
                          className="absolute left-[3px] top-[3px] h-[2px] w-2.5 rounded-full"
                          style={{ backgroundColor: theme.swatches.text, opacity: 0.95 }}
                        />
                      </span>

                      <p
                        className={cn(
                          'min-w-0 flex-1 truncate text-[13px] font-medium',
                          isActive ? 'text-accent' : 'text-text-primary'
                        )}
                      >
                        {theme.name}
                      </p>

                      {isActive && (
                        <Check
                          size={12}
                          aria-hidden="true"
                          className="shrink-0 text-accent"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
      </div>
    </div>
  );
}
