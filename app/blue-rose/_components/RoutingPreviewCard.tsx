'use client';

import { ArrowDown } from 'lucide-react';
import type { DianeAnnotation, Persona } from '@/data/themis/types';
import FloatingAvatar from './FloatingAvatar';

interface RoutingPreviewCardProps {
  diane: DianeAnnotation;
  personaMap: Map<string, Persona>;
  /** Optional title override (default: "Routing preview"). */
  title?: string;
  /** Optional submission title to anchor the preview. */
  submissionTitle?: string;
}

/**
 * RoutingPreviewCard — visualizes Diane's predicted approver chain
 * with rule-id provenance per step. Surfaces the routing intelligence
 * façade (PAR Assist Phase 2 narrative) wherever a submission has a
 * `diane.routingPreview` payload.
 *
 *  ┌──────────────────────────────────────────────┐
 *  │ Routing preview · 1 business day             │
 *  ├──────────────────────────────────────────────┤
 *  │ ① Director, Operational Risk                 │
 *  │    Rationale · ruleId                        │
 *  │ ↓                                            │
 *  │ ② VP, Compliance                             │
 *  │    Rationale · ruleId                        │
 *  └──────────────────────────────────────────────┘
 */
export default function RoutingPreviewCard({
  diane,
  personaMap,
  title = 'Routing preview',
  submissionTitle,
}: RoutingPreviewCardProps) {
  const { steps, estimatedDays } = diane.routingPreview;

  return (
    <section
      aria-label={title}
      className="rounded-2xl border bg-surface/40 px-4 py-4"
      style={{ borderColor: 'rgba(185,168,214,0.28)' }}
    >
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            {title}
          </p>
          {submissionTitle && (
            <p className="mt-0.5 truncate text-[13px] text-text-primary">
              {submissionTitle}
            </p>
          )}
        </div>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{
            background: 'var(--themis-glass-tint)',
            color: 'var(--themis-primary)',
          }}
        >
          ≈ {estimatedDays} business {estimatedDays === 1 ? 'day' : 'days'}
        </span>
      </header>

      <ol className="space-y-3">
        {steps.map((step, i) => {
          const approver = personaMap.get(step.approverId);
          return (
            <li key={i}>
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium"
                  style={{
                    background: 'var(--themis-glass-tint)',
                    color: 'var(--themis-primary)',
                  }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {approver && (
                      <FloatingAvatar
                        seed={approver.avatarSeed}
                        size={20}
                        ringColor={approver.accentHex}
                        static
                      />
                    )}
                    <span className="text-[13px] font-medium text-text-primary">
                      {approver?.displayName ?? step.approverId}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                      {step.role}
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-snug text-text-secondary">
                    {step.rationale}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-wider text-text-tertiary">
                    {step.ruleId}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="ml-3 mt-2 flex h-3 w-px flex-col items-center">
                  <ArrowDown
                    size={11}
                    className="-ml-[5px] -mt-1 text-text-tertiary"
                    aria-hidden="true"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-subtle/60 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        <span>
          field-groups: {diane.fieldGroupsRetrieved.length}/
          {diane.fieldGroupsRetrieved.length}
        </span>
        <span>·</span>
        <span>coverage {Math.round(diane.coverage * 100)}%</span>
        <span>·</span>
        <span>
          MCP:{' '}
          <span className="normal-case tracking-normal text-text-secondary">
            {diane.mcpToolsUsed.map((t) => t.replace(/@.*/, '')).join(', ')}
          </span>
        </span>
        <span>·</span>
        <span>{diane.confidence} confidence</span>
      </footer>
    </section>
  );
}
