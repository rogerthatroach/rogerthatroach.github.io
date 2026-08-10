'use client';

import { useId, useState } from 'react';
import type {
  AstraeusEventModelContent,
  AstraeusEventScenario as AstraeusEventScenarioContent,
} from '@/data/visualizations/astraeus';

interface AstraeusEventScenarioProps {
  content: AstraeusEventModelContent;
}

function ScenarioPanel({
  content,
  scenario,
}: {
  content: AstraeusEventModelContent;
  scenario: AstraeusEventScenarioContent;
}) {
  const values = [
    scenario.snapshotFinding,
    scenario.eventFinding,
    scenario.rollupFinding,
    scenario.reviewAction,
  ];

  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-text-primary">{scenario.summary}</p>
      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        {values.map((value, index) => (
          <div
            key={content.columnLabels[index]}
            className={`border p-4 ${
              index === 3 ? 'border-2 border-text-primary bg-surface/70' : 'border-border-subtle bg-surface/30'
            }`}
          >
            <dt className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
              {content.columnLabels[index]}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function AstraeusEventScenario({ content }: AstraeusEventScenarioProps) {
  const [selectedId, setSelectedId] = useState<AstraeusEventScenarioContent['id']>('within-rollup');
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
        aria-label={`${selected.label} movement evidence`}
        aria-live="polite"
        aria-atomic="true"
      >
        <ScenarioPanel content={content} scenario={selected} />
      </div>

      <noscript>
        <div className="mt-8 space-y-8 border-t border-border-subtle pt-6">
          {content.scenarios.slice(1).map((scenario) => (
            <section key={scenario.id}>
              <p className="text-base font-semibold text-text-primary">{scenario.label}</p>
              <ScenarioPanel content={content} scenario={scenario} />
            </section>
          ))}
        </div>
      </noscript>
    </div>
  );
}
