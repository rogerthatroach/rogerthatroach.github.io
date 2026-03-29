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
