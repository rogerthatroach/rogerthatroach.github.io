'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageCircleWarning,
  MessageSquare,
  Paperclip,
  PanelRight,
  XCircle,
} from 'lucide-react';
import { useThemis, useCurrentPersona, usePersonaMap } from '../_lib/store';
import StatusPill from './StatusPill';
import DocumentBody from './DocumentBody';
import WhyCard from './WhyCard';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface SubmissionViewProps {
  /** Open the right-pane drawer (visible on <xl widths only). */
  onOpenDetails?: () => void;
}

/**
 * SubmissionView — middle pane (Tier 1: structured-doc-first).
 *
 * Replaces the prior chat-as-middle-pane. Now renders the submission as
 * a labeled document with field-anchored threads. Approver views get a
 * "Why is this in front of me?" card pinned at the top (T3 populates
 * with content from submission.diane).
 *
 * The chat thread surface lives in the right-pane "Thread" tab now.
 * Actions (Approve / Request info / Reject) post system messages and
 * switch the right pane to the Thread tab so the user sees the result.
 */
export default function SubmissionView({ onOpenDetails }: SubmissionViewProps = {}) {
  const {
    seed,
    selectedSubmissionId,
    selectSubmission,
    setRightPaneTab,
    addMessage,
  } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();

  const submission = useMemo(
    () => seed.submissions.find((s) => s.id === selectedSubmissionId) ?? null,
    [seed.submissions, selectedSubmissionId],
  );

  if (!submission) {
    return (
      <div className="hidden flex-col items-center justify-center gap-3 lg:flex lg:h-full">
        <FileText size={28} className="text-text-tertiary" aria-hidden="true" />
        <p className="text-sm text-text-secondary">Select a submission from the queue.</p>
      </div>
    );
  }

  const canApprove =
    submission.assignees.includes(persona.id) &&
    (persona.role === 'approver' || persona.role === 'admin');

  const submitter = personaMap.get(submission.submittedBy);
  const isApproverInReview =
    canApprove && submission.status === 'in_review';

  const postAction = (body: string) => {
    addMessage(submission.threadId, body, [], []);
    setRightPaneTab('thread');
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="flex h-full flex-col overflow-hidden"
    >
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border-subtle bg-background/80 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => selectSubmission(null)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary lg:hidden"
          aria-label="Back to queue"
        >
          <ArrowLeft size={14} aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusPill status={submission.status} />
            {submission.priority === 'high' && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--themis-rejected)' }}
              >
                ⚑ high
              </span>
            )}
            {submission.attachmentIds.length > 0 && (
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                <Paperclip size={10} aria-hidden="true" /> {submission.attachmentIds.length}
              </span>
            )}
          </div>
          <h2 className="mt-0.5 truncate font-display text-[15px] font-medium leading-snug text-text-primary">
            {submission.title}
          </h2>
          {submitter && (
            <p className="mt-0.5 truncate text-[11px] text-text-tertiary">
              Submitted by {submitter.displayName}
              {submitter.title ? ` · ${submitter.title}` : ''}
            </p>
          )}
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => setRightPaneTab('thread')}
            aria-label="Open thread"
            title="Open the chat thread"
            className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <MessageSquare size={12} aria-hidden="true" />
            <span>Thread</span>
          </button>
          {onOpenDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              aria-label="Open right pane"
              title="Details, attachments, audit, insights"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary xl:hidden"
            >
              <PanelRight size={12} aria-hidden="true" />
              <span>Details</span>
            </button>
          )}
          {canApprove &&
            submission.status !== 'approved' &&
            submission.status !== 'rejected' && (
              <>
                <ActionButton
                  icon={CheckCircle2}
                  color="var(--themis-approved)"
                  label="Approve"
                  onClick={() => postAction('Approved.')}
                />
                <ActionButton
                  icon={MessageCircleWarning}
                  color="var(--themis-needs-info)"
                  label="Request info"
                  onClick={() =>
                    postAction('Requesting more information before I can move forward.')
                  }
                />
                <ActionButton
                  icon={XCircle}
                  color="var(--themis-rejected)"
                  label="Reject"
                  onClick={() => postAction('Rejecting at this time.')}
                />
              </>
            )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isApproverInReview && <WhyCard submission={submission} />}
        <DocumentBody submission={submission} />
      </div>
    </motion.div>
  );
}

function ActionButton({
  icon: Icon,
  color,
  label,
  onClick,
}: {
  icon: typeof CheckCircle2;
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-surface-hover',
      )}
      style={{ color }}
    >
      <Icon size={12} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
