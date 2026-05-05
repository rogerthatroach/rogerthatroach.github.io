'use client';

import type { KindBreakdown } from '../../_lib/dashboard';
import { formatCurrency, formatPercent } from '../../_lib/dashboard';

interface KindBarsProps {
  data: KindBreakdown[];
}

const kindLabel = (k: string) =>
  k.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * KindBars — horizontal bar chart of submissions by kind.
 *
 * Each bar is two-tone: approved share fills from left in sage green,
 * rejected share fills from the right in muted rose, the middle (still
 * in flight) renders in neutral pending color. Trailing label shows
 * count, approval rate, and total budget for that kind.
 */
export default function KindBars({ data }: KindBarsProps) {
  const max = Math.max(1, ...data.map((d) => d.count));

  if (data.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        No submissions to break down.
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {data.map((row) => {
        const widthPct = (row.count / max) * 100;
        const approvedPct = (row.approved / row.count) * widthPct;
        const rejectedPct = (row.rejected / row.count) * widthPct;
        return (
          <li key={row.kind}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] text-text-primary">
                {kindLabel(row.kind)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {row.count} · {formatPercent(row.approvalRate)} approved ·{' '}
                {formatCurrency(row.budget)}
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-hover/60">
              {/* Total bar (in-flight + decided) */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full"
                style={{
                  width: `${widthPct}%`,
                  background: 'var(--themis-pending)',
                  opacity: 0.35,
                }}
              />
              {/* Approved (from left) */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full"
                style={{
                  width: `${approvedPct}%`,
                  background: 'var(--themis-approved)',
                }}
              />
              {/* Rejected (from right of the total bar) */}
              <span
                aria-hidden="true"
                className="absolute top-0 h-full"
                style={{
                  width: `${rejectedPct}%`,
                  left: `${widthPct - rejectedPct}%`,
                  background: 'var(--themis-rejected)',
                  opacity: 0.85,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
