import { cn } from '@/lib/utils';

/**
 * Constraints card grid — §3 of the canonical post structure.
 *
 * Surfaces what the solution MUST respect. Three kinds:
 *   - hard: physical/technical absolutes (latency, scale, data locality)
 *   - soft: organizational preferences (existing muscle memory, governance)
 *   - regulatory: compliance-driven requirements (MRM, PII, audit trail)
 *
 * A reader who skims just this block should understand the shape of the
 * problem. Options considered (§4) then maps back to these constraints in
 * §5 Decision rationale.
 */
export type ConstraintKind = 'hard' | 'soft' | 'regulatory';

export interface Constraint {
  kind: ConstraintKind;
  label: string;
  detail: string;
}

const KIND_STYLES: Record<ConstraintKind, { badge: string; border: string }> = {
  hard: {
    badge:
      'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    border: 'border-rose-500/25',
  },
  soft: {
    badge:
      'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    border: 'border-amber-500/25',
  },
  regulatory: {
    badge:
      'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    border: 'border-blue-500/25',
  },
};

const KIND_LABEL: Record<ConstraintKind, string> = {
  hard: 'Hard',
  soft: 'Soft',
  regulatory: 'Regulatory',
};

export default function ConstraintsBlock({
  constraints,
  heading = 'Constraints',
}: {
  constraints: Constraint[];
  heading?: string;
}) {
  return (
    <figure className="my-8 not-prose">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">
        {heading}
      </p>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {constraints.map((c, i) => {
          const styles = KIND_STYLES[c.kind];
          return (
            <li
              key={i}
              className={cn(
                'rounded-lg border bg-surface/50 p-4',
                styles.border
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <strong className="text-sm font-semibold text-text-primary">
                  {c.label}
                </strong>
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider',
                    styles.badge
                  )}
                >
                  {KIND_LABEL[c.kind]}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {c.detail}
              </p>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
