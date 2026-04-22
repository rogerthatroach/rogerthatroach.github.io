import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import type { CaseStudy } from '@/data/projectCaseStudies';

/**
 * Filmography-style index table per audit P1-5.
 *
 * 4 columns on desktop (Year · Project · Role · Outcome). Each row links
 * to the case study. Hover raises the row background. On mobile
 * (< md), the layout collapses to a stacked card per row since a 4-column
 * table can't breathe inside 390px.
 *
 * Keeps the /projects page informational-first: a reader at 1280+ scans
 * the table like a discography. Cards are still on the homepage's
 * Projects strip when you want the visual browse.
 */
export default function FilmographyTable({
  rows,
}: {
  rows: Array<{ project: Project; caseStudy: CaseStudy }>;
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="mt-10 hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle">
              <th
                scope="col"
                className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
              >
                Year
              </th>
              <th
                scope="col"
                className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
              >
                Project
              </th>
              <th
                scope="col"
                className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
              >
                Role
              </th>
              <th
                scope="col"
                className="pb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary"
              >
                Outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ project, caseStudy }) => (
              <tr
                key={project.id}
                className="group border-b border-border-subtle/60 transition-colors hover:bg-surface-hover/50"
              >
                <td className="py-5 pr-6 align-top font-mono text-xs text-text-tertiary">
                  {caseStudy.timeline}
                </td>
                <td className="py-5 pr-6 align-top">
                  <Link
                    href={`/projects/${project.id}`}
                    className="block text-base font-semibold text-text-primary transition-colors group-hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {project.subtitle}
                  </p>
                </td>
                <td className="py-5 pr-6 align-top text-sm text-text-secondary">
                  {project.role}
                </td>
                <td className="py-5 align-top">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold text-accent">
                        {project.heroMetric.value}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {project.heroMetric.label}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-text-tertiary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="mt-8 space-y-3 md:hidden">
        {rows.map(({ project, caseStudy }) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="block rounded-xl border border-border-subtle bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface-hover"
            >
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {caseStudy.timeline}
                </p>
                <ArrowRight
                  size={12}
                  aria-hidden="true"
                  className="text-text-tertiary"
                />
              </div>
              <p className="text-base font-semibold text-text-primary">
                {project.title}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                {project.subtitle}
              </p>
              <p className="mt-3 text-xs text-text-secondary">
                {project.role}
              </p>
              <div className="mt-3 flex items-baseline gap-2 border-t border-border-subtle pt-3">
                <p className="font-mono text-sm font-semibold text-accent">
                  {project.heroMetric.value}
                </p>
                <p className="text-[11px] text-text-tertiary">
                  {project.heroMetric.label}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
