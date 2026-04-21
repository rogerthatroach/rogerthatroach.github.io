import { ArrowRight } from 'lucide-react';

/**
 * Decision rationale callout — §5 of the canonical post structure.
 *
 * Ties the chosen option (§4 OptionsConsidered) back to the constraints
 * (§3 ConstraintsBlock). The causal link is what makes a post read as
 * "staff-engineer judgment" rather than "narrative preference."
 *
 * Usage:
 *
 *   <DecisionRationale option="LangGraph" summary="Short bullet">
 *     Prose explaining WHY this option satisfies the constraints.
 *     Multi-paragraph is fine.
 *   </DecisionRationale>
 */
export default function DecisionRationale({
  option,
  summary,
  children,
}: {
  /** The name of the chosen option this rationale is for. */
  option: string;
  /** Optional one-liner rendered above the prose body. */
  summary?: string;
  /** Prose body — free MDX / React. */
  children: React.ReactNode;
}) {
  return (
    <aside
      className="my-8 not-prose rounded-xl border border-accent/40 bg-accent-muted/20 p-5 md:p-6"
      aria-label={`Decision rationale: ${option}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
          Decision
        </span>
        <ArrowRight size={12} className="text-accent" aria-hidden="true" />
        <span className="text-sm font-semibold text-text-primary">{option}</span>
      </div>

      {summary && (
        <p className="mb-3 text-sm font-medium leading-snug text-text-primary">
          {summary}
        </p>
      )}

      <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </aside>
  );
}
