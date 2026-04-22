'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Hand-rolled SVG sunburst — hierarchy visualized as concentric rings.
 * Inner ring = top-level categories; outer ring = sub-categories. Ring
 * segment angle = proportional to count/weight.
 *
 * When to use: showing proportional hierarchy when both the total split
 * AND the sub-splits matter. Good for data-volume-across-systems,
 * budget-by-department-by-team, time-spent-by-era-by-project.
 */

interface Leaf {
  label: string;
  value: number;
  parent: string;
}

const LEAVES: Leaf[] = [
  // Agent (40)
  { label: 'parse', value: 12, parent: 'Agent' },
  { label: 'route', value: 14, parent: 'Agent' },
  { label: 'observe', value: 8, parent: 'Agent' },
  { label: 'respond', value: 6, parent: 'Agent' },
  // Tools (30)
  { label: 'template', value: 10, parent: 'Tools' },
  { label: 'field', value: 8, parent: 'Tools' },
  { label: 'conflict', value: 7, parent: 'Tools' },
  { label: 'ambiguity', value: 5, parent: 'Tools' },
  // RAG (20)
  { label: 'conv', value: 4, parent: 'RAG' },
  { label: 'doc', value: 9, parent: 'RAG' },
  { label: 'policy', value: 7, parent: 'RAG' },
  // Other (10)
  { label: 'telemetry', value: 6, parent: 'Other' },
  { label: 'cache', value: 4, parent: 'Other' },
];

const PARENT_ORDER = ['Agent', 'Tools', 'RAG', 'Other'];
const PARENT_COLOR: Record<string, string> = {
  Agent: 'var(--color-accent)',
  Tools: '#f59e0b',
  RAG: '#8b5cf6',
  Other: '#6b7280',
};

const W = 520;
const H = 420;
const CX = W / 2;
const CY = H / 2;
const R_INNER_START = 60;
const R_INNER_END = 110;
const R_OUTER_START = 112;
const R_OUTER_END = 180;

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, a0: number, a1: number) {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const p1 = polar(cx, cy, rOuter, a0);
  const p2 = polar(cx, cy, rOuter, a1);
  const p3 = polar(cx, cy, rInner, a1);
  const p4 = polar(cx, cy, rInner, a0);
  return `M ${p1.x} ${p1.y}
          A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}
          L ${p3.x} ${p3.y}
          A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}
          Z`;
}

export default function SunburstSample() {
  const reduceMotion = useReducedMotion();
  const total = LEAVES.reduce((s, l) => s + l.value, 0);

  // Outer ring: walk leaves in parent order
  let cursor = -Math.PI / 2; // start at top
  const outerSegments = LEAVES.sort((a, b) => PARENT_ORDER.indexOf(a.parent) - PARENT_ORDER.indexOf(b.parent)).map((leaf) => {
    const a0 = cursor;
    const a1 = cursor + (leaf.value / total) * 2 * Math.PI;
    cursor = a1;
    return { ...leaf, a0, a1 };
  });

  // Inner ring: parent totals
  const parentStats = PARENT_ORDER.map((p) => ({
    parent: p,
    value: LEAVES.filter((l) => l.parent === p).reduce((s, l) => s + l.value, 0),
  }));
  let pCursor = -Math.PI / 2;
  const innerSegments = parentStats.map((ps) => {
    const a0 = pCursor;
    const a1 = pCursor + (ps.value / total) * 2 * Math.PI;
    pCursor = a1;
    return { ...ps, a0, a1 };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Sunburst diagram: 4 top-level categories (Agent, Tools, RAG, Other) with 13 sub-categories arranged radially; segment angles proportional to value."
    >
      {/* Outer ring */}
      {outerSegments.map((seg, i) => {
        const angleMid = (seg.a0 + seg.a1) / 2;
        const labelRadius = (R_OUTER_START + R_OUTER_END) / 2;
        const labelPos = polar(CX, CY, labelRadius, angleMid);
        const color = PARENT_COLOR[seg.parent];
        return (
          <motion.g
            key={`o-${seg.label}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
          >
            <path
              d={arcPath(CX, CY, R_OUTER_START, R_OUTER_END, seg.a0, seg.a1)}
              fill={color}
              fillOpacity={0.3}
              stroke="var(--color-bg)"
              strokeWidth={2}
            />
            {seg.a1 - seg.a0 > 0.3 && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                fontSize={10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-primary)"
                fontFamily="var(--font-inter), Inter, sans-serif"
              >
                {seg.label}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Inner ring */}
      {innerSegments.map((seg, i) => {
        const angleMid = (seg.a0 + seg.a1) / 2;
        const labelRadius = (R_INNER_START + R_INNER_END) / 2;
        const labelPos = polar(CX, CY, labelRadius, angleMid);
        const color = PARENT_COLOR[seg.parent];
        return (
          <motion.g
            key={`i-${seg.parent}`}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <path
              d={arcPath(CX, CY, R_INNER_START, R_INNER_END, seg.a0, seg.a1)}
              fill={color}
              fillOpacity={0.6}
              stroke="var(--color-bg)"
              strokeWidth={2}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-bg)"
              fontFamily="var(--font-inter), Inter, sans-serif"
            >
              {seg.parent}
            </text>
          </motion.g>
        );
      })}

      {/* Center — total */}
      <circle cx={CX} cy={CY} r={R_INNER_START - 2} fill="var(--color-surface)" stroke="var(--color-border)" />
      <text
        x={CX}
        y={CY - 4}
        fontSize={10}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
        letterSpacing={1.5}
        style={{ textTransform: 'uppercase' }}
      >
        total
      </text>
      <text
        x={CX}
        y={CY + 14}
        fontSize={20}
        fontWeight={700}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
      >
        {total}
      </text>
    </svg>
  );
}
