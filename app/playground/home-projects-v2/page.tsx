import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ProjectsHybridTable from '@/components/projects/ProjectsHybridTable';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES } from '@/data/projectCaseStudies';
import { paletteStyle } from '@/lib/palette';

export const metadata: Metadata = {
  title: 'Playground · Projects v2 — filmography with palette',
  description:
    'Middle ground between the current homepage Projects list and the pure filmography table — retains palette era pills + palette-colored metrics.',
  robots: { index: false, follow: false },
};

export default function HomeProjectsV2PreviewPage() {
  const rows = PROJECTS.map((project) => {
    const caseStudy = CASE_STUDIES.find((cs) => cs.projectId === project.id);
    return caseStudy ? { project, caseStudy } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

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

        <div className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
            Preview · not live on homepage
          </p>
          <p>
            Hybrid of the <Link href="/playground/projects-filmography" className="text-accent underline underline-offset-4 hover:text-text-primary">pure filmography</Link> and the current <Link href="/#work" className="text-accent underline underline-offset-4 hover:text-text-primary">homepage Projects list</Link>. Adds Year + Role columns for filmography discipline; keeps palette era pills and palette-colored hero metrics so identity doesn&rsquo;t flatten. Review on both light and dark modes.
          </p>
        </div>

        {/* ───── v2 preview ───── */}
        <section>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Projects
            </h2>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-text-primary"
            >
              See all case studies
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-text-secondary">
            Six systems across eight years. From power plant combustion tuning
            to bank-wide agentic AI.
          </p>

          <ProjectsHybridTable rows={rows} />
        </section>

        {/* ───── Reference — current homepage list rendered inline for A/B comparison ───── */}
        <section className="mt-20 border-t border-border-subtle pt-12">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            For comparison — current homepage list
          </p>
          <h3 className="mb-6 text-sm font-semibold text-text-primary">
            What&rsquo;s live at{' '}
            <Link
              href="/#work"
              className="text-accent underline underline-offset-4 hover:text-text-primary"
            >
              /
            </Link>{' '}
            today
          </h3>
          <ul className="divide-y divide-border-subtle border-y border-border-subtle">
            {rows.map(({ project, caseStudy }) => (
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
            ))}
          </ul>
        </section>

        <div className="mt-16 rounded-xl border border-border-subtle bg-surface/30 p-5 text-sm text-text-secondary">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            What&rsquo;s different in v2
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>Explicit <strong className="text-text-primary">Year</strong> column (mono, neutral) — senior-discography register</li>
            <li>Explicit <strong className="text-text-primary">Role</strong> column — context upfront instead of buried in subtitle</li>
            <li>Palette era pill <strong className="text-text-primary">preserved</strong> — identity retained</li>
            <li>Palette-colored <strong className="text-text-primary">hero metric</strong> preserved</li>
            <li>Proper <code className="font-mono text-xs">&lt;table&gt;</code> semantics — screen-readers parse as tabular data</li>
            <li>Mobile gracefully collapses to stacked cards with the same palette emphasis</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
