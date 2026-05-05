'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, FileText, MessageCircleWarning, Paperclip, PanelRight, XCircle } from 'lucide-react';
import { useThemis, useCurrentPersona, usePersonaMap } from '../_lib/store';
import StatusPill from './StatusPill';
import MessageBubble from './MessageBubble';
import Composer from './Composer';
import DraftFormView from './DraftFormView';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface ThreadViewProps {
  /** Open the Context drawer (visible on <xl widths only). */
  onOpenDetails?: () => void;
}

/**
 * ThreadView — middle pane.
 *
 * Header: submission title, status, primary actions (role-gated), Details
 * trigger (only visible on <xl widths where the Context pane is hidden).
 * Body: messages (system + chat), then composer.
 * Drafts: render the form fields with floating per-field threads instead
 * of a chat. The header stays the same.
 */
export default function ThreadView({ onOpenDetails }: ThreadViewProps = {}) {
  const {
    seed,
    selectedSubmissionId,
    selectSubmission,
    messages,
    addMessage,
    markThreadRead,
  } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const scrollRef = useRef<HTMLDivElement>(null);

  const submission = useMemo(
    () => seed.submissions.find((s) => s.id === selectedSubmissionId) ?? null,
    [seed.submissions, selectedSubmissionId],
  );

  const threadMessages = useMemo(() => {
    if (!submission) return [];
    return messages
      .filter((m) => m.threadId === submission.threadId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [messages, submission]);

  // Mark thread read on open/persona change
  useEffect(() => {
    if (submission) markThreadRead(submission.threadId);
  }, [submission, persona.id, markThreadRead]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [threadMessages.length, submission?.id]);

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

  const isDraft = submission.status === 'draft';
  const submitter = personaMap.get(submission.submittedBy);

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex h-full flex-col overflow-hidden">
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
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--themis-rejected)' }}>
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
          {onOpenDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              aria-label="Open context panel"
              title="Details, attachments, audit, insights"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary xl:hidden"
            >
              <PanelRight size={12} aria-hidden="true" />
              <span>Details</span>
            </button>
          )}
          {canApprove && submission.status !== 'approved' && submission.status !== 'rejected' && (
            <>
              <ActionButton
                icon={CheckCircle2}
                color="var(--themis-approved)"
                label="Approve"
                onClick={() =>
                  addMessage(
                    submission.threadId,
                    `Approved.`,
                    [],
                    [],
                  )
                }
              />
              <ActionButton
                icon={MessageCircleWarning}
                color="var(--themis-needs-info)"
                label="Request info"
                onClick={() =>
                  addMessage(
                    submission.threadId,
                    `Requesting more information before I can move forward.`,
                    [],
                    [],
                  )
                }
              />
              <ActionButton
                icon={XCircle}
                color="var(--themis-rejected)"
                label="Reject"
                onClick={() =>
                  addMessage(submission.threadId, `Rejecting at this time.`, [], [])
                }
              />
            </>
          )}
        </div>
      </header>

      {isDraft ? (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <DraftFormView submission={submission} />
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-1">
              {threadMessages.map((m) => {
                const author = personaMap.get(m.authorPersonaId);
                return (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    author={author}
                    personas={seed.personas}
                    isSelf={m.authorPersonaId === persona.id}
                  />
                );
              })}
            </motion.div>
          </div>
          <div className="border-t border-border-subtle bg-background/40">
            <Composer
              personas={seed.personas}
              excludePersonaIds={[persona.id]}
              placeholder={`Reply as ${persona.displayName}… use @ to mention, # to tag`}
              onSubmit={(body, mentions, tags) => {
                addMessage(submission.threadId, body, mentions, tags);
              }}
            />
          </div>
        </>
      )}
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
