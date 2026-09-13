'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressSection {
  id: string;
  label: string;
}

/**
 * Fixed right-rail section progress dots. Active dot tracks the viewport
 * at a viewport reading position; links jump to each section. Label appears on hover and
 * while the section is active. Desktop-only (hidden below lg).
 *
 * Keeps the central column uncluttered with a persistent, low-ink wayfinder.
 */
export default function SectionProgress({
  sections,
}: {
  sections: ProgressSection[];
}) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    let frame: number | null = null;

    const updateActive = () => {
      frame = null;
      const readingLine = window.innerHeight * 0.4;
      let current = targets[0];
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= readingLine) current = target;
        else break;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = targets[targets.length - 1];
      }
      setActiveId(current?.id ?? null);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

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
              <a
                href={`#${s.id}`}
                aria-label={`Jump to section ${i + 1}: ${s.label}`}
                aria-current={isActive ? 'step' : undefined}
                className="group flex min-h-11 min-w-11 items-center justify-end gap-3"
              >
                <span
                  className={cn(
                    'select-none whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-all duration-300',
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
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
