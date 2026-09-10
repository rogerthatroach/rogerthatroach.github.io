import VisualizationContainer from '@/components/blog/VisualizationContainer';
import {
  FundingRequestFieldGroupFigure,
  FundingRequestOverviewFigure,
} from '@/components/visualizations/funding-request';
import {
  FUNDING_REQUEST_CASE_OVERVIEW,
  FUNDING_REQUEST_CASE_STUDY_INTRO,
  FUNDING_REQUEST_FIELD_GROUP_LENS,
} from '@/data/visualizations/fundingRequest';

export default function FundingRequestDraftingDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {FUNDING_REQUEST_CASE_STUDY_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={FUNDING_REQUEST_CASE_OVERVIEW.caption} variant="open">
        <FundingRequestOverviewFigure content={FUNDING_REQUEST_CASE_OVERVIEW} />
      </VisualizationContainer>
      <VisualizationContainer minHeight={0} caption={FUNDING_REQUEST_FIELD_GROUP_LENS.caption} variant="open">
        <FundingRequestFieldGroupFigure content={FUNDING_REQUEST_FIELD_GROUP_LENS} />
      </VisualizationContainer>
    </div>
  );
}
