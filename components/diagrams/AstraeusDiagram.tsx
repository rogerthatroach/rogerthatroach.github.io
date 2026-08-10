import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { AstraeusCaseOverviewFigure } from '@/components/visualizations/astraeus';
import { ASTRAEUS_CASE_INTRO, ASTRAEUS_CASE_OVERVIEW } from '@/data/visualizations/astraeus';

export default function AstraeusDiagram() {
  return (
    <div>
      <p className="max-w-3xl border-l-2 border-text-primary pl-4 text-sm leading-relaxed text-text-secondary">
        {ASTRAEUS_CASE_INTRO}
      </p>
      <VisualizationContainer minHeight={0} caption={ASTRAEUS_CASE_OVERVIEW.caption} variant="open">
        <AstraeusCaseOverviewFigure content={ASTRAEUS_CASE_OVERVIEW} />
      </VisualizationContainer>
    </div>
  );
}
