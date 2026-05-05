'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, FileText } from 'lucide-react';
import type { ExtractionResult } from '../../_lib/par-extract';
import { useThemis } from '../../_lib/store';
import { DianeAvatar } from './DianePresence';

interface DraftingOverlayProps {
  /** When non-null, overlay plays the chain over this extraction. */
  extraction: ExtractionResult | null;
  /** Called when chain completes — overlay fades, ComposeShell clears state. */
  onComplete: () => void;
}

/**
 * DraftingOverlay — atmospheric handoff for file-attach drafting.
 *
 * Models the Phase 1 PAR Assist architecture made visible:
 *
 *   ✦ pulsing
 *
 *   ocr@v2                 ✓  extracted 14 pages
 *   field_extraction@v3    ⏵  populating fields…  ▒▒▒▒░░░░
 *   policy_lookup@v3          5 clauses retrieved
 *   coverage_analyzer@v1      coverage 78%
 *
 *   "Drafted 18 fields from acme_msa.pdf. Review them in the Ledger."
 *
 * Fields populate progressively *during* the field_extraction tick — one
 * `setParField` call every 80ms — so the user sees the Ledger fill in
 * like Diane is writing in real time.
 */
export default function DraftingOverlay({
  extraction,
  onComplete,
}: DraftingOverlayProps) {
  const { setParField } = useThemis();
  const [tickIdx, setTickIdx] = useState(0);
  const [verdictRevealed, setVerdictRevealed] = useState(false);

  // Reset when extraction goes null
  useEffect(() => {
    if (!extraction) {
      setTickIdx(0);
      setVerdictRevealed(false);
    }
  }, [extraction]);

  const fieldEntries = extraction
    ? Object.entries(extraction.fields)
    : [];
  const fieldCount = fieldEntries.length;
  const FIELD_TICK_MS = 75;
  const fieldExtractionDuration = Math.max(800, fieldCount * FIELD_TICK_MS + 300);

  const tools = extraction
    ? [
        {
          tool: 'ocr@v2',
          label: `extracted ${extraction.pages} pages`,
          duration: 600,
        },
        {
          tool: 'field_extraction@v3',
          label: `${fieldCount} fields extracted`,
          duration: fieldExtractionDuration,
        },
        {
          tool: 'policy_lookup@v3',
          label: 'clauses retrieved',
          duration: 500,
        },
        {
          tool: 'coverage_analyzer@v1',
          label: `coverage ${Math.min(95, Math.round((fieldCount / 32) * 100))}%`,
          duration: 400,
        },
      ]
    : [];

  // Tick advance
  useEffect(() => {
    if (!extraction || tickIdx >= tools.length) return;
    const t = setTimeout(() => setTickIdx((i) => i + 1), tools[tickIdx].duration);
    return () => clearTimeout(t);
  }, [extraction, tickIdx, tools]);

  // Progressive field population — fires when field_extraction tick begins (idx 1)
  useEffect(() => {
    if (!extraction) return;
    if (tickIdx !== 1) return;
    let cancelled = false;
    fieldEntries.forEach(([key, entry], i) => {
      setTimeout(() => {
        if (cancelled) return;
        setParField(key, entry.value, 'diane');
      }, FIELD_TICK_MS * i);
    });
    return () => {
      cancelled = true;
    };
  }, [extraction, tickIdx, fieldEntries, setParField]);

  // Reveal verdict after all ticks complete
  useEffect(() => {
    if (!extraction) return;
    if (tickIdx < tools.length) return;
    const t = setTimeout(() => setVerdictRevealed(true), 350);
    return () => clearTimeout(t);
  }, [extraction, tickIdx, tools.length]);

  // Auto-dismiss after verdict pause
  useEffect(() => {
    if (!extraction || !verdictRevealed) return;
    const t = setTimeout(() => onComplete(), 1800);
    return () => clearTimeout(t);
  }, [extraction, verdictRevealed, onComplete]);

  if (!extraction) return null;

  const verdictLine = `Drafted ${fieldCount} fields from ${extraction.filename}.`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(176, 122, 130, 0.16), transparent 50%), rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <motion.section
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="themis-glass-pop relative flex w-full max-w-lg flex-col items-center rounded-2xl border border-border-subtle px-8 py-10 text-center"
        >
          <DianeAvatar size="hero" pulsing />

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
            Diane is reading
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-[16px] font-medium tracking-tight text-text-primary">
            <FileText size={13} aria-hidden="true" className="text-text-tertiary" />
            <span>{extraction.filename}</span>
          </p>
          <p className="mt-1 font-display text-[13px] italic text-text-secondary">
            {extraction.documentLabel}
          </p>

          <ul className="mt-6 w-full space-y-2.5">
            {tools.map((step, i) => {
              const done = i < tickIdx;
              const active = i === tickIdx;
              return (
                <motion.li
                  key={step.tool}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: done || active ? 1 : 0.32, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-baseline gap-3"
                >
                  <span className="w-4 shrink-0">
                    {done ? (
                      <Check size={11} style={{ color: 'var(--themis-approved)' }} aria-hidden="true" />
                    ) : active ? (
                      <motion.span
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--themis-sakura)' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : null}
                  </span>
                  <span className="flex-1 text-left font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                    {step.tool}
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-text-tertiary">
                    {done ? step.label : ''}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <AnimatePresence>
            {verdictRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-7 w-full"
              >
                <p
                  className="font-display text-[15px] italic leading-relaxed text-text-primary"
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--themis-sakura-border)',
                  }}
                >
                  {verdictLine}
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Review them in the Ledger to your right.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
