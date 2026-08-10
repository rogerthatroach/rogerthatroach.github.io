'use client';

import { useId, useState } from 'react';
import FigureHeader from '@/components/visualizations/FigureHeader';
import { cn } from '@/lib/utils';
import type { AegisCaseSpineContent } from '@/data/visualizations/aegis';

export default function AegisCaseSpineFigure({ content }: { content: AegisCaseSpineContent }) {
  const [selectedId, setSelectedId] = useState(content.scenarios[0].id);
  const panelId = useId();
  const selected = content.scenarios.find((scenario) => scenario.id === selectedId) ?? content.scenarios[0];
  const headingId = content.id + '-title';

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />

      <fieldset className="mt-6">
        <legend className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.scenarioLabel}
        </legend>
        <div className="mt-3 flex flex-wrap border-y border-border-subtle">
          {content.scenarios.map((scenario) => {
            const isSelected = scenario.id === selected.id;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={isSelected}
                aria-controls={panelId}
                onClick={() => setSelectedId(scenario.id)}
                className={cn(
                  'min-h-11 border-b-2 px-4 py-3 text-left text-sm font-semibold transition-colors',
                  isSelected
                    ? 'border-text-primary text-text-primary'
                    : 'border-transparent text-text-secondary hover:border-text-primary hover:text-text-primary'
                )}
              >
                {scenario.label}
              </button>
            );
          })}
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {content.scenarios.map((scenario) => (
            <li
              key={scenario.id + '-summary'}
              className={cn(
                'border-l-2 pl-3',
                scenario.id === selected.id ? 'border-text-primary' : 'border-border-subtle'
              )}
            >
              <p className="text-sm font-semibold text-text-primary">{scenario.question}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{scenario.summary}</p>
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {selected.label}: {selected.decisionLabel}. {selected.decisionDetail}
        </p>
      </fieldset>

      <div
        id={panelId}
        role="region"
        aria-label={`${selected.label} stage emphasis`}
        className="mt-7"
      >
        <ol className="grid gap-3 lg:grid-cols-5">
          {content.stages.map((stage) => {
            const isActive = selected.activeStageIds.includes(stage.id);
            return (
              <li
                key={stage.id}
                className={cn(
                  'border-t-2 pt-4',
                  isActive ? 'border-text-primary' : 'border-dashed border-border-subtle'
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sm font-bold text-text-primary">{stage.number}</span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {isActive ? content.stageStatusLabels.reached : content.stageStatusLabels.notReached}
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold text-text-primary">{stage.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{stage.job}</p>
                <p className="mt-3 border-l border-border-subtle pl-3 text-xs leading-relaxed text-text-tertiary">
                  {stage.control}
                </p>
                {stage.id === 'construct' && (
                  <div className="mt-4 border-t-2 border-dotted border-text-primary pt-3">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                      {content.boundaryLabel}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">{content.boundaryDetail}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-7 grid gap-4 border-y-2 border-text-primary py-5 lg:grid-cols-2">
          {content.scenarios.map((scenario) => (
            <div
              key={`${scenario.id}-decision`}
              className={cn(
                'border-l-2 pl-4',
                scenario.id === selected.id ? 'border-text-primary' : 'border-border-subtle'
              )}
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                {scenario.decisionLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{scenario.decisionDetail}</p>
            </div>
          ))}
        </div>
      </div>

      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
