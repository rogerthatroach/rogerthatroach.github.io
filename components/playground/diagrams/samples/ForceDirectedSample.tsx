'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Force-directed-style graph with pre-computed positions (no runtime
 * simulation — saves bundle + CPU). Three clusters of synthetic nodes
 * show natural grouping: agent core · tools · RAG scopes.
 *
 * When to use: showing relationships + clusters when the *shape* of the
 * network matters more than any specific edge. Good for "who talks to
 * whom" diagrams, architecture dependency maps, data-lineage graphs.
 *
 * For real force-directed with drag + simulation, d3-force is the
 * standard. This static layout is the 80% case.
 */

interface Node {
  id: string;
  label: string;
  cluster: 'agent' | 'tool' | 'rag';
  x: number;
  y: number;
}

const NODES: Node[] = [
  // Agent cluster (center-top)
  { id: 'a1', label: 'parse', cluster: 'agent', x: 350, y: 80 },
  { id: 'a2', label: 'route', cluster: 'agent', x: 400, y: 130 },
  { id: 'a3', label: 'observe', cluster: 'agent', x: 310, y: 150 },
  { id: 'a4', label: 'respond', cluster: 'agent', x: 360, y: 200 },

  // Tool cluster (left-bottom)
  { id: 't1', label: 'template', cluster: 'tool', x: 100, y: 250 },
  { id: 't2', label: 'field', cluster: 'tool', x: 160, y: 300 },
  { id: 't3', label: 'conflict', cluster: 'tool', x: 90, y: 310 },
  { id: 't4', label: 'ambiguity', cluster: 'tool', x: 200, y: 250 },

  // RAG cluster (right-bottom)
  { id: 'r1', label: 'conv', cluster: 'rag', x: 560, y: 250 },
  { id: 'r2', label: 'doc', cluster: 'rag', x: 620, y: 300 },
  { id: 'r3', label: 'policy', cluster: 'rag', x: 550, y: 320 },
];

const EDGES: [string, string][] = [
  // Agent internal
  ['a1', 'a2'], ['a2', 'a3'], ['a3', 'a2'], ['a3', 'a4'], ['a2', 'a4'],
  // Agent → Tools
  ['a2', 't1'], ['a2', 't2'], ['a2', 't3'], ['a2', 't4'],
  // Agent → RAG
  ['a2', 'r1'], ['a2', 'r2'], ['a2', 'r3'],
  // Tool internal
  ['t1', 't2'], ['t2', 't3'], ['t3', 't4'],
  // RAG internal
  ['r1', 'r2'], ['r2', 'r3'],
];

const CLUSTER_COLOR: Record<Node['cluster'], string> = {
  agent: 'var(--color-accent)',
  tool: '#f59e0b',
  rag: '#8b5cf6',
};

const W = 700;
const H = 400;

export default function ForceDirectedSample() {
  const reduceMotion = useReducedMotion();
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Force-directed graph: 11 nodes in 3 clusters (agent core, tools, RAG scopes) with 19 edges showing intra- and inter-cluster relationships."
    >
      {/* Edges */}
      {EDGES.map(([fromId, toId], i) => {
        const from = nodeById[fromId];
        const to = nodeById[toId];
        if (!from || !to) return null;
        const sameCluster = from.cluster === to.cluster;
        return (
          <motion.line
            key={`e-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--color-text-tertiary)"
            strokeOpacity={sameCluster ? 0.4 : 0.2}
            strokeWidth={sameCluster ? 1.5 : 1}
            initial={reduceMotion ? { opacity: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: i * 0.02 }}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <circle cx={n.x} cy={n.y} r={18} fill={CLUSTER_COLOR[n.cluster]} fillOpacity={0.25} />
          <circle
            cx={n.x}
            cy={n.y}
            r={6}
            fill={CLUSTER_COLOR[n.cluster]}
            stroke="var(--color-bg)"
            strokeWidth={2}
          />
          <text
            x={n.x}
            y={n.y + 32}
            fontSize={11}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontFamily="var(--font-inter), Inter, sans-serif"
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      {/* Cluster labels */}
      {[
        { label: 'agent core', x: 360, y: 40, color: 'var(--color-accent)' },
        { label: 'tools', x: 140, y: 370, color: '#f59e0b' },
        { label: 'rag scopes', x: 580, y: 370, color: '#8b5cf6' },
      ].map((c) => (
        <text
          key={c.label}
          x={c.x}
          y={c.y}
          fontSize={10}
          textAnchor="middle"
          fill={c.color}
          fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
          letterSpacing={1.5}
          style={{ textTransform: 'uppercase' }}
        >
          {c.label}
        </text>
      ))}
    </svg>
  );
}
