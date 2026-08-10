import type { AstraeusTechnicalOverviewContent } from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';

interface AstraeusTechnicalOverviewFigureProps {
  content: AstraeusTechnicalOverviewContent;
}

export default function AstraeusTechnicalOverviewFigure({ content }: AstraeusTechnicalOverviewFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <ol className="mt-6 space-y-4">
        {content.responsibilities.map((responsibility, index) => (
          <li
            key={responsibility.name}
            className={`border p-5 sm:p-6 ${
              responsibility.owner === 'Deterministic'
                ? 'border-2 border-text-primary bg-surface/70'
                : 'border-dashed border-border-subtle bg-surface/30'
            }`}
          >
            <div className="grid gap-3 border-b border-border-subtle pb-4 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-5">
              <span className="font-mono text-sm font-bold text-text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-base font-semibold text-text-primary">{responsibility.name}</p>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {content.columnLabels[3]}: {responsibility.owner}
              </span>
            </div>

            <dl className="mt-4 grid gap-5 md:grid-cols-3">
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {content.columnLabels[0]}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {responsibility.input}
                  <span className="mt-2 block font-semibold text-text-primary">
                    {content.outputLabel}: {responsibility.output}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {content.columnLabels[1]}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{responsibility.evidence}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {content.columnLabels[2]}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{responsibility.failure}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.humanRuleLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.humanRuleDetail}</p>
      </div>

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
