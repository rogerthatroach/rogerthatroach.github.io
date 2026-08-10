import type { CommodityTaxDecisionMapContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxDecisionMapFigureProps {
  content: CommodityTaxDecisionMapContent;
}

export default function CommodityTaxDecisionMapFigure({ content }: CommodityTaxDecisionMapFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <div className="hidden grid-cols-[3rem_1fr_1fr_1fr] gap-5 border-b-2 border-text-primary pb-3 md:grid">
          <span aria-hidden="true" />
          {content.columnLabels.map((label) => (
            <p key={label} className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {label}
            </p>
          ))}
        </div>

        <ol className="divide-y divide-border-subtle border-y border-border-subtle md:border-t-0">
          {content.decisions.map((decision) => (
            <li key={decision.number} className="grid gap-5 py-6 md:grid-cols-[3rem_1fr_1fr_1fr]">
              <span className="font-mono text-lg font-bold text-text-primary">{decision.number}</span>
              {[decision.pressure, decision.choice, decision.operatingConsequence].map((value, index) => (
                <div key={content.columnLabels[index]}>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary md:hidden">
                    {content.columnLabels[index]}
                  </p>
                  <p className={`mt-1 text-sm leading-relaxed md:mt-0 ${index === 1 ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.operatingRuleLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.operatingRuleDetail}
          </p>
        </div>
      </div>
    </section>
  );
}
