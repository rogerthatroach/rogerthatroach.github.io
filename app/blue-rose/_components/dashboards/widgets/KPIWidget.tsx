'use client';

import {
  formatCurrency,
  formatDuration,
  formatPercent,
} from '../../../_lib/dashboard';
import { KPI_METRIC_OPTIONS, type KPIMetric } from '../../../_lib/dashboard-grid';
import type { WidgetProps } from './widget-shared';

export default function KPIWidget({ widget, kpis }: WidgetProps) {
  if (widget.config.kind !== 'kpi') return null;
  const metric = widget.config.metric;
  const meta = KPI_METRIC_OPTIONS.find((m) => m.metric === metric);
  const display = formatMetric(metric, kpis[metric]);
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        {meta?.label ?? metric}
      </p>
      <p className="font-display text-[32px] font-medium leading-none text-text-primary">
        {display}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        {meta?.hint ?? ''}
      </p>
    </div>
  );
}

function formatMetric(metric: KPIMetric, value: number | null): string {
  if (value === null || value === undefined) return '—';
  switch (metric) {
    case 'approvedBudget':
    case 'inFlightCostAtRisk':
      return formatCurrency(value);
    case 'approvalRate':
      return formatPercent(value as number);
    case 'avgDecisionMs':
      return formatDuration(value as number);
    default:
      return String(value);
  }
}
