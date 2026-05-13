'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PostCard from '@/components/blog/PostCard';
import type { BlogPostMeta } from '@/data/posts';

/**
 * Blog index — click-only accordion.
 *
 *   • All sections start collapsed.
 *   • Click a header to expand; click again to collapse.
 *   • Single-active: opening one closes the previously open section.
 *
 * Earlier iteration had scroll-driven auto-expand; removed per user
 * call — click is the only toggle path. Keeps the page feel calm and
 * predictable; nothing happens unless the user asks for it.
 */

export interface AccordionGroup {
  projectId: string | null;
  title: string;
  /** One-or-two-sentence project blurb. Sourced from the project's
   *  caption in data/projects.ts; rendered below the section header so
   *  readers can decide whether to expand without clicking. */
  description?: string;
  deepDivePath?: string;
  era?: { label: string; dark: string; light: string };
  posts: BlogPostMeta[];
}

export default function ProjectAccordion({ groups }: { groups: AccordionGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const id = group.projectId ?? 'patterns';
        return (
          <Section
            key={id}
            id={id}
            group={group}
            isOpen={openId === id}
            onToggle={() => handleToggle(id)}
          />
        );
      })}
    </div>
  );
}

interface SectionProps {
  id: string;
  group: AccordionGroup;
  isOpen: boolean;
  onToggle: () => void;
}

function Section({ id, group, isOpen, onToggle }: SectionProps) {
  const isPatterns = group.projectId === null;
  const accent = group.era;

  return (
    <section
      aria-labelledby={`group-${id}`}
      className="relative rounded-lg border border-border-subtle/50 bg-surface/30 transition-colors"
    >
      {/* Accent bar running down the left edge, era-coloured per group */}
      {!isPatterns && accent && (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-full w-[3px] rounded-l-lg sm:block"
          style={{
            background: `linear-gradient(to bottom, ${accent.dark}aa, ${accent.dark}00)`,
          }}
        />
      )}

      {/* Header row — flex container so the case-study link can sit
          alongside (not inside) the toggle button. Nesting an <a> inside
          a <button> is invalid HTML; keep them as siblings. */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 sm:pl-7 sm:pr-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          className="group flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5 text-left transition-colors"
        >
          {accent && (
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: accent.dark }}
            >
              <span className="dark:hidden" style={{ color: accent.light }}>
                {accent.label}
              </span>
              <span className="hidden dark:inline">{accent.label}</span>
            </p>
          )}
          <h2
            id={`group-${id}`}
            className="font-display text-lg font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-xl"
          >
            {group.title}
          </h2>
          <span className="font-mono text-xs text-text-tertiary">
            {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`text-text-tertiary transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {group.deepDivePath && (
          <Link
            href={group.deepDivePath}
            className="ml-auto inline-flex items-center gap-1 py-3.5 text-xs font-medium text-text-tertiary transition-colors hover:text-accent"
          >
            Case study
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Brief project description — visible whether collapsed or
          expanded. Lets readers decide whether to expand without
          clicking. Sourced from data/projects.ts caption. */}
      {group.description && (
        <p className="-mt-1 px-4 pb-3.5 text-sm leading-relaxed text-text-secondary sm:pl-7 sm:pr-5">
          {group.description}
        </p>
      )}

      {/* Collapsible body — grid-template-rows trick gives a smooth
          height transition without measuring content. Inner div
          overflow-hidden so cards clip cleanly when collapsed.
          `inert` (HTML attr) blocks focus AND interaction on the
          collapsed subtree, so PostCard links inside the closed panel
          are properly skipped by tab + screen readers. Replaces an
          earlier aria-hidden={!isOpen} that Lighthouse flagged as
          aria-hidden-focus because focusable descendants remained. */}
      <div
        id={`panel-${id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        {...(!isOpen ? { inert: true } : {})}
      >
        <div className="overflow-hidden">
          <div className="grid gap-4 px-4 pb-4 pt-1 sm:grid-cols-2 sm:pl-7 sm:pr-5 lg:grid-cols-3">
            {group.posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
