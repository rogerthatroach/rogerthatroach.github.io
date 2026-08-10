'use client';

import { useId, useState } from 'react';
import type {
  AstraeusCaseOverviewContent,
  AstraeusOverviewScenario,
} from '@/data/visualizations/astraeus';

interface AstraeusScenarioSwitchProps {
  content: AstraeusCaseOverviewContent;
}

function ScenarioFlow({
  content,
  scenario,
}: {
  content: AstraeusCaseOverviewContent;
  scenario: AstraeusOverviewScenario;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-text-primary">{scenario.summary}</p>

      <div className="mt-4 border-y-2 border-text-primary py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.openingLabel}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{content.openingDetail}</p>
      </div>

      <ol className="mt-4 space-y-3">
        {scenario.stages.map((stage, index) => (
          <li key={stage.title}>
            <article
              className={`grid gap-3 p-4 sm:grid-cols-[10rem_1fr] sm:items-start sm:gap-6 ${
                stage.owner === 'Deterministic code'
                  ? 'border-2 border-text-primary bg-surface/70'
                  : 'border border-dashed border-border-subtle bg-surface/30'
              }`}
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                {stage.owner}
              </p>
              <div>
                <p className="text-base font-semibold text-text-primary">{stage.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{stage.detail}</p>
                {stage.branches && (
                  <div className="mt-4 border-y border-border-subtle py-3">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">
                      {stage.branchLabel}
                    </p>
                    <ul className="mt-2 grid divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      {stage.branches.map((branch) => (
                        <li key={branch} className="py-2 text-sm font-semibold text-text-primary sm:px-3 sm:first:pl-0 sm:last:pr-0">
                          {branch}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>

            {index < content.boundaryLabels.length && (
              <p className="mx-4 border-l-2 border-text-primary py-3 pl-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary sm:mx-8">
                {content.boundaryLabels[index]}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 border-y-2 border-text-primary py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.closingLabel}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{content.closingDetail}</p>
      </div>
    </div>
  );
}

export default function AstraeusScenarioSwitch({ content }: AstraeusScenarioSwitchProps) {
  const [selectedId, setSelectedId] = useState<AstraeusOverviewScenario['id']>('simple');
  const panelId = useId();
  const selected = content.scenarios.find((scenario) => scenario.id === selectedId) ?? content.scenarios[0];

  return (
    <div className="mt-6">
      <div role="group" aria-label={content.scenarioControlLabel} className="flex flex-wrap gap-2">
        {content.scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setSelectedId(scenario.id)}
            aria-pressed={selected.id === scenario.id}
            aria-controls={panelId}
            className={`min-h-11 rounded-md border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              selected.id === scenario.id
                ? 'border-text-primary bg-text-primary text-background'
                : 'border-border-subtle bg-surface/40 text-text-secondary hover:border-text-primary hover:text-text-primary'
            }`}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div
        id={panelId}
        role="region"
        aria-label={`${selected.label} request path`}
        aria-live="polite"
        aria-atomic="true"
      >
        <ScenarioFlow content={content} scenario={selected} />
      </div>

      <noscript>
        <div className="mt-8 border-t border-border-subtle pt-6">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {content.noScriptComparisonLabel}
          </p>
          <ScenarioFlow content={content} scenario={content.scenarios[1]} />
        </div>
      </noscript>
    </div>
  );
}
