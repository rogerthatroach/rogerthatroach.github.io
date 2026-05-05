'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, FileEdit, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemis, useCurrentPersona } from '../_lib/store';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { relativeTime } from '../_lib/format';
import StatusPill from './StatusPill';

/**
 * DraftsPage — own drafts only, simple list.
 */
export default function DraftsPage() {
  const { seed, selectSubmission } = useThemis();
  const persona = useCurrentPersona();

  const drafts = useMemo(
    () =>
      seed.submissions
        .filter((s) => s.status === 'draft' && s.submittedBy === persona.id)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [seed.submissions, persona.id],
  );

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-3xl px-6 py-12 md:px-10"
      >
        <motion.div variants={fadeUp} className="mb-8 flex items-baseline justify-between">
          <h1 className="font-display text-2xl font-medium text-text-primary">Drafts</h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            {drafts.length} draft{drafts.length === 1 ? '' : 's'}
          </span>
        </motion.div>

        {drafts.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface/40 px-6 py-16 text-center"
          >
            <FileEdit size={28} className="text-text-tertiary" aria-hidden="true" />
            <p className="text-[13px] text-text-secondary">No drafts in flight.</p>
            <p className="text-[11.5px] text-text-tertiary">
              Draft a request when you have one.
            </p>
            <Link
              href="/blue-rose/compose"
              className="mt-2 flex items-center gap-1.5 rounded-md border border-[var(--themis-primary)]/30 bg-[var(--themis-glass-tint)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: 'var(--themis-primary)' }}
            >
              <PenLine size={11} aria-hidden="true" />
              <span>Start a request</span>
            </Link>
          </motion.div>
        ) : (
          <motion.ul
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-border-subtle bg-surface/40 divide-y divide-border-subtle/60"
          >
            {drafts.map((s) => (
              <li key={s.id}>
                <Link
                  href="/blue-rose/submission"
                  onClick={() => selectSubmission(s.id)}
                  className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-hover/60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusPill status={s.status} />
                      <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
                        {relativeTime(s.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13.5px] font-medium text-text-primary">
                      {s.title}
                    </p>
                  </div>
                  <ArrowRight
                    size={12}
                    className="mt-2 shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
}
