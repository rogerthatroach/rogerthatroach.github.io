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

const AMBER = '#f59e0b';
const CORAL = '#f97316';

const initialNodes: Node[] = [
  {
    id: 'sensors',
    type: 'agent',
    position: { x: 220, y: 0 },
    data: {
      label: '90+ Sensors',
      description: 'Temperature, pressure, flow, emissions',
      icon: '📡',
      category: 'input',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
  {
    id: 'features',
    type: 'agent',
    position: { x: 220, y: 110 },
    data: {
      label: 'Feature Eng.',
      description: 'Domain transforms and aggregations',
      icon: '⚙️',
      category: 'process',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
  {
    id: 'models',
    type: 'agent',
    position: { x: 220, y: 220 },
    data: {
      label: '84 ML Models',
      description: 'K-fold CV · R² · RMSE · MAPE · fold variance',
      icon: '🧮',
      category: 'process',
      accentColor: CORAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'pso',
    type: 'agent',
    position: { x: 220, y: 330 },
    data: {
      label: 'PSO Optimizer',
      description: 'Particle Swarm — explores input space to minimize emissions',
      icon: '🌀',
      category: 'process',
      accentColor: CORAL,
    } satisfies AgentNodeData,
  },
  {
    id: 'settings',
    type: 'agent',
    position: { x: 80, y: 440 },
    data: {
      label: 'Optimal Settings',
      description: 'Computed control parameters',
      icon: '🎛️',
      category: 'output',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
  {
    id: 'operators',
    type: 'agent',
    position: { x: 360, y: 440 },
    data: {
      label: 'Plant Operators',
      description: 'Adjust boiler controls',
      icon: '👷',
      category: 'output',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
  {
    id: 'result',
    type: 'agent',
    position: { x: 220, y: 550 },
    data: {
      label: '$3M/yr Saved',
      description: 'Reduced NOx, SOx, CO + cost savings',
      icon: '💰',
      category: 'output',
      accentColor: AMBER,
    } satisfies AgentNodeData,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'sensors', target: 'features', type: 'animated', data: { color: AMBER } },
  { id: 'e2', source: 'features', target: 'models', type: 'animated', data: { color: AMBER } },
  { id: 'e3', source: 'models', target: 'pso', type: 'animated', data: { color: CORAL } },
  { id: 'e4', source: 'pso', target: 'settings', type: 'animated', data: { color: CORAL } },
  { id: 'e5', source: 'pso', target: 'operators', type: 'animated', data: { color: CORAL } },
  { id: 'e6', source: 'settings', target: 'result', type: 'animated', data: { color: AMBER } },
  { id: 'e7', source: 'operators', target: 'result', type: 'animated', data: { color: AMBER } },
];

export default function CombustionDiagram() {
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
