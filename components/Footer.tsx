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
            className="text-zinc-500 transition-colors hover:text-accent"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={HERO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-zinc-500 transition-colors hover:text-accent"
          >
            <Github size={20} />
          </a>
          <a
            href={`mailto:${HERO.links.email}`}
            aria-label="Email"
            className="text-zinc-500 transition-colors hover:text-accent"
          >
            <Mail size={20} />
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-zinc-600">
          <MapPin size={14} />
          <span>{HERO.location}</span>
        </div>
      </div>
    </footer>
  );
}
