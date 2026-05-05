'use client';

import type { SubmissionStatus } from '@/data/themis/types';
import { cn } from '@/lib/utils';

const LABEL: Record<SubmissionStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  in_review: 'In review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STYLE: Record<SubmissionStatus, { color: string; bg: string; ring: string }> = {
  draft: { color: 'var(--themis-draft)', bg: 'var(--themis-draft-bg)', ring: 'var(--themis-draft)' },
  pending: { color: 'var(--themis-pending)', bg: 'var(--themis-pending-bg)', ring: 'var(--themis-pending)' },
  in_review: { color: 'var(--themis-in-review)', bg: 'var(--themis-in-review-bg)', ring: 'var(--themis-in-review)' },
  changes_requested: {
    color: 'var(--themis-needs-info)',
    bg: 'var(--themis-needs-info-bg)',
    ring: 'var(--themis-needs-info)',
  },
  approved: { color: 'var(--themis-approved)', bg: 'var(--themis-approved-bg)', ring: 'var(--themis-approved)' },
  rejected: { color: 'var(--themis-rejected)', bg: 'var(--themis-rejected-bg)', ring: 'var(--themis-rejected)' },
};

interface StatusPillProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusPill({ status, size = 'sm', className }: StatusPillProps) {
  const s = STYLE[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-wider',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        className,
      )}
      style={{ color: s.color, backgroundColor: s.bg, boxShadow: `inset 0 0 0 1px ${s.ring}30` }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: s.ring }}
      />
      {LABEL[status]}
    </span>
  );
}
