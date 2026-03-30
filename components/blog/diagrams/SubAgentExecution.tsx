'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUERY_TYPES = [
  { id: 'headcount', label: 'Headcount Query', agent: 1, time: 120, color: '#3b82f6' },
  { id: 'cost', label: 'Cost Analysis', agent: 0, time: 180, color: '#8b5cf6' },
  { id: 'positions', label: 'Open Positions', agent: 2, time: 90, color: '#22c55e' },
] as const;

const AGENTS = [
  { label: 'EPM Agent', sublabel: 'Cost & Entitlements' },
  { label: 'HC Agent', sublabel: 'Headcount & Transits' },
  { label: 'OP Agent', sublabel: 'Open Positions' },
];

export default function SubAgentExecution() {
  const [selected, setSelected] = useState(0);
  const query = QUERY_TYPES[selected];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Dropdown */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-text-tertiary">Query type:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-primary"
        >
          {QUERY_TYPES.map((q, i) => (
            <option key={q.id} value={i}>{q.label}</option>
          ))}
        </select>
      </div>

      <svg viewBox="0 0 500 320" className="w-full" fill="none">
        {/* Router */}
        <rect x="190" y="10" width="120" height="36" rx="8" className="fill-blue-500/15 stroke-blue-400/50" strokeWidth="1.5" />
        <text x="250" y="32" textAnchor="middle" className="fill-blue-400" fontSize="11" fontWeight="600">LLM Router</text>

        {/* Lines from router to agents */}
        {AGENTS.map((_, i) => {
          const x = 90 + i * 160;
          return (
            <line key={i} x1="250" y1="46" x2={x} y2="80" className="stroke-text-tertiary/40" strokeWidth="1" />
          );
        })}

        {/* Agent tracks */}
        {AGENTS.map((agent, i) => {
          const x = 90 + i * 160;
          const isActive = i === query.agent;
          return (
            <g key={i}>
              {/* Agent box */}
              <motion.rect
                x={x - 55} y={80} width={110} height={40} rx={6}
                animate={{ opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                fill={isActive ? `${query.color}20` : 'transparent'}
                stroke={isActive ? query.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1.5 : 0.5}
              />
              <text x={x} y={98} textAnchor="middle" className="fill-text-primary" fontSize="10" fontWeight={isActive ? '600' : '400'}>
                {agent.label}
              </text>
              <text x={x} y={112} textAnchor="middle" className="fill-text-tertiary" fontSize="8">
                {agent.sublabel}
              </text>

              {/* Data flow arrow */}
              <motion.line
                x1={x} y1={120} x2={x} y2={160}
                animate={{ opacity: isActive ? 1 : 0.15 }}
                stroke={isActive ? query.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1.5 : 0.5}
              />

              {/* DB */}
              <motion.ellipse
                cx={x} cy={178} rx={30} ry={12}
                animate={{ opacity: isActive ? 1 : 0.2 }}
                fill={isActive ? `${query.color}15` : 'transparent'}
                stroke={isActive ? query.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1 : 0.5}
              />
              <text x={x} y={182} textAnchor="middle" className="fill-text-tertiary" fontSize="8">
                {['EPM Store', 'HR Events', 'Positions'][i]}
              </text>

              {/* Result arrow */}
              <motion.line
                x1={x} y1={190} x2={x} y2={220}
                animate={{ opacity: isActive ? 1 : 0.15 }}
                stroke={isActive ? query.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1.5 : 0.5}
              />

              {/* Timing bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.rect
                    x={x - 40} y={225} width={80} height={20} rx={4}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                    transition={{ duration: 0.5 }}
                    fill={`${query.color}25`}
                    stroke={query.color}
                    strokeWidth={1}
                    style={{ originX: `${x}px` }}
                  />
                )}
              </AnimatePresence>
              {isActive && (
                <text x={x} y={239} textAnchor="middle" fill={query.color} fontSize="9" fontWeight="600">
                  {QUERY_TYPES[selected].time}ms
                </text>
              )}
            </g>
          );
        })}

        {/* Merge point */}
        <line x1="90" y1="250" x2="410" y2="250" className="stroke-border-subtle" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Response */}
        <rect x="190" y="260" width="120" height="36" rx="8" className="fill-surface stroke-border-subtle" strokeWidth="1" />
        <text x="250" y="282" textAnchor="middle" className="fill-text-secondary" fontSize="10">Response Formatter</text>

        {/* Timing note */}
        <text x="250" y="315" textAnchor="middle" className="fill-text-tertiary" fontSize="9">
          Parallel: latency = max(agents), not sum
        </text>
      </svg>
    </div>
  );
}
