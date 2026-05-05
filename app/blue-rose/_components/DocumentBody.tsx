'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import type { Submission } from '@/data/themis/types';
import { useThemis } from '../_lib/store';
import FieldThread from './FieldThread';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface DocumentBodyProps {
  submission: Submission;
}

/**
 * DocumentBody — the structured-doc rendering of a submission's form
 * fields. Replaces the prior "DraftFormView" — generalized to all
 * statuses, not drafts only.
 *
 *   draft     → editable banner pinned at top, "empty — fill before…" hints
 *   submitted → no banner; field values render as read-only document text
 *
 * Either way: every field carries an inline FieldThread chip so reviewers
 * (or the submitter, post-submit) can leave comments anchored to the field.
 *
 * Selection-to-comment: highlighting text inside a long-text field shows
 * a floating "Comment on selection" chip. Clicking opens the field's
 * thread popover with the selected passage quoted.
 */
export default function DocumentBody({ submission }: DocumentBodyProps) {
  const { fieldComments } = useThemis();
  const isDraft = submission.status === 'draft';

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-3"
    >
      {isDraft && (
        <div className="rounded-xl border border-[var(--themis-primary)]/30 bg-[var(--themis-glass-tint)] px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--themis-primary)' }}>
            Draft · comment on any field
          </p>
          <p className="mt-1 text-[12.5px] text-text-secondary">
            Discussion stays anchored to the field — reviewers see the back-and-forth in context.
            Highlight a passage in a long field to comment on a specific clause.
          </p>
        </div>
      )}
      {submission.fields.map((field) => {
        const fieldCount = fieldComments.filter(
          (c) => c.submissionId === submission.id && c.fieldKey === field.key,
        ).length;
        const valueStr = field.value === '' || field.value == null ? '' : String(field.value);
        const isLong = valueStr.length > 80;
        return (
          <motion.div
            key={field.key}
            variants={fadeUp}
            className="group relative rounded-xl border border-border-subtle bg-surface/40 px-4 py-3 transition-colors"
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
            <FieldValue
              value={valueStr}
              isEmpty={valueStr === ''}
              isLong={isLong}
              isDraft={isDraft}
              submissionId={submission.id}
              fieldKey={field.key}
              fieldLabel={field.label}
            />
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

interface FieldValueProps {
  value: string;
  isEmpty: boolean;
  isLong: boolean;
  isDraft: boolean;
  submissionId: string;
  fieldKey: string;
  fieldLabel: string;
}

function FieldValue({
  value,
  isEmpty,
  isLong,
  submissionId,
  fieldKey,
  fieldLabel,
  isDraft,
}: FieldValueProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [chip, setChip] = useState<{ x: number; y: number; selected: string } | null>(null);
  const [openSel, setOpenSel] = useState<string | null>(null);

  useEffect(() => {
    if (!isLong) return;
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !ref.current) {
        setChip(null);
        return;
      }
      const range = sel.getRangeAt(0);
      // Confine to this field
      if (!ref.current.contains(range.commonAncestorContainer)) {
        setChip(null);
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 4) {
        setChip(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      const containerRect = ref.current.getBoundingClientRect();
      setChip({
        x: rect.right - containerRect.left,
        y: rect.bottom - containerRect.top + 4,
        selected: text,
      });
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [isLong]);

  return (
    <div ref={ref} className="relative">
      <div
        className={cn(
          'mt-1 whitespace-pre-wrap break-words text-[13.5px] leading-relaxed text-text-primary',
          isLong && 'select-text',
        )}
      >
        {isEmpty ? (
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
            {isDraft ? 'empty — fill before submitting' : '—'}
          </span>
        ) : (
          value
        )}
      </div>
      {chip && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpenSel(chip.selected);
            setChip(null);
            window.getSelection()?.removeAllRanges();
          }}
          className="absolute z-10 flex items-center gap-1 rounded-full border border-[var(--themis-primary)]/40 bg-background/90 px-2 py-1 font-mono text-[10px] uppercase tracking-wider shadow-md backdrop-blur-sm"
          style={{
            left: chip.x,
            top: chip.y,
            color: 'var(--themis-primary)',
          }}
        >
          <MessageSquarePlus size={10} aria-hidden="true" />
          <span>Comment on selection</span>
        </button>
      )}
      {openSel && (
        <FieldThread
          submissionId={submissionId}
          fieldKey={fieldKey}
          fieldLabel={fieldLabel}
          autoOpen
          quotedSelection={openSel}
          onClose={() => setOpenSel(null)}
        />
      )}
    </div>
  );
}
