'use client';

import { useMemo } from 'react';
import type { TimelinePoint } from '../../_lib/dashboard';

interface ApprovalsTimelineChartProps {
  data: TimelinePoint[];
  height?: number;
}

/**
 * ApprovalsTimelineChart — area chart of submission volume over time,
 * with the approved-share rendered as an inner amethyst fill.
 *
 * Pure SVG. Uses a viewBox sized to data length × height; preserveAspect
 * "none" stretches horizontally to fill its container width.
 */
export default function ApprovalsTimelineChart({
  data,
  height = 140,
}: ApprovalsTimelineChartProps) {
  const view = useMemo(() => {
    const w = Math.max(data.length, 2) * 40;
    const max = Math.max(1, ...data.map((p) => p.count));
    const padTop = 14;
    const padBottom = 22;
    const innerH = height - padTop - padBottom;
    const stepX = w / Math.max(data.length - 1, 1);

    const yFor = (count: number) => padTop + innerH * (1 - count / max);

    // Total area path
    const totalPoints = data.map((p, i) => `${i * stepX},${yFor(p.count)}`);
    const totalArea = `M 0,${padTop + innerH} L ${totalPoints.join(' L ')} L ${w},${padTop + innerH} Z`;

    // Approved area path
    const apprPoints = data.map(
      (p, i) => `${i * stepX},${yFor(p.approvedCount)}`,
    );
    const apprArea = `M 0,${padTop + innerH} L ${apprPoints.join(' L ')} L ${w},${padTop + innerH} Z`;

    return { w, height, max, padTop, padBottom, innerH, stepX, yFor, totalArea, apprArea };
  }, [data, height]);

  if (data.length === 0 || view.max === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          No activity in range
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${view.w} ${view.height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: view.height }}
      >
        {/* Total fill */}
        <path d={view.totalArea} fill="var(--themis-pending)" opacity={0.18} />
        {/* Approved fill */}
        <path d={view.apprArea} fill="var(--themis-approved)" opacity={0.55} />
        {/* Total stroke */}
        <path
          d={`M ${data.map((p, i) => `${i * view.stepX},${view.yFor(p.count)}`).join(' L ')}`}
          fill="none"
          stroke="var(--themis-pending)"
          strokeWidth={1.5}
          opacity={0.7}
          vectorEffect="non-scaling-stroke"
        />
        {/* Approved stroke */}
        <path
          d={`M ${data.map((p, i) => `${i * view.stepX},${view.yFor(p.approvedCount)}`).join(' L ')}`}
          fill="none"
          stroke="var(--themis-approved)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {/* Bucket dots + value labels for the last bucket */}
        {data.length > 0 && (
          <>
            <circle
              cx={(data.length - 1) * view.stepX}
              cy={view.yFor(data[data.length - 1].count)}
              r={3}
              fill="var(--themis-pending)"
            />
            <circle
              cx={(data.length - 1) * view.stepX}
              cy={view.yFor(data[data.length - 1].approvedCount)}
              r={3}
              fill="var(--themis-approved)"
            />
          </>
        )}
      </svg>
      {/* X-axis labels — first, middle, last */}
      <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
        <span>{data[0]?.bucketLabel}</span>
        {data.length >= 3 && (
          <span>{data[Math.floor(data.length / 2)]?.bucketLabel}</span>
        )}
        <span>{data[data.length - 1]?.bucketLabel}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="block h-2 w-2 rounded-sm"
            style={{ background: 'var(--themis-approved)' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
            Approved
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="block h-2 w-2 rounded-sm"
            style={{ background: 'var(--themis-pending)' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
            Submitted
          </span>
        </span>
      </div>
    </div>
  );
}
