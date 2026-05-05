'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  KPI_METRIC_OPTIONS,
  type FilterDimension,
  type KPIMetric,
  type Widget,
  type WidgetConfig,
} from '../../_lib/dashboard-grid';
import { cn } from '@/lib/utils';

const SUGGESTED_QUESTIONS = [
  'What\'s our approval rate?',
  'Any anomalies in range?',
  'Who carries the highest spend?',
  'What\'s the bottleneck?',
  'Total cost at risk right now?',
  'Top business unit by approved budget?',
];

interface WidgetConfigModalProps {
  widget: Widget | null;
  onClose: () => void;
  onSave: (next: Widget) => void;
}

export default function WidgetConfigModal({
  widget,
  onClose,
  onSave,
}: WidgetConfigModalProps) {
  const [draft, setDraft] = useState<Widget | null>(widget);

  useEffect(() => {
    setDraft(widget);
  }, [widget]);

  useEffect(() => {
    if (!widget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [widget, onClose]);

  if (!widget || !draft) return null;

  const setTitle = (title: string) =>
    setDraft((d) => (d ? { ...d, title } : d));
  const setConfig = (config: WidgetConfig) =>
    setDraft((d) => (d ? { ...d, config } : d));

  const save = () => {
    if (!draft) return;
    onSave(draft);
    onClose();
  };

  return (
    <AnimatePresence>
      {widget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label="Configure widget"
            initial={{ y: 8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="themis-glass-pop relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface/95 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Configure widget
                </p>
                <h2 className="mt-1 font-display text-lg font-medium text-text-primary">
                  {draft.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                aria-label="Close"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-4">
              <Field label="Title">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-[var(--themis-primary)]"
                />
              </Field>

              {draft.config.kind === 'kpi' && (
                <Field label="Metric">
                  <select
                    value={draft.config.metric}
                    onChange={(e) =>
                      setConfig({
                        kind: 'kpi',
                        metric: e.target.value as KPIMetric,
                      })
                    }
                    className="w-full rounded-lg border border-border-subtle bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-[var(--themis-primary)]"
                  >
                    {KPI_METRIC_OPTIONS.map((opt) => (
                      <option key={opt.metric} value={opt.metric}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {draft.config.kind === 'filter' && (
                <Field label="Dimension">
                  <DimSelector
                    value={draft.config.dimension}
                    onChange={(dim) => setConfig({ kind: 'filter', dimension: dim })}
                  />
                </Field>
              )}

              {draft.config.kind === 'table' && (
                <Field label="Rows">
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={draft.config.rows}
                    onChange={(e) =>
                      setConfig({
                        kind: 'table',
                        rows: Math.max(3, Math.min(20, Number(e.target.value) || 6)),
                      })
                    }
                    className="w-24 rounded-lg border border-border-subtle bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-[var(--themis-primary)]"
                  />
                </Field>
              )}

              {draft.config.kind === 'dianeNote' && (
                <Field label="Saved question">
                  <input
                    type="text"
                    value={draft.config.question}
                    onChange={(e) =>
                      setConfig({ kind: 'dianeNote', question: e.target.value })
                    }
                    className="mb-2 w-full rounded-lg border border-border-subtle bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none transition-colors focus:border-[var(--themis-primary)]"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setConfig({ kind: 'dianeNote', question: q })}
                        className="rounded-full border border-border-subtle bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
            </div>

            <footer className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={{
                  background: 'var(--themis-primary)',
                  color: 'var(--color-bg)',
                }}
              >
                Save
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        {label}
      </span>
      {children}
    </label>
  );
}

function DimSelector({
  value,
  onChange,
}: {
  value: FilterDimension;
  onChange: (v: FilterDimension) => void;
}) {
  const options: Array<{ key: FilterDimension; label: string }> = [
    { key: 'businessUnit', label: 'Business unit' },
    { key: 'kind', label: 'Type' },
    { key: 'severity', label: 'Severity' },
  ];
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={cn(
            'flex-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors',
            value === o.key
              ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
              : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
