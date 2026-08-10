interface VisualizationContainerProps {
  children: React.ReactNode;
  minHeight?: number;
  caption?: string;
  className?: string;
  variant?: 'framed' | 'open';
}

export default function VisualizationContainer({
  children,
  minHeight = 400,
  caption,
  className,
  variant = 'framed',
}: VisualizationContainerProps) {
  const isOpen = variant === 'open';

  return (
    <figure className={`${isOpen ? 'visualization-open my-12' : 'my-8'} ${className ?? ''}`} aria-label={caption ? undefined : 'Interactive diagram'}>
      <div
        className={isOpen
          ? 'overflow-visible bg-transparent'
          : 'overflow-hidden rounded-xl border border-border-subtle bg-surface/50'}
        style={{ minHeight }}
      >
        {children}
      </div>
      {caption && (
        <figcaption className={`${isOpen ? 'mt-4 text-left leading-relaxed' : 'mt-2 text-center'} text-xs text-text-tertiary`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
