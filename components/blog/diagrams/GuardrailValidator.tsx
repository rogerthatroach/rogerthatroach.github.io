'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
  {
    label: 'Normal Query',
    sql: "SELECT kpi_value FROM benchmarks WHERE kpi_id = 42 AND period = '2025-Q4'",
    results: [true, true, true, true],
    explanations: ['All tables in whitelist', 'SELECT only', 'Matches template structure', 'All params typed correctly'],
  },
  {
    label: 'SQL Injection',
    sql: "SELECT * FROM benchmarks; DROP TABLE users; --",
    results: [true, false, false, false],
    explanations: ['Tables pass whitelist', 'Multiple statements detected — only SELECT allowed', 'Structure mismatch: unexpected statement terminator', 'N/A — rejected at gate 2'],
  },
  {
    label: 'Wrong Table',
    sql: "SELECT * FROM employee_salaries WHERE dept = 'Finance'",
    results: [false, false, false, false],
    explanations: ['employee_salaries not in allowed tables', 'N/A — rejected at gate 1', 'N/A — rejected at gate 1', 'N/A — rejected at gate 1'],
  },
  {
    label: 'DELETE Statement',
    sql: "DELETE FROM benchmarks WHERE kpi_id = 42",
    results: [true, false, false, false],
    explanations: ['Table is in whitelist', 'DELETE not in allowed operations — only SELECT', 'N/A — rejected at gate 2', 'N/A — rejected at gate 2'],
  },
];

const GATES = [
  { label: 'Whitelist Check', description: 'Tables & columns in allowed set?' },
  { label: 'Operation Check', description: 'Top-level op ∈ {SELECT}?' },
  { label: 'Structure Check', description: 'AST matches template?' },
  { label: 'Type Check', description: 'Parameter types valid?' },
];

export default function GuardrailValidator() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const example = EXAMPLES[exampleIdx];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Example selector */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a validator example">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setExampleIdx(i)}
            aria-pressed={i === exampleIdx}
            aria-controls="guardrail-validator-example"
            className={`min-h-11 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              i === exampleIdx
                ? 'bg-accent text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div id="guardrail-validator-example" className="space-y-3">
        {/* SQL input display */}
        <pre className="overflow-x-auto rounded-lg bg-surface p-3 font-mono text-xs text-text-secondary">
          <code>{example.sql}</code>
        </pre>

        {/* Gates */}
        <div className="space-y-3">
          {GATES.map((gate, i) => {
            const passed = example.results[i];
            const isReached = i === 0 || example.results[i - 1];

            return (
              <motion.div
                key={`${exampleIdx}-${i}`}
                initial={false}
                animate={{ opacity: isReached ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  !isReached
                    ? 'border-border-subtle/50'
                    : passed
                      ? 'border-green-400/40 bg-green-500/5'
                      : 'border-red-400/40 bg-red-500/5'
                }`}
              >
                <span className="mt-0.5 text-lg">
                  {!isReached ? '○' : passed ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary">Gate {i + 1}: {gate.label}</span>
                    <span className="text-[10px] text-text-tertiary">{gate.description}</span>
                  </div>
                  <p className={`mt-1 text-xs ${
                    !isReached ? 'text-text-tertiary' : passed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {example.explanations[i]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Result */}
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg p-3 text-center text-xs font-semibold ${
          example.results.every(Boolean)
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400'
        }`}
        >
          {example.results.every(Boolean)
            ? '✓ Validator accepts this example — database role, timeout, and result limits still apply'
            : '✗ Validator rejects this example before execution on the illustrated path'}
        </div>
      </div>

      <noscript>
        <div className="rounded-lg border border-border-subtle bg-surface/50 p-4">
          <p className="text-xs font-semibold text-text-primary">All illustrative validator paths</p>
          <ul className="mt-3 space-y-4">
            {EXAMPLES.map((item) => (
              <li key={item.label}>
                <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                <code className="mt-1 block overflow-x-auto text-[10px] text-text-secondary">
                  {item.sql}
                </code>
                <ol className="mt-2 space-y-1 text-xs text-text-secondary">
                  {GATES.map((gate, gateIndex) => (
                    <li key={gate.label}>
                      Gate {gateIndex + 1}, {gate.label}: {item.explanations[gateIndex]}
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
