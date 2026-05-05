'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { SynthesisOutcome } from '../../_lib/par-synthesize';
import { DianeAvatar } from './DianePresence';
import { useThemis } from '../../_lib/store';

interface SubmittingOverlayProps {
  outcome: SynthesisOutcome | null;
  onComplete: (submissionId: string) => void;
}

/**
 * SubmittingOverlay — atmospheric handoff sequence shown when the user
 * clicks Submit on /compose. Renders Diane's synthesis as an MCP-tool
 * firing sequence (the Phase 1 narrative made visible: tool calls
 * happen, audit by construction, structural guarantees).
 *
 *   ✦ pulsing
 *
 *   policy_lookup@v3        ✓  4 clauses retrieved
 *   similar_history@v2      ✓  2 similar prior approvals scanned
 *   coverage_analyzer@v1    ✓  coverage 78%
 *   routing_engine@v3       ✓  3-step chain proposed
 *
 *   "Routing to Director Operational Risk → VP Compliance →
 *    General Counsel. Expected decision: 5 business days."
 *
 *   [taking you to the approver's view…]
 *
 * Each tool ticks in sequence with a small delay; once all four are
 * complete, Diane's verdict line fades in, then 1.2s later the caller's
 * `onComplete(submissionId)` fires for navigation.
 */
export default function SubmittingOverlay({
  outcome,
  onComplete,
}: SubmittingOverlayProps) {
  const { seed } = useThemis();
  const [tickCount, setTickCount] = useState(0);
  const [verdictRevealed, setVerdictRevealed] = useState(false);

  useEffect(() => {
    if (!outcome) {
      setTickCount(0);
      setVerdictRevealed(false);
      return;
    }
    if (tickCount >= outcome.toolSequence.length) return;

    const t = setTimeout(() => {
      setTickCount((c) => c + 1);
    }, outcome.toolSequence[tickCount].durationMs);
    return () => clearTimeout(t);
  }, [outcome, tickCount]);

  useEffect(() => {
    if (!outcome) return;
    if (tickCount < outcome.toolSequence.length) return;
    const t = setTimeout(() => setVerdictRevealed(true), 400);
    return () => clearTimeout(t);
  }, [outcome, tickCount]);

  useEffect(() => {
    if (!outcome) return;
    if (!verdictRevealed) return;
    const t = setTimeout(() => onComplete(outcome.submission.id), 2000);
    return () => clearTimeout(t);
  }, [outcome, verdictRevealed, onComplete]);

  if (!outcome) return null;

  const chain = outcome.submission.diane?.routingPreview.steps ?? [];
  const days = outcome.submission.diane?.routingPreview.estimatedDays ?? 1;
  const personaMap = new Map(seed.personas.map((p) => [p.id, p]));

  const verdictLine =
    chain.length === 0
      ? 'Routing to first-line review.'
      : `Routing to ${chain
          .map((s) => personaMap.get(s.approverId)?.displayName ?? s.role)
          .join(' → ')}. Expected decision: ${days} business ${days === 1 ? 'day' : 'days'}.`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(126, 106, 168, 0.18), transparent 50%), rgba(0, 0, 0, 0.55)',
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
            Diane is synthesizing
          </p>
          <h2 className="mt-1 font-display text-[20px] font-medium tracking-tight text-text-primary">
            {outcome.submission.title}
          </h2>

          <ul className="mt-7 w-full space-y-2.5">
            {outcome.toolSequence.map((step, i) => {
              const done = i < tickCount;
              const active = i === tickCount;
              return (
                <motion.li
                  key={step.tool}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{
                    opacity: done || active ? 1 : 0.35,
                    y: 0,
                  }}
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
                  Taking you to the approver&apos;s view…
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
