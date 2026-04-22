'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Swim-lane diagram — actors on rows, time on columns. Colored blocks
 * show when each actor is active. Arrows show hand-offs.
 *
 * When to use: showing multi-actor orchestration over time. Good for
 * "who did what when" stories, request flows across services, multi-
 * agent handoffs.
 */

const LANES = [
  { id: 'user', label: 'User', color: '#10b981' },
  { id: 'orch', label: 'Orchestrator', color: 'var(--color-accent)' },
  { id: 'tool', label: 'Tool', color: '#f59e0b' },
  { id: 'rag', label: 'RAG', color: '#8b5cf6' },
];

// Each block: laneId, startCol, spanCol, label
const BLOCKS: { lane: string; start: number; span: number; label: string }[] = [
  { lane: 'user', start: 0, span: 1, label: 'query' },
  { lane: 'orch', start: 1, span: 1, label: 'parse' },
  { lane: 'rag', start: 2, span: 2, label: 'retrieve' },
  { lane: 'orch', start: 4, span: 1, label: 'route' },
  { lane: 'tool', start: 5, span: 2, label: 'execute' },
  { lane: 'orch', start: 7, span: 1, label: 'observe' },
  { lane: 'user', start: 8, span: 1, label: 'clarify' },
  { lane: 'orch', start: 9, span: 1, label: 'respond' },
  { lane: 'user', start: 10, span: 1, label: 'receive' },
];

const COLS = 11;
const LANE_H = 60;
const COL_W = 60;
const LABEL_W = 110;
const W = LABEL_W + COL_W * COLS + 20;
const H = LANE_H * LANES.length + 40;

export default function SwimLanesSample() {
  const reduceMotion = useReducedMotion();

  const laneIndex = Object.fromEntries(LANES.map((l, i) => [l.id, i]));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Swim-lane diagram with 4 actor lanes and 11 time steps, showing 9 activity blocks across the request lifecycle."
    >
      {/* Time axis */}
      <text x={LABEL_W} y={16} fontSize={9} fill="var(--color-text-tertiary)" fontFamily="var(--font-jetbrains), JetBrains Mono, monospace" letterSpacing={1.2} style={{ textTransform: 'uppercase' }}>
        time →
      </text>

      {/* Lanes */}
      {LANES.map((lane, i) => (
        <g key={lane.id}>
          {/* Lane background (alternate) */}
          <rect
            x={LABEL_W}
            y={20 + i * LANE_H}
            width={COL_W * COLS}
            height={LANE_H}
            fill={i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)'}
            fillOpacity={0.4}
          />
          {/* Lane label */}
          <text
            x={LABEL_W - 12}
            y={20 + i * LANE_H + LANE_H / 2 + 4}
            fontSize={12}
            textAnchor="end"
            fill="var(--color-text-primary)"
            fontFamily="var(--font-inter), Inter, sans-serif"
            fontWeight={500}
          >
            {lane.label}
          </text>
          {/* Baseline */}
          <line
            x1={LABEL_W}
            y1={20 + i * LANE_H + LANE_H}
            x2={LABEL_W + COL_W * COLS}
            y2={20 + i * LANE_H + LANE_H}
            stroke="var(--color-border)"
            strokeOpacity={0.5}
          />
        </g>
      ))}

      {/* Column ticks */}
      {Array.from({ length: COLS }, (_, i) => (
        <line
          key={`tick-${i}`}
          x1={LABEL_W + (i + 1) * COL_W}
          y1={20}
          x2={LABEL_W + (i + 1) * COL_W}
          y2={20 + LANE_H * LANES.length}
          stroke="var(--color-border)"
          strokeOpacity={0.25}
          strokeDasharray="2 3"
        />
      ))}

      {/* Activity blocks */}
      {BLOCKS.map((b, i) => {
        const lane = LANES.find((l) => l.id === b.lane);
        if (!lane) return null;
        const x = LABEL_W + b.start * COL_W + 4;
        const y = 20 + laneIndex[b.lane] * LANE_H + 12;
        const width = b.span * COL_W - 8;
        const height = LANE_H - 24;
        return (
          <motion.g
            key={`b-${i}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
          >
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={lane.color}
              fillOpacity={0.2}
              stroke={lane.color}
              strokeOpacity={0.8}
              strokeWidth={1.5}
              rx={4}
            />
            <text
              x={x + width / 2}
              y={y + height / 2 + 4}
              fontSize={11}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontFamily="var(--font-inter), Inter, sans-serif"
              fontWeight={500}
            >
              {b.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
