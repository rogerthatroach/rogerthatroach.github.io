'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const QUERY_TYPES = [
  { id: 'headcount', label: 'Headcount', activeAgent: 1 },
  { id: 'cost', label: 'Cost/EPM', activeAgent: 0 },
  { id: 'positions', label: 'Open Positions', activeAgent: 2 },
];

const AGENTS = [
  { label: 'EPM Agent', store: 'EPM Store', color: '#8b5cf6' },
  { label: 'HC Agent', store: 'HR Events', color: '#3b82f6' },
  { label: 'OP Agent', store: 'Positions DB', color: '#22c55e' },
];

export default function FullSystemArchitecture() {
  const [queryIdx, setQueryIdx] = useState(0);
  const [showEntitlements, setShowEntitlements] = useState(true);
  const active = QUERY_TYPES[queryIdx].activeAgent;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={queryIdx}
          onChange={(e) => setQueryIdx(Number(e.target.value))}
          className="rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-primary"
        >
          {QUERY_TYPES.map((q, i) => (
            <option key={q.id} value={i}>{q.label} Query</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={showEntitlements}
            onChange={(e) => setShowEntitlements(e.target.checked)}
            className="rounded"
          />
          Show Entitlement Filter
        </label>
      </div>

      <svg viewBox="0 0 480 380" className="w-full" fill="none">
        {/* === INTENT LAYER === */}
        <rect x="20" y="10" width="440" height="100" rx="8" className="fill-blue-500/5 stroke-blue-400/20" strokeWidth="1" />
        <text x="40" y="28" className="fill-blue-400/60" fontSize="8" fontWeight="600">INTENT LAYER — Stateless, Data-Free</text>

        {/* User Query */}
        <rect x="60" y="40" width="90" height="28" rx="5" className="fill-surface stroke-border-subtle" strokeWidth="1" />
        <text x="105" y="58" textAnchor="middle" className="fill-text-secondary" fontSize="9">NL Query</text>

        {/* Arrow */}
        <line x1="150" y1="54" x2="190" y2="54" className="stroke-blue-400/50" strokeWidth="1" />

        {/* LLM Router */}
        <rect x="190" y="36" width="100" height="36" rx="6" className="fill-blue-500/15 stroke-blue-400/50" strokeWidth="1.5" />
        <text x="240" y="52" textAnchor="middle" className="fill-blue-400" fontSize="10" fontWeight="600">LLM Router</text>
        <text x="240" y="64" textAnchor="middle" className="fill-blue-400/60" fontSize="7">🛡 No data access</text>

        {/* Arrow */}
        <line x1="290" y1="54" x2="330" y2="54" className="stroke-blue-400/50" strokeWidth="1" />

        {/* Intent Output */}
        <rect x="330" y="40" width="110" height="28" rx="5" className="fill-surface stroke-border-subtle" strokeWidth="1" />
        <text x="385" y="56" textAnchor="middle" className="fill-text-secondary" fontSize="8">(c, θ, τ, ω)</text>

        {/* === DATA BOUNDARY === */}
        <line x1="20" y1="120" x2="460" y2="120" className="stroke-red-400/50" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="240" y="135" textAnchor="middle" className="fill-red-400/70" fontSize="8" fontWeight="600">DATA BOUNDARY — nothing crosses ↑</text>

        {/* === COMPUTATION LAYER === */}
        <rect x="20" y="145" width="440" height="220" rx="8" className="fill-green-500/5 stroke-green-400/20" strokeWidth="1" />
        <text x="40" y="163" className="fill-green-400/60" fontSize="8" fontWeight="600">COMPUTATION LAYER — Deterministic, Stateful</text>

        {/* Three agent columns */}
        {AGENTS.map((agent, i) => {
          const cx = 100 + i * 140;
          const isActive = i === active;

          return (
            <g key={i}>
              {/* Intent arrow down */}
              <line x1="385" y1="68" x2={cx} y2="176" className="stroke-text-tertiary/20" strokeWidth="0.5" />

              {/* Agent */}
              <motion.rect
                x={cx - 50} y={176} width={100} height={36} rx={6}
                animate={{ opacity: isActive ? 1 : 0.25, strokeWidth: isActive ? 1.5 : 0.5 }}
                fill={isActive ? `${agent.color}15` : 'transparent'}
                stroke={isActive ? agent.color : 'var(--color-border)'}
              />
              <text x={cx} y={198} textAnchor="middle" fontSize="9" fontWeight={isActive ? '600' : '400'}
                fill={isActive ? agent.color : 'var(--color-text-tertiary)'}>
                {agent.label}
              </text>

              {/* Arrow to store */}
              <motion.line
                x1={cx} y1={212} x2={cx} y2={240}
                animate={{ opacity: isActive ? 1 : 0.15 }}
                stroke={isActive ? agent.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1.5 : 0.5}
              />

              {/* Data store */}
              <motion.ellipse
                cx={cx} cy={256} rx={40} ry={14}
                animate={{ opacity: isActive ? 1 : 0.2 }}
                fill={isActive ? `${agent.color}10` : 'transparent'}
                stroke={isActive ? agent.color : 'var(--color-border)'}
                strokeWidth={isActive ? 1 : 0.5}
              />
              <text x={cx} y={260} textAnchor="middle" fontSize="8"
                fill={isActive ? agent.color : 'var(--color-text-tertiary)'}>
                {agent.store}
              </text>
            </g>
          );
        })}

        {/* Entitlement filter */}
        {showEntitlements && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <rect x="40" y="278" width="400" height="24" rx="4" className="fill-amber-500/10 stroke-amber-400/40" strokeWidth="1" strokeDasharray="3 2" />
            <text x="240" y="294" textAnchor="middle" className="fill-amber-400" fontSize="8" fontWeight="600">
              Entitlement Filter — EPM permissions → SQL WHERE clauses
            </text>
          </motion.g>
        )}

        {/* Response formatter */}
        <rect x="150" y="312" width="180" height="32" rx="6" className="fill-surface stroke-border-subtle" strokeWidth="1" />
        <text x="240" y="332" textAnchor="middle" className="fill-text-secondary" fontSize="9">Dashboard · Chatbot · Report</text>

        {/* Merge lines */}
        {AGENTS.map((_, i) => {
          const cx = 100 + i * 140;
          return (
            <line key={`merge-${i}`} x1={cx} y1={270} x2={240} y2={312}
              className="stroke-text-tertiary/20" strokeWidth="0.5" />
          );
        })}
      </svg>
    </div>
  );
}
