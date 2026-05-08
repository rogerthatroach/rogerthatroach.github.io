'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, LogOut, Search } from 'lucide-react';
import { useThemis } from '../_lib/store';
import PauseDianeChip from './PauseDianeChip';
import PersonaPill from './PersonaPill';
import OwlGlyph from './OwlGlyph';
import Breadcrumb from './Breadcrumb';
import NotificationsDrawer from './NotificationsDrawer';
import { blurIn } from '@/lib/motion';

interface WhiteLodgeLayoutProps {
  children: React.ReactNode;
  onLock: () => void;
}

/**
 * WhiteLodgeLayout — shared chrome wrapping every post-unlock route.
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ [🦉 White Lodge] · Home / Inbox / [submission] [persona] [⌘] │
 *   ├──────────────────────────────────────────────────────────────┤
 *   │                                                              │
 *   │  {children}  ← whichever page is active                      │
 *   │                                                              │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * The header is fixed at top; children fill the remaining viewport with
 * `h-screen` + `overflow-hidden` on the outer container so each page
 * controls its own scrolling internally (per-pane scroll discipline).
 */
export default function WhiteLodgeLayout({ children, onLock }: WhiteLodgeLayoutProps) {
  const { seed, currentPersonaId, setCurrentPersonaId, notifications } = useThemis();
  const [notifsOpen, setNotifsOpen] = useState(false);

  const unreadCount = useMemo(
    () =>
      notifications.filter((n) => n.forPersonaId === currentPersonaId && !n.read).length,
    [notifications, currentPersonaId],
  );

  return (
    <motion.div
      variants={blurIn}
      initial="initial"
      animate="animate"
      className="themis-vignette flex h-screen flex-col overflow-hidden"
    >
      <header className="z-30 shrink-0 border-b border-border-subtle bg-background/70 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-3 md:px-6">
          {/* Brand: owl glyph + White Lodge wordmark, links back to /home */}
          <Link
            href="/blue-rose/home"
            className="group flex shrink-0 items-center gap-2"
            aria-label="White Lodge — home"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)] transition-shadow group-hover:ring-[var(--themis-primary)]/50"
              style={{ color: 'var(--themis-primary)' }}
              aria-hidden="true"
            >
              <OwlGlyph size={18} />
            </span>
            <span className="font-display text-base font-medium uppercase tracking-[0.18em] text-text-primary transition-colors group-hover:text-[var(--themis-primary)]">
              White Lodge
            </span>
          </Link>

          {/* Separator + breadcrumb */}
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-border-subtle md:inline-block"
          />
          <Breadcrumb />

          {/* Right cluster — Diane state, persona, search, notifications, lock */}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <PauseDianeChip />
            </div>
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
              aria-label={
                unreadCount > 0
                  ? `Notifications (${unreadCount} unread)`
                  : 'Notifications'
              }
              onClick={() => setNotifsOpen(true)}
              className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/70 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary sm:flex"
            >
              <Bell size={14} aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 font-mono text-[9px] font-medium leading-none ring-2 ring-background"
                  style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
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

      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>

      <NotificationsDrawer open={notifsOpen} onClose={() => setNotifsOpen(false)} />
    </motion.div>
  );
}
