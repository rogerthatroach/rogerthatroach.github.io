'use client';

import type { ReactNode } from 'react';
import {
  Controls,
  ReactFlowProvider,
  type Edge,
  type FitViewOptions,
  type Node,
} from '@xyflow/react';

interface DiagramViewportProps {
  children: ReactNode;
  initialNodes: Node[];
  initialEdges: Edge[];
  initialWidth: number;
  initialHeight: number;
  fitViewOptions: FitViewOptions;
}

/**
 * Provides one ReactFlow store to the visual canvas and its controls.
 *
 * The canvas itself is hidden from assistive technology by the shared
 * ReactFlow props. Controls remain outside that hidden subtree, so keyboard
 * users can still zoom and reset the visual viewport without hearing the raw
 * ReactFlow application, node, and edge announcements.
 */
export default function DiagramViewport({
  children,
  initialNodes,
  initialEdges,
  initialWidth,
  initialHeight,
  fitViewOptions,
}: DiagramViewportProps) {
  return (
    <ReactFlowProvider
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      initialWidth={initialWidth}
      initialHeight={initialHeight}
      fitView
      initialFitViewOptions={fitViewOptions}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {children}
      </div>
      <Controls
        aria-label="Diagram view controls"
        className="diagram-flow-controls"
        showInteractive={false}
        position="bottom-right"
      />
    </ReactFlowProvider>
  );
}
