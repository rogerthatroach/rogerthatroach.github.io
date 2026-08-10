import FigureHeader from '@/components/visualizations/FigureHeader';
import type { ClosedLoopCycleContent } from '@/data/visualizations/closedLoop';

export default function ClosedLoopCycleFigure({ content }: { content: ClosedLoopCycleContent }) {
  const headingId = `${content.id}-title`;
  const proposalStages = content.stages.slice(0, 3);
  const actionStages = content.stages.slice(3);

  const renderStage = (stage: ClosedLoopCycleContent['stages'][number]) => (
    <li key={stage.id} className="border-t-2 border-text-primary pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-sm font-bold text-text-primary">{stage.number}</span>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          {stage.question}
        </span>
      </div>
      <p className="mt-3 text-base font-semibold text-text-primary">{stage.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.detail}</p>
      <p className="mt-3 border-l border-dotted border-text-primary pl-3 text-xs font-semibold leading-relaxed text-text-primary">
        {stage.actor}
      </p>
    </li>
  );

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-[3fr_auto_2fr] lg:items-stretch">
        <ol className="grid gap-5 sm:grid-cols-3">{proposalStages.map(renderStage)}</ol>

        <div className="border-y-2 border-text-primary py-4 lg:flex lg:w-40 lg:flex-col lg:justify-center lg:border-x-2 lg:border-y-0 lg:px-4 lg:py-0">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.boundaryLabel}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">{content.boundaryDetail}</p>
        </div>

        <ol start={4} className="grid gap-5 sm:grid-cols-2">{actionStages.map(renderStage)}</ol>
      </div>

      <p className="mt-8 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
        {content.branchLabel}
      </p>
      <div className="mt-3 grid border-y border-border-subtle md:grid-cols-2 md:divide-x md:divide-border-subtle">
        {content.branches.map((branch, index) => (
          <section
            key={branch.id}
            className={`py-5 ${index === 0 ? 'border-b border-border-subtle md:border-b-0 md:pr-6' : 'md:pl-6'}`}
            aria-labelledby={`${content.id}-${branch.id}-title`}
          >
            <p id={`${content.id}-${branch.id}-title`} className="text-base font-semibold text-text-primary">
              {branch.condition}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{branch.outcome}</p>
            <p className="mt-4 border-l-2 border-text-primary pl-3 text-sm font-semibold leading-relaxed text-text-primary">
              {branch.returnDetail}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.returnLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.returnDetail}</p>
      </div>

      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
