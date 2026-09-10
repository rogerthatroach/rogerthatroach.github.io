import Link from 'next/link';
import type { ProjectHighlight } from '@/data/timeline';

/** A server-rendered project summary; no facts depend on hover or animation. */
export default function ProjectReveal({ project }: { project: ProjectHighlight }) {
  return (
    <article className="palette-border-l rounded-xl border border-l-4 border-border-subtle bg-surface/40 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
        {project.metric && (
          <span className="font-mono text-xs text-text-tertiary">
            {project.metric.value}
          </span>
        )}
      </div>
      {project.metric?.label && (
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          {project.metric.label}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {project.oneLiner}
      </p>
      {project.decisionRationale && (
        <div className="mt-3 rounded-md bg-background/40 p-3 text-xs leading-relaxed text-text-secondary">
          <span className="mr-2 font-mono font-semibold uppercase tracking-wider text-accent">
            Engineering choice
          </span>
          {project.decisionRationale}
        </div>
      )}
      {(project.caseStudyLink || project.blogLink) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {project.caseStudyLink && (
            <Link
              href={project.caseStudyLink}
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline"
            >
              Case study →
            </Link>
          )}
          {project.blogLink && (
            <Link
              href={project.blogLink}
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline"
            >
              Blog post →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
