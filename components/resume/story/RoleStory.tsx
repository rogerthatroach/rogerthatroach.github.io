'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import type { TimelineNode, ProjectHighlight } from '@/data/timeline';
import Glossed from './Glossed';
import { cn } from '@/lib/utils';

/**
 * The "story opening" experience when a role's disclosure expands in
 * the baseline /resume view.
 *
 * Cascade rhythm (on open):
 *   0.0s → headline metric pulse-ring fires + number fades in
 *   0.1s → transition story prose fades in
 *   0.2s → team shape prose fades in
 *   0.3s → projects header + cards fade in (per-project stagger ~60ms)
 *   ↳ within each project:
 *       0.0s → name + metric + oneLiner appear
 *       0.15s → decision rationale fades in with small y offset
 *
 * Prose paragraphs wrap in <Glossed> so known glossary terms (PAR Assist,
 * GFT, Humana, etc.) become HoverTerm popovers.
 */

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 28 },
  },
};

const projectsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const projectItem: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const rationaleVariant: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, duration: 0.4 },
  },
};

export default function RoleStory({
  node,
  accentBorder,
}: {
  node: TimelineNode;
  /** Tailwind border class (e.g., 'border-purple-500/40') matching the role accent. */
  accentBorder: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4 pt-2"
    >
      {node.headlineMetric && (
        <motion.div
          variants={item}
          className={cn(
            'relative rounded-lg border bg-background/30 p-3',
            accentBorder
          )}
        >
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className={cn(
              'pointer-events-none absolute inset-0 rounded-lg border-2',
              accentBorder
            )}
          />
          <div className="font-mono text-xl font-bold text-text-primary">
            {node.headlineMetric.value}
          </div>
          <div className="mt-0.5 text-xs text-text-tertiary">
            {node.headlineMetric.label}
          </div>
        </motion.div>
      )}

      {node.transitionStory && (
        <motion.div variants={item}>
          <h4 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Why this move
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">
            <Glossed>{node.transitionStory}</Glossed>
          </p>
        </motion.div>
      )}

      {node.teamContext && (
        <motion.div variants={item}>
          <h4 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Team shape
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">
            <Glossed>{node.teamContext}</Glossed>
          </p>
        </motion.div>
      )}

      {node.projects && node.projects.length > 0 && (
        <motion.div variants={item}>
          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Projects
          </h4>
          <motion.ul variants={projectsContainer} className="space-y-3">
            {node.projects.map((project, i) => (
              <ProjectStory
                key={`${node.id}-${i}`}
                project={project}
                accentBorder={accentBorder}
              />
            ))}
          </motion.ul>
        </motion.div>
      )}
    </motion.div>
  );
}

function ProjectStory({
  project,
  accentBorder,
}: {
  project: ProjectHighlight;
  accentBorder: string;
}) {
  return (
    <motion.li
      variants={projectItem}
      className={cn('border-l-2 pl-3', accentBorder)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <strong className="text-sm font-semibold text-text-primary">
          {project.name}
        </strong>
        {project.metric && (
          <span className="font-mono text-[10px] text-text-tertiary">
            {project.metric.value}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm leading-snug text-text-secondary">
        {project.oneLiner}
      </p>
      {project.decisionRationale && (
        <motion.p
          variants={rationaleVariant}
          className="mt-2 rounded-md bg-background/40 p-2.5 text-xs leading-relaxed text-text-secondary"
        >
          <span className="mr-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-accent">
            Decision
          </span>
          <Glossed>{project.decisionRationale}</Glossed>
        </motion.p>
      )}
      {(project.caseStudyLink || project.blogLink) && (
        <div className="mt-1.5 flex flex-wrap gap-3">
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
    </motion.li>
  );
}
