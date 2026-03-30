import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import CaseStudyLayout from '@/components/projects/CaseStudyLayout';

const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false }),
  'document-intelligence': dynamic(() => import('@/components/diagrams/DocumentIntelligenceDiagram'), { ssr: false }),
  'commodity-tax': dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false }),
  'aegis': dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false }),
  'astraeus': dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false }),
  'par-assist': dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false }),
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
    title: `${project.title} — ${project.subtitle} | Harmilap Singh Dhaliwal`,
    description: project.caption,
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
