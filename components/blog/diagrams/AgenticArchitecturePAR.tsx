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
import AgentNode, { type AgentNodeData } from '@/components/diagrams/AgentNode';
import AnimatedEdge from '@/components/diagrams/AnimatedEdge';
import { useThemeColor } from '@/lib/useThemeColor';

/**
 * PAR Assist architecture — "the envelope" diagram.
 *
 * One hero visual: a dashed governance envelope that says *this is one
 * agent* from the review side, wrapping a graph whose middle ring fans
 * out into N parallel group-scoped extraction calls, then fans back in
 * to a dict-union merge + coverage loop. The fan-out/fan-in is the whole
 * story of how we got agentic behavior without a multi-agent shape.
 *
 * Layers (top → bottom):
 *   1. Intake — file-type satellites orbit the upload node (5 formats).
 *   2. Template selection (MCP tool) with a mini decision-tree gloss.
 *   3. Stage-1 retrieval HUB — picks which field groups are in play.
 *   4. N parallel lanes — pod → chunks → extraction per group.
 *   5. Merge (dict union) — coverage/follow-ups loop back via clarify.
 *   6. PAR draft — rendered output (live, revisable).
 *
 * Beneath the envelope: the Postgres backbone rail — checkpoints, logs,
 * raw/mapped content, pgvector embeddings, audit trail. One store.
 *
 * A ghosted v2 pill in the bottom-right teases the "skills" evolution.
 */

// ── Palette (hardcoded hex; grid uses theme var) ─────────────────────
const ACCENT = '#d4a0a7';     // envelope / hero hub / template
const ORCH = '#14b8a6';       // orchestration chain
const TOOL = '#f59e0b';       // MCP tools / intake
const RETRIEVAL = '#3b82f6';  // retrieval / groups / chunks
const LLM = '#8b5cf6';        // extraction LLM calls
const DATA = '#ea580c';       // Postgres rail
const LOOP = '#ef4444';       // coverage loop-back edge
const DRAFT = '#10b981';      // output / draft
const GHOST = '#94a3b8';      // v2 teaser

// ── Custom node: small circle with optional side label ───────────────
interface DotNodeData {
  label?: string;
  sub?: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'top' | 'bottom' | 'right' | 'left';
}

function DotNode({ data }: NodeProps) {
  const d = data as unknown as DotNodeData;
  const px = d.size === 'sm' ? 12 : d.size === 'lg' ? 28 : 18;
  const labelPos = d.labelPosition || 'bottom';

  return (
    <div className="relative flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} id="l" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !w-1 !h-1" />

      <motion.div
        whileHover={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="rounded-full border-2 shadow-md"
        style={{
          width: px,
          height: px,
          backgroundColor: `${d.color}cc`,
          borderColor: d.color,
          boxShadow: `0 0 14px ${d.color}55`,
        }}
      />

      {d.label && (
        <div
          className={`absolute whitespace-nowrap pointer-events-none ${
            labelPos === 'bottom' ? 'top-full mt-1 text-center' :
            labelPos === 'top'    ? 'bottom-full mb-1 text-center' :
            labelPos === 'right'  ? 'left-full ml-2 text-left' :
            'right-full mr-2 text-right'
          }`}
        >
          <div className="text-[10px] font-semibold tracking-tight text-text-primary">{d.label}</div>
          {d.sub && <div className="text-[9px] text-text-tertiary">{d.sub}</div>}
        </div>
      )}
    </div>
  );
}
const MemoDot = memo(DotNode);

// ── Custom node: hero hub (large circle with rotating orbital) ───────
interface HubNodeData {
  label: string;
  sub?: string;
  color: string;
  badge?: string;
}

function HubNode({ data }: NodeProps) {
  const d = data as unknown as HubNodeData;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center"
      style={{ width: 120, height: 120 }}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Left} id="l" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !w-1 !h-1" />

      {/* orbital ring (rotates) */}
      <motion.div
        className="absolute rounded-full border-2 border-dashed"
        style={{
          width: 120,
          height: 120,
          borderColor: `${d.color}55`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="rounded-full border-2 backdrop-blur-sm flex flex-col items-center justify-center px-2"
        style={{
          width: 96,
          height: 96,
          backgroundColor: `${d.color}22`,
          borderColor: d.color,
          boxShadow: hovered ? `0 0 36px ${d.color}aa, 0 0 12px ${d.color}` : `0 0 24px ${d.color}66`,
        }}
      >
        {d.badge && (
          <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: d.color }}>
            {d.badge}
          </div>
        )}
        <div className="text-[13px] font-bold text-text-primary leading-tight text-center">
          {d.label}
        </div>
        {d.sub && <div className="text-[8px] text-text-tertiary mt-0.5 leading-tight text-center">{d.sub}</div>}
      </motion.div>
    </div>
  );
}
const MemoHub = memo(HubNode);

// ── Custom node: wide horizontal rail (Postgres backbone) ────────────
interface RailNodeData {
  label: string;
  tokens: string[];
  color: string;
}

function RailNode({ data }: NodeProps) {
  const d = data as unknown as RailNodeData;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Top} id="top" className="!opacity-0 !w-1 !h-1" />

      <div
        className="rounded-2xl border-2 px-6 py-3 backdrop-blur-sm"
        style={{
          width: 720,
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

// ── Custom node: text-only floating label ────────────────────────────
interface LabelNodeData {
  text: string;
  sub?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md';
  dashedBorder?: boolean;
  width?: number;
}

function LabelNode({ data }: NodeProps) {
  const d = data as unknown as LabelNodeData;
  const color = d.color || ACCENT;
  const sz = d.size || 'sm';
  return (
    <div
      className={`rounded-md px-2.5 py-1 ${d.dashedBorder ? 'border-2 border-dashed' : ''}`}
      style={{
        borderColor: d.dashedBorder ? `${color}aa` : undefined,
        backgroundColor: d.dashedBorder ? `${color}08` : 'transparent',
        width: d.width,
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

// ── Node / edge type registries ──────────────────────────────────────
const nodeTypes = {
  agent: AgentNode,
  dot: MemoDot,
  hub: MemoHub,
  rail: MemoRail,
  label: MemoLabel,
};
const edgeTypes = { animated: AnimatedEdge };

// ── Layout constants ─────────────────────────────────────────────────
// Canvas 820w × 1000h. Centerline at x ≈ 400.
const LANE_X = [130, 265, 400, 535, 670];   // 5 visible lanes
const POD_Y = 420;
const CHUNK_Y = 485;
const EXTRACT_Y = 555;

const initialNodes: Node[] = [
  // ═══ Envelope label (top-left badge) ═══
  {
    id: 'env-label',
    type: 'label',
    position: { x: 32, y: 12 },
    data: {
      text: 'Single-agent envelope · v1 governance scope',
      color: ACCENT,
      size: 'sm',
      dashedBorder: true,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ Intake row — file-type satellites + upload card ═══
  { id: 'ft-pptx', type: 'dot', position: { x: 90, y: 108 },  data: { label: '.pptx', color: TOOL, size: 'sm', labelPosition: 'left' } satisfies DotNodeData, draggable: false },
  { id: 'ft-docx', type: 'dot', position: { x: 130, y: 148 }, data: { label: '.docx', color: TOOL, size: 'sm', labelPosition: 'left' } satisfies DotNodeData, draggable: false },
  { id: 'ft-pdf',  type: 'dot', position: { x: 180, y: 188 }, data: { label: '.pdf',  color: TOOL, size: 'sm', labelPosition: 'left' } satisfies DotNodeData, draggable: false },
  { id: 'ft-txt',  type: 'dot', position: { x: 690, y: 120 }, data: { label: '.txt',  color: TOOL, size: 'sm', labelPosition: 'right' } satisfies DotNodeData, draggable: false },
  { id: 'ft-img',  type: 'dot', position: { x: 670, y: 178 }, data: { label: 'image · OCR · 4-turbo', color: TOOL, size: 'sm', labelPosition: 'right' } satisfies DotNodeData, draggable: false },

  {
    id: 'intake',
    type: 'agent',
    position: { x: 338, y: 110 },
    data: {
      label: 'Intake',
      description: 'Normalize pptx / docx / pdf / txt / image-OCR into typed text with source provenance',
      icon: '📥',
      category: 'process',
      accentColor: TOOL,
    } satisfies AgentNodeData,
  },

  // ═══ Template MCP tool + decision-tree satellites ═══
  {
    id: 'template',
    type: 'agent',
    position: { x: 338, y: 210 },
    data: {
      label: 'Template · MCP tool',
      description: 'Decision-tree dialog classifies PAR type · returns typed template-id with confidence + rationale',
      icon: '🧭',
      category: 'orchestrator',
      accentColor: ORCH,
    } satisfies AgentNodeData,
  },
  // mini decision-tree (visual gloss on the right)
  { id: 'dt-q1', type: 'dot', position: { x: 632, y: 222 }, data: { label: 'Q₁', color: ORCH, size: 'sm', labelPosition: 'right' } satisfies DotNodeData, draggable: false },
  { id: 'dt-a',  type: 'dot', position: { x: 605, y: 258 }, data: { color: ORCH, size: 'sm' } satisfies DotNodeData, draggable: false },
  { id: 'dt-b',  type: 'dot', position: { x: 660, y: 258 }, data: { color: ORCH, size: 'sm' } satisfies DotNodeData, draggable: false },
  { id: 'dt-c',  type: 'dot', position: { x: 630, y: 295 }, data: { label: 'decision tree', sub: 'type · tier · exposure', color: ORCH, size: 'sm', labelPosition: 'right' } satisfies DotNodeData, draggable: false },

  // clarify node — target for the coverage → template loop
  {
    id: 'clarify',
    type: 'dot',
    position: { x: 720, y: 312 },
    data: { label: 'clarify', sub: 'follow-ups', color: LOOP, size: 'md', labelPosition: 'right' } satisfies DotNodeData,
    draggable: false,
  },

  // ═══ Stage-1 Groups HUB (hero) ═══
  {
    id: 'hub',
    type: 'hub',
    position: { x: 342, y: 305 },
    data: {
      badge: 'Stage 1',
      label: 'Field Groups',
      sub: 'which groups fire?',
      color: ACCENT,
    } satisfies HubNodeData,
    draggable: false,
  },

  // ═══ Parallel lanes: pods → chunks → extract ═══
  // Group pods
  ...LANE_X.map((x, i) => ({
    id: `pod-${i}`,
    type: 'dot',
    position: { x, y: POD_Y },
    data: {
      label: i === 0 ? 'group₁' : i === 4 ? 'group_N' : '',
      color: RETRIEVAL,
      size: 'md' as const,
      labelPosition: 'top' as const,
    } satisfies DotNodeData,
    draggable: false,
  })),

  // Chunks per pod
  ...LANE_X.map((x, i) => ({
    id: `chunks-${i}`,
    type: 'dot',
    position: { x, y: CHUNK_Y },
    data: { color: RETRIEVAL, size: 'sm' as const } satisfies DotNodeData,
    draggable: false,
  })),

  // Extract LLM calls
  ...LANE_X.map((x, i) => ({
    id: `extract-${i}`,
    type: 'dot',
    position: { x, y: EXTRACT_Y },
    data: { color: LLM, size: 'lg' as const } satisfies DotNodeData,
    draggable: false,
  })),

  // Lane labels (floating left-side)
  {
    id: 'lane-label-pods',
    type: 'label',
    position: { x: 30, y: POD_Y - 4 },
    data: { text: 'relevant groups', color: RETRIEVAL, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'lane-label-chunks',
    type: 'label',
    position: { x: 30, y: CHUNK_Y - 4 },
    data: { text: 'top-10 · compress', color: RETRIEVAL, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'lane-label-extract',
    type: 'label',
    position: { x: 30, y: EXTRACT_Y - 4 },
    data: { text: 'extract → JSON', sub: 'Sonnet 4.5 · ≤20 fields', color: LLM, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },

  // "N calls in parallel" right-side sidenote
  {
    id: 'sidenote-n',
    type: 'label',
    position: { x: 738, y: EXTRACT_Y - 6 },
    data: {
      text: 'N in parallel',
      sub: 'one per group · dict-union on return',
      color: LLM,
      size: 'xs',
      width: 64,
    } satisfies LabelNodeData,
    draggable: false,
  },

  // ═══ Merge · Coverage · Draft ═══
  {
    id: 'merge',
    type: 'agent',
    position: { x: 338, y: 640 },
    data: {
      label: 'Merge · dict union',
      description: 'Disjoint field groups merge deterministically. Conflicts flag for coverage.',
      icon: '🧩',
      category: 'orchestrator',
      accentColor: ORCH,
    } satisfies AgentNodeData,
  },
  {
    id: 'coverage',
    type: 'agent',
    position: { x: 338, y: 740 },
    data: {
      label: 'Coverage + Follow-ups',
      description: 'Checks merged state vs guidelines + few-shot good/bad examples. Surfaces clarification prompts.',
      icon: '🔍',
      category: 'rag',
      accentColor: LOOP,
    } satisfies AgentNodeData,
  },
  {
    id: 'draft',
    type: 'agent',
    position: { x: 338, y: 840 },
    data: {
      label: 'Rendered PAR draft',
      description: 'Every field populated, cited, flagged. Revision continues on live state with full audit.',
      icon: '📄',
      category: 'output',
      accentColor: DRAFT,
    } satisfies AgentNodeData,
  },

  // ═══ Postgres backbone (below envelope) ═══
  {
    id: 'rail-label',
    type: 'label',
    position: { x: 40, y: 930 },
    data: { text: 'Everything reads/writes below', color: DATA, size: 'xs' } satisfies LabelNodeData,
    draggable: false,
  },
  {
    id: 'postgres',
    type: 'rail',
    position: { x: 40, y: 960 },
    data: {
      label: 'Postgres backbone',
      color: DATA,
      tokens: ['checkpoints', 'logs', 'raw', 'mapped', 'pgvector', 'audit'],
    } satisfies RailNodeData,
    draggable: false,
  },

  // ═══ v2 ghost pill (future teaser) ═══
  {
    id: 'v2-ghost',
    type: 'label',
    position: { x: 580, y: 920 },
    data: {
      text: 'v2 · skills + tools',
      sub: 'single-agent envelope ▸ multi-agent graph',
      color: GHOST,
      size: 'sm',
      dashedBorder: true,
    } satisfies LabelNodeData,
    draggable: false,
  },
];

const initialEdges: Edge[] = [
  // file-type chips → intake
  { id: 'e-pptx', source: 'ft-pptx', target: 'intake', type: 'animated', data: { color: TOOL } },
  { id: 'e-docx', source: 'ft-docx', target: 'intake', type: 'animated', data: { color: TOOL } },
  { id: 'e-pdf',  source: 'ft-pdf',  target: 'intake', type: 'animated', data: { color: TOOL } },
  { id: 'e-txt',  source: 'ft-txt',  target: 'intake', type: 'animated', data: { color: TOOL } },
  { id: 'e-img',  source: 'ft-img',  target: 'intake', type: 'animated', data: { color: TOOL } },

  // intake → template
  { id: 'e-intake-template', source: 'intake', target: 'template', type: 'animated', data: { color: ORCH } },

  // template ↔ decision-tree gloss
  { id: 'e-template-dt', source: 'template', target: 'dt-q1', type: 'animated', data: { color: ORCH } },
  { id: 'e-dt-a',  source: 'dt-q1', target: 'dt-a', type: 'animated', data: { color: ORCH } },
  { id: 'e-dt-b',  source: 'dt-q1', target: 'dt-b', type: 'animated', data: { color: ORCH } },
  { id: 'e-dt-c',  source: 'dt-b',  target: 'dt-c', type: 'animated', data: { color: ORCH } },

  // template → hub
  { id: 'e-template-hub', source: 'template', target: 'hub', type: 'animated', data: { color: ACCENT } },

  // hub → 5 group pods (fan-out)
  ...LANE_X.map((_, i) => ({
    id: `e-hub-pod-${i}`,
    source: 'hub',
    target: `pod-${i}`,
    type: 'animated',
    data: { color: RETRIEVAL },
  })),

  // pod → chunks → extract (per lane)
  ...LANE_X.flatMap((_, i) => [
    { id: `e-pod-chunks-${i}`, source: `pod-${i}`, target: `chunks-${i}`, type: 'animated', data: { color: RETRIEVAL } },
    { id: `e-chunks-extract-${i}`, source: `chunks-${i}`, target: `extract-${i}`, type: 'animated', data: { color: LLM } },
  ]),

  // 5 extract → merge (fan-in)
  ...LANE_X.map((_, i) => ({
    id: `e-extract-merge-${i}`,
    source: `extract-${i}`,
    target: 'merge',
    type: 'animated',
    data: { color: LLM },
  })),

  // merge → coverage → draft
  { id: 'e-merge-coverage', source: 'merge', target: 'coverage', type: 'animated', data: { color: ORCH } },
  { id: 'e-coverage-draft', source: 'coverage', target: 'draft', type: 'animated', data: { color: DRAFT } },

  // coverage ↻ loop back via clarify node (open follow-ups → re-route)
  { id: 'e-loop-cover-clarify', source: 'coverage', target: 'clarify', type: 'animated', data: { color: LOOP } },
  { id: 'e-loop-clarify-template', source: 'clarify', target: 'template', type: 'animated', data: { color: LOOP } },
];

// ── The component ────────────────────────────────────────────────────
export default function AgenticArchitecturePAR() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div className="relative h-[1020px] w-full">
      {/* Dashed envelope overlay — visually wraps the single-agent region */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-3xl border-2 border-dashed"
        style={{
          left: 22,
          top: 42,
          width: 780,
          height: 870,
          borderColor: `${ACCENT}77`,
          boxShadow: `inset 0 0 40px ${ACCENT}0c`,
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
