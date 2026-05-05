'use client';

import { motion } from 'framer-motion';
import { Bell, LogOut, Search } from 'lucide-react';
import { useThemis } from '../_lib/store';
import PersonaPill from './PersonaPill';
import QueuePreview from './QueuePreview';
import ThreadView from './ThreadView';
import { blurIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface ShellProps {
  onLock: () => void;
}

/**
 * Themis shell — Tier 0.5 two-pane layout.
 *
 * ≥1024px: queue (left, fixed width) + thread (right, fluid). Both panes
 * always rendered.
 * <1024px: single pane. Selecting a queue item swaps the queue out for
 * the thread; thread's back button returns to the queue.
 *
 * Tier 1 will add a third pane for context/audit on the right.
 */
export default function Shell({ onLock }: ShellProps) {
  const { seed, currentPersonaId, setCurrentPersonaId, selectedSubmissionId } = useThemis();
  const showThreadOnMobile = selectedSubmissionId !== null;

  return (
    <motion.div
      variants={blurIn}
      initial="initial"
      animate="animate"
      className="themis-vignette flex min-h-screen flex-col"
    >
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex w-full items-center gap-3 px-4 py-3 md:px-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg font-medium tracking-tight text-text-primary">
              Themis
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-text-tertiary sm:inline">
              · Concept · Phase 2 prototype
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <PersonaPill
              personas={seed.personas}
              currentPersonaId={currentPersonaId}
              onSwitch={setCurrentPersonaId}
            />
            <button
              type="button"
              aria-label="Search (⌘K)"
              onClick={() => {
                document.dispatchEvent(new CustomEvent('cmdk:open'));
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary sm:flex"
            >
              <Search size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Notifications (Tier 3)"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary sm:flex"
            >
              <Bell size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLock}
              aria-label="Lock session"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <LogOut size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="grid w-full flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        <section
          aria-label="Queue"
          className={cn(
            'border-r border-border-subtle/60 lg:overflow-y-auto',
            showThreadOnMobile && 'hidden lg:block',
          )}
        >
          <div className="px-3 py-3 md:px-4">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h2 className="font-display text-[15px] font-medium text-text-primary">Queue</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                {seed.submissions.length}
              </span>
            </div>
            <QueuePreview />
          </div>
        </section>
        <section
          aria-label="Thread"
          className={cn(
            'min-h-0 lg:overflow-y-auto',
            !showThreadOnMobile && 'hidden lg:block',
          )}
        >
          <div className="lg:h-[calc(100vh-57px)]">
            <ThreadView />
          </div>
        </section>
      </main>
    </motion.div>
  );
}
