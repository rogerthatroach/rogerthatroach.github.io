'use client';

import { Workflow } from 'lucide-react';
import PlaceholderPage from '../_components/PlaceholderPage';

export default function WorkflowsRoute() {
  return (
    <PlaceholderPage
      icon={Workflow}
      label="Workflows"
      tier="Tier 4 · admin"
      description="Routing rules built three ways: natural language, When-Then cards, visual graph. All linked, all editable. Façade over the eight seeded rules."
    />
  );
}
