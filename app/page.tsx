import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import CareerArcNarrative from '@/components/CareerArcNarrative';
import MetricsRibbon from '@/components/MetricsRibbon';
import NowBuilding from '@/components/NowBuilding';
import ProjectCard from '@/components/projects/ProjectCard';
import SkillTimeline from '@/components/SkillTimeline';
import AboutSection from '@/components/AboutSection';
import RecognitionSection from '@/components/RecognitionSection';
import Footer from '@/components/Footer';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

export default function Home() {
  return (
    <main id="main-content">
      <Nav />
      <Hero />

      {/* Through-line: the thesis that ties every system together */}
      <CareerArcNarrative />

      {/* Stats: the proof behind the thesis */}
      <MetricsRibbon />

      {/* Present-tense momentum */}
      <NowBuilding />

      {/* Projects: six entry points into the three-layer funnel.
          Simplified cards (no ReactFlow on homepage) — era badges carry the career arc.
          Full cards with diagrams live on /projects and case study pages. */}
      <section id="work" className="px-6 py-20 md:px-16">
        <div className="mx-auto max-w-content">
          <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">Projects</h2>
          <p className="mb-10 max-w-2xl text-sm text-text-secondary">
            Six systems across eight years. From power plant combustion tuning to bank-wide agentic
            AI. Click any card for the full case study.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {PROJECTS.map((project, i) => {
              const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
              if (!caseStudy) return null;
              const isBookend = i === 0 || i === PROJECTS.length - 1;
              return (
                <div key={project.id} className={isBookend ? 'sm:col-span-2' : ''}>
                  <ProjectCard project={project} caseStudy={caseStudy} index={i} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey zoom-out */}
      <SkillTimeline />

      {/* Leadership philosophy */}
      <AboutSection />

      {/* Recognition: the close */}
      <RecognitionSection />

      <Footer />
    </main>
  );
}
