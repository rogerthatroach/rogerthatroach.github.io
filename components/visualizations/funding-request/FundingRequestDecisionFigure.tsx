import type { ParDecisionContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParDecisionFigureProps {
  content: ParDecisionContent;
}

export default function ParDecisionFigure({ content }: ParDecisionFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="hidden grid-cols-[3rem_1fr_1fr_1fr] gap-5 border-b-2 border-text-primary pb-3 md:grid">
          <span aria-hidden="true" />
          {content.columnLabels.map((label) => (
            <p key={label} className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {label}
            </p>
          ))}
        </div>

        <ol className="divide-y divide-border-subtle border-y border-border-subtle md:border-t-0">
          {content.decisions.map((decision) => (
            <li key={decision.number} className="grid gap-5 py-6 md:grid-cols-[3rem_1fr_1fr_1fr]">
              <span className="font-mono text-lg font-bold text-text-primary">{decision.number}</span>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                  {content.columnLabels[0]}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary md:mt-0">
                  {decision.constraint}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                  {content.columnLabels[1]}
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-text-primary md:mt-0">
                  {decision.choice}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                  {content.columnLabels[2]}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary md:mt-0">
                  {decision.tradeoff}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.footerLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.footerDetail}
          </p>
        </div>
      </div>
    </section>
  );
}
