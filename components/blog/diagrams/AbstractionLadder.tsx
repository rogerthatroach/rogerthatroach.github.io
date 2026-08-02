'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PHASES = ['Observe', 'Estimate', 'Choose', 'Act'];

const LEVELS = [
  {
    label: 'Physical',
    years: '2016–2019',
    color: '#f59e0b',
    metric: '$3M/yr',
    nodes: ['90+ Sensors', '84 Regression Models', 'PSO', 'Plant Operators'],
    tech: ['R, Python', 'K-Fold CV, R²', 'Particle Swarm', 'Human-in-Loop'],
  },
  {
    label: 'Cloud',
    years: '2021–2022',
    color: '#8b5cf6',
    metric: 'Reduced review',
    nodes: ['Document Ingestion', 'Entity Extraction', 'Quality Objective', 'Verified Output'],
    tech: ['GCP', 'Vertex AI, AutoML', 'Measured quality', 'Structured output'],
  },
  {
    label: 'Financial',
    years: '2022–2024',
    color: '#22c55e',
    metric: 'Months → 90min',
    nodes: ['GL Data Extraction', 'PySpark Transforms', 'Process Objective', 'CFO Reports'],
    tech: ['PySpark', 'ETL pipelines', 'Cycle-time target', 'Tableau'],
  },
  {
    label: 'Model-assisted',
    years: '2024–present',
    color: '#3b82f6',
    metric: '40K cost centres',
    nodes: ['Policy/Data Ingest', 'LangGraph Workflow', 'Retrieval + Tools', 'Guided Decisions'],
    tech: ['Embeddings', 'LangGraph, MCP', 'RAG, Text-to-SQL', 'Human oversight'],
  },
];

export default function AbstractionLadder() {
  const [showTech, setShowTech] = useState(false);

  const nodeW = 130;
  const nodeH = 48;
  const gapX = 16;
  const gapY = 24;
  const rowH = nodeH + gapY;
  const startX = 80;
  const startY = 20;
  const totalW = startX + 4 * (nodeW + gapX) + 60;
  const totalH = startY + 4 * rowH + 20;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowTech(!showTech)}
          aria-expanded={showTech}
          aria-controls="abstraction-ladder-chart"
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            showTech ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:bg-surface-hover'
          }`}
        >
          {showTech ? 'Hide Technologies' : 'Show Technologies'}
        </button>
      </div>

      <svg
        id="abstraction-ladder-chart"
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="w-full"
        fill="none"
        role="img"
        aria-labelledby="abstraction-ladder-title abstraction-ladder-description"
      >
        <title id="abstraction-ladder-title">Four design questions across four operating contexts</title>
        <desc id="abstraction-ladder-description">
          Rows compare observe, estimate, choose, and act. The technology toggle adds implementation examples.
        </desc>
        {/* Phase labels at top */}
        {PHASES.map((phase, pi) => (
          <text
            key={phase}
            x={startX + pi * (nodeW + gapX) + nodeW / 2}
            y={12}
            textAnchor="middle"
            className="fill-text-tertiary"
            fontSize="9"
            fontWeight="600"
          >
            {phase}
          </text>
        ))}

        {/* Vertical connection lines */}
        {PHASES.map((_, pi) => {
          const x = startX + pi * (nodeW + gapX) + nodeW / 2;
          return (
            <motion.line
              key={`vline-${pi}`}
              x1={x} y1={startY + nodeH}
              x2={x} y2={startY + 3 * rowH}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray="3 3"
              strokeOpacity={0.4}
              initial={false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 + pi * 0.1 }}
            />
          );
        })}

        {/* Rows (bottom to top) */}
        {LEVELS.map((level, li) => {
          const y = startY + (3 - li) * rowH;

          return (
            <motion.g
              key={level.label}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: li * 0.2, duration: 0.4 }}
            >
              {/* Level label (left) */}
              <text x={8} y={y + nodeH / 2 - 4} className="fill-text-tertiary" fontSize="8" fontWeight="600">
                {level.label}
              </text>
              <text x={8} y={y + nodeH / 2 + 6} fontSize="7" fill={level.color}>
                {level.years}
              </text>

              {/* Nodes */}
              {level.nodes.map((node, pi) => {
                const x = startX + pi * (nodeW + gapX);

                return (
                  <g key={`${li}-${pi}`}>
                    <motion.rect
                      x={x} y={y} width={nodeW} height={nodeH} rx={6}
                      fill={`${level.color}10`}
                      stroke={level.color}
                      strokeWidth={0.8}
                      strokeOpacity={0.5}
                    />
                    <text
                      x={x + nodeW / 2} y={y + (showTech ? 18 : nodeH / 2 + 2)}
                      textAnchor="middle"
                      className="fill-text-secondary"
                      fontSize="8"
                    >
                      {node}
                    </text>
                    {showTech && (
                      <text
                        x={x + nodeW / 2} y={y + 34}
                        textAnchor="middle"
                        fontSize="7"
                        fill={level.color}
                        fontWeight="600"
                      >
                        {level.tech[pi]}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Horizontal connections */}
              {[0, 1, 2].map((pi) => {
                const x1 = startX + pi * (nodeW + gapX) + nodeW;
                const x2 = startX + (pi + 1) * (nodeW + gapX);
                return (
                  <line
                    key={`hline-${li}-${pi}`}
                    x1={x1} y1={y + nodeH / 2}
                    x2={x2} y2={y + nodeH / 2}
                    stroke={level.color}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                );
              })}

              {/* Metric (right) */}
              <text
                x={startX + 4 * (nodeW + gapX) - gapX + 8}
                y={y + nodeH / 2 + 3}
                fontSize="8"
                fontWeight="700"
                fill={level.color}
              >
                {level.metric}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <noscript>
        <div className="rounded-lg border border-border-subtle bg-surface/50 p-4">
          <p className="text-xs font-semibold text-text-primary">Technology examples</p>
          <ul className="mt-2 space-y-2 text-xs text-text-secondary">
            {LEVELS.map((level) => (
              <li key={level.label}>
                <strong className="text-text-primary">{level.label}:</strong>{' '}
                {PHASES.map((phase, phaseIndex) => `${phase}: ${level.tech[phaseIndex]}`).join(' · ')}
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </div>
  );
}
