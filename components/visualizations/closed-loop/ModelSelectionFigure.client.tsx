'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import FigureHeader from '@/components/visualizations/FigureHeader';
import type { ModelSelectionContent } from '@/data/visualizations/closedLoop';
import { cn } from '@/lib/utils';

export default function ModelSelectionFigure({ content }: { content: ModelSelectionContent }) {
  const [selectedId, setSelectedId] = useState(content.defaultCandidateId);
  const [tabStopId, setTabStopId] = useState(content.defaultCandidateId);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const detailId = useId();
  const selectionLegendId = useId();
  const headingId = `${content.id}-title`;
  const selected = content.candidates.find((candidate) => candidate.id === selectedId) ?? content.candidates[0];

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const currentIndex = content.candidates.findIndex((candidate) => candidate.id === currentId);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % content.candidates.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + content.candidates.length) % content.candidates.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = content.candidates.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextId = content.candidates[nextIndex].id;
    setTabStopId(nextId);
    setSelectedId(nextId);
    buttonRefs.current.get(nextId)?.focus();
  };

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-6 border-y border-border-subtle py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.fixtureLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{content.fixtureNote}</p>
      </div>

      <div className="model-selection-enhanced">
        <fieldset className="mt-7">
          <legend
            id={selectionLegendId}
            className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary"
          >
            {content.selectionLabel}
          </legend>
          <div
            className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="radiogroup"
            aria-labelledby={selectionLegendId}
            aria-controls={detailId}
          >
            {content.candidates.map((candidate) => {
              const isSelected = candidate.id === selected.id;
              return (
                <button
                  key={candidate.id}
                  ref={(node) => {
                    if (node) buttonRefs.current.set(candidate.id, node);
                    else buttonRefs.current.delete(candidate.id);
                  }}
                  type="button"
                  role="radio"
                  tabIndex={candidate.id === tabStopId ? 0 : -1}
                  aria-checked={isSelected}
                  aria-controls={detailId}
                  onFocus={() => setTabStopId(candidate.id)}
                  onKeyDown={(event) => moveFocus(event, candidate.id)}
                  onClick={() => {
                    setSelectedId(candidate.id);
                    setTabStopId(candidate.id);
                  }}
                  className={cn(
                    'min-h-11 border-t-2 px-1 py-4 text-left transition-colors',
                    isSelected
                      ? 'border-text-primary text-text-primary'
                      : 'border-border-subtle text-text-secondary hover:border-text-primary hover:text-text-primary',
                  )}
                >
                  <span className="block text-base font-semibold">{candidate.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed">
                    {content.fieldLabels[0]}: {candidate.fit}
                  </span>
                  <span className="block text-xs leading-relaxed">
                    {content.fieldLabels[1]}: {candidate.stability}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div
          id={detailId}
          role="region"
          aria-label={content.focusedLabel}
          aria-live="polite"
          className="mt-7 border-y-2 border-text-primary py-5"
        >
          <div className="grid gap-5 md:grid-cols-[10rem_1fr]">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">
                {content.focusedLabel}
              </p>
              <p className="mt-2 text-xl font-semibold text-text-primary">{selected.label}</p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="border-l-2 border-text-primary pl-3">
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {content.fieldLabels[0]}
                </dt>
                <dd className="mt-2 text-sm font-semibold text-text-primary">{selected.fit}</dd>
              </div>
              <div className="border-l-2 border-text-primary pl-3">
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {content.fieldLabels[1]}
                </dt>
                <dd className="mt-2 text-sm font-semibold text-text-primary">{selected.stability}</dd>
              </div>
              <div className="border-l-2 border-text-primary pl-3">
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {content.fieldLabels[2]}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{selected.reading}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-5 border-t border-border-subtle pt-4 text-sm font-semibold leading-relaxed text-text-primary">
            {selected.decision}
          </p>
        </div>
      </div>

      <section
        className="model-selection-static mt-7 hidden border-y border-border-subtle py-5"
        aria-label={content.fallbackLabel}
      >
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.fallbackLabel}
        </p>
        <ul className="mt-4 space-y-5">
          {content.candidates.map((candidate) => (
            <li key={`${candidate.id}-static`} className="border-l-2 border-text-primary pl-4">
              <p className="text-sm font-semibold text-text-primary">{candidate.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {content.fieldLabels[0]}: {candidate.fit}. {content.fieldLabels[1]}: {candidate.stability}.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{candidate.reading}</p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-text-primary">
                {candidate.decision}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <noscript>
        <style>{'.model-selection-enhanced{display:none!important}.model-selection-static{display:block!important}'}</style>
      </noscript>

      <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.systemBoundaryLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.systemBoundaryDetail}</p>
      </div>

      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
