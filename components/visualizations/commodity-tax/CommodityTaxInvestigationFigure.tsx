import type { CommodityTaxInvestigationContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxInvestigationFigureProps {
  content: CommodityTaxInvestigationContent;
}

export default function CommodityTaxInvestigationFigure({ content }: CommodityTaxInvestigationFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="grid gap-3 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.triggerLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.triggerDetail}
          </p>
        </div>

        <ol className="divide-y divide-border-subtle border-b border-border-subtle">
          {content.steps.map((step) => (
            <li key={step.number} className="grid gap-3 py-5 sm:grid-cols-[3rem_10rem_1fr] sm:gap-5">
              <span className="font-mono text-sm font-bold text-text-primary">{step.number}</span>
              <p className="text-sm font-semibold text-text-primary">{step.action}</p>
              <p className="border-l border-dotted border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
                {step.evidence}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-7 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.outcomeLabel}
        </p>
        <div className="mt-3 grid border-y border-border-subtle md:grid-cols-3 md:divide-x md:divide-border-subtle">
          {content.outcomes.map((outcome, index) => (
            <div
              key={outcome.title}
              className={`py-5 md:px-5 md:first:pl-0 md:last:pr-0 ${
                index < content.outcomes.length - 1 ? 'border-b border-border-subtle md:border-b-0' : ''
              }`}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                {outcome.condition}
              </p>
              <p className="mt-2 text-base font-semibold text-text-primary">{outcome.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{outcome.detail}</p>
            </div>
          ))}
        </div>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
