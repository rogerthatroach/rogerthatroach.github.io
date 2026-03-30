import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import EraTransition from '@/components/EraTransition';
import CareerArcNarrative from '@/components/CareerArcNarrative';
import MetricsRibbon from '@/components/MetricsRibbon';
import SkillTimeline from '@/components/SkillTimeline';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { PROJECTS } from '@/data/projects';

function DiagramSkeleton() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border-subtle bg-surface/50 sm:h-[500px]">
      <span className="text-xs text-text-tertiary">Loading diagram...</span>
    </div>
  );
}

const CombustionDiagram = dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false, loading: DiagramSkeleton });
const DocumentIntelligenceDiagram = dynamic(() => import('@/components/diagrams/DocumentIntelligenceDiagram'), { ssr: false, loading: DiagramSkeleton });
const CommodityTaxDiagram = dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false, loading: DiagramSkeleton });
const AegisDiagram = dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false, loading: DiagramSkeleton });
const AstraeusDiagram = dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false, loading: DiagramSkeleton });
const PARAssistDiagram = dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false, loading: DiagramSkeleton });

const DIAGRAMS: Record<string, React.ComponentType> = {
  'combustion-tuning': CombustionDiagram,
  'document-intelligence': DocumentIntelligenceDiagram,
  'commodity-tax': CommodityTaxDiagram,
  'aegis': AegisDiagram,
  'astraeus': AstraeusDiagram,
  'par-assist': PARAssistDiagram,
};

const ERA_TRANSITIONS: Record<number, { label: string; years: string }> = {
  1: { label: 'From plant floors to cloud pipelines', years: '2019 → 2021' },
  2: { label: 'From cloud to enterprise finance', years: '2022' },
  3: { label: 'From analytics to intelligent systems', years: '2024' },
};

export default function Home() {
  return (
    <main id="main-content">
      <Nav />
      <Hero />

      {/* Projects — full viewport showcases with architecture diagrams */}
      <div id="work">
        {PROJECTS.map((project, i) => {
          const Diagram = DIAGRAMS[project.id];
          const transition = ERA_TRANSITIONS[i];
          return (
            <div key={project.id}>
              {transition && (
                <EraTransition label={transition.label} years={transition.years} />
              )}
              <ProjectShowcase
                project={project}
                diagram={Diagram ? <Diagram /> : null}
                index={i}
              />
            </div>
          );
        })}
      </div>

      <CareerArcNarrative />
      <MetricsRibbon />
      <SkillTimeline />
      <AboutSection />
      <Footer />
    </main>
  );
}
