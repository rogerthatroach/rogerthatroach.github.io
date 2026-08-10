import type { CommodityTaxProcessContrastContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxProcessContrastFigureProps {
  content: CommodityTaxProcessContrastContent;
}

export default function CommodityTaxProcessContrastFigure({ content }: CommodityTaxProcessContrastFigureProps) {
  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
        {[
          { label: content.beforeLabel, steps: content.beforeSteps, governed: false },
          { label: content.afterLabel, steps: content.afterSteps, governed: true },
        ].map((column) => (
          <section
            key={column.label}
            className={column.governed ? 'border-t-4 border-text-primary pt-4' : 'border-t border-dashed border-text-primary pt-4'}
          >
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {column.label}
            </h4>
            <ol className="mt-3 divide-y divide-border-subtle">
              {column.steps.map((step, index) => (
                <li key={step.label} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
                  <span className="font-mono text-xs font-bold text-text-tertiary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.decisionLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">
          {content.decisionDetail}
        </p>
      </div>
    </section>
  );
}
