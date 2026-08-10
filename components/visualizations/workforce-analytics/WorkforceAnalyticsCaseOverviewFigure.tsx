import type { WorkforceAnalyticsCaseOverviewContent } from '@/data/visualizations/workforceAnalytics';
import FigureHeader from '@/components/visualizations/FigureHeader';
import WorkforceAnalyticsScenarioSwitch from './WorkforceAnalyticsScenarioSwitch.client';

interface WorkforceAnalyticsCaseOverviewFigureProps {
  content: WorkforceAnalyticsCaseOverviewContent;
}

export default function WorkforceAnalyticsCaseOverviewFigure({ content }: WorkforceAnalyticsCaseOverviewFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <WorkforceAnalyticsScenarioSwitch content={content} />

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
