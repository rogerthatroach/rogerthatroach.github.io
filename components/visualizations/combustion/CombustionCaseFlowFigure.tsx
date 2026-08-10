import FigureHeader from '@/components/visualizations/FigureHeader';
import type { CombustionCaseFlowContent } from '@/data/visualizations/combustion';

interface CombustionCaseFlowFigureProps {
  content: CombustionCaseFlowContent;
}

export default function CombustionCaseFlowFigure({ content }: CombustionCaseFlowFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <dl className="mt-6 grid gap-4 border-y border-border-subtle py-4 md:grid-cols-2 md:gap-8">
        <div>
          <dt className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.scopeLabel}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{content.scopeDetail}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.partnershipLabel}
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
            {content.partnershipDetail}
          </dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.55fr)] xl:gap-10">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.inputHeading}
          </p>
          <div className="mt-4 space-y-5">
            {content.inputGroups.map((input) => (
              <section
                key={input.id}
                className={`border-l-2 pl-4 ${
                  input.kind === 'observed'
                    ? 'border-dashed border-border-subtle'
                    : 'border-text-primary'
                }`}
                aria-label={input.label}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-3 w-3 shrink-0 border-2 border-text-primary ${
                      input.kind === 'observed' ? 'rounded-full' : ''
                    }`}
                  />
                  <div>
                    <p className="text-base font-semibold text-text-primary">{input.label}</p>
                    <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                      {input.value}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{input.detail}</p>
                <p className="mt-3 border-t border-border-subtle pt-3 text-xs leading-relaxed text-text-tertiary">
                  {input.boundary}
                </p>
              </section>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.processHeading}
          </p>
          <ol className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
            {content.stages.map((stage) => (
              <li key={stage.id} className="grid gap-4 py-5 sm:grid-cols-[2.5rem_1fr] sm:gap-5">
                <p className="font-mono text-sm font-bold text-text-primary">{stage.number}</p>
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    {stage.system}
                  </p>
                  <p className="mt-2 text-base font-semibold text-text-primary">{stage.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.detail}</p>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-5">
                    <div className="border-l-2 border-text-primary pl-3">
                      <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                        {content.fieldLabels[0]}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-text-secondary">{stage.output}</dd>
                    </div>
                    <div className="border-l border-dotted border-text-primary pl-3">
                      <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                        {content.fieldLabels[1]}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-text-secondary">{stage.control}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="mt-8 border-2 border-text-primary p-5 sm:p-6" aria-label={content.gateLabel}>
        <div className="grid gap-4 lg:grid-cols-[minmax(12rem,0.65fr)_minmax(0,1.35fr)] lg:gap-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {content.gateLabel}
            </p>
            <p
              role="heading"
              aria-level={4}
              className="mt-2 text-lg font-semibold leading-snug text-text-primary"
            >
              {content.gateTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{content.gateDetail}</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {content.operatorDecisions.map((decision, index) => (
              <li key={decision.id} className="border-t-2 border-text-primary pt-3">
                <p className="font-mono text-xs font-bold text-text-tertiary">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">{decision.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{decision.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)]">
        <section className="border-l-4 border-text-primary pl-4" aria-label={content.actionLabel}>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.actionLabel}
          </p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">
            {content.actionDetail}
          </p>
        </section>
        <section className="border-l-2 border-dotted border-text-primary pl-4" aria-label={content.feedbackLabel}>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.feedbackLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{content.feedbackDetail}</p>
        </section>
      </div>

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
