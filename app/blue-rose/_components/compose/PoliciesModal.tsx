'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PAR_POLICIES, PAR_GUIDELINES, type PolicyEntry } from '../../_lib/par-schema';

interface PoliciesModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * PoliciesModal — centered modal listing PAR Policies + Guidelines.
 *
 * Matches PAR Phase 1 screenshot 4: "PAR Policies and Guidelines" title
 * + two list sections + Close button. Restyled in White Lodge tokens
 * (Fraunces section headers, mono uppercase labels, glass surface, subtle
 * amethyst tint).
 *
 * The content (3 policies + 3 guidelines) lives in `_lib/par-schema.ts`
 * and is the same registry used by Diane to ground her drafts.
 */
export default function PoliciesModal({ open, onClose }: PoliciesModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-label="PAR Policies and Guidelines"
            initial={{ y: 8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="themis-glass-pop relative w-full max-w-xl rounded-2xl border border-border-subtle p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Reference
                </p>
                <h2 className="mt-1 font-display text-xl font-medium tracking-tight text-text-primary">
                  PAR Policies and Guidelines
                </h2>
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

            <div className="space-y-5">
              <PolicySection label="Policies" entries={PAR_POLICIES} />
              <hr className="border-border-subtle/60" />
              <PolicySection label="Guidelines" entries={PAR_GUIDELINES} />
            </div>

            <footer className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={{
                  background: 'var(--themis-primary)',
                  color: 'var(--color-bg)',
                }}
              >
                Close
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PolicySection({
  label,
  entries,
}: {
  label: string;
  entries: PolicyEntry[];
}) {
  return (
    <section>
      <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        {label}
      </h3>
      <ul className="space-y-3.5">
        {entries.map((e) => (
          <li key={e.title}>
            <p className="font-display text-[14px] font-medium text-text-primary">
              {e.title}
            </p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-text-secondary">
              {e.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
