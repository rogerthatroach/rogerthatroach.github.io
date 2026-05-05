'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Search } from 'lucide-react';
import { useThemis } from '../_lib/store';
import PersonaPill from './PersonaPill';
import QueuePreview from './QueuePreview';
import QueueFilters from './QueueFilters';
import SubmissionView from './SubmissionView';
import RightPane from './RightPane';
import { blurIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface ShellProps {
  onLock: () => void;
}

/**
 * Themis shell — Tier 1 three-pane layout (structured-doc-first).
 *
 *   ≥1280px (xl): queue 320px · SubmissionView 1fr · RightPane 380px
 *   1024-1279px:  queue 320px · SubmissionView 1fr; RightPane is a slide-in
 *                 drawer triggered from SubmissionView header
 *   <1024px:      single pane. Queue ↔ SubmissionView swap; "Details"
 *                 trigger opens RightPane drawer
 *
 * Drawer state lives here — passed down via prop to SubmissionView so
 * its header can trigger it on <xl widths.
 */
export default function Shell({ onLock }: ShellProps) {
  const { seed, currentPersonaId, setCurrentPersonaId, selectedSubmissionId } = useThemis();
  const showSubmissionOnMobile = selectedSubmissionId !== null;
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!selectedSubmissionId) setDrawerOpen(false);
  }, [selectedSubmissionId]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

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

      <main className="grid w-full flex-1 grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_380px]">
        <section
          aria-label="Queue"
          className={cn(
            'border-r border-border-subtle/60 lg:overflow-y-auto',
            showSubmissionOnMobile && 'hidden lg:block',
          )}
        >
          <div className="px-3 py-3 md:px-4">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h2 className="font-display text-[15px] font-medium text-text-primary">Queue</h2>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                {seed.submissions.length}
              </span>
            </div>
            <div className="mb-3">
              <QueueFilters />
            </div>
            <QueuePreview />
          </div>
        </section>
        <section
          aria-label="Submission"
          className={cn(
            'min-h-0 lg:overflow-y-auto',
            !showSubmissionOnMobile && 'hidden lg:block',
          )}
        >
          <div className="lg:h-[calc(100vh-57px)]">
            <SubmissionView onOpenDetails={() => setDrawerOpen(true)} />
          </div>
        </section>
        <aside
          aria-label="Right pane"
          className="hidden border-l border-border-subtle/60 xl:block xl:overflow-hidden"
        >
          <div className="xl:h-[calc(100vh-57px)]">
            <RightPane />
          </div>
        </aside>
      </main>

      {/* Slide-in drawer for the right pane on <xl widths */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="rp-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm xl:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="rp-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Submission context, thread, and Diane"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-[min(440px,94vw)] border-l border-border-subtle bg-background shadow-2xl xl:hidden"
            >
              <div className="h-full">
                <RightPane />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
