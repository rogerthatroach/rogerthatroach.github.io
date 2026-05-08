'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Plus, Trash2, X } from 'lucide-react';
import type { Submission } from '@/data/themis/types';
import { useThemis, usePersonaMap } from '../_lib/store';
import FloatingAvatar from './FloatingAvatar';
import { cn } from '@/lib/utils';

interface RoutingOverrideModalProps {
  submission: Submission;
  open: boolean;
  onClose: () => void;
}

/**
 * RoutingOverrideModal — "I disagree with Diane" path.
 *
 * The approver can re-shape the routing chain: add an approver, remove
 * an approver, reorder. Saving emits an audit event of kind
 * `routing_overridden` so the override is part of the structural
 * record, not invisible.
 *
 * Approver-only — modal is opened from the WhyCard's "Edit chain"
 * affordance, gated on the current persona being assigned to the
 * submission OR being an admin.
 */
export default function RoutingOverrideModal({
  submission,
  open,
  onClose,
}: RoutingOverrideModalProps) {
  const { seed, overrideRouting } = useThemis();
  const personaMap = usePersonaMap();
  const [draft, setDraft] = useState<string[]>(submission.assignees);

  useEffect(() => {
    if (open) setDraft(submission.assignees);
  }, [open, submission.assignees]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const candidates = useMemo(
    () =>
      seed.personas.filter(
        (p) =>
          (p.role === 'approver' || p.role === 'admin') &&
          !draft.includes(p.id),
      ),
    [seed.personas, draft],
  );

  const dirty =
    draft.length !== submission.assignees.length ||
    draft.some((id, i) => id !== submission.assignees[i]);

  const onAdd = (id: string) => setDraft((prev) => [...prev, id]);
  const onRemove = (id: string) =>
    setDraft((prev) => prev.filter((x) => x !== id));
  const onMoveUp = (idx: number) => {
    if (idx === 0) return;
    setDraft((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const onSave = () => {
    overrideRouting(submission.id, draft);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-label="Edit routing chain"
            initial={{ y: 8, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="themis-glass-pop relative w-full max-w-lg rounded-2xl border border-border-subtle p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  I disagree with Diane
                </p>
                <h2 className="mt-1 font-display text-lg font-medium text-text-primary">
                  Edit routing chain
                </h2>
                <p className="mt-1 font-display text-[12.5px] italic text-text-secondary">
                  Saving emits an audit event of kind{' '}
                  <span className="not-italic font-mono text-[11px] tracking-wider">
                    routing_overridden
                  </span>
                  . The override is part of the record.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </header>

            {/* Current chain */}
            <ol className="space-y-2.5">
              {draft.map((id, i) => {
                const persona = personaMap.get(id);
                return (
                  <li key={id}>
                    <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface/60 px-3 py-2">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                        style={{
                          background: 'var(--themis-glass-tint)',
                          color: 'var(--themis-primary)',
                        }}
                      >
                        {i + 1}
                      </span>
                      {persona && (
                        <FloatingAvatar
                          seed={persona.avatarSeed}
                          size={22}
                          ringColor={persona.accentHex}
                          static
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-text-primary">
                          {persona?.displayName ?? id}
                        </p>
                        {persona?.title && (
                          <p className="truncate font-mono text-[10px] tracking-wider text-text-tertiary">
                            {persona.title}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => onMoveUp(i)}
                            title="Move earlier"
                            className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                            aria-label="Move earlier in chain"
                          >
                            <ArrowDown
                              size={11}
                              aria-hidden="true"
                              className="rotate-180"
                            />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemove(id)}
                          title="Remove from chain"
                          className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-[var(--themis-rejected-bg)] hover:text-[var(--themis-rejected)]"
                          aria-label="Remove from chain"
                        >
                          <Trash2 size={11} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    {i < draft.length - 1 && (
                      <div className="ml-8 my-1 flex h-3 w-px flex-col items-center">
                        <ArrowDown
                          size={11}
                          className="-ml-[5px] -mt-1 text-text-tertiary"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Add approver */}
            {candidates.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Add approver
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {candidates.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onAdd(p.id)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-full border border-border-subtle px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors',
                          'hover:border-[var(--themis-primary)]/50 hover:bg-[var(--themis-glass-tint)] hover:text-text-primary',
                        )}
                      >
                        <Plus size={10} aria-hidden="true" />
                        <span className="normal-case tracking-normal">
                          {p.displayName.split(' ')[0]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <footer className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!dirty || draft.length === 0}
                className="rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors disabled:opacity-40"
                style={{
                  background: 'var(--themis-primary)',
                  color: 'var(--color-bg)',
                }}
              >
                Save override
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
