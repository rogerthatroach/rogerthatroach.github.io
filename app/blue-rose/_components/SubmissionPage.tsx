'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Eye,
  FileText,
  MessageCircleWarning,
  MessageSquare,
  Paperclip,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  useThemis,
  useCurrentPersona,
  usePersonaMap,
  type SubmissionTab,
} from '../_lib/store';
import StatusPill from './StatusPill';
import WhyCard from './WhyCard';
import DocumentBody from './DocumentBody';
import ThreadTab from './ThreadTab';
import ContextTab from './ContextTab';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const TABS: { id: SubmissionTab; label: string; icon: typeof FileText }[] = [
  { id: 'document', label: 'Document', icon: FileText },
  { id: 'thread', label: 'Thread', icon: MessageSquare },
  { id: 'context', label: 'Context', icon: Eye },
  { id: 'diane', label: 'Diane', icon: Sparkles },
];

/**
 * SubmissionPage — single-submission focus view.
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ Compact submission header                            │
 *   │   STATUS  ⚑  📎 5                                     │
 *   │   The submission's title in display serif            │
 *   │   Submitted by [name] · [title]      [actions]       │
 *   ├──────────────────────────────────────────────────────┤
 *   │ Document  Thread  Context  Diane    ← page-level tabs│
 *   ├──────────────────────────────────────────────────────┤
 *   │  {tab content}                                       │
 *   └──────────────────────────────────────────────────────┘
 *
 * No store-id → redirect to /inbox. Picks up `selectedSubmissionId` from
 * the store (set when the user clicked a queue row before navigation).
 */
export default function SubmissionPage() {
  const {
    seed,
    selectedSubmissionId,
    submissionTab,
    setSubmissionTab,
    addMessage,
  } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const router = useRouter();

  const submission = useMemo(
    () => seed.submissions.find((s) => s.id === selectedSubmissionId) ?? null,
    [seed.submissions, selectedSubmissionId],
  );

  useEffect(() => {
    if (!submission) router.replace('/blue-rose/inbox');
  }, [submission, router]);

  if (!submission) return null;

  const submitter = personaMap.get(submission.submittedBy);
  const canApprove =
    submission.assignees.includes(persona.id) &&
    (persona.role === 'approver' || persona.role === 'admin');
  const isApproverInReview = canApprove && submission.status === 'in_review';

  const postAction = (body: string) => {
    addMessage(submission.threadId, body, [], []);
    setSubmissionTab('thread');
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="flex h-full flex-col"
    >
      {/* Compact submission header */}
      <header className="shrink-0 border-b border-border-subtle/40 bg-background/40 px-4 py-4 backdrop-blur-sm md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={submission.status} />
                {submission.priority === 'high' && (
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: 'var(--themis-rejected)' }}
                  >
                    ⚑ high priority
                  </span>
                )}
                {submission.attachmentIds.length > 0 && (
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                    <Paperclip size={10} aria-hidden="true" />
                    {submission.attachmentIds.length}
                  </span>
                )}
              </div>
              <h1 className="mt-1.5 font-display text-[22px] font-medium leading-tight text-text-primary md:text-[24px]">
                {submission.title}
              </h1>
              {submitter && (
                <p className="mt-1 text-[12px] text-text-tertiary">
                  Submitted by{' '}
                  <span className="text-text-secondary">{submitter.displayName}</span>
                  {submitter.title ? ` · ${submitter.title}` : ''}
                </p>
              )}
            </div>
            {canApprove &&
              submission.status !== 'approved' &&
              submission.status !== 'rejected' && (
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
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
                </div>
              )}
          </div>
        </div>
      </header>

      {/* Page-level tab bar */}
      <nav
        role="tablist"
        aria-label="Submission view"
        className="relative shrink-0 border-b border-border-subtle bg-background/60 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-5xl px-4 md:px-8">
          {TABS.map((t) => {
            const isActive = submissionTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSubmissionTab(t.id)}
                className={cn(
                  'group relative flex items-center gap-1.5 px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.25em] transition-colors',
                  isActive
                    ? 'text-[var(--themis-primary)]'
                    : 'text-text-tertiary hover:text-text-secondary',
                )}
              >
                <t.icon size={11} aria-hidden="true" />
                <span>{t.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="submission-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: 'var(--themis-primary)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Tab body — each tab owns its own scroll */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {submissionTab === 'document' && (
          <div className="h-full overflow-y-auto px-4 py-5 md:px-8">
            <div className="mx-auto max-w-3xl">
              {isApproverInReview && <WhyCard submission={submission} />}
              <DocumentBody submission={submission} />
            </div>
          </div>
        )}
        {submissionTab === 'thread' && (
          <div className="mx-auto h-full max-w-3xl">
            <ThreadTab />
          </div>
        )}
        {submissionTab === 'context' && (
          <div className="mx-auto h-full max-w-3xl">
            <ContextTab />
          </div>
        )}
        {submissionTab === 'diane' && <DianeStub />}
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
      className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/70 px-2.5 py-1.5 text-[11.5px] font-medium transition-colors hover:bg-surface-hover"
      style={{ color }}
    >
      <Icon size={12} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function DianeStub() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center"
        style={{
          background: 'rgba(245, 158, 11, 0.12)',
          borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%',
        }}
      >
        <Sparkles size={22} style={{ color: '#F59E0B' }} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-text-primary">Diane</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
          AI agent · arrives in Tier 2
        </p>
      </div>
      <p className="max-w-[320px] text-[12.5px] leading-relaxed text-text-secondary">
        Smart drafting on Compose. &ldquo;Why is this in front of me?&rdquo; for approvers. Routing
        preview before submission. Confidence + citations on every output.
      </p>
    </div>
  );
}
