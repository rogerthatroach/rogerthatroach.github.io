'use client';

import { useMemo } from 'react';
import { personaActivity } from '../../../_lib/dashboard';
import PersonaActivityChart from '../../charts/PersonaActivityChart';
import type { WidgetProps } from './widget-shared';

export default function PersonaActivityWidget({ submissions }: WidgetProps) {
  const data = useMemo(() => personaActivity(submissions), [submissions]);
  return <PersonaActivityChart data={data} />;
}
