'use client';

import { useMemo } from 'react';
import { kindBreakdown } from '../../../_lib/dashboard';
import KindBars from '../../charts/KindBars';
import type { WidgetProps } from './widget-shared';

export default function KindBarsWidget({ submissions }: WidgetProps) {
  const data = useMemo(() => kindBreakdown(submissions), [submissions]);
  return <KindBars data={data} />;
}
