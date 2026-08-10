import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisDecisionSpineContent } from '@/data/visualizations/aegis';

export default function AegisDecisionSpineFigure({ content }: { content: AegisDecisionSpineContent }) {
  const headingId = content.id + '-title';
  const stageById = new Map(content.stages.map((stage) => [stage.id, stage]));
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <ol className="mt-7 grid gap-3 lg:grid-cols-5">
        {content.stages.map((stage) => (
          <li key={stage.id} className="border-t-2 border-text-primary pt-4">
            <p className="font-mono text-sm font-bold text-text-primary">{stage.number}</p>
            <p className="mt-2 text-base font-semibold text-text-primary">{stage.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{stage.job}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 hidden grid-cols-[auto_1fr_1fr_1fr] gap-5 border-b border-border-subtle pb-3 md:grid">
        <span aria-hidden="true" />
        {content.columnLabels.map((label) => (
          <p key={label} className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">{label}</p>
        ))}
      </div>
      <ol className="divide-y divide-border-subtle border-b border-border-subtle">
        {content.decisions.map((decision) => (
          <li key={decision.number} className="grid gap-4 py-5 md:grid-cols-[3rem_1fr_1fr_1fr] md:gap-5">
            <div>
              <p className="font-mono text-base font-bold text-text-primary">{decision.number}</p>
              <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
                {decision.stageIds.map((stageId) => stageById.get(stageId)?.name).filter(Boolean).join(' · ')}
              </p>
            </div>
            {[
              [content.columnLabels[0], decision.pressure],
              [content.columnLabels[1], decision.choice],
              [content.columnLabels[2], decision.tradeoff],
            ].map(([label, value]) => (
              <div key={label} className="border-l border-border-subtle pl-4">
                <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary md:hidden">{label}</p>
                <p className="text-sm leading-relaxed text-text-secondary">{value}</p>
              </div>
            ))}
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.operatingRuleLabel}</p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.operatingRuleDetail}</p>
      </div>
    </section>
  );
}
