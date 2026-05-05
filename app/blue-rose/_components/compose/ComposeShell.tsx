'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  Coins,
  Download,
  Eye,
  EyeOff,
  FileText,
  Send,
} from 'lucide-react';
import { useThemis } from '../../_lib/store';
import {
  PAR_SECTIONS,
  SAMPLE_PAR_VALUES,
  isFieldFilled,
  overallCoverage,
} from '../../_lib/par-schema';
import ComposeManuscript from './ComposeManuscript';
import DianeRibbon from './DianeRibbon';
import DocumentPreviewPanel from './DocumentPreviewPanel';
import PoliciesModal from './PoliciesModal';
import RingCluster from './RingCluster';
import { cn } from '@/lib/utils';

const DRAFT_ID = 'hsd-v003';
const TOTAL_FIELD_COUNT = PAR_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);

type Cut = 'all' | 'financial';

/**
 * ComposeShell — White Lodge ceremonial reimagining.
 *
 *  ┌── slim top atmosphere strip ─────────────────────────────────┐
 *  │ ‹  drafting hsd-v003                  ◯◯◯◯◯  preview · policies · submit │
 *  ├──────────────────────────────────────────────────────────────┤
 *  │                                                                │
 *  │              [single-column scrolling manuscript]              │
 *  │                  Project PAR (mono caption)                    │
 *  │                  Sales CRM Modernization (Fraunces title)      │
 *  │                  ── sakura divider ──                          │
 *  │                                                                │
 *  │                  I.  HEADERS INFORMATION   ◉ ◉ ◉ ◯ ◯           │
 *  │                  Core metadata that…                            │
 *  │                                                                │
 *  │                  Request Title                                 │
 *  │                  Sales CRM Modernization                       │
 *  │                  ──────────────────                            │
 *  │                  ✦ Diane drafted              23 / 400         │
 *  │                                                                │
 *  │                  …                                              │
 *  │                                                                │
 *  └──────────────────────────────────────────────────────────────┘
 *                                            ┌─ DianeRibbon ─┐
 *                                            │ ✦  4 fields   │
 *                                            │    remain to  │
 *                                            │    be drafted │
 *                                            └───────────────┘
 *
 * Form is the document. Underline-only inputs, Roman numerals, ring-
 * cluster status indicators, sakura dividers. Diane is voice via the
 * floating ribbon, never a panel.
 */
export default function ComposeShell() {
  const { parDraft, parProvenance, batchSetParFields } = useThemis();
  const [seeded, setSeeded] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>('headers');
  const [cut, setCut] = useState<Cut>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);

  useEffect(() => {
    if (seeded) return;
    if (Object.keys(parDraft).length > 0) {
      setSeeded(true);
      return;
    }
    batchSetParFields(SAMPLE_PAR_VALUES, 'diane');
    setSeeded(true);
  }, [parDraft, batchSetParFields, seeded]);

  const sections = useMemo(
    () => (cut === 'financial' ? PAR_SECTIONS.filter((s) => s.financial) : PAR_SECTIONS),
    [cut],
  );

  const filledTotal = useMemo(
    () =>
      PAR_SECTIONS.reduce(
        (acc, s) =>
          acc + s.fields.filter((f) => isFieldFilled(parDraft[f.key])).length,
        0,
      ),
    [parDraft],
  );
  const coverage = overallCoverage(parDraft);
  const percent = Math.round(coverage * 100);

  const requestTitle = (parDraft.request_title as string | undefined) ?? 'Untitled request';

  const onExport = () => {
    if (typeof window !== 'undefined') window.print();
  };
  const onSubmit = () => {
    // Phase D wires the real submission → /submission bridge.
    if (typeof window !== 'undefined') {
      window.alert('Submit wires up in Phase D — routes to approver review with WhyCard populated.');
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Top atmosphere strip */}
      <header className="relative z-10 flex shrink-0 items-center gap-4 border-b border-border-subtle/40 px-5 py-3 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Back"
          onClick={() => history.back()}
          className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Drafting
          </span>
          <span className="font-mono text-[12px] tracking-wider text-text-secondary">
            {DRAFT_ID}
          </span>
        </div>

        {/* Coverage ring-cluster centerpiece */}
        <div className="flex items-baseline gap-2">
          <RingCluster total={5} filled={Math.round((percent / 100) * 5)} current size={7} />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            {percent}% drafted · {filledTotal}/{TOTAL_FIELD_COUNT} fields
          </span>
        </div>

        {/* Cut toggle (Draft/Financial collapsed to a single inline pair) */}
        <nav role="tablist" aria-label="Cut" className="ml-auto flex items-center gap-3 text-[11px] uppercase tracking-wider">
          {([
            { key: 'all', label: 'Full draft' },
            { key: 'financial', label: 'Financial' },
          ] as { key: Cut; label: string }[]).map(({ key, label }) => {
            const active = cut === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCut(key)}
                className={cn(
                  'font-mono transition-colors',
                  active ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
                )}
              >
                <span
                  className={cn(
                    'border-b border-transparent pb-0.5',
                    active && 'border-[var(--themis-primary)]',
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Mono-caption action row — barely-there */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
          <ChromeAction
            label={previewOpen ? 'edit' : 'preview'}
            icon={previewOpen ? EyeOff : Eye}
            onClick={() => setPreviewOpen((v) => !v)}
            active={previewOpen}
          />
          <ChromeAction
            label="policies"
            icon={FileText}
            onClick={() => setPoliciesOpen(true)}
          />
          <ChromeAction
            label="export"
            icon={Download}
            onClick={onExport}
          />
          <ChromeAction
            label="submit"
            icon={Send}
            onClick={onSubmit}
            primary
          />
        </div>
      </header>

      {/* Body — manuscript or preview */}
      <div className="relative h-[calc(100%-56px)] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <ComposeManuscript
            values={parDraft}
            provenance={parProvenance}
            sections={sections}
            openSectionId={openSectionId}
            onToggleSection={(id) =>
              setOpenSectionId((prev) => (prev === id ? null : id))
            }
            title={requestTitle}
          />
        </div>

        <DocumentPreviewPanel
          open={previewOpen}
          values={parDraft}
          draftId={DRAFT_ID}
          onClose={() => setPreviewOpen(false)}
          onDownload={onExport}
        />
      </div>

      <PoliciesModal open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
      <DianeRibbon values={parDraft} />
    </div>
  );
}

function ChromeAction({
  label,
  icon: Icon,
  onClick,
  active,
  primary,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 font-mono transition-colors',
        primary
          ? 'text-[var(--themis-primary)] hover:text-text-primary'
          : active
            ? 'text-text-primary'
            : 'text-text-tertiary hover:text-text-secondary',
      )}
    >
      <Icon size={11} aria-hidden="true" />
      <span
        className={cn(
          'border-b border-transparent pb-0.5',
          active && 'border-[var(--themis-primary)]',
        )}
      >
        {label}
      </span>
    </button>
  );
}
