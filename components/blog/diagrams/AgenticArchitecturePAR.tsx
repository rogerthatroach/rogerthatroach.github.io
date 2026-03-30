'use client';

import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AgentNode from '@/components/diagrams/AgentNode';
import AnimatedEdge from '@/components/diagrams/AnimatedEdge';
import type { AgentNodeData } from '@/components/diagrams/AgentNode';
import { useThemeColor } from '@/lib/useThemeColor';

const nodeTypes = { agent: AgentNode };
const edgeTypes = { animated: AnimatedEdge };

const PURPLE = '#8b5cf6';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const AMBER = '#f59e0b';
const TEAL = '#14b8a6';

const initialNodes: Node[] = [
  // === User Input ===
  {
    id: 'user',
    type: 'agent',
    position: { x: 280, y: 0 },
    data: {
      label: 'User Input',
      description: 'Natural language query + uploaded documents',
      icon: '👤',
      category: 'user',
      accentColor: PURPLE,
    } satisfies AgentNodeData,
  },
  // === LangGraph Orchestration Layer ===
  {
    id: 'parse',
    type: 'agent',
    position: { x: 60, y: 120 },
    data: {
      label: 'Parse Intent',
      description: 'Extract structured intent from NL input',
      icon: '🔤',
      category: 'orchestrator',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'route',
    type: 'agent',
    position: { x: 220, y: 120 },
    data: {
      label: 'Route',
      description: 'LangGraph state machine selects next action',
      icon: '🧠',
      category: 'orchestrator',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'execute',
    type: 'agent',
    position: { x: 380, y: 120 },
    data: {
      label: 'Execute Tool',
      description: 'Dispatch to MCP tool based on intent',
      icon: '⚡',
      category: 'orchestrator',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'respond',
    type: 'agent',
    position: { x: 540, y: 120 },
    data: {
      label: 'Respond',
      description: 'Format and return guided output',
      icon: '💬',
      category: 'orchestrator',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  // === MCP Tools (Action Layer) ===
  {
    id: 'template',
    type: 'agent',
    position: { x: 0, y: 270 },
    data: {
      label: 'Template Select',
      description: 'MCP tool — semantic similarity against template catalog',
      icon: '📋',
      category: 'tool',
      accentColor: RED,
    } satisfies AgentNodeData,
  },
  {
    id: 'field',
    type: 'agent',
    position: { x: 160, y: 270 },
    data: {
      label: 'Field Assign',
      description: 'MCP tool — NL → structured template fields',
      icon: '✏️',
      category: 'tool',
      accentColor: RED,
    } satisfies AgentNodeData,
  },
  {
    id: 'conflict',
    type: 'agent',
    position: { x: 320, y: 270 },
    data: {
      label: 'Conflict Resolve',
      description: 'MCP tool — surfaces contradictions between sources',
      icon: '⚖️',
      category: 'tool',
      accentColor: RED,
    } satisfies AgentNodeData,
  },
  {
    id: 'ambiguity',
    type: 'agent',
    position: { x: 480, y: 270 },
    data: {
      label: 'Ambiguity Detect',
      description: 'MCP tool — flags vague inputs, generates clarifying Qs',
      icon: '🔍',
      category: 'tool',
      accentColor: RED,
    } satisfies AgentNodeData,
  },
  // === Multi-Layer RAG ===
  {
    id: 'rag-history',
    type: 'agent',
    position: { x: 60, y: 420 },
    data: {
      label: 'L1: History',
      description: 'Conversation context via semantic retrieval (pgvector)',
      icon: '💬',
      category: 'rag',
      accentColor: BLUE,
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-docs',
    type: 'agent',
    position: { x: 260, y: 420 },
    data: {
      label: 'L2: Documents',
      description: 'Format-aware chunked user uploads (PDF, PPTX, DOCX)',
      icon: '📄',
      category: 'rag',
      accentColor: BLUE,
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-knowledge',
    type: 'agent',
    position: { x: 460, y: 420 },
    data: {
      label: 'L3: Knowledge',
      description: 'Institutional policies + prompt template selection',
      icon: '🏛️',
      category: 'rag',
      accentColor: BLUE,
    } satisfies AgentNodeData,
  },
  // === PostgreSQL Backbone ===
  {
    id: 'postgres',
    type: 'agent',
    position: { x: 220, y: 560 },
    data: {
      label: 'PostgreSQL + pgvector',
      description: 'Unified store: workflow state, embeddings, metadata, sessions',
      icon: '🗄️',
      category: 'data',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
  // === Output ===
  {
    id: 'output',
    type: 'agent',
    position: { x: 280, y: 680 },
    data: {
      label: 'Guided PAR Draft',
      description: 'Validated, step-by-step enterprise document output',
      icon: '✅',
      category: 'output',
      accentColor: PURPLE,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  // User → orchestration
  { id: 'e-user-parse', source: 'user', target: 'parse', type: 'animated', data: { color: PURPLE } },
  // Orchestration chain
  { id: 'e-parse-route', source: 'parse', target: 'route', type: 'animated', data: { color: TEAL } },
  { id: 'e-route-exec', source: 'route', target: 'execute', type: 'animated', data: { color: TEAL } },
  { id: 'e-exec-respond', source: 'execute', target: 'respond', type: 'animated', data: { color: TEAL } },
  // Execute → MCP tools
  { id: 'e-exec-template', source: 'execute', target: 'template', type: 'animated', data: { color: RED } },
  { id: 'e-exec-field', source: 'execute', target: 'field', type: 'animated', data: { color: RED } },
  { id: 'e-exec-conflict', source: 'execute', target: 'conflict', type: 'animated', data: { color: RED } },
  { id: 'e-exec-ambiguity', source: 'execute', target: 'ambiguity', type: 'animated', data: { color: RED } },
  // Tools → RAG layers
  { id: 'e-template-hist', source: 'template', target: 'rag-history', type: 'animated', data: { color: BLUE } },
  { id: 'e-field-docs', source: 'field', target: 'rag-docs', type: 'animated', data: { color: BLUE } },
  { id: 'e-conflict-docs', source: 'conflict', target: 'rag-docs', type: 'animated', data: { color: BLUE } },
  { id: 'e-ambiguity-know', source: 'ambiguity', target: 'rag-knowledge', type: 'animated', data: { color: BLUE } },
  // RAG → PostgreSQL
  { id: 'e-hist-pg', source: 'rag-history', target: 'postgres', type: 'animated', data: { color: AMBER } },
  { id: 'e-docs-pg', source: 'rag-docs', target: 'postgres', type: 'animated', data: { color: AMBER } },
  { id: 'e-know-pg', source: 'rag-knowledge', target: 'postgres', type: 'animated', data: { color: AMBER } },
  // PostgreSQL → Output
  { id: 'e-pg-output', source: 'postgres', target: 'output', type: 'animated', data: { color: PURPLE } },
];

export default function AgenticArchitecturePAR() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div className="h-[600px] w-full sm:h-[700px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__background]:!bg-transparent"
      >
        <Background color={gridColor} gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
