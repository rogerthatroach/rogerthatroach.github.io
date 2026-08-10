type DiagramModule = { default: React.ComponentType };

// Resolve only the selected case-study figure so each route loads its own
// explanation rather than every project renderer.
const DIAGRAM_LOADERS: Record<string, () => Promise<DiagramModule>> = {
  'combustion-tuning': () => import('@/components/diagrams/CombustionDiagram'),
  'document-intelligence': () => import('@/components/diagrams/DocumentIntelligenceDiagram'),
  'commodity-tax': () => import('@/components/diagrams/CommodityTaxDiagram'),
  'aegis': () => import('@/components/diagrams/AegisDiagram'),
  'astraeus': () => import('@/components/diagrams/AstraeusDiagram'),
  'par-assist': () => import('@/components/diagrams/PARAssistDiagram'),
};

export default async function ProjectDiagram({ slug }: { slug: string }) {
  const loadDiagram = DIAGRAM_LOADERS[slug];
  if (!loadDiagram) return null;

  const { default: Diagram } = await loadDiagram();
  return <Diagram />;
}
