'use client';

import StatusPill from '../../StatusPill';
import { relativeTime } from '../../../_lib/format';
import type { WidgetProps } from './widget-shared';

export default function TableWidget({ widget, submissions, personaMap }: WidgetProps) {
  if (widget.config.kind !== 'table') return null;
  const rows = [...submissions]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, widget.config.rows);

  if (rows.length === 0) {
    return (
      <p className="font-mono text-[11px] text-text-tertiary">
        No submissions in range.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border-subtle/60 -mx-2">
      {rows.map((s) => {
        const submitter = personaMap.get(s.submittedBy);
        return (
          <li
            key={s.id}
            className="flex items-center gap-2 px-2 py-2"
          >
            <StatusPill status={s.status} />
            <p className="min-w-0 flex-1 truncate text-[12px] text-text-primary">
              {s.title}
            </p>
            <span className="hidden font-mono text-[10px] text-text-tertiary sm:inline">
              {submitter?.displayName ?? s.submittedBy}
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">
              {relativeTime(s.updatedAt)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
