'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressSection {
  id: string;
  label: string;
}

/**
 * Fixed right-rail section progress dots. Active dot tracks the viewport
 * via IntersectionObserver; click to jump. Label appears on hover and
 * while the section is active. Desktop-only (hidden below lg).
 *
 * Keeps the central column uncluttered — replaces the old Hero "Scroll"
 * prompt with a persistent, low-ink wayfinder.
 */
export default function SectionProgress({
  sections,
}: {
  sections: ProgressSection[];
}) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best) {
          setActiveId((best.target as HTMLElement).id);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const targets: HTMLElement[] = [];
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) {
        observer.observe(el);
        targets.push(el);
      }
    }

    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-4">
        {sections.map((s, i) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollTo(s.id)}
                aria-label={`Jump to section ${i + 1}: ${s.label}`}
                aria-current={isActive ? 'step' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    'select-none whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-all duration-300',
                    isActive
                      ? 'text-accent opacity-100'
                      : 'text-text-tertiary opacity-0 group-hover:opacity-100'
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center',
                    'transition-transform duration-300'
                  )}
                >
                  <span
                    className={cn(
                      'block rounded-full transition-all duration-300',
                      isActive
                        ? 'h-2.5 w-2.5 bg-accent shadow-[0_0_12px_var(--color-accent)]'
                        : 'h-1.5 w-1.5 bg-border-subtle group-hover:h-2 group-hover:w-2 group-hover:bg-accent/60'
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
