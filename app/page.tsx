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

const HOME_SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'through-line', label: 'Through-line' },
  { id: 'journey', label: 'Journey' },
  { id: 'work', label: 'Projects' },
  { id: 'recognition', label: 'Recognition' },
];
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { YEARS_EXPERIENCE } from '@/data/canonical';

export default function Home() {
  const projectRows = PROJECTS.map((project) => {
    const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
    return caseStudy ? { project, caseStudy } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <>
      {/* WebSite JSON-LD reinforces the site entity on the homepage. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Harmilap Singh Dhaliwal',
            url: 'https://rogerthatroach.github.io',
            author: { '@type': 'Person', '@id': 'https://rogerthatroach.github.io/#person' },
          }),
        }}
      />
      <Nav />
      <SectionProgress sections={HOME_SECTIONS} />
      <main id="main-content">
        <Hero />

        {/* Career through-line and supporting metrics. */}
        <MetricsRibbon />

        <SkillTimeline expanded heading="The Journey" />

        <section id="work" className="px-6 py-14 md:px-16">
          <div className="mx-auto max-w-content">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Projects</h2>
              <Link
                href="/projects"
                className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-text-primary"
              >
                See all case studies
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mb-6 max-w-2xl text-sm text-text-secondary">
              Six systems across {YEARS_EXPERIENCE} years. From power plant combustion tuning to agentic AI
              launched across RBC&rsquo;s full CFO Group.
            </p>

            <ProjectsHybridTable rows={projectRows} />
          </div>
        </section>

        <RecognitionSection />
      </main>

      <Footer />
    </>
  );
}
