'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MessageSquarePlus, X } from 'lucide-react';
import type { FieldComment } from '@/data/themis/types';
import { useThemis, useCurrentPersona, usePersonaMap } from '../_lib/store';
import FloatingAvatar from './FloatingAvatar';
import Composer from './Composer';
import { renderBody } from '../_lib/render';
import { relativeTime } from '../_lib/format';
import { cn } from '@/lib/utils';

interface FieldThreadProps {
  submissionId: string;
  fieldKey: string;
  fieldLabel: string;
}

/**
 * FieldThread — floating popover anchored to a specific form field.
 *
 * Trigger renders as an inline chip showing the comment count. Click
 * opens a glass card just below the field with the existing comments
 * (rendered as compact cards) and a small composer to add a new one.
 *
 * Used inside DraftFormView to make per-field discussion concrete:
 * "comment on this field, not the whole submission."
 */
export default function FieldThread({ submissionId, fieldKey, fieldLabel }: FieldThreadProps) {
  const { fieldComments, addFieldComment, seed } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const comments = fieldComments
    .filter((c) => c.submissionId === submissionId && c.fieldKey === fieldKey)
    .sort((a, b) => a.createdAt - b.createdAt);

  // Close on Escape + click-outside
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const count = comments.length;
  const has = count > 0;

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
          has
            ? 'border-[var(--themis-primary)]/40 text-[var(--themis-primary)] hover:bg-[var(--themis-glass-tint)]'
            : 'border-border-subtle text-text-tertiary hover:bg-surface-hover',
        )}
        aria-label={has ? `${count} comment${count > 1 ? 's' : ''} on ${fieldLabel}` : `Add comment on ${fieldLabel}`}
        aria-expanded={open}
      >
        {has ? <MessageCircle size={10} aria-hidden="true" /> : <MessageSquarePlus size={10} aria-hidden="true" />}
        <span>{has ? count : 'comment'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Discussion on ${fieldLabel}`}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="themis-glass absolute left-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  Discussion on
                </p>
                <p className="truncate text-[12px] font-medium text-text-primary">{fieldLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-2.5">
              {comments.length === 0 && (
                <p className="py-4 text-center text-[11px] text-text-tertiary">
                  No comments yet — start the discussion below.
                </p>
              )}
              {comments.map((c) => (
                <FieldCommentCard
                  key={c.id}
                  comment={c}
                  authorName={personaMap.get(c.authorPersonaId)?.displayName ?? 'Unknown'}
                  authorSeed={personaMap.get(c.authorPersonaId)?.avatarSeed ?? c.authorPersonaId}
                  authorAccent={personaMap.get(c.authorPersonaId)?.accentHex}
                  personas={seed.personas}
                />
              ))}
            </div>
            <div className="border-t border-border-subtle bg-background/40">
              <Composer
                personas={seed.personas}
                excludePersonaIds={[persona.id]}
                compact
                autoFocus
                placeholder={`Comment as ${persona.displayName}…`}
                onSubmit={(body, mentions) => {
                  addFieldComment(submissionId, fieldKey, body, mentions);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldCommentCard({
  comment,
  authorName,
  authorSeed,
  authorAccent,
  personas,
}: {
  comment: FieldComment;
  authorName: string;
  authorSeed: string;
  authorAccent?: string;
  personas: { id: string; displayName: string; accentHex: string }[];
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border-subtle/70 bg-surface/40 px-2.5 py-2">
      <FloatingAvatar seed={authorSeed} size={22} ringColor={authorAccent} static />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline gap-1.5">
          <span className="text-[11.5px] font-medium text-text-primary">{authorName}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            {relativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-[12px] leading-snug text-text-secondary">
          {renderBody(comment.body, personas as never)}
        </p>
      </div>
    </div>
  );
}
