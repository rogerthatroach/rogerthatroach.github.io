'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Minus, Pause, Plus, Sparkles, ThumbsUp, AlertCircle, ThumbsDown } from 'lucide-react';
import type { Confidence, DianeAnnotation, DianeCitation, Submission } from '@/data/themis/types';
import { riskBand } from '../_lib/insights';
import { useThemis } from '../_lib/store';
import { cn } from '@/lib/utils';
import RoutingOverrideModal from './RoutingOverrideModal';

/**
 * Diane's recommended action, derived from the annotation. Used by the
 * verdict line + (in T2.H.2) the SubmissionView decision-button pulse.
 */
export type DianeRecommendation = 'approve' | 'question' | 'reject' | 'unclear';

export function dianeRecommendation(diane: DianeAnnotation): DianeRecommendation {
  const forCount = diane.reasonsFor.length;
  const againstCount = diane.reasonsAgainst.length;
  if (diane.confidence === 'low') return 'unclear';
  if (forCount > againstCount && diane.confidence === 'high') return 'approve';
  if (againstCount > forCount + 1) return 'reject';
  if (againstCount >= forCount) return 'question';
  return 'approve';
}

const VERDICT_LABEL: Record<DianeRecommendation, string> = {
  approve: 'recommends approval',
  question: 'recommends asking for clarification',
  reject: 'recommends declining',
  unclear: 'cannot recommend confidently',
};

const VERDICT_COLOR: Record<DianeRecommendation, string> = {
  approve: 'var(--themis-approved)',
  question: 'var(--themis-in-review)',
  reject: 'var(--themis-rejected)',
  unclear: 'var(--themis-needs-info)',
};

interface WhyCardProps {
  submission: Submission;
}

const RISK_LABEL: Record<ReturnType<typeof riskBand>, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const RISK_COLOR: Record<ReturnType<typeof riskBand>, string> = {
  low: 'var(--themis-pending)',
  medium: 'var(--themis-in-review)',
  high: 'var(--themis-needs-info)',
  critical: 'var(--themis-rejected)',
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const CONFIDENCE_COLOR: Record<Confidence, string> = {
  low: 'var(--themis-needs-info)',
  medium: 'var(--themis-in-review)',
  high: 'var(--themis-approved)',
};

/**
 * WhyCard — "Why is this in front of me?" pinned at the top of the
 * approver's SubmissionView. Two render modes:
 *
 *  • `submission.diane` present → full render: summary, reasons-for/against,
 *    citation chips, MCP-tool footer caption, "Why did Diane do this?"
 *    disclosure. Vocabulary echoes PAR Assist Phase 1 (field-group retrieval,
 *    coverage analyzer, MCP tool boundary, structural guarantees).
 *  • `submission.diane` absent → modeling-the-governance-envelope empty state:
 *    "Diane was not invoked on this submission." Diane only runs where
 *    explicitly invoked, mirroring the single-agent governance envelope.
 */
export default function WhyCard({ submission }: WhyCardProps) {
  const { diane } = submission;
  const { dianePaused } = useThemis();
  if (dianePaused) return <WhyCardPaused submission={submission} />;
  if (!diane) return <WhyCardEmpty submission={submission} />;
  if (diane.confidence === 'low') {
    return <WhyCardRefusal submission={submission} diane={diane} />;
  }
  return <WhyCardPopulated submission={submission} diane={diane} />;
}

/**
 * WhyCardPaused — Diane is on the kill switch. Surfaces the structural
 * fact that her authority is revoked, with a path to resume.
 */
function WhyCardPaused({ submission }: { submission: Submission }) {
  const band = riskBand(submission);
  return (
    <div
      className="mb-4 rounded-2xl border bg-[var(--themis-needs-info-bg)] px-4 py-3.5"
      style={{ borderColor: 'var(--themis-needs-info)', borderLeftWidth: 2 }}
    >
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <Pause
          size={12}
          aria-hidden="true"
          fill="currentColor"
          style={{ color: 'var(--themis-needs-info)' }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--themis-needs-info)' }}
        >
          Diane is paused
        </span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ background: `${RISK_COLOR[band]}1f`, color: RISK_COLOR[band] }}
        >
          Risk · {RISK_LABEL[band]}
        </span>
      </header>
      <p className="font-display text-[13px] italic leading-relaxed text-text-primary">
        Diane&apos;s analysis is unavailable while paused. The submission&apos;s
        content is intact and the decision is yours to make. Resume from the
        chrome chip to view her recommendation.
      </p>
    </div>
  );
}

/**
 * WhyCardRefusal — when synthesis confidence is `low`, Diane refuses to
 * recommend rather than confabulating reasons. Surfaces this honestly:
 * "I don't have enough policy coverage to draft this confidently — recommend
 * assigning to a human reviewer for full triage."
 */
function WhyCardRefusal({
  submission,
  diane,
}: {
  submission: Submission;
  diane: DianeAnnotation;
}) {
  const band = riskBand(submission);
  return (
    <div
      className="mb-4 rounded-2xl border bg-[var(--themis-needs-info-bg)] px-4 py-3.5"
      style={{ borderColor: 'var(--themis-needs-info)', borderLeftWidth: 2 }}
    >
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <AlertCircle
          size={12}
          aria-hidden="true"
          style={{ color: 'var(--themis-needs-info)' }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--themis-needs-info)' }}
        >
          ✦ Diane abstains · low confidence
        </span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ background: `${RISK_COLOR[band]}1f`, color: RISK_COLOR[band] }}
        >
          Risk · {RISK_LABEL[band]}
        </span>
      </header>
      <p className="font-display text-[13.5px] italic leading-relaxed text-text-primary">
        I don&apos;t have enough policy coverage to draft this confidently —
        recommend assigning to a human reviewer for full triage. Coverage at{' '}
        {Math.round(diane.coverage * 100)}%; only {diane.citations.length}{' '}
        clause{diane.citations.length === 1 ? '' : 's'} matched the request
        shape.
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        Approver discretion · this is your call
      </p>
    </div>
  );
}

function WhyCardPopulated({
  submission,
  diane,
}: {
  submission: Submission;
  diane: DianeAnnotation;
}) {
  const band = riskBand(submission);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const fieldGroupsCount = diane.fieldGroupsRetrieved.length;
  const recommendation = dianeRecommendation(diane);
  const verdictColor = VERDICT_COLOR[recommendation];
  const VerdictIcon =
    recommendation === 'approve'
      ? ThumbsUp
      : recommendation === 'reject'
        ? ThumbsDown
        : AlertCircle;

  return (
    <div
      className="mb-4 rounded-2xl border bg-[var(--themis-glass-tint)] px-4 py-3.5 shadow-[0_1px_0_inset_rgba(255,255,255,0.04)]"
      style={{ borderColor: 'rgba(185,168,214,0.28)' }}
    >
      {/* Verdict line — the always-visible default. Click to expand details. */}
      <button
        type="button"
        onClick={() => setDetailExpanded((v) => !v)}
        aria-expanded={detailExpanded}
        className="group flex w-full items-start gap-3 text-left"
      >
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `${verdictColor}1f`,
            color: verdictColor,
          }}
          aria-hidden="true"
        >
          <VerdictIcon size={13} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.25em]"
              style={{ color: 'var(--themis-primary)' }}
            >
              <Sparkles
                size={10}
                aria-hidden="true"
                className="mr-1 inline-block align-baseline"
                style={{ color: 'var(--themis-primary)' }}
              />
              Diane
            </span>
            <span
              className="font-display text-[14px] font-medium leading-snug"
              style={{ color: verdictColor }}
            >
              {VERDICT_LABEL[recommendation]}
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{
                background: `${CONFIDENCE_COLOR[diane.confidence]}1f`,
                color: CONFIDENCE_COLOR[diane.confidence],
              }}
            >
              {CONFIDENCE_LABEL[diane.confidence]} confidence
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{ background: `${RISK_COLOR[band]}1f`, color: RISK_COLOR[band] }}
            >
              Risk · {RISK_LABEL[band]}
            </span>
          </span>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-primary">
            {diane.summary}
          </p>
        </span>
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={cn(
            'mt-1 shrink-0 text-text-tertiary transition-transform',
            detailExpanded && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {detailExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">
      {/* Reasons grid */}
      {(diane.reasonsFor.length > 0 || diane.reasonsAgainst.length > 0) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {diane.reasonsFor.length > 0 && (
            <ReasonColumn
              label="Reasons to approve"
              tone="approve"
              reasons={diane.reasonsFor}
            />
          )}
          {diane.reasonsAgainst.length > 0 && (
            <ReasonColumn
              label="Reasons to question"
              tone="question"
              reasons={diane.reasonsAgainst}
            />
          )}
        </div>
      )}

      {/* Citation chips */}
      {diane.citations.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Cited
          </span>
          {diane.citations.map((c) => (
            <CitationChip key={c.id} citation={c} />
          ))}
        </div>
      )}

      {/* MCP-tool / field-group / coverage footer caption */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        field-groups retrieved: {fieldGroupsCount}/{fieldGroupsCount} · coverage{' '}
        {Math.round(diane.coverage * 100)}% · MCP tools:{' '}
        <span className="normal-case tracking-normal text-text-secondary">
          {diane.mcpToolsUsed.map((t) => t.replace(/@.*/, '')).join(', ')}
        </span>
      </p>

      {/* "Why did Diane do this?" disclosure (nested inside details) */}
      <button
        type="button"
        onClick={() => setWhyExpanded((v) => !v)}
        aria-expanded={whyExpanded}
        className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary transition-colors hover:text-text-primary"
      >
        <ChevronDown
          size={11}
          aria-hidden="true"
          className={cn('transition-transform', whyExpanded && 'rotate-180')}
        />
        <span>Why did Diane do this?</span>
      </button>
      <AnimatePresence initial={false}>
        {whyExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl border border-border-subtle/60 bg-surface/50 px-3 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                Field-groups retrieved
              </p>
              <ul className="mt-1 mb-3 flex flex-wrap gap-1">
                {diane.fieldGroupsRetrieved.map((g) => (
                  <li
                    key={g}
                    className="rounded-md border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[10px] text-text-secondary"
                  >
                    {g}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                MCP tool calls
              </p>
              <ul className="mt-1 mb-3 flex flex-wrap gap-1">
                {diane.mcpToolsUsed.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[10px] text-text-secondary"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {diane.routingPreview.steps.length > 0 && (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                    Routing chain
                  </p>
                  <ol className="mt-1 space-y-1">
                    {diane.routingPreview.steps.map((step, i) => (
                      <li key={i} className="text-[12px] text-text-secondary">
                        <span className="font-mono text-[10px] text-text-tertiary">
                          {i + 1}.
                        </span>{' '}
                        <span className="text-text-primary">{step.role}</span>
                        <span className="text-text-tertiary"> · {step.rationale}</span>{' '}
                        <span className="font-mono text-[10px] text-text-tertiary">
                          ({step.ruleId})
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                      Estimated decision: {diane.routingPreview.estimatedDays} business{' '}
                      {diane.routingPreview.estimatedDays === 1 ? 'day' : 'days'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOverrideOpen(true)}
                      className="font-mono text-[10px] uppercase tracking-widest text-[var(--themis-primary)] transition-colors hover:text-text-primary"
                    >
                      Edit chain →
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RoutingOverrideModal
        submission={submission}
        open={overrideOpen}
        onClose={() => setOverrideOpen(false)}
      />
    </div>
  );
}

function ReasonColumn({
  label,
  tone,
  reasons,
}: {
  label: string;
  tone: 'approve' | 'question';
  reasons: string[];
}) {
  const Icon = tone === 'approve' ? Plus : Minus;
  const color = tone === 'approve' ? 'var(--themis-approved)' : 'var(--themis-needs-info)';
  return (
    <section>
      <p
        className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em]"
        style={{ color }}
      >
        <Icon size={10} aria-hidden="true" />
        <span>{label}</span>
      </p>
      <ul className="space-y-1">
        {reasons.map((r, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-text-primary">
            <span aria-hidden="true" style={{ color }}>
              ·
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CitationChip({ citation }: { citation: DianeCitation }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={citation.deepLink}
        className="rounded border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary"
        aria-label={`Citation ${citation.id}: ${citation.policyId} ${citation.clauseRef}`}
      >
        [{citation.id}]
      </a>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            role="tooltip"
            className="themis-glass-pop pointer-events-none absolute left-0 top-full z-30 mt-1 w-72 rounded-lg border border-border-subtle bg-surface/95 px-2.5 py-2 text-left shadow-lg"
          >
            <span className="block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {citation.policyId} {citation.clauseRef}
            </span>
            <span className="mt-1 block text-[12px] leading-snug text-text-primary">
              &ldquo;{citation.quote}&rdquo;
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function WhyCardEmpty({ submission }: { submission: Submission }) {
  const band = riskBand(submission);
  const sevField = submission.fields.find((f) => f.key === 'severity');
  const buField = submission.fields.find((f) => f.key === 'business_unit');

  return (
    <div
      className="mb-4 rounded-2xl border bg-surface/40 px-4 py-3.5"
      style={{ borderColor: 'rgba(185,168,214,0.18)' }}
    >
      <header className="mb-2 flex flex-wrap items-center gap-2">
        <Sparkles size={12} className="text-text-tertiary" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          Diane was not invoked on this submission
        </span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ background: `${RISK_COLOR[band]}1f`, color: RISK_COLOR[band] }}
        >
          Risk · {RISK_LABEL[band]}
        </span>
      </header>
      <p className="text-[13px] leading-relaxed text-text-primary">
        You&apos;re assigned as an approver on this {submission.kind.replace(/-/g, ' ')}
        {sevField ? ` (severity: ${String(sevField.value).toLowerCase()})` : ''}
        {buField ? ` from ${String(buField.value)}` : ''}. Open the document below to review
        the submitter&apos;s justification, attachments, and any field-level discussion.
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        Diane runs only where she&apos;s invoked. Single-agent governance envelope.
      </p>
    </div>
  );
}
