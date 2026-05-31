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
          diagram lazy-mounts near the viewport); the flowing dots below keep
          running. Reduced-motion shows the settled line (see globals.css). */}
      <BaseEdge path={edgePath} className="edge-draw" style={{ stroke: edgeColor, strokeWidth: 2, opacity: 0.4 }} />
      <circle r="3" fill={edgeColor}>
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="3" fill={edgeColor} opacity="0.4">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} begin="1s" />
      </circle>
    </>
  );
}

export default memo(AnimatedEdge);
