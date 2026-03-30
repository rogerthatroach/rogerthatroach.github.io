'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  {
    id: 's1',
    label: 'Intent Parser',
    input: 'NL Query',
    output: 'Structured Intent',
    usesLLM: true,
    color: '#3b82f6',
    detail: 'Constrained JSON generation with schema validation. Retries on invalid output. Extracts metric reference, temporal scope, comparison dimension, output type.',
  },
  {
    id: 's2',
    label: 'KPI Detector',
    input: 'Metric Reference',
    output: 'Candidate Set',
    usesLLM: false,
    color: '#22c55e',
    detail: 'Embedding similarity search over KPI catalog. Cosine similarity with minimum threshold. Returns ranked candidates with scores.',
  },
  {
    id: 's3',
    label: 'Disambiguator',
    input: 'Candidates + Query',
    output: 'Resolved KPI',
    usesLLM: true,
    color: '#3b82f6',
    detail: 'LLM-assisted selection with confidence scoring. If confidence < threshold, requests clarification instead of guessing. Never sees KPI values.',
  },
  {
    id: 's4',
    label: 'SQL Generator',
    input: 'Resolved KPI + Params',
    output: 'Validated SQL',
    usesLLM: false,
    color: '#22c55e',
    detail: 'Template selection + parameterization. Four validation gates: whitelist, operation check, structure check, type check. Injection impossible by construction.',
  },
  {
    id: 's5',
    label: 'Formatter',
    input: 'Query Results',
    output: 'Formatted Response',
    usesLLM: false,
    color: '#22c55e',
    detail: 'Deterministic output rendering. Tables, charts, summaries, narratives — all from templates. Zero LLM involvement.',
  },
];

export default function FiveStagePipeline() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-xs text-text-tertiary">Click any stage to see details</p>

      {/* Pipeline */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex flex-1 flex-col items-center gap-1">
            {/* Stage box */}
            <motion.button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full rounded-lg border p-3 text-left transition-colors"
              style={{
                borderColor: expanded === i ? stage.color : 'var(--color-border)',
                backgroundColor: expanded === i ? `${stage.color}10` : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[10px] font-semibold text-text-primary">{stage.label}</span>
              </div>
              <p className="mt-1 text-[9px] text-text-tertiary">{stage.input}</p>
              <p className="text-[9px] text-text-tertiary">→ {stage.output}</p>
              <span className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[8px]" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>
                {stage.usesLLM ? 'LLM' : 'Deterministic'}
              </span>
            </motion.button>

            {/* Arrow between stages */}
            {i < STAGES.length - 1 && (
              <span className="hidden text-text-tertiary sm:block">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-lg border border-border-subtle bg-surface/50 p-4"
          >
            <p className="text-xs font-semibold" style={{ color: STAGES[expanded].color }}>
              Stage {expanded + 1}: {STAGES[expanded].label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {STAGES[expanded].detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
