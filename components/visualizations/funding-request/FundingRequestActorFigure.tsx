import type { ParActorContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParActorFigureProps {
  content: ParActorContent;
}

export default function ParActorFigure({ content }: ParActorFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <p className="border-y-2 border-text-primary py-3 text-sm font-semibold text-text-primary">
          {content.openingLabel}
        </p>

        <ol className="divide-y divide-border-subtle">
          {content.steps.map((step, index) => (
            <li
              key={`${step.actor}-${step.action}`}
              className="grid gap-2 py-5 sm:grid-cols-[7rem_10rem_1fr] sm:gap-5"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
                {String(index + 1).padStart(2, '0')} · {step.actor}
              </p>
              <p className="text-sm font-semibold text-text-primary">{step.action}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{step.result}</p>
            </li>
          ))}
        </ol>

        <p className="border-y-2 border-text-primary py-3 text-sm font-semibold text-text-primary">
          {content.closingLabel}
        </p>
      </div>
    </section>
  );
}
