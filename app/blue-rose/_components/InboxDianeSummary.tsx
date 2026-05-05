'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useThemis, useCurrentPersona } from '../_lib/store';
import { applyFilters } from '../_lib/filters';

/**
 * InboxDianeSummary — Diane's one-line read of the queue.
 *
 *   ┌─ ✦  Diane
 *   │   3 awaiting your decision · 1 anomaly worth checking ·
 *   │   2 are similar to past approvals
 *   └─
 *
 * Italic Fraunces, sakura left-border. Re-derives per persona +
 * applied queue filters. Only renders when there's something specific
 * to say.
 */
export default function InboxDianeSummary() {
  const { seed, threads, queueFilters } = useThemis();
  const persona = useCurrentPersona();

  const visible = useMemo(() => {
    const personaScoped = seed.submissions.filter((s) => {
      if (persona.role === 'submitter') {
        return s.submittedBy === persona.id || s.assignees.includes(persona.id);
      }
      if (persona.role === 'approver' || persona.role === 'admin') {
        return s.assignees.includes(persona.id) || s.submittedBy === persona.id;
      }
      return true;
    });
    const unreadByThread = new Map<string, number>();
    for (const t of threads)
      unreadByThread.set(t.id, t.unreadByPersonaId[persona.id] ?? 0);
    return applyFilters(personaScoped, queueFilters, { unreadByThread });
  }, [seed.submissions, threads, queueFilters, persona]);

  const phrases = useMemo(() => {
    const out: string[] = [];

    // Awaiting decision = approver assigned, status in_review or pending
    if (persona.role === 'approver' || persona.role === 'admin') {
      const awaiting = visible.filter(
        (s) =>
          s.assignees.includes(persona.id) &&
          (s.status === 'in_review' || s.status === 'pending'),
      ).length;
      if (awaiting > 0) {
        out.push(
          `${awaiting} awaiting your decision`,
        );
      }
    }

    // Anomaly hint count
    const anomalies = visible.filter((s) => {
      const sev = s.fields.find((f) => f.key === 'severity')?.value;
      return s.priority === 'high' && (sev === 'High' || sev === 'Critical');
    }).length;
    if (anomalies > 0) {
      out.push(`${anomalies} anomal${anomalies === 1 ? 'y' : 'ies'} worth checking`);
    }

    // Similar to past approvals — submissions whose kind has historical
    // approvals in the seed
    const kindsWithHistory = new Set(
      seed.submissions
        .filter((s) => s.status === 'approved')
        .map((s) => s.kind),
    );
    const similar = visible.filter(
      (s) => kindsWithHistory.has(s.kind) && s.status !== 'approved',
    ).length;
    if (similar > 0) {
      out.push(`${similar} similar to past approvals`);
    }

    // Diane-analyzed count — submissions with diane payload
    const dianeCount = visible.filter((s) => !!s.diane).length;
    if (dianeCount > 0 && out.length === 0) {
      out.push(`${dianeCount} carry Diane's analysis`);
    }

    return out;
  }, [visible, persona, seed.submissions]);

  if (phrases.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-label="Diane's queue summary"
      className="mb-4 flex items-start gap-3 rounded-xl border bg-surface/30 px-4 py-3"
      style={{
        borderColor: 'var(--themis-sakura-border)',
        borderLeftWidth: 2,
        background:
          'linear-gradient(90deg, var(--themis-sakura-bg), transparent 70%)',
      }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          background: 'var(--themis-sakura-bg)',
          color: 'var(--themis-sakura)',
          boxShadow: '0 0 0 1px var(--themis-sakura-border)',
        }}
      >
        <Sparkles size={11} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          Diane
        </p>
        <p className="mt-0.5 font-display text-[13px] italic leading-relaxed text-text-primary">
          {phrases.join(' · ')}.
        </p>
      </div>
    </motion.aside>
  );
}
