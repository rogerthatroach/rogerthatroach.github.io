import type { DocumentMetricScope as DocumentMetricScopeContent } from '@/data/visualizations/documentIntelligence';

interface DocumentMetricScopeProps {
  content: DocumentMetricScopeContent;
}

export default function DocumentMetricScope({ content }: DocumentMetricScopeProps) {
  const headingId = `${content.id}-title`;

  return (
    <aside className="mt-10 border-y-2 border-text-primary py-6" aria-labelledby={headingId}>
      <div className="max-w-3xl">
        <p
          id={headingId}
          role="heading"
          aria-level={4}
          className="font-display text-base font-semibold text-text-primary sm:text-lg"
        >
          {content.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{content.thesis}</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[0.75fr_1.35fr_1fr] md:gap-8">
        <div className="border-l-2 border-text-primary pl-4">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
            {content.measuredTaskLabel}
          </p>
          <p className="mt-2 text-base font-semibold text-text-primary">{content.measuredTask}</p>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
            {content.comparisonLabel}
          </p>
          <dl className="mt-3 grid grid-cols-2 divide-x divide-border-subtle border-y border-border-subtle">
            <div className="py-4 pr-4">
              <dt className="text-xs leading-relaxed text-text-secondary">{content.baselineLabel}</dt>
              <dd className="mt-2 font-mono text-2xl font-bold text-text-primary">
                {content.baselineValue}
              </dd>
            </div>
            <div className="py-4 pl-4">
              <dt className="text-xs leading-relaxed text-text-secondary">{content.resultLabel}</dt>
              <dd className="mt-2 font-mono text-2xl font-bold text-text-primary">
                {content.resultValue}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
            {content.exclusionsLabel}
          </p>
          <ul className="mt-3 space-y-2">
            {content.exclusions.map((exclusion) => (
              <li key={exclusion} className="flex gap-3 text-xs leading-relaxed text-text-secondary">
                <span aria-hidden="true" className="font-mono text-text-tertiary">
                  —
                </span>
                <span>{exclusion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 border-l-4 border-text-primary pl-4 text-sm font-semibold leading-relaxed text-text-primary">
        {content.note}
      </p>
    </aside>
  );
}
