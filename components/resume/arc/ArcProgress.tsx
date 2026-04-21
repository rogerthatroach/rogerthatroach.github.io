'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TimelineNode } from '@/data/timeline';

/**
 * Fixed right-side rail showing which era is currently centered.
 *
 * Uses IntersectionObserver to watch each era section; the one with the
 * largest visible area becomes active. Click a dot to scroll to that era.
 * Desktop-only (lg:block); mobile relies on the top progress bar.
 */
export default function ArcProgress({ eras }: { eras: TimelineNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) {
          const id = (best.target as HTMLElement).dataset.era;
          if (id) setActiveId(id);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const targets: HTMLElement[] = [];
    for (const era of eras) {
      const el = document.getElementById(`era-${era.id}`);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    }

    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [eras]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`era-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Career arc progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-5">
        {eras.map((era, i) => {
          const isActive = era.id === activeId;
          return (
            <li key={era.id}>
              <button
                type="button"
                onClick={() => scrollTo(era.id)}
                aria-label={`Jump to chapter ${i + 1}: ${era.era}`}
                aria-current={isActive ? 'step' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-widest transition-all',
                    isActive
                      ? 'text-accent opacity-100'
                      : 'text-text-tertiary opacity-0 group-hover:opacity-100'
                  )}
                >
                  {era.era}
                </span>
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    isActive
                      ? 'h-2.5 w-2.5 bg-accent'
                      : 'h-2 w-2 bg-border-subtle group-hover:bg-accent/60'
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
