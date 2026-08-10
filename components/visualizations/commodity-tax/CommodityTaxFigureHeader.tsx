import type { CommodityTaxFigureBase } from '@/data/visualizations/commodityTax';

interface CommodityTaxFigureHeaderProps {
  content: CommodityTaxFigureBase;
  headingId: string;
}

export default function CommodityTaxFigureHeader({ content, headingId }: CommodityTaxFigureHeaderProps) {
  return (
    <header className="flex items-start gap-3 border-l-2 border-text-primary pl-4">
      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-text-primary" />
      <p
        id={headingId}
        role="heading"
        aria-level={content.headingLevel}
        className="max-w-3xl font-display text-lg font-semibold leading-snug text-text-primary sm:text-xl"
      >
        {content.title}
      </p>
    </header>
  );
}
