'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AtSign,
  Bell,
  CheckCheck,
  CheckCircle2,
  FileText,
  MessageSquare,
  Send,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import type { Notification, NotificationKind } from '@/data/themis/types';
import { useThemis, usePersonaMap } from '../_lib/store';
import FloatingAvatar from './FloatingAvatar';
import { relativeTime } from '../_lib/format';
import { cn } from '@/lib/utils';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const KIND_META: Record<NotificationKind, { icon: LucideIcon; color: string }> = {
  submission_new: { icon: Send, color: 'var(--themis-pending)' },
  mention: { icon: AtSign, color: 'var(--themis-primary)' },
  reply: { icon: MessageSquare, color: 'var(--themis-secondary)' },
  status_change: { icon: CheckCircle2, color: 'var(--themis-in-review)' },
  assignment: { icon: FileText, color: 'var(--themis-secondary)' },
};

/**
 * NotificationsDrawer — slide-in surface from the right edge.
 *
 * Lists notifications for the current persona, newest first. Click a
 * notification → mark read, set selected submission, navigate to the
 * /submission page if it has a `linkTo` target. Mark-all-read in the
 * footer. Esc + backdrop close.
 *
 * No live simulation yet (Tier 3 will add typing/reply chains that
 * spawn notifications); for now the drawer surfaces the seed's static
 * notifications + any new ones the user generates by sending messages.
 */
export default function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  const {
    notifications,
    currentPersonaId,
    seed,
    selectSubmission,
    markNotificationRead,
    markAllNotificationsRead,
  } = useThemis();
  const personaMap = usePersonaMap();
  const router = useRouter();

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const myNotifs = useMemo(
    () =>
      notifications
        .filter((n) => n.forPersonaId === currentPersonaId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications, currentPersonaId],
  );

  const unreadCount = myNotifs.filter((n) => !n.read).length;

  const onSelect = (n: Notification) => {
    markNotificationRead(n.id);
    if (n.linkTo) {
      // linkTo can be a submission id; set the selection and navigate
      const sub = seed.submissions.find((s) => s.id === n.linkTo);
      if (sub) {
        selectSubmission(sub.id);
        router.push('/blue-rose/submission');
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            key="notif-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="themis-glass-pop fixed inset-y-0 right-0 z-50 flex w-[min(380px,92vw)] flex-col"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell size={13} style={{ color: 'var(--themis-primary)' }} aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                    style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    title="Mark all read"
                  >
                    <CheckCheck size={11} aria-hidden="true" />
                    <span>Mark all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {myNotifs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <Bell size={20} className="text-text-tertiary" aria-hidden="true" />
                  <p className="text-[12.5px] text-text-secondary">No notifications.</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                    Diane is watching, quietly.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border-subtle/50">
                  {myNotifs.map((n) => {
                    const meta = KIND_META[n.kind];
                    const Icon = meta?.icon ?? Bell;
                    const linkedSubmission = n.linkTo
                      ? seed.submissions.find((s) => s.id === n.linkTo)
                      : null;
                    const submitter = linkedSubmission
                      ? personaMap.get(linkedSubmission.submittedBy)
                      : undefined;
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(n)}
                          className={cn(
                            'group relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                            'hover:bg-surface-hover/60',
                            !n.read && 'bg-[var(--themis-glass-tint)]',
                          )}
                        >
                          {!n.read && (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-0 h-full w-[2px]"
                              style={{ background: 'var(--themis-primary)' }}
                            />
                          )}
                          <span
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                            style={{
                              background: 'rgba(126, 106, 168, 0.10)',
                              color: meta?.color ?? 'var(--themis-primary)',
                            }}
                            aria-hidden="true"
                          >
                            <Icon size={12} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={cn(
                                  'truncate text-[12.5px] font-medium',
                                  n.read ? 'text-text-secondary' : 'text-text-primary',
                                )}
                              >
                                {n.title}
                              </span>
                              <span className="ml-auto shrink-0 font-mono text-[10px] tracking-wider text-text-tertiary">
                                {relativeTime(n.createdAt)}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-text-secondary">
                              {n.body}
                            </p>
                            {submitter && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <FloatingAvatar
                                  seed={submitter.avatarSeed}
                                  size={14}
                                  ringColor={submitter.accentHex}
                                  static
                                />
                                <span className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                                  {submitter.displayName}
                                </span>
                              </div>
                            )}
                          </div>
                          {n.kind === 'mention' && !n.read && (
                            <span
                              className="ml-2 mt-1 shrink-0 font-mono text-[9px] uppercase tracking-widest"
                              style={{ color: 'var(--themis-primary)' }}
                              aria-label="mention"
                            >
                              @
                            </span>
                          )}
                          {n.kind === 'status_change' && (
                            <CheckCircle2
                              size={11}
                              className="ml-2 mt-1 shrink-0 text-text-tertiary"
                              aria-hidden="true"
                            />
                          )}
                          {n.kind === 'reply' && !n.read && (
                            <span
                              aria-hidden="true"
                              className="ml-2 mt-1 h-2 w-2 shrink-0 rounded-full"
                              style={{ background: 'var(--themis-primary)' }}
                            />
                          )}
                          {/* Suppress unused warnings via the icon mapping */}
                          {/* eslint-disable-next-line */}
                          {false && <XCircle size={0} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <footer className="shrink-0 border-t border-border-subtle bg-surface/40 px-4 py-2.5 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
                Live notifications · arrives in Tier 3
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
