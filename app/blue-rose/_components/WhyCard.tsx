'use client';

import { ChevronRight, Sparkles } from 'lucide-react';
import type { Submission } from '@/data/themis/types';
import { riskBand } from '../_lib/insights';

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

/**
 * WhyCard — "Why is this in front of me?" pinned at the top of the
 * approver's SubmissionView. Tier 1 stub: surfaces basic context derived
 * from the submission. Tier 3 will populate with `submission.diane`
 * (one-paragraph summary, top reasons for/against, cited policy clauses,
 * confidence badge).
 *
 * Stays visible at all times for approver + in-review combinations so
 * the approver always lands oriented, never has to hunt.
 */
export default function WhyCard({ submission }: WhyCardProps) {
  const band = riskBand(submission);
  const sevField = submission.fields.find((f) => f.key === 'severity');
  const buField = submission.fields.find((f) => f.key === 'business_unit');

  return (
    <div
      className="mb-4 rounded-2xl border bg-[var(--themis-glass-tint)] px-4 py-3.5 shadow-[0_1px_0_inset_rgba(255,255,255,0.04)]"
      style={{ borderColor: 'rgba(185,168,214,0.28)' }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Sparkles size={12} style={{ color: 'var(--themis-primary)' }} aria-hidden="true" />
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--themis-primary)' }}
        >
          Why is this in front of me?
        </span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ background: `${RISK_COLOR[band]}1f`, color: RISK_COLOR[band] }}
        >
          Risk · {RISK_LABEL[band]}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-text-primary">
        You&apos;re assigned as an approver on this {submission.kind.replace(/-/g, ' ')}
        {sevField ? ` (severity: ${String(sevField.value).toLowerCase()})` : ''}
        {buField ? ` from ${String(buField.value)}` : ''}. Open the document below to review
        the submitter&apos;s justification, attachments, and any field-level discussion.
      </p>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-text-tertiary">
        <span className="font-mono uppercase tracking-widest">Tier 3 will populate</span>
        <ChevronRight size={11} aria-hidden="true" />
        <span>AI summary · top reasons for/against · cited policy · questions worth asking</span>
      </div>
    </div>
  );
}
