'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Simulated model evaluation data — 50 candidates
function generateModels() {
  const algorithms = [
    { name: 'Linear', color: '#3b82f6' },
    { name: 'Ridge', color: '#6366f1' },
    { name: 'RF', color: '#22c55e' },
    { name: 'GBM', color: '#14b8a6' },
    { name: 'SVR', color: '#ef4444' },
  ];

  const models = [];
  for (let i = 0; i < 50; i++) {
    const algo = algorithms[i % 5];
    const baseR2 = algo.name === 'GBM' ? 0.85 : algo.name === 'RF' ? 0.8 : algo.name === 'SVR' ? 0.75 : algo.name === 'Ridge' ? 0.7 : 0.65;
    const r2 = Math.min(0.99, baseR2 + (Math.random() - 0.3) * 0.3);
    const variance = algo.name === 'GBM' ? 0.01 + Math.random() * 0.06 :
                     algo.name === 'SVR' ? 0.02 + Math.random() * 0.08 :
                     0.005 + Math.random() * 0.04;
    models.push({
      id: i,
      algorithm: algo.name,
      color: algo.color,
      r2: Math.max(0.4, r2),
      variance,
      rmse: (1 - r2) * 50 + Math.random() * 10,
      mape: (1 - r2) * 30 + Math.random() * 5,
      mae: (1 - r2) * 40 + Math.random() * 8,
    });
  }
  return models;
}

const MODELS = generateModels();

export default function ModelSelectionScatter() {
  const [sigmaMax, setSigmaMax] = useState(0.04);
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = useMemo(
    () => MODELS.filter((m) => m.variance < sigmaMax),
    [sigmaMax]
  );

  // Scale to SVG coordinates
  const scaleX = (r2: number) => 40 + (r2 - 0.4) * (380 / 0.6);
  const scaleY = (v: number) => 260 - (v / 0.1) * 240;

  const best = filtered.length > 0 ? filtered.reduce((a, b) => (a.r2 > b.r2 ? a : b)) : null;
  const hoveredModel = hovered !== null ? MODELS[hovered] : null;

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Slider */}
      <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-text-tertiary">
          σ²_max threshold:
        </label>
        <input
          type="range"
          min={0.01}
          max={0.1}
          step={0.005}
          value={sigmaMax}
          onChange={(e) => setSigmaMax(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-12 font-mono text-xs text-accent">{sigmaMax.toFixed(3)}</span>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
        <span>{filtered.length} / {MODELS.length} models pass stability filter</span>
        {best && (
          <span className="text-green-400">Best: {best.algorithm} (R² = {best.r2.toFixed(3)})</span>
        )}
      </div>

      {/* Scatter */}
      <svg viewBox="0 0 440 300" className="w-full">
        {/* Acceptable region */}
        <rect
          x={scaleX(0.75)} y={scaleY(sigmaMax)}
          width={scaleX(1) - scaleX(0.75)} height={scaleY(0) - scaleY(sigmaMax)}
          className="fill-green-500/5"
          rx="4"
        />

        {/* Sigma threshold line */}
        <line
          x1={40} y1={scaleY(sigmaMax)} x2={420} y2={scaleY(sigmaMax)}
          className="stroke-red-400/40" strokeWidth="1" strokeDasharray="4 3"
        />
        <text x={425} y={scaleY(sigmaMax) + 3} fontSize="8" className="fill-red-400/60">σ²_max</text>

        {/* Axes */}
        <line x1={40} y1={260} x2={420} y2={260} className="stroke-text-tertiary/30" strokeWidth="0.5" />
        <line x1={40} y1={20} x2={40} y2={260} className="stroke-text-tertiary/30" strokeWidth="0.5" />
        <text x={230} y={290} textAnchor="middle" className="fill-text-tertiary" fontSize="9">R²</text>
        <text x={12} y={140} textAnchor="middle" className="fill-text-tertiary" fontSize="9" transform="rotate(-90, 12, 140)">Fold Variance</text>

        {/* Axis ticks */}
        {[0.4, 0.6, 0.8, 1.0].map((v) => (
          <text key={v} x={scaleX(v)} y={275} textAnchor="middle" className="fill-text-tertiary" fontSize="8">{v}</text>
        ))}

        {/* Points */}
        {MODELS.map((m) => {
          const passes = m.variance < sigmaMax;
          return (
            <motion.circle
              key={m.id}
              cx={scaleX(m.r2)}
              cy={scaleY(m.variance)}
              r={hovered === m.id ? 6 : 4}
              fill={m.color}
              animate={{ opacity: passes ? 0.8 : 0.15 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {/* Best marker */}
        {best && (
          <circle
            cx={scaleX(best.r2)}
            cy={scaleY(best.variance)}
            r={8}
            fill="none"
            className="stroke-green-400"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {['Linear', 'Ridge', 'RF', 'GBM', 'SVR'].map((name, i) => (
          <div key={name} className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#3b82f6', '#6366f1', '#22c55e', '#14b8a6', '#ef4444'][i] }} />
            <span className="text-[10px] text-text-tertiary">{name}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredModel && (
        <div className="rounded-lg border border-border-subtle bg-surface p-3 text-xs">
          <p className="font-semibold text-text-primary">{hoveredModel.algorithm} — Model #{hoveredModel.id}</p>
          <div className="mt-1 grid grid-cols-5 gap-2 text-text-secondary">
            <span>R²: <strong>{hoveredModel.r2.toFixed(3)}</strong></span>
            <span>RMSE: {hoveredModel.rmse.toFixed(1)}</span>
            <span>MAPE: {hoveredModel.mape.toFixed(1)}%</span>
            <span>MAE: {hoveredModel.mae.toFixed(1)}</span>
            <span>σ²: {hoveredModel.variance.toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
