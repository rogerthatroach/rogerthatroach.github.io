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

        {/* Secondary footer links — /now (current focus) + /colophon
            (how the site is built). Ghost-weight so they stay polite. */}
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
            href="/colophon"
            className="transition-colors hover:text-accent"
          >
            Colophon
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 text-sm text-text-tertiary">
          <MapPin size={14} />
          <span>{HERO.location}</span>
        </div>
      </div>
    </footer>
  );
}
