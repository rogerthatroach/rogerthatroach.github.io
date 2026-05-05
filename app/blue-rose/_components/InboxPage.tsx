'use client';

import { useThemis } from '../_lib/store';
import QueueFilters from './QueueFilters';
import QueuePreview from './QueuePreview';

/**
 * InboxPage — full-width queue + filters, no detail pane.
 *
 * Comfortable container width (max-w-4xl) for the list. Filter bar
 * pinned at the top of the page. Click a row → /submission with the
 * selected id stored.
 */
export default function InboxPage() {
  const { seed } = useThemis();

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-border-subtle/40 bg-background/40 px-4 py-4 backdrop-blur-sm md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3 flex items-baseline justify-between">
            <h1 className="font-display text-2xl font-medium text-text-primary">Inbox</h1>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
              {seed.submissions.length} total
            </span>
          </div>
          <QueueFilters />
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8">
        <div className="mx-auto max-w-4xl">
          <QueuePreview />
        </div>
      </div>
    </div>
  );
}
