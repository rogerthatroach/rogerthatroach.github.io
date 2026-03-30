'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from the DOM after content renders
  useEffect(() => {
    const timer = setTimeout(() => {
      const contentEl = document.querySelector('.prose-blog');
      if (!contentEl) return;

      const els = contentEl.querySelectorAll('h2, h3');
      const items: TocItem[] = [];

      els.forEach((el, i) => {
        // Generate ID if missing
        if (!el.id) {
          el.id = `heading-${i}`;
        }
        items.push({
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        });
      });

      setHeadings(items);
    }, 500); // Wait for MDX content to render

    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Contents
        </p>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => handleClick(h.id)}
                className={cn(
                  'block w-full text-left text-xs leading-relaxed transition-colors',
                  h.level === 3 ? 'pl-3' : '',
                  activeId === h.id
                    ? 'text-accent font-medium'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
