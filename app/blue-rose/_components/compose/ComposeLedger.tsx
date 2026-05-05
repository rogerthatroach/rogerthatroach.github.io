'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import {
  PAR_SECTIONS,
  isFieldFilled,
  type FieldSpec,
  type SectionSpec,
} from '../../_lib/par-schema';
import { useThemis, type FieldProvenance } from '../../_lib/store';
import RingCluster from './RingCluster';
import { cn } from '@/lib/utils';

interface ComposeLedgerProps {
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
  /** Whether the ledger is filtered to financial-only sections. */
  cut: 'all' | 'financial';
  /** When the user clicks a field row, Diane focuses on that field. */
  onFocusField: (section: SectionSpec, field: FieldSpec) => void;
}

const ROMAN = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
];

/**
 * ComposeLedger — read-mostly section list + click-to-focus.
 *
 *   I.   Headers Information       ●●●◯◯  3/5
 *        ─ Request Title             Sales CRM…   ✓
 *        ─ Request Category          Project Exp… ✓
 *        ─ Sponsor Delegate          —            ✎ ← clickable, asks Diane
 *        …
 *   II.  Executive Summary          ●●  done
 *   ▸ III. Request Description      ●  1/3   ← collapsed
 *   ▸ IV. Benefits                  ●● 2/3
 *
 * Clicking a section title expands/collapses. Clicking a field row →
 * Diane asks about that field in the conversation. Hover-edit-in-place
 * for direct edits without going through Diane.
 */
export default function ComposeLedger({
  values,
  provenance,
  cut,
  onFocusField,
}: ComposeLedgerProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const sections =
    cut === 'financial' ? PAR_SECTIONS.filter((s) => s.financial) : PAR_SECTIONS;

  return (
    <aside
      aria-label="Ledger"
      className="flex h-full min-h-0 flex-col border-l border-border-subtle/40 bg-surface/30"
    >
      <header className="shrink-0 px-5 pt-6 pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
          Ledger
        </p>
        <p className="mt-1 font-display text-[14px] italic text-text-secondary">
          What we&apos;ve drafted together
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <ol className="space-y-1">
          {sections.map((section, i) => {
            const filled = section.fields.filter((f) => isFieldFilled(values[f.key]))
              .length;
            const total = section.fields.length;
            const allDone = filled === total && total > 0;
            const isOpen = openSectionId === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSectionId((prev) => (prev === section.id ? null : section.id))
                  }
                  aria-expanded={isOpen}
                  className="group flex w-full items-baseline gap-2.5 py-2 text-left transition-colors"
                >
                  <span className="w-6 shrink-0 font-mono text-[10px] tracking-widest text-text-tertiary">
                    {ROMAN[PAR_SECTIONS.indexOf(section)] ?? `${i + 1}`}.
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-[13px] font-medium text-text-primary group-hover:text-[var(--themis-primary)]">
                    {section.title}
                  </span>
                  <RingCluster total={total} filled={filled} current={isOpen} />
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-widest',
                      allDone ? 'text-[var(--themis-approved)]' : 'text-text-tertiary',
                    )}
                  >
                    {allDone ? 'done' : `${filled}/${total}`}
                  </span>
                  <ChevronRight
                    size={11}
                    className={cn(
                      'shrink-0 text-text-tertiary transition-transform',
                      isOpen && 'rotate-90',
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="ml-8 mt-1 space-y-0.5 pb-3">
                        {section.fields.map((field) => (
                          <FieldRow
                            key={field.key}
                            field={field}
                            value={values[field.key]}
                            isDiane={provenance[field.key] === 'diane'}
                            onClick={() => onFocusField(section, field)}
                          />
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

function FieldRow({
  field,
  value,
  isDiane,
  onClick,
}: {
  field: FieldSpec;
  value: string | number | boolean | undefined;
  isDiane: boolean;
  onClick: () => void;
}) {
  const { setParField } = useThemis();
  const [editing, setEditing] = useState(false);
  const filled = isFieldFilled(value);
  const display =
    typeof value === 'string'
      ? value
      : typeof value === 'number'
        ? String(value)
        : '';

  if (editing && (field.kind === 'text' || field.kind === 'longtext' || field.kind === 'select' || field.kind === 'number')) {
    return (
      <li>
        <div className="flex items-baseline gap-2 py-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {field.label}
          </span>
        </div>
        <div className="ml-0">
          {field.kind === 'select' ? (
            <select
              autoFocus
              value={(value as string | undefined) ?? ''}
              onChange={(e) => {
                setParField(field.key, e.target.value, 'user');
                setEditing(false);
              }}
              onBlur={() => setEditing(false)}
              className="w-full border-b border-[var(--themis-primary)] bg-transparent py-1 font-display text-[12.5px] text-text-primary outline-none"
            >
              <option value="">—</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.kind === 'longtext' ? (
            <textarea
              autoFocus
              rows={3}
              value={(value as string | undefined) ?? ''}
              maxLength={field.maxLength}
              onChange={(e) => setParField(field.key, e.target.value, 'user')}
              onBlur={() => setEditing(false)}
              className="w-full resize-y border-b border-[var(--themis-primary)] bg-transparent py-1 font-display text-[12.5px] leading-relaxed text-text-primary outline-none"
            />
          ) : field.kind === 'number' ? (
            <input
              autoFocus
              type="number"
              value={typeof value === 'number' ? value : ''}
              onChange={(e) => {
                const n = Number(e.target.value);
                setParField(field.key, Number.isNaN(n) ? '' : n, 'user');
              }}
              onBlur={() => setEditing(false)}
              className="w-full border-b border-[var(--themis-primary)] bg-transparent py-1 font-display text-[12.5px] text-text-primary outline-none"
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={(value as string | undefined) ?? ''}
              maxLength={field.maxLength}
              onChange={(e) => setParField(field.key, e.target.value, 'user')}
              onBlur={() => setEditing(false)}
              className="w-full border-b border-[var(--themis-primary)] bg-transparent py-1 font-display text-[12.5px] text-text-primary outline-none"
            />
          )}
        </div>
      </li>
    );
  }

  return (
    <li>
      <div className="group flex items-baseline gap-2 py-0.5">
        <span className="w-2 shrink-0 font-mono text-[9px] text-text-tertiary">─</span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-text-tertiary">
            {field.label}
          </span>
          <span
            className={cn(
              'block truncate font-display text-[12.5px] leading-snug',
              filled ? 'text-text-primary' : 'italic text-text-tertiary',
            )}
            style={
              isDiane && filled
                ? { borderBottom: '1px dashed var(--themis-sakura-border)' }
                : undefined
            }
          >
            {filled ? display : '—'}
          </span>
        </span>
        {isDiane && filled && (
          <Sparkles
            size={9}
            aria-label="Diane drafted"
            style={{ color: 'var(--themis-sakura)' }}
          />
        )}
        <span className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary hover:text-text-primary"
          >
            edit
          </button>
          <span className="mx-1 text-text-tertiary">·</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="font-mono text-[9px] uppercase tracking-widest text-[var(--themis-primary)] hover:text-text-primary"
          >
            ask Diane
          </button>
        </span>
      </div>
    </li>
  );
}
