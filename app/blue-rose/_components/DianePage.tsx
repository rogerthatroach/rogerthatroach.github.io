'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useThemis, usePersonaMap } from '../_lib/store';
import { findRule } from '../_lib/rules';
import { relativeTime } from '../_lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import type { AuditEvent, Confidence, Submission } from '@/data/themis/types';
import { cn } from '@/lib/utils';

const CONFIDENCE_COLOR: Record<Confidence, string> = {
  low: 'var(--themis-needs-info)',
  medium: 'var(--themis-in-review)',
  high: 'var(--themis-approved)',
};

const STATUS_LABEL_FOR_DELTA = (status: Submission['status']) => {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'in flight';
};

interface LedgerRow {
  event: AuditEvent;
  submission: Submission;
}

/**
 * DianePage — `/blue-rose/diane`.
 *
 * T1.9 fill: Decision Ledger. A flat table of Diane's most recent
 * actions across submissions, surfaced as a single LLMOps view.
 * Columns: timestamp / submission / MCP tool / field-group / confidence
 * / outcome / delta vs. predicted. T4 adds the confidence-calibration
 * scatter plot (predicted vs. actual outcomes per PAR Assist framing).
 */
export default function DianePage() {
  const { seed, selectSubmission } = useThemis();
  const personaMap = usePersonaMap();

  const submissionMap = useMemo(() => {
    const m = new Map<string, Submission>();
    for (const s of seed.submissions) m.set(s.id, s);
    return m;
  }, [seed.submissions]);

  const dianeRows = useMemo<LedgerRow[]>(() => {
    return [...seed.audit]
      .filter((e) => personaMap.get(e.actorPersonaId)?.role === 'agent')
      .filter((e) => !!submissionMap.get(e.submissionId))
      .sort((a, b) => b.at - a.at)
      .map((event) => ({ event, submission: submissionMap.get(event.submissionId)! }));
  }, [seed.audit, personaMap, submissionMap]);

  // Aggregate stats for the ledger header
  const stats = useMemo(() => {
    const total = dianeRows.length;
    const matched = dianeRows.filter(({ event, submission }) => {
      // "matched" = the predicted top approver actually appears in current assignees
      const top = submission.diane?.routingPreview.steps[0];
      if (!top) return false;
      return submission.assignees.includes(top.approverId);
    }).length;
    const byConfidence = dianeRows.reduce(
      (acc, { event }) => {
        const c = event.dianeReasoning?.confidence;
        if (c) acc[c] = (acc[c] ?? 0) + 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 } as Record<Confidence, number>,
    );
    return { total, matched, byConfidence };
  }, [dianeRows]);

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span
            className="mb-3 inline-flex h-12 w-12 items-center justify-center"
            style={{
              background: 'rgba(245, 158, 11, 0.14)',
              borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
              color: '#F59E0B',
            }}
            aria-hidden="true"
          >
            <Sparkles size={18} />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Decision Ledger · LLMOps
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
            Diane
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            Every action Diane has taken across submissions, with the MCP tool
            invoked, field-group retrieved, confidence at decision time, and
            whether the predicted routing matched the actual chain. T4 adds the
            confidence-calibration scatter (predicted vs. actual approval
            outcome) and per-skill fire counts.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <Stat label="Total actions" value={stats.total.toString()} />
          <Stat
            label="Routing matched"
            value={
              stats.total === 0
                ? '—'
                : `${Math.round((stats.matched / stats.total) * 100)}%`
            }
            accent="var(--themis-approved)"
          />
          <Stat
            label="High confidence"
            value={stats.byConfidence.high.toString()}
            accent="var(--themis-approved)"
          />
          <Stat
            label="Medium / Low"
            value={`${stats.byConfidence.medium} / ${stats.byConfidence.low}`}
            accent="var(--themis-in-review)"
          />
        </motion.div>

        {/* Ledger table */}
        {dianeRows.length === 0 ? (
          <motion.p
            variants={fadeUp}
            className="rounded-2xl border border-dashed border-border-subtle bg-surface/30 px-6 py-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary"
          >
            Diane has not been invoked on any submissions yet.
          </motion.p>
        ) : (
          <motion.div
            variants={fadeUp}
            className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface/40"
          >
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle/60">
                  <Th>Time</Th>
                  <Th>Submission</Th>
                  <Th>Action</Th>
                  <Th>MCP tool</Th>
                  <Th>Field-group</Th>
                  <Th>Confidence</Th>
                  <Th>Outcome</Th>
                  <Th>Δ predicted</Th>
                </tr>
              </thead>
              <tbody>
                {dianeRows.map(({ event, submission }) => {
                  const reasoning = event.dianeReasoning;
                  const top = submission.diane?.routingPreview.steps[0];
                  const matched = top
                    ? submission.assignees.includes(top.approverId)
                    : false;
                  const ruleId = top?.ruleId;
                  const rule = ruleId ? findRule(ruleId) : undefined;
                  return (
                    <tr
                      key={event.id}
                      className="border-b border-border-subtle/30 transition-colors last:border-b-0 hover:bg-surface-hover/40"
                    >
                      <Td mono>{relativeTime(event.at)}</Td>
                      <Td>
                        <a
                          href="/blue-rose/submission"
                          onClick={() => selectSubmission(submission.id)}
                          className="text-[12px] text-text-primary transition-colors hover:text-[var(--themis-primary)]"
                        >
                          {submission.title}
                        </a>
                      </Td>
                      <Td mono>{event.kind.replace(/_/g, ' ')}</Td>
                      <Td mono>{reasoning?.mcpTool ?? '—'}</Td>
                      <Td mono>{reasoning?.fieldGroup ?? '—'}</Td>
                      <Td>
                        {reasoning?.confidence ? (
                          <span
                            className="font-mono text-[10px] uppercase tracking-widest"
                            style={{
                              color: CONFIDENCE_COLOR[reasoning.confidence],
                            }}
                          >
                            {reasoning.confidence}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-text-tertiary">
                            —
                          </span>
                        )}
                      </Td>
                      <Td mono>{STATUS_LABEL_FOR_DELTA(submission.status)}</Td>
                      <Td>
                        <span
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            color: matched
                              ? 'var(--themis-approved)'
                              : 'var(--themis-needs-info)',
                          }}
                          title={
                            rule
                              ? `Predicted via ${rule.id}`
                              : 'No predicted routing'
                          }
                        >
                          {matched ? 'matched' : 'diverged'}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-2xl text-[12px] leading-relaxed text-text-tertiary"
        >
          Diane runs only where she&apos;s invoked. Single-agent governance
          envelope per PAR Assist Phase 1 — actions land in this ledger
          structurally, not aspirationally.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/blue-rose/home"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={11} aria-hidden="true" />
            <span>Back to home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      className={cn(
        'px-3 py-2 align-top text-[12px]',
        mono && 'font-mono text-[11px] text-text-secondary',
      )}
    >
      {children}
    </td>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface/40 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        {label}
      </p>
      <p
        className="mt-1 font-display text-[24px] font-medium leading-none text-text-primary"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
