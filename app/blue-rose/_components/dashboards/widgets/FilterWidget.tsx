'use client';

import { useMemo } from 'react';
import { useThemis } from '../../../_lib/store';
import { cn } from '@/lib/utils';
import type { WidgetProps } from './widget-shared';

export default function FilterWidget({ widget, filters, setFilters }: WidgetProps) {
  if (widget.config.kind !== 'filter') return null;
  const dim = widget.config.dimension;
  const { seed } = useThemis();

  const options = useMemo(() => {
    const out = new Set<string>();
    for (const s of seed.submissions) {
      if (dim === 'kind') out.add(s.kind);
      else if (dim === 'businessUnit') {
        const bu = s.fields.find((f) => f.key === 'business_unit')?.value;
        if (typeof bu === 'string') out.add(bu);
      } else if (dim === 'severity') {
        const sev = s.fields.find((f) => f.key === 'severity')?.value;
        if (typeof sev === 'string') out.add(sev);
      }
    }
    return Array.from(out).sort();
  }, [seed.submissions, dim]);

  const selectedKey =
    dim === 'kind' ? 'kinds' : dim === 'businessUnit' ? 'businessUnits' : 'severities';
  const selected = filters[selectedKey] as string[];

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    setFilters({ ...filters, [selectedKey]: next } as typeof filters);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.length === 0 ? (
        <p className="font-mono text-[10px] text-text-tertiary">No values.</p>
      ) : (
        options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={active}
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                active
                  ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                  : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
              )}
            >
              {dim === 'kind'
                ? opt.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                : opt}
            </button>
          );
        })
      )}
    </div>
  );
}
