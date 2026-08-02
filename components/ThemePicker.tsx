'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import {
  DEFAULT_THEME_ID,
  THEMES,
  getTheme,
  isThemeId,
  type ThemeId,
} from '@/data/themes';
import { cn } from '@/lib/utils';

/**
 * Site-wide theme picker backed by the canonical theme registry.
 *
 * Themes fall into two bases:
 *   - Dark-base (adds .dark class so Tailwind dark: variants still fire):
 *     each registry entry whose `base` is `dark`
 *   - Light-base (no .dark class): each entry whose `base` is `light`
 *
 * A registry entry can also set a `data-theme` attribute on <html> so the CSS
 * theme block in globals.css overrides the Sakura color tokens.
 *
 * Bootstrap for FOUC prevention lives in app/layout.tsx (inline script
 * that runs before React hydrates).
 */

function applyTheme(id: ThemeId) {
  const theme = getTheme(id);
  const html = document.documentElement;
  if (theme.base === 'dark') html.classList.add('dark');
  else html.classList.remove('dark');
  if (theme.dataTheme === null) {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', theme.dataTheme);
  }
  localStorage.setItem('theme-pack', id);
  // Cleanup legacy key; we'll keep writing new one
  localStorage.removeItem('theme');
}

function readStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID;
  const pack = localStorage.getItem('theme-pack');
  if (isThemeId(pack)) return pack;
  // Legacy support: map old 'theme' key to sakura-dark if set to 'dark'
  const legacy = localStorage.getItem('theme');
  return legacy === 'dark' ? 'sakura-dark' : DEFAULT_THEME_ID;
}

export default function ThemePicker() {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState<ThemeId>(DEFAULT_THEME_ID);
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

  const currentTheme = getTheme(current);

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
            style={{ backgroundColor: currentTheme.swatches.bg }}
            aria-hidden="true"
          />
          <span
            className="absolute inset-0.5 rounded-full"
            style={{ backgroundColor: currentTheme.swatches.accent }}
            aria-hidden="true"
          />
          <Palette size={10} strokeWidth={2.5} aria-hidden="true" style={{ color: currentTheme.swatches.bg, position: 'relative' }} />
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
