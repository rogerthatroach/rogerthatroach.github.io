'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronsDown,
  ChevronsUp,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import { useThemis } from '../../_lib/store';
import {
  PAR_SECTIONS,
  SAMPLE_PAR_VALUES,
  overallCoverage,
} from '../../_lib/par-schema';
import ComposeChatPane from './ComposeChatPane';
import ComposeFormPane from './ComposeFormPane';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Tab = 'draft' | 'financial';

const DRAFT_ID = 'hsd-v003';

/**
 * ComposeShell — top-level layout for `/compose`.
 *
 *  ┌──────────────────────────────────────────────────────────┐
 *  │ [chat pane: Diane assistant + composer]  │  Project PAR ⏵│
 *  │                                          │  78% Completed│
 *  │                                          │  Draft / Fin… │
 *  │                                          │ ▾ Section …   │
 *  └──────────────────────────────────────────┴───────────────┘
 *
 * Phase A scope: structure + 11 accordion sections + status pills +
 * Expand-All/Collapse-All + Draft/Financial tabs + Preview/Policies/
 * Export buttons (stubbed). Phase B/C/D layer modals + drafting chain
 * + submit bridge.
 */
export default function ComposeShell() {
  const { parDraft, parProvenance, batchSetParFields } = useThemis();
  const [activeTab, setActiveTab] = useState<Tab>('draft');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['headers']),
  );
  const [seeded, setSeeded] = useState(false);

  // First-run: seed the sample CRM Modernization values so the demo lands
  // at "78% Completed" matching the Phase 1 reference screenshots.
  useEffect(() => {
    if (seeded) return;
    if (Object.keys(parDraft).length > 0) {
      setSeeded(true);
      return;
    }
    batchSetParFields(SAMPLE_PAR_VALUES, 'diane');
    setSeeded(true);
  }, [parDraft, batchSetParFields, seeded]);

  const coverage = overallCoverage(parDraft);
  const percent = Math.round(coverage * 100);

  const visibleSections =
    activeTab === 'financial'
      ? PAR_SECTIONS.filter((s) => s.financial)
      : PAR_SECTIONS;

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () =>
    setExpandedIds(new Set(visibleSections.map((s) => s.id)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(360px,_42%)_1fr]">
      {/* Left — chat */}
      <ComposeChatPane
        draftId={DRAFT_ID}
        state="Assigning"
        values={parDraft}
      />

      {/* Right — form */}
      <section className="flex h-full min-h-0 flex-col bg-surface/20">
        {/* Top chrome */}
        <header className="shrink-0 border-b border-border-subtle/60 px-5 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[18px] font-medium text-text-primary">
              Project PAR
            </h1>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              title="Preview as document (Phase B)"
            >
              <Eye size={10} aria-hidden="true" />
              <span>Preview</span>
            </button>

            {/* Draft / Financial tab pills (right side) */}
            <nav role="tablist" aria-label="View" className="ml-auto flex gap-1">
              {(['draft', 'financial'] as Tab[]).map((t) => {
                const active = activeTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(t)}
                    className={cn(
                      'rounded-md px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors',
                      active
                        ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                        : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                    )}
                  >
                    {t === 'draft' ? 'Draft' : 'Financial'}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Progress bar + dirty indicator */}
          <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            <span>{percent}% Completed</span>
            <span>No changes yet</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, var(--themis-in-review), var(--themis-primary))',
              }}
            />
          </div>

          {/* Action row */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pb-3">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              title="Policies and guidelines (Phase B)"
            >
              <FileText size={11} aria-hidden="true" />
              <span>Policies</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              title="Export draft (Phase B)"
            >
              <Download size={11} aria-hidden="true" />
              <span>Export</span>
            </button>
            <span className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={expandAll}
                className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <ChevronsDown size={11} aria-hidden="true" />
                <span>Expand all</span>
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <ChevronsUp size={11} aria-hidden="true" />
                <span>Collapse all</span>
              </button>
            </span>
          </div>
        </header>

        {/* Scrollable form body */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >
          <ComposeFormPane
            values={parDraft}
            provenance={parProvenance}
            expandedIds={expandedIds}
            onToggleSection={toggleSection}
            activeTab={activeTab}
          />
        </motion.div>
      </section>
    </div>
  );
}
