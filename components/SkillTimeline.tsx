'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import { TIMELINE, type TimelineNode } from '@/data/timeline';
import RoleOverlay from '@/components/resume/story/RoleOverlay';
import { paletteStyle } from '@/lib/palette';
import { cn } from '@/lib/utils';

/**
 * Era → palette. Same hex values as data/projects.ts so Journey and
 * Projects both read the same era color (softer 300 in dark, darker 800
 * in light). Switching to CSS-var-driven coloring here means era tint
 * changes ripple to all surfaces by editing one map.
 */
const ERA_PALETTES: Record<string, { primary: string; primaryLight: string; glow: string }> = {
  Foundation: { primary: '#fca5a5', primaryLight: '#991b1b', glow: 'shadow-red-500/20' },
  'Cloud ML': { primary: '#67e8f9', primaryLight: '#155e75', glow: 'shadow-cyan-500/20' },
  'Enterprise Analytics': { primary: '#fcd34d', primaryLight: '#92400e', glow: 'shadow-amber-500/20' },
  'Intelligent Systems': { primary: '#93c5fd', primaryLight: '#1e40af', glow: 'shadow-blue-500/20' },
};

interface SkillTimelineProps {
  /**
   * Each timeline item shows an "Open role details →" trigger that opens
   * a floating RoleOverlay with headline metric + transition story + team
   * shape + per-project decision rationale. The timeline itself does NOT
   * expand inline — the overlay floats above the viewport so the timeline
   * stays at rest.
   *
   * Used on both the homepage (under "The Journey") and /resume.
   */
  expanded?: boolean;
  /** Section title override. Defaults vary by mode — see component. */
  heading?: string;
}

interface TimelineGroup {
  org: string;
  logoPath?: string;
  /** Ordered as in TIMELINE — latest first. */
  nodes: TimelineNode[];
}

function groupByOrg(nodes: TimelineNode[]): TimelineGroup[] {
  const groups: TimelineGroup[] = [];
  for (const node of nodes) {
    const last = groups[groups.length - 1];
    if (last && last.org === node.org) {
      last.nodes.push(node);
    } else {
      groups.push({ org: node.org, logoPath: node.logoPath, nodes: [node] });
    }
  }
  return groups;
}

function groupDateRange(nodes: TimelineNode[]): string {
  const parsed = nodes.map((n) => {
    const parts = n.period.split(/[–-]/).map((s) => s.trim());
    return { start: parseInt(parts[0] ?? '', 10), end: parts[1] ?? '' };
  });
  const starts = parsed.map((p) => p.start).filter(Number.isFinite);
  const earliestStart = Math.min(...starts);
  const hasPresent = parsed.some((p) => /present/i.test(p.end));
  if (hasPresent) return `${earliestStart} – Present`;
  const endYears = parsed.map((p) => parseInt(p.end, 10)).filter(Number.isFinite);
  return `${earliestStart} – ${Math.max(...endYears)}`;
}

function RoleCard({
  node,
  expanded,
  isInView,
  onOpen,
}: {
  node: TimelineNode;
  expanded: boolean;
  isInView: boolean;
  onOpen: () => void;
}) {
  const era = ERA_PALETTES[node.era];
  const style = era ? paletteStyle(era) : undefined;

  const hasDetails =
    expanded &&
    Boolean(
      node.headlineMetric ||
        node.transitionStory ||
        node.teamContext ||
        (node.projects && node.projects.length > 0)
    );

  return (
    <div
      style={style}
      className={cn(
        'palette-card rounded-xl border p-5 transition-shadow duration-500 md:p-6',
        isInView && era && `shadow-lg ${era.glow}`
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="palette-text font-mono text-xs font-semibold uppercase tracking-wider">
          {node.era}
        </span>
        <span className="font-mono text-xs text-text-secondary">{node.period}</span>
      </div>

      <h3 className="mt-3 text-base font-bold text-text-primary">{node.role}</h3>

      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {node.description}
      </p>

      {node.milestone && (
        <div className="palette-pill mt-3 inline-block rounded-full border px-3 py-1 font-mono text-xs font-semibold">
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

      {hasDetails && (
        <button
          type="button"
          onClick={onOpen}
          className="palette-text group mt-5 inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-3 py-1.5 text-xs font-semibold transition-all hover:border-accent/40 hover:bg-surface"
        >
          Open role details
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}

function TimelineRow({
  group,
  index,
  expanded,
  onOpen,
}: {
  group: TimelineGroup;
  index: number;
  expanded: boolean;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  // All groups render the same card shell with a prominent header
  // (logo + org name + date range + separator). Single-role groups
  // still wrap their one role in the shell for visual consistency.
  const columnClasses = cn(
    'md:w-[calc(50%-1rem)]',
    isLeft ? 'md:pr-8' : 'md:ml-auto md:pl-8'
  );

  return (
    <div ref={ref} className="relative flex w-full items-start gap-4 md:gap-0">
      {/* Spine: center line + dot */}
      <div className="absolute left-4 top-0 flex h-full flex-col items-center md:left-1/2 md:-translate-x-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
          className="z-10 h-4 w-4 rounded-full border-2 border-background bg-accent"
        />
        <div className="w-px flex-1 bg-gradient-to-b from-border-subtle to-transparent" />
      </div>

      <div className={cn('ml-8 flex-1 pb-12 md:ml-0 md:flex-none', columnClasses)}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-2xl border border-border-subtle bg-surface/40 p-4 md:p-5"
        >
          <div className="mb-4 flex items-center gap-4 border-b border-border-subtle pb-4">
            {group.logoPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={group.logoPath}
                alt=""
                aria-hidden="true"
                className="h-11 w-auto max-w-[160px] shrink-0 object-contain md:h-12"
                loading="lazy"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
              <h3 className="truncate text-base font-bold tracking-tight text-text-primary sm:text-lg">
                {group.org}
              </h3>
              <span className="font-mono text-xs text-text-tertiary">
                {groupDateRange(group.nodes)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {group.nodes.map((node) => (
              <RoleCard
                key={node.id}
                node={node}
                expanded={expanded}
                isInView={isInView}
                onOpen={() => onOpen(node.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SkillTimeline({ expanded = false, heading }: SkillTimelineProps) {
  const [openNodeId, setOpenNodeId] = useState<string | null>(null);
  const openNode = openNodeId
    ? TIMELINE.find((n) => n.id === openNodeId) ?? null
    : null;
  const title = heading ?? (expanded ? 'Career Timeline' : 'The Journey');
  const groups = groupByOrg(TIMELINE);

  return (
    <Section id="journey" title={title}>
      <div className="relative">
        {groups.map((group, i) => (
          <TimelineRow
            key={group.nodes[0].id}
            group={group}
            index={i}
            expanded={expanded}
            onOpen={setOpenNodeId}
          />
        ))}

        <div className="absolute bottom-0 left-4 md:left-1/2 md:-translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.1, margin: '200px 0px' }}
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
