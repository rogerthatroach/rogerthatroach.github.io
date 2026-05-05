/**
 * Dashboard — pure functions that derive KPIs + chart-data from seed.
 *
 * No React. No state. Same inputs → same outputs. Filters and what-if
 * scenarios are passed in as plain objects; the components render the
 * results.
 */

import type {
  AuditEvent,
  Submission,
  SubmissionStatus,
} from '@/data/themis/types';
import { submissionAmount } from './filters';

// ── Filter shape ────────────────────────────────────────────────────

export type TimeRangeKey = '7d' | '30d' | '90d' | '1y' | 'all';

export const TIME_RANGE_LABEL: Record<TimeRangeKey, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '1y': 'Last year',
  all: 'All time',
};

export const TIME_RANGE_DAYS: Record<TimeRangeKey, number | null> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
  all: null,
};

export interface DashboardFilters {
  timeRange: TimeRangeKey;
  businessUnits: string[];
  kinds: string[];
  severities: string[];
  submitterIds: string[];
}

export const EMPTY_DASHBOARD_FILTERS: DashboardFilters = {
  timeRange: '90d',
  businessUnits: [],
  kinds: [],
  severities: [],
  submitterIds: [],
};

// ── What-if scenario shape ──────────────────────────────────────────

export interface ScenarioOverrides {
  /** Threshold above which submissions auto-route to senior approval (USD). */
  approvalThreshold: number;
  /** % budget reserve cushion: shaves N% off "approved budget" KPI. */
  budgetReservePct: number;
  /** Velocity compression: pretend decisions came in N% faster. */
  velocityCompressionPct: number;
}

export const DEFAULT_SCENARIO: ScenarioOverrides = {
  approvalThreshold: 100_000_000, // $100M — effectively no extra escalation
  budgetReservePct: 0,
  velocityCompressionPct: 0,
};

// ── Helpers ─────────────────────────────────────────────────────────

export function applyDashboardFilters(
  submissions: Submission[],
  f: DashboardFilters,
  now: number = Date.now(),
): Submission[] {
  const days = TIME_RANGE_DAYS[f.timeRange];
  const cutoff = days === null ? 0 : now - days * 24 * 3600 * 1000;
  return submissions.filter((s) => {
    if (s.updatedAt < cutoff) return false;
    if (f.businessUnits.length) {
      const bu = s.fields.find((x) => x.key === 'business_unit')?.value;
      if (typeof bu !== 'string' || !f.businessUnits.includes(bu)) return false;
    }
    if (f.kinds.length && !f.kinds.includes(s.kind)) return false;
    if (f.severities.length) {
      const sev = s.fields.find((x) => x.key === 'severity')?.value;
      if (typeof sev !== 'string' || !f.severities.includes(sev)) return false;
    }
    if (f.submitterIds.length && !f.submitterIds.includes(s.submittedBy)) {
      return false;
    }
    return true;
  });
}

// ── KPIs ────────────────────────────────────────────────────────────

export interface DashboardKPIs {
  totalSubmissions: number;
  approvedCount: number;
  approvedBudget: number;          // sum of exposure for approved
  inFlightCount: number;
  inFlightCostAtRisk: number;
  approvalRate: number | null;     // 0..1, null if no terminal decisions
  avgDecisionMs: number | null;
  anomalyCount: number;
  rejectedCount: number;
}

const TERMINAL: SubmissionStatus[] = ['approved', 'rejected'];
const IN_FLIGHT: SubmissionStatus[] = ['pending', 'in_review', 'changes_requested'];

export function computeKPIs(
  submissions: Submission[],
  audit: AuditEvent[],
  scenario: ScenarioOverrides = DEFAULT_SCENARIO,
): DashboardKPIs {
  const total = submissions.length;
  const approved = submissions.filter((s) => s.status === 'approved');
  const rejected = submissions.filter((s) => s.status === 'rejected');
  const inFlight = submissions.filter((s) => IN_FLIGHT.includes(s.status));
  const terminal = approved.length + rejected.length;

  const approvedBudgetGross = approved.reduce(
    (sum, s) => sum + (submissionAmount(s) ?? 0),
    0,
  );
  // Apply scenario reserve
  const approvedBudget =
    approvedBudgetGross * (1 - scenario.budgetReservePct / 100);

  const inFlightCostAtRisk = inFlight.reduce(
    (sum, s) => sum + (submissionAmount(s) ?? 0),
    0,
  );

  const submittedAt = new Map<string, number>();
  const decidedAt = new Map<string, number>();
  for (const e of audit) {
    if (e.kind === 'submitted') submittedAt.set(e.submissionId, e.at);
    if (e.kind === 'approved' || e.kind === 'rejected')
      decidedAt.set(e.submissionId, e.at);
  }
  const ids = new Set(submissions.map((s) => s.id));
  const deltas: number[] = [];
  for (const [id, sub] of submittedAt) {
    if (!ids.has(id)) continue;
    const dec = decidedAt.get(id);
    if (dec) deltas.push(dec - sub);
  }
  const avgRaw =
    deltas.length === 0
      ? null
      : deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const avgDecisionMs =
    avgRaw === null
      ? null
      : avgRaw * (1 - scenario.velocityCompressionPct / 100);

  // Re-use anomaly hints from existing insights helper logic — count
  // submissions where there's *any* hint. Cheap approx: anomalies = high
  // priority + critical severity, OR repeated asks from same submitter
  // for same kind within 90d.
  const anomalyCount = submissions.filter((s) => {
    const sev = String(
      s.fields.find((f) => f.key === 'severity')?.value ?? '',
    );
    if (s.priority === 'high' && (sev === 'High' || sev === 'Critical'))
      return true;
    const cutoff = (s.updatedAt ?? Date.now()) - 90 * 24 * 3600 * 1000;
    const repeats = submissions.filter(
      (other) =>
        other.id !== s.id &&
        other.submittedBy === s.submittedBy &&
        other.kind === s.kind &&
        other.updatedAt >= cutoff,
    );
    return repeats.length >= 2;
  }).length;

  return {
    totalSubmissions: total,
    approvedCount: approved.length,
    approvedBudget,
    inFlightCount: inFlight.length,
    inFlightCostAtRisk,
    approvalRate: terminal === 0 ? null : approved.length / terminal,
    avgDecisionMs,
    anomalyCount,
    rejectedCount: rejected.length,
  };
}

// ── Chart data ──────────────────────────────────────────────────────

export interface StatusDistributionPoint {
  status: SubmissionStatus;
  count: number;
  fraction: number;
}

export function statusDistribution(
  submissions: Submission[],
): StatusDistributionPoint[] {
  const order: SubmissionStatus[] = [
    'pending',
    'in_review',
    'changes_requested',
    'approved',
    'rejected',
    'draft',
  ];
  const total = Math.max(submissions.length, 1);
  return order
    .map((status) => {
      const count = submissions.filter((s) => s.status === status).length;
      return { status, count, fraction: count / total };
    })
    .filter((p) => p.count > 0);
}

export interface TimelinePoint {
  bucketStart: number;
  bucketLabel: string;
  count: number;
  approvedCount: number;
}

/**
 * Bucket submissions by week or month depending on the time range.
 * Returns chronologically ordered points.
 */
export function approvalsTimeline(
  submissions: Submission[],
  range: TimeRangeKey,
  now: number = Date.now(),
): TimelinePoint[] {
  const days = TIME_RANGE_DAYS[range];
  const span =
    days === null
      ? Math.max(
          ...submissions.map((s) => now - s.createdAt),
          90 * 24 * 3600 * 1000,
        )
      : days * 24 * 3600 * 1000;
  // Bucket: day for ≤30d, week for 30–180d, month for >180d
  const dayMs = 24 * 3600 * 1000;
  const bucketDays = days !== null && days <= 30 ? 1 : days !== null && days <= 180 ? 7 : 30;
  const buckets = Math.max(1, Math.ceil(span / (bucketDays * dayMs)));
  const start = now - buckets * bucketDays * dayMs;

  const points: TimelinePoint[] = Array.from({ length: buckets }, (_, i) => {
    const bucketStart = start + i * bucketDays * dayMs;
    return {
      bucketStart,
      bucketLabel: formatBucketLabel(bucketStart, bucketDays),
      count: 0,
      approvedCount: 0,
    };
  });

  for (const s of submissions) {
    const idx = Math.floor((s.createdAt - start) / (bucketDays * dayMs));
    if (idx < 0 || idx >= buckets) continue;
    points[idx].count += 1;
    if (s.status === 'approved') points[idx].approvedCount += 1;
  }
  return points;
}

function formatBucketLabel(timestamp: number, bucketDays: number): string {
  const d = new Date(timestamp);
  if (bucketDays === 1) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (bucketDays <= 7) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export interface KindBreakdown {
  kind: string;
  count: number;
  approved: number;
  rejected: number;
  approvalRate: number | null;
  budget: number;
}

export function kindBreakdown(submissions: Submission[]): KindBreakdown[] {
  const by = new Map<string, KindBreakdown>();
  for (const s of submissions) {
    let row = by.get(s.kind);
    if (!row) {
      row = {
        kind: s.kind,
        count: 0,
        approved: 0,
        rejected: 0,
        approvalRate: null,
        budget: 0,
      };
      by.set(s.kind, row);
    }
    row.count += 1;
    if (s.status === 'approved') row.approved += 1;
    if (s.status === 'rejected') row.rejected += 1;
    row.budget += submissionAmount(s) ?? 0;
  }
  for (const row of by.values()) {
    const terminal = row.approved + row.rejected;
    row.approvalRate = terminal === 0 ? null : row.approved / terminal;
  }
  return Array.from(by.values()).sort((a, b) => b.count - a.count);
}

export interface PersonaActivityPoint {
  personaId: string;
  submitted: number;
  approved: number;
  inFlight: number;
}

export function personaActivity(submissions: Submission[]): PersonaActivityPoint[] {
  const by = new Map<string, PersonaActivityPoint>();
  for (const s of submissions) {
    let row = by.get(s.submittedBy);
    if (!row) {
      row = { personaId: s.submittedBy, submitted: 0, approved: 0, inFlight: 0 };
      by.set(s.submittedBy, row);
    }
    row.submitted += 1;
    if (s.status === 'approved') row.approved += 1;
    if (IN_FLIGHT.includes(s.status)) row.inFlight += 1;
  }
  return Array.from(by.values()).sort((a, b) => b.submitted - a.submitted);
}

export interface BusinessUnitSpend {
  businessUnit: string;
  approvedBudget: number;
  pendingBudget: number;
  count: number;
}

export function businessUnitSpend(
  submissions: Submission[],
): BusinessUnitSpend[] {
  const by = new Map<string, BusinessUnitSpend>();
  for (const s of submissions) {
    const bu = s.fields.find((f) => f.key === 'business_unit')?.value;
    if (typeof bu !== 'string') continue;
    let row = by.get(bu);
    if (!row) {
      row = { businessUnit: bu, approvedBudget: 0, pendingBudget: 0, count: 0 };
      by.set(bu, row);
    }
    row.count += 1;
    const amt = submissionAmount(s) ?? 0;
    if (s.status === 'approved') row.approvedBudget += amt;
    else if (IN_FLIGHT.includes(s.status)) row.pendingBudget += amt;
  }
  return Array.from(by.values())
    .sort((a, b) => b.approvedBudget + b.pendingBudget - (a.approvedBudget + a.pendingBudget))
    .slice(0, 8);
}

// ── Formatting helpers ──────────────────────────────────────────────

export function formatCurrency(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  if (n === 0) return '$0';
  return `$${n.toFixed(0)}`;
}

export function formatPercent(p: number | null): string {
  if (p === null) return '—';
  return `${Math.round(p * 100)}%`;
}

export function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  const min = ms / 60000;
  const hr = min / 60;
  const day = hr / 24;
  if (day >= 2) return `${day.toFixed(1)}d`;
  if (hr >= 2) return `${hr.toFixed(1)}h`;
  if (min >= 2) return `${Math.round(min)}m`;
  return `${Math.round(ms / 1000)}s`;
}
