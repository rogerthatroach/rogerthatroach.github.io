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

const COLOR = '#22c55e';

const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'agent',
    position: { x: 0, y: 120 },
    data: {
      label: 'NL Query',
      description: '"How does RBC compare to TD on CET1?"',
      icon: '💬',
      category: 'input',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'intent',
    type: 'agent',
    position: { x: 170, y: 40 },
    data: {
      label: 'Intent Parse',
      description: 'Detects query intent and structure',
      icon: '🎯',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'decompose',
    type: 'agent',
    position: { x: 170, y: 200 },
    data: {
      label: 'Decompose',
      description: 'Breaks query into logical sub-parts',
      icon: '🔧',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'kpi',
    type: 'agent',
    position: { x: 340, y: 120 },
    data: {
      label: 'KPI Detect',
      description: 'Maps to known KPIs via metadata',
      icon: '📊',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'disambig',
    type: 'agent',
    position: { x: 510, y: 120 },
    data: {
      label: 'Disambiguate',
      description: 'Embeddings similarity for look-alike KPIs',
      icon: '🔍',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'sql',
    type: 'agent',
    position: { x: 680, y: 120 },
    data: {
      label: 'Text-to-SQL',
      description: 'Generates validated, schema-aware SQL',
      icon: '⚡',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'results',
    type: 'agent',
    position: { x: 850, y: 120 },
    data: {
      label: 'Results',
      description: 'Validated benchmarking output',
      icon: '✅',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'input', target: 'intent', type: 'animated', data: { color: COLOR } },
  { id: 'e2', source: 'input', target: 'decompose', type: 'animated', data: { color: COLOR } },
  { id: 'e3', source: 'intent', target: 'kpi', type: 'animated', data: { color: COLOR } },
  { id: 'e4', source: 'decompose', target: 'kpi', type: 'animated', data: { color: COLOR } },
  { id: 'e5', source: 'kpi', target: 'disambig', type: 'animated', data: { color: COLOR } },
  { id: 'e6', source: 'disambig', target: 'sql', type: 'animated', data: { color: COLOR } },
  { id: 'e7', source: 'sql', target: 'results', type: 'animated', data: { color: COLOR } },
];

export default function AegisDiagram() {
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
