import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { FinancialBenchmarkingCaseSpineFigure } from '@/components/visualizations/financialBenchmarking';
import { FINANCIAL_BENCHMARKING_CASE_SPINE } from '@/data/visualizations/financialBenchmarking';

export default function FinancialBenchmarkingDiagram() {
  return (
    <VisualizationContainer minHeight={0} caption={FINANCIAL_BENCHMARKING_CASE_SPINE.caption} variant="open">
      <FinancialBenchmarkingCaseSpineFigure content={FINANCIAL_BENCHMARKING_CASE_SPINE} />
    </VisualizationContainer>
  );
}
