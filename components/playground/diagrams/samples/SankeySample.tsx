'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Hand-rolled SVG Sankey — volume-weighted flow from sources → stages →
 * destinations. Bands show proportional throughput. Synthetic data here
 * represents "requests entering a system, flowing through processing
 * stages, landing at a destination."
 *
 * When to use: showing volume / flow / conservation. How much of X
 * became Y. Good for data pipelines, funnel analysis, budget allocation.
 *
 * No d3-sankey dependency — this is a light, purpose-built SVG version.
 * If you need multi-layer Sankey with crossings, reach for d3-sankey.
 */

interface Flow {
  from: string;
  to: string;
  value: number;
}

const SOURCES = [
  { id: 's1', label: 'Mobile', value: 42 },
  { id: 's2', label: 'Web', value: 28 },
  { id: 's3', label: 'API', value: 18 },
  { id: 's4', label: 'Batch', value: 12 },
];

const STAGES = [
  { id: 'parse', label: 'Parse', value: 100 },
  { id: 'route', label: 'Route', value: 95 },
  { id: 'execute', label: 'Execute', value: 88 },
];

const SINKS = [
  { id: 'cache', label: 'Cache hit', value: 62 },
  { id: 'compute', label: 'Compute', value: 26 },
  { id: 'fail', label: 'Failed', value: 12 },
];

const FLOWS: Flow[] = [
  { from: 's1', to: 'parse', value: 42 },
  { from: 's2', to: 'parse', value: 28 },
  { from: 's3', to: 'parse', value: 18 },
  { from: 's4', to: 'parse', value: 12 },
  { from: 'parse', to: 'route', value: 95 },
  { from: 'route', to: 'execute', value: 88 },
  { from: 'execute', to: 'cache', value: 62 },
  { from: 'execute', to: 'compute', value: 26 },
  { from: 'execute', to: 'fail', value: 12 },
];

const W = 700;
const H = 320;
const COL_X = [20, 200, 380, 560];
const COL_W = 20;

/** Build column positions: for each node, compute (x, yTop, height). */
function layoutColumn(nodes: { id: string; label: string; value: number }[], x: number) {
  const total = nodes.reduce((s, n) => s + n.value, 0);
  const gap = 8;
  const avail = H - 40 - gap * (nodes.length - 1);
  let y = 20;
  const map: Record<string, { x: number; y: number; h: number; value: number; label: string }> = {};
  for (const n of nodes) {
    const h = (n.value / total) * avail;
    map[n.id] = { x, y, h, value: n.value, label: n.label };
    y += h + gap;
  }
  return map;
}

export default function SankeySample() {
  const reduceMotion = useReducedMotion();
  const sources = layoutColumn(SOURCES, COL_X[0]);
  const stages1 = layoutColumn([STAGES[0]], COL_X[1]);
  const stages2 = layoutColumn([STAGES[1]], COL_X[2]);
  // Stages[2] (execute) is wide — contains the fan-out. Put its exit
  // bands at the third column too, fanning into sinks at the fourth.
  const executeCol = layoutColumn([STAGES[2]], COL_X[2]);
  const sinks = layoutColumn(SINKS, COL_X[3]);

  // For simplicity: sources all feed parse; parse feeds route; route feeds
  // execute; execute fans out to 3 sinks. Compute band y-offsets within
  // each node to stack the bands.
  const srcBandOffsets: Record<string, number> = {};
  let srcYCursor: Record<string, number> = { parse: stages1.parse.y };
  for (const flow of FLOWS.filter((f) => f.to === 'parse')) {
    const src = sources[flow.from];
    srcBandOffsets[flow.from] = srcYCursor.parse;
    srcYCursor.parse += src.h;
  }

  const execFanoutY: Record<string, number> = {};
  let execCursor = executeCol.execute.y;
  for (const flow of FLOWS.filter((f) => f.from === 'execute')) {
    const sink = sinks[flow.to];
    execFanoutY[flow.to] = execCursor;
    execCursor += sink.h;
  }

  const bandPath = (
    x1: number,
    y1: number,
    h1: number,
    x2: number,
    y2: number,
    h2: number
  ) => {
    const cx1 = x1 + (x2 - x1) * 0.4;
    const cx2 = x1 + (x2 - x1) * 0.6;
    return `M ${x1} ${y1}
            C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}
            L ${x2} ${y2 + h2}
            C ${cx2} ${y2 + h2}, ${cx1} ${y1 + h1}, ${x1} ${y1 + h1}
            Z`;
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Sankey flow diagram: requests from 4 sources through 3 processing stages to 3 sinks."
    >
      {/* Source → parse bands */}
      {FLOWS.filter((f) => f.to === 'parse').map((flow) => {
        const src = sources[flow.from];
        const yTarget = srcBandOffsets[flow.from];
        return (
          <motion.path
            key={`sp-${flow.from}`}
            d={bandPath(src.x + COL_W, src.y, src.h, stages1.parse.x, yTarget, src.h)}
            fill="var(--color-accent)"
            fillOpacity={0.25}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        );
      })}

      {/* Parse → route band (single, full width) */}
      <motion.path
        d={bandPath(
          stages1.parse.x + COL_W,
          stages1.parse.y,
          stages1.parse.h,
          stages2.route.x,
          stages2.route.y + (stages1.parse.h - stages2.route.h) / 2,
          stages2.route.h
        )}
        fill="var(--color-accent)"
        fillOpacity={0.3}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Route → execute band */}
      <motion.path
        d={bandPath(
          stages2.route.x + COL_W,
          stages2.route.y,
          stages2.route.h,
          executeCol.execute.x,
          executeCol.execute.y + (stages2.route.h - executeCol.execute.h) / 2,
          executeCol.execute.h
        )}
        fill="var(--color-accent)"
        fillOpacity={0.35}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {/* Execute → sinks bands */}
      {FLOWS.filter((f) => f.from === 'execute').map((flow) => {
        const sink = sinks[flow.to];
        const yStart = execFanoutY[flow.to];
        const isFail = flow.to === 'fail';
        return (
          <motion.path
            key={`es-${flow.to}`}
            d={bandPath(executeCol.execute.x + COL_W, yStart, sink.h, sink.x, sink.y, sink.h)}
            fill={isFail ? '#ef4444' : 'var(--color-accent)'}
            fillOpacity={isFail ? 0.4 : 0.3}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        );
      })}

      {/* Nodes */}
      {[sources, stages1, stages2, executeCol, sinks].map((col, ci) =>
        Object.entries(col).map(([id, n]) => (
          <g key={`${ci}-${id}`}>
            <rect
              x={n.x}
              y={n.y}
              width={COL_W}
              height={n.h}
              fill="var(--color-text-primary)"
              rx={2}
            />
            <text
              x={ci < 2 ? n.x + COL_W + 8 : ci === 4 ? n.x - 8 : n.x + COL_W + 8}
              y={n.y + n.h / 2 + 4}
              fontSize={11}
              textAnchor={ci === 4 ? 'end' : 'start'}
              fill="var(--color-text-primary)"
              fontFamily="var(--font-inter), Inter, sans-serif"
            >
              {n.label}{' '}
              <tspan fill="var(--color-text-tertiary)" fontSize={10}>
                {n.value}
              </tspan>
            </text>
          </g>
        ))
      )}
    </svg>
  );
}
