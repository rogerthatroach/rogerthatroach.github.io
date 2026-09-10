import VisualizationContainer from '@/components/blog/VisualizationContainer';
import {
  FundingRequestFieldGroupFigure,
  FundingRequestOverviewFigure,
} from '@/components/visualizations/project-approval';
import {
  PROJECT_APPROVAL_CASE_OVERVIEW,
  PROJECT_APPROVAL_CASE_STUDY_INTRO,
  PROJECT_APPROVAL_FIELD_GROUP_LENS,
} from '@/data/visualizations/projectApproval';

export default function FundingRequestDraftingDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {PROJECT_APPROVAL_CASE_STUDY_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={PROJECT_APPROVAL_CASE_OVERVIEW.caption} variant="open">
        <FundingRequestOverviewFigure content={PROJECT_APPROVAL_CASE_OVERVIEW} />
      </VisualizationContainer>
      <VisualizationContainer minHeight={0} caption={PROJECT_APPROVAL_FIELD_GROUP_LENS.caption} variant="open">
        <FundingRequestFieldGroupFigure content={PROJECT_APPROVAL_FIELD_GROUP_LENS} />
      </VisualizationContainer>
    </div>
  );
}
