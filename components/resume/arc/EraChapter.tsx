'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { TimelineNode } from '@/data/timeline';
import ProjectReveal from './ProjectReveal';
import Glossed from '@/components/resume/story/Glossed';
import { paletteStyle } from '@/lib/palette';

/** Era → palette. Mirrors SkillTimeline + data/projects.ts. */
const ERA_PALETTES: Record<string, { primary: string; primaryLight: string }> = {
  Foundation: { primary: '#fca5a5', primaryLight: '#991b1b' },
  'Cloud ML': { primary: '#67e8f9', primaryLight: '#155e75' },
  'Enterprise Analytics': { primary: '#fcd34d', primaryLight: '#92400e' },
  'Intelligent Systems': { primary: '#93c5fd', primaryLight: '#1e40af' },
};

/**
 * One era chapter in the scrollytelling arc.
 *
 * Layout: sticky left column (era header + headline metric + transition
 * story + team context) that "hangs" while project cards on the right
 * scroll past. On mobile, collapses to single-column stack.
 *
 * Scroll-driven transforms fade the header in/out as the chapter enters
 * and exits the viewport. Respects prefers-reduced-motion.
 */
export default function EraChapter({
  era,
  index,
  total,
}: {
  era: TimelineNode;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const palette = ERA_PALETTES[era.era];
  const style = palette ? paletteStyle(palette) : undefined;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Header opacity: fade in during early 20%, fade out in final 20%
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );
  // Header slides gently up as the chapter progresses
  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  return (
    <section
      ref={ref}
      id={`era-${era.id}`}
      data-era={era.id}
      aria-label={`${era.era} — ${era.org}`}
      style={style}
      className="relative border-t border-border-subtle px-6 py-20 md:px-16 md:py-24"
    >
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Sticky chapter header */}
        <motion.div
          style={
            reduceMotion ? undefined : { opacity: headerOpacity, y: headerY }
          }
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="palette-text font-mono text-xs uppercase tracking-widest">
            Chapter {index + 1} of {total} · {era.era}
          </p>

          <div className="mt-3 flex items-center gap-3">
            {era.logoPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={era.logoPath}
                alt=""
                aria-hidden="true"
                className="h-8 w-auto max-w-[120px] shrink-0 object-contain"
                loading="lazy"
              />
            )}
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {era.org}
            </h2>
          </div>
          <p className="text-sm text-text-secondary">
            {era.role} <span className="text-text-tertiary">· {era.period}</span>
          </p>

          {era.headlineMetric && (
            <div className="palette-border mt-6 rounded-lg border-2 bg-surface/60 p-4">
              <div className="font-mono text-2xl font-bold text-text-primary sm:text-3xl">
                {era.headlineMetric.value}
              </div>
              <div className="mt-1 text-xs text-text-tertiary">
                {era.headlineMetric.label}
              </div>
            </div>
          )}

          {era.transitionStory && (
            <div className="mt-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Why this move
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                <Glossed>{era.transitionStory}</Glossed>
              </p>
            </div>
          )}

          {era.teamContext && (
            <div className="mt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Team shape
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                <Glossed>{era.teamContext}</Glossed>
              </p>
            </div>
          )}

          {/* Skills chip row */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {era.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Project cards — scroll-revealed stack */}
        <div className="space-y-5">
          {era.projects && era.projects.length > 0 ? (
            era.projects.map((project, i) => (
              <ProjectReveal
                key={`${era.id}-${i}`}
                project={project}
                index={i}
              />
            ))
          ) : (
            <p className="text-sm italic text-text-tertiary">{era.description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
