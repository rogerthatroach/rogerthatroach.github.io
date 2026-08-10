import type { ParOverviewContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParOverviewFigureProps {
  content: ParOverviewContent;
}

export default function ParOverviewFigure({ content }: ParOverviewFigureProps) {
  const [humanInput, ...agentStages] = content.stages;

  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="grid gap-3 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-primary">
            {humanInput.kind} · {humanInput.number}
          </p>
          <div>
            <p className="text-base font-semibold text-text-primary">{humanInput.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{humanInput.detail}</p>
          </div>
        </div>

        <div className="ml-3 border-l-2 border-text-primary pt-6 sm:ml-7">
          <div className="border-t-2 border-text-primary px-4 pt-4 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                {content.scopeLabel}
              </p>
              <p className="text-xs leading-relaxed text-text-tertiary sm:max-w-md sm:text-right">
                {content.scopeDetail}
              </p>
            </div>

            <ol start={2} className="mt-5 divide-y divide-border-subtle border-y border-border-subtle md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
              {agentStages.map((stage) => (
                <li key={stage.number} className="py-5 md:px-5 md:first:pl-0 md:last:pr-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-bold text-text-primary">{stage.number}</span>
                    <span className="text-right font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      {stage.kind}
                    </span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-text-primary">{stage.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-7">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            {content.outcomePrompt}
          </p>
          <div className="mt-3 grid border-y border-border-subtle md:grid-cols-2 md:divide-x md:divide-border-subtle">
            {content.outcomes.map((outcome, index) => (
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
        </div>

        <p className="mt-6 border-l-4 border-text-primary pl-4 text-sm font-semibold text-text-primary">
          {content.humanLabel}
        </p>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
