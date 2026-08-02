interface VisualizationContainerProps {
  children: React.ReactNode;
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
  return (
    <figure className={`my-8 ${className ?? ''}`} aria-label={caption ? undefined : 'Interactive diagram'}>
      <div
        className="overflow-hidden rounded-xl border border-border-subtle bg-surface/50"
        style={{ minHeight }}
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-text-tertiary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
