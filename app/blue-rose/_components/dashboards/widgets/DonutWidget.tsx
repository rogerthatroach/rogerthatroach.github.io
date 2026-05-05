'use client';

import { useMemo } from 'react';
import { statusDistribution } from '../../../_lib/dashboard';
import StatusDonut from '../../charts/StatusDonut';
import type { WidgetProps } from './widget-shared';

export default function DonutWidget({ submissions }: WidgetProps) {
  const data = useMemo(() => statusDistribution(submissions), [submissions]);
  return <StatusDonut data={data} />;
}
