'use client';

import { useMemo } from 'react';
import { Inbox, Paperclip, AtSign, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemis, useCurrentPersona } from '../_lib/store';
import FloatingAvatar from './FloatingAvatar';
import StatusPill from './StatusPill';
import { relativeTime } from '../_lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * QueuePreview — left-pane queue list. Click a card to open the thread
 * in the right pane (or full-screen on mobile).
 */
export default function QueuePreview() {
  const {
    seed,
    messages,
    threads,
    selectedSubmissionId,
    selectSubmission,
    fieldComments,
  } = useThemis();
  const persona = useCurrentPersona();

  const filtered = useMemo(() => {
    return seed.submissions
      .filter((s) => {
        if (persona.role === 'submitter') {
          return s.submittedBy === persona.id || s.assignees.includes(persona.id);
        }
        if (persona.role === 'approver' || persona.role === 'admin') {
          return s.assignees.includes(persona.id) || s.submittedBy === persona.id;
        }
        return true;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [seed, persona]);

  const personasById = useMemo(
    () => new Map(seed.personas.map((p) => [p.id, p])),
    [seed.personas],
  );
  const unread = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of threads) map.set(t.id, t.unreadByPersonaId[persona.id] ?? 0);
    return map;
  }, [threads, persona.id]);

  const lastMessageByThread = useMemo(() => {
    const map = new Map<string, (typeof messages)[number]>();
    for (const m of messages) {
      const cur = map.get(m.threadId);
      if (!cur || m.createdAt > cur.createdAt) map.set(m.threadId, m);
    }
    return map;
  }, [messages]);

  const fieldCommentCountBySubmission = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of fieldComments) {
      map.set(c.submissionId, (map.get(c.submissionId) ?? 0) + 1);
    }
    return map;
  }, [fieldComments]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-surface/40 px-6 py-16 text-center">
        <Inbox size={28} className="text-text-tertiary" aria-hidden="true" />
        <p className="text-sm text-text-secondary">Nothing in the queue for this persona.</p>
      </div>
    );
  }

  return (
    <motion.ul
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="divide-y divide-border-subtle/60 overflow-hidden rounded-xl border border-border-subtle bg-surface/40"
    >
      {filtered.map((s) => {
        const lastMsg = lastMessageByThread.get(s.threadId);
        const lastAuthor = lastMsg ? personasById.get(lastMsg.authorPersonaId) : undefined;
        const submittedBy = personasById.get(s.submittedBy);
        const unreadCount = unread.get(s.threadId) ?? 0;
        const hasMention = (lastMsg?.mentions ?? []).includes(persona.id);
        const hasAttachments = s.attachmentIds.length > 0;
        const fieldCommentCount = fieldCommentCountBySubmission.get(s.id) ?? 0;
        const isActive = s.id === selectedSubmissionId;

        return (
          <motion.li key={s.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => selectSubmission(s.id)}
              aria-pressed={isActive}
              className={cn(
                'group relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors',
                'hover:bg-surface-hover/60',
                unreadCount > 0 && !isActive && 'bg-[var(--themis-glass-tint)]',
                isActive && 'bg-[var(--themis-glass-tint)]',
              )}
            >
              {(unreadCount > 0 || isActive) && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-[2px]"
                  style={{ background: 'var(--themis-primary)' }}
                />
              )}
              <FloatingAvatar
                seed={(lastAuthor ?? submittedBy)?.avatarSeed ?? s.id}
                size={32}
                ringColor={(lastAuthor ?? submittedBy)?.accentHex}
                static
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <StatusPill status={s.status} />
                  {s.priority === 'high' && (
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--themis-rejected)' }}>
                      ⚑ high
                    </span>
                  )}
                  {hasMention && <AtSign size={11} className="text-accent" aria-label="mentioned" />}
                  {hasAttachments && <Paperclip size={11} className="text-text-tertiary" aria-label="has attachments" />}
                  {fieldCommentCount > 0 && (
                    <span
                      className="flex items-center gap-0.5 font-mono text-[10px]"
                      style={{ color: 'var(--themis-primary)' }}
                      aria-label={`${fieldCommentCount} field comments`}
                    >
                      <MessageCircle size={10} aria-hidden="true" />
                      {fieldCommentCount}
                    </span>
                  )}
                  <span className="ml-auto shrink-0 font-mono text-[10px] tracking-wider text-text-tertiary">
                    {relativeTime(s.updatedAt)}
                  </span>
                </div>
                <h3 className="truncate text-[13.5px] font-medium leading-snug text-text-primary">
                  {s.title}
                </h3>
                {lastMsg && (
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-text-secondary">
                    <span className="font-medium text-text-primary/90">
                      {lastAuthor?.displayName ?? 'Unknown'}:
                    </span>{' '}
                    {lastMsg.body}
                  </p>
                )}
                {s.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {s.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-hover px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-text-tertiary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {unreadCount > 0 && (
                <span
                  className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-medium"
                  style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
                  aria-label={`${unreadCount} unread`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
