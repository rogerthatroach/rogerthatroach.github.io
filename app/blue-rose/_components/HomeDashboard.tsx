'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  ChevronRight,
  Eye,
  FileEdit,
  FileText,
  Inbox,
  PenLine,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { useThemis, useCurrentPersona, usePersonaMap } from '../_lib/store';
import StatusPill from './StatusPill';
import FloatingAvatar from './FloatingAvatar';
import { relativeTime } from '../_lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * HomeDashboard — landing surface after unlock. Persona-aware tiles
 * surface what's relevant for the current viewer + a recent-activity
 * strip to give a sense of life.
 *
 * Light, breathing layout. Tiles route into their dedicated pages so
 * the user only opts into density when they want it.
 */
export default function HomeDashboard() {
  const { seed, fieldComments, messages, selectSubmission } = useThemis();
  const persona = useCurrentPersona();
  const personaMap = usePersonaMap();

  const stats = useMemo(() => {
    const myDrafts = seed.submissions.filter(
      (s) => s.submittedBy === persona.id && s.status === 'draft',
    );
    const awaitingMe = seed.submissions.filter(
      (s) =>
        s.assignees.includes(persona.id) &&
        (s.status === 'in_review' || s.status === 'pending'),
    );
    const inFlight = seed.submissions.filter(
      (s) =>
        (s.submittedBy === persona.id || s.assignees.includes(persona.id)) &&
        s.status !== 'approved' &&
        s.status !== 'rejected' &&
        s.status !== 'draft',
    );
    const totalMentions = messages.filter((m) =>
      m.mentions?.includes(persona.id),
    ).length;
    const fieldCommentsTotal = fieldComments.length;
    const recent = [...seed.submissions]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
    return {
      myDrafts,
      awaitingMe,
      inFlight,
      totalMentions,
      fieldCommentsTotal,
      recent,
    };
  }, [seed, persona, messages, fieldComments]);

  const isApprover = persona.role === 'approver' || persona.role === 'admin';
  const isAdmin = persona.role === 'admin';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const summaryLine = useMemo(() => {
    const parts: string[] = [];
    if (isApprover && stats.awaitingMe.length > 0) {
      parts.push(
        `${stats.awaitingMe.length} ${stats.awaitingMe.length === 1 ? 'request awaits' : 'requests await'} your decision`,
      );
    }
    if (stats.totalMentions > 0) {
      parts.push(`${stats.totalMentions} unread mention${stats.totalMentions === 1 ? '' : 's'}`);
    }
    if (parts.length === 0) {
      return 'All quiet. Diane is watching.';
    }
    return parts.join(' · ');
  }, [isApprover, stats]);

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            {greeting}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-text-primary md:text-4xl">
            {persona.displayName}
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">{summaryLine}.</p>
        </motion.div>

        {/* Tile grid */}
        <motion.div
          variants={fadeUp}
          className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isApprover && (
            <Tile
              href="/blue-rose/inbox"
              icon={Inbox}
              label="Awaiting your decision"
              value={stats.awaitingMe.length}
              hint="Open the inbox"
              accent="var(--themis-in-review)"
            />
          )}
          <Tile
            href="/blue-rose/inbox"
            icon={Activity}
            label="In flight"
            value={stats.inFlight.length}
            hint="Submissions you're a part of"
          />
          <Tile
            href="/blue-rose/drafts"
            icon={FileEdit}
            label="Drafts"
            value={stats.myDrafts.length}
            hint="Yours to finish"
          />
          <Tile
            href="/blue-rose/compose"
            icon={PenLine}
            label="Start a request"
            value="↗"
            hint="Routing preview · full flow Tier 2"
          />
          {isAdmin && (
            <>
              <Tile
                href="/blue-rose/workflows"
                icon={Workflow}
                label="Workflows"
                value="8"
                hint="Routing rules · read-only"
              />
              <Tile
                href="/blue-rose/audit"
                icon={Eye}
                label="Audit log"
                value={stats.totalMentions > 0 ? '↗' : '—'}
                hint="Cross-submission timeline"
              />
            </>
          )}
          <Tile
            href="/blue-rose/insights"
            icon={BarChart3}
            label="Insights"
            value={stats.recent.length > 0 ? '↗' : '—'}
            hint="KPIs, charts, scenarios, ask Diane"
          />
          <Tile
            href="/blue-rose/diane"
            icon={Sparkles}
            label="Diane"
            value="↗"
            hint="Decision Ledger · LLMOps"
            accent="#F59E0B"
          />
        </motion.div>

        {/* Recent activity strip */}
        <motion.section variants={fadeUp}>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Recent activity
            </h2>
            <Link
              href="/blue-rose/inbox"
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary transition-colors hover:text-text-primary"
            >
              <span>Open inbox</span>
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>
          <ul className="overflow-hidden rounded-xl border border-border-subtle bg-surface/40 divide-y divide-border-subtle/60">
            {stats.recent.map((s) => {
              const submitter = personaMap.get(s.submittedBy);
              return (
                <li key={s.id}>
                  <Link
                    href="/blue-rose/submission"
                    onClick={() => selectSubmission(s.id)}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover/60"
                  >
                    <FloatingAvatar
                      seed={submitter?.avatarSeed ?? s.id}
                      size={26}
                      ringColor={submitter?.accentHex}
                      static
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <StatusPill status={s.status} />
                        <span className="font-mono text-[10px] text-text-tertiary">
                          {relativeTime(s.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12.5px] text-text-primary">
                        {s.title}
                      </p>
                    </div>
                    <ChevronRight
                      size={12}
                      className="shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* Things to try — seeded scenarios that cross-cut compose + approver */}
        <ThingsToTry />
      </motion.div>
    </div>
  );
}

function ThingsToTry() {
  const { seed, selectSubmission, setCurrentPersonaId } = useThemis();
  const router = useRouter();

  const scenarios = useMemo(() => {
    const out: Array<{
      label: string;
      personaId: string;
      submissionId: string;
      tone: 'capex' | 'cross-border';
    }> = [];
    // Capex flagship — s_001 (threshold breach) — Bob equivalent is whoever
    // is in the assignee chain, prefer p_marcus (VP Compliance) as he's
    // the secondary in the seeded chain
    const capex = seed.submissions.find((s) => s.id === 's_001');
    if (capex) {
      out.push({
        label: 'Approve a $14M threshold breach as Tammy',
        personaId: capex.assignees[0] ?? 'p_priya',
        submissionId: capex.id,
        tone: 'capex',
      });
    }
    // Cross-border — s_002 (data residency) — Phyllis (General Counsel)
    const xb = seed.submissions.find((s) => s.id === 's_002');
    if (xb) {
      out.push({
        label: 'Read a cross-border data exception as Phyllis',
        personaId:
          xb.assignees.find((id) => id === 'p_legal') ??
          xb.assignees[0] ??
          'p_legal',
        submissionId: xb.id,
        tone: 'cross-border',
      });
    }
    return out;
  }, [seed.submissions]);

  if (scenarios.length === 0) return null;

  return (
    <motion.section variants={fadeUp} className="mt-10">
      <h2 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        <Sparkles size={10} style={{ color: 'var(--themis-sakura)' }} aria-hidden="true" />
        <span>Things to try</span>
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {scenarios.map((s) => {
          const persona = seed.personas.find((p) => p.id === s.personaId);
          return (
            <li key={s.submissionId}>
              <button
                type="button"
                onClick={() => {
                  if (persona) setCurrentPersonaId(persona.id);
                  selectSubmission(s.submissionId);
                  router.push('/blue-rose/submission');
                }}
                className="group flex w-full items-start gap-3 rounded-2xl border bg-surface/40 px-4 py-3 text-left transition-all hover:border-[var(--themis-sakura-border)] hover:bg-[var(--themis-sakura-bg)]"
                style={{ borderColor: 'rgba(176, 122, 130, 0.18)' }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: 'var(--themis-sakura-bg)',
                    color: 'var(--themis-sakura)',
                    boxShadow: '0 0 0 1px var(--themis-sakura-border)',
                  }}
                >
                  <Sparkles size={11} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[14px] italic leading-snug text-text-primary">
                    {s.label}
                  </span>
                  {persona && (
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                      switches you to {persona.displayName} · {persona.title ?? persona.role}
                    </span>
                  )}
                </span>
                <ArrowRight
                  size={12}
                  className="mt-1 shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

function Tile({
  href,
  icon: Icon,
  label,
  value,
  hint,
  accent,
  disabled,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
  value: string | number;
  hint: string;
  accent?: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border border-border-subtle bg-surface/40 px-4 py-4 transition-all',
        !disabled && 'hover:border-[var(--themis-primary)]/40 hover:bg-[var(--themis-glass-tint)] hover:shadow-[0_8px_24px_-12px_rgba(126,106,168,0.25)]',
        disabled && 'opacity-60',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--themis-glass-tint)]"
          style={accent ? { color: accent } : { color: 'var(--themis-primary)' }}
          aria-hidden="true"
        >
          <Icon size={14} />
        </span>
        {!disabled && (
          <ArrowRight
            size={12}
            className="text-text-tertiary transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-3 font-display text-[28px] font-medium leading-none text-text-primary">
        {value}
      </p>
      <p className="mt-1.5 text-[12.5px] font-medium text-text-primary">{label}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        {hint}
      </p>
    </div>
  );

  if (disabled) return <div aria-disabled="true">{inner}</div>;
  return <Link href={href}>{inner}</Link>;
}
