'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import { TIMELINE, type TimelineNode } from '@/data/timeline';
import RoleOverlay from '@/components/resume/story/RoleOverlay';
import { cn } from '@/lib/utils';

const ACCENT_COLORS = {
  blue: { dot: 'bg-blue-500', border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'shadow-blue-500/20' },
  emerald: { dot: 'bg-emerald-500', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', glow: 'shadow-emerald-500/20' },
  amber: { dot: 'bg-amber-500', border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', glow: 'shadow-amber-500/20' },
  purple: { dot: 'bg-purple-500', border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', glow: 'shadow-purple-500/20' },
  cyan: { dot: 'bg-cyan-500', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-300', glow: 'shadow-cyan-500/20' },
  rose: { dot: 'bg-rose-500', border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', glow: 'shadow-rose-500/20' },
};

interface SkillTimelineProps {
  /**
   * When true (used at /resume), each timeline item shows an "Open role
   * details →" trigger that opens a floating RoleOverlay with the full
   * headline metric + transition story + team shape + per-project decision
   * rationale. The timeline itself does NOT expand inline — the overlay
   * floats above the viewport so the timeline stays at rest.
   *
   * When false (default, homepage), the trigger is hidden and the card
   * renders compact. Homepage is byte-identical to prior behavior.
   */
  expanded?: boolean;
}

function TimelineItem({
  node,
  index,
  expanded,
  onOpen,
}: {
  node: TimelineNode;
  index: number;
  expanded: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const colors = ACCENT_COLORS[node.accent];
  const isLeft = index % 2 === 0;

  const hasDetails =
    expanded &&
    Boolean(
      node.headlineMetric ||
        node.transitionStory ||
        node.teamContext ||
        (node.projects && node.projects.length > 0)
    );

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

          {/* "Open role details" trigger — only in expanded mode (/resume).
              Instead of expanding inline, opens a floating RoleOverlay. */}
          {hasDetails && (
            <button
              type="button"
              onClick={onOpen}
              className={cn(
                'group mt-5 inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-3 py-1.5 text-xs font-semibold transition-all hover:border-accent/40 hover:bg-surface',
                colors.text
              )}
            >
              Open role details
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SkillTimeline({ expanded = false }: SkillTimelineProps) {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);
  const openNode = openNodeId
    ? TIMELINE.find((n) => n.id === openNodeId) ?? null
    : null;

  return (
    <Section id="journey" title={expanded ? 'Career Timeline' : 'The Journey'}>
      <div className="relative">
        {TIMELINE.map((node, i) => (
          <TimelineItem
            key={node.id}
            node={node}
            index={i}
            expanded={expanded}
            onOpen={() => setOpenNodeId(node.id)}
          />
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

      {/* Single floating overlay, managed at this level so only one role is
          open at a time and the timeline underneath stays at rest. */}
      <AnimatePresence>
        {openNode && (
          <RoleOverlay node={openNode} onClose={() => setOpenNodeId(null)} />
        )}
      </AnimatePresence>
    </Section>
  );
}
