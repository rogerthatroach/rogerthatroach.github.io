'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ModelPoint {
  id: string;
  algorithm: 'Linear' | 'Ridge' | 'RF' | 'GBM' | 'SVR';
  color: string;
  r2: number;
  variance: number;
}

const ALGORITHMS = [
  { name: 'Linear', color: '#3b82f6' },
  { name: 'Ridge', color: '#6366f1' },
  { name: 'RF', color: '#22c55e' },
  { name: 'GBM', color: '#14b8a6' },
  { name: 'SVR', color: '#ef4444' },
] as const;

// Fixed synthetic values make the interaction reproducible. They are not
// production evaluation results and deliberately carry no domain units.
const MODELS: ModelPoint[] = [
  { id: 'linear-1', algorithm: 'Linear', color: '#3b82f6', r2: 0.61, variance: 0.018 },
  { id: 'linear-2', algorithm: 'Linear', color: '#3b82f6', r2: 0.66, variance: 0.024 },
  { id: 'linear-3', algorithm: 'Linear', color: '#3b82f6', r2: 0.69, variance: 0.031 },
  { id: 'linear-4', algorithm: 'Linear', color: '#3b82f6', r2: 0.72, variance: 0.045 },
  { id: 'ridge-1', algorithm: 'Ridge', color: '#6366f1', r2: 0.68, variance: 0.012 },
  { id: 'ridge-2', algorithm: 'Ridge', color: '#6366f1', r2: 0.71, variance: 0.019 },
  { id: 'ridge-3', algorithm: 'Ridge', color: '#6366f1', r2: 0.74, variance: 0.028 },
  { id: 'ridge-4', algorithm: 'Ridge', color: '#6366f1', r2: 0.76, variance: 0.041 },
  { id: 'rf-1', algorithm: 'RF', color: '#22c55e', r2: 0.77, variance: 0.022 },
  { id: 'rf-2', algorithm: 'RF', color: '#22c55e', r2: 0.81, variance: 0.034 },
  { id: 'rf-3', algorithm: 'RF', color: '#22c55e', r2: 0.83, variance: 0.052 },
  { id: 'rf-4', algorithm: 'RF', color: '#22c55e', r2: 0.79, variance: 0.016 },
  { id: 'gbm-1', algorithm: 'GBM', color: '#14b8a6', r2: 0.82, variance: 0.026 },
  { id: 'gbm-2', algorithm: 'GBM', color: '#14b8a6', r2: 0.86, variance: 0.039 },
  { id: 'gbm-3', algorithm: 'GBM', color: '#14b8a6', r2: 0.88, variance: 0.061 },
  { id: 'gbm-4', algorithm: 'GBM', color: '#14b8a6', r2: 0.84, variance: 0.018 },
  { id: 'svr-1', algorithm: 'SVR', color: '#ef4444', r2: 0.73, variance: 0.017 },
  { id: 'svr-2', algorithm: 'SVR', color: '#ef4444', r2: 0.78, variance: 0.033 },
  { id: 'svr-3', algorithm: 'SVR', color: '#ef4444', r2: 0.8, variance: 0.047 },
  { id: 'svr-4', algorithm: 'SVR', color: '#ef4444', r2: 0.76, variance: 0.075 },
];

export default function ModelSelectionScatter() {
  const [varianceThreshold, setVarianceThreshold] = useState(0.04);
  const [selectedId, setSelectedId] = useState('gbm-2');
  const [tabStopId, setTabStopId] = useState('gbm-2');
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const pointRefs = useRef(new Map<string, SVGCircleElement>());

  const filtered = MODELS.filter((model) => model.variance <= varianceThreshold);
  const highestR2 = filtered.length > 0
    ? filtered.reduce((current, candidate) => (current.r2 > candidate.r2 ? current : candidate))
    : null;
  const selected = MODELS.find((model) => model.id === selectedId) ?? MODELS[0];

  const scaleX = (r2: number) => 40 + ((r2 - 0.55) / 0.35) * 380;
  const scaleY = (variance: number) => 260 - (variance / 0.08) * 240;

  const handlePointKeyDown = (event: KeyboardEvent<SVGCircleElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedId(id);
      return;
    }

    const currentIndex = MODELS.findIndex((model) => model.id === id);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % MODELS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + MODELS.length) % MODELS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = MODELS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextId = MODELS[nextIndex].id;
    setTabStopId(nextId);
    pointRefs.current.get(nextId)?.focus();
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <p id="model-selection-note" className="text-xs text-text-tertiary">
        Illustrative synthetic fixture. Every point is fixed for this demo and is not a production measurement.
      </p>

      <div className="flex min-h-11 items-center gap-4">
        <label htmlFor="model-variance-threshold" className="text-xs font-medium text-text-tertiary">
          Maximum fold variance
        </label>
        <input
          id="model-variance-threshold"
          type="range"
          min={0.01}
          max={0.08}
          step={0.005}
          value={varianceThreshold}
          aria-describedby="model-selection-note model-selection-summary"
          onChange={(event) => setVarianceThreshold(Number(event.target.value))}
          className="h-11 flex-1"
        />
        <span className="w-12 font-mono text-xs text-accent">{varianceThreshold.toFixed(3)}</span>
      </div>

      <p id="model-selection-summary" className="text-[10px] text-text-tertiary" role="status" aria-live="polite">
        {filtered.length} of {MODELS.length} synthetic candidates are inside the variance threshold.
        {highestR2 && ` Highest R² among them: ${highestR2.algorithm} ${highestR2.id.split('-').at(-1)} at ${highestR2.r2.toFixed(2)}.`}
      </p>

      <svg
        viewBox="0 0 440 300"
        className="w-full"
        role="group"
        aria-labelledby="model-selection-title model-selection-description"
      >
        <title id="model-selection-title">Synthetic model-selection scatter plot</title>
        <desc id="model-selection-description">
          Fixed candidate points compare R squared with cross-validation fold variance. Use arrow keys to move between
          points, then Enter or Space to select one for details.
        </desc>

        <line
          x1={40}
          y1={scaleY(varianceThreshold)}
          x2={420}
          y2={scaleY(varianceThreshold)}
          className="stroke-red-400/40"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text x={418} y={scaleY(varianceThreshold) - 5} textAnchor="end" fontSize="8" className="fill-red-400/70">
          current threshold
        </text>

        <line x1={40} y1={260} x2={420} y2={260} className="stroke-text-tertiary/30" strokeWidth="0.5" />
        <line x1={40} y1={20} x2={40} y2={260} className="stroke-text-tertiary/30" strokeWidth="0.5" />
        <text x={230} y={290} textAnchor="middle" className="fill-text-tertiary" fontSize="9">R²</text>
        <text x={12} y={140} textAnchor="middle" className="fill-text-tertiary" fontSize="9" transform="rotate(-90, 12, 140)">
          Fold variance
        </text>

        {[0.6, 0.7, 0.8, 0.9].map((value) => (
          <text key={value} x={scaleX(value)} y={275} textAnchor="middle" className="fill-text-tertiary" fontSize="8">
            {value.toFixed(1)}
          </text>
        ))}

        {MODELS.map((model) => {
          const passes = model.variance <= varianceThreshold;
          const isSelected = selectedId === model.id;
          const isFocused = focusedId === model.id;
          const pointNumber = model.id.split('-').at(-1);

          return (
            <g key={model.id}>
              {isSelected && (
                <circle
                  cx={scaleX(model.r2)}
                  cy={scaleY(model.variance)}
                  r={9}
                  fill="none"
                  className="stroke-accent"
                  strokeWidth={2}
                  pointerEvents="none"
                  aria-hidden="true"
                />
              )}
              {isFocused && (
                <circle
                  cx={scaleX(model.r2)}
                  cy={scaleY(model.variance)}
                  r={13}
                  fill="none"
                  className="stroke-text-primary"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  pointerEvents="none"
                  aria-hidden="true"
                />
              )}
              <motion.circle
                ref={(node) => {
                  if (node) pointRefs.current.set(model.id, node);
                  else pointRefs.current.delete(model.id);
                }}
                cx={scaleX(model.r2)}
                cy={scaleY(model.variance)}
                r={5}
                fill={model.color}
                stroke="transparent"
                strokeWidth={34}
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
                initial={false}
                animate={{ opacity: passes ? 0.85 : 0.2 }}
                transition={{ duration: 0.2 }}
                role="button"
                tabIndex={tabStopId === model.id ? 0 : -1}
                aria-pressed={isSelected}
                aria-label={`${model.algorithm} synthetic candidate ${pointNumber}: R squared ${model.r2.toFixed(2)}, fold variance ${model.variance.toFixed(3)}, ${passes ? 'inside' : 'outside'} the current threshold`}
                onClick={(event) => {
                  setSelectedId(model.id);
                  setTabStopId(model.id);
                  event.currentTarget.focus();
                }}
                onFocus={() => {
                  setTabStopId(model.id);
                  setFocusedId(model.id);
                }}
                onBlur={() => setFocusedId(null)}
                onKeyDown={(event) => handlePointKeyDown(event, model.id)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}

        {highestR2 && (
          <circle
            cx={scaleX(highestR2.r2)}
            cy={scaleY(highestR2.variance)}
            r={12}
            fill="none"
            className="stroke-green-400"
            strokeWidth={1}
            strokeDasharray="3 2"
            pointerEvents="none"
            aria-hidden="true"
          />
        )}
      </svg>

      <div className="flex flex-wrap gap-3" aria-label="Algorithm legend">
        {ALGORITHMS.map((algorithm) => (
          <div key={algorithm.name} className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: algorithm.color }} />
            <span className="text-[10px] text-text-tertiary">{algorithm.name}</span>
          </div>
        ))}
      </div>

      <div
        id="model-selection-detail"
        className="rounded-lg border border-border-subtle bg-surface p-3 text-xs"
        role="status"
        aria-live="polite"
      >
        <p className="font-semibold text-text-primary">
          {selected.algorithm} synthetic candidate {selected.id.split('-').at(-1)}
        </p>
        <p className="mt-1 text-text-secondary">
          R² {selected.r2.toFixed(2)} · fold variance {selected.variance.toFixed(3)} ·{' '}
          {selected.variance <= varianceThreshold ? 'inside' : 'outside'} the current variance threshold
        </p>
      </div>
    </div>
  );
}
