'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, X } from 'lucide-react';
import { useThemis, usePersonaMap } from '../_lib/store';
import AuditRow from './AuditRow';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ActorFilter = 'all' | 'humans' | 'diane';

/**
 * AuditPage — `/blue-rose/audit`.
 *
 * Cross-submission audit timeline. Reuses the per-row renderer from
 * ContextTab so the surface is identical to in-submission audit; this
 * page just removes the per-submission scope.
 *
 * Top filter bar: actor toggle (All / Humans only / Diane only) + an
 * inline event-kind chip group. T1.9 ships visibility (no faceted UI
 * polish — that's T3 reactivity's deletion-review opportunity).
 */
export default function AuditPage() {
  const { seed, selectSubmission } = useThemis();
  const personaMap = usePersonaMap();
  const [actorFilter, setActorFilter] = useState<ActorFilter>('all');
  const [kindFilter, setKindFilter] = useState<string | null>(null);

  const eventKinds = useMemo(() => {
    const out = new Set<string>();
    for (const e of seed.audit) out.add(e.kind);
    return Array.from(out).sort();
  }, [seed.audit]);

  const filtered = useMemo(() => {
    return [...seed.audit]
      .sort((a, b) => b.at - a.at)
      .filter((e) => {
        if (kindFilter && e.kind !== kindFilter) return false;
        const actor = personaMap.get(e.actorPersonaId);
        if (actorFilter === 'humans' && actor?.role === 'agent') return false;
        if (actorFilter === 'diane' && actor?.role !== 'agent') return false;
        return true;
      });
  }, [seed.audit, personaMap, actorFilter, kindFilter]);

  const submissionMap = useMemo(() => {
    const m = new Map<string, (typeof seed.submissions)[number]>();
    for (const s of seed.submissions) m.set(s.id, s);
    return m;
  }, [seed.submissions]);

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)]"
            style={{ color: 'var(--themis-primary)' }}
            aria-hidden="true"
          >
            <Activity size={18} />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Cross-submission audit
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
            Audit log
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            Every action in Themis lands here as a typed event. AI-actor events
            (Diane) expose their MCP-tool-call rationale + field-group + cited
            policy clauses inline — the audit boundary is structural, not
            aspirational. Filter by actor or by event kind below.
          </p>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          variants={fadeUp}
          className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <div className="flex items-center gap-1">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Actor
            </span>
            {(['all', 'humans', 'diane'] as ActorFilter[]).map((f) => {
              const active = actorFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActorFilter(f)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors',
                    active
                      ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                      : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                  )}
                >
                  {f === 'all' ? 'All' : f === 'humans' ? 'Humans' : 'Diane'}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Kind
            </span>
            {eventKinds.map((k) => {
              const active = kindFilter === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKindFilter(active ? null : k)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                    active
                      ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                      : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                  )}
                >
                  {k.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>

          {(actorFilter !== 'all' || kindFilter) && (
            <button
              type="button"
              onClick={() => {
                setActorFilter('all');
                setKindFilter(null);
              }}
              className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
            >
              <X size={10} aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeUp}>
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border-subtle bg-surface/30 px-6 py-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
              No events match these filters
            </p>
          ) : (
            <ol className="relative space-y-3 pl-4">
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-1.5 h-[calc(100%-12px)] w-px bg-border-subtle"
              />
              {filtered.map((e) => {
                const sub = submissionMap.get(e.submissionId);
                const actor = personaMap.get(e.actorPersonaId);
                return (
                  <AuditRow
                    key={e.id}
                    event={e}
                    actorName={actor?.displayName ?? 'Unknown'}
                    isAgent={actor?.role === 'agent'}
                    citations={sub?.diane?.citations}
                    submissionTitle={sub?.title}
                    onSubmissionClick={() => {
                      if (sub) selectSubmission(sub.id);
                    }}
                    submissionHref="/blue-rose/submission"
                  />
                );
              })}
            </ol>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/blue-rose/home"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={11} aria-hidden="true" />
            <span>Back to home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
