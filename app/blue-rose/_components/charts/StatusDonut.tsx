'use client';

import { useMemo } from 'react';
import type { SubmissionStatus } from '@/data/themis/types';
import type { StatusDistributionPoint } from '../../_lib/dashboard';

interface StatusDonutProps {
  data: StatusDistributionPoint[];
  size?: number;
  thickness?: number;
}

const STATUS_COLOR: Record<SubmissionStatus, string> = {
  pending: 'var(--themis-pending)',
  in_review: 'var(--themis-in-review)',
  changes_requested: 'var(--themis-needs-info)',
  approved: 'var(--themis-approved)',
  rejected: 'var(--themis-rejected)',
  draft: 'var(--themis-draft)',
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: 'Pending',
  in_review: 'In review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
  draft: 'Draft',
};

/**
 * StatusDonut — pure-SVG donut chart of status distribution.
 *
 * Renders arc segments using cumulative angles. Center shows the total
 * count and "submissions" label. Legend below maps colors → status
 * labels with counts.
 *
 * No d3 needed — the math is just polar→cartesian + SVG arc paths.
 */
export default function StatusDonut({
  data,
  size = 220,
  thickness = 28,
}: StatusDonutProps) {
  const segments = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 2;
    const innerR = outerR - thickness;
    const total = data.reduce((sum, p) => sum + p.count, 0);
    if (total === 0) return [];
    let angle = -Math.PI / 2; // start at top
    return data.map((p) => {
      const sweep = (p.count / total) * 2 * Math.PI;
      const endAngle = angle + sweep;
      const largeArc = sweep > Math.PI ? 1 : 0;
      const x1 = cx + outerR * Math.cos(angle);
      const y1 = cy + outerR * Math.sin(angle);
      const x2 = cx + outerR * Math.cos(endAngle);
      const y2 = cy + outerR * Math.sin(endAngle);
      const x3 = cx + innerR * Math.cos(endAngle);
      const y3 = cy + innerR * Math.sin(endAngle);
      const x4 = cx + innerR * Math.cos(angle);
      const y4 = cy + innerR * Math.sin(angle);
      const path = [
        `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
        `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
        'Z',
      ].join(' ');
      const seg = { path, status: p.status, count: p.count, fraction: p.fraction };
      angle = endAngle;
      return seg;
    });
  }, [data, size, thickness]);

  const total = data.reduce((sum, p) => sum + p.count, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          No submissions in range
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {segments.map((seg) => (
            <path
              key={seg.status}
              d={seg.path}
              fill={STATUS_COLOR[seg.status]}
              opacity={0.85}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[28px] font-medium leading-none text-text-primary">
            {total}
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
            submissions
          </span>
        </div>
      </div>
      <ul className="flex w-full flex-wrap justify-center gap-x-4 gap-y-1.5">
        {data.map((p) => (
          <li key={p.status} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="block h-2 w-2 rounded-sm"
              style={{ background: STATUS_COLOR[p.status] }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              {STATUS_LABEL[p.status]}
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">
              {p.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
