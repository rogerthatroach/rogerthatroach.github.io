import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Before/after diff — §8 of the canonical post structure.
 *
 * Two-pane layout for showing a transformation: raw input → processed
 * output; old workflow → new workflow; unbracketed number → quantified
 * impact. Desktop shows side-by-side; mobile stacks with a down arrow.
 *
 * Children can be prose, code, or arbitrary JSX — the component doesn't
 * prescribe content format.
 *
 * Usage:
 *
 *   <BeforeAfterDiff
 *     before={{ label: 'Before', content: <p>Months of manual work...</p> }}
 *     after={{ label: 'After', content: <p>90 minutes end-to-end.</p> }}
 *   />
 */
export interface DiffPane {
  label: string;
  content: React.ReactNode;
  /** Optional hint shown in small text under the label (e.g., timing, version). */
  hint?: string;
}

export default function BeforeAfterDiff({
  before,
  after,
  heading,
}: {
  before: DiffPane;
  after: DiffPane;
  heading?: string;
}) {
  return (
    <figure className="my-8 not-prose">
      {heading && (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-accent">
          {heading}
        </p>
      )}

      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <Pane pane={before} tone="before" className="md:rounded-r-none" />

        {/* Arrow — rotates down on mobile stack */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center py-2 md:px-3 md:py-0"
        >
          <ArrowRight
            size={20}
            className="rotate-90 text-accent md:rotate-0"
          />
        </div>

        <Pane pane={after} tone="after" className="md:rounded-l-none" />
      </div>
    </figure>
  );
}

function Pane({
  pane,
  tone,
  className,
}: {
  pane: DiffPane;
  tone: 'before' | 'after';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex-1 rounded-lg border bg-surface/50 p-4',
        tone === 'before'
          ? 'border-border-subtle'
          : 'border-accent/30 bg-accent-muted/20',
        className
      )}
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <strong
          className={cn(
            'font-mono text-[10px] font-semibold uppercase tracking-wider',
            tone === 'before' ? 'text-text-tertiary' : 'text-accent'
          )}
        >
          {pane.label}
        </strong>
        {pane.hint && (
          <span className="font-mono text-[10px] text-text-tertiary">
            {pane.hint}
          </span>
        )}
      </div>
      <div className="text-sm leading-relaxed text-text-secondary">
        {pane.content}
      </div>
    </div>
  );
}
