'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
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
  type FieldSpec,
  type SectionSpec,
} from '../../_lib/par-schema';
import ComposeLedger from './ComposeLedger';
import DianePresence from './DianePresence';
import DocumentPreviewPanel from './DocumentPreviewPanel';
import PoliciesModal from './PoliciesModal';
import RingCluster from './RingCluster';
import { cn } from '@/lib/utils';

const DRAFT_ID = 'hsd-v003';
const TOTAL_FIELD_COUNT = PAR_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);

type Cut = 'all' | 'financial';

/**
 * ComposeShell — White Lodge ceremonial reimagining (v3).
 *
 *  ┌── slim atmosphere strip ───────────────────────────────────────────────┐
 *  │ ‹  drafting hsd-v003   ◯◯◯◯◯  78% · 18/38   Full · Financial    preview│
 *  │                                                                · policies │
 *  │                                                                · export   │
 *  │                                                                · submit   │
 *  ├──────────────────────────────────────────┬─────────────────────────────┤
 *  │                                            │ Ledger                       │
 *  │                ✦ (pulsing rings)           │ what we've drafted together  │
 *  │                                            │                              │
 *  │             DRAFTING                       │ I.   Headers      ●●●◯◯ 3/5  │
 *  │     Sales CRM Modernization                │ II.  Exec Sum    ●●  done    │
 *  │                                            │ III. Description ●   1/3     │
 *  │  I've drafted what I could from the        │ IV.  Benefits   ●●  2/3     │
 *  │  material you uploaded earlier. The        │ V.   Alternatives●   1/3     │
 *  │  request sits at 78%…                      │ …                            │
 *  │                                            │                              │
 *  │  What remains: Sponsor Delegate,           │                              │
 *  │  EDS Contact, In Plan…                     │                              │
 *  │                                            │                              │
 *  │  Where would you like to begin?            │                              │
 *  │                                            │                              │
 *  │  [walk me through]  [review drafted]       │                              │
 *  │  [show preview]     [attach a memo]        │                              │
 *  │                                            │                              │
 *  │ ─────────────                              │                              │
 *  │ ✎  Speak to Diane…                ⏎        │                              │
 *  │ Speak through gaps · attach · or pick      │                              │
 *  └──────────────────────────────────────────┴─────────────────────────────┘
 *
 * Diane is the dominant column (~62%), large and ceremonial. The Ledger
 * (~38%) is a calm record of what's been drafted, click-to-focus.
 * DocumentPreview slides over both columns when invoked.
 */
export default function ComposeShell() {
  const { parDraft, parProvenance, batchSetParFields } = useThemis();
  const [seeded, setSeeded] = useState(false);
  const [cut, setCut] = useState<Cut>('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [focusField, setFocusField] = useState<{ section: SectionSpec; field: FieldSpec } | null>(null);

  useEffect(() => {
    if (seeded) return;
    if (Object.keys(parDraft).length > 0) {
      setSeeded(true);
      return;
    }
    batchSetParFields(SAMPLE_PAR_VALUES, 'diane');
    setSeeded(true);
  }, [parDraft, batchSetParFields, seeded]);

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
  const onSubmitDraft = () => {
    if (typeof window !== 'undefined') {
      window.alert(
        'Submit wires up in Phase D — routes to approver review with WhyCard populated from this draft.',
      );
    }
  };

  const onChipPress = (intent: string) => {
    if (intent === 'preview') setPreviewOpen(true);
    else if (intent === 'attach') {
      if (typeof window !== 'undefined') {
        window.alert('File-attach + Diane drafting chain wires up in Phase C.');
      }
    } else if (intent === 'walk_remaining') {
      // Pick the first unfilled required field and focus on it
      for (const section of PAR_SECTIONS) {
        for (const field of section.fields) {
          if (field.required && !isFieldFilled(parDraft[field.key])) {
            setFocusField({ section, field });
            return;
          }
        }
      }
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

        {/* Coverage centerpiece */}
        <div className="flex items-baseline gap-2">
          <RingCluster total={5} filled={Math.round((percent / 100) * 5)} current size={7} />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            {percent}% drafted · {filledTotal}/{TOTAL_FIELD_COUNT} fields
          </span>
        </div>

        {/* Cut toggle */}
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

        {/* Mono-caption action row */}
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
            onClick={onSubmitDraft}
            primary
          />
        </div>
      </header>

      {/* Body — Diane (left/wide) + Ledger (right/slim) */}
      <div className="relative h-[calc(100%-56px)] overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[1fr_minmax(320px,_38%)]">
          <DianePresence
            draftTitle={requestTitle}
            values={parDraft}
            focusField={focusField}
            onClearFocus={() => setFocusField(null)}
            onChipPress={onChipPress}
            onAttachClick={() => onChipPress('attach')}
          />
          <ComposeLedger
            values={parDraft}
            provenance={parProvenance}
            cut={cut}
            onFocusField={(section, field) =>
              setFocusField({ section, field })
            }
          />
        </div>

        {/* Document Preview slides over both columns */}
        <DocumentPreviewPanel
          open={previewOpen}
          values={parDraft}
          draftId={DRAFT_ID}
          onClose={() => setPreviewOpen(false)}
          onDownload={onExport}
        />
      </div>

      <PoliciesModal open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
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
