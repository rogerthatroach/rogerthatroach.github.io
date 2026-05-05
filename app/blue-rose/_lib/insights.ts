/**
 * Insights — derived signals from the seed for the Context pane.
 *
 * Pure functions over Submission/Message/AuditEvent arrays. None of this
 * is ML — it's the kind of contextual surfacing that an approver would
 * want at a glance: "is this normal?", "who's seen this before?",
 * "how long does this kind usually take?".
 */

import type { AuditEvent, Submission } from '@/data/themis/types';

export type RiskBand = 'low' | 'medium' | 'high' | 'critical';

const SEVERITY_TO_BAND: Record<string, RiskBand> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
};

const PRIORITY_BUMP: Record<Submission['priority'], number> = {
  low: 0,
  normal: 0,
  high: 1,
};

const BAND_ORDER: RiskBand[] = ['low', 'medium', 'high', 'critical'];

/**
 * Map severity field + priority into a single risk band. Severity dominates;
 * high priority bumps one tier (capped at 'critical').
 */
export function riskBand(submission: Submission): RiskBand {
  const sevField = submission.fields.find((f) => f.key === 'severity');
  const sev = String(sevField?.value ?? 'Medium');
  const base = SEVERITY_TO_BAND[sev] ?? 'medium';
  const bump = PRIORITY_BUMP[submission.priority] ?? 0;
  const idx = Math.min(BAND_ORDER.indexOf(base) + bump, BAND_ORDER.length - 1);
  return BAND_ORDER[idx];
}

/** Past submissions with the same kind, newest first, excluding the current. */
export function similarSubmissions(
  current: Submission,
  all: Submission[],
  limit = 5,
): Submission[] {
  return all
    .filter((s) => s.id !== current.id && s.kind === current.kind)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
}

/**
 * Approval rate among *terminal* (approved or rejected) submissions of the
 * same kind. Returns null if there's no terminal history yet.
 */
export function approvalRateForKind(current: Submission, all: Submission[]): number | null {
  const terminal = all.filter(
    (s) => s.kind === current.kind && (s.status === 'approved' || s.status === 'rejected'),
  );
  if (terminal.length === 0) return null;
  const approved = terminal.filter((s) => s.status === 'approved').length;
  return approved / terminal.length;
}

/**
 * Average wall-clock time from submission to terminal decision for this
 * submission's kind, in milliseconds. Returns null if no decisions exist.
 */
export function avgDecisionMs(current: Submission, audit: AuditEvent[], all: Submission[]): number | null {
  const sameKindIds = new Set(all.filter((s) => s.kind === current.kind).map((s) => s.id));
  const submittedAt = new Map<string, number>();
  const decidedAt = new Map<string, number>();
  for (const e of audit) {
    if (!sameKindIds.has(e.submissionId)) continue;
    if (e.kind === 'submitted') submittedAt.set(e.submissionId, e.at);
    if (e.kind === 'approved' || e.kind === 'rejected') decidedAt.set(e.submissionId, e.at);
  }
  const deltas: number[] = [];
  for (const [id, sub] of submittedAt) {
    const dec = decidedAt.get(id);
    if (dec) deltas.push(dec - sub);
  }
  if (deltas.length === 0) return null;
  return deltas.reduce((a, b) => a + b, 0) / deltas.length;
}

export function formatDuration(ms: number): string {
  const sec = Math.round(ms / 1000);
  const min = Math.round(sec / 60);
  const hr = min / 60;
  const day = hr / 24;
  if (day >= 2) return `${day.toFixed(1)} days`;
  if (hr >= 2) return `${hr.toFixed(1)} hours`;
  if (min >= 2) return `${min} min`;
  return `${sec}s`;
}

/**
 * Watchers = assignees + the submitter, deduped, plus any observer-role
 * personas in the seed (they implicitly watch everything by role).
 */
export function watchersFor(current: Submission, observerIds: string[]): string[] {
  const set = new Set<string>([current.submittedBy, ...current.assignees, ...observerIds]);
  return Array.from(set);
}

/**
 * Anomaly hints — heuristic flags surfaced to the approver. Not
 * exhaustive; meant to seed the "this prototype thinks for me" feel of
 * the demo. Returns 0..N short strings.
 */
export function anomalyHints(current: Submission, all: Submission[]): string[] {
  const out: string[] = [];

  // Repeated asks from the same submitter in the last 90 days, same kind.
  const ninetyDaysMs = 90 * 24 * 3600 * 1000;
  const cutoff = (current.updatedAt ?? Date.now()) - ninetyDaysMs;
  const repeats = all.filter(
    (s) =>
      s.id !== current.id &&
      s.submittedBy === current.submittedBy &&
      s.kind === current.kind &&
      s.updatedAt >= cutoff,
  );
  if (repeats.length >= 2) {
    out.push(
      `${repeats.length}+ ${current.kind.replace(/-/g, ' ')} asks from this submitter in the last 90 days — pattern, not one-off`,
    );
  }

  // Approval rate is unusually low for this kind.
  const rate = approvalRateForKind(current, all);
  if (rate !== null && rate < 0.5) {
    out.push(`Approval rate for this kind: ${Math.round(rate * 100)}% — most are rejected`);
  }

  // High priority + 'high' severity → flag urgency
  const sev = String(current.fields.find((f) => f.key === 'severity')?.value ?? '');
  if (current.priority === 'high' && (sev === 'High' || sev === 'Critical')) {
    out.push(`High priority + ${sev.toLowerCase()} severity — review window typically tight`);
  }

  return out;
}
