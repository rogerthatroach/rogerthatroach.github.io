import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { WorkforceAnalyticsCaseOverviewFigure } from '@/components/visualizations/workforceAnalytics';
import { WORKFORCE_ANALYTICS_CASE_INTRO, WORKFORCE_ANALYTICS_CASE_OVERVIEW } from '@/data/visualizations/workforceAnalytics';

export default function WorkforceAnalyticsDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {WORKFORCE_ANALYTICS_CASE_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={WORKFORCE_ANALYTICS_CASE_OVERVIEW.caption} variant="open">
        <WorkforceAnalyticsCaseOverviewFigure content={WORKFORCE_ANALYTICS_CASE_OVERVIEW} />
      </VisualizationContainer>
    </div>
  );
}
