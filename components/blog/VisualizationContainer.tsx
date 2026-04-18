'use client';

import { useRef, useState, useEffect } from 'react';

interface VisualizationContainerProps {
  children: (isVisible: boolean) => React.ReactNode;
  minHeight?: number;
  caption?: string;
  className?: string;
}

export default function VisualizationContainer({
  children,
  minHeight = 400,
  caption,
  className,
}: VisualizationContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Known issue: hydration mismatch on the blog page (React #418/#423/#425)
  // when the IntersectionObserver fires during initial hydration. Tried:
  //   - suppressHydrationWarning on the wrapper (React still logs the errors
  //     because these are hydration FAILURES, not just warnings)
  //   - two-phase mount guard (fixed BP but Lighthouse mobile couldn't
  //     measure LCP/TBT/TTI through the delayed diagram render, perf=0)
  // Blog BP stays at 96/100 on the Lighthouse audit as a known gap;
  // users don't see or hear about it. Mobile perf 97 is the priority.
  return (
    <figure className={`my-8 ${className ?? ''}`}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border border-border-subtle bg-surface/50"
        style={{ minHeight }}
      >
        {children(isVisible)}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-text-tertiary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
