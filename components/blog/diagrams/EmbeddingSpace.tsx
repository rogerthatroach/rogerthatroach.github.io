'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Pre-computed 2D positions simulating t-SNE projection of KPI embeddings
const KPIS = [
  // Interest margin cluster
  { name: 'Net Interest Margin', x: 120, y: 80, cluster: 'margin' },
  { name: 'NIM (Adjusted)', x: 135, y: 95, cluster: 'margin' },
  { name: 'NIM (Domestic)', x: 108, y: 68, cluster: 'margin' },
  { name: 'NIM — Regulatory', x: 142, y: 72, cluster: 'margin' },
  { name: 'Interest Spread', x: 100, y: 90, cluster: 'margin' },
  // Efficiency cluster
  { name: 'Efficiency Ratio', x: 300, y: 120, cluster: 'efficiency' },
  { name: 'Cost-to-Income', x: 320, y: 105, cluster: 'efficiency' },
  { name: 'Operating Leverage', x: 285, y: 135, cluster: 'efficiency' },
  { name: 'Non-Interest Expense', x: 310, y: 140, cluster: 'efficiency' },
  // Capital cluster
  { name: 'CET1 Ratio', x: 220, y: 260, cluster: 'capital' },
  { name: 'Tier 1 Capital', x: 200, y: 245, cluster: 'capital' },
  { name: 'Leverage Ratio', x: 240, y: 275, cluster: 'capital' },
  { name: 'RWA Density', x: 210, y: 285, cluster: 'capital' },
  { name: 'Total Capital Ratio', x: 235, y: 250, cluster: 'capital' },
  // Credit cluster
  { name: 'PCL Ratio', x: 80, y: 220, cluster: 'credit' },
  { name: 'Gross Impaired Loans', x: 65, y: 240, cluster: 'credit' },
  { name: 'Net Write-offs', x: 95, y: 250, cluster: 'credit' },
  { name: 'Allowance Coverage', x: 75, y: 205, cluster: 'credit' },
  // Revenue cluster
  { name: 'Total Revenue', x: 350, y: 240, cluster: 'revenue' },
  { name: 'Non-Interest Income', x: 365, y: 225, cluster: 'revenue' },
  { name: 'Trading Revenue', x: 340, y: 260, cluster: 'revenue' },
  { name: 'Fee Income', x: 370, y: 255, cluster: 'revenue' },
];

const CLUSTER_COLORS: Record<string, string> = {
  margin: '#f59e0b',
  efficiency: '#22c55e',
  capital: '#3b82f6',
  credit: '#ef4444',
  revenue: '#8b5cf6',
};

function cosineSim(query: string, kpiName: string): number {
  // Simplified similarity based on word overlap + fuzzy matching
  const q = query.toLowerCase().split(/\s+/);
  const k = kpiName.toLowerCase().split(/\s+/);
  const common = q.filter((w) => k.some((kw) => kw.includes(w) || w.includes(kw)));
  if (common.length === 0) return 0.1 + Math.random() * 0.2;
  return Math.min(0.98, 0.5 + (common.length / Math.max(q.length, k.length)) * 0.5 + Math.random() * 0.05);
}

export default function EmbeddingSpace() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return KPIS.map((kpi) => ({
      ...kpi,
      sim: cosineSim(query, kpi.name),
    }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 5);
  }, [query]);

  // Query point position — weighted average of top results
  const queryPoint = useMemo(() => {
    if (results.length === 0) return null;
    const totalW = results.reduce((s, r) => s + r.sim, 0);
    return {
      x: results.reduce((s, r) => s + r.x * r.sim, 0) / totalW,
      y: results.reduce((s, r) => s + r.y * r.sim, 0) / totalW,
    };
  }, [results]);

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Search input */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-text-tertiary">Type a metric:</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., interest margin, CET1, efficiency..."
          className="flex-1 rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      {/* Scatter plot */}
      <svg viewBox="0 0 440 320" className="w-full">
        {/* Cluster labels */}
        <text x="120" y="50" textAnchor="middle" className="fill-amber-400/60" fontSize="9">Interest Margin</text>
        <text x="305" y="90" textAnchor="middle" className="fill-green-400/60" fontSize="9">Efficiency</text>
        <text x="220" y="305" textAnchor="middle" className="fill-blue-400/60" fontSize="9">Capital</text>
        <text x="78" y="190" textAnchor="middle" className="fill-red-400/60" fontSize="9">Credit</text>
        <text x="355" y="215" textAnchor="middle" className="fill-purple-400/60" fontSize="9">Revenue</text>

        {/* Connecting lines to query point */}
        {queryPoint && results.map((r, i) => (
          <motion.line
            key={`line-${i}`}
            x1={queryPoint.x} y1={queryPoint.y} x2={r.x} y2={r.y}
            stroke={CLUSTER_COLORS[r.cluster]}
            strokeWidth={1}
            strokeOpacity={0.5}
            strokeDasharray="3 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}

        {/* Similarity labels on lines */}
        {queryPoint && results.map((r, i) => {
          const mx = (queryPoint.x + r.x) / 2;
          const my = (queryPoint.y + r.y) / 2;
          return (
            <motion.text
              key={`sim-${i}`}
              x={mx} y={my - 4}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill={CLUSTER_COLORS[r.cluster]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              {r.sim.toFixed(2)}
            </motion.text>
          );
        })}

        {/* KPI points */}
        {KPIS.map((kpi, i) => {
          const isHighlighted = results.some((r) => r.name === kpi.name);
          return (
            <g key={i}>
              <circle
                cx={kpi.x} cy={kpi.y} r={isHighlighted ? 5 : 3}
                fill={CLUSTER_COLORS[kpi.cluster]}
                opacity={query.trim() ? (isHighlighted ? 1 : 0.2) : 0.6}
              />
              {isHighlighted && (
                <text x={kpi.x + 8} y={kpi.y + 3} fontSize="8" className="fill-text-secondary">
                  {kpi.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Query point */}
        {queryPoint && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <circle cx={queryPoint.x} cy={queryPoint.y} r={7} className="fill-accent" />
            <circle cx={queryPoint.x} cy={queryPoint.y} r={12} className="fill-accent/20" />
            <text x={queryPoint.x} y={queryPoint.y - 14} textAnchor="middle" className="fill-accent" fontSize="9" fontWeight="600">
              Query
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
