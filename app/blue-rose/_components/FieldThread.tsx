'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  /** Open immediately on mount (used by selection-to-comment). */
  autoOpen?: boolean;
  /** Pre-quote a passage in the composer (selection-to-comment). */
  quotedSelection?: string;
  /** Called when the popover closes. Lets the parent clear selection state. */
  onClose?: () => void;
}

const POPOVER_WIDTH = 360;
const POPOVER_OFFSET_Y = 8;
const POPOVER_VIEWPORT_PAD = 12;

/**
 * FieldThread — floating popover anchored to a specific form field.
 *
 * Two modes:
 *   1. Trigger chip in the field header (default) — click to open
 *   2. autoOpen + quotedSelection (selection-to-comment) — opens
 *      immediately with the highlighted passage quoted as a blockquote
 *      in the composer, no chip rendered
 *
 * Popover renders via React portal into document.body so it escapes any
 * ancestor `overflow-y-auto` scroll containers (the middle pane has one)
 * and any z-index stacking conflicts with the right pane / drawer. Posi-
 * tion is computed from the trigger's bounding rect at open time and
 * recomputed on scroll/resize while open.
 */
export default function FieldThread({
  submissionId,
  fieldKey,
  fieldLabel,
  autoOpen = false,
  quotedSelection,
  onClose,
}: FieldThreadProps) {
  const { fieldComments, addFieldComment, seed } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const [open, setOpen] = useState(autoOpen);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  const comments = fieldComments
    .filter((c) => c.submissionId === submissionId && c.fieldKey === fieldKey)
    .sort((a, b) => a.createdAt - b.createdAt);

  // Compute popover position from the trigger's bounding rect, clamped to
  // the viewport. Recompute on scroll / resize / open-state change.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const compute = () => {
      const node = triggerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Prefer to anchor at trigger's left edge; clamp to viewport
      let left = rect.left;
      if (left + POPOVER_WIDTH + POPOVER_VIEWPORT_PAD > vw) {
        left = vw - POPOVER_WIDTH - POPOVER_VIEWPORT_PAD;
      }
      if (left < POPOVER_VIEWPORT_PAD) left = POPOVER_VIEWPORT_PAD;
      // Position below the trigger; flip above if it would overflow the bottom
      let top = rect.bottom + POPOVER_OFFSET_Y;
      const popHeight = popoverRef.current?.offsetHeight ?? 360;
      if (top + popHeight + POPOVER_VIEWPORT_PAD > vh) {
        const above = rect.top - POPOVER_OFFSET_Y - popHeight;
        top = above > POPOVER_VIEWPORT_PAD ? above : POPOVER_VIEWPORT_PAD;
      }
      setPos({ top, left });
    };
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open]);

  // Close on Escape + click-outside (must consider the popover, which is
  // outside the trigger's DOM subtree because of the portal).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePopover = popoverRef.current?.contains(target);
      if (!insideTrigger && !insidePopover) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const count = comments.length;
  const has = count > 0;

  const popover = (
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={popoverRef}
          role="dialog"
          aria-label={`Discussion on ${fieldLabel}`}
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          className="themis-glass-pop fixed z-[100] overflow-hidden rounded-xl"
          style={{ top: pos.top, left: pos.left, width: POPOVER_WIDTH }}
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
              onClick={close}
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
            {quotedSelection && (
              <div className="px-3 pt-2">
                <p className="rounded-md border-l-2 border-[var(--themis-primary)]/50 bg-surface-hover/40 px-2 py-1 text-[11px] italic text-text-secondary">
                  &ldquo;{quotedSelection}&rdquo;
                </p>
              </div>
            )}
            <Composer
              personas={seed.personas}
              excludePersonaIds={[persona.id]}
              compact
              autoFocus
              placeholder={
                quotedSelection
                  ? `Comment on the highlighted passage…`
                  : `Comment as ${persona.displayName}…`
              }
              initialBody={quotedSelection ? `> "${quotedSelection}"\n\n` : ''}
              onSubmit={(body, mentions) => {
                addFieldComment(submissionId, fieldKey, body, mentions);
                close();
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div ref={triggerRef} className="relative inline-flex">
        {!autoOpen && (
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className={cn(
              'flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
              has
                ? 'border-[var(--themis-primary)]/40 text-[var(--themis-primary)] hover:bg-[var(--themis-glass-tint)]'
                : 'border-border-subtle text-text-tertiary hover:bg-surface-hover',
            )}
            aria-label={
              has ? `${count} comment${count > 1 ? 's' : ''} on ${fieldLabel}` : `Add comment on ${fieldLabel}`
            }
            aria-expanded={open}
          >
            {has ? <MessageCircle size={10} aria-hidden="true" /> : <MessageSquarePlus size={10} aria-hidden="true" />}
            <span>{has ? count : 'comment'}</span>
          </button>
        )}
      </div>
      {mounted &&
        createPortal(
          /* Wrap in [data-themis="true"] so the Themis CSS vars + glass class
             cascade into the portalled subtree (the portal lands in document.body,
             outside the route's data-themis wrapper). */
          <div data-themis="true">{popover}</div>,
          document.body,
        )}
    </>
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
