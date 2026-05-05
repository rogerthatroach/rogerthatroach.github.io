'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPITileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  /** Override accent color (e.g. var(--themis-approved)) */
  accent?: string;
  /** Optional small "delta" string ("+3 vs prior" / "−12%"). */
  delta?: string;
  deltaTone?: 'positive' | 'negative' | 'neutral';
}

export default function KPITile({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  delta,
  deltaTone = 'neutral',
}: KPITileProps) {
  const deltaColor =
    deltaTone === 'positive'
      ? 'var(--themis-approved)'
      : deltaTone === 'negative'
        ? 'var(--themis-rejected)'
        : 'var(--themis-secondary)';

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border-subtle bg-surface/40 px-4 py-4 transition-all hover:border-[var(--themis-primary)]/30 hover:bg-[var(--themis-glass-tint)]">
      <div className="flex items-center justify-between">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--themis-glass-tint)]"
          style={{ color: accent ?? 'var(--themis-primary)' }}
          aria-hidden="true"
        >
          <Icon size={13} />
        </span>
        {delta && (
          <span
            className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: deltaColor }}
          >
            {delta}
          </span>
        )}
      </div>
      <p
        className={cn(
          'mt-3 font-display text-[26px] font-medium leading-none',
          accent ? '' : 'text-text-primary',
        )}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[12px] font-medium text-text-primary">{label}</p>
      {hint && (
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
}
