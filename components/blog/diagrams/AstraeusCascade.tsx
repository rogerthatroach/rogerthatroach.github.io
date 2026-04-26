'use client';

import { memo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import AnimatedEdge from '@/components/diagrams/AnimatedEdge';
import { useThemeColor } from '@/lib/useThemeColor';

/**
 * Astraeus architecture — "The Cascade" diagram.
 *
 * The hero move: two dashed walls cutting the canvas into three bands.
 *   (Band 1) LLM intent side — parse, route, metadata extract
 *   — WALL: no data crosses —
 *   (Band 2) Deterministic Postgres + Cython compute
 *   — WALL: only aggregates return —
 *   (Band 3) LLM synthesis side — 1 or up to 3 subagents, then combine
 *            → delivered as dashboard / chatbot / HTML
 *
 * Nodes are oblong pills (no circles); hero nodes are bigger pills with
 * glow. The walls carry the signature property visibly: the LLM never
 * touches operational data, by construction.
 *
 * A Postgres rail runs beneath the whole canvas — everything reads and
 * writes below: tables, event log, entitlement catalog, audit trail.
 */

// Palette
const LLM = '#8b5cf6';        // LLM calls
const COMPUTE = '#3b82f6';     // deterministic / Cython compute
const ENTITLE = '#f59e0b';     // permission cascade (entitlement chain)
const DATA = '#ea580c';        // Postgres rail
const WALL = '#ef4444';        // wall barrier
const HERO = '#d4a0a7';        // hero accent (same as site accent)
const DELIVERY = '#10b981';    // delivery channels

// ── Node types ───────────────────────────────────────────────────────

interface PillNodeData {
  label: string;
  sub?: string;
  badge?: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

function PillNode({ data }: NodeProps) {
  const d = data as unknown as PillNodeData;
  const [hovered, setHovered] = useState(false);
  const sz = d.size || 'md';
  const padding = sz === 'sm' ? 'px-3 py-1.5' : sz === 'lg' ? 'px-5 py-3' : 'px-4 py-2';
  const labelSize = sz === 'sm' ? 'text-[11px]' : sz === 'lg' ? 'text-sm' : 'text-xs';
  const subSize = sz === 'sm' ? 'text-[9px]' : sz === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <Handle type="target" position={Position.Top} id="t" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} id="b" className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} id="l" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !w-1 !h-1" />

      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        className={`rounded-full border-2 backdrop-blur-sm whitespace-nowrap ${padding}`}
        style={{
          backgroundColor: `${d.color}1f`,
          borderColor: d.color,
          boxShadow: d.glow || hovered
            ? `0 0 24px ${d.color}88, 0 0 8px ${d.color}55`
            : `0 2px 10px ${d.color}33`,
        }}
      >
        {d.badge && (
          <div
            className={`font-mono uppercase tracking-widest font-semibold ${subSize} mb-0.5`}
            style={{ color: d.color }}
          >
            {d.badge}
          </div>
        )}
        <div className={`font-bold leading-tight text-text-primary ${labelSize}`}>
          {d.label}
        </div>
        {d.sub && (
          <div className={`${subSize} text-text-tertiary leading-tight mt-0.5`}>
            {d.sub}
          </div>
        )}
      </motion.div>
    </div>
  );
}
const MemoPill = memo(PillNode);

// Entitlement-chain visual: a horizontal row of 5 small pills joined by
// chevrons. Rendered as a single node to keep the chain compact.
interface ChainNodeData {
  steps: string[];
  color: string;
  label: string;
}

function ChainNode({ data }: NodeProps) {
  const d = data as unknown as ChainNodeData;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} id="t" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} id="b" className="!opacity-0 !w-1 !h-1" />

      <div className="mb-1 text-center">
        <span
          className="font-mono text-[9px] uppercase tracking-widest font-semibold"
          style={{ color: d.color }}
        >
          {d.label}
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-xl border-2 px-3 py-2 backdrop-blur-sm"
           style={{ backgroundColor: `${d.color}10`, borderColor: `${d.color}aa` }}>
        {d.steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <span
              className="rounded-full border px-2 py-0.5 text-[9px] font-mono whitespace-nowrap"
              style={{
                color: d.color,
                borderColor: `${d.color}88`,
                backgroundColor: `${d.color}0a`,
              }}
            >
              {s}
            </span>
            {i < d.steps.length - 1 && (
              <span className="text-[10px]" style={{ color: d.color }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
const MemoChain = memo(ChainNode);

// Wide Postgres rail (reused pattern from PAR diagram)
interface RailNodeData {
  label: string;
  tokens: string[];
  color: string;
  width?: number;
}

function RailNode({ data }: NodeProps) {
  const d = data as unknown as RailNodeData;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <div
        className="rounded-2xl border-2 px-5 py-3 backdrop-blur-sm"
        style={{
          width: d.width ?? 1200,
          backgroundColor: `${d.color}12`,
          borderColor: `${d.color}88`,
          boxShadow: `0 0 22px ${d.color}33, inset 0 0 20px ${d.color}11`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full animate-pulse"
              style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}` }}
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: d.color }}>
              {d.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {d.tokens.map((t) => (
              <span
                key={t}
                className="rounded-md border px-2 py-0.5 text-[10px] font-mono"
                style={{
                  borderColor: `${d.color}55`,
                  color: d.color,
                  backgroundColor: `${d.color}08`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
const MemoRail = memo(RailNode);

// Floating text label (for band titles, sidenotes, callouts)
interface LabelNodeData {
  text: string;
  sub?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md';
  dashedBorder?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

function LabelNode({ data }: NodeProps) {
  const d = data as unknown as LabelNodeData;
  const color = d.color || HERO;
  const sz = d.size || 'sm';
  const align = d.align || 'left';
  return (
    <div
      className={`rounded-md px-2.5 py-1 ${d.dashedBorder ? 'border-2 border-dashed' : ''}`}
      style={{
        borderColor: d.dashedBorder ? `${color}aa` : undefined,
        backgroundColor: d.dashedBorder ? `${color}08` : 'transparent',
        width: d.width,
        textAlign: align,
      }}
    >
      <div
        className={`font-mono uppercase tracking-widest font-semibold leading-snug ${
          sz === 'xs' ? 'text-[9px]' : sz === 'md' ? 'text-xs' : 'text-[10px]'
        }`}
        style={{ color }}
      >
        {d.text}
      </div>
      {d.sub && (
        <div className="text-[9px] text-text-secondary mt-0.5 font-normal normal-case tracking-normal leading-snug">
          {d.sub}
        </div>
      )}
    </div>
  );
}
const MemoLabel = memo(LabelNode);

const nodeTypes = {
  pill: MemoPill,
  chain: MemoChain,
  rail: MemoRail,
  label: MemoLabel,
};
const edgeTypes = { animated: AnimatedEdge };

// ── Layout constants ─────────────────────────────────────────────────
// Canvas ~880w × ~1000h — near-square portrait. Three horizontal bands
// separated by dashed walls. Flow is top → bottom per band. Rows that
// used to be five-wide (LLM intent) or four-wide (synthesis) are now
// stacked so the canvas fits the blog's narrow prose column without
// vertical letterboxing.

const initialNodes: Node[] = [
  // ═══ Envelope label (top-left) ═══
  {
    id: 'env-label',
    type: 'label',
    position: { x: 20, y: 10 },
    data: {
      text: 'LLM never touches operational data · by construction',
      color: HERO,
      size: 'sm',
      dashedBorder: true,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ BAND 1 — LLM intent side ═══
  {
    id: 'band1-label',
    type: 'label',
    position: { x: 20, y: 55 },
    data: {
      text: 'Band 1 · LLM intent (no data touched)',
      color: LLM,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // User query — top center
  {
    id: 'user',
    type: 'pill',
    position: { x: 310, y: 95 },
    data: { label: 'User query', sub: '"headcount × open positions × tenure"', color: HERO, size: 'sm' } satisfies PillNodeData,
    draggable: false,
  },

  // Parse + Route — row 1 of 2 (sequential flow control)
  {
    id: 'parse',
    type: 'pill',
    position: { x: 180, y: 185 },
    data: { badge: 'LLM 1', label: 'Parse intent', sub: 'GPT-4.1', color: LLM, size: 'sm' } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 'route',
    type: 'pill',
    position: { x: 480, y: 185 },
    data: { badge: 'LLM 2', label: 'Route', sub: 'in scope?', color: LLM, size: 'sm' } satisfies PillNodeData,
    draggable: false,
  },

  // Metadata extractors — row 2 of 2 (parallel fan-out, 3-wide)
  { id: 'meta-1', type: 'pill', position: { x: 130, y: 275 }, data: { badge: 'LLM 3', label: 'Headcount',  sub: 'metadata', color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'meta-2', type: 'pill', position: { x: 360, y: 275 }, data: { badge: 'LLM 4', label: 'HR Costs',   sub: 'metadata', color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'meta-3', type: 'pill', position: { x: 590, y: 275 }, data: { badge: 'LLM 5', label: 'Open Pos.',  sub: 'metadata', color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },

  // Sidenote on metadata fan-out
  {
    id: 'sidenote-parallel',
    type: 'label',
    position: { x: 20, y: 290 },
    data: { text: 'up to 3 parallel', sub: 'fires only if relevant', color: LLM, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ WALL 1 — "no data crosses down" ═══
  {
    id: 'wall-1',
    type: 'label',
    position: { x: 160, y: 355 },
    data: {
      text: '═══ WALL · only parsed metadata crosses down ═══',
      color: WALL,
      size: 'xs',
      align: 'center',
      width: 580,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ BAND 2 — Deterministic compute + entitlement ═══
  {
    id: 'band2-label',
    type: 'label',
    position: { x: 20, y: 395 },
    data: {
      text: 'Band 2 · Deterministic · Cython',
      color: COMPUTE,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // Permission cascade (horizontal, centered)
  {
    id: 'entitle-chain',
    type: 'chain',
    position: { x: 185, y: 415 },
    data: {
      label: 'permission cascade (applied before compute)',
      steps: ['domain', 'access', 'entities', 'events', 'SQL'],
      color: ENTITLE,
    } satisfies ChainNodeData,
    draggable: false,
  },

  // Hero node: event-level ins-outs math (narrower sub line)
  {
    id: 'compute',
    type: 'pill',
    position: { x: 180, y: 520 },
    data: {
      badge: 'Hero',
      label: 'Event-level ins-outs math',
      sub: 'Cython · netting · ms over 40K events',
      color: COMPUTE,
      size: 'lg',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // Scale callout — to the right of compute
  {
    id: 'scale-callout',
    type: 'label',
    position: { x: 580, y: 525 },
    data: {
      text: '40K! factorial combinations',
      sub: '~40K events · ~9K rollups · ~80K business · ~60K geography',
      color: HERO,
      size: 'sm',
      dashedBorder: true,
      width: 260,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ WALL 2 — "only aggregates cross back up" ═══
  {
    id: 'wall-2',
    type: 'label',
    position: { x: 160, y: 625 },
    data: {
      text: '═══ WALL · only structured aggregates cross up ═══',
      color: WALL,
      size: 'xs',
      align: 'center',
      width: 580,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ BAND 3 — LLM synthesis + delivery ═══
  {
    id: 'band3-label',
    type: 'label',
    position: { x: 20, y: 665 },
    data: {
      text: 'Band 3 · LLM synthesis (aggregates only)',
      color: LLM,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // Synthesis pills — 4-wide, shortened labels to fit narrow canvas
  {
    id: 'synth-1',
    type: 'pill',
    position: { x: 60, y: 695 },
    data: { badge: 'path A', label: '1 call', sub: 'simple answer', color: LLM, size: 'sm' } satisfies PillNodeData,
    draggable: false,
  },
  { id: 'sub-epm',  type: 'pill', position: { x: 250, y: 695 }, data: { badge: 'path B', label: 'Cost',       color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'sub-hc',   type: 'pill', position: { x: 430, y: 695 }, data: { badge: 'path B', label: 'Headcount',  color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'sub-open', type: 'pill', position: { x: 620, y: 695 }, data: { badge: 'path B', label: 'Open pos.',  color: LLM, size: 'sm' } satisfies PillNodeData, draggable: false },

  // Combine (centered)
  {
    id: 'combine',
    type: 'pill',
    position: { x: 370, y: 780 },
    data: { label: 'Combine', sub: 'one answer', color: HERO, size: 'sm', glow: true } satisfies PillNodeData,
    draggable: false,
  },

  // Delivery channels (3-wide, centered)
  { id: 'deliver-dash', type: 'pill', position: { x: 150, y: 860 }, data: { label: 'Dashboard', color: DELIVERY, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'deliver-chat', type: 'pill', position: { x: 370, y: 860 }, data: { label: 'Chatbot', color: DELIVERY, size: 'sm' } satisfies PillNodeData, draggable: false },
  { id: 'deliver-html', type: 'pill', position: { x: 570, y: 860 }, data: { label: 'HTML reports', sub: 'inbox-ready', color: DELIVERY, size: 'sm' } satisfies PillNodeData, draggable: false },

  // ═══ Postgres backbone rail ═══
  {
    id: 'rail-label',
    type: 'label',
    position: { x: 30, y: 925 },
    data: { text: 'Everything reads/writes below · single Postgres', color: DATA, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'postgres',
    type: 'rail',
    position: { x: 30, y: 955 },
    data: {
      label: 'Postgres backbone',
      color: DATA,
      tokens: ['event log', 'entitlements', 'business hier.', 'geo hier.', 'audit'],
      width: 820,
    } satisfies RailNodeData,
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  // User → parse
  { id: 'e-user-parse', source: 'user', target: 'parse', type: 'animated', data: { color: HERO } },
  // Parse → route
  { id: 'e-parse-route', source: 'parse', target: 'route', type: 'animated', data: { color: LLM } },
  // Route → 3 metadata extractors (fan-out)
  { id: 'e-route-m1', source: 'route', target: 'meta-1', type: 'animated', data: { color: LLM } },
  { id: 'e-route-m2', source: 'route', target: 'meta-2', type: 'animated', data: { color: LLM } },
  { id: 'e-route-m3', source: 'route', target: 'meta-3', type: 'animated', data: { color: LLM } },

  // Metadata → entitlement chain (fan-in to wall)
  { id: 'e-m1-entitle', source: 'meta-1', target: 'entitle-chain', type: 'animated', data: { color: ENTITLE } },
  { id: 'e-m2-entitle', source: 'meta-2', target: 'entitle-chain', type: 'animated', data: { color: ENTITLE } },
  { id: 'e-m3-entitle', source: 'meta-3', target: 'entitle-chain', type: 'animated', data: { color: ENTITLE } },

  // Entitlement → compute (hero)
  { id: 'e-entitle-compute', source: 'entitle-chain', target: 'compute', type: 'animated', data: { color: COMPUTE } },

  // Compute → both synthesis paths (fan-out to paths A + B)
  { id: 'e-compute-synth1', source: 'compute', target: 'synth-1', type: 'animated', data: { color: LLM } },
  { id: 'e-compute-sub-epm', source: 'compute', target: 'sub-epm', type: 'animated', data: { color: LLM } },
  { id: 'e-compute-sub-hc', source: 'compute', target: 'sub-hc', type: 'animated', data: { color: LLM } },
  { id: 'e-compute-sub-open', source: 'compute', target: 'sub-open', type: 'animated', data: { color: LLM } },

  // Both paths → combine
  { id: 'e-synth1-combine', source: 'synth-1', target: 'combine', type: 'animated', data: { color: HERO } },
  { id: 'e-sub-epm-combine', source: 'sub-epm', target: 'combine', type: 'animated', data: { color: HERO } },
  { id: 'e-sub-hc-combine', source: 'sub-hc', target: 'combine', type: 'animated', data: { color: HERO } },
  { id: 'e-sub-open-combine', source: 'sub-open', target: 'combine', type: 'animated', data: { color: HERO } },

  // Combine → delivery channels (fan-out)
  { id: 'e-combine-dash', source: 'combine', target: 'deliver-dash', type: 'animated', data: { color: DELIVERY } },
  { id: 'e-combine-chat', source: 'combine', target: 'deliver-chat', type: 'animated', data: { color: DELIVERY } },
  { id: 'e-combine-html', source: 'combine', target: 'deliver-html', type: 'animated', data: { color: DELIVERY } },
];

export default function AstraeusCascade() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: '880 / 1020' }}
    >
      {/* Two dashed walls — the hero visual. Positioned in % of the
          container so they scale with the responsive aspect-ratio box.
          Y-values are tuned to sit between bands; the textual wall
          labels inside the ReactFlow viewport carry the semantics. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute border-t-2 border-dashed"
        style={{
          left: '10%',
          right: '10%',
          top: '36%',
          borderColor: `${WALL}88`,
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute border-t-2 border-dashed"
        style={{
          left: '10%',
          right: '10%',
          top: '63%',
          borderColor: `${WALL}88`,
          zIndex: 0,
        }}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.04 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__background]:!bg-transparent"
      >
        <Background color={gridColor} gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
