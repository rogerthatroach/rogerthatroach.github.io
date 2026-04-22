import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import MetricsRibbon from '@/components/MetricsRibbon';
import NowBuilding from '@/components/NowBuilding';
import SkillTimeline from '@/components/SkillTimeline';
import RecognitionSection from '@/components/RecognitionSection';
import SectionProgress from '@/components/SectionProgress';
import Footer from '@/components/Footer';

const HOME_SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'through-line', label: 'Through-line' },
  { id: 'now', label: 'Now' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Projects' },
  { id: 'recognition', label: 'Recognition' },
];
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { paletteStyle } from '@/lib/palette';

export default function Home() {
  return (
    <main id="main-content">
      {/* Priority-hinted preload for the LCP portrait. Next's auto-preload
          doesn't carry fetchpriority; this one does. Next hoists <link>
          tags inside app-router components into <head>. */}
      <link
        {...({
          rel: 'preload',
          as: 'image',
          imagesrcset: '/images/portrait-sm.webp 700w, /images/portrait.webp 1000w',
          imagesizes: '(max-width: 1024px) 224px, 288px',
          fetchpriority: 'high',
        } as React.HTMLAttributes<HTMLLinkElement>)}
      />
      <Nav />
      <SectionProgress sections={HOME_SECTIONS} />
      <Hero />

      {/* Through-line + Stats — thesis and proof in one block (was two sections) */}
      <MetricsRibbon />

      {/* Present-tense momentum */}
      <NowBuilding />

      {/* The Journey — interactive career timeline (click any role for
          headline metric + transition story + per-project decision
          rationale via floating RoleOverlay). Placed above Projects so
          the reader sees the arc before the individual works. */}
      <SkillTimeline expanded heading="The Journey" />

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
                      className="palette-pill hidden shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium sm:inline"
                      style={paletteStyle(project.palette)}
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
                        className="palette-text font-mono text-sm font-bold"
                        style={paletteStyle(project.palette)}
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

      {/* Recognition: the close */}
      <RecognitionSection />

      <Footer />
    </main>
  );
}
