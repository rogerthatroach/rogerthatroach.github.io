'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { HERO } from '@/data/hero';

/**
 * Footer — two rows.
 *
 *   Row 1: socials (left) · meta nav + ⌘K (center) · location (right)
 *   Row 2: © year · full name (centered alone)
 *
 * Mirrors the Nav's compact aesthetic. The copyright sits on its own
 * row as a quiet trust signal — separated visually but not by a hard
 * border.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-6 py-5 md:px-16">
      <div className="mx-auto max-w-content">
        {/* Row 1 — socials · meta · location */}
        <div className="flex flex-col items-center gap-3 text-[11px] text-text-tertiary sm:flex-row sm:justify-between sm:gap-6">
          {/* Left — socials */}
          <div className="flex items-center gap-4">
            <a
              href={HERO.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-accent"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={HERO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-accent"
            >
              <Github size={16} />
            </a>
            <a
              href={`mailto:${HERO.links.email}`}
              aria-label="Email"
              className="transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-accent"
            >
              <Mail size={16} />
            </a>
          </div>

          {/* Centre — meta links + ⌘K. Same mono cap-style as Nav. */}
          <nav
            aria-label="Meta"
            className="flex items-center gap-4 font-mono uppercase tracking-widest"
          >
            <Link href="/now" className="transition-colors hover:text-accent">
              Now
            </Link>
            <Link href="/papers" className="transition-colors hover:text-accent">
              Papers
            </Link>
            <Link href="/colophon" className="transition-colors hover:text-accent">
              Colophon
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof document !== 'undefined') {
                  document.dispatchEvent(new Event('cmdk:open'));
                }
              }}
              className="hidden items-center gap-1.5 normal-case tracking-normal transition-colors hover:text-accent sm:inline-flex"
              aria-label="Open search (Cmd or Ctrl K)"
            >
              <kbd className="rounded border border-border-subtle bg-surface/50 px-1.5 py-0.5 text-[10px] tracking-normal">
                ⌘K
              </kbd>
              <span className="text-[11px]">Search</span>
            </button>
          </nav>

          {/* Right — location */}
          <div>{HERO.location}</div>
        </div>

        {/* Row 2 — copyright, centered alone */}
        <div className="mt-3 text-center text-[11px] text-text-tertiary/80">
          © {new Date().getFullYear()} {HERO.name}
        </div>
      </div>
    </footer>
  );
}
