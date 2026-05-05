'use client';

import { useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useThemis, usePersonaMap } from '../_lib/store';
import {
  TIME_RANGE_LABEL,
  type DashboardFilters,
  type TimeRangeKey,
} from '../_lib/dashboard';
import { cn } from '@/lib/utils';

interface InsightsHeaderProps {
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
}

const TIME_RANGE_KEYS: TimeRangeKey[] = ['7d', '30d', '90d', '1y', 'all'];

export default function InsightsHeader({ filters, setFilters }: InsightsHeaderProps) {
  const { seed } = useThemis();
  const personaMap = usePersonaMap();

  const dimensions = useMemo(() => {
    const businessUnits = new Set<string>();
    const kinds = new Set<string>();
    const severities = new Set<string>();
    const submitterIds = new Set<string>();
    for (const s of seed.submissions) {
      const bu = s.fields.find((f) => f.key === 'business_unit')?.value;
      if (typeof bu === 'string') businessUnits.add(bu);
      kinds.add(s.kind);
      const sev = s.fields.find((f) => f.key === 'severity')?.value;
      if (typeof sev === 'string') severities.add(sev);
      submitterIds.add(s.submittedBy);
    }
    return {
      businessUnits: Array.from(businessUnits).sort(),
      kinds: Array.from(kinds).sort(),
      severities: Array.from(severities),
      submitterIds: Array.from(submitterIds),
    };
  }, [seed.submissions]);

  const toggleArrayItem = <K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K] extends Array<infer U> ? U : never,
  ) => {
    const arr = filters[key] as unknown as Array<typeof value>;
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setFilters({ ...filters, [key]: next } as DashboardFilters);
  };

  const activeCount =
    filters.businessUnits.length +
    filters.kinds.length +
    filters.severities.length +
    filters.submitterIds.length;

  const reset = () =>
    setFilters({
      timeRange: filters.timeRange,
      businessUnits: [],
      kinds: [],
      severities: [],
      submitterIds: [],
    });

  return (
    <header className="space-y-3">
      {/* Time range — segmented control */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          Range
        </span>
        <nav role="tablist" aria-label="Time range" className="flex flex-wrap gap-1">
          {TIME_RANGE_KEYS.map((key) => {
            const active = filters.timeRange === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilters({ ...filters, timeRange: key })}
                className={cn(
                  'rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors',
                  active
                    ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                    : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                )}
              >
                {TIME_RANGE_LABEL[key]}
              </button>
            );
          })}
        </nav>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
          >
            <X size={10} aria-hidden="true" />
            <span>Clear filters ({activeCount})</span>
          </button>
        )}
      </div>

      {/* Dimension chip groups */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <FilterChipGroup
          label="Business unit"
          options={dimensions.businessUnits}
          selected={filters.businessUnits}
          onToggle={(v) => toggleArrayItem('businessUnits', v)}
        />
        <FilterChipGroup
          label="Type"
          options={dimensions.kinds}
          selected={filters.kinds}
          onToggle={(v) => toggleArrayItem('kinds', v)}
          renderLabel={(v) =>
            v.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          }
        />
        <FilterChipGroup
          label="Severity"
          options={dimensions.severities}
          selected={filters.severities}
          onToggle={(v) => toggleArrayItem('severities', v)}
        />
        <FilterChipGroup
          label="Submitter"
          options={dimensions.submitterIds}
          selected={filters.submitterIds}
          onToggle={(v) => toggleArrayItem('submitterIds', v)}
          renderLabel={(id) => personaMap.get(id)?.displayName ?? id}
        />
      </div>
    </header>
  );
}

interface FilterChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  renderLabel?: (value: string) => string;
}

function FilterChipGroup({
  label,
  options,
  selected,
  onToggle,
  renderLabel,
}: FilterChipGroupProps) {
  if (options.length === 0) return null;
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary transition-colors hover:text-text-primary">
        <span>{label}</span>
        {selected.length > 0 && (
          <span
            className="rounded-full px-1.5 font-mono text-[9px] tracking-widest"
            style={{
              background: 'var(--themis-primary)',
              color: 'var(--color-bg)',
            }}
          >
            {selected.length}
          </span>
        )}
        <ChevronDown
          size={10}
          aria-hidden="true"
          className="transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={active}
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                active
                  ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                  : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
              )}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </button>
          );
        })}
      </div>
    </details>
  );
}
