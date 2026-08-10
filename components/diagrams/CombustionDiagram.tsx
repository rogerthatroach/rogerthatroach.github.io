import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { CombustionCaseFlowFigure } from '@/components/visualizations/combustion';
import { COMBUSTION_CASE_FLOW } from '@/data/visualizations/combustion';

export default function CombustionDiagram() {
  return (
    <VisualizationContainer minHeight={0} caption={COMBUSTION_CASE_FLOW.caption} variant="open">
      <CombustionCaseFlowFigure content={COMBUSTION_CASE_FLOW} />
    </VisualizationContainer>
  );
}
