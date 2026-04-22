import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import MetricsRibbon from '@/components/MetricsRibbon';
import SkillTimeline from '@/components/SkillTimeline';
import RecognitionSection from '@/components/RecognitionSection';
import SectionProgress from '@/components/SectionProgress';
import Footer from '@/components/Footer';
import ProjectsHybridTable from '@/components/projects/ProjectsHybridTable';

// NowBuilding removed — "current work" is surfaced by Journey's top role
// card (rbc-lead) with its role-details overlay; /now page carries the
// Sivers-style monthly focus line. Removing avoided duplicate content
// and resolved the id="now" namespace collision with the /now page.
const HOME_SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'through-line', label: 'Through-line' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Projects' },
  { id: 'recognition', label: 'Recognition' },
];
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

export default function Home() {
  const projectRows = PROJECTS.map((project) => {
    const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
    return caseStudy ? { project, caseStudy } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

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
          imagesizes: '(max-width: 1024px) 160px, 202px',
          fetchpriority: 'high',
        } as React.HTMLAttributes<HTMLLinkElement>)}
      />
      <Nav />
      <SectionProgress sections={HOME_SECTIONS} />
      <Hero />

      {/* Through-line + Stats — thesis and proof in one block (was two sections) */}
      <MetricsRibbon />

      {/* The Journey — interactive career timeline (click any role for
          headline metric + transition story + per-project decision
          rationale via floating RoleOverlay). Placed above Projects so
          the reader sees the arc before the individual works. */}
      <SkillTimeline expanded heading="The Journey" />

      {/* Projects — compact list on homepage, full mosaic on /projects */}
      <section id="work" className="px-6 py-14 md:px-16">
        <div className="mx-auto max-w-content">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Projects</h2>
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

          <ProjectsHybridTable rows={projectRows} />
        </div>
      </section>

      {/* Recognition: the close */}
      <RecognitionSection />

      <Footer />
    </main>
  );
}
