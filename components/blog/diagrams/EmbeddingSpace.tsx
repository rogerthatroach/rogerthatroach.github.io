'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface KpiLabel {
  name: string;
  x: number;
  y: number;
  cluster: 'margin' | 'efficiency' | 'capital' | 'credit' | 'revenue';
}

// Hand-positioned labels for an explanatory lexical demo. Coordinates do not
// come from embeddings, cosine distance, t-SNE, or production data.
const KPIS: KpiLabel[] = [
  { name: 'Net Interest Margin', x: 120, y: 80, cluster: 'margin' },
  { name: 'NIM (Adjusted)', x: 135, y: 95, cluster: 'margin' },
  { name: 'NIM (Domestic)', x: 108, y: 68, cluster: 'margin' },
  { name: 'NIM — Regulatory', x: 142, y: 72, cluster: 'margin' },
  { name: 'Interest Spread', x: 100, y: 90, cluster: 'margin' },
  { name: 'Efficiency Ratio', x: 300, y: 120, cluster: 'efficiency' },
  { name: 'Cost-to-Income', x: 320, y: 105, cluster: 'efficiency' },
  { name: 'Operating Leverage', x: 285, y: 135, cluster: 'efficiency' },
  { name: 'Non-Interest Expense', x: 310, y: 140, cluster: 'efficiency' },
  { name: 'CET1 Ratio', x: 220, y: 260, cluster: 'capital' },
  { name: 'Tier 1 Capital', x: 200, y: 245, cluster: 'capital' },
  { name: 'Leverage Ratio', x: 240, y: 275, cluster: 'capital' },
  { name: 'RWA Density', x: 210, y: 285, cluster: 'capital' },
  { name: 'Total Capital Ratio', x: 235, y: 250, cluster: 'capital' },
  { name: 'PCL Ratio', x: 80, y: 220, cluster: 'credit' },
  { name: 'Gross Impaired Loans', x: 65, y: 240, cluster: 'credit' },
  { name: 'Net Write-offs', x: 95, y: 250, cluster: 'credit' },
  { name: 'Allowance Coverage', x: 75, y: 205, cluster: 'credit' },
  { name: 'Total Revenue', x: 350, y: 240, cluster: 'revenue' },
  { name: 'Non-Interest Income', x: 365, y: 225, cluster: 'revenue' },
  { name: 'Trading Revenue', x: 340, y: 260, cluster: 'revenue' },
  { name: 'Fee Income', x: 370, y: 255, cluster: 'revenue' },
];

const CLUSTER_COLORS: Record<KpiLabel['cluster'], string> = {
  margin: '#f59e0b',
  efficiency: '#22c55e',
  capital: '#3b82f6',
  credit: '#ef4444',
  revenue: '#8b5cf6',
};

const TOKEN_EXPANSIONS: Record<string, string[]> = {
  nim: ['net', 'interest', 'margin'],
  cet1: ['cet1', 'capital'],
  pcl: ['pcl', 'credit'],
  rwa: ['rwa', 'risk', 'weighted', 'assets'],
};

function tokens(value: string): string[] {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((token) => TOKEN_EXPANSIONS[token] ?? [token]);

  return [...new Set(normalized)];
}

function lexicalScore(query: string, kpiName: string): number {
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) return 0;

  const candidateTokens = new Set(tokens(kpiName));
  const matches = queryTokens.filter((token) => candidateTokens.has(token)).length;
  return matches / queryTokens.length;
}

export default function EmbeddingSpace() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return KPIS.map((kpi) => ({ ...kpi, score: lexicalScore(query, kpi.name) }))
      .filter((kpi) => kpi.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 5);
  }, [query]);

  const queryPoint = useMemo(() => {
    if (results.length === 0) return null;
    const totalWeight = results.reduce((sum, result) => sum + result.score, 0);
    return {
      x: results.reduce((sum, result) => sum + result.x * result.score, 0) / totalWeight,
      y: results.reduce((sum, result) => sum + result.y * result.score, 0) / totalWeight,
    };
  }, [results]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p id="lexical-demo-note" className="text-xs text-text-tertiary">
        Illustrative lexical-matching demo. Labels are hand-positioned; geometry is not a learned embedding projection.
        This is not cosine similarity or t-SNE. Scores equal matched normalized query tokens divided by query tokens.
      </p>

      <div className="flex items-center gap-3">
        <label htmlFor="lexical-metric-query" className="text-xs font-medium text-text-tertiary">
          Type a metric
        </label>
        <input
          id="lexical-metric-query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby="lexical-demo-note lexical-demo-status"
          placeholder="e.g., interest margin, CET1, efficiency..."
          className="flex-1 rounded-md border border-border-subtle bg-surface px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <p id="lexical-demo-status" className="text-[10px] text-text-tertiary" role="status" aria-live="polite">
        {!query.trim()
          ? 'Enter a query to highlight deterministic lexical matches.'
          : results.length > 0
            ? `${results.length} lexical match${results.length === 1 ? '' : 'es'}: ${results
                .map((result) => `${result.name} (${result.score.toFixed(2)})`)
                .join('; ')}.`
            : 'No normalized query tokens match these illustrative labels.'}
      </p>

      <noscript>
        <div className="rounded-lg border border-border-subtle bg-surface p-3 text-xs text-text-secondary">
          <p className="font-semibold text-text-primary">Static illustrative label catalog</p>
          <p className="mt-1">The interactive lexical query requires JavaScript. The hand-positioned labels are:</p>
          <ul className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
            {KPIS.map((kpi) => <li key={kpi.name}>{kpi.name}</li>)}
          </ul>
        </div>
      </noscript>

      <svg
        viewBox="0 0 440 320"
        className="w-full"
        role="img"
        aria-labelledby="lexical-demo-title lexical-demo-description"
      >
        <title id="lexical-demo-title">Illustrative lexical metric matching</title>
        <desc id="lexical-demo-description">
          Hand-positioned metric labels grouped for readability. Lines identify the five strongest deterministic token-overlap matches.
        </desc>

        <text x="120" y="50" textAnchor="middle" className="fill-amber-400/60" fontSize="9">Interest Margin</text>
        <text x="305" y="90" textAnchor="middle" className="fill-green-400/60" fontSize="9">Efficiency</text>
        <text x="220" y="305" textAnchor="middle" className="fill-blue-400/60" fontSize="9">Capital</text>
        <text x="78" y="190" textAnchor="middle" className="fill-red-400/60" fontSize="9">Credit</text>
        <text x="355" y="215" textAnchor="middle" className="fill-purple-400/60" fontSize="9">Revenue</text>

        {queryPoint && results.map((result) => (
          <motion.line
            key={`line-${result.name}`}
            x1={queryPoint.x}
            y1={queryPoint.y}
            x2={result.x}
            y2={result.y}
            stroke={CLUSTER_COLORS[result.cluster]}
            strokeWidth={1}
            strokeOpacity={0.5}
            strokeDasharray="3 2"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}

        {queryPoint && results.map((result) => {
          const midpointX = (queryPoint.x + result.x) / 2;
          const midpointY = (queryPoint.y + result.y) / 2;
          return (
            <motion.text
              key={`score-${result.name}`}
              x={midpointX}
              y={midpointY - 4}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill={CLUSTER_COLORS[result.cluster]}
              initial={false}
              animate={{ opacity: 1 }}
            >
              {result.score.toFixed(2)}
            </motion.text>
          );
        })}

        {KPIS.map((kpi) => {
          const match = results.find((result) => result.name === kpi.name);
          return (
            <g key={kpi.name}>
              <circle
                cx={kpi.x}
                cy={kpi.y}
                r={match ? 5 : 3}
                fill={CLUSTER_COLORS[kpi.cluster]}
                opacity={query.trim() ? (match ? 1 : 0.2) : 0.6}
              />
              {match && (
                <text x={kpi.x + 8} y={kpi.y + 3} fontSize="8" className="fill-text-secondary">
                  {kpi.name}
                </text>
              )}
            </g>
          );
        })}

        {queryPoint && (
          <motion.g initial={false} animate={{ scale: 1 }}>
            <circle cx={queryPoint.x} cy={queryPoint.y} r={7} className="fill-accent" />
            <circle cx={queryPoint.x} cy={queryPoint.y} r={12} className="fill-accent/20" />
            <text
              x={queryPoint.x}
              y={queryPoint.y - 14}
              textAnchor="middle"
              className="fill-accent"
              fontSize="9"
              fontWeight="600"
            >
              Query marker
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
