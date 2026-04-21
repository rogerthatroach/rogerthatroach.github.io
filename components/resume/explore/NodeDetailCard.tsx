'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ProjectHighlight } from '@/data/timeline';
import Glossed from '@/components/resume/story/Glossed';

/**
 * Absolutely-positioned 2D detail panel shown when a 3D project node
 * is clicked. Slides in from the right. Accessible: role=dialog,
 * Escape handled by parent (CareerCanvas), close button, focus trap
 * left simple (user has orbit controls + close button + ESC).
 */
export default function NodeDetailCard({
  project,
  onClose,
}: {
  project: ProjectHighlight;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-node-title"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="pointer-events-auto absolute right-6 top-1/2 z-50 w-80 max-w-[calc(100vw-3rem)] -translate-y-1/2 rounded-xl border border-border-subtle bg-surface/95 p-5 shadow-2xl backdrop-blur-md md:right-10 md:w-96 md:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close detail"
        className="absolute right-3 top-3 rounded-full p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <X size={16} aria-hidden="true" />
      </button>

      <div className="pr-8">
        <h3
          id="explore-node-title"
          className="text-xl font-bold text-text-primary"
        >
          {project.name}
        </h3>
      </div>

      {project.metric && (
        <div className="mt-2 font-mono text-xs text-text-tertiary">
          <span className="font-semibold text-accent">
            {project.metric.value}
          </span>
          {project.metric.label && ` — ${project.metric.label}`}
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        <Glossed>{project.oneLiner}</Glossed>
      </p>

      {project.decisionRationale && (
        <div className="mt-4 rounded-md bg-background/40 p-3 text-xs leading-relaxed text-text-secondary">
          <span className="mr-2 font-mono font-semibold uppercase tracking-wider text-accent">
            Decision
          </span>
          <Glossed>{project.decisionRationale}</Glossed>
        </div>
      )}

      {(project.caseStudyLink || project.blogLink) && (
        <div className="mt-4 flex flex-wrap gap-3">
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

      <p className="mt-4 font-mono text-[10px] text-text-tertiary">
        ESC to close
      </p>
    </motion.div>
  );
}
