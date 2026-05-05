'use client';

import { motion } from 'framer-motion';
import { Eye, MessageSquare, Sparkles } from 'lucide-react';
import { useThemis, type RightPaneTab } from '../_lib/store';
import ContextTab from './ContextTab';
import ThreadTab from './ThreadTab';
import { cn } from '@/lib/utils';

const TABS: { id: RightPaneTab; label: string; icon: typeof Eye }[] = [
  { id: 'context', label: 'Context', icon: Eye },
  { id: 'thread', label: 'Thread', icon: MessageSquare },
  { id: 'diane', label: 'Diane', icon: Sparkles },
];

/**
 * RightPane — tab orchestrator (Tier 1).
 *
 * Three tabs:
 *   - Context: form data, attachments, audit, insights, precedence, watchers
 *   - Thread:  whole-submission chat (composer + messages)
 *   - Diane:   stub for T1; T2/T3 fills with smart-drafting commentary,
 *              "Why is this in front of me?" detail, routing preview,
 *              confidence + citations.
 *
 * Tab state lives in the store (`rightPaneTab`) so other components can
 * trigger a tab switch (e.g., SubmissionView's "Open thread" button,
 * future T3 auto-switch on @-mentions and status changes).
 */
export default function RightPane() {
  const { rightPaneTab, setRightPaneTab, selectedSubmissionId } = useThemis();

  if (!selectedSubmissionId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <Sparkles size={20} className="text-text-tertiary" aria-hidden="true" />
        <p className="text-[12px] text-text-tertiary">
          Open a submission to see context, the thread, or Diane&apos;s notes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <nav
        role="tablist"
        aria-label="Right pane"
        className="relative flex shrink-0 items-center border-b border-border-subtle bg-background/60 backdrop-blur-sm"
      >
        {TABS.map((t) => {
          const isActive = rightPaneTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setRightPaneTab(t.id)}
              className={cn(
                'group relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-widest transition-colors',
                isActive
                  ? 'text-[var(--themis-primary)]'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              <t.icon size={11} aria-hidden="true" />
              <span>{t.label}</span>
              {isActive && (
                <motion.span
                  layoutId="right-pane-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: 'var(--themis-primary)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1">
        {rightPaneTab === 'context' && <ContextTab />}
        {rightPaneTab === 'thread' && <ThreadTab />}
        {rightPaneTab === 'diane' && <DianeStub />}
      </div>
    </div>
  );
}

function DianeStub() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center"
        style={{
          background: 'rgba(245, 158, 11, 0.12)',
          borderRadius: '34% 66% 38% 62% / 38% 32% 68% 62%', // squircle hint
        }}
      >
        <Sparkles size={20} style={{ color: '#F59E0B' }} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-text-primary">Diane</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          AI agent · arrives in Tier 2
        </p>
      </div>
      <p className="max-w-[280px] text-[11.5px] leading-relaxed text-text-secondary">
        Smart drafting on Compose, &ldquo;Why is this in front of me?&rdquo; for approvers, routing
        preview before submission, confidence + citations on every output.
      </p>
    </div>
  );
}
