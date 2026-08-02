'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const EXAMPLE_QUERIES = [
  {
    label: 'Normal: "Show NIM for Q4 2025"',
    stages: [
      { output: '{μ: "NIM", τ: "Q4 2025", δ: "peer", ω: "table"}', pass: true },
      { output: 'Net Interest Margin (illustrative top lexical match)', pass: true },
      { output: 'Candidate clears the configured example threshold → Accept', pass: true },
      { output: 'SELECT kpi_value FROM benchmarks WHERE kpi_id=42 AND period=\'2025-Q4\' ✓✓✓✓', pass: true },
      { output: '| Bank | NIM | Rank | ...formatted table', pass: true },
    ],
  },
  {
    label: 'Ambiguous: "Show efficiency"',
    stages: [
      { output: '{μ: "efficiency", τ: null, δ: "peer", ω: "table"}', pass: true },
      { output: 'Multiple plausible candidates: Efficiency Ratio, Cost-to-Income, Operating Leverage', pass: true },
      { output: 'Below the configured example threshold → Clarify: "Did you mean Efficiency Ratio or Cost-to-Income?"', pass: false },
      { output: '—', pass: false },
      { output: '—', pass: false },
    ],
  },
];

const STAGE_NAMES = ['Intent Parser', 'KPI Detector', 'Disambiguator', 'SQL Generator', 'Formatter'];
const STAGE_COLORS = ['#3b82f6', '#22c55e', '#3b82f6', '#22c55e', '#22c55e'];

export default function FullPipelineFlow() {
  const [queryIdx, setQueryIdx] = useState(0);
  const query = EXAMPLE_QUERIES[queryIdx];

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-xs text-text-tertiary">
        Illustrative pipeline states; confidence language is qualitative rather than production telemetry.
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a pipeline example">
        {EXAMPLE_QUERIES.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setQueryIdx(i)}
            aria-pressed={i === queryIdx}
            aria-controls="pipeline-example-stages"
            className={`min-h-11 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              i === queryIdx ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      <div id="pipeline-example-stages" className="space-y-3" aria-live="polite">
        {STAGE_NAMES.map((name, i) => {
          const stage = query.stages[i];
          const prevFailed = i > 0 && !query.stages[i - 1].pass;

          return (
            <motion.div
              key={`${queryIdx}-${i}`}
              initial={false}
              animate={{ opacity: prevFailed ? 0.25 : 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
              className="flex items-start gap-3 rounded-lg border border-border-subtle p-3"
            >
              <div className="flex flex-col items-center">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: prevFailed ? 'var(--color-text-tertiary)' : STAGE_COLORS[i] }}
                >
                  {i + 1}
                </div>
                {i < 4 && <div className="h-3 w-px bg-border-subtle" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-text-primary">{name}</p>
                <p className={`mt-1 font-mono text-[10px] ${
                  prevFailed ? 'text-text-tertiary' :
                  stage.pass ? 'text-text-secondary' : 'text-amber-400'
                }`}>
                  {stage.output}
                </p>
              </div>
              {!prevFailed && (
                <span className={`text-sm ${stage.pass ? 'text-green-400' : 'text-amber-400'}`}>
                  {stage.pass ? '✓' : '⚠'}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <noscript>
        <div className="rounded-lg border border-border-subtle bg-surface/50 p-4">
          <p className="text-xs font-semibold text-text-primary">All illustrative query paths</p>
          <ul className="mt-3 space-y-4">
            {EXAMPLE_QUERIES.map((item) => (
              <li key={item.label}>
                <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                <ol className="mt-2 space-y-1 text-xs text-text-secondary">
                  {item.stages.map((stage, stageIndex) => (
                    <li key={`${item.label}-${STAGE_NAMES[stageIndex]}`}>
                      {STAGE_NAMES[stageIndex]}: {stage.output}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
