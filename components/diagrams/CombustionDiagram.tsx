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
import DiagramViewport from './DiagramViewport';
import { PROJECT_DIAGRAM_REACT_FLOW_PROPS } from './diagramCapabilities';
import { useThemeColor } from '@/lib/useThemeColor';
import SemanticDiagramFallback from '@/components/blog/diagrams/SemanticDiagramFallback';

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
      description: 'Particle Swarm explores bounded candidate settings under the configured objective',
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
      label: 'Candidate Settings',
      description: 'Bounded control parameters',
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
      description: 'Review candidate settings and retain control of plant adjustments',
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
      description: 'Savings attributed to the program',
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
  const gridColor = useThemeColor('--color-diagram-grid', '#d4ccc8');

  return (
    <div
      className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border-subtle bg-surface/50 backdrop-blur-xs sm:h-[600px]"
      role="group"
      aria-label="Combustion-tuning recommendation flow"
    >
      <SemanticDiagramFallback
        title="Combustion-tuning recommendation flow"
        summary="Plant observations feed engineered features and 84 regression models. Particle Swarm Optimization explores bounded candidate settings, which remain subject to plant-operator review and control."
        steps={[
          { title: 'Observe', detail: 'More than 90 plant sensors record temperature, pressure, flow, and emissions-related operating signals.' },
          { title: 'Prepare features', detail: 'Domain transformations and aggregations turn the time-series inputs into model-ready features.' },
          { title: 'Estimate', detail: 'Eighty-four independent regression models estimate combustion behavior under candidate inputs.' },
          { title: 'Explore candidates', detail: 'Particle Swarm Optimization searches the bounded setting space under the configured objective and constraints.' },
          { title: 'Review and act', detail: 'Plant operators assess candidate settings and retain authority over any control adjustment.' },
        ]}
        notes={[
          'The optimizer proposes candidates; it does not replace operator judgment or guarantee a global optimum.',
          'The program was credited with approximately $3 million per year in savings.',
        ]}
      />
      <DiagramViewport
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        initialWidth={900}
        initialHeight={600}
        fitViewOptions={{ padding: 0.15 }}
      >
        <ReactFlow
          {...PROJECT_DIAGRAM_REACT_FLOW_PROPS}
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
          className="[&_.react-flow__background]:bg-transparent!"
        >
          <Background color={gridColor} gap={24} size={1} />
        </ReactFlow>
      </DiagramViewport>
    </div>
  );
}
