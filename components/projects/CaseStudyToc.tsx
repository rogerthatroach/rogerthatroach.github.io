'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TocSection {
  id: string;
  label: string;
}

export default function CaseStudyToc({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const syncActiveHash = () => {
      const hashId = window.location.hash.slice(1);
      if (sections.some((section) => section.id === hashId)) setActiveId(hashId);
    };

    syncActiveHash();
    window.addEventListener('hashchange', syncActiveHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncActiveHash);
    };
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="hidden w-52 shrink-0 self-start xl:sticky xl:top-28 xl:block"
    >
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-border-subtle pl-4">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Contents
        </p>
        <ul>
          {sections.map((section) => {
            const isActive = activeId === section.id;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'flex min-h-11 items-center py-2 text-xs leading-snug transition-colors duration-150',
                    isActive
                      ? 'font-medium text-accent'
                      : 'text-text-tertiary hover:text-text-secondary',
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
