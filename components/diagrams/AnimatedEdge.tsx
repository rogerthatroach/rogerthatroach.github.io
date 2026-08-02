'use client';

import { memo } from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

function AnimatedEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
  const edgeColor = (data as { color?: string } | undefined)?.color || '#3b82f6';

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      {/* edge-draw: the stroke draws itself in once on mount (≈ when the
          diagram lazy-mounts near the viewport). Each dot traverses the edge
          once and fades; reduced-motion shows only the settled line. */}
      <BaseEdge path={edgePath} className="edge-draw" style={{ stroke: edgeColor, strokeWidth: 2, opacity: 0.4 }} />
      <circle aria-hidden="true" className="edge-flow-dot" r="3" fill={edgeColor}>
        <animateMotion dur="2s" repeatCount="1" path={edgePath} />
        <animate
          attributeName="opacity"
          values="1;1;0"
          keyTimes="0;0.9;1"
          dur="2s"
          repeatCount="1"
          fill="freeze"
        />
      </circle>
      <circle aria-hidden="true" className="edge-flow-dot" r="3" fill={edgeColor} opacity="0.4">
        <animateMotion dur="2s" repeatCount="1" path={edgePath} begin="1s" />
        <animate
          attributeName="opacity"
          values="0.4;0.4;0"
          keyTimes="0;0.9;1"
          dur="2s"
          begin="1s"
          repeatCount="1"
          fill="freeze"
        />
      </circle>
    </>
  );
}

export default memo(AnimatedEdge);
