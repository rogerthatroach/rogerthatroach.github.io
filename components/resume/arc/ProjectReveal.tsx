'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProjectHighlight } from '@/data/timeline';
import Glossed from '@/components/resume/story/Glossed';

/**
 * A single project card revealed on scroll within an era chapter.
 * Inherits the era palette via CSS custom properties set on the parent
 * `<section>` in EraChapter, so `palette-border` reads the right tint
 * without the component knowing which era it belongs to.
 */
export default function ProjectReveal({
  project,
  index,
}: {
  project: ProjectHighlight;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={
        reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(8px)' }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : inView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : {}
      }
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 26,
        delay: reduceMotion ? 0 : index * 0.06,
      }}
      className="palette-border-l rounded-xl border border-l-4 border-border-subtle bg-surface/40 p-5 backdrop-blur-sm md:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
        {project.metric && (
          <span className="font-mono text-xs text-text-tertiary">
            {project.metric.value}
          </span>
        )}
      </div>
      {project.metric?.label && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          {project.metric.label}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        <Glossed>{project.oneLiner}</Glossed>
      </p>
      {project.decisionRationale && (
        <div className="mt-3 rounded-md bg-background/40 p-3 text-xs leading-relaxed text-text-secondary">
          <span className="mr-2 font-mono font-semibold uppercase tracking-wider text-accent">
            Decision
          </span>
          <Glossed>{project.decisionRationale}</Glossed>
        </div>
      )}
      {(project.caseStudyLink || project.blogLink) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {project.caseStudyLink && (
            <Link
              href={project.caseStudyLink}
              className="text-xs font-medium text-accent hover:underline"
            >
              Case study →
            </Link>
          )}
          {project.blogLink && (
            <Link
              href={project.blogLink}
              className="text-xs font-medium text-accent hover:underline"
            >
              Blog post →
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
