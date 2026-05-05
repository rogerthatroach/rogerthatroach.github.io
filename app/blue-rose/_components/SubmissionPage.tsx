'use client';

import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Eye,
  FileText,
  MessageCircleWarning,
  MessageSquare,
  Paperclip,
  PanelRightClose,
  Sparkles,
  XCircle,
  type LucideIcon,
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
import QueueFilters from './QueueFilters';
import QueuePreview from './QueuePreview';
import SplitPaneShell from './SplitPaneShell';
import type { Submission } from '@/data/themis/types';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const RAIL_KEY = 'themis:submission-rail-collapsed';

type TabDef = { id: SubmissionTab; label: string; icon: LucideIcon };
const TABS: TabDef[] = [
  { id: 'document', label: 'Document', icon: FileText },
  { id: 'thread', label: 'Thread', icon: MessageSquare },
  { id: 'context', label: 'Context', icon: Eye },
  { id: 'diane', label: 'Diane', icon: Sparkles },
];

// Custom MIME type for HTML5 drag-drop — keeps our drags from being
// confused with text/file drops elsewhere on the page.
const DRAG_TYPE = 'application/x-themis-tab';

/**
 * SubmissionPage — single-submission focus.
 *
 * Layout:
 *   ┌─────┬────────────────────────────────────────────────┐
 *   │     │ Compact submission header                      │
 *   │ Q   │   STATUS  ⚑  📎 5                              │
 *   │ u   │   The submission's title in display serif      │
 *   │ e   │   Submitted by [name]            [actions]    │
 *   │ u   ├────────────────────────────────────────────────┤
 *   │ e   │ [Document][Thread][Context][Diane]   [⊟ Split] │
 *   │     ├────────────────────────────────────────────────┤
 *   │ R   │  {tab content}                                 │
 *   │ a   │                                                │
 *   │ i   │   ── OR when splitMode is on: ──               │
 *   │ l   │  ┌─Doc-tab─┬─Diane-tab─┐                       │
 *   │     │  │ Document │  Diane   │ ← drag tabs between   │
 *   │     │  └─────────┴───────────┘                       │
 *   └─────┴────────────────────────────────────────────────┘
 *
 * Split mode: each pane has its own tab bar + tab body. Drag any tab
 * onto the other pane's tab bar to swap content. Resizable handle in
 * the middle (SplitPaneShell). Ratio + active tabs persist in store
 * (and through to localStorage).
 */
export default function SubmissionPage() {
  const {
    seed,
    selectedSubmissionId,
    submissionTab,
    submissionTabRight,
    splitMode,
    splitRatio,
    setSubmissionTab,
    toggleSplitMode,
    setSplitRatio,
    addMessage,
  } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();
  const router = useRouter();

  // Collapsible queue rail
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railHydrated, setRailHydrated] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RAIL_KEY);
      if (stored === '1') setRailCollapsed(true);
    } catch {
      /* noop */
    }
    setRailHydrated(true);
  }, []);
  useEffect(() => {
    if (!railHydrated) return;
    try {
      localStorage.setItem(RAIL_KEY, railCollapsed ? '1' : '0');
    } catch {
      /* noop */
    }
  }, [railCollapsed, railHydrated]);

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
    setSubmissionTab('thread', 'left');
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="relative flex h-full"
    >
      {/* Left rail — queue + filters; collapsible. Mobile (<lg) hides
          the rail entirely; the breadcrumb is the back path there. */}
      <aside
        aria-label="Queue rail"
        className={cn(
          'hidden h-full shrink-0 overflow-hidden border-r border-border-subtle/60 bg-background/30 backdrop-blur-sm transition-[width] duration-300 ease-out lg:block',
          railCollapsed ? 'w-0' : 'w-[320px]',
        )}
      >
        <div
          className={cn(
            'flex h-full w-[320px] flex-col transition-opacity duration-200',
            railCollapsed && 'pointer-events-none opacity-0',
          )}
        >
          <div className="shrink-0 border-b border-border-subtle/40 px-3 py-3">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                Queue
              </span>
              <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
                {seed.submissions.length}
              </span>
            </div>
            <QueueFilters />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <QueuePreview />
          </div>
        </div>
      </aside>

      {/* Rail toggle handle */}
      <button
        type="button"
        onClick={() => setRailCollapsed((s) => !s)}
        aria-label={railCollapsed ? 'Show queue' : 'Hide queue'}
        title={railCollapsed ? 'Show queue' : 'Hide queue'}
        className={cn(
          'absolute top-1/2 z-20 hidden h-14 w-3.5 -translate-y-1/2 items-center justify-center border border-border-subtle bg-surface/80 text-text-tertiary shadow-sm transition-all duration-300 ease-out hover:bg-surface-hover hover:text-text-primary lg:flex',
          railCollapsed
            ? 'left-0 rounded-r-md border-l-0'
            : 'left-[320px] -translate-x-1/2 rounded-md',
        )}
      >
        {railCollapsed ? (
          <ChevronRight size={11} aria-hidden="true" />
        ) : (
          <ChevronLeft size={11} aria-hidden="true" />
        )}
      </button>

      {/* Right side — submission content */}
      <div className="flex min-w-0 flex-1 flex-col">
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
                        postAction(
                          'Requesting more information before I can move forward.',
                        )
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

        {/* Tab body — single or split */}
        {splitMode && submissionTabRight ? (
          <div className="min-h-0 flex-1">
            <SplitPaneShell
              ratio={splitRatio}
              onRatioChange={setSplitRatio}
            >
              <Pane
                pane="left"
                activeTab={submissionTab}
                otherPaneTab={submissionTabRight}
                splitMode
                submission={submission}
                isApproverInReview={isApproverInReview}
                onSelectTab={(t) => setSubmissionTab(t, 'left')}
                onToggleSplit={toggleSplitMode}
              />
              <Pane
                pane="right"
                activeTab={submissionTabRight}
                otherPaneTab={submissionTab}
                splitMode
                submission={submission}
                isApproverInReview={isApproverInReview}
                onSelectTab={(t) => setSubmissionTab(t, 'right')}
                onToggleSplit={toggleSplitMode}
              />
            </SplitPaneShell>
          </div>
        ) : (
          <Pane
            pane="left"
            activeTab={submissionTab}
            otherPaneTab={null}
            splitMode={false}
            submission={submission}
            isApproverInReview={isApproverInReview}
            onSelectTab={(t) => setSubmissionTab(t, 'left')}
            onToggleSplit={toggleSplitMode}
          />
        )}
      </div>
    </motion.div>
  );
}

interface PaneProps {
  pane: 'left' | 'right';
  activeTab: SubmissionTab;
  /** The OTHER pane's tab — used to show what's already on the opposite side. */
  otherPaneTab: SubmissionTab | null;
  splitMode: boolean;
  submission: Submission;
  isApproverInReview: boolean;
  onSelectTab: (tab: SubmissionTab) => void;
  onToggleSplit: () => void;
}

function Pane({
  pane,
  activeTab,
  otherPaneTab,
  splitMode,
  submission,
  isApproverInReview,
  onSelectTab,
  onToggleSplit,
}: PaneProps) {
  const [dropHover, setDropHover] = useState(false);

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    if (!splitMode) return;
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDropHover(true);
    }
  };
  const onDragLeave = () => setDropHover(false);
  const onDrop = (e: DragEvent<HTMLElement>) => {
    setDropHover(false);
    if (!splitMode) return;
    const tab = e.dataTransfer.getData(DRAG_TYPE) as SubmissionTab;
    if (tab && TABS.some((t) => t.id === tab) && tab !== activeTab) {
      e.preventDefault();
      onSelectTab(tab);
    }
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col transition-shadow',
        dropHover && 'ring-2 ring-inset ring-[var(--themis-primary)]/50',
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <TabBar
        pane={pane}
        activeTab={activeTab}
        otherPaneTab={otherPaneTab}
        splitMode={splitMode}
        onSelectTab={onSelectTab}
        onToggleSplit={onToggleSplit}
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        <TabBody
          tab={activeTab}
          submission={submission}
          isApproverInReview={isApproverInReview}
          compact={splitMode}
        />
      </div>
    </div>
  );
}

interface TabBarProps {
  pane: 'left' | 'right';
  activeTab: SubmissionTab;
  otherPaneTab: SubmissionTab | null;
  splitMode: boolean;
  onSelectTab: (tab: SubmissionTab) => void;
  onToggleSplit: () => void;
}

function TabBar({
  pane,
  activeTab,
  otherPaneTab,
  splitMode,
  onSelectTab,
  onToggleSplit,
}: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label={splitMode ? `${pane} pane tabs` : 'Submission view'}
      className="relative shrink-0 border-b border-border-subtle bg-background/60 backdrop-blur-sm"
    >
      <div
        className={cn(
          'flex',
          splitMode ? 'px-2' : 'mx-auto max-w-5xl px-4 md:px-8',
        )}
      >
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          const isOnOther = otherPaneTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              draggable={splitMode}
              onDragStart={(e) => {
                if (!splitMode) return;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData(DRAG_TYPE, t.id);
              }}
              onClick={() => onSelectTab(t.id)}
              className={cn(
                'group relative flex items-center gap-1.5 px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors',
                splitMode || 'px-4 py-3 tracking-[0.25em]',
                isActive
                  ? 'text-[var(--themis-primary)]'
                  : 'text-text-tertiary hover:text-text-secondary',
                isOnOther && !isActive && 'opacity-50',
              )}
              title={
                splitMode && isOnOther
                  ? `${t.label} is on the ${pane === 'left' ? 'right' : 'left'} pane`
                  : t.label
              }
            >
              <t.icon size={11} aria-hidden="true" />
              <span>{t.label}</span>
              {isOnOther && !isActive && (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-1 w-1 rounded-full bg-text-tertiary"
                  title="Open on the other pane"
                />
              )}
              {isActive && (
                <motion.span
                  layoutId={`submission-tab-underline-${pane}`}
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: 'var(--themis-primary)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        {/* Spacer + split-mode controls (only on left pane in split mode,
            or always on the single pane) */}
        {(pane === 'left' || !splitMode) && (
          <div className="ml-auto flex items-center gap-1 px-1">
            <button
              type="button"
              onClick={onToggleSplit}
              aria-label={splitMode ? 'Unsplit panes' : 'Split into two panes'}
              title={
                splitMode
                  ? 'Unsplit (close right pane)'
                  : 'Split into two panes'
              }
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
                splitMode
                  ? 'text-[var(--themis-primary)] hover:bg-[var(--themis-glass-tint)]'
                  : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary',
              )}
            >
              {splitMode ? (
                <>
                  <PanelRightClose size={11} aria-hidden="true" />
                  <span className="hidden sm:inline">Unsplit</span>
                </>
              ) : (
                <>
                  <Columns2 size={11} aria-hidden="true" />
                  <span className="hidden sm:inline">Split</span>
                </>
              )}
            </button>
          </div>
        )}
        {/* Right pane in split mode gets a small swap hint instead */}
        {pane === 'right' && splitMode && (
          <div className="ml-auto flex items-center px-1">
            <span
              className="flex items-center gap-1 px-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary"
              title="Drag a tab to the other pane to swap"
            >
              <ArrowLeftRight size={10} aria-hidden="true" />
              <span className="hidden md:inline">drag to swap</span>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}

interface TabBodyProps {
  tab: SubmissionTab;
  submission: Submission;
  isApproverInReview: boolean;
  /** Tighter padding when used inside a split pane. */
  compact?: boolean;
}

function TabBody({ tab, submission, isApproverInReview, compact }: TabBodyProps) {
  if (tab === 'document') {
    return (
      <div className={cn('h-full overflow-y-auto', compact ? 'px-4 py-4' : 'px-4 py-5 md:px-8')}>
        <div className={cn('mx-auto', compact ? 'max-w-none' : 'max-w-3xl')}>
          {isApproverInReview && <WhyCard submission={submission} />}
          <DocumentBody submission={submission} />
        </div>
      </div>
    );
  }
  if (tab === 'thread') {
    return (
      <div className={cn('mx-auto h-full', compact ? 'max-w-none' : 'max-w-3xl')}>
        <ThreadTab />
      </div>
    );
  }
  if (tab === 'context') {
    return (
      <div className={cn('mx-auto h-full', compact ? 'max-w-none' : 'max-w-3xl')}>
        <ContextTab />
      </div>
    );
  }
  return <DianeStub />;
}

function ActionButton({
  icon: Icon,
  color,
  label,
  onClick,
}: {
  icon: LucideIcon;
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
