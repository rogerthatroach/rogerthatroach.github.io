import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FilmographyTable from '@/components/projects/FilmographyTable';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

// Private preview — not indexed, not linked from nav.
export const metadata: Metadata = {
  title: 'Playground · Projects as filmography',
  description: 'Preview of the /projects page rebuilt as a filmography-style table.',
  robots: { index: false, follow: false },
};

export default function ProjectsFilmographyPreview() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/playground"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Playground
        </Link>

        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
            Preview · not live at /projects
          </p>
          <p>
            What the projects index would look like as a filmography-style
            table per audit P1-5. Current{' '}
            <Link
              href="/projects"
              className="text-accent underline-offset-4 hover:underline"
            >
              /projects
            </Link>{' '}
            card grid is untouched. Compare, decide, then promote to
            production only if it reads stronger.
          </p>
        </div>

        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          Projects
        </h1>
        <p className="mt-2 max-w-2xl text-base text-text-secondary">
          Six systems across eight years. Year, role, outcome &mdash; then the
          full case study behind each one.
        </p>

        <FilmographyTable
          rows={PROJECTS
            .map((project) => {
              const caseStudy = CASE_STUDIES.find(
                (cs) => cs.projectId === project.id,
              );
              return caseStudy ? { project, caseStudy } : null;
            })
            .filter((x): x is NonNullable<typeof x> => x !== null)}
        />
      </main>
      <Footer />
    </>
  );
}
