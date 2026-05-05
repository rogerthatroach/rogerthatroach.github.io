'use client';

import { motion } from 'framer-motion';
import { Bell, LogOut, Search } from 'lucide-react';
import { useThemis } from '../_lib/store';
import PersonaPill from './PersonaPill';
import QueuePreview from './QueuePreview';
import { blurIn } from '@/lib/motion';

interface ShellProps {
  onLock: () => void;
}

/**
 * Themis shell — Tier 0 placeholder.
 *
 * Top bar with wordmark + persona switcher + lock button. Body shows the
 * filtered queue for the current persona (read-only preview). Tier 1
 * upgrades this to the full three-pane (queue ↔ thread ↔ context).
 */
export default function Shell({ onLock }: ShellProps) {
  const { seed, currentPersonaId, setCurrentPersonaId } = useThemis();

  return (
    <motion.div
      variants={blurIn}
      initial="initial"
      animate="animate"
      className="themis-vignette flex min-h-screen flex-col"
    >
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center gap-3 px-6 py-3 md:px-10">
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <Search size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Notifications (coming in Tier 3)"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
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

      <main className="mx-auto w-full max-w-content flex-1 px-6 pb-16 pt-6 md:px-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-medium text-text-primary">
            Queue
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            Tier 0 · read-only · queue → thread → context lands in Tier 1
          </span>
        </div>
        <QueuePreview />
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
          {seed.submissions.length} submissions · {seed.threads.length} threads ·{' '}
          {seed.messages.length} messages · {seed.personas.length} personas
        </p>
      </main>
    </motion.div>
  );
}
