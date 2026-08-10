import type { ParTraceContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParTraceFigureProps {
  content: ParTraceContent;
}

export default function ParTraceFigure({ content }: ParTraceFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <section aria-labelledby={`${content.id}-branch`}>
          <h4
            id={`${content.id}-branch`}
            className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary"
          >
            {content.branchLabel}
          </h4>
          <div className="mt-3 grid border-y-2 border-text-primary md:grid-cols-2 md:divide-x md:divide-border-subtle">
            {[content.pass, content.return].map((outcome, index) => (
              <div
                key={outcome.title}
                className={`py-5 ${index === 0 ? 'border-b border-border-subtle md:border-b-0 md:pr-6' : 'md:pl-6'}`}
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {outcome.condition}
                </p>
                <p className="mt-2 text-lg font-semibold text-text-primary">{outcome.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{outcome.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 hidden grid-cols-[3rem_1fr_1fr_1.4fr] gap-5 border-b-2 border-text-primary pb-3 md:grid">
          <span aria-hidden="true" />
          {content.columnLabels.map((label) => (
            <p key={label} className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {label}
            </p>
          ))}
        </div>

        <ol className="divide-y divide-border-subtle border-y border-border-subtle md:border-t-0">
          {content.steps.map((step) => (
            <li key={step.number} className="grid gap-5 py-5 md:grid-cols-[3rem_1fr_1fr_1.4fr]">
              <span className="font-mono text-base font-bold text-text-primary">{step.number}</span>
              {[step.state, step.action, step.evidence].map((value, index) => (
                <div key={content.columnLabels[index]}>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                    {content.columnLabels[index]}
                  </p>
                  <p className={`mt-1 text-sm leading-relaxed md:mt-0 ${index === 1 ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </li>
          ))}
        </ol>

        <section className="mt-6 border-t border-border-subtle pt-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.assumptionsLabel}
          </h4>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {content.assumptions.map((assumption) => (
              <li key={assumption} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
                <span aria-hidden="true" className="text-text-tertiary">—</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
