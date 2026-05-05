'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemis } from '../_lib/store';
import {
  applyDashboardFilters,
  approvalsTimeline,
  businessUnitSpend,
  computeKPIs,
  DEFAULT_SCENARIO,
  EMPTY_DASHBOARD_FILTERS,
  kindBreakdown,
  personaActivity,
  statusDistribution,
  type DashboardFilters,
  type ScenarioOverrides,
} from '../_lib/dashboard';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import InsightsHeader from './InsightsHeader';
import KPIStrip from './KPIStrip';
import WhatIfPanel from './WhatIfPanel';
import DianeChat from './DianeChat';
import StatusDonut from './charts/StatusDonut';
import ApprovalsTimelineChart from './charts/ApprovalsTimelineChart';
import KindBars from './charts/KindBars';
import PersonaActivityChart from './charts/PersonaActivityChart';
import BusinessUnitChart from './charts/BusinessUnitChart';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

type FocusKey =
  | 'donut'
  | 'timeline'
  | 'kindBars'
  | 'businessUnit'
  | 'personaActivity'
  | 'whatIf'
  | undefined;

/**
 * InsightsDashboard — pre-built holistic view at /blue-rose/insights.
 *
 *   ┌─ filters bar ─────────────────────────────────────┐
 *   │ Range chips · BU · Type · Severity · Submitter    │
 *   ├─ KPI strip (6 tiles) ─────────────────────────────┤
 *   │ Approved · Budget · In flight · Rate · Velocity ·│
 *   │ Anomalies                                         │
 *   ├─ what-if panel (collapsible) ─────────────────────┤
 *   ├─ charts grid ─────────────────────┬─ Diane chat ─┤
 *   │ Timeline                          │              │
 *   │ Volume by type | Status donut     │   chat with  │
 *   │ Persona activity | Business unit  │   Diane      │
 *   └────────────────────────────────────┴──────────────┘
 *
 * Filters apply to every chart + KPI + Diane's answers via the
 * `filtered` derivation. What-if scenario overrides re-flow the KPIs +
 * what-if panel (charts are based on baseline data, not the scenario,
 * so the comparison stays clear).
 */
export default function InsightsDashboard() {
  const { seed } = useThemis();
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_DASHBOARD_FILTERS);
  const [scenario, setScenario] = useState<ScenarioOverrides>(DEFAULT_SCENARIO);
  const [focus, setFocus] = useState<FocusKey>(undefined);

  // Apply filters once — every chart + KPI reads from this.
  const filtered = useMemo(
    () => applyDashboardFilters(seed.submissions, filters),
    [seed.submissions, filters],
  );

  // KPIs — both baseline (no scenario) and scenario-applied.
  const baselineKPIs = useMemo(
    () => computeKPIs(filtered, seed.audit, DEFAULT_SCENARIO),
    [filtered, seed.audit],
  );
  const scenarioKPIs = useMemo(
    () => computeKPIs(filtered, seed.audit, scenario),
    [filtered, seed.audit, scenario],
  );

  const status = useMemo(() => statusDistribution(filtered), [filtered]);
  const timeline = useMemo(
    () => approvalsTimeline(filtered, filters.timeRange),
    [filtered, filters.timeRange],
  );
  const kinds = useMemo(() => kindBreakdown(filtered), [filtered]);
  const personas = useMemo(() => personaActivity(filtered), [filtered]);
  const bus = useMemo(() => businessUnitSpend(filtered), [filtered]);

  // Focus a chart for ~2.4s when Diane references it
  const onFocus = (next: FocusKey) => {
    setFocus(next);
    if (next) setTimeout(() => setFocus(undefined), 2400);
  };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"
      >
        {/* Page title */}
        <motion.div variants={fadeUp} className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Insights
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
              What&rsquo;s already moved
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Track approved spend, decision velocity, anomalies, and what-if
              scenarios across initiatives.
            </p>
          </div>
          <Link
            href="/blue-rose/insights/custom"
            className="hidden shrink-0 items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary md:inline-flex"
          >
            <span>Build your own</span>
            <ArrowUpRight size={11} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Filter chips */}
        <motion.div variants={fadeUp} className="mb-5">
          <InsightsHeader filters={filters} setFilters={setFilters} />
        </motion.div>

        {/* KPI strip — uses scenario-applied numbers */}
        <motion.div variants={fadeUp} className="mb-5">
          <KPIStrip kpis={scenarioKPIs} />
        </motion.div>

        {/* What-if panel */}
        <motion.div variants={fadeUp} className="mb-6">
          <WhatIfPanel
            scenario={scenario}
            baseline={DEFAULT_SCENARIO}
            setScenario={setScenario}
            baselineKPIs={baselineKPIs}
            scenarioKPIs={scenarioKPIs}
          />
        </motion.div>

        {/* Charts grid + Diane chat */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
          {/* Charts column */}
          <motion.div variants={fadeUp} className="space-y-5">
            <ChartCard
              title="Approvals over time"
              subtitle="Submitted vs approved per bucket"
              focused={focus === 'timeline'}
            >
              <ApprovalsTimelineChart data={timeline} />
            </ChartCard>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard
                title="Volume by type"
                subtitle="Approved share fills from left"
                focused={focus === 'kindBars'}
              >
                <KindBars data={kinds} />
              </ChartCard>
              <ChartCard
                title="Status"
                subtitle="Breakdown across the queue"
                focused={focus === 'donut'}
              >
                <StatusDonut data={status} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard
                title="By business unit"
                subtitle="Approved (committed) vs pending"
                focused={focus === 'businessUnit'}
              >
                <BusinessUnitChart data={bus} />
              </ChartCard>
              <ChartCard
                title="Per-persona activity"
                subtitle="Submitted, approved, in-flight"
                focused={focus === 'personaActivity'}
              >
                <PersonaActivityChart data={personas} />
              </ChartCard>
            </div>
          </motion.div>

          {/* Diane chat column */}
          <motion.aside
            variants={fadeUp}
            className="xl:sticky xl:top-4 xl:h-[calc(100vh-180px)]"
          >
            <DianeChat scenario={scenario} onFocus={onFocus} />
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  focused?: boolean;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, focused, children }: ChartCardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border bg-surface/40 px-4 py-4 transition-all duration-300',
        focused
          ? 'border-[var(--themis-primary)]/60 bg-[var(--themis-glass-tint)] shadow-[0_0_0_1px_var(--themis-primary)]'
          : 'border-border-subtle',
      )}
    >
      <header className="mb-3">
        <h2 className="font-display text-[14px] font-medium text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            {subtitle}
          </p>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}
