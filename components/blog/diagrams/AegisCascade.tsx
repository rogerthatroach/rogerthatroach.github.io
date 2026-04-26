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
 * Aegis architecture — "The Pipeline + Two Walls" diagram.
 *
 * The hero move: five sequential stages, two dashed walls. The walls
 * carry the architectural punchline visibly:
 *
 *   WALL 1 — no raw data crosses (LLM intent never sees KPI values)
 *   WALL 2 — no free-form SQL emits (only template + parameter binds reach the DB)
 *
 *   Band 1 — Intent (LLM, schema-constrained)
 *   ┄┄ WALL 1 ┄┄
 *   Band 2 — Detect (deterministic embeddings) → Disambiguate (LLM-conditional)
 *   ┄┄ WALL 2 ┄┄
 *   Band 3 — Generate (template + param) → Format (deterministic)
 *
 * The decomposition itself is the guardrail. LLM use is bounded to
 * stages 1 and 3 (3 only when the confidence gate fires); stages 2, 4,
 * 5 are mechanical. Decomposition is what makes this auditable.
 *
 * A Postgres + pgvector backbone runs beneath: kpi_catalog, embeddings,
 * templates, query_log, audit. One store.
 *
 * Visual register matches Astraeus's cascade: same canvas dimensions,
 * same palette, same wall language. Family resemblance is intentional
 * — both systems are LLM-as-Router shapes with different load-bearing
 * pieces.
 */

// ── Palette (mirrors Astraeus for register continuity) ───────────────
const LLM = '#8b5cf6';        // LLM stages (parse, disambiguate-when-fired)
const DET = '#3b82f6';        // deterministic stages (detect, format)
const TEMPLATE = '#14b8a6';   // template-based SQL gen (its own register)
const GATE = '#d4a0a7';       // hero accent — confidence gate keystone
const WALL = '#ef4444';       // wall barriers + clarify-back loop
const DATA = '#ea580c';       // Postgres rail
const RESULT = '#10b981';     // final output

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

// ── Decision node — diamond/hexagonal shape for the confidence gate ──
interface GateNodeData {
  label: string;
  sub?: string;
  color: string;
}

function GateNode({ data }: NodeProps) {
  const d = data as unknown as GateNodeData;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center"
      style={{ width: 180, height: 90 }}
    >
      <Handle type="target" position={Position.Top} id="t" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} id="b" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Left} id="l" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !w-1 !h-1" />

      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
          backgroundColor: `${d.color}22`,
          border: `2px solid ${d.color}`,
          boxShadow: hovered
            ? `0 0 28px ${d.color}aa, 0 0 10px ${d.color}66`
            : `0 0 16px ${d.color}55`,
        }}
      />
      <div className="relative z-10 px-4 text-center">
        <div className="text-[10px] font-bold leading-tight text-text-primary">{d.label}</div>
        {d.sub && (
          <div className="text-[9px] text-text-tertiary leading-tight mt-0.5">{d.sub}</div>
        )}
      </div>
    </div>
  );
}
const MemoGate = memo(GateNode);

// ── Wide Postgres rail (reused pattern) ──────────────────────────────
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
  const color = d.color || GATE;
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
  gate: MemoGate,
  rail: MemoRail,
  label: MemoLabel,
};
const edgeTypes = { animated: AnimatedEdge };

// ── Layout ───────────────────────────────────────────────────────────
// Canvas ~880w × ~1020h — near-square portrait, matches Astraeus.
// Three bands separated by two dashed walls (rendered as overlay div in
// the export below — % positioned so they scale with the responsive
// aspect-ratio container).

const initialNodes: Node[] = [
  // ═══ Top label — the thesis ═══
  {
    id: 'env-label',
    type: 'label',
    position: { x: 20, y: 10 },
    data: {
      text: 'Decomposition is the guardrail · 5 stages · 2 walls · 1 store',
      color: GATE,
      size: 'sm',
      dashedBorder: true,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ BAND 1 — Intent (LLM) ═══
  {
    id: 'band1-label',
    type: 'label',
    position: { x: 20, y: 55 },
    data: {
      text: 'Band 1 · Intent (LLM, schema-constrained)',
      color: LLM,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // User query
  {
    id: 'user',
    type: 'pill',
    position: { x: 320, y: 90 },
    data: {
      label: 'NL query',
      sub: '"NIM vs peer avg, last 3 quarters"',
      color: GATE,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Stage 1 — Parse intent (LLM 1)
  {
    id: 's1',
    type: 'pill',
    position: { x: 280, y: 180 },
    data: {
      badge: 'S1 · LLM 1',
      label: 'Parse intent',
      sub: 'GPT-4.1 · JSON-schema',
      color: LLM,
      size: 'md',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // Schema-validate side note (sub-node showing validation/retry/clarify)
  {
    id: 's1-validate',
    type: 'pill',
    position: { x: 590, y: 195 },
    data: {
      label: 'validate · retry × k',
      sub: 'else clarify',
      color: LLM,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Intent tuple output
  {
    id: 'intent-tuple',
    type: 'pill',
    position: { x: 285, y: 280 },
    data: {
      label: 'I = (μ, τ, δ, ω)',
      sub: 'metric · time · compare · format',
      color: LLM,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ BAND 2 — Detect + Disambiguate ═══
  {
    id: 'band2-label',
    type: 'label',
    position: { x: 20, y: 380 },
    data: {
      text: 'Band 2 · Detect (deterministic) → Disambiguate (LLM if confidence drops)',
      color: DET,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // Stage 2 — KPI detect (embeddings, deterministic)
  {
    id: 's2',
    type: 'pill',
    position: { x: 100, y: 425 },
    data: {
      badge: 'S2 · embeddings',
      label: 'KPI detect',
      sub: 'cosine sim ≥ τ_min',
      color: DET,
      size: 'md',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Candidate set output
  {
    id: 's2-out',
    type: 'pill',
    position: { x: 460, y: 430 },
    data: {
      label: 'K_c · candidates',
      sub: 'top-k matched KPIs',
      color: DET,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Stage 3 — Confidence gate (the keystone)
  {
    id: 's3-gate',
    type: 'gate',
    position: { x: 270, y: 530 },
    data: {
      label: 'p ≥ 1 − ε ?',
      sub: 'confidence gate',
      color: GATE,
    } satisfies GateNodeData,
    draggable: false,
  },

  // Stage 3 LLM 2 — fires only when gate uncertain
  {
    id: 's3-llm',
    type: 'pill',
    position: { x: 580, y: 540 },
    data: {
      badge: 'S3 · LLM 2 (cond.)',
      label: 'LLM disambig.',
      sub: 'name + def, no values',
      color: LLM,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Clarify-back-to-user (loop)
  {
    id: 'clarify',
    type: 'pill',
    position: { x: 60, y: 540 },
    data: {
      label: 'clarify',
      sub: 'ask user · do not guess',
      color: WALL,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Resolved KPI (gate accept output)
  {
    id: 's3-out',
    type: 'pill',
    position: { x: 295, y: 645 },
    data: {
      label: 'k̂ · resolved KPI',
      sub: 'p ≥ 1 − ε',
      color: GATE,
      size: 'sm',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ BAND 3 — Generate + Format (deterministic) ═══
  {
    id: 'band3-label',
    type: 'label',
    position: { x: 20, y: 720 },
    data: {
      text: 'Band 3 · Generate (template + param) → Format (deterministic)',
      color: TEMPLATE,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },

  // Stage 4 — SQL Gen
  {
    id: 's4',
    type: 'pill',
    position: { x: 100, y: 770 },
    data: {
      badge: 'S4 · template + bind',
      label: 'SQL gen',
      sub: 'T(:kpi_id, :period, :entity)',
      color: TEMPLATE,
      size: 'md',
      glow: true,
    } satisfies PillNodeData,
    draggable: false,
  },

  // Validation gates (4-token chip)
  {
    id: 's4-validate',
    type: 'pill',
    position: { x: 470, y: 775 },
    data: {
      label: 'whitelist · AST · SELECT · types',
      sub: 'allow-list + deny-list · defense in depth',
      color: TEMPLATE,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Stage 5 — Format
  {
    id: 's5',
    type: 'pill',
    position: { x: 295, y: 870 },
    data: {
      badge: 'S5 · deterministic',
      label: 'Format result',
      sub: 'table · chart · narrative · ω',
      color: DET,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // Final output
  {
    id: 'output',
    type: 'pill',
    position: { x: 320, y: 945 },
    data: {
      label: 'r · response',
      sub: 'cited, parameterized, audit-logged',
      color: RESULT,
      size: 'sm',
    } satisfies PillNodeData,
    draggable: false,
  },

  // ═══ Postgres + pgvector backbone ═══
  {
    id: 'rail-label',
    type: 'label',
    position: { x: 30, y: 1010 },
    data: {
      text: 'Everything reads/writes below · single Postgres + pgvector',
      color: DATA,
      size: 'xs',
    } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'postgres',
    type: 'rail',
    position: { x: 30, y: 1040 },
    data: {
      label: 'Postgres + pgvector',
      color: DATA,
      tokens: ['kpi_catalog', 'embeddings', 'templates', 'query_log', 'audit'],
      width: 820,
    } satisfies RailNodeData,
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  // User → S1 parse
  { id: 'e-user-s1', source: 'user', target: 's1', type: 'animated', data: { color: GATE } },

  // S1 → validate (sidecar)
  { id: 'e-s1-validate', source: 's1', target: 's1-validate', type: 'animated', data: { color: LLM } },

  // S1 → intent tuple
  { id: 'e-s1-tuple', source: 's1', target: 'intent-tuple', type: 'animated', data: { color: LLM } },

  // Intent tuple crosses Wall 1 → S2 detect
  { id: 'e-tuple-s2', source: 'intent-tuple', target: 's2', type: 'animated', data: { color: DET } },

  // S2 → candidates (out)
  { id: 'e-s2-out', source: 's2', target: 's2-out', type: 'animated', data: { color: DET } },

  // Candidates → confidence gate
  { id: 'e-s2-gate', source: 's2-out', target: 's3-gate', type: 'animated', data: { color: GATE } },

  // Gate → LLM 2 (when uncertain) — RIGHT branch
  { id: 'e-gate-llm', source: 's3-gate', target: 's3-llm', type: 'animated', data: { color: LLM } },

  // LLM 2 → resolved KPI (after disambiguation succeeds)
  { id: 'e-llm-out', source: 's3-llm', target: 's3-out', type: 'animated', data: { color: GATE } },

  // Gate → clarify (when LLM still uncertain) — LEFT branch
  { id: 'e-gate-clarify', source: 's3-gate', target: 'clarify', type: 'animated', data: { color: WALL } },

  // Clarify → back to user (loop)
  { id: 'e-clarify-user', source: 'clarify', target: 'user', type: 'animated', data: { color: WALL } },

  // Gate → resolved (when confidence already high — no LLM needed)
  { id: 'e-gate-out', source: 's3-gate', target: 's3-out', type: 'animated', data: { color: GATE } },

  // Resolved KPI crosses Wall 2 → S4 SQL gen
  { id: 'e-out-s4', source: 's3-out', target: 's4', type: 'animated', data: { color: TEMPLATE } },

  // S4 → validation chip (sidecar)
  { id: 'e-s4-validate', source: 's4', target: 's4-validate', type: 'animated', data: { color: TEMPLATE } },

  // S4 → S5 format
  { id: 'e-s4-s5', source: 's4', target: 's5', type: 'animated', data: { color: DET } },

  // S5 → output
  { id: 'e-s5-out', source: 's5', target: 'output', type: 'animated', data: { color: RESULT } },
];

export default function AegisCascade() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: '880 / 1100' }}
    >
      {/* WALL 1 — between Band 1 (intent) and Band 2 (detect/disambiguate).
          "no raw data crosses · LLM intent never sees KPI values" */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute border-t-2 border-dashed"
        style={{
          left: '8%',
          right: '8%',
          top: '32.5%',
          borderColor: `${WALL}88`,
          zIndex: 0,
        }}
      />
      {/* WALL 2 — between Band 2 (disambiguate) and Band 3 (generate/format).
          "no free-form SQL emits · only template + parameter binds" */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute border-t-2 border-dashed"
        style={{
          left: '8%',
          right: '8%',
          top: '63.5%',
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
