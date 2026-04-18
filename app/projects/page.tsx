import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/projects/ProjectCard';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';

export const metadata: Metadata = {
  title: 'Projects — Harmilap Singh Dhaliwal',
  description:
    'Case studies: from Digital Twins saving $3M to enterprise agentic AI platforms — the full story behind each project.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsIndexPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Projects</h1>
        <p className="mt-2 text-base text-text-secondary">
          The full story behind each project — context, decisions, trade-offs, and impact.
        </p>

        {/* Mosaic: origin story (wide) → 4 middle projects (2×2) → vision (wide) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((project, i) => {
            const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
            if (!caseStudy) return null;
            const isBookend = i === 0 || i === PROJECTS.length - 1;
            return (
              <div
                key={project.id}
                className={isBookend ? 'sm:col-span-2' : ''}
              >
                <ProjectCard
                  project={project}
                  caseStudy={caseStudy}
                  index={i}
                />
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
