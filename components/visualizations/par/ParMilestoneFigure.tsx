import type { ParMilestoneContent } from '@/data/visualizations/par';
import ParFigureHeader from './ParFigureHeader';

interface ParMilestoneFigureProps {
  content: ParMilestoneContent;
}

export default function ParMilestoneFigure({ content }: ParMilestoneFigureProps) {
  return (
    <section className="par-figure" aria-labelledby={`${content.id}-title`}>
      <ParFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <ol className="ml-2 border-l-2 border-text-primary lg:ml-0 lg:grid lg:grid-cols-5 lg:border-l-0 lg:border-t-2">
          {content.milestones.map((milestone, index) => (
            <li key={`${milestone.marker}-${milestone.title}`} className="relative pb-7 pl-6 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-5 lg:pt-6 lg:last:pr-0">
              <span
                aria-hidden="true"
                className="absolute -left-1.5 top-1 h-3 w-3 bg-text-primary lg:-top-1.5 lg:left-0"
              />
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                {String(index + 1).padStart(2, '0')} · {milestone.marker}
              </p>
              <p className="mt-2 text-base font-semibold leading-snug text-text-primary">
                {milestone.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {milestone.detail}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.ownershipLabel}
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            {content.ownershipDetail}
          </p>
        </div>
      </div>
    </section>
  );
}
