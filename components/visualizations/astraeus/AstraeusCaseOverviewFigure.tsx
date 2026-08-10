import type { AstraeusCaseOverviewContent } from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';
import AstraeusScenarioSwitch from './AstraeusScenarioSwitch.client';

interface AstraeusCaseOverviewFigureProps {
  content: AstraeusCaseOverviewContent;
}

export default function AstraeusCaseOverviewFigure({ content }: AstraeusCaseOverviewFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <AstraeusScenarioSwitch content={content} />

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
