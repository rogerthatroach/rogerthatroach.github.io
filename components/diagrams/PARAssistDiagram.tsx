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
import AgentNode from './AgentNode';
import AnimatedEdge from './AnimatedEdge';
import type { AgentNodeData } from './AgentNode';

const nodeTypes = { agent: AgentNode };
const edgeTypes = { animated: AnimatedEdge };

const COLOR = '#8b5cf6';

const initialNodes: Node[] = [
  {
    id: 'user',
    type: 'agent',
    position: { x: 250, y: 0 },
    data: {
      label: 'User',
      description: 'PAR author initiates drafting session',
      icon: '👤',
      category: 'user',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'orchestrator',
    type: 'agent',
    position: { x: 250, y: 110 },
    data: {
      label: 'LangGraph',
      description: 'Orchestrates agent state and tool routing',
      icon: '🧠',
      category: 'orchestrator',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'template',
    type: 'agent',
    position: { x: 0, y: 240 },
    data: {
      label: 'Template',
      description: 'MCP tool — selects PAR template',
      icon: '📋',
      category: 'tool',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'field-assign',
    type: 'agent',
    position: { x: 170, y: 240 },
    data: {
      label: 'Field Assign',
      description: 'MCP tool — maps data to PAR fields',
      icon: '✏️',
      category: 'tool',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'conflict',
    type: 'agent',
    position: { x: 340, y: 240 },
    data: {
      label: 'Conflict',
      description: 'MCP tool — resolves conflicting data',
      icon: '⚖️',
      category: 'tool',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'ambiguity',
    type: 'agent',
    position: { x: 510, y: 240 },
    data: {
      label: 'Ambiguity',
      description: 'MCP tool — flags unclear fields',
      icon: '🔍',
      category: 'tool',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-conv',
    type: 'agent',
    position: { x: 60, y: 380 },
    data: {
      label: 'History RAG',
      description: 'Retrieves from conversation context',
      icon: '💬',
      category: 'rag',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-doc',
    type: 'agent',
    position: { x: 250, y: 380 },
    data: {
      label: 'Document RAG',
      description: 'Chunks + embeds uploaded files',
      icon: '📄',
      category: 'rag',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-prompt',
    type: 'agent',
    position: { x: 440, y: 380 },
    data: {
      label: 'Prompt RAG',
      description: 'Field assignment prompts by context',
      icon: '🎯',
      category: 'rag',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'response',
    type: 'agent',
    position: { x: 250, y: 520 },
    data: {
      label: 'Guided PAR Draft',
      description: 'Validated, step-by-step PAR output',
      icon: '✅',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'user', target: 'orchestrator', type: 'animated', data: { color: COLOR } },
  { id: 'e2', source: 'orchestrator', target: 'template', type: 'animated', data: { color: COLOR } },
  { id: 'e3', source: 'orchestrator', target: 'field-assign', type: 'animated', data: { color: COLOR } },
  { id: 'e4', source: 'orchestrator', target: 'conflict', type: 'animated', data: { color: COLOR } },
  { id: 'e5', source: 'orchestrator', target: 'ambiguity', type: 'animated', data: { color: COLOR } },
  { id: 'e6', source: 'template', target: 'rag-conv', type: 'animated', data: { color: COLOR } },
  { id: 'e7', source: 'field-assign', target: 'rag-doc', type: 'animated', data: { color: COLOR } },
  { id: 'e8', source: 'conflict', target: 'rag-doc', type: 'animated', data: { color: COLOR } },
  { id: 'e9', source: 'ambiguity', target: 'rag-prompt', type: 'animated', data: { color: COLOR } },
  { id: 'e10', source: 'rag-conv', target: 'response', type: 'animated', data: { color: COLOR } },
  { id: 'e11', source: 'rag-doc', target: 'response', type: 'animated', data: { color: COLOR } },
  { id: 'e12', source: 'rag-prompt', target: 'response', type: 'animated', data: { color: COLOR } },
];

export default function PARAssistDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-border-subtle bg-surface/50 backdrop-blur-sm sm:h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__background]:!bg-transparent"
      >
        <Background color="#262626" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
