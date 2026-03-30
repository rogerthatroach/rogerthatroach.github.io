import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import CaseStudyLayout from '@/components/projects/CaseStudyLayout';

function DiagramSkeleton() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border-subtle bg-surface/50 sm:h-[500px]">
      <span className="text-xs text-text-tertiary">Loading diagram...</span>
    </div>
  );
}

const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'document-intelligence': dynamic(() => import('@/components/diagrams/DocumentIntelligenceDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'commodity-tax': dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'aegis': dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'astraeus': dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false, loading: DiagramSkeleton }),
  'par-assist': dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false, loading: DiagramSkeleton }),
};

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.projectId }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = PROJECTS.find((p) => p.id === params.slug);
  if (!project) return {};

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.caption,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.caption,
      type: 'article',
    },
  };
}

export default function ProjectCaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = PROJECTS.find((p) => p.id === params.slug);
  const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === params.slug);

  if (!project || !caseStudy) notFound();

  const Diagram = DIAGRAMS[params.slug];

  return (
    <CaseStudyLayout
      project={project}
      caseStudy={caseStudy}
      diagram={Diagram ? <Diagram /> : null}
    />
  );
}
