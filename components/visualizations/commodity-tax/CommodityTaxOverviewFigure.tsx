import type { CommodityTaxOverviewContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxOverviewFigureProps {
  content: CommodityTaxOverviewContent;
}

export default function CommodityTaxOverviewFigure({ content }: CommodityTaxOverviewFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="hidden grid-cols-[3rem_1fr_1fr] gap-6 border-b-2 border-text-primary pb-3 md:grid">
          <span aria-hidden="true" />
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.computeLabel}
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.inspectionLabel}
          </p>
        </div>

        <ol className="divide-y divide-border-subtle border-y border-border-subtle md:border-t-0">
          {content.stages.map((stage) => (
            <li key={stage.id} className="grid gap-4 py-5 md:grid-cols-[3rem_1fr_1fr] md:gap-6">
              <p className="font-mono text-sm font-bold text-text-primary">
                {stage.number}
              </p>
              <div className="border-l-2 border-text-primary pl-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                  {content.computeLabel}
                </p>
                <p className="mt-1 text-base font-semibold text-text-primary md:mt-0">{stage.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{stage.compute}</p>
              </div>
              <div className="border-l border-dotted border-text-primary pl-4">
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                  {content.inspectionLabel}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary md:mt-0">{stage.inspection}</p>
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

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
