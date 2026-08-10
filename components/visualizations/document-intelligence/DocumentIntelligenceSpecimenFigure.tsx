import FigureHeader from '@/components/visualizations/FigureHeader';
import type { DocumentIntelligenceSpecimenContent } from '@/data/visualizations/documentIntelligence';
import DocumentMetricScope from './DocumentMetricScope';

interface DocumentIntelligenceSpecimenFigureProps {
  content: DocumentIntelligenceSpecimenContent;
}

export default function DocumentIntelligenceSpecimenFigure({
  content,
}: DocumentIntelligenceSpecimenFigureProps) {
  const headingId = `${content.id}-title`;
  const specimenHeadingId = `${content.specimen.id}-title`;
  const flowHeadingId = `${content.id}-flow-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <article
          className="border border-border-subtle bg-surface/30 p-4 sm:p-6"
          aria-labelledby={specimenHeadingId}
        >
          <header className="border-b-2 border-text-primary pb-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
              {content.specimen.label}
            </p>
            <p
              id={specimenHeadingId}
              role="heading"
              aria-level={4}
              className="mt-2 text-base font-semibold text-text-primary"
            >
              {content.specimen.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
              {content.specimen.note}
            </p>
          </header>

          <dl className="mt-5 space-y-3">
            {content.specimen.regions.map((region) => (
              <div
                key={region.id}
                className={`border-l-2 py-2 pl-4 ${
                  region.kind === 'checkbox'
                    ? 'border-dashed border-text-primary'
                    : 'border-border-subtle'
                }`}
              >
                <dt>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    {region.label}
                  </p>
                  <div className="mt-2 flex min-w-0 items-center gap-3">
                    {region.kind === 'checkbox' && (
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 shrink-0 items-center justify-center border-2 border-text-primary"
                      >
                        {region.checkboxState === 'marked' && (
                          <span className="h-2 w-2 bg-text-primary" />
                        )}
                      </span>
                    )}
                    <p className="min-w-0 text-sm font-semibold text-text-primary">
                      {region.content}
                    </p>
                    {region.checkboxStateLabel && (
                      <span className="ml-auto shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
                        {region.checkboxStateLabel}
                      </span>
                    )}
                  </div>
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {region.treatment}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <section aria-labelledby={flowHeadingId}>
          <p
            id={flowHeadingId}
            role="heading"
            aria-level={4}
            className="border-b-2 border-text-primary pb-3 font-mono text-xs font-bold uppercase tracking-widest text-text-primary"
          >
            {content.flowLabel}
          </p>

          <ol className="divide-y divide-border-subtle border-b border-border-subtle">
            {content.stages.map((stage) => (
              <li key={stage.id} className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
                <p className="font-mono text-sm font-bold text-text-primary">{stage.number}</p>
                <div className="min-w-0 border-l-2 border-text-primary pl-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <p className="text-base font-semibold text-text-primary">{stage.title}</p>
                    <p className="shrink-0 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                      {stage.tool}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.detail}</p>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        {content.stageFieldLabels.scope}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-text-secondary">{stage.scope}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        {content.stageFieldLabels.output}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-text-secondary">
                        {stage.output}
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <DocumentMetricScope content={content.metricScope} />

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
