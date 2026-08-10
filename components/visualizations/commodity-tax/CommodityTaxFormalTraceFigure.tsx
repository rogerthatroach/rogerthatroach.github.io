import type { CommodityTaxFormalTraceContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxFormalTraceFigureProps {
  content: CommodityTaxFormalTraceContent;
}

export default function CommodityTaxFormalTraceFigure({ content }: CommodityTaxFormalTraceFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.selectionLabel}
          </p>
          <p className="font-mono text-sm font-semibold text-text-primary">{content.selectionDetail}</p>
        </div>

        <ol className="mt-6 ml-2 border-l-2 border-text-primary lg:ml-0 lg:grid lg:grid-cols-5 lg:border-l-0 lg:border-t-2">
          {content.levels.map((level) => (
            <li key={level.id} className="relative pb-7 pl-6 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-5 lg:pt-6 lg:last:pr-0">
              <span aria-hidden="true" className="absolute -left-1.5 top-1 h-3 w-3 border border-text-primary bg-background lg:-top-1.5 lg:left-0" />
              <p className="font-mono text-xs font-bold text-text-primary">{level.symbol}</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">{level.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{level.detail}</p>
              {level.relation && (
                <p className="mt-3 border-l border-dotted border-text-primary pl-3 font-mono text-xs leading-relaxed text-text-tertiary">
                  {level.relation}
                </p>
              )}
            </li>
          ))}
        </ol>

        <section className="mt-7 border-t border-border-subtle pt-4">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.assumptionsLabel}
          </h4>
          <ul className="mt-3 grid gap-x-7 gap-y-3 sm:grid-cols-2">
            {content.assumptions.map((assumption) => (
              <li key={assumption} className="flex gap-3 text-xs leading-relaxed text-text-secondary">
                <span aria-hidden="true" className="text-text-tertiary">—</span>
                <span>{assumption}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.boundaryLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.boundaryDetail}
          </p>
        </div>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
