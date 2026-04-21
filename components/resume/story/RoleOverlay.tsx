'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { TimelineNode } from '@/data/timeline';
import Glossed from './Glossed';
import { cn } from '@/lib/utils';

const ACCENT_BORDER: Record<TimelineNode['accent'], string> = {
  blue: 'border-blue-500/40',
  emerald: 'border-emerald-500/40',
  amber: 'border-amber-500/40',
  purple: 'border-purple-500/40',
  cyan: 'border-cyan-500/40',
  rose: 'border-rose-500/40',
};

const ACCENT_TEXT: Record<TimelineNode['accent'], string> = {
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  amber: 'text-amber-500',
  purple: 'text-purple-500',
  cyan: 'text-cyan-500',
  rose: 'text-rose-500',
};

/**
 * Floating role-details panel. Opens in the viewport (modal-style) rather
 * than expanding the timeline item inline. Entrance is soft — gentle y-drift
 * + scale from below, like a cloud arriving. No staggered cascade inside —
 * content renders at rest so the reader can scan without visual noise.
 *
 * Closes on: click outside, X button, Escape key.
 * Body scroll locked while open.
 */
export default function RoleOverlay({
  node,
  onClose,
}: {
  node: TimelineNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Body scroll lock
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-overlay-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 print:hidden"
      onClick={onClose}
    >
      {/* Backdrop — soft blur over the timeline underneath */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-background/65 backdrop-blur-md"
      />

      {/* Panel — drifts gently into view */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-surface/95 p-6 shadow-2xl backdrop-blur-xl md:p-8',
          ACCENT_BORDER[node.accent]
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close role details"
          className="absolute right-4 top-4 rounded-full p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="pr-10">
          <p
            className={cn(
              'font-mono text-xs font-semibold uppercase tracking-widest',
              ACCENT_TEXT[node.accent]
            )}
          >
            {node.era} · {node.period}
          </p>
          <div className="mt-2 flex items-center gap-3">
            {node.logoPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={node.logoPath}
                alt=""
                aria-hidden="true"
                className="h-8 w-auto max-w-[120px] shrink-0 object-contain"
              />
            )}
            <h2
              id="role-overlay-title"
              className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            >
              {node.org}
            </h2>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{node.role}</p>
        </div>

        {/* Headline metric */}
        {node.headlineMetric && (
          <div
            className={cn(
              'mt-5 rounded-lg border bg-background/40 p-4',
              ACCENT_BORDER[node.accent]
            )}
          >
            <div className="font-mono text-2xl font-bold text-text-primary sm:text-3xl">
              {node.headlineMetric.value}
            </div>
            <div className="mt-1 text-xs text-text-tertiary">
              {node.headlineMetric.label}
            </div>
          </div>
        )}

        {/* Transition story */}
        {node.transitionStory && (
          <div className="mt-5">
            <h3 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Why this move
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              <Glossed>{node.transitionStory}</Glossed>
            </p>
          </div>
        )}

        {/* Team shape */}
        {node.teamContext && (
          <div className="mt-4">
            <h3 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Team shape
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              <Glossed>{node.teamContext}</Glossed>
            </p>
          </div>
        )}

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {node.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Projects with decision rationale — static, no cascade */}
        {node.projects && node.projects.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Projects
            </h3>
            <ul className="space-y-3">
              {node.projects.map((project, i) => (
                <li
                  key={i}
                  className={cn('border-l-2 pl-3', ACCENT_BORDER[node.accent])}
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
                    <Glossed>{project.oneLiner}</Glossed>
                  </p>
                  {project.decisionRationale && (
                    <p className="mt-2 rounded-md bg-background/40 p-2.5 text-xs leading-relaxed text-text-secondary">
                      <span className="mr-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-accent">
                        Decision
                      </span>
                      <Glossed>{project.decisionRationale}</Glossed>
                    </p>
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
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-5 font-mono text-[10px] text-text-tertiary">
          ESC or click outside to close
        </p>
      </motion.div>
    </motion.div>
  );
}
