import type { AstraeusPermissionCascadeContent } from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';

interface AstraeusPermissionCascadeFigureProps {
  content: AstraeusPermissionCascadeContent;
}

export default function AstraeusPermissionCascadeFigure({ content }: AstraeusPermissionCascadeFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <ol className="mt-6 divide-y divide-border-subtle border-y-2 border-text-primary lg:grid lg:grid-cols-5 lg:divide-x lg:divide-y-0 lg:divide-border-subtle">
        {content.stages.map((stage) => (
          <li key={stage.number} className="grid gap-4 py-5 lg:block lg:px-4 lg:first:pl-0 lg:last:pr-0">
            <div className="flex items-baseline gap-4 lg:block">
              <span className="font-mono text-sm font-bold text-text-primary">{stage.number}</span>
              <p className="text-base font-semibold text-text-primary lg:mt-3">{stage.title}</p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3 lg:mt-4 lg:block lg:space-y-4">
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  {content.handoffLabels[0]}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-secondary">{stage.receives}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  {content.handoffLabels[1]}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-secondary">{stage.records}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  {content.handoffLabels[2]}
                </dt>
                <dd className="mt-1 text-sm font-semibold leading-relaxed text-text-primary">{stage.failure}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.failClosedLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.failClosedDetail}</p>
      </div>

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
