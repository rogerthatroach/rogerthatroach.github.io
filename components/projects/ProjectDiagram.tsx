import CombustionDiagram from '@/components/diagrams/CombustionDiagram';
import DocumentIntelligenceDiagram from '@/components/diagrams/DocumentIntelligenceDiagram';
import CommodityTaxDiagram from '@/components/diagrams/CommodityTaxDiagram';
import AegisDiagram from '@/components/diagrams/AegisDiagram';
import AstraeusDiagram from '@/components/diagrams/AstraeusDiagram';
import PARAssistDiagram from '@/components/diagrams/PARAssistDiagram';

// Static registry: each leaf remains a Client Component, but Next can render its
// semantic fallback into the exported case-study HTML.
const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': CombustionDiagram,
  'document-intelligence': DocumentIntelligenceDiagram,
  'commodity-tax': CommodityTaxDiagram,
  'aegis': AegisDiagram,
  'astraeus': AstraeusDiagram,
  'par-assist': PARAssistDiagram,
};

export default function ProjectDiagram({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug];
  return Diagram ? <Diagram /> : null;
}
