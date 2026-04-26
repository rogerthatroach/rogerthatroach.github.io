/**
 * Multi-level architecture diagrams for /playground/diagrams.
 *
 * The experiment: can a single system be read usefully at 4 ascending
 * abstraction levels (Overview → System → Orchestration → Tool contract),
 * with click-to-drill between them? If the read holds, promote the best
 * level(s) to the formal blog post.
 *
 * Prometheus is the test subject because it's the flagship (LangGraph +
 * MCP + multi-layer RAG) and already has a canonical one-level diagram
 * in components/diagrams/PARAssistDiagram.tsx — so we have a baseline.
 */

import type { Node, Edge } from '@xyflow/react';
import type { AgentNodeData } from '@/components/diagrams/AgentNode';

/** Extends AgentNodeData with drill-down and rich detail. */
export interface LeveledNodeData extends AgentNodeData {
  /** If set, clicking this node navigates to the level with this id.
   *  Leaf nodes (no drillTo) open the detail panel instead. */
  drillTo?: string;
  /** Rich detail shown in the side panel on click. Optional because
   *  some nodes are purely structural (e.g., the "User" anchor). */
  detail?: {
    heading: string;
    body: string;
    /** Short pseudo-code or schema; shown in a mono block. */
    code?: string;
    links?: { label: string; href: string }[];
  };
}

export interface DiagramLevel {
  id: string;
  title: string;
  subtitle: string;
  /** 0 = highest-level overview; 3 = deepest drill. */
  depth: number;
  /** Accent for this level's chrome (level tab, border). */
  accent: string;
  nodes: Node[];
  edges: Edge[];
}

// ─── Prometheus — four levels ────────────────────────────────────────────

const VIOLET = '#93c5fd';  // Intelligent Systems era — primary (dark-mode 300)

// Level 0 — Overview. One-sentence architecture.
const L0_overview: DiagramLevel = {
  id: 'overview',
  title: 'Overview',
  subtitle: 'What the system is, stated once.',
  depth: 0,
  accent: VIOLET,
  nodes: [
    {
      id: 'author',
      type: 'agent',
      position: { x: 20, y: 80 },
      data: {
        label: 'Author',
        description: 'The human drafting the PAR (Project Approval Request).',
        icon: '👤',
        category: 'user',
      } satisfies LeveledNodeData,
    },
    {
      id: 'platform',
      type: 'agent',
      position: { x: 240, y: 80 },
      data: {
        label: 'Prometheus',
        description: 'Agentic drafting platform. Click to see the system layer.',
        icon: '🧠',
        category: 'orchestrator',
        drillTo: 'system',
        detail: {
          heading: 'Prometheus — agentic drafting platform',
          body:
            "A LangGraph-orchestrated agent guides the author through the PAR template. Deterministic stages handle truth (schema, validation, retrieval); an LLM handles intent (parse query, pick template, resolve ambiguity). Click to drop a layer and see the parser/orchestrator/RAG/responder decomposition.",
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'enterprise',
      type: 'agent',
      position: { x: 470, y: 20 },
      data: {
        label: 'RBC Data',
        description: 'Policy documents, historical PARs, metadata stores.',
        icon: '📚',
        category: 'rag',
      } satisfies LeveledNodeData,
    },
    {
      id: 'doc',
      type: 'agent',
      position: { x: 470, y: 140 },
      data: {
        label: 'PAR Draft',
        description: 'Compliant, retrieval-grounded draft ready for review.',
        icon: '📄',
        category: 'output',
      } satisfies LeveledNodeData,
    },
  ],
  edges: [
    { id: 'author-platform', source: 'author', target: 'platform', type: 'animated', data: { color: VIOLET } },
    { id: 'platform-enterprise', source: 'platform', target: 'enterprise', type: 'animated', data: { color: VIOLET } },
    { id: 'platform-doc', source: 'platform', target: 'doc', type: 'animated', data: { color: VIOLET } },
  ],
};

// Level 1 — System. The production architecture.
const L1_system: DiagramLevel = {
  id: 'system',
  title: 'System',
  subtitle: 'Parse · orchestrate · retrieve · respond. Click the orchestrator to see its state machine.',
  depth: 1,
  accent: VIOLET,
  nodes: [
    {
      id: 'user',
      type: 'agent',
      position: { x: 260, y: 0 },
      data: {
        label: 'User query',
        description: '"I need a PAR for the X1 migration with $2M budget"',
        icon: '💬',
        category: 'user',
      } satisfies LeveledNodeData,
    },
    {
      id: 'parser',
      type: 'agent',
      position: { x: 260, y: 100 },
      data: {
        label: 'Parser',
        description: 'LLM extracts intent: PAR type, fields, scope, constraints.',
        icon: '🧩',
        category: 'process',
      } satisfies LeveledNodeData,
    },
    {
      id: 'orchestrator',
      type: 'agent',
      position: { x: 260, y: 210 },
      data: {
        label: 'LangGraph',
        description: 'Conditional state graph — routes to tools or RAG, loops on ambiguity. Click to see the state machine.',
        icon: '🧠',
        category: 'orchestrator',
        drillTo: 'orchestration',
        detail: {
          heading: 'LangGraph orchestration',
          body:
            'The orchestrator is a deterministic state machine (not an autonomous loop). It routes parsed intent to the right tool or retrieval scope, observes the return, and decides whether to respond or loop back with a clarification. Click to see the state diagram.',
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'template',
      type: 'agent',
      position: { x: 20, y: 340 },
      data: {
        label: 'Template',
        description: 'MCP tool — selects PAR template by type.',
        icon: '📋',
        category: 'tool',
        drillTo: 'tool-template',
        detail: {
          heading: 'Template selector — MCP tool',
          body: 'Click to see the tool contract (input schema, output shape).',
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'field-assign',
      type: 'agent',
      position: { x: 150, y: 340 },
      data: {
        label: 'Field Assign',
        description: 'MCP tool — maps parsed values to template fields.',
        icon: '✏️',
        category: 'tool',
      } satisfies LeveledNodeData,
    },
    {
      id: 'conflict',
      type: 'agent',
      position: { x: 280, y: 340 },
      data: {
        label: 'Conflict',
        description: 'MCP tool — flags contradictions between inputs and policy.',
        icon: '⚖️',
        category: 'tool',
      } satisfies LeveledNodeData,
    },
    {
      id: 'ambiguity',
      type: 'agent',
      position: { x: 420, y: 340 },
      data: {
        label: 'Ambiguity',
        description: 'MCP tool — surfaces cases the author must decide.',
        icon: '❓',
        category: 'tool',
      } satisfies LeveledNodeData,
    },
    {
      id: 'rag-conv',
      type: 'agent',
      position: { x: 550, y: 340 },
      data: {
        label: 'Conv RAG',
        description: 'Conversation history, per-session.',
        icon: '💭',
        category: 'rag',
      } satisfies LeveledNodeData,
    },
    {
      id: 'rag-doc',
      type: 'agent',
      position: { x: 680, y: 340 },
      data: {
        label: 'Doc RAG',
        description: 'Uploaded PDFs/DOCX — per-conversation vector store.',
        icon: '📑',
        category: 'rag',
      } satisfies LeveledNodeData,
    },
    {
      id: 'rag-pol',
      type: 'agent',
      position: { x: 810, y: 340 },
      data: {
        label: 'Policy RAG',
        description: 'Enterprise policy corpus — shared vector store.',
        icon: '📚',
        category: 'rag',
      } satisfies LeveledNodeData,
    },
    {
      id: 'responder',
      type: 'agent',
      position: { x: 260, y: 490 },
      data: {
        label: 'Responder',
        description: 'Formats final draft + citations + confidence markers.',
        icon: '📝',
        category: 'output',
      } satisfies LeveledNodeData,
    },
  ],
  edges: [
    { id: 'u-p', source: 'user', target: 'parser', type: 'animated', data: { color: VIOLET } },
    { id: 'p-o', source: 'parser', target: 'orchestrator', type: 'animated', data: { color: VIOLET } },
    { id: 'o-t1', source: 'orchestrator', target: 'template', type: 'animated', data: { color: VIOLET } },
    { id: 'o-t2', source: 'orchestrator', target: 'field-assign', type: 'animated', data: { color: VIOLET } },
    { id: 'o-t3', source: 'orchestrator', target: 'conflict', type: 'animated', data: { color: VIOLET } },
    { id: 'o-t4', source: 'orchestrator', target: 'ambiguity', type: 'animated', data: { color: VIOLET } },
    { id: 'o-r1', source: 'orchestrator', target: 'rag-conv', type: 'animated', data: { color: VIOLET } },
    { id: 'o-r2', source: 'orchestrator', target: 'rag-doc', type: 'animated', data: { color: VIOLET } },
    { id: 'o-r3', source: 'orchestrator', target: 'rag-pol', type: 'animated', data: { color: VIOLET } },
    { id: 't1-resp', source: 'template', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 't2-resp', source: 'field-assign', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 't3-resp', source: 'conflict', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 't4-resp', source: 'ambiguity', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 'r1-resp', source: 'rag-conv', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 'r2-resp', source: 'rag-doc', target: 'responder', type: 'animated', data: { color: VIOLET } },
    { id: 'r3-resp', source: 'rag-pol', target: 'responder', type: 'animated', data: { color: VIOLET } },
  ],
};

// Level 2 — Orchestration (LangGraph state machine).
const L2_orchestration: DiagramLevel = {
  id: 'orchestration',
  title: 'Orchestration',
  subtitle: 'LangGraph state machine — the conditional edges are the decision.',
  depth: 2,
  accent: VIOLET,
  nodes: [
    {
      id: 'start',
      type: 'agent',
      position: { x: 220, y: 0 },
      data: { label: 'START', description: 'Entry point.', icon: '▶️', category: 'input' } satisfies LeveledNodeData,
    },
    {
      id: 'parse',
      type: 'agent',
      position: { x: 220, y: 90 },
      data: {
        label: 'parse',
        description: 'Extract structured intent from raw query.',
        icon: '🧩',
        category: 'process',
        detail: {
          heading: 'parse node',
          body: 'LLM extracts {par_type, fields_detected, scope, budget, regulatory_flags}. Confidence scored per field. Fields below 0.75 confidence marked for clarification.',
          code: "state = parse(query, session_context)\n  → { par_type, fields, confidence_map }",
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'route',
      type: 'agent',
      position: { x: 220, y: 200 },
      data: {
        label: 'route',
        description: 'Decide: need tool? need retrieval? need clarification? ready to respond?',
        icon: '🔀',
        category: 'orchestrator',
      } satisfies LeveledNodeData,
    },
    {
      id: 'exec-tool',
      type: 'agent',
      position: { x: 20, y: 320 },
      data: {
        label: 'exec_tool',
        description: 'Invoke one of 4 MCP tools (template / field / conflict / ambiguity).',
        icon: '🔧',
        category: 'tool',
      } satisfies LeveledNodeData,
    },
    {
      id: 'retrieve',
      type: 'agent',
      position: { x: 220, y: 320 },
      data: {
        label: 'retrieve',
        description: 'Fan out to the 3 RAG scopes (conv / doc / policy).',
        icon: '📚',
        category: 'rag',
      } satisfies LeveledNodeData,
    },
    {
      id: 'clarify',
      type: 'agent',
      position: { x: 420, y: 320 },
      data: {
        label: 'clarify',
        description: 'Ask author a targeted question; loop back to parse with the answer.',
        icon: '❓',
        category: 'user',
      } satisfies LeveledNodeData,
    },
    {
      id: 'observe',
      type: 'agent',
      position: { x: 220, y: 440 },
      data: {
        label: 'observe',
        description: 'Merge tool/retrieval return into state. Decide: continue or respond?',
        icon: '👁️',
        category: 'process',
      } satisfies LeveledNodeData,
    },
    {
      id: 'respond',
      type: 'agent',
      position: { x: 220, y: 560 },
      data: {
        label: 'respond',
        description: 'Compose final PAR draft with citations.',
        icon: '📝',
        category: 'output',
      } satisfies LeveledNodeData,
    },
    {
      id: 'end',
      type: 'agent',
      position: { x: 220, y: 660 },
      data: { label: 'END', description: 'Exit.', icon: '⏹️', category: 'output' } satisfies LeveledNodeData,
    },
  ],
  edges: [
    { id: 's-p', source: 'start', target: 'parse', type: 'animated', data: { color: VIOLET } },
    { id: 'p-rt', source: 'parse', target: 'route', type: 'animated', data: { color: VIOLET } },
    { id: 'rt-et', source: 'route', target: 'exec-tool', type: 'animated', data: { color: VIOLET, label: 'needs tool' } },
    { id: 'rt-rv', source: 'route', target: 'retrieve', type: 'animated', data: { color: VIOLET, label: 'needs retrieval' } },
    { id: 'rt-cl', source: 'route', target: 'clarify', type: 'animated', data: { color: VIOLET, label: 'ambiguous' } },
    { id: 'et-obs', source: 'exec-tool', target: 'observe', type: 'animated', data: { color: VIOLET } },
    { id: 'rv-obs', source: 'retrieve', target: 'observe', type: 'animated', data: { color: VIOLET } },
    { id: 'cl-p', source: 'clarify', target: 'parse', type: 'animated', data: { color: VIOLET, label: 'loop back' } },
    { id: 'obs-rt', source: 'observe', target: 'route', type: 'animated', data: { color: VIOLET, label: 'continue' } },
    { id: 'obs-rs', source: 'observe', target: 'respond', type: 'animated', data: { color: VIOLET, label: 'ready' } },
    { id: 'rs-e', source: 'respond', target: 'end', type: 'animated', data: { color: VIOLET } },
  ],
};

// Level 3 — Tool contract example (Template selector).
const L3_toolTemplate: DiagramLevel = {
  id: 'tool-template',
  title: 'Tool — Template',
  subtitle: 'MCP tool contract. One of four leaf tools in the system.',
  depth: 3,
  accent: VIOLET,
  nodes: [
    {
      id: 'input',
      type: 'agent',
      position: { x: 20, y: 100 },
      data: {
        label: 'Input',
        description: 'Parsed intent from the orchestrator.',
        icon: '📥',
        category: 'input',
        detail: {
          heading: 'Input schema',
          body: 'MCP tools accept a typed payload. Template selector takes the PAR type + any fields already extracted.',
          code: "{\n  par_type: 'infrastructure' | 'new_product' | 'm_and_a'\n  scope: string\n  budget_cad?: number\n  regulatory_flags?: string[]\n}",
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'logic',
      type: 'agent',
      position: { x: 260, y: 100 },
      data: {
        label: 'Match',
        description: 'Deterministic rules — no LLM — map par_type to one of ~12 templates.',
        icon: '🎯',
        category: 'process',
        detail: {
          heading: 'Selection logic',
          body: 'Deterministic. A decision table maps par_type + scope keywords to the canonical template. LLM is NOT used here — selection is too consequential to leave to probabilistic output. If no rule matches, the tool returns an "uncovered" signal and the orchestrator asks the author.',
        },
      } satisfies LeveledNodeData,
    },
    {
      id: 'output',
      type: 'agent',
      position: { x: 500, y: 100 },
      data: {
        label: 'Output',
        description: 'Template pointer + confidence + rationale.',
        icon: '📤',
        category: 'output',
        detail: {
          heading: 'Output schema',
          body: 'Every tool output carries a confidence score + a rationale field the orchestrator uses to decide whether to trust it or to invoke clarify.',
          code: "{\n  template_id: string\n  confidence: number    // 0..1\n  rationale: string     // human-readable\n  alternatives?: string[]\n}",
        },
      } satisfies LeveledNodeData,
    },
  ],
  edges: [
    { id: 'in-l', source: 'input', target: 'logic', type: 'animated', data: { color: VIOLET } },
    { id: 'l-out', source: 'logic', target: 'output', type: 'animated', data: { color: VIOLET } },
  ],
};

export const PAR_ASSIST_LEVELS: DiagramLevel[] = [
  L0_overview,
  L1_system,
  L2_orchestration,
  L3_toolTemplate,
];
