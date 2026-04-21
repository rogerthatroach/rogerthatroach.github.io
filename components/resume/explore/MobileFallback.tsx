'use client';

import Link from 'next/link';
import { ArrowRight, LayoutList, ScrollText, Download } from 'lucide-react';

/**
 * Shown when the viewport is too narrow for the 3D scene (< 900px) OR
 * when `prefers-reduced-motion: reduce` is set. Surfaces the two other
 * resume variants as clear next steps rather than letting the user
 * hit a dead end.
 */
export default function MobileFallback() {
  return (
    <div className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Career · Explore
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          The 3D variant is designed for larger screens
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Orbit controls and spatial navigation don&apos;t translate well to touch
          input or reduced-motion preferences. The structured and scrolling
          variants carry the same content in formats that work everywhere.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:max-w-md">
          <Link
            href="/resume"
            className="group flex items-center justify-between rounded-lg border border-accent/30 bg-accent-muted px-4 py-3 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
          >
            <span className="inline-flex items-center gap-2">
              <LayoutList size={16} />
              Structured resume view (recommended here)
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/resume/arc"
            className="group flex items-center justify-between rounded-lg border border-border-subtle bg-surface/50 px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
          >
            <span className="inline-flex items-center gap-2">
              <ScrollText size={16} />
              Scrollytelling variant
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="group flex items-center justify-between rounded-lg border border-border-subtle bg-surface/50 px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          >
            <span className="inline-flex items-center gap-2">
              <Download size={16} />
              Download static PDF
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
