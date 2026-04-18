'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  const scanHeadings = useCallback(() => {
    const contentEl = document.querySelector('.prose-blog');
    if (!contentEl) return;

    const els = contentEl.querySelectorAll('h2[id], h3[id]');
    if (els.length === 0) return;

    const items: TocItem[] = [];
    els.forEach((el) => {
      // Skip References and Further Reading headings
      const text = el.textContent || '';
      if (text === 'References' || text === 'Further Reading') return;
      items.push({
        id: el.id,
        text,
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    if (items.length > 0) setHeadings(items);
  }, []);

  // Use MutationObserver to detect when MDX content is rendered
  useEffect(() => {
    scanHeadings();

    const observer = new MutationObserver(() => scanHeadings());
    const target = document.querySelector('.prose-blog');
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }

    // Also retry on a delay for SSR-hydrated content
    const timer = setTimeout(scanHeadings, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [scanHeadings]);

  // Intersection observer for active heading tracking
  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (headings.length === 0) return null;

  return (
    <nav
      className="fixed top-28 hidden w-52 xl:block"
      style={{ left: 'max(1rem, calc((100vw - 64rem) / 2 - 14rem))' }}
    >
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-border-subtle pl-4">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Contents
        </p>
        <ul>
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={cn(
                  'block py-1.5 text-[11px] leading-snug transition-colors duration-150',
                  h.level === 3 ? 'pl-3' : '',
                  activeId === h.id
                    ? 'font-medium text-accent'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
