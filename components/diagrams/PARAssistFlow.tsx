'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
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

const initialNodes: Node[] = [
  {
    id: 'user',
    type: 'agent',
    position: { x: 300, y: 0 },
    data: {
      label: 'User',
      description: 'Initiates a PAR drafting session with context and documents',
      icon: '👤',
      category: 'user',
    } satisfies AgentNodeData,
  },
  {
    id: 'orchestrator',
    type: 'agent',
    position: { x: 300, y: 130 },
    data: {
      label: 'LangGraph Orchestrator',
      description: 'Manages agent state, routes between tools, maintains conversation context',
      icon: '🧠',
      category: 'orchestrator',
    } satisfies AgentNodeData,
  },
  {
    id: 'template',
    type: 'agent',
    position: { x: 0, y: 290 },
    data: {
      label: 'Template Selection',
      description: 'MCP tool — selects the right PAR template based on project type and metadata',
      icon: '📋',
      category: 'tool',
    } satisfies AgentNodeData,
  },
  {
    id: 'field-assign',
    type: 'agent',
    position: { x: 210, y: 290 },
    data: {
      label: 'Field Assignment',
      description: 'MCP tool — maps extracted information to specific PAR fields using rules and policies',
      icon: '✏️',
      category: 'tool',
    } satisfies AgentNodeData,
  },
  {
    id: 'conflict',
    type: 'agent',
    position: { x: 420, y: 290 },
    data: {
      label: 'Conflict Resolution',
      description: 'MCP tool — detects and resolves conflicting data across documents and history',
      icon: '⚖️',
      category: 'tool',
    } satisfies AgentNodeData,
  },
  {
    id: 'ambiguity',
    type: 'agent',
    position: { x: 630, y: 290 },
    data: {
      label: 'Ambiguity Check',
      description: 'MCP tool — flags unclear or incomplete fields, prompts user for clarification',
      icon: '🔍',
      category: 'tool',
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-conversation',
    type: 'agent',
    position: { x: 80, y: 450 },
    data: {
      label: 'Conversation RAG',
      description: 'Dynamic retrieval from conversation history — ensures no context is lost across turns',
      icon: '💬',
      category: 'rag',
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-documents',
    type: 'agent',
    position: { x: 310, y: 450 },
    data: {
      label: 'Document RAG',
      description: 'Chunking + embedding pipeline for uploaded PDFs, PPTX, DOCX, TXT files',
      icon: '📄',
      category: 'rag',
    } satisfies AgentNodeData,
  },
  {
    id: 'rag-prompts',
    type: 'agent',
    position: { x: 540, y: 450 },
    data: {
      label: 'Prompt RAG',
      description: 'Retrieves relevant field assignment prompts based on context and template',
      icon: '🎯',
      category: 'rag',
    } satisfies AgentNodeData,
  },
  {
    id: 'postgres',
    type: 'agent',
    position: { x: 300, y: 590 },
    data: {
      label: 'PostgreSQL',
      description: 'Persistent storage for embeddings, conversation state, templates, and PAR drafts',
      icon: '🗄️',
      category: 'output',
    } satisfies AgentNodeData,
  },
  {
    id: 'response',
    type: 'agent',
    position: { x: 300, y: 730 },
    data: {
      label: 'Guided PAR Draft',
      description: 'Step-by-step guided output — the completed, validated PAR document',
      icon: '✅',
      category: 'output',
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e-user-orch', source: 'user', target: 'orchestrator', type: 'animated' },
  { id: 'e-orch-template', source: 'orchestrator', target: 'template', type: 'animated' },
  { id: 'e-orch-field', source: 'orchestrator', target: 'field-assign', type: 'animated' },
  { id: 'e-orch-conflict', source: 'orchestrator', target: 'conflict', type: 'animated' },
  { id: 'e-orch-ambiguity', source: 'orchestrator', target: 'ambiguity', type: 'animated' },
  { id: 'e-template-rag-conv', source: 'template', target: 'rag-conversation', type: 'animated' },
  { id: 'e-field-rag-doc', source: 'field-assign', target: 'rag-documents', type: 'animated' },
  { id: 'e-conflict-rag-doc', source: 'conflict', target: 'rag-documents', type: 'animated' },
  { id: 'e-ambiguity-rag-prompt', source: 'ambiguity', target: 'rag-prompts', type: 'animated' },
  { id: 'e-rag-conv-pg', source: 'rag-conversation', target: 'postgres', type: 'animated' },
  { id: 'e-rag-doc-pg', source: 'rag-documents', target: 'postgres', type: 'animated' },
  { id: 'e-rag-prompt-pg', source: 'rag-prompts', target: 'postgres', type: 'animated' },
  { id: 'e-pg-response', source: 'postgres', target: 'response', type: 'animated' },
];

export default function PARAssistFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[700px] w-full overflow-hidden rounded-xl border border-border-subtle bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__background]:!bg-transparent"
      >
        <Background color="#262626" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-surface !border-border-subtle !shadow-lg [&_button]:!bg-surface [&_button]:!border-border-subtle [&_button]:!text-zinc-400 [&_button:hover]:!bg-surface-hover"
        />
      </ReactFlow>
    </div>
  );
}
