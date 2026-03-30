import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import EraTransition from '@/components/EraTransition';
import MetricsRibbon from '@/components/MetricsRibbon';
import SkillTimeline from '@/components/SkillTimeline';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { PROJECTS } from '@/data/projects';

const CombustionDiagram = dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false });
const DocumentIntelligenceDiagram = dynamic(() => import('@/components/diagrams/DocumentIntelligenceDiagram'), { ssr: false });
const CommodityTaxDiagram = dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false });
const AegisDiagram = dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false });
const AstraeusDiagram = dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false });
const PARAssistDiagram = dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false });

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
    <main>
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

      <MetricsRibbon />
      <SkillTimeline />
      <AboutSection />
      <Footer />
    </main>
  );
}
