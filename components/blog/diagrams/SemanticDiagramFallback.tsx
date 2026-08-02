'use client';

import { useEffect, useId, useState } from 'react';

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
 * Static/no-JS output leaves the native details element open. Once the
 * interactive canvas hydrates it closes, but remains available to keyboard,
 * touch, and assistive-technology users through its native summary control.
 */
export default function SemanticDiagramFallback({
  title,
  summary,
  steps,
  notes = [],
}: SemanticDiagramFallbackProps) {
  const [expanded, setExpanded] = useState(true);
  const headingId = useId();

  useEffect(() => {
    setExpanded(false);
  }, []);

  return (
    <details
      open={expanded}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
      className={`absolute z-30 overflow-auto rounded-xl border border-border-subtle bg-surface/95 shadow-lg backdrop-blur-md ${
        expanded
          ? 'inset-3 max-h-[calc(100%-1.5rem)]'
          : 'right-3 top-3 max-w-[calc(100%-1.5rem)]'
      }`}
    >
      <summary
        id={headingId}
        className="cursor-pointer select-none px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {expanded ? 'Hide' : 'Show'} semantic flow · {title}
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
