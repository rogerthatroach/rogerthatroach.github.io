'use client';

import { useId } from 'react';

export interface SemanticDiagramStep {
  title: string;
  detail: string;
}

interface SemanticDiagramFallbackProps {
  title: string;
  summary: string;
  steps: SemanticDiagramStep[];
  notes?: string[];
}

/**
 * Server-visible description for ReactFlow diagrams.
 *
 * The native details element is the authoritative accessible representation.
 * It works before hydration and without JavaScript; the adjacent visual canvas
 * is a pointer enhancement and is hidden from assistive technology.
 */
export default function SemanticDiagramFallback({
  title,
  summary,
  steps,
  notes = [],
}: SemanticDiagramFallbackProps) {
  const headingId = useId();

  return (
    <details
      className="diagram-semantic absolute right-3 top-3 z-30 max-w-[calc(100%-1.5rem)] overflow-auto rounded-xl border border-border-subtle bg-surface/95 shadow-lg backdrop-blur-md open:inset-3 open:max-h-[calc(100%-1.5rem)] open:max-w-none"
    >
      <summary
        id={headingId}
        className="flex min-h-11 cursor-pointer select-none items-center px-3 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Semantic flow · {title}
      </summary>

      <div className="border-t border-border-subtle px-4 py-3" aria-labelledby={headingId}>
        <p className="mb-3 text-xs leading-relaxed text-text-secondary">{summary}</p>
        <ol className="space-y-2 pl-5 text-xs text-text-secondary">
          {steps.map((step) => (
            <li key={step.title} className="list-decimal pl-1 leading-relaxed">
              <span className="font-semibold text-text-primary">{step.title}.</span>{' '}
              {step.detail}
            </li>
          ))}
        </ol>
        {notes.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-border-subtle pt-3 text-[11px] leading-relaxed text-text-tertiary">
            {notes.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
