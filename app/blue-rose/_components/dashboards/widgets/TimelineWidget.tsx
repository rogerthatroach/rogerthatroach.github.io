'use client';

import { useMemo } from 'react';
import { approvalsTimeline } from '../../../_lib/dashboard';
import ApprovalsTimelineChart from '../../charts/ApprovalsTimelineChart';
import type { WidgetProps } from './widget-shared';

export default function TimelineWidget({ submissions, filters }: WidgetProps) {
  const data = useMemo(
    () => approvalsTimeline(submissions, filters.timeRange),
    [submissions, filters.timeRange],
  );
  return (
    <div className="h-full">
      <ApprovalsTimelineChart data={data} />
    </div>
  );
}
