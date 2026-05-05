'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, RotateCcw } from 'lucide-react';
import {
  DEFAULT_SCENARIO,
  formatCurrency,
  formatDuration,
  type DashboardKPIs,
  type ScenarioOverrides,
} from '../_lib/dashboard';
import { cn } from '@/lib/utils';

interface WhatIfPanelProps {
  scenario: ScenarioOverrides;
  baseline: ScenarioOverrides;
  setScenario: (next: ScenarioOverrides) => void;
  baselineKPIs: DashboardKPIs;
  scenarioKPIs: DashboardKPIs;
}

export default function WhatIfPanel({
  scenario,
  baseline,
  setScenario,
  baselineKPIs,
  scenarioKPIs,
}: WhatIfPanelProps) {
  const [open, setOpen] = useState(false);

  const isModified =
    scenario.budgetReservePct !== baseline.budgetReservePct ||
    scenario.velocityCompressionPct !== baseline.velocityCompressionPct ||
    scenario.approvalThreshold !== baseline.approvalThreshold;

  const reset = () => setScenario(DEFAULT_SCENARIO);

  // Deltas for the bottom strip
  const budgetDelta = scenarioKPIs.approvedBudget - baselineKPIs.approvedBudget;
  const velocityDelta =
    (scenarioKPIs.avgDecisionMs ?? 0) - (baselineKPIs.avgDecisionMs ?? 0);

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border bg-[var(--themis-glass-tint)] transition-colors',
        isModified
          ? 'border-[var(--themis-primary)]/40'
          : 'border-border-subtle',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <FlaskConical
          size={13}
          style={{ color: 'var(--themis-primary)' }}
          aria-hidden="true"
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          What if?
        </span>
        {isModified && (
          <span
            className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
            style={{
              background: 'var(--themis-primary)',
              color: 'var(--color-bg)',
            }}
          >
            modified
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          <span>Scenarios</span>
          {open ? (
            <ChevronUp size={11} aria-hidden="true" />
          ) : (
            <ChevronDown size={11} aria-hidden="true" />
          )}
        </span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-border-subtle/50 px-4 py-4">
          <Slider
            label="Budget reserve"
            description="Shave a cushion off the approved budget to see headroom."
            min={0}
            max={25}
            step={1}
            value={scenario.budgetReservePct}
            onChange={(v) => setScenario({ ...scenario, budgetReservePct: v })}
            format={(v) => `${v}%`}
          />
          <Slider
            label="Velocity compression"
            description="Pretend decisions came in N% faster than baseline."
            min={0}
            max={50}
            step={1}
            value={scenario.velocityCompressionPct}
            onChange={(v) =>
              setScenario({ ...scenario, velocityCompressionPct: v })
            }
            format={(v) => `${v}%`}
          />
          <Slider
            label="Approval threshold"
            description="Auto-route requests above this to senior approval."
            min={1}
            max={500}
            step={5}
            value={scenario.approvalThreshold / 1_000_000}
            onChange={(v) =>
              setScenario({ ...scenario, approvalThreshold: v * 1_000_000 })
            }
            format={(v) => `$${v}M`}
          />

          {isModified && (
            <div className="flex items-center justify-between border-t border-border-subtle/50 pt-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider">
                <span style={{ color: 'var(--themis-primary)' }}>
                  Budget Δ {formatCurrency(budgetDelta)}
                </span>
                <span style={{ color: 'var(--themis-primary)' }}>
                  Velocity Δ{' '}
                  {velocityDelta < 0
                    ? `−${formatDuration(Math.abs(velocityDelta))}`
                    : formatDuration(velocityDelta)}
                </span>
              </div>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <RotateCcw size={11} aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

interface SliderProps {
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}

function Slider({
  label,
  description,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-text-primary">{label}</span>
        <span
          className="font-mono text-[12px] tracking-wider"
          style={{ color: 'var(--themis-primary)' }}
        >
          {format(value)}
        </span>
      </div>
      <p className="mt-0.5 text-[11px] text-text-tertiary">{description}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-[var(--themis-primary)]"
        aria-label={label}
      />
    </div>
  );
}
