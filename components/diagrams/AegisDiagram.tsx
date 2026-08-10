import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { AegisCaseSpineFigure } from '@/components/visualizations/aegis';
import { AEGIS_CASE_SPINE } from '@/data/visualizations/aegis';

export default function AegisDiagram() {
  return (
    <VisualizationContainer minHeight={0} caption={AEGIS_CASE_SPINE.caption} variant="open">
      <AegisCaseSpineFigure content={AEGIS_CASE_SPINE} />
    </VisualizationContainer>
  );
}
