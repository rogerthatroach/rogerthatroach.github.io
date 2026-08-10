import type { ParFormalEnvelopeContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParFormalEnvelopeFigureProps {
  content: ParFormalEnvelopeContent;
}

export default function ParFormalEnvelopeFigure({ content }: ParFormalEnvelopeFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="grid gap-3 border-l-4 border-text-primary py-2 pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.humanInput}
          </p>
          <p className="text-sm text-text-secondary">
            {content.humanInputDetail}
          </p>
        </div>

        <div className="ml-3 border-l-2 border-t-2 border-text-primary pl-5 pt-5 sm:ml-7 sm:pl-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-text-primary" />
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                {content.envelopeLabel}
              </p>
            </div>
            <p className="text-xs font-semibold text-text-secondary">{content.envelopeDetail}</p>
          </div>

          <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            {content.graphLabel}
          </p>

          <div className="relative mt-4">
            <span
              aria-hidden="true"
              className="absolute top-2 right-0 left-0 hidden h-px bg-text-primary lg:block"
            />
            <ol className="ml-2 border-l-2 border-text-primary pl-6 lg:ml-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:border-l-0 lg:pl-0 lg:pt-8">
              {content.nodes.map((node, index) => (
                <li
                  key={node.id}
                  className="relative pb-7 last:pb-0 lg:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 -left-[2.05rem] z-10 flex h-4 w-4 items-center justify-center border border-text-primary bg-background lg:-top-[1.875rem] lg:left-0"
                  />
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {String(index + 1).padStart(2, '0')} · {node.category}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">{node.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{node.detail}</p>
                  {node.tool && (
                    <p className="mt-3 border-l border-dashed border-text-primary pl-3 text-xs leading-relaxed text-text-tertiary">
                      {node.tool}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <section className="mt-7" aria-labelledby={`${content.id}-branch`}>
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
                  className={`py-4 ${index === 0 ? 'border-b border-border-subtle md:border-b-0 md:pr-6' : 'md:pl-6'}`}
                >
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {outcome.condition}
                  </p>
                  <p className="mt-2 text-base font-semibold text-text-primary">{outcome.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{outcome.detail}</p>
                  {index === 0 && (
                    <p className="mt-4 border-l-4 border-text-primary pl-3 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                      {content.humanOutput}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="mt-7 border-y border-border-subtle py-3">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {content.stateLabel}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {content.stateItems.map((item) => (
                <li key={item} className="text-xs text-text-secondary">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {content.legend.map((item) => (
            <div key={item.label} className="grid grid-cols-[auto_1fr] gap-3 border-t border-border-subtle pt-3">
              <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                {item.label}
              </dt>
              <dd className="text-xs leading-relaxed text-text-secondary">{item.detail}</dd>
            </div>
          ))}
        </dl>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
