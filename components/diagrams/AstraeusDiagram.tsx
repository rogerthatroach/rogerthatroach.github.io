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

const COLOR = '#3b82f6';
const TEAL = '#14b8a6';

const initialNodes: Node[] = [
  {
    id: 'query',
    type: 'agent',
    position: { x: 220, y: 0 },
    data: {
      label: 'NL Query',
      description: 'Natural language financial question',
      icon: '💬',
      category: 'input',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'router',
    type: 'agent',
    position: { x: 220, y: 100 },
    data: {
      label: 'GPT Router',
      description: 'Intent detection only — no data leaves',
      icon: '🔀',
      category: 'orchestrator',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'epm',
    type: 'agent',
    position: { x: 40, y: 230 },
    data: {
      label: 'EPM Agent',
      description: 'Enterprise Planning — transits, rollups, security',
      icon: '📊',
      category: 'process',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'headcount',
    type: 'agent',
    position: { x: 220, y: 230 },
    data: {
      label: 'HC Agent',
      description: 'Headcount analytics — hires, departures, moves',
      icon: '👥',
      category: 'process',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'openpos',
    type: 'agent',
    position: { x: 400, y: 230 },
    data: {
      label: 'OP Agent',
      description: 'Open positions tracking and analysis',
      icon: '📋',
      category: 'process',
      accentColor: TEAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'merge',
    type: 'agent',
    position: { x: 220, y: 360 },
    data: {
      label: 'Merge',
      description: 'Combines parallel agent results',
      icon: '🔗',
      category: 'process',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'dashboard',
    type: 'agent',
    position: { x: 40, y: 480 },
    data: {
      label: 'Dashboard',
      description: 'Real-time interactive analytics',
      icon: '📈',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'chatbot',
    type: 'agent',
    position: { x: 220, y: 480 },
    data: {
      label: 'Chatbot',
      description: 'Conversational financial queries',
      icon: '🤖',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
  {
    id: 'reports',
    type: 'agent',
    position: { x: 400, y: 480 },
    data: {
      label: 'HTML Reports',
      description: 'Inbox-ready polished reports',
      icon: '📑',
      category: 'output',
      accentColor: COLOR,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'query', target: 'router', type: 'animated', data: { color: COLOR } },
  { id: 'e2', source: 'router', target: 'epm', type: 'animated', data: { color: TEAL } },
  { id: 'e3', source: 'router', target: 'headcount', type: 'animated', data: { color: TEAL } },
  { id: 'e4', source: 'router', target: 'openpos', type: 'animated', data: { color: TEAL } },
  { id: 'e5', source: 'epm', target: 'merge', type: 'animated', data: { color: TEAL } },
  { id: 'e6', source: 'headcount', target: 'merge', type: 'animated', data: { color: TEAL } },
  { id: 'e7', source: 'openpos', target: 'merge', type: 'animated', data: { color: TEAL } },
  { id: 'e8', source: 'merge', target: 'dashboard', type: 'animated', data: { color: COLOR } },
  { id: 'e9', source: 'merge', target: 'chatbot', type: 'animated', data: { color: COLOR } },
  { id: 'e10', source: 'merge', target: 'reports', type: 'animated', data: { color: COLOR } },
];

export default function AstraeusDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

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
        <Background color={gridColor} gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
