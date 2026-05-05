'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Search, Home, User, FolderKanban, FileText, FileBadge, Sparkles, Hammer, Palette, Linkedin, Github, Mail, ArrowRight } from 'lucide-react';
import { HERO } from '@/data/hero';
import { POSTS, isPostPublic } from '@/data/posts';
import { PROJECTS } from '@/data/projects';

// Six theme packs mirror ThemePicker.tsx — keep this table in sync when
// that list changes. The palette lets users jump straight to any theme
// from ⌘K without opening the nav picker.
type ThemeId =
  | 'sakura-light'
  | 'sakura-dark'
  | 'nord'
  | 'solarized-dark'
  | 'monokai'
  | 'paper'
  | 'themis'
  | 'themis-dark';
const THEMES: { id: ThemeId; label: string; base: 'light' | 'dark' }[] = [
  { id: 'sakura-light',    label: 'Theme · Sakura Light',        base: 'light' },
  { id: 'sakura-dark',     label: 'Theme · Sakura Dark',         base: 'dark'  },
  { id: 'nord',            label: 'Theme · Aurora (Nord)',       base: 'dark'  },
  { id: 'solarized-dark',  label: 'Theme · Obsidian (Solarized)', base: 'dark'  },
  { id: 'monokai',         label: 'Theme · Ember (Monokai)',     base: 'dark'  },
  { id: 'paper',           label: 'Theme · Papyrus (Paper)',     base: 'light' },
  { id: 'themis',          label: 'Theme · Amethyst (Themis)',   base: 'light' },
  { id: 'themis-dark',     label: 'Theme · Amethyst Dark',       base: 'dark'  },
];
const THEME_BASES: Record<ThemeId, 'light' | 'dark'> = Object.fromEntries(
  THEMES.map((t) => [t.id, t.base])
) as Record<ThemeId, 'light' | 'dark'>;

/**
 * ⌘K command palette — cmdk under the hood, Framer Motion for enter/exit.
 *
 * Opens on ⌘K / Ctrl+K or when `externalOpen` is flipped true (for Nav's
 * mobile kebab "Search" item). Commands are grouped by register:
 * Navigate, Projects, Writings, Actions.
 *
 * Respects prefers-reduced-motion — animation becomes an instant show/hide.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpenEvent = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    document.addEventListener('cmdk:open', onOpenEvent);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('cmdk:open', onOpenEvent);
    };
  }, []);

  // Lock body scroll while palette is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith('http') || href.startsWith('mailto:')) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(href);
      }
    },
    [router],
  );

  // Apply a theme-pack by id — mirrors the logic in `components/ThemePicker.tsx`
  // so ⌘K theme changes stay consistent with the nav picker.
  const applyThemePack = useCallback((id: ThemeId) => {
    setOpen(false);
    const html = document.documentElement;
    const base = THEME_BASES[id];
    if (base === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
    if (id === 'sakura-light' || id === 'sakura-dark') {
      html.removeAttribute('data-theme');
    } else {
      const attr = id === 'themis-dark' ? 'themis' : id;
      html.setAttribute('data-theme', attr);
    }
    localStorage.setItem('theme-pack', id);
    localStorage.removeItem('theme'); // drop legacy key
  }, []);

  if (!mounted) return null;

  const publishedPosts = POSTS.filter((p) => isPostPublic(p));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[15vh]"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-subtle bg-gradient-to-b from-surface-hover to-surface shadow-2xl"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Command
              label="Site command palette"
              className="flex flex-col"
              shouldFilter={true}
            >
              <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
                <Search size={16} className="text-text-tertiary" aria-hidden="true" />
                <Command.Input
                  autoFocus
                  placeholder="Search pages, projects, writings…"
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  esc
                </span>
              </div>

              <Command.List className="max-h-[50vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-text-tertiary">
                  No results.
                </Command.Empty>

                <Command.Group heading="Navigate">
                  <PaletteItem icon={Home} label="Home" value="home /" onSelect={() => go('/')} />
                  <PaletteItem icon={FolderKanban} label="Projects" value="projects work case studies" onSelect={() => go('/projects')} />
                  <PaletteItem icon={FileText} label="Writings" value="writings blog posts" onSelect={() => go('/blog')} />
                  <PaletteItem icon={FileBadge} label="Resume" value="resume cv" onSelect={() => go('/resume')} />
                  <PaletteItem icon={User} label="About" value="about bio" onSelect={() => go('/about')} />
                  <PaletteItem icon={Sparkles} label="Now" value="now current focus" onSelect={() => go('/now')} />
                  <PaletteItem icon={Hammer} label="Colophon" value="colophon how built typefaces" onSelect={() => go('/colophon')} />
                </Command.Group>

                <Command.Group heading="Projects">
                  {PROJECTS.map((p) => (
                    <PaletteItem
                      key={p.id}
                      icon={ArrowRight}
                      label={p.title}
                      value={`project ${p.id} ${p.title} ${p.subtitle}`}
                      hint={p.subtitle}
                      onSelect={() => go(`/projects/${p.id}`)}
                    />
                  ))}
                </Command.Group>

                <Command.Group heading="Writings">
                  {publishedPosts.map((post) => (
                    <PaletteItem
                      key={post.meta.slug}
                      icon={ArrowRight}
                      label={post.meta.title}
                      value={`blog ${post.meta.slug} ${post.meta.title} ${post.meta.tags?.join(' ') ?? ''}`}
                      hint={post.meta.subtitle}
                      onSelect={() => go(`/blog/${post.meta.slug}`)}
                    />
                  ))}
                </Command.Group>

                <Command.Group heading="Themes">
                  {THEMES.map((t) => (
                    <PaletteItem
                      key={t.id}
                      icon={Palette}
                      label={t.label}
                      value={`theme ${t.id} ${t.label}`}
                      onSelect={() => applyThemePack(t.id)}
                    />
                  ))}
                </Command.Group>

                <Command.Group heading="Actions">
                  <PaletteItem
                    icon={Linkedin}
                    label="Open LinkedIn"
                    value="linkedin social"
                    onSelect={() => go(HERO.links.linkedin)}
                  />
                  <PaletteItem
                    icon={Github}
                    label="Open GitHub"
                    value="github code source"
                    onSelect={() => go(HERO.links.github)}
                  />
                  <PaletteItem
                    icon={Mail}
                    label="Email"
                    value="email contact"
                    onSelect={() => go(`mailto:${HERO.links.email}`)}
                  />
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2 text-[10px] text-text-tertiary">
                <span className="font-mono uppercase tracking-widest">
                  {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
                </span>
                <span>
                  <kbd className="font-mono">↑</kbd>
                  <kbd className="ml-1 font-mono">↓</kbd>
                  <span className="ml-1.5">navigate</span>
                  <kbd className="ml-3 font-mono">↵</kbd>
                  <span className="ml-1.5">select</span>
                </span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaletteItem({
  icon: Icon,
  label,
  value,
  hint,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary aria-selected:bg-surface-hover aria-selected:text-text-primary"
    >
      <Icon size={14} className="shrink-0 text-text-tertiary group-aria-selected:text-accent" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint && (
        <span className="hidden truncate text-xs text-text-tertiary sm:inline sm:max-w-[40%]">
          {hint}
        </span>
      )}
    </Command.Item>
  );
}
