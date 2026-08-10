import type {
  AstraeusDecisionMapContent,
  AstraeusEntitlementStep,
} from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';

interface AstraeusDecisionMapFigureProps {
  content: AstraeusDecisionMapContent;
}

function EntitlementDetail({
  label,
  failureLabel,
  steps,
}: {
  label: string;
  failureLabel: string;
  steps: readonly AstraeusEntitlementStep[];
}) {
  return (
    <details className="mt-5 border border-border-subtle bg-surface/30">
      <summary className="flex min-h-11 cursor-pointer items-center px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        {label}
      </summary>
      <ol className="divide-y divide-border-subtle border-t border-border-subtle px-4 sm:px-5">
        {steps.map((step) => (
          <li key={step.number} className="grid gap-3 py-4 sm:grid-cols-[2.5rem_1fr_1fr] sm:gap-5">
            <span className="font-mono text-sm font-bold text-text-primary">{step.number}</span>
            <div>
              <p className="text-sm font-semibold text-text-primary">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.detail}</p>
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {failureLabel}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.failure}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}

export default function AstraeusDecisionMapFigure({ content }: AstraeusDecisionMapFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-6 hidden grid-cols-[3rem_1fr_1fr_1fr] gap-5 border-b-2 border-text-primary pb-3 md:grid">
        <span aria-hidden="true" />
        {content.columnLabels.map((label) => (
          <p key={label} className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {label}
          </p>
        ))}
      </div>

      <ol className="divide-y divide-border-subtle border-y border-border-subtle md:border-t-0">
        {content.decisions.map((decision) => (
          <li key={decision.number} className="py-6">
            <div className="grid gap-5 md:grid-cols-[3rem_1fr_1fr_1fr]">
              <span className="font-mono text-lg font-bold text-text-primary">{decision.number}</span>
              {[decision.pressure, decision.choice, decision.retainedResponsibility].map((value, index) => (
                <div key={content.columnLabels[index]}>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                    {content.columnLabels[index]}
                  </p>
                  <p
                    className={`mt-1 text-sm leading-relaxed md:mt-0 ${
                      index === 1 ? 'font-semibold text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {decision.entitlementDetail && (
              <div className="md:ml-12">
                <EntitlementDetail
                  label={content.detailLabel}
                  failureLabel={content.failureLabel}
                  steps={decision.entitlementDetail}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.operatingRuleLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">
          {content.operatingRuleDetail}
        </p>
      </div>

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
