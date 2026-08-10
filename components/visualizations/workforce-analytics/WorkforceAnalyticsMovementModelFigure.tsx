import type { WorkforceAnalyticsMovementModelContent } from '@/data/visualizations/workforceAnalytics';
import FigureHeader from '@/components/visualizations/FigureHeader';
import WorkforceAnalyticsMovementScenario from './WorkforceAnalyticsMovementScenario.client';

interface WorkforceAnalyticsMovementModelFigureProps {
  content: WorkforceAnalyticsMovementModelContent;
}

export default function WorkforceAnalyticsMovementModelFigure({ content }: WorkforceAnalyticsMovementModelFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <WorkforceAnalyticsMovementScenario content={content} />

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
