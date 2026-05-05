'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, X } from 'lucide-react';
import type { ExtractionResult } from '../../_lib/par-extract';
import type { FieldSpec } from '../../_lib/par-schema';

interface SourceHighlightModalProps {
  extraction: ExtractionResult | null;
  field: FieldSpec | null;
  onClose: () => void;
}

/**
 * SourceHighlightModal — Mercury's signature interaction.
 *
 * Click any Diane-drafted field in the Ledger → modal opens with a
 * stylized "document preview" panel showing the source passage that
 * drove the field's value, highlighted in sakura.
 *
 * The trust-building moment: stakeholders see that every Diane-drafted
 * value traces back to specific text in a specific document at a
 * specific page — not a black box.
 */
export default function SourceHighlightModal({
  extraction,
  field,
  onClose,
}: SourceHighlightModalProps) {
  useEffect(() => {
    if (!extraction || !field) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [extraction, field, onClose]);

  if (!extraction || !field) return null;
  const entry = extraction.fields[field.key];
  if (!entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          role="dialog"
          aria-label={`Source for ${field.label}`}
          initial={{ y: 8, scale: 0.97, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 8, scale: 0.97, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="themis-glass-pop relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border-subtle"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-start justify-between gap-3 border-b border-border-subtle/60 px-5 py-3.5">
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                <Sparkles size={10} style={{ color: 'var(--themis-sakura)' }} aria-hidden="true" />
                <span>Diane drafted</span>
                <span className="text-text-tertiary">·</span>
                <span>{field.label}</span>
              </p>
              <h2 className="mt-1 flex items-baseline gap-2 font-display text-[14px] font-medium text-text-primary">
                <FileText size={12} aria-hidden="true" className="text-text-tertiary" />
                <span>{extraction.filename}</span>
                <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
                  · page {entry.page} of {extraction.pages}
                </span>
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

          {/* Drafted value */}
          <div className="border-b border-border-subtle/60 bg-surface/40 px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
              Drafted value
            </p>
            <p className="mt-1 font-display text-[13px] leading-relaxed text-text-primary">
              {String(entry.value)}
            </p>
          </div>

          {/* Source passage — paper-feel panel with sakura highlight */}
          <div className="bg-[#fdfaf3] dark:bg-[#1a1620]">
            <div className="px-6 py-5 text-[#2a2526] dark:text-[#e6dfe1]">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#9a8f8a] dark:text-[#7d6d70]">
                Source passage · page {entry.page}
              </p>
              <blockquote
                className="rounded px-3 py-2 font-display text-[13px] leading-relaxed"
                style={{
                  background: 'rgba(176, 122, 130, 0.15)',
                  borderLeft: '3px solid var(--themis-sakura)',
                }}
              >
                {entry.source}
              </blockquote>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border-subtle/60 px-5 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
              Trace · {extraction.filename}#p{entry.page} → field:{field.key}
            </p>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
