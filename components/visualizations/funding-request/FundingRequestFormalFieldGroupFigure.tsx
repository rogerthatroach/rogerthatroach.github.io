import type { ParFormalFieldGroupContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParFormalFieldGroupFigureProps {
  content: ParFormalFieldGroupContent;
}

export default function ParFormalFieldGroupFigure({ content }: ParFormalFieldGroupFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="border-y border-dotted border-text-primary py-4 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.overlapLabel}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {content.overlapDetail}
          </p>
        </div>

        <div className="relative mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute -top-6 bottom-0 left-1/2 hidden border-l border-dotted border-text-primary md:block"
          />
          {content.lanes.map((lane) => (
            <section key={lane.id} className="relative border-t-2 border-text-primary pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                  {lane.label}
                </h4>
                <p className="text-xs font-semibold text-text-tertiary">{lane.ownedFields}</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="border-l border-dotted border-text-primary pl-3">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {content.evidenceLabel}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{lane.evidence}</p>
                </div>
                <span aria-hidden="true" className="hidden text-text-tertiary sm:block">→</span>
                <div className="border-l border-dashed border-text-primary pl-3">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {content.routineLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{lane.routine}</p>
                </div>
              </div>

              <p className="mt-4 border-y border-border-subtle py-3 text-sm font-semibold text-text-primary">
                {lane.result}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-7 flex justify-center" aria-hidden="true">
          <span className="h-6 border-l-2 border-text-primary" />
        </div>
        <section className="border-y-2 border-text-primary py-4 text-center">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.mergeLabel}
          </h4>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {content.mergeDetail}
          </p>
          <p className="mt-3 text-base font-semibold text-text-primary">{content.resultLabel}</p>
        </section>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
