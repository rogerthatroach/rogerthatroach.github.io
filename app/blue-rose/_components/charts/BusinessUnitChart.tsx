'use client';

import type { BusinessUnitSpend } from '../../_lib/dashboard';
import { formatCurrency } from '../../_lib/dashboard';

interface BusinessUnitChartProps {
  data: BusinessUnitSpend[];
}

/**
 * BusinessUnitChart — paired horizontal bars per business unit:
 * approved budget on top (sage), pending budget below (amber).
 *
 * "Planned vs actual" within the seed's vocabulary — pending = "planned",
 * approved = "committed actual".
 */
export default function BusinessUnitChart({ data }: BusinessUnitChartProps) {
  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.approvedBudget, d.pendingBudget)),
  );

  if (data.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        No business unit data.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((row) => {
        const apprPct = (row.approvedBudget / max) * 100;
        const pendPct = (row.pendingBudget / max) * 100;
        return (
          <li key={row.businessUnit}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="truncate text-[12px] text-text-primary">
                {row.businessUnit}
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {row.count} req
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  appr
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-hover/60">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full"
                    style={{
                      width: `${apprPct}%`,
                      background: 'var(--themis-approved)',
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[10px] tracking-wider text-text-secondary">
                  {formatCurrency(row.approvedBudget)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                  pend
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-hover/60">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full"
                    style={{
                      width: `${pendPct}%`,
                      background: 'var(--themis-in-review)',
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[10px] tracking-wider text-text-secondary">
                  {formatCurrency(row.pendingBudget)}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
