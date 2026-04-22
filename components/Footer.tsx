'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { HERO } from '@/data/hero';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-6">
          <a
            href={HERO.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-text-tertiary transition-colors hover:text-accent"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={HERO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-text-tertiary transition-colors hover:text-accent"
          >
            <Github size={20} />
          </a>
          <a
            href={`mailto:${HERO.links.email}`}
            aria-label="Email"
            className="text-text-tertiary transition-colors hover:text-accent"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Secondary footer links — /now · /colophon · ⌘K search hint.
            Ghost-weight so they stay polite. */}
        <nav
          aria-label="Meta"
          className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-text-tertiary"
        >
          <Link
            href="/now"
            className="transition-colors hover:text-accent"
          >
            Now
          </Link>
          <Link
            href="/papers"
            className="transition-colors hover:text-accent"
          >
            Papers
          </Link>
          <Link
            href="/colophon"
            className="transition-colors hover:text-accent"
          >
            Colophon
          </Link>
          {/* ⌘K hint — keyboard shortcut discoverability. Clickable: fires
              cmdk:open event so mouse users can trigger the palette too. */}
          <button
            type="button"
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.dispatchEvent(new Event('cmdk:open'));
              }
            }}
            className="hidden items-center gap-1.5 transition-colors hover:text-accent sm:inline-flex"
            aria-label="Open search (Cmd or Ctrl K)"
          >
            <kbd className="rounded border border-border-subtle bg-surface/50 px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
            Search
          </button>
        </nav>

        <div className="flex items-center gap-1.5 text-sm text-text-tertiary">
          <MapPin size={14} />
          <span>{HERO.location}</span>
        </div>
      </div>

      {/* Copyright — trust signal: "this site is maintained". Year is
          rendered via new Date() so it never goes stale on Jan 1. */}
      <div className="mx-auto mt-8 flex max-w-content items-center justify-center border-t border-border-subtle/60 pt-6 text-[11px] text-text-tertiary">
        <span>© {new Date().getFullYear()} {HERO.name}. Built in the open — see <Link href="/colophon" className="transition-colors hover:text-accent">colophon</Link>.</span>
      </div>
    </footer>
  );
}
