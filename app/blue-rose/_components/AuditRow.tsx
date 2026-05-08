'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { AuditEvent, DianeCitation } from '@/data/themis/types';
import { relativeTime } from '../_lib/format';
import { cn } from '@/lib/utils';

interface AuditRowProps {
  event: AuditEvent;
  actorName: string;
  isAgent: boolean;
  /** Citations from the parent submission, used to resolve `dianeReasoning.citations` ids. */
  citations?: DianeCitation[];
  /** Optional submission title to anchor the row in cross-submission contexts (e.g. /audit). */
  submissionTitle?: string;
  /** Optional href for the submission title — link-out from cross-submission timeline. */
  submissionHref?: string;
  /** Optional onClick for the submission title (e.g. selectSubmission then router.push). */
  onSubmissionClick?: () => void;
}

export function auditKindColor(kind: string): string {
  if (kind === 'approved') return 'var(--themis-approved)';
  if (kind === 'rejected') return 'var(--themis-rejected)';
  if (kind === 'changes_requested') return 'var(--themis-needs-info)';
  if (kind === 'submitted') return 'var(--themis-pending)';
  if (kind === 'routing_overridden') return 'var(--themis-primary)';
  if (kind.startsWith('diane_')) return '#F59E0B';
  return 'var(--themis-secondary)';
}

/**
 * AuditRow — one timeline node. AI-actor events expose a typed
 * `dianeReasoning` payload via inline expandable, which is the
 * "Why did Diane do this?" / MCP-tool-boundary moment.
 *
 * Used by ContextTab (per-submission timeline) and /audit
 * (cross-submission timeline). Pass `submissionTitle` to anchor
 * the row in the cross-submission case.
 */
export default function AuditRow({
  event,
  actorName,
  isAgent,
  citations,
  submissionTitle,
  submissionHref,
  onSubmissionClick,
}: AuditRowProps) {
  const [expanded, setExpanded] = useState(false);
  const reasoning = event.dianeReasoning;
  const citedHere = reasoning?.citations
    ?.map((id) => citations?.find((c) => c.id === id))
    .filter((c): c is DianeCitation => !!c) ?? [];

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-bg)]"
        style={{ background: auditKindColor(event.kind) }}
      />
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span
          className={cn(
            'text-[11.5px] font-medium',
            isAgent ? 'text-[#F59E0B]' : 'text-text-primary',
          )}
        >
          {actorName}
        </span>
        {isAgent && (
          <Sparkles size={9} className="text-[#F59E0B]" aria-hidden="true" />
        )}
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          {event.kind.replace(/_/g, ' ')}
        </span>
        {submissionTitle && (
          <>
            <span className="font-mono text-[10px] text-text-tertiary">on</span>
            {submissionHref || onSubmissionClick ? (
              <a
                href={submissionHref ?? '#'}
                onClick={(e) => {
                  if (onSubmissionClick) {
                    onSubmissionClick();
                  }
                }}
                className="truncate text-[12px] text-text-primary transition-colors hover:text-[var(--themis-primary)]"
              >
                {submissionTitle}
              </a>
            ) : (
              <span className="truncate text-[12px] text-text-primary">
                {submissionTitle}
              </span>
            )}
          </>
        )}
      </div>
      <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
        {relativeTime(event.at)}
        {event.before != null && event.after != null ? (
          <>
            {' · '}
            <span className="text-text-secondary">
              {String(event.before)} → {String(event.after)}
            </span>
          </>
        ) : null}
      </span>
      {reasoning && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ChevronDown
              size={10}
              aria-hidden="true"
              className={cn('transition-transform', expanded && 'rotate-180')}
            />
            <span>Why did Diane do this?</span>
          </button>
          {expanded && (
            <div
              className="mt-1.5 rounded-lg px-2.5 py-2 text-[12px] leading-snug"
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                borderLeft: '2px solid #F59E0B',
              }}
            >
              <p className="text-text-primary">{reasoning.rationale}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span
                  className="rounded border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-text-secondary"
                  title="MCP tool invoked"
                >
                  {reasoning.mcpTool}
                </span>
                {reasoning.fieldGroup && (
                  <span
                    className="rounded border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-text-secondary"
                    title="Field-group retrieved"
                  >
                    {reasoning.fieldGroup}
                  </span>
                )}
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  · {reasoning.confidence} confidence
                </span>
                {citedHere.length > 0 && (
                  <span className="ml-auto flex items-center gap-1">
                    {citedHere.map((c) => (
                      <a
                        key={c.id}
                        href={c.deepLink}
                        title={`${c.policyId} ${c.clauseRef}: ${c.quote}`}
                        className="rounded border border-border-subtle bg-surface/70 px-1.5 py-0.5 font-mono text-[9px] text-text-secondary transition-colors hover:border-[#F59E0B]/50 hover:text-text-primary"
                      >
                        [{c.id}]
                      </a>
                    ))}
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </li>
  );
}
