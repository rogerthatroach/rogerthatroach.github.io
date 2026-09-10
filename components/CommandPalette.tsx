'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import type { LucideIcon } from 'lucide-react';
import { Search, Home, User, FolderKanban, FileText, FileBadge, Sparkles, Hammer, Palette, Linkedin, Github, Mail, ArrowRight, X } from 'lucide-react';
import { HERO } from '@/data/hero';
import { POSTS, isPostPublic } from '@/data/posts';
import { PROJECTS } from '@/data/projects';
import { THEMES, getTheme, type ThemeId } from '@/data/themes';

/**
 * ⌘K command palette — native modal dialog with a cmdk command list.
 *
 * Opens on ⌘K / Ctrl+K or when `externalOpen` is flipped true (for Nav's
 * mobile kebab "Search" item). Commands are grouped by register:
 * Navigate, Projects, Writings, Actions.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openPalette = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    const target = previousFocusRef.current;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (target?.isConnected) target.focus();
      });
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }
    };
    const onOpenEvent = () => openPalette();
    document.addEventListener('keydown', onKey);
    document.addEventListener('cmdk:open', onOpenEvent);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('cmdk:open', onOpenEvent);
    };
  }, [closePalette, open, openPalette]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
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

  // Apply a canonical theme-pack entry so ⌘K stays aligned with the nav picker.
  const applyThemePack = useCallback((id: ThemeId) => {
    setOpen(false);
    const html = document.documentElement;
    const theme = getTheme(id);
    if (theme.base === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
    if (theme.dataTheme === null) {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme.dataTheme);
    }
    localStorage.setItem('theme-pack', id);
    localStorage.removeItem('theme'); // drop legacy key
  }, []);

  if (!mounted) return null;

  const publishedPosts = POSTS.filter((p) => isPostPublic(p));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="command-palette-title"
      aria-describedby="command-palette-description"
      onCancel={(event) => {
        event.preventDefault();
        closePalette();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closePalette();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
      className="fixed left-1/2 top-[15vh] z-90 m-0 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden border-0 bg-transparent p-0 text-text-primary backdrop:bg-background/70 backdrop:backdrop-blur-md"
    >
      <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-linear-to-b from-surface-hover to-surface shadow-2xl">
        <button
          type="button"
          onClick={closePalette}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              closePalette();
            }
          }}
          aria-label="Close command palette"
          className="absolute right-2 top-1.5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <X size={16} aria-hidden="true" />
        </button>
        <Command
          label="Site command palette"
          shouldFilter={true}
          loop
          className="flex flex-col"
        >
              <h2 id="command-palette-title" className="sr-only">Search the portfolio</h2>
              <p id="command-palette-description" className="sr-only">
                Navigate pages, projects, writings, and themes.
              </p>
              <div className="flex items-center gap-2 border-b border-border-subtle py-3 pl-4 pr-16">
                <Search size={16} className="text-text-tertiary" aria-hidden="true" />
                <Command.Input
                  ref={inputRef}
                  placeholder="Search pages, projects, writings…"
                  className="flex-1 bg-transparent text-sm text-text-primary outline-hidden placeholder:text-text-tertiary"
                />
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
                      label={t.commandLabel}
                      value={`theme ${t.id} ${t.commandLabel}`}
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

              <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2 text-xs text-text-tertiary">
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
      </div>
    </dialog>
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
