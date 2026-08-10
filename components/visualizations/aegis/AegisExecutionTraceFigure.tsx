import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisExecutionTraceContent } from '@/data/visualizations/aegis';

export default function AegisExecutionTraceFigure({ content }: { content: AegisExecutionTraceContent }) {
  const headingId = content.id + '-title';
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <p className="mt-7 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.scenarioLabel}</p>
      <div className="mt-3 grid gap-7 xl:grid-cols-2">
        {content.traces.map((trace) => (
          <div key={trace.id} className="border-t-2 border-text-primary pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{trace.label}</p>
            <p className="mt-3 text-base font-semibold text-text-primary">{trace.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{trace.summary}</p>
            <ol className="mt-5 divide-y divide-border-subtle border-y border-border-subtle">
              {trace.steps.map((step, index) => (
                <li key={trace.id + '-' + step.stage} className="grid gap-3 py-4 sm:grid-cols-[2.5rem_1fr]">
                  <p className="font-mono text-sm font-bold text-text-primary">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-text-primary">{step.stage}</p>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">{content.statusLabels[step.status]}</p>
                    </div>
                    <dl className="mt-3 grid gap-3 text-sm">
                      {[
                        [content.fieldLabels[0], step.state],
                        [content.fieldLabels[1], step.action],
                        [content.fieldLabels[2], step.evidence],
                      ].map(([label, value]) => (
                        <div key={label} className="border-l border-border-subtle pl-3">
                          <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">{label}</dt>
                          <dd className="mt-1 leading-relaxed text-text-secondary">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-l-4 border-text-primary pl-4">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{trace.outcomeLabel}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">{trace.outcomeDetail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t-2 border-text-primary pt-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.assumptionsLabel}</p>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {content.assumptions.map((assumption) => (
            <li key={assumption} className="border-l border-border-subtle pl-3 text-xs leading-relaxed text-text-secondary">{assumption}</li>
          ))}
        </ul>
      </div>
      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
