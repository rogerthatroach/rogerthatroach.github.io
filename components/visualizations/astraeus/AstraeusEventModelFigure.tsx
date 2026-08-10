import type { AstraeusEventModelContent } from '@/data/visualizations/astraeus';
import FigureHeader from '@/components/visualizations/FigureHeader';
import AstraeusEventScenario from './AstraeusEventScenario.client';

interface AstraeusEventModelFigureProps {
  content: AstraeusEventModelContent;
}

export default function AstraeusEventModelFigure({ content }: AstraeusEventModelFigureProps) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <AstraeusEventScenario content={content} />

      {content.caveat && (
        <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
      )}
    </section>
  );
}
