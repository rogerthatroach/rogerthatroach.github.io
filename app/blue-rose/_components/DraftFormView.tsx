'use client';

import type { Submission } from '@/data/themis/types';
import { useThemis } from '../_lib/store';
import FieldThread from './FieldThread';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { motion } from 'framer-motion';

interface DraftFormViewProps {
  submission: Submission;
}

/**
 * DraftFormView — fields rendered as a labeled form, each with an inline
 * FieldThread chip so reviewers can leave comments anchored to the field
 * before the submission is even submitted. This is the "floating threads
 * within drafts" surface.
 */
export default function DraftFormView({ submission }: DraftFormViewProps) {
  const { fieldComments } = useThemis();
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
      <div className="rounded-xl border border-[var(--themis-primary)]/30 bg-[var(--themis-glass-tint)] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--themis-primary)' }}>
          Draft · floating threads on every field
        </p>
        <p className="mt-1 text-[12.5px] text-text-secondary">
          Comment on individual fields below before submitting. Discussion stays anchored
          to the field — reviewers see the back-and-forth in context.
        </p>
      </div>
      {submission.fields.map((field) => {
        const fieldCount = fieldComments.filter(
          (c) => c.submissionId === submission.id && c.fieldKey === field.key,
        ).length;
        return (
          <motion.div
            key={field.key}
            variants={fadeUp}
            className="group relative rounded-xl border border-border-subtle bg-surface/40 px-4 py-3 transition-colors hover:border-border-subtle"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                {field.label}
              </span>
              <span className="ml-auto">
                <FieldThread
                  submissionId={submission.id}
                  fieldKey={field.key}
                  fieldLabel={field.label}
                />
              </span>
            </div>
            <div className="mt-1 whitespace-pre-wrap break-words text-[13.5px] text-text-primary">
              {field.value === '' ? (
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                  empty — fill before submitting
                </span>
              ) : (
                String(field.value)
              )}
            </div>
            {fieldCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-3 h-[calc(100%-1.5rem)] w-[2px] rounded-full"
                style={{ background: 'var(--themis-primary)' }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
