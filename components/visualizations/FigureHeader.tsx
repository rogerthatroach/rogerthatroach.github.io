interface FigureHeaderProps {
  headingId: string;
  title: string;
  thesis?: string;
  headingLevel?: 2 | 3 | 4;
}

/**
 * Shared heading treatment for static-first article figures.
 *
 * The role-based heading stays out of the article table of contents while
 * preserving the figure's place in the semantic outline. The thesis is
 * optional, but when present it states the reading job before the visual.
 */
export default function FigureHeader({
  headingId,
  title,
  thesis,
  headingLevel = 3,
}: FigureHeaderProps) {
  return (
    <header className="border-l-2 border-text-primary pl-4">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-text-primary" />
        <div className="max-w-3xl">
          <p
            id={headingId}
            role="heading"
            aria-level={headingLevel}
            className="font-display text-lg font-semibold leading-snug text-text-primary sm:text-xl"
          >
            {title}
          </p>
          {thesis && (
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{thesis}</p>
          )}
        </div>
      </div>
    </header>
  );
}
