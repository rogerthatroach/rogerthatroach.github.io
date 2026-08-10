import type { CommodityTaxFormalPipelineContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxFormalPipelineFigureProps {
  content: CommodityTaxFormalPipelineContent;
}

export default function CommodityTaxFormalPipelineFigure({ content }: CommodityTaxFormalPipelineFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="grid gap-3 border-y border-border-subtle py-3 md:grid-cols-2 md:gap-8">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.computeLabel}
          </p>
          <p className="border-l border-dotted border-text-primary pl-4 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.inspectionLabel}
          </p>
        </div>

        <ol className="divide-y divide-border-subtle border-b border-border-subtle">
          {content.stages.map((stage) => (
            <li key={stage.id} className="grid gap-4 py-5 md:grid-cols-[3rem_1.35fr_1fr] md:gap-6">
              <p className="font-mono text-base font-bold text-text-primary">{stage.stage}</p>
              <div className="border-l-2 border-text-primary pl-4">
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary md:hidden">
                  {content.mobileComputeLabel}
                </p>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-text-primary">{stage.name}</p>
                  <p className="font-mono text-xs text-text-tertiary">{stage.transform}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.computeDetail}</p>
              </div>
              <div className="border-l border-dotted border-text-primary pl-4">
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary md:hidden">
                  {content.mobileInspectionLabel}
                </p>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  {stage.inspection}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.inspectionDetail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.analystLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.analystDetail}
          </p>
        </div>

        <dl className="mt-7 grid gap-4 sm:grid-cols-3">
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
