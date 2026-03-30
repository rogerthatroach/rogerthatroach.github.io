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
        className="group block rounded-xl border border-border-subtle bg-surface/50 p-6 transition-colors hover:bg-surface-hover"
      >
        <h2 className="text-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{post.subtitle}</p>

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

        <div className="mt-4 flex items-center justify-between text-xs text-text-tertiary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
