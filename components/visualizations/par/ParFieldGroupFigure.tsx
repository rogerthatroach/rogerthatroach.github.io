import type { ParFieldGroupContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParFieldGroupFigureProps {
  content: ParFieldGroupContent;
}

export default function ParFieldGroupFigure({ content }: ParFieldGroupFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="border-l-4 border-text-primary pl-4">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.scopeLabel}
          </p>
        </div>

        <div className="mt-5 border-y border-border-subtle md:grid md:grid-cols-3 md:divide-x md:divide-border-subtle">
          {content.columns.map((column, index) => (
            <section
              key={column.label}
              className={`py-5 md:px-5 md:first:pl-0 md:last:pr-0 ${index < content.columns.length - 1 ? 'border-b border-border-subtle md:border-b-0' : ''}`}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                {String(index + 1).padStart(2, '0')} · {column.label}
              </p>
              <h4 className="mt-2 text-base font-semibold text-text-primary">{column.title}</h4>
              <ul className={`mt-4 space-y-3 ${index === 2 ? 'border-l border-dashed border-text-primary pl-4' : ''}`}>
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                    <span aria-hidden="true" className="font-mono text-text-tertiary">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-text-tertiary">{column.note}</p>
            </section>
          ))}
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <section>
            <h4 className="border-b-2 border-text-primary pb-2 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {content.mergeLabel}
            </h4>
            <ol className="divide-y divide-border-subtle">
              {content.mergeRules.map((rule, index) => (
                <li key={rule} className="grid grid-cols-[2rem_1fr] gap-3 py-3 text-sm leading-relaxed text-text-secondary">
                  <span className="font-mono text-xs font-bold text-text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t-4 border-text-primary px-4 py-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {content.coverageLabel}
            </h4>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-text-primary">
              {content.coveragePass}
            </p>
            <p className="mt-4 border-t border-border-subtle pt-4 text-sm leading-relaxed text-text-secondary">
              {content.coverageReturn}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
