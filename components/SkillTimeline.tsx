'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Section from '@/components/ui/Section';
import { TIMELINE, type TimelineNode } from '@/data/timeline';
import { cn } from '@/lib/utils';

const ACCENT_COLORS = {
  blue: { dot: 'bg-blue-500', border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'shadow-blue-500/20' },
  emerald: { dot: 'bg-emerald-500', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
  amber: { dot: 'bg-amber-500', border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-500', glow: 'shadow-amber-500/20' },
  purple: { dot: 'bg-purple-500', border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-500', glow: 'shadow-purple-500/20' },
  cyan: { dot: 'bg-cyan-500', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-500', glow: 'shadow-cyan-500/20' },
  rose: { dot: 'bg-rose-500', border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-500', glow: 'shadow-rose-500/20' },
};

interface SkillTimelineProps {
  /**
   * When true, each timeline item becomes an expandable disclosure
   * revealing headline metric, transition story, team context, and
   * per-project decision rationale. Used at /resume.
   *
   * When false (default), renders the compact homepage view — byte-
   * identical to prior behavior. Homepage regression-safe.
   */
  expanded?: boolean;
}

function TimelineItem({
  node,
  index,
  expanded,
}: {
  node: TimelineNode;
  index: number;
  expanded: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const colors = ACCENT_COLORS[node.accent];
  const isLeft = index % 2 === 0;
  const reduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);

  const hasExpandableContent =
    expanded &&
    Boolean(
      node.headlineMetric ||
        node.transitionStory ||
        node.teamContext ||
        (node.projects && node.projects.length > 0)
    );

  // Escape key closes an open disclosure
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const detailsId = `timeline-details-${node.id}`;

  return (
    <div ref={ref} className="relative flex w-full items-start gap-4 md:gap-0">
      {/* Center line + dot */}
      <div className="absolute left-4 top-0 flex h-full flex-col items-center md:left-1/2 md:-translate-x-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
          className={cn('z-10 h-4 w-4 rounded-full border-2 border-background', colors.dot)}
        />
        <div className="w-px flex-1 bg-gradient-to-b from-border-subtle to-transparent" />
      </div>

      {/* Card */}
      <div
        className={cn(
          'ml-8 flex-1 pb-12',
          'md:ml-0 md:w-[calc(50%-1rem)] md:flex-none',
          isLeft ? 'md:pr-8' : 'md:ml-auto md:pl-8'
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            'rounded-xl border p-5 transition-shadow duration-500 md:p-6',
            colors.border,
            colors.bg,
            isInView && `shadow-lg ${colors.glow}`
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className={cn('font-mono text-xs font-semibold tracking-wider uppercase', colors.text)}>
              {node.era}
            </span>
            <span className="font-mono text-xs text-text-tertiary">{node.period}</span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {node.logoPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={node.logoPath}
                alt=""
                aria-hidden="true"
                className="h-7 w-auto max-w-[120px] shrink-0 object-contain"
                loading="lazy"
              />
            )}
            <h3 className="text-base font-bold text-text-primary">{node.org}</h3>
          </div>
          <p className="text-sm text-text-secondary">{node.role}</p>

          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {node.description}
          </p>

          {node.milestone && (
            <div
              className={cn(
                'mt-3 inline-block rounded-full border px-3 py-1 font-mono text-xs font-semibold',
                colors.border,
                colors.text
              )}
            >
              {node.milestone}
            </div>
          )}

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

          {/* Expanded-mode disclosure trigger + content.
              Rendered only when the node has extra narrative AND
              SkillTimeline is in expanded mode (/resume). */}
          {hasExpandableContent && (
            <>
              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className={cn(
                  'mt-5 flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent/40 hover:text-accent',
                  colors.text
                )}
              >
                {isOpen ? 'Hide role details' : 'Show role details'}
                <ChevronDown
                  size={14}
                  className={cn('transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={detailsId}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="skill-timeline-details mt-4 overflow-hidden"
                  >
                    <div className="space-y-4 pt-2">
                      {node.headlineMetric && (
                        <div
                          className={cn(
                            'rounded-lg border p-3',
                            colors.border,
                            'bg-background/30'
                          )}
                        >
                          <div className="font-mono text-xl font-bold text-text-primary">
                            {node.headlineMetric.value}
                          </div>
                          <div className="mt-0.5 text-xs text-text-tertiary">
                            {node.headlineMetric.label}
                          </div>
                        </div>
                      )}

                      {node.transitionStory && (
                        <div>
                          <h4 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                            Why this move
                          </h4>
                          <p className="text-sm leading-relaxed text-text-secondary">
                            {node.transitionStory}
                          </p>
                        </div>
                      )}

                      {node.teamContext && (
                        <div>
                          <h4 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                            Team shape
                          </h4>
                          <p className="text-sm leading-relaxed text-text-secondary">
                            {node.teamContext}
                          </p>
                        </div>
                      )}

                      {node.projects && node.projects.length > 0 && (
                        <div>
                          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                            Projects
                          </h4>
                          <ul className="space-y-3">
                            {node.projects.map((project, i) => (
                              <li
                                key={i}
                                className={cn(
                                  'border-l-2 pl-3',
                                  colors.border
                                )}
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
                                  <p className="mt-1 text-xs italic leading-relaxed text-text-tertiary">
                                    {project.decisionRationale}
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SkillTimeline({ expanded = false }: SkillTimelineProps) {
  return (
    <Section id="journey" title={expanded ? 'Career Timeline' : 'The Journey'}>
      <div className="relative">
        {TIMELINE.map((node, i) => (
          <TimelineItem key={node.id} node={node} index={i} expanded={expanded} />
        ))}

        <div className="absolute bottom-0 left-4 md:left-1/2 md:-translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="h-3 w-3 rounded-full bg-accent shadow-lg shadow-accent/30"
          />
        </div>
      </div>
    </Section>
  );
}
