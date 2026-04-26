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
 * Commodity Tax architecture — "Pipeline + Transparency Rail" diagram.
 *
 * The hero move: a five-stage compute pipeline on the left, paired
 * with a parallel column of Tableau dashboard taps on the right. Each
 * pipeline stage has a "drill" edge to its dashboard partner. The
 * dashboards aren't where the pipeline emits — they sit alongside it,
 * letting analysts inspect any step independently. Every drill
 * ultimately resolves to a specific source GL row in the analyst-
 * inspector anchor at the bottom.
 *
 * The architectural punchline: transparency is a parallel surface to
 * compute, not a final emission. That's what made stakeholders trust
 * the automation enough to abandon the manual process.
 *
 * Visual register: same canvas + palette family as the Astraeus/Aegis
 * cascades (deterministic blue + Postgres-orange backbone), with
 * transparency as a distinct amber register. Process automation is a
 * different family of system from LLM-as-Router; the diagram signals
 * that without losing site coherence.
 */

// ── Palette ──────────────────────────────────────────────────────────
const COMPUTE = '#3b82f6';      // pipeline stages (deterministic, blue)
const TRANSPARENCY = '#f59e0b'; // Tableau dashboards (attention amber)
const DRILL = '#f59e0b';        // drill edges (same amber, slightly darker visually)
const DATA = '#ea580c';         // CDP backbone rail
const HERO = '#d4a0a7';         // input + final return anchors
const ANALYST = '#10b981';      // analyst-inspector terminus

// ── Pill node ────────────────────────────────────────────────────────
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

// ── Wide CDP rail ────────────────────────────────────────────────────
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
          width: d.width ?? 820,
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

// ── Floating text label ──────────────────────────────────────────────
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
  rail: MemoRail,
  label: MemoLabel,
};
const edgeTypes = { animated: AnimatedEdge };

// ── Layout ───────────────────────────────────────────────────────────
// Canvas ~880w × ~1100h. Vertical pipeline on the LEFT (x ≈ 130);
// parallel dashboard column on the RIGHT (x ≈ 540). Every pipeline
// stage has a horizontal "drill" edge to its dashboard partner. A
// subtle background-tinted column behind the dashboards visually
// signals "transparency rail." CDP backbone runs underneath the whole
// diagram (matches the Postgres rail in Astraeus + Aegis).

const PIPELINE_X = 130;
const DASHBOARD_X = 540;

const initialNodes: Node[] = [
  // ═══ Top thesis label ═══
  {
    id: 'env-label',
    type: 'label',
    position: { x: 20, y: 10 },
    data: {
      text: 'Tableau as transparency layer · 5 stages · drill any step → source GL row',
      color: HERO,
      size: 'sm',
      dashedBorder: true,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ Column labels ═══
  {
    id: 'col-pipeline',
    type: 'label',
    position: { x: PIPELINE_X - 20, y: 60 },
    data: {
      text: 'Pipeline · PySpark on CDP',
      color: COMPUTE,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'col-rail',
    type: 'label',
    position: { x: DASHBOARD_X - 20, y: 60 },
    data: {
      text: 'Tableau transparency rail',
      color: TRANSPARENCY,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ Input ═══
  {
    id: 'input',
    type: 'pill',
    position: { x: PIPELINE_X - 20, y: 110 },
    data: {
      label: 'GL journals',
      sub: '~10–50M rows / cycle',
      color: HERO,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ Pipeline stages ═══
  {
    id: 's1',
    type: 'pill',
    position: { x: PIPELINE_X, y: 200 },
    data: {
      badge: 'S1',
      label: 'Extract',
      sub: 'PySpark · GL pull',
      color: COMPUTE,
      size: 'md',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 's2',
    type: 'pill',
    position: { x: PIPELINE_X, y: 320 },
    data: {
      badge: 'S2',
      label: 'Reconcile',
      sub: 'GL ↔ tax periods',
      color: COMPUTE,
      size: 'md',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 's3',
    type: 'pill',
    position: { x: PIPELINE_X, y: 440 },
    data: {
      badge: 'S3',
      label: 'Category map',
      sub: 'GL acct → tax bucket',
      color: COMPUTE,
      size: 'md',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 's4',
    type: 'pill',
    position: { x: PIPELINE_X, y: 560 },
    data: {
      badge: 'S4',
      label: 'Aggregate',
      sub: 'sum per bucket',
      color: COMPUTE,
      size: 'md',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 's5',
    type: 'pill',
    position: { x: PIPELINE_X, y: 680 },
    data: {
      badge: 'S5',
      label: 'Return',
      sub: 'CFO sign-off ready',
      color: COMPUTE,
      size: 'md',
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ Filed return (output) ═══
  {
    id: 'output',
    type: 'pill',
    position: { x: PIPELINE_X - 8, y: 790 },
    data: {
      label: 'Filed return',
      sub: '$600M tax allocation · 90 min/cycle',
      color: HERO,
      size: 'sm',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ Dashboard taps (transparency rail) ═══
  {
    id: 'd1',
    type: 'pill',
    position: { x: DASHBOARD_X, y: 200 },
    data: {
      badge: 'TAP',
      label: 'GL inspector',
      sub: 'raw row browser',
      color: TRANSPARENCY,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 'd2',
    type: 'pill',
    position: { x: DASHBOARD_X, y: 320 },
    data: {
      badge: 'TAP',
      label: 'Diff view',
      sub: 'reconciliation deltas',
      color: TRANSPARENCY,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 'd3',
    type: 'pill',
    position: { x: DASHBOARD_X, y: 440 },
    data: {
      badge: 'TAP',
      label: 'Mapping audit',
      sub: 'rule → bucket',
      color: TRANSPARENCY,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 'd4',
    type: 'pill',
    position: { x: DASHBOARD_X, y: 560 },
    data: {
      badge: 'TAP',
      label: 'Pivot',
      sub: 'per-bucket roll-up',
      color: TRANSPARENCY,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },
  {
    id: 'd5',
    type: 'pill',
    position: { x: DASHBOARD_X, y: 680 },
    data: {
      badge: 'TAP',
      label: 'Return preview',
      sub: 'final + cited',
      color: TRANSPARENCY,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ Analyst inspector terminus ═══
  {
    id: 'analyst',
    type: 'pill',
    position: { x: DASHBOARD_X - 8, y: 790 },
    data: {
      label: 'Analyst drill-down',
      sub: 'every dashboard → source row',
      color: ANALYST,
      size: 'sm',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ CDP backbone ═══
  {
    id: 'rail-label',
    type: 'label',
    position: { x: 30, y: 880 },
    data: {
      text: 'Everything reads/writes below · CDP (Cloudera Data Platform)',
      color: DATA,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'cdp',
    type: 'rail',
    position: { x: 30, y: 910 },
    data: {
      label: 'CDP backbone',
      color: DATA,
      tokens: ['gl_journals', 'reconciliation', 'mappings', 'aggregations', 'returns', 'audit'],
      width: 820,
    } satisfies RailNodeData,
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  // Vertical pipeline
  { id: 'e-input-s1', source: 'input', target: 's1', type: 'animated', data: { color: HERO } },
  { id: 'e-s1-s2', source: 's1', target: 's2', type: 'animated', data: { color: COMPUTE } },
  { id: 'e-s2-s3', source: 's2', target: 's3', type: 'animated', data: { color: COMPUTE } },
  { id: 'e-s3-s4', source: 's3', target: 's4', type: 'animated', data: { color: COMPUTE } },
  { id: 'e-s4-s5', source: 's4', target: 's5', type: 'animated', data: { color: COMPUTE } },
  { id: 'e-s5-output', source: 's5', target: 'output', type: 'animated', data: { color: HERO } },

  // Horizontal "drill" edges from each pipeline stage to its dashboard
  { id: 'e-s1-d1', source: 's1', target: 'd1', type: 'animated', data: { color: DRILL } },
  { id: 'e-s2-d2', source: 's2', target: 'd2', type: 'animated', data: { color: DRILL } },
  { id: 'e-s3-d3', source: 's3', target: 'd3', type: 'animated', data: { color: DRILL } },
  { id: 'e-s4-d4', source: 's4', target: 'd4', type: 'animated', data: { color: DRILL } },
  { id: 'e-s5-d5', source: 's5', target: 'd5', type: 'animated', data: { color: DRILL } },

  // Vertical rail through dashboards
  { id: 'e-d1-d2', source: 'd1', target: 'd2', type: 'animated', data: { color: TRANSPARENCY } },
  { id: 'e-d2-d3', source: 'd2', target: 'd3', type: 'animated', data: { color: TRANSPARENCY } },
  { id: 'e-d3-d4', source: 'd3', target: 'd4', type: 'animated', data: { color: TRANSPARENCY } },
  { id: 'e-d4-d5', source: 'd4', target: 'd5', type: 'animated', data: { color: TRANSPARENCY } },

  // All dashboards converge on the analyst drill-down
  { id: 'e-d5-analyst', source: 'd5', target: 'analyst', type: 'animated', data: { color: ANALYST } },
];

export default function CommodityTaxPipeline() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: '880 / 980' }}
    >
      {/* Subtle column-tint behind the dashboard rail — visually says
          "this column is the transparency layer" without an explicit
          border. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-2xl"
        style={{
          left: '54%',
          right: '5%',
          top: '6%',
          bottom: '20%',
          backgroundColor: `${TRANSPARENCY}07`,
          border: `1px dashed ${TRANSPARENCY}33`,
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
