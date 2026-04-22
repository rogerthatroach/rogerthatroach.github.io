import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { paletteStyle } from '@/lib/palette';
import type { Project } from '@/data/projects';
import type { CaseStudy } from '@/data/projectCaseStudies';

/**
 * Hybrid projects layout — filmography table structure (Year · Era ·
 * Project · Role · Outcome) with the palette era pill + palette-colored
 * hero metric retained so identity doesn't flatten.
 *
 * Builds on FilmographyTable (audit P1-5 spec) but keeps the per-project
 * palette that the pure filmography dropped.
 */
export default function ProjectsHybridTable({
  rows,
}: {
  rows: Array<{ project: Project; caseStudy: CaseStudy }>;
}) {
  return (
    <>
      {/* Desktop — real HTML table */}
      <div className="mt-8 hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-subtle">
              <th scope="col" className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                Year
              </th>
              <th scope="col" className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                Era
              </th>
              <th scope="col" className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                Project
              </th>
              <th scope="col" className="pb-3 pr-6 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                Role
              </th>
              <th scope="col" className="pb-3 text-right font-mono text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
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
                <td className="whitespace-nowrap py-4 pr-6 align-top font-mono text-xs text-text-tertiary">
                  {caseStudy.timeline}
                </td>
                <td className="py-4 pr-6 align-top">
                  <span
                    className="palette-pill inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
                    style={paletteStyle(project.palette)}
                  >
                    {caseStudy.era}
                  </span>
                </td>
                <td className="py-4 pr-6 align-top">
                  <Link href={`/projects/${project.id}`} className="block">
                    <span className="font-semibold text-text-primary transition-colors group-hover:text-accent">
                      {project.title}
                    </span>
                    <p className="mt-0.5 line-clamp-1 text-xs text-text-tertiary">
                      {project.subtitle}
                    </p>
                  </Link>
                </td>
                <td className="py-4 pr-6 align-top text-xs leading-relaxed text-text-secondary">
                  <span className="line-clamp-2">{project.role}</span>
                </td>
                <td className="py-4 align-top text-right">
                  <div className="flex items-start justify-end gap-3">
                    <div>
                      <span
                        className="palette-text block whitespace-nowrap font-mono text-sm font-bold"
                        style={paletteStyle(project.palette)}
                      >
                        {project.heroMetric.value}
                      </span>
                      <span className="block whitespace-nowrap text-[10px] text-text-tertiary">
                        {project.heroMetric.label}
                      </span>
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

      {/* Mobile — stacked cards keep the palette colors prominent */}
      <ul className="mt-8 space-y-3 md:hidden">
        {rows.map(({ project, caseStudy }) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="block rounded-xl border border-border-subtle bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface-hover"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span
                  className="palette-pill inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
                  style={paletteStyle(project.palette)}
                >
                  {caseStudy.era}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {caseStudy.timeline}
                </span>
              </div>
              <p className="text-base font-semibold text-text-primary">
                {project.title}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                {project.subtitle}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                {project.role}
              </p>
              <div className="mt-3 flex items-baseline gap-2 border-t border-border-subtle pt-3">
                <span
                  className="palette-text font-mono text-sm font-bold"
                  style={paletteStyle(project.palette)}
                >
                  {project.heroMetric.value}
                </span>
                <span className="text-[11px] text-text-tertiary">
                  {project.heroMetric.label}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
