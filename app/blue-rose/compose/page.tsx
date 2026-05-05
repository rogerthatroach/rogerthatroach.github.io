'use client';

import { PenLine } from 'lucide-react';
import PlaceholderPage from '../_components/PlaceholderPage';

export default function ComposeRoute() {
  return (
    <PlaceholderPage
      icon={PenLine}
      label="Compose"
      tier="Tier 2"
      description="The multi-step new-submission flow lives here. Drag a vendor PDF, watch Diane draft fields with citations, see the routing preview, hit submit."
    />
  );
}
