'use client';

import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPostMeta } from '@/data/posts';
import { useTilt } from '@/lib/useTilt';

interface PostCardProps {
  post: BlogPostMeta;
  index: number;
}

// Wabi-sabi glyphs for the three register marks. Picked for restraint
// over loudness — single characters, muted, generous space around them.
// '§' rigid section mark fits formal/theorem register; '¶' pilcrow fits
// the prose of decisions and options; '◯' open circle fits narrative/
// story register (emptiness, spaciousness, the wabi-sabi side).
const REGISTER_MARK: Record<NonNullable<BlogPostMeta['register']>, { glyph: string; label: string }> = {
  formal:       { glyph: '§', label: 'formal' },
  practitioner: { glyph: '¶', label: 'practitioner' },
  builder:      { glyph: '◯', label: 'builder' },
};

export default function PostCard({ post, index }: PostCardProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out' }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex min-h-[280px] flex-col rounded-xl border border-border-subtle bg-surface/50 p-6 transition-colors hover:bg-surface-hover"
      >
        {post.register && (
          <div
            aria-label={`Register: ${REGISTER_MARK[post.register].label}`}
            className="pointer-events-none absolute right-5 top-5 flex items-baseline gap-1.5 text-text-tertiary/70 transition-colors group-hover:text-text-tertiary"
          >
            <span className="font-display text-base leading-none" aria-hidden="true">
              {REGISTER_MARK[post.register].glyph}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
              {REGISTER_MARK[post.register].label}
            </span>
          </div>
        )}

        <h2 className="line-clamp-2 pr-20 text-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{post.subtitle}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent-muted px-2.5 py-0.5 text-xs text-accent"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
