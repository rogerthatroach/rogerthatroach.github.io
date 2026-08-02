'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LEVELS = [
  {
    id: 'physical',
    label: 'Physical',
    color: '#f59e0b',
    nodes: ['90+ Sensors', 'Regression Models', 'PSO Candidates', 'Operator Review'],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    color: '#8b5cf6',
    nodes: ['Document Ingestion', 'Entity Extraction', 'Quality Objective', 'Verified Output'],
  },
  {
    id: 'financial',
    label: 'Financial',
    color: '#22c55e',
    nodes: ['GL Data Extraction', 'PySpark Transforms', 'Process Objective', 'CFO Reports'],
  },
  {
    id: 'model-assisted',
    label: 'Model-assisted',
    color: '#3b82f6',
    nodes: ['Policy/Data Ingest', 'LangGraph Workflow', 'Retrieval + Tools', 'Guided Decisions'],
  },
];

const PHASES = ['Observe', 'Estimate', 'Choose', 'Act'];

export default function ClosedLoopCycle() {
  const [activeLevel, setActiveLevel] = useState(0);
  const level = LEVELS[activeLevel];

  // Circle layout
  const cx = 200, cy = 160, r = 100;
  const angles = [-90, 0, 90, 180]; // top, right, bottom, left
  const positions = angles.map((a) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  }));

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an operating-context example">
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLevel(i)}
            aria-pressed={i === activeLevel}
            aria-controls="closed-loop-cycle-chart"
            className={`min-h-11 rounded-md px-3 py-2 text-xs font-medium transition-all ${
              i === activeLevel
                ? 'text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
            style={i === activeLevel ? { backgroundColor: l.color } : {}}
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-tertiary" role="status" aria-live="polite">
        {level.label}: {level.nodes.join(' → ')}
      </p>

      <svg
        id="closed-loop-cycle-chart"
        viewBox="0 0 400 320"
        className="mx-auto w-full max-w-md"
        fill="none"
        role="img"
        aria-labelledby="closed-loop-cycle-title closed-loop-cycle-description"
      >
        <title id="closed-loop-cycle-title">Four-question design cycle</title>
        <desc id="closed-loop-cycle-description">
          An illustrative comparison of observe, estimate, choose, and act across four operating contexts.
        </desc>
        {/* Connecting arcs */}
        {positions.map((pos, i) => {
          const next = positions[(i + 1) % 4];
          return (
            <motion.line
              key={`line-${i}`}
              x1={pos.x} y1={pos.y} x2={next.x} y2={next.y}
              stroke={level.color}
              strokeWidth={1.5}
              strokeOpacity={0.4}
              initial={false}
              animate={{ stroke: level.color }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Arrow heads on lines */}
        {positions.map((pos, i) => {
          const next = positions[(i + 1) % 4];
          const mx = (pos.x + next.x) / 2;
          const my = (pos.y + next.y) / 2;
          const angle = Math.atan2(next.y - pos.y, next.x - pos.x) * (180 / Math.PI);
          return (
            <motion.polygon
              key={`arrow-${i}`}
              points="-5,-4 5,0 -5,4"
              transform={`translate(${mx},${my}) rotate(${angle})`}
              initial={false}
              animate={{ fill: level.color }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-text-tertiary" fontSize="9">
          Environment
        </text>
        <motion.circle
          cx={cx} cy={cy} r={20}
          fill="transparent"
          initial={false}
          animate={{ stroke: level.color }}
          strokeWidth={1}
          strokeOpacity={0.3}
          strokeDasharray="3 3"
        />

        {/* Phase nodes */}
        {positions.map((pos, i) => (
          <g key={`node-${i}`}>
            <motion.rect
              x={pos.x - 55} y={pos.y - 22} width={110} height={44} rx={8}
              fill={`${level.color}15`}
              initial={false}
              animate={{ stroke: level.color }}
              strokeWidth={1.5}
              transition={{ duration: 0.3 }}
            />
            <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize="9" fontWeight="600" fill={level.color}>
              {PHASES[i]}
            </text>
            <motion.text
              key={`${activeLevel}-${i}`}
              x={pos.x} y={pos.y + 10}
              textAnchor="middle"
              className="fill-text-secondary"
              fontSize="8"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {level.nodes[i]}
            </motion.text>
          </g>
        ))}
      </svg>

      <noscript>
        <ul className="space-y-2 rounded-lg border border-border-subtle bg-surface/50 p-4 text-xs text-text-secondary">
          {LEVELS.map((item) => (
            <li key={item.id}>
              <strong className="text-text-primary">{item.label}:</strong>{' '}
              {PHASES.map((phase, phaseIndex) => `${phase}: ${item.nodes[phaseIndex]}`).join(' → ')}
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
