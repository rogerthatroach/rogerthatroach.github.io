'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';

interface UndoToastProps {
  /** Label to render in the toast body (e.g. "Approved.") */
  label: string | null;
  /** Total time in ms before the action commits + toast fades. */
  durationMs?: number;
  /** Called when the user clicks Undo. */
  onUndo: () => void;
  /** Called when the timer expires without an undo. */
  onCommit: () => void;
}

/**
 * UndoToast — Gmail "Undo Send"–style decision moment.
 *
 *   ┌─ ✓  Approved.                                    Undo · 4s ─┐
 *
 * Pinned bottom-right. A thin sakura progress bar at the bottom
 * indicates time-remaining. Click Undo to revert the staged action;
 * let the timer expire to commit. Used at the approver decision
 * moment + (later) Diane's auto-act moments.
 */
export default function UndoToast({
  label,
  durationMs = 5000,
  onUndo,
  onCommit,
}: UndoToastProps) {
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    if (!label) {
      setRemaining(durationMs);
      return;
    }
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = durationMs - elapsed;
      if (left <= 0) {
        clearInterval(tick);
        setRemaining(0);
        onCommit();
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => clearInterval(tick);
  }, [label, durationMs, onCommit]);

  const seconds = Math.ceil(remaining / 1000);
  const progress = Math.max(0, remaining / durationMs);

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          role="status"
          aria-live="polite"
          className="themis-glass-pop fixed bottom-6 right-6 z-40 overflow-hidden rounded-xl border border-border-subtle"
          style={{
            minWidth: 320,
            boxShadow: '0 14px 36px -16px rgba(60, 50, 90, 0.32)',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                background: 'rgba(93, 136, 112, 0.18)',
                color: 'var(--themis-approved)',
              }}
            >
              <Check size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                Decision recorded
              </p>
              <p className="mt-0.5 font-display text-[13px] italic text-text-primary">
                {label}
              </p>
            </div>
            <button
              type="button"
              onClick={onUndo}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary"
            >
              <RotateCcw size={10} aria-hidden="true" />
              <span>Undo · {seconds}s</span>
            </button>
          </div>
          <span
            aria-hidden="true"
            className="block h-[2px] origin-right"
            style={{
              background:
                'linear-gradient(90deg, var(--themis-sakura), var(--themis-primary))',
              transform: `scaleX(${progress})`,
              transformOrigin: 'left',
              transition: 'transform 0.1s linear',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
