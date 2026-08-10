import VisualizationContainer from '@/components/blog/VisualizationContainer';
import {
  CommodityTaxOverviewFigure,
  CommodityTaxTraceFigure,
} from '@/components/visualizations/commodity-tax';
import {
  COMMODITY_TAX_CASE_INTRO,
  COMMODITY_TAX_CASE_OVERVIEW,
  COMMODITY_TAX_CASE_TRACE,
} from '@/data/visualizations/commodityTax';

export default function CommodityTaxDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {COMMODITY_TAX_CASE_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={COMMODITY_TAX_CASE_OVERVIEW.caption} variant="open">
        <CommodityTaxOverviewFigure content={COMMODITY_TAX_CASE_OVERVIEW} />
      </VisualizationContainer>
      <VisualizationContainer minHeight={0} caption={COMMODITY_TAX_CASE_TRACE.caption} variant="open">
        <CommodityTaxTraceFigure content={COMMODITY_TAX_CASE_TRACE} />
      </VisualizationContainer>
    </div>
  );
}
