import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisMilestoneContent } from '@/data/visualizations/aegis';

export default function AegisMilestoneFigure({ content }: { content: AegisMilestoneContent }) {
  const headingId = content.id + '-title';
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <ol className="mt-7 ml-2 border-l-2 border-text-primary lg:ml-0 lg:grid lg:grid-cols-5 lg:border-l-0 lg:border-t-2">
        {content.milestones.map((milestone, index) => (
          <li key={milestone.title} className="relative pb-8 pl-7 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-5 lg:pt-7 lg:last:pr-0">
            <span aria-hidden="true" className="absolute -left-1.5 top-1 h-3 w-3 border border-text-primary bg-background lg:-top-1.5 lg:left-0" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
              {String(index + 1).padStart(2, '0')} · {milestone.marker}
            </p>
            <p className="mt-3 text-base font-semibold text-text-primary">{milestone.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{milestone.detail}</p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.continuityLabel}</p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.continuityDetail}</p>
      </div>
      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
