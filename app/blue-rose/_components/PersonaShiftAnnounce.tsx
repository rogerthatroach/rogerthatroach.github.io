'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import type { Persona, Submission } from '@/data/themis/types';

const SESSION_KEY = 'themis:just-submitted';
const DISPLAY_MS = 8000;

interface PersonaShiftAnnounceProps {
  submission: Submission;
  /** Current viewer (the submitter post-submit). */
  currentPersona: Persona;
  /** Persona to switch to (typically the first assignee). */
  recommendedPersona: Persona | null;
  /** Click "View as X" — switches the active persona. */
  onSwitch: (id: string) => void;
}

/**
 * PersonaShiftAnnounce — small italic toast that appears once after the
 * user submits on /compose and lands on /submission.
 *
 *   ┌─ ✦  You're now reading this as Tammy Preston ─────┐
 *   │     first-line approver, expects ~3 days          │
 *   │                          [ View as Tammy → ]      │
 *   └────────────────────────────────────────────────────┘
 *
 * Pinned bottom-left (so it doesn't compete with UndoToast on the
 * right). Auto-dismisses after 8s. Reads `themis:just-submitted` from
 * sessionStorage — set by ComposeShell on submit-complete; cleared
 * after the toast renders so it shows once per submit, not on
 * every revisit.
 *
 * No auto-switch (per the locked decision: preserve user agency).
 * The user has to click "View as X" to actually switch personas.
 */
export default function PersonaShiftAnnounce({
  submission,
  currentPersona,
  recommendedPersona,
  onSwitch,
}: PersonaShiftAnnounceProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const justSubmitted = sessionStorage.getItem(SESSION_KEY);
    if (justSubmitted !== submission.id) return;
    // Hide once seen — clear immediately so revisit doesn't re-announce
    sessionStorage.removeItem(SESSION_KEY);
    if (!recommendedPersona) return;
    if (recommendedPersona.id === currentPersona.id) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(t);
  }, [submission.id, currentPersona.id, recommendedPersona]);

  if (!recommendedPersona) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="status"
          aria-live="polite"
          className="themis-glass-pop fixed bottom-6 left-6 z-40 max-w-md overflow-hidden rounded-xl border border-border-subtle"
          style={{
            boxShadow: '0 14px 36px -16px rgba(60, 50, 90, 0.32)',
          }}
        >
          <div className="flex items-start gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{
                background: 'var(--themis-sakura-bg)',
                color: 'var(--themis-sakura)',
                boxShadow: '0 0 0 1px var(--themis-sakura-border)',
              }}
            >
              <Sparkles size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                Diane routed this
              </p>
              <p className="mt-0.5 font-display text-[13px] italic leading-relaxed text-text-primary">
                You&apos;re now reading this as{' '}
                <span className="font-medium not-italic">{currentPersona.displayName}</span>
                . Switch to{' '}
                <span className="font-medium not-italic">
                  {recommendedPersona.displayName}
                </span>{' '}
                to see the approver&apos;s perspective.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSwitch(recommendedPersona.id);
                  setVisible(false);
                }}
                className="mt-2 flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-[var(--themis-sakura-border)] hover:text-text-primary"
              >
                <span>View as {recommendedPersona.displayName.split(' ')[0]}</span>
                <ArrowRight size={10} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setVisible(false)}
              className="shrink-0 rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <X size={11} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Helper for ComposeShell to write the freshly-submitted id. */
export function markFreshlySubmitted(submissionId: string) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEY, submissionId);
  } catch {
    /* noop */
  }
}
