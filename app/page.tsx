import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import MetricsRibbon from '@/components/MetricsRibbon';
import NowBuilding from '@/components/NowBuilding';
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

      {/* Through-line + Stats — thesis and proof in one block (was two sections) */}
      <MetricsRibbon />

      {/* Present-tense momentum */}
      <NowBuilding />

      {/* Projects — compact list on homepage, full mosaic on /projects */}
      <section id="work" className="px-6 py-14 md:px-16">
        <div className="mx-auto max-w-content">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Projects</h2>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-text-primary"
            >
              See all case studies
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-text-secondary">
            Six systems across eight years. From power plant combustion tuning to bank-wide agentic
            AI.
          </p>

          <ul className="divide-y divide-border-subtle border-y border-border-subtle">
            {PROJECTS.map((project) => {
              const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
              if (!caseStudy) return null;
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="group flex items-center gap-4 py-4 transition-colors hover:bg-surface-hover"
                  >
                    <span
                      className="hidden shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:inline"
                      style={{
                        color: project.palette.primary,
                        backgroundColor: `${project.palette.primary}15`,
                        border: `1px solid ${project.palette.primary}30`,
                      }}
                    >
                      {caseStudy.era}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="font-semibold text-text-primary transition-colors group-hover:text-accent">
                        {project.title}
                      </span>
                      <span className="truncate text-xs text-text-tertiary sm:text-sm">
                        {project.subtitle}
                      </span>
                    </div>
                    <div className="hidden shrink-0 flex-col items-end md:flex">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: project.palette.primary }}
                      >
                        {project.heroMetric.value}
                      </span>
                      <span className="text-[10px] text-text-tertiary">
                        {project.heroMetric.label}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-text-tertiary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
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
