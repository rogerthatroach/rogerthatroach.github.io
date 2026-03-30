'use client';

import 'katex/dist/katex.min.css';

import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPostMeta, Reference, FurtherReadingItem } from '@/data/posts';
import ReferenceList from './ReferenceList';
import FurtherReading from './FurtherReading';
import TableOfContents from './TableOfContents';

interface PostLayoutProps {
  meta: BlogPostMeta;
  references?: Reference[];
  furtherReading?: FurtherReadingItem[];
  children: React.ReactNode;
}

export default function PostLayout({ meta, references = [], furtherReading = [], children }: PostLayoutProps) {
  const formattedDate = new Date(meta.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto max-w-content px-6 pb-16 pt-28 md:px-16"
    >
      {/* Back links */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
        <span className="text-text-tertiary/40">/</span>
        <Link
          href="/blog"
          className="text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          Writing
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-2xl font-bold leading-tight text-text-primary sm:text-3xl md:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-3 text-lg text-text-secondary">{meta.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {meta.readingTime}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Abstract */}
        <div className="mt-8 rounded-lg border-l-2 border-accent bg-surface/50 px-5 py-4">
          <p className="text-sm font-semibold text-text-secondary">Abstract</p>
          <p className="mt-2 text-base leading-relaxed text-text-secondary">{meta.abstract}</p>
        </div>
      </header>

      {/* Content + TOC side-by-side */}
      <div className="relative flex gap-10">
        {/* Main content */}
        <div className="prose-blog min-w-0 max-w-3xl flex-1">
          {children}

          {/* References & Further Reading */}
          <ReferenceList references={references} />
          <FurtherReading items={furtherReading} />

          {/* Confidentiality disclaimer */}
          <p className="mt-12 border-t border-border-subtle pt-6 text-xs italic text-text-tertiary">
            This article describes architectural patterns and methodologies in general terms.
            All system names, metrics, and implementation details have been anonymized or
            generalized. No proprietary data, model outputs, or internal configurations are disclosed.
          </p>
        </div>

        {/* Table of Contents — sticky sidebar, visible on xl+ screens */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <TableOfContents />
        </aside>
      </div>
    </motion.article>
  );
}
