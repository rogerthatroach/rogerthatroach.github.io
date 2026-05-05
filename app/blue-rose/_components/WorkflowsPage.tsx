'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Workflow } from 'lucide-react';
import { SEEDED_RULES, type Rule } from '../_lib/rules';
import { fadeUp, staggerContainer } from '@/lib/motion';

/**
 * WorkflowsPage — `/blue-rose/workflows`.
 *
 * T1.9 fill: read-only When-Then card view of 8 seeded rules. Cards
 * tagged "structural guarantee" are deterministic — they're how the
 * routing intelligence façade earns its name (not prompt engineering;
 * exact-match lookup with rule-id provenance shown in audit).
 *
 * T4 upgrades to a three-mode editor (NL input ↔ When-Then cards ↔
 * visual graph) — same 8 rules, façade pattern from PAR Assist v2.
 */
export default function WorkflowsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)]"
            style={{ color: 'var(--themis-primary)' }}
            aria-hidden="true"
          >
            <Workflow size={18} />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Routing rules · read-only · admin
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
            Workflows
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            {SEEDED_RULES.length} routing rules govern how submissions move
            through the chain. Rules tagged{' '}
            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--themis-approved)' }}
            >
              <ShieldCheck size={11} aria-hidden="true" />
              structural guarantee
            </span>{' '}
            are deterministic — exact-match lookup, no prompt engineering. T4
            upgrades this surface to a three-mode editor (NL input · When-Then
            cards · visual graph) over the same rules.
          </p>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          {SEEDED_RULES.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </motion.ul>

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

function RuleCard({ rule }: { rule: Rule }) {
  return (
    <li
      className="flex flex-col rounded-2xl border bg-surface/40 px-4 py-4"
      style={{ borderColor: 'rgba(185,168,214,0.18)' }}
    >
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="font-display text-[14px] font-medium text-text-primary">
          {rule.title}
        </h2>
        {rule.structuralGuarantee && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
            style={{
              background: 'rgba(110, 168, 137, 0.14)',
              color: 'var(--themis-approved)',
            }}
            title="Deterministic exact-match lookup, not prompt engineering"
          >
            <ShieldCheck size={9} aria-hidden="true" />
            structural
          </span>
        )}
      </header>

      <dl className="space-y-1.5">
        <div className="flex gap-2">
          <dt
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--themis-in-review)' }}
          >
            When
          </dt>
          <dd className="text-[12.5px] leading-snug text-text-primary">
            {rule.when}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--themis-approved)' }}
          >
            Then
          </dt>
          <dd className="text-[12.5px] leading-snug text-text-primary">
            {rule.then}
          </dd>
        </div>
      </dl>

      <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border-subtle/60 pt-2.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
        <span>Owner: {rule.owner}</span>
        {rule.cites && (
          <>
            <span>·</span>
            <span className="normal-case tracking-normal text-text-secondary">
              {rule.cites}
            </span>
          </>
        )}
        <span className="ml-auto">Fired {rule.firedThisWeek}× this week</span>
      </footer>
      <p className="mt-2 truncate font-mono text-[10px] tracking-wider text-text-tertiary">
        {rule.id}
      </p>
    </li>
  );
}
