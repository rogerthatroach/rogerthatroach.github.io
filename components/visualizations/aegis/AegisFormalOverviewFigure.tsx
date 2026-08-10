import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisFormalOverviewContent } from '@/data/visualizations/aegis';

export default function AegisFormalOverviewFigure({ content }: { content: AegisFormalOverviewContent }) {
  const headingId = content.id + '-title';
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <div className="mt-7 hidden grid-cols-[3.5rem_0.8fr_1fr_1fr_1fr_1fr] gap-4 border-b border-border-subtle pb-3 lg:grid">
        <span aria-hidden="true" />
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">Stage</p>
        {content.columnLabels.map((label) => (
          <p key={label} className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">{label}</p>
        ))}
      </div>
      <ol className="divide-y divide-border-subtle border-b border-border-subtle">
        {content.stages.map((stage) => {
          const boundaries = content.boundaries.filter((boundary) => boundary.afterStageId === stage.id);
          return (
            <li key={stage.id}>
              <div className="grid gap-4 py-5 lg:grid-cols-[3.5rem_0.8fr_1fr_1fr_1fr_1fr] lg:gap-4">
                <p className="font-mono text-base font-bold text-text-primary">{stage.number}</p>
                <p className="text-sm font-semibold text-text-primary">{stage.name}</p>
                {[
                  ['Input', stage.input],
                  ['Output', stage.output],
                  ['Primary control', stage.control],
                  ['Failure response', stage.failure],
                ].map(([label, value]) => (
                  <div key={label} className="border-l border-border-subtle pl-4">
                    <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary lg:hidden">{label}</p>
                    <p className="text-sm leading-relaxed text-text-secondary">{value}</p>
                  </div>
                ))}
              </div>
              {boundaries.map((boundary) => (
                <div key={boundary.label} className="mb-4 grid gap-2 border-y border-dotted border-text-primary py-3 sm:grid-cols-[auto_1fr] sm:gap-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{boundary.label}</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{boundary.detail}</p>
                </div>
              ))}
            </li>
          );
        })}
      </ol>
      <dl className="mt-7 grid gap-4 sm:grid-cols-3">
        {content.legend.map((item) => (
          <div key={item.label} className="border-t-2 border-text-primary pt-3">
            <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">{item.label}</dt>
            <dd className="mt-2 text-xs leading-relaxed text-text-secondary">{item.detail}</dd>
          </div>
        ))}
      </dl>
      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
