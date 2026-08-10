import type { AstraeusBuilderContrastContent } from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';

interface AstraeusBuilderContrastFigureProps {
  content: AstraeusBuilderContrastContent;
}

export default function AstraeusBuilderContrastFigure({ content }: AstraeusBuilderContrastFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {content.paths.map((path) => (
          <article
            key={path.label}
            className={`border p-5 sm:p-6 ${
              path.chosen
                ? 'border-2 border-text-primary bg-surface/70'
                : 'border-dashed border-border-subtle bg-surface/30'
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-subtle pb-4">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
                {path.label}
              </p>
              {path.chosen && (
                <span className="border border-text-primary px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {content.chosenLabel}
                </span>
              )}
            </div>

            <p className="mt-5 text-lg font-semibold text-text-primary">{path.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{path.summary}</p>

            <ol className="mt-5 divide-y divide-border-subtle border-y border-border-subtle">
              {path.steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 py-3 text-sm text-text-secondary">
                  <span className="font-mono text-xs font-bold text-text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {path.advantageLabel}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-secondary">{path.advantage}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {path.costLabel}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-secondary">{path.cost}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.decisionLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.decisionDetail}</p>
      </div>
    </section>
  );
}
