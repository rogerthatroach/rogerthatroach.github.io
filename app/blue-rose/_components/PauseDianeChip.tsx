'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Sparkles, X } from 'lucide-react';
import { useThemis } from '../_lib/store';
import { cn } from '@/lib/utils';

/**
 * PauseDianeChip — RAI kill switch in the chrome.
 *
 *   ┌─ ✦ Diane on  ─┐    ┌─ ⏸ Diane paused ─┐
 *
 * Click the chip to toggle. Confirmation modal both ways: pausing
 * refuses ongoing draft/synthesize/route work, resuming reactivates.
 *
 * Visible across all White Lodge surfaces (mounted in WhiteLodgeLayout).
 * The single most visible RAI primitive: Diane's authority is revocable
 * by the human at any moment, and the state of that revocation is in
 * front of you, not buried.
 */
export default function PauseDianeChip() {
  const { dianePaused, setDianePaused } = useThemis();
  const [confirming, setConfirming] = useState(false);

  const onConfirm = () => {
    setDianePaused(!dianePaused);
    setConfirming(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={dianePaused ? 'Resume Diane' : 'Pause Diane'}
        title={dianePaused ? 'Diane is paused — click to resume' : 'Diane is on — click to pause'}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors',
          dianePaused
            ? 'border-[var(--themis-needs-info)]/50 bg-[var(--themis-needs-info-bg)] text-[var(--themis-needs-info)] hover:brightness-105'
            : 'border-[var(--themis-sakura-border)] bg-transparent text-[var(--themis-sakura)] hover:bg-[var(--themis-sakura-bg)]',
        )}
      >
        {dianePaused ? (
          <Pause size={10} aria-hidden="true" fill="currentColor" />
        ) : (
          <Sparkles size={10} aria-hidden="true" />
        )}
        <span>{dianePaused ? 'Diane paused' : 'Diane on'}</span>
      </button>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
            onClick={() => setConfirming(false)}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-label={dianePaused ? 'Resume Diane' : 'Pause Diane'}
              initial={{ y: 8, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.97, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="themis-glass-pop relative w-full max-w-md rounded-2xl border border-border-subtle p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                    Responsible AI
                  </p>
                  <h2 className="mt-1 font-display text-lg font-medium text-text-primary">
                    {dianePaused ? 'Resume Diane?' : 'Pause Diane?'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  aria-label="Close"
                  className="shrink-0 rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </header>

              <div className="space-y-2 font-display text-[13.5px] italic leading-relaxed text-text-secondary">
                {dianePaused ? (
                  <>
                    <p>
                      Diane will resume drafting, synthesizing, and routing
                      across all surfaces.
                    </p>
                    <p>
                      Existing submissions retain their current annotations;
                      new work re-enters her envelope.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Pausing Diane will block her from drafting fields, synthesizing
                      submissions, and proposing routing chains.
                    </p>
                    <p>
                      Existing annotations on submissions stay visible. Submitters
                      can still complete forms manually; approvers can still decide.
                      Resume from this chip when you&apos;re ready.
                    </p>
                  </>
                )}
              </div>

              <footer className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-md border border-border-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                  style={{
                    background: dianePaused ? 'var(--themis-sakura)' : 'var(--themis-needs-info)',
                    color: 'var(--color-bg)',
                  }}
                >
                  {dianePaused ? (
                    <>
                      <Play size={10} aria-hidden="true" fill="currentColor" />
                      <span>Resume Diane</span>
                    </>
                  ) : (
                    <>
                      <Pause size={10} aria-hidden="true" fill="currentColor" />
                      <span>Pause Diane</span>
                    </>
                  )}
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
