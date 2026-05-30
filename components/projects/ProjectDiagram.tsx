'use client';

import dynamic from 'next/dynamic';

function DiagramSkeleton() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border-subtle bg-surface/50 sm:h-[500px]">
      <span className="text-xs text-text-tertiary">Loading diagram...</span>
    </div>
  );
}

// next/dynamic with { ssr: false } must live in a Client Component as of
// Next 16 (it was allowed in Server Components through Next 14). The ReactFlow
// architecture diagrams are client-only, so this wrapper owns the lazy map and
// the case-study page (a Server Component) just passes the slug.
const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'document-intelligence': dynamic(() => import('@/components/diagrams/DocumentIntelligenceDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'commodity-tax': dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'aegis': dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'astraeus': dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'par-assist': dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false, loading: DiagramSkeleton }),
};

export default function ProjectDiagram({ slug }: { slug: string }) {
  const Diagram = DIAGRAMS[slug];
  return Diagram ? <Diagram /> : null;
}
