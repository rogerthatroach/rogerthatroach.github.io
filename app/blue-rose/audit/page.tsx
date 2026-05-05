'use client';

import { Activity } from 'lucide-react';
import PlaceholderPage from '../_components/PlaceholderPage';

export default function AuditRoute() {
  return (
    <PlaceholderPage
      icon={Activity}
      label="Audit log"
      tier="Tier 4 · admin"
      description="Filterable timeline of every action across the org. Actor × event × entity × time. Diane's actions render with full reasoning when expanded."
    />
  );
}
