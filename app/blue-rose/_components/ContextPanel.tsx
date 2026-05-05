'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Eye,
  FileText,
  History,
  Paperclip,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { Attachment } from '@/data/themis/types';
import { useThemis, usePersonaMap } from '../_lib/store';
import {
  anomalyHints,
  approvalRateForKind,
  avgDecisionMs,
  formatDuration,
  riskBand,
  similarSubmissions,
  watchersFor,
  type RiskBand,
} from '../_lib/insights';
import StatusPill from './StatusPill';
import FloatingAvatar from './FloatingAvatar';
import { AttachmentChip, AttachmentPreviewModal } from './AttachmentPreview';
import { relativeTime } from '../_lib/format';
import { cn } from '@/lib/utils';

const RISK_LABEL: Record<RiskBand, { label: string; color: string }> = {
  low: { label: 'Low', color: 'var(--themis-pending)' },
  medium: { label: 'Medium', color: 'var(--themis-in-review)' },
  high: { label: 'High', color: 'var(--themis-needs-info)' },
  critical: { label: 'Critical', color: 'var(--themis-rejected)' },
};

/**
 * ContextPanel — right pane.
 *
 * Sections (each collapsible):
 *   1. Submitted content (form fields)
 *   2. Attachments (chip list → modal preview)
 *   3. Insights (risk band, decision velocity, approval rate, anomaly hints)
 *   4. Historical precedence (similar submissions list)
 *   5. Audit trail (timestamped event log)
 *   6. Watchers (assignees + observers)
 */
export default function ContextPanel() {
  const { seed, selectedSubmissionId } = useThemis();
  const personaMap = usePersonaMap();
  const [previewOf, setPreviewOf] = useState<Attachment | null>(null);

  const submission = useMemo(
    () => seed.submissions.find((s) => s.id === selectedSubmissionId) ?? null,
    [seed.submissions, selectedSubmissionId],
  );

  const attachments = useMemo(() => {
    if (!submission) return [];
    return submission.attachmentIds
      .map((id) => seed.attachments.find((a) => a.id === id))
      .filter(Boolean) as Attachment[];
  }, [submission, seed.attachments]);

  const audit = useMemo(() => {
    if (!submission) return [];
    return seed.audit
      .filter((e) => e.submissionId === submission.id)
      .sort((a, b) => b.at - a.at);
  }, [submission, seed.audit]);

  const insights = useMemo(() => {
    if (!submission) return null;
    return {
      band: riskBand(submission),
      avgMs: avgDecisionMs(submission, seed.audit, seed.submissions),
      approvalRate: approvalRateForKind(submission, seed.submissions),
      anomalies: anomalyHints(submission, seed.submissions),
    };
  }, [submission, seed.audit, seed.submissions]);

  const similar = useMemo(
    () => (submission ? similarSubmissions(submission, seed.submissions, 4) : []),
    [submission, seed.submissions],
  );

  const observerIds = useMemo(
    () => seed.personas.filter((p) => p.role === 'observer').map((p) => p.id),
    [seed.personas],
  );
  const watcherIds = useMemo(
    () => (submission ? watchersFor(submission, observerIds) : []),
    [submission, observerIds],
  );

  if (!submission) {
    return (
      <aside className="hidden h-full flex-col items-center justify-center gap-3 px-6 text-center xl:flex">
        <Sparkles size={20} className="text-text-tertiary" aria-hidden="true" />
        <p className="text-[12px] text-text-tertiary">
          Open a submission to see content, attachments, audit trail, and insights here.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden">
      <header className="border-b border-border-subtle px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">Context</p>
        <h3 className="mt-0.5 truncate font-display text-[14px] font-medium text-text-primary">
          {submission.title}
        </h3>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* Submitted content */}
        <Section icon={FileText} label="Submitted content" count={submission.fields.length}>
          <dl className="space-y-2.5">
            {submission.fields.map((f) => (
              <div key={f.key} className="rounded-lg border border-border-subtle/70 bg-surface/40 px-2.5 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  {f.label}
                </dt>
                <dd className="mt-0.5 whitespace-pre-wrap break-words text-[12.5px] leading-snug text-text-primary">
                  {String(f.value) || (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                      empty
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Attachments */}
        <Section icon={Paperclip} label="Attachments" count={attachments.length}>
          {attachments.length === 0 ? (
            <p className="px-1 py-1 text-[11.5px] text-text-tertiary">No attachments.</p>
          ) : (
            <ul className="space-y-1.5">
              {attachments.map((a) => (
                <li key={a.id}>
                  <AttachmentChip attachment={a} onPreview={() => setPreviewOf(a)} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Insights */}
        {insights && (
          <Section icon={TrendingUp} label="Insights">
            <div className="grid grid-cols-2 gap-2">
              <Stat
                label="Risk band"
                value={RISK_LABEL[insights.band].label}
                accent={RISK_LABEL[insights.band].color}
              />
              <Stat
                label="Approval rate · this kind"
                value={
                  insights.approvalRate === null
                    ? '—'
                    : `${Math.round(insights.approvalRate * 100)}%`
                }
              />
              <Stat
                label="Avg decision time"
                value={insights.avgMs === null ? '—' : formatDuration(insights.avgMs)}
              />
              <Stat label="Priority" value={submission.priority} mono />
            </div>
            {insights.anomalies.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {insights.anomalies.map((hint, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-[var(--themis-needs-info)]/30 bg-[var(--themis-needs-info-bg)] px-2.5 py-1.5"
                  >
                    <AlertTriangle
                      size={11}
                      className="mt-0.5 shrink-0"
                      style={{ color: 'var(--themis-needs-info)' }}
                      aria-hidden="true"
                    />
                    <span className="text-[11.5px] leading-snug text-text-primary">{hint}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {/* Historical precedence */}
        <Section icon={History} label="Historical precedence" count={similar.length}>
          {similar.length === 0 ? (
            <p className="px-1 py-1 text-[11.5px] text-text-tertiary">
              No prior {submission.kind.replace(/-/g, ' ')} submissions in the seed.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {similar.map((s) => {
                const submitter = personaMap.get(s.submittedBy);
                return (
                  <li
                    key={s.id}
                    className="flex items-start gap-2 rounded-lg border border-border-subtle/70 bg-surface/40 px-2.5 py-2"
                  >
                    <FloatingAvatar
                      seed={submitter?.avatarSeed ?? s.id}
                      size={22}
                      ringColor={submitter?.accentHex}
                      static
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-1.5">
                        <StatusPill status={s.status} />
                        <span className="ml-auto font-mono text-[10px] tracking-wider text-text-tertiary">
                          {relativeTime(s.updatedAt)}
                        </span>
                      </div>
                      <p className="truncate text-[12px] leading-snug text-text-primary">{s.title}</p>
                    </div>
                    <ChevronRight
                      size={12}
                      className="mt-1 shrink-0 text-text-tertiary"
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Audit trail */}
        <Section icon={Activity} label="Audit trail" count={audit.length}>
          {audit.length === 0 ? (
            <p className="px-1 py-1 text-[11.5px] text-text-tertiary">No events recorded.</p>
          ) : (
            <ol className="relative space-y-2.5 pl-4">
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-1.5 h-[calc(100%-12px)] w-px bg-border-subtle"
              />
              {audit.map((e) => {
                const actor = personaMap.get(e.actorPersonaId);
                return (
                  <li key={e.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-bg)]"
                      style={{ background: auditKindColor(e.kind) }}
                    />
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11.5px] font-medium text-text-primary">
                        {actor?.displayName ?? 'Unknown'}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                        {e.kind.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
                      {relativeTime(e.at)}
                      {e.before != null && e.after != null ? (
                        <>
                          {' · '}
                          <span className="text-text-secondary">
                            {String(e.before)} → {String(e.after)}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </Section>

        {/* Watchers */}
        <Section icon={Eye} label="Watchers" count={watcherIds.length}>
          <ul className="flex flex-wrap gap-1.5">
            {watcherIds.map((id) => {
              const p = personaMap.get(id);
              if (!p) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/60 py-0.5 pl-0.5 pr-2"
                >
                  <FloatingAvatar
                    seed={p.avatarSeed}
                    size={18}
                    ringColor={p.accentHex}
                    static
                  />
                  <span className="text-[11px] text-text-primary">{p.displayName}</span>
                </li>
              );
            })}
          </ul>
        </Section>
      </div>

      <AttachmentPreviewModal attachment={previewOf} onClose={() => setPreviewOf(null)} />
    </aside>
  );
}

function Section({
  icon: Icon,
  label,
  count,
  children,
}: {
  icon: typeof FileText;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-1 py-1 text-text-secondary transition-colors hover:text-text-primary"
      >
        <Icon size={12} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
        {typeof count === 'number' && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
            {count}
          </span>
        )}
        <ChevronRight
          size={12}
          aria-hidden="true"
          className={cn('ml-auto transition-transform', open && 'rotate-90')}
        />
      </button>
      {open && <div className="mt-1.5">{children}</div>}
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border-subtle/70 bg-surface/40 px-2.5 py-2">
      <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">{label}</p>
      <p
        className={cn('mt-0.5 text-[14px] font-medium leading-tight', mono && 'font-mono text-[12px]')}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function auditKindColor(kind: string): string {
  if (kind === 'approved') return 'var(--themis-approved)';
  if (kind === 'rejected') return 'var(--themis-rejected)';
  if (kind === 'changes_requested') return 'var(--themis-needs-info)';
  if (kind === 'submitted') return 'var(--themis-pending)';
  return 'var(--themis-secondary)';
}
