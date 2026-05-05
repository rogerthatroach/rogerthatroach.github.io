'use client';

import { useState } from 'react';
import { ChevronDown, Eye, FileText, Sparkles } from 'lucide-react';
import {
  PAR_SECTIONS,
  SECTION_STATUS_COLOR,
  SECTION_STATUS_LABEL,
  isFieldFilled,
  sectionStatus,
  type FieldSpec,
  type SectionSpec,
  type SectionStatus,
} from '../../_lib/par-schema';
import { useThemis, type FieldProvenance } from '../../_lib/store';
import { cn } from '@/lib/utils';

interface ComposeFormPaneProps {
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
  expandedIds: Set<string>;
  onToggleSection: (id: string) => void;
  activeTab: 'draft' | 'financial';
}

/**
 * ComposeFormPane — right pane of /compose.
 *
 * 11-section accordion. Each section header shows a 3-state status pill
 * (Not Started / In Progress / Completed) computed live from the values.
 * Diane-drafted fields render with a dashed border + amber tint per the
 * §12 RAI rule (AI content never visually indistinguishable from human).
 */
export default function ComposeFormPane({
  values,
  provenance,
  expandedIds,
  onToggleSection,
  activeTab,
}: ComposeFormPaneProps) {
  const sections =
    activeTab === 'financial'
      ? PAR_SECTIONS.filter((s) => s.financial)
      : PAR_SECTIONS;

  return (
    <ul className="space-y-3">
      {sections.map((section) => {
        const status = sectionStatus(section, values);
        const expanded = expandedIds.has(section.id);
        return (
          <SectionCard
            key={section.id}
            section={section}
            status={status}
            expanded={expanded}
            onToggle={() => onToggleSection(section.id)}
            values={values}
            provenance={provenance}
          />
        );
      })}
    </ul>
  );
}

function SectionCard({
  section,
  status,
  expanded,
  onToggle,
  values,
  provenance,
}: {
  section: SectionSpec;
  status: SectionStatus;
  expanded: boolean;
  onToggle: () => void;
  values: Record<string, string | number | boolean>;
  provenance: Record<string, FieldProvenance>;
}) {
  return (
    <li
      className="overflow-hidden rounded-2xl border bg-surface/40"
      style={{ borderColor: 'rgba(185,168,214,0.18)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover/40"
      >
        <h3 className="flex-1 font-display text-[14px] font-medium text-text-primary">
          {section.title}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
          style={{
            background: `${SECTION_STATUS_COLOR[status]}1f`,
            color: SECTION_STATUS_COLOR[status],
          }}
        >
          {SECTION_STATUS_LABEL[status]}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            'text-text-tertiary transition-transform',
            expanded && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {expanded && (
        <div className="border-t border-border-subtle/60 px-4 py-4">
          {section.description && (
            <p className="mb-4 text-[12.5px] leading-relaxed text-text-secondary">
              {section.description}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {section.fields.map((field) => (
              <FieldRow
                key={field.key}
                field={field}
                value={values[field.key]}
                provenance={provenance[field.key]}
              />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function FieldRow({
  field,
  value,
  provenance,
}: {
  field: FieldSpec;
  value: string | number | boolean | undefined;
  provenance?: FieldProvenance;
}) {
  const { setParField } = useThemis();
  const filled = isFieldFilled(value);
  const isDiane = provenance === 'diane';
  const isLong = field.kind === 'longtext';
  const wide = isLong;

  return (
    <label className={cn('block', wide && 'md:col-span-2')}>
      <span className="mb-1 flex items-center gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-text-primary">
          {field.label}
          {field.required && <span style={{ color: 'var(--themis-rejected)' }}> *</span>}
        </span>
        {field.help && (
          <span
            title={field.help}
            aria-label={field.help}
            className="cursor-help rounded-full bg-surface-hover px-1 font-mono text-[9px] leading-none text-text-tertiary"
          >
            ?
          </span>
        )}
        {isDiane && (
          <span
            title="Drafted by Diane"
            className="ml-auto inline-flex items-center gap-1 rounded-full px-1.5 font-mono text-[9px] uppercase tracking-widest"
            style={{
              background: 'rgba(245, 158, 11, 0.14)',
              color: '#F59E0B',
            }}
          >
            <Sparkles size={9} aria-hidden="true" />
            <span>Diane drafted</span>
          </span>
        )}
        {filled && (
          <span
            aria-label="Filled"
            className={cn(
              'inline-flex h-3 w-3 items-center justify-center rounded-full',
              !isDiane && 'ml-auto',
            )}
            style={{
              background: 'var(--themis-approved)',
              color: 'var(--color-bg)',
            }}
          >
            <span className="text-[8px] font-bold leading-none">✓</span>
          </span>
        )}
      </span>
      {renderField(field, value, isDiane, setParField)}
      <FieldFooter field={field} value={value} />
    </label>
  );
}

function renderField(
  field: FieldSpec,
  value: string | number | boolean | undefined,
  isDiane: boolean,
  setParField: (key: string, value: string | number | boolean, provenance?: FieldProvenance) => void,
) {
  const baseClass = cn(
    'w-full rounded-lg border bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-[var(--themis-primary)] focus:ring-2 focus:ring-[var(--themis-primary)]/20',
    isDiane
      ? 'border-dashed border-[#F59E0B]/40 bg-[rgba(245,158,11,0.04)]'
      : 'border-border-subtle',
  );

  if (field.kind === 'longtext') {
    return (
      <textarea
        rows={4}
        value={(value as string | undefined) ?? ''}
        placeholder={field.placeholder}
        onChange={(e) => setParField(field.key, e.target.value, 'user')}
        maxLength={field.maxLength}
        className={cn(baseClass, 'resize-y leading-relaxed')}
      />
    );
  }
  if (field.kind === 'select') {
    return (
      <select
        value={(value as string | undefined) ?? ''}
        onChange={(e) => setParField(field.key, e.target.value, 'user')}
        className={baseClass}
      >
        <option value="">Choose…</option>
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
        className={baseClass}
      />
    );
  }
  return (
    <input
      type="text"
      value={(value as string | undefined) ?? ''}
      placeholder={field.placeholder}
      onChange={(e) => setParField(field.key, e.target.value, 'user')}
      maxLength={field.maxLength}
      className={baseClass}
    />
  );
}

function FieldFooter({
  field,
  value,
}: {
  field: FieldSpec;
  value: string | number | boolean | undefined;
}) {
  if (typeof field.maxLength !== 'number') return null;
  const len = typeof value === 'string' ? value.length : 0;
  return (
    <p className="mt-1 text-right font-mono text-[10px] tracking-wider text-text-tertiary">
      {len} / {field.maxLength}
    </p>
  );
}
