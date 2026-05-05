/**
 * Queue filters — pure functions over Submission arrays.
 *
 * Filter shape lives here; UI components own state via the store.
 *
 * Conventions:
 *   - Multi-select arrays: empty = "no constraint"; non-empty = OR within
 *     the dimension, AND across dimensions.
 *   - Booleans: true = "only show those that match"; false = "no constraint"
 *     (we don't currently expose a "hide those" inverse).
 *   - Amount: parsed from any field value matching a $-prefix pattern;
 *     submissions without a parseable amount fail any active amount filter.
 *   - Search: case-insensitive substring match across title, kind, tags,
 *     and all field labels + values.
 */

import type { Submission, SubmissionStatus } from '@/data/themis/types';

export type AmountBand = 'lt-1m' | '1m-10m' | '10m-100m' | 'gt-100m';

export const AMOUNT_BANDS: AmountBand[] = ['lt-1m', '1m-10m', '10m-100m', 'gt-100m'];

export const AMOUNT_BAND_LABEL: Record<AmountBand, string> = {
  'lt-1m': 'Under $1M',
  '1m-10m': '$1M – $10M',
  '10m-100m': '$10M – $100M',
  'gt-100m': 'Over $100M',
};

/**
 * Parse a dollar amount from any value. Recognizes "$14,200,000",
 * "$2.1B", "$420M", "USD 1.5M". Returns the value in USD-equivalent
 * dollars, or null if no amount is present.
 */
export function parseAmount(value: unknown): number | null {
  if (value == null) return null;
  const str = String(value);
  const match = str.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*([KMBT])?/i);
  if (!match) return null;
  const numStr = match[1].replace(/,/g, '');
  let num = parseFloat(numStr);
  if (!isFinite(num) || num === 0) return null;
  const unit = match[2]?.toUpperCase();
  if (unit === 'K') num *= 1e3;
  else if (unit === 'M') num *= 1e6;
  else if (unit === 'B') num *= 1e9;
  else if (unit === 'T') num *= 1e12;
  return num;
}

/**
 * Try to extract the primary amount associated with a submission. Walks
 * common keys first (`exposure`, `notional`, `amount`, etc.) and falls
 * back to scanning every field for a $-prefixed value. Returns null if
 * nothing parseable is found.
 */
export function submissionAmount(s: Submission): number | null {
  const COMMON = ['exposure', 'notional', 'amount', 'requested_limit', 'value', 'budget'];
  for (const key of COMMON) {
    const f = s.fields.find(
      (f) => f.key === key || f.key.toLowerCase().replace(/[\s_]/g, '').includes(key.replace(/_/g, '')),
    );
    if (f) {
      const n = parseAmount(f.value);
      if (n !== null) return n;
    }
  }
  for (const f of s.fields) {
    const v = String(f.value ?? '');
    if (v.includes('$')) {
      const n = parseAmount(f.value);
      if (n !== null) return n;
    }
  }
  return null;
}

export function amountBand(amount: number): AmountBand {
  if (amount < 1e6) return 'lt-1m';
  if (amount < 1e7) return '1m-10m';
  if (amount < 1e8) return '10m-100m';
  return 'gt-100m';
}

export function getFieldString(s: Submission, key: string): string | null {
  const f = s.fields.find((f) => f.key === key);
  return f && f.value !== '' && f.value != null ? String(f.value) : null;
}

export function getBusinessUnit(s: Submission): string | null {
  return getFieldString(s, 'business_unit');
}

export function getSeverity(s: Submission): string | null {
  return getFieldString(s, 'severity');
}

export interface QueueFilters {
  search: string;
  statuses: SubmissionStatus[];
  submitterIds: string[];
  businessUnits: string[];
  severities: string[];
  kinds: string[];
  amountBands: AmountBand[];
  hasAttachments: boolean;
  unreadOnly: boolean;
}

export const EMPTY_FILTERS: QueueFilters = {
  search: '',
  statuses: [],
  submitterIds: [],
  businessUnits: [],
  severities: [],
  kinds: [],
  amountBands: [],
  hasAttachments: false,
  unreadOnly: false,
};

export function activeFilterCount(f: QueueFilters): number {
  return (
    (f.search.trim() ? 1 : 0) +
    f.statuses.length +
    f.submitterIds.length +
    f.businessUnits.length +
    f.severities.length +
    f.kinds.length +
    f.amountBands.length +
    (f.hasAttachments ? 1 : 0) +
    (f.unreadOnly ? 1 : 0)
  );
}

export interface FilterContext {
  /** Map of threadId → unread count for the current persona. */
  unreadByThread: Map<string, number>;
}

export function applyFilters(
  submissions: Submission[],
  filters: QueueFilters,
  ctx: FilterContext,
): Submission[] {
  const search = filters.search.trim().toLowerCase();
  return submissions.filter((s) => {
    if (filters.statuses.length && !filters.statuses.includes(s.status)) return false;
    if (filters.submitterIds.length && !filters.submitterIds.includes(s.submittedBy)) return false;
    if (filters.kinds.length && !filters.kinds.includes(s.kind)) return false;
    if (filters.severities.length) {
      const sev = getSeverity(s);
      if (!sev || !filters.severities.includes(sev)) return false;
    }
    if (filters.businessUnits.length) {
      const bu = getBusinessUnit(s);
      if (!bu || !filters.businessUnits.includes(bu)) return false;
    }
    if (filters.amountBands.length) {
      const amt = submissionAmount(s);
      if (amt === null) return false;
      if (!filters.amountBands.includes(amountBand(amt))) return false;
    }
    if (filters.hasAttachments && s.attachmentIds.length === 0) return false;
    if (filters.unreadOnly) {
      const unread = ctx.unreadByThread.get(s.threadId) ?? 0;
      if (unread === 0) return false;
    }
    if (search) {
      const haystack = [
        s.title,
        s.kind,
        ...s.tags,
        ...s.fields.map((f) => `${f.label} ${f.value ?? ''}`),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export interface FilterDimensions {
  statuses: { id: SubmissionStatus; count: number }[];
  submitters: { id: string; count: number }[];
  businessUnits: { value: string; count: number }[];
  severities: { value: string; count: number }[];
  kinds: { value: string; count: number }[];
  amountBands: { id: AmountBand; count: number }[];
}

const STATUS_ORDER: SubmissionStatus[] = [
  'pending',
  'in_review',
  'changes_requested',
  'approved',
  'rejected',
  'draft',
];
const SEVERITY_ORDER = ['Low', 'Medium', 'High', 'Critical'];

export function computeDimensions(submissions: Submission[]): FilterDimensions {
  const statuses = new Map<SubmissionStatus, number>();
  const submitters = new Map<string, number>();
  const businessUnits = new Map<string, number>();
  const severities = new Map<string, number>();
  const kinds = new Map<string, number>();
  const bands = new Map<AmountBand, number>();
  for (const s of submissions) {
    statuses.set(s.status, (statuses.get(s.status) ?? 0) + 1);
    submitters.set(s.submittedBy, (submitters.get(s.submittedBy) ?? 0) + 1);
    kinds.set(s.kind, (kinds.get(s.kind) ?? 0) + 1);
    const bu = getBusinessUnit(s);
    if (bu) businessUnits.set(bu, (businessUnits.get(bu) ?? 0) + 1);
    const sev = getSeverity(s);
    if (sev) severities.set(sev, (severities.get(sev) ?? 0) + 1);
    const amt = submissionAmount(s);
    if (amt !== null) {
      const b = amountBand(amt);
      bands.set(b, (bands.get(b) ?? 0) + 1);
    }
  }
  return {
    statuses: STATUS_ORDER.filter((id) => statuses.has(id)).map((id) => ({
      id,
      count: statuses.get(id)!,
    })),
    submitters: Array.from(submitters, ([id, count]) => ({ id, count })).sort(
      (a, b) => b.count - a.count,
    ),
    businessUnits: Array.from(businessUnits, ([value, count]) => ({ value, count })).sort(
      (a, b) => b.count - a.count,
    ),
    severities: SEVERITY_ORDER.filter((value) => severities.has(value)).map((value) => ({
      value,
      count: severities.get(value)!,
    })),
    kinds: Array.from(kinds, ([value, count]) => ({ value, count })).sort(
      (a, b) => b.count - a.count,
    ),
    amountBands: AMOUNT_BANDS.filter((id) => bands.has(id)).map((id) => ({
      id,
      count: bands.get(id)!,
    })),
  };
}

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  in_review: 'In review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function statusLabel(s: SubmissionStatus): string {
  return STATUS_LABEL[s];
}

export function kindLabel(k: string): string {
  return k.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
