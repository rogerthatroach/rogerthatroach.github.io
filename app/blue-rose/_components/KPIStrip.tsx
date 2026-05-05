'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import KPITile from './KPITile';
import {
  formatCurrency,
  formatDuration,
  formatPercent,
  type DashboardKPIs,
} from '../_lib/dashboard';

interface KPIStripProps {
  kpis: DashboardKPIs;
}

export default function KPIStrip({ kpis }: KPIStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <KPITile
        icon={CheckCircle2}
        label="Approved"
        value={kpis.approvedCount}
        hint="Decisions in range"
        accent="var(--themis-approved)"
      />
      <KPITile
        icon={DollarSign}
        label="Approved budget"
        value={formatCurrency(kpis.approvedBudget)}
        hint="Cumulative committed"
      />
      <KPITile
        icon={Activity}
        label="In flight"
        value={kpis.inFlightCount}
        hint={`${formatCurrency(kpis.inFlightCostAtRisk)} at risk`}
        accent="var(--themis-in-review)"
      />
      <KPITile
        icon={TrendingUp}
        label="Approval rate"
        value={formatPercent(kpis.approvalRate)}
        hint="Of terminal decisions"
      />
      <KPITile
        icon={Clock}
        label="Decision velocity"
        value={formatDuration(kpis.avgDecisionMs)}
        hint="Avg submitted → decided"
      />
      <KPITile
        icon={AlertTriangle}
        label="Anomalies"
        value={kpis.anomalyCount}
        hint="Pattern + urgency hints"
        accent={
          kpis.anomalyCount > 0 ? 'var(--themis-needs-info)' : undefined
        }
      />
    </div>
  );
}
