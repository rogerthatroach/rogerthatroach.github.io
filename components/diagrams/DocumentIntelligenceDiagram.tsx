import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { DocumentIntelligenceSpecimenFigure } from '@/components/visualizations/document-intelligence';
import { DOCUMENT_INTELLIGENCE_SPECIMEN } from '@/data/visualizations/documentIntelligence';

export default function DocumentIntelligenceDiagram() {
  return (
    <VisualizationContainer
      minHeight={0}
      caption={DOCUMENT_INTELLIGENCE_SPECIMEN.caption}
      variant="open"
    >
      <DocumentIntelligenceSpecimenFigure content={DOCUMENT_INTELLIGENCE_SPECIMEN} />
    </VisualizationContainer>
  );
}
