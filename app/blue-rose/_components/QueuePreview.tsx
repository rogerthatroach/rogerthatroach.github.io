'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Inbox, Paperclip, AtSign, MessageCircle, FilterX, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemis, useCurrentPersona } from '../_lib/store';
import { applyFilters, activeFilterCount } from '../_lib/filters';
import FloatingAvatar from './FloatingAvatar';
import StatusPill from './StatusPill';
import { relativeTime } from '../_lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * QueuePreview — left-pane queue list. Click a card to open the thread
 * in the right pane (or full-screen on mobile).
 *
 * Filtering pipeline:
 *   1. Persona-scoped subset (submitter sees own + assigned; approver
 *      sees assigned + own; observer sees all)
 *   2. User-applied filters from the queue header (status, submitter,
 *      business unit, severity, kind, amount, has-attachments, unread)
 */
export default function QueuePreview() {
  const {
    seed,
    messages,
    threads,
    selectedSubmissionId,
    selectSubmission,
    fieldComments,
    queueFilters,
    clearFilters,
  } = useThemis();
  const persona = useCurrentPersona();

  const personaScoped = useMemo(() => {
    return seed.submissions.filter((s) => {
      if (persona.role === 'submitter') {
        return s.submittedBy === persona.id || s.assignees.includes(persona.id);
      }
      if (persona.role === 'approver' || persona.role === 'admin') {
        return s.assignees.includes(persona.id) || s.submittedBy === persona.id;
      }
      return true;
    });
  }, [seed, persona]);

  const unreadByThread = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of threads) map.set(t.id, t.unreadByPersonaId[persona.id] ?? 0);
    return map;
  }, [threads, persona.id]);

  const filtered = useMemo(() => {
    return applyFilters(personaScoped, queueFilters, { unreadByThread }).sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
  }, [personaScoped, queueFilters, unreadByThread]);

  const personasById = useMemo(
    () => new Map(seed.personas.map((p) => [p.id, p])),
    [seed.personas],
  );

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
    const filtersActive = activeFilterCount(queueFilters) > 0;
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-subtle bg-surface/40 px-6 py-12 text-center">
        {filtersActive ? (
          <>
            <FilterX size={24} className="text-text-tertiary" aria-hidden="true" />
            <p className="text-[12.5px] text-text-secondary">
              No submissions match the active filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-[var(--themis-primary)]/30 bg-[var(--themis-glass-tint)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors hover:bg-[var(--themis-primary)]/15"
              style={{ color: 'var(--themis-primary)' }}
            >
              Clear filters
            </button>
          </>
        ) : (
          <>
            <Inbox size={24} className="text-text-tertiary" aria-hidden="true" />
            <p className="font-display text-[13px] italic leading-relaxed text-text-secondary">
              All quiet here. Diane is watching.
            </p>
          </>
        )}
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
        const unreadCount = unreadByThread.get(s.threadId) ?? 0;
        const hasMention = (lastMsg?.mentions ?? []).includes(persona.id);
        const hasAttachments = s.attachmentIds.length > 0;
        const fieldCommentCount = fieldCommentCountBySubmission.get(s.id) ?? 0;
        const isActive = s.id === selectedSubmissionId;

        return (
          <motion.li key={s.id} variants={fadeUp}>
            <Link
              href="/blue-rose/submission"
              onClick={() => selectSubmission(s.id)}
              aria-current={isActive ? 'page' : undefined}
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
                {s.diane?.summary && (
                  <p
                    className="mt-1 line-clamp-1 flex items-baseline gap-1 text-[11.5px] italic leading-snug"
                    style={{ color: 'var(--themis-sakura)' }}
                  >
                    <Sparkles
                      size={9}
                      aria-hidden="true"
                      className="shrink-0 translate-y-[1px]"
                    />
                    <span className="min-w-0 truncate text-text-secondary">
                      {s.diane.summary}
                    </span>
                  </p>
                )}
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
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
