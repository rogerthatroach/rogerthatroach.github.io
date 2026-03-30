'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LEVELS = [
  {
    id: 'physical',
    label: 'Physical',
    color: '#f59e0b',
    nodes: ['90+ Sensors', 'Regression Models', 'PSO', 'Plant Operators'],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    color: '#8b5cf6',
    nodes: ['Document Ingestion', 'Entity Extraction', 'Review Reduction', 'Verified Output'],
  },
  {
    id: 'financial',
    label: 'Financial',
    color: '#22c55e',
    nodes: ['GL Data Extraction', 'PySpark Transforms', 'Process Optimization', 'CFO Reports'],
  },
  {
    id: 'intelligent',
    label: 'Intelligent',
    color: '#3b82f6',
    nodes: ['Policy/Data Ingest', 'LangGraph Agents', 'RAG/MCP Optimization', 'Guided Decisions'],
  },
];

const PHASES = ['Sense', 'Model', 'Optimize', 'Act'];

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
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActiveLevel(i)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
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

      <svg viewBox="0 0 400 320" className="mx-auto w-full max-w-md" fill="none">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {level.nodes[i]}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}
