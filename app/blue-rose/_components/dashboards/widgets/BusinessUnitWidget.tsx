'use client';

import { useMemo } from 'react';
import { businessUnitSpend } from '../../../_lib/dashboard';
import BusinessUnitChart from '../../charts/BusinessUnitChart';
import type { WidgetProps } from './widget-shared';

export default function BusinessUnitWidget({ submissions }: WidgetProps) {
  const data = useMemo(() => businessUnitSpend(submissions), [submissions]);
  return <BusinessUnitChart data={data} />;
}
