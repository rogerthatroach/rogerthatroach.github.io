import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import MetricsRibbon from '@/components/MetricsRibbon';
import SkillTimeline from '@/components/SkillTimeline';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { PROJECTS } from '@/data/projects';

const PARAssistDiagram = dynamic(() => import('@/components/diagrams/PARAssistDiagram'), { ssr: false });
const AstraeusDiagram = dynamic(() => import('@/components/diagrams/AstraeusDiagram'), { ssr: false });
const AegisDiagram = dynamic(() => import('@/components/diagrams/AegisDiagram'), { ssr: false });
const CombustionDiagram = dynamic(() => import('@/components/diagrams/CombustionDiagram'), { ssr: false });
const CommodityTaxDiagram = dynamic(() => import('@/components/diagrams/CommodityTaxDiagram'), { ssr: false });

const DIAGRAMS: Record<string, React.ComponentType> = {
  'par-assist': PARAssistDiagram,
  'astraeus': AstraeusDiagram,
  'aegis': AegisDiagram,
  'combustion-tuning': CombustionDiagram,
  'commodity-tax': CommodityTaxDiagram,
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
          return (
            <ProjectShowcase
              key={project.id}
              project={project}
              diagram={Diagram ? <Diagram /> : null}
              index={i}
            />
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
