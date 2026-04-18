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

  return (
    <figure className={`my-8 ${className ?? ''}`}>
      {/* suppressHydrationWarning: children(isVisible) is intentionally
          different on server (false) vs first client render (may flip true
          when the observer fires). Telling React not to warn here is safe
          because we KNOW the markup will diverge and that divergence is
          functional (diagram renders), not a bug. Fixes BP=96 from React
          #418/#423/#425 errors on blog posts. */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border border-border-subtle bg-surface/50"
        style={{ minHeight }}
        suppressHydrationWarning
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
