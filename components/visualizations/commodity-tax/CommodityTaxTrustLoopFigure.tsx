import type { CommodityTaxTrustLoopContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxTrustLoopFigureProps {
  content: CommodityTaxTrustLoopContent;
}

export default function CommodityTaxTrustLoopFigure({ content }: CommodityTaxTrustLoopFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <p className="border-y-2 border-text-primary py-3 text-sm font-semibold text-text-primary">
          {content.openingLabel}
        </p>
        <ol className="ml-2 border-l-2 border-text-primary md:ml-0 md:grid md:grid-cols-5 md:border-l-0 md:border-t-2">
          {content.steps.map((step, index) => (
            <li key={`${step.actor}-${step.action}`} className="relative pb-7 pl-6 last:pb-0 md:pb-0 md:pl-0 md:pr-5 md:pt-6 md:last:pr-0">
              <span aria-hidden="true" className="absolute -left-1.5 top-1 h-3 w-3 bg-text-primary md:-top-1.5 md:left-0" />
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {String(index + 1).padStart(2, '0')} · {step.actor}
              </p>
              <p className="mt-2 text-sm font-semibold text-text-primary">{step.action}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{step.result}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid grid-cols-[auto_1fr] gap-3 border-y border-dashed border-text-primary py-4">
          <span aria-hidden="true" className="font-display text-2xl leading-none text-text-primary">
            ↶
          </span>
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
              {content.loopLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{content.loopDetail}</p>
          </div>
        </div>
        <div className="mt-7 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.closingLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.closingDetail}
          </p>
        </div>
        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
