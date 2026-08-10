'use client';

import { useState } from 'react';
import type { CommodityTaxTraceContent } from '@/data/visualizations/commodityTax';
import CommodityTaxFigureHeader from './CommodityTaxFigureHeader';

interface CommodityTaxTraceFigureProps {
  content: CommodityTaxTraceContent;
}

export default function CommodityTaxTraceFigure({ content }: CommodityTaxTraceFigureProps) {
  const [selectedId, setSelectedId] = useState(content.focusOptions[0].id);
  const selected = content.focusOptions.find((option) => option.id === selectedId) ?? content.focusOptions[0];

  return (
    <section aria-labelledby={`${content.id}-title`}>
      <CommodityTaxFigureHeader content={content} headingId={`${content.id}-title`} />

      <div className="mt-6">
        <fieldset>
          <legend className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.controlsLabel}
          </legend>
          <div className="mt-3 flex flex-wrap border-y border-border-subtle">
            {content.focusOptions.map((option) => {
              const isSelected = option.id === selected.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(option.id)}
                  className={`min-h-11 border-b-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'border-text-primary text-text-primary'
                      : 'border-transparent text-text-secondary hover:border-text-primary hover:text-text-primary'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {content.focusOptions.map((option) => {
              const isSelected = option.id === selected.id;
              return (
                <li
                  key={`${option.id}-summary`}
                  className={`border-l-2 pl-3 ${
                    isSelected ? 'border-text-primary' : 'border-border-subtle'
                  }`}
                >
                  <p className={`text-xs font-semibold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {option.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{option.summary}</p>
                </li>
              );
            })}
          </ul>
          <p aria-live="polite" className="sr-only">
            {selected.label}: {selected.summary}
          </p>
        </fieldset>

        <p className="mt-7 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.pathLabel}
        </p>
        <ol className="mt-3 ml-2 border-l-2 border-text-primary md:ml-0 md:grid md:grid-cols-5 md:border-l-0 md:border-t-2">
          {content.steps.map((step) => {
            const isActive = selected.activeStageIds.includes(step.id);
            return (
              <li
                key={step.id}
                className={`relative pb-7 pl-6 last:pb-0 md:pb-0 md:pl-0 md:pr-5 md:pt-6 md:last:pr-0 ${
                  isActive ? 'text-text-primary' : 'text-text-tertiary'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-1.5 top-1 h-3 w-3 border md:-top-1.5 md:left-0 ${
                    isActive
                      ? 'border-text-primary bg-text-primary'
                      : 'border-border-subtle bg-background'
                  }`}
                />
                <p className="font-mono text-xs font-bold uppercase tracking-wider">
                  {step.number} · {step.relation}
                </p>
                <p className={`mt-2 text-sm font-semibold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {step.record}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{step.detail}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.reviewLabel}
          </p>
          <p className="text-sm font-semibold leading-relaxed text-text-primary">
            {content.reviewDetail}
          </p>
        </div>

        {content.caveat && (
          <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>
        )}
      </div>
    </section>
  );
}
