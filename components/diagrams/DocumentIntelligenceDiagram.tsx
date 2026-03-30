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
import { useThemeColor } from '@/lib/useThemeColor';

const nodeTypes = { agent: AgentNode };
const edgeTypes = { animated: AnimatedEdge };

const COLOR = '#06b6d4';

const initialNodes: Node[] = [
  {
    id: 'docs',
    type: 'agent',
    position: { x: 0, y: 120 },
    data: {
      label: 'Documents',
      description: 'Insurance forms, financial records, PDFs',
      icon: '📄',
      category: 'input',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'docai',
    type: 'agent',
    position: { x: 180, y: 40 },
    data: {
      label: 'Document AI',
      description: 'OCR + structural parsing via GCP Document AI',
      icon: '🔬',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'extraction',
    type: 'agent',
    position: { x: 180, y: 200 },
    data: {
      label: 'Entity Extraction',
      description: 'Named entities, fields, metadata from documents',
      icon: '🏷️',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'vertexai',
    type: 'agent',
    position: { x: 380, y: 120 },
    data: {
      label: 'Vertex AI',
      description: 'Custom + AutoML models for classification & validation',
      icon: '🧠',
      category: 'orchestrator',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'validation',
    type: 'agent',
    position: { x: 560, y: 120 },
    data: {
      label: 'Validation',
      description: 'Cross-reference extracted data against business rules',
      icon: '✅',
      category: 'tool',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'output',
    type: 'agent',
    position: { x: 740, y: 120 },
    data: {
      label: 'Verified Output',
      description: 'Structured, validated document data for downstream use',
      icon: '📊',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'docs', target: 'docai', type: 'animated', data: { color: COLOR } },
  { id: 'e2', source: 'docs', target: 'extraction', type: 'animated', data: { color: COLOR } },
  { id: 'e3', source: 'docai', target: 'vertexai', type: 'animated', data: { color: COLOR } },
  { id: 'e4', source: 'extraction', target: 'vertexai', type: 'animated', data: { color: COLOR } },
  { id: 'e5', source: 'vertexai', target: 'validation', type: 'animated', data: { color: COLOR } },
  { id: 'e6', source: 'validation', target: 'output', type: 'animated', data: { color: COLOR } },
];

export default function DocumentIntelligenceDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-border-subtle bg-surface/50 backdrop-blur-sm sm:h-[500px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="[&_.react-flow__background]:!bg-transparent"
      >
        <Background color={gridColor} gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
