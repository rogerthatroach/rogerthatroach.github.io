import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { ParFieldGroupFigure, ParOverviewFigure } from '@/components/visualizations/par';
import { PAR_CASE_OVERVIEW, PAR_CASE_STUDY_INTRO, PAR_FIELD_GROUP_LENS } from '@/data/visualizations/par';

export default function PARAssistDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {PAR_CASE_STUDY_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={PAR_CASE_OVERVIEW.caption} variant="open">
        <ParOverviewFigure content={PAR_CASE_OVERVIEW} />
      </VisualizationContainer>
      <VisualizationContainer minHeight={0} caption={PAR_FIELD_GROUP_LENS.caption} variant="open">
        <ParFieldGroupFigure content={PAR_FIELD_GROUP_LENS} />
      </VisualizationContainer>
    </div>
  );
}
