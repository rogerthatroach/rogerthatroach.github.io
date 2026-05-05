'use client';

import { useState, type Ref } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  PAR_SECTIONS,
  isFieldFilled,
  type FieldSpec,
  type SectionSpec,
} from '../../_lib/par-schema';
import { useThemis, type FieldProvenance } from '../../_lib/store';
import { cn } from '@/lib/utils';
import RingCluster from './RingCluster';

interface ComposeManuscriptProps {
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
  /** Visible sections (filtered by Draft / Financial cut at the shell level). */
  sections: SectionSpec[];
  /** Currently-open section id; null = all collapsed. */
  openSectionId: string | null;
  onToggleSection: (id: string) => void;
  /** Title of the request, large at the top of the manuscript. */
  title: string;
}

const ROMAN = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
];

/**
 * ComposeManuscript — single-column ceremonial form.
 *
 * The form is the document. Each section opens with a Roman numeral +
 * Fraunces title + ring-cluster status (one dot per field). Section
 * descriptions render in italic narrow column. Fields stack vertically
 * with underline-only inputs (no boxes), matching the lock screen's
 * `themis-lock-input` aesthetic. Sakura horizontal dividers between
 * sections. Diane-drafted fields signal via sakura underline + ✦ glyph.
 *
 * One section open at a time — clicking another section folds the
 * previous one. Calmer than expand-all/collapse-all.
 */
export default function ComposeManuscript({
  values,
  provenance,
  sections,
  openSectionId,
  onToggleSection,
  title,
}: ComposeManuscriptProps) {
  return (
    <article className="mx-auto max-w-2xl pt-6 pb-24">
      {/* Title block */}
      <header className="px-4 pb-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-tertiary">
          Project PAR
        </p>
        <h1 className="mt-2 font-display text-[32px] font-medium leading-tight tracking-tight text-text-primary">
          {title}
        </h1>
        <SakuraDivider className="mt-6" />
      </header>

      <ol className="space-y-1 px-4">
        {sections.map((section, i) => {
          const filled = section.fields.filter((f) => isFieldFilled(values[f.key])).length;
          const isOpen = openSectionId === section.id;
          return (
            <li key={section.id}>
              <SectionView
                index={i}
                section={section}
                values={values}
                provenance={provenance}
                filled={filled}
                isOpen={isOpen}
                onToggle={() => onToggleSection(section.id)}
              />
              {i < sections.length - 1 && <SakuraDivider className="my-3" subtle />}
            </li>
          );
        })}
      </ol>
    </article>
  );
}

function SectionView({
  index,
  section,
  values,
  provenance,
  filled,
  isOpen,
  onToggle,
}: {
  index: number;
  section: SectionSpec;
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
  filled: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const total = section.fields.length;
  const allDone = filled === total;
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-baseline gap-4 py-4 text-left transition-colors"
      >
        <span className="w-6 shrink-0 font-mono text-[12px] tracking-widest text-text-tertiary">
          {ROMAN[index] ?? `${index + 1}`}.
        </span>
        <span className="flex-1">
          <h2
            className={cn(
              'font-display text-[18px] font-medium tracking-tight text-text-primary transition-colors',
              !isOpen && 'group-hover:text-[var(--themis-primary)]',
            )}
          >
            {section.title}
          </h2>
          {section.description && (
            <p
              className={cn(
                'mt-1 max-w-prose text-[12.5px] italic leading-relaxed text-text-secondary',
                !isOpen && 'opacity-70',
              )}
            >
              {section.description}
            </p>
          )}
        </span>
        <span className="shrink-0">
          <RingCluster total={total} filled={filled} current={isOpen} />
          {allDone && (
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--themis-approved)' }}>
              Complete
            </span>
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-10 mt-2 space-y-7 pb-8 pr-2">
              {section.fields.map((field) => (
                <ManuscriptField
                  key={field.key}
                  field={field}
                  value={values[field.key]}
                  provenance={provenance[field.key]}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ManuscriptField({
  field,
  value,
  provenance,
}: {
  field: FieldSpec;
  value: string | number | boolean | undefined;
  provenance?: FieldProvenance;
}) {
  const { setParField } = useThemis();
  const isDiane = provenance === 'diane';
  const filled = isFieldFilled(value);

  return (
    <div>
      {/* Field label — small, mono, ceremonial */}
      <label className="block">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            {field.label}
            {field.required && <span style={{ color: 'var(--themis-rejected)' }}> ·</span>}
          </span>
          {field.help && (
            <span
              title={field.help}
              className="cursor-help font-mono text-[9px] text-text-tertiary"
            >
              ?
            </span>
          )}
          {filled && (
            <span
              aria-label="Filled"
              className="font-mono text-[10px]"
              style={{ color: 'var(--themis-approved)' }}
            >
              ✓
            </span>
          )}
        </span>

        {renderInput(field, value, isDiane, setParField)}
      </label>

      {/* Footer — char count + Diane-drafted whisper */}
      <div className="mt-1 flex items-center justify-between">
        {isDiane ? (
          <span
            className="flex items-center gap-1 font-mono text-[10px] italic tracking-wider"
            style={{ color: 'var(--themis-sakura)' }}
          >
            <Sparkles size={9} aria-hidden="true" />
            <span>Diane drafted</span>
          </span>
        ) : (
          <span />
        )}
        {typeof field.maxLength === 'number' && (
          <span className="font-mono text-[10px] tracking-wider text-text-tertiary">
            {(typeof value === 'string' ? value.length : 0)} / {field.maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

function renderInput(
  field: FieldSpec,
  value: string | number | boolean | undefined,
  isDiane: boolean,
  setParField: (key: string, value: string | number | boolean, provenance?: FieldProvenance) => void,
) {
  const underlineColor = isDiane
    ? 'var(--themis-sakura-border)'
    : 'rgba(126, 106, 168, 0.18)'; // faint amethyst
  const focusColor = 'var(--themis-primary)';

  const baseStyle: React.CSSProperties = {
    background: 'transparent',
    border: 0,
    borderBottom: `1px solid ${underlineColor}`,
    borderRadius: 0,
    padding: '0.45rem 0.1rem',
    fontFamily: 'var(--font-fraunces, serif)',
    fontSize: 16,
    lineHeight: 1.4,
    color: 'var(--color-text-primary)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.25s ease',
  };

  // Apply focus styling via inline event handlers to keep this minimal-CSS
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderBottomColor = focusColor;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderBottomColor = underlineColor;
  };

  if (field.kind === 'longtext') {
    return (
      <textarea
        rows={3}
        value={(value as string | undefined) ?? ''}
        placeholder={field.placeholder}
        onChange={(e) => setParField(field.key, e.target.value, 'user')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={field.maxLength}
        style={{ ...baseStyle, resize: 'vertical', minHeight: 60 }}
        className="placeholder:italic placeholder:text-text-tertiary"
      />
    );
  }
  if (field.kind === 'select') {
    return (
      <select
        value={(value as string | undefined) ?? ''}
        onChange={(e) => setParField(field.key, e.target.value, 'user')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={baseStyle}
        className="appearance-none cursor-pointer"
      >
        <option value="">—</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.kind === 'number') {
    return (
      <input
        type="number"
        value={typeof value === 'number' ? value : ''}
        placeholder={field.placeholder}
        onChange={(e) => {
          const n = Number(e.target.value);
          setParField(field.key, Number.isNaN(n) ? '' : n, 'user');
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={baseStyle}
        className="placeholder:italic placeholder:text-text-tertiary"
      />
    );
  }
  return (
    <input
      type="text"
      value={(value as string | undefined) ?? ''}
      placeholder={field.placeholder ?? '—'}
      onChange={(e) => setParField(field.key, e.target.value, 'user')}
      onFocus={handleFocus}
      onBlur={handleBlur}
      maxLength={field.maxLength}
      style={baseStyle}
      className="placeholder:italic placeholder:text-text-tertiary"
    />
  );
}

function SakuraDivider({ className, subtle }: { className?: string; subtle?: boolean }) {
  return (
    <div
      className={cn('relative h-px w-full', className)}
      aria-hidden="true"
      style={{
        background: `linear-gradient(90deg, transparent, ${
          subtle ? 'rgba(176, 122, 130, 0.18)' : 'rgba(176, 122, 130, 0.4)'
        }, transparent)`,
      }}
    />
  );
}
