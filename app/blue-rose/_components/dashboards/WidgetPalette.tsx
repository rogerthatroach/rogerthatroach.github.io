'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Filter,
  Hash,
  PieChart,
  Plus,
  Sparkles,
  Table,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { WIDGET_CATALOG, type WidgetKind } from '../../_lib/dashboard-grid';
import { cn } from '@/lib/utils';

const ICON: Record<WidgetKind, LucideIcon> = {
  kpi: Hash,
  timeline: TrendingUp,
  kindBars: BarChart3,
  donut: PieChart,
  businessUnit: BarChart3,
  personaActivity: Users,
  table: Table,
  filter: Filter,
  dianeNote: Sparkles,
};

interface WidgetPaletteProps {
  open: boolean;
  onClose: () => void;
  onPick: (kind: WidgetKind) => void;
}

export default function WidgetPalette({ open, onClose, onPick }: WidgetPaletteProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
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
            aria-label="Add widget"
            initial={{ y: 8, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="themis-glass-pop relative w-full max-w-2xl rounded-2xl border border-border-subtle bg-surface/95 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  Add widget
                </p>
                <h2 className="mt-1 font-display text-lg font-medium text-text-primary">
                  Pick a tile, chart, or filter
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

            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {WIDGET_CATALOG.map((entry) => {
                const Icon = ICON[entry.kind] ?? Activity;
                return (
                  <li key={entry.kind}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(entry.kind);
                        onClose();
                      }}
                      className={cn(
                        'group flex h-full w-full flex-col items-start gap-1.5 rounded-xl border border-border-subtle bg-surface/60 px-3 py-3 text-left transition-all',
                        'hover:border-[var(--themis-primary)]/50 hover:bg-[var(--themis-glass-tint)]',
                      )}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--themis-glass-tint)] text-[var(--themis-primary)]"
                        aria-hidden="true"
                      >
                        <Icon size={14} />
                      </span>
                      <span className="text-[12.5px] font-medium text-text-primary">
                        {entry.label}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                        {entry.hint}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              <Plus size={10} aria-hidden="true" />
              Click a tile to add it with defaults · edit afterward via the pencil
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
