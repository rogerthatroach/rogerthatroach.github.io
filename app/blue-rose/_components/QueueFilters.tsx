'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { useThemis, usePersonaMap } from '../_lib/store';
import {
  AMOUNT_BAND_LABEL,
  activeFilterCount,
  kindLabel,
  statusLabel,
} from '../_lib/filters';
import QueueFilterPanel from './QueueFilterPanel';
import { cn } from '@/lib/utils';

/**
 * QueueFilters — sticky header above the queue list.
 *
 * Layout:
 *   [🔍 search input ............ ✕] [⊕ Filter (n)]
 *   [chip][chip][chip] [✕ Clear all]   ← only if any filter active
 */
export default function QueueFilters() {
  const { queueFilters, patchFilters, clearFilters } = useThemis();
  const personaMap = usePersonaMap();
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const count = activeFilterCount(queueFilters);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Search
            size={12}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            value={queueFilters.search}
            onChange={(e) => patchFilters({ search: e.target.value })}
            placeholder="Search submissions"
            className="block w-full rounded-md border border-border-subtle bg-surface/60 py-1.5 pl-7 pr-7 text-[12px] text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-[var(--themis-primary)] focus:ring-2 focus:ring-[var(--themis-primary)]/20"
          />
          {queueFilters.search && (
            <button
              type="button"
              onClick={() => patchFilters({ search: '' })}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <X size={10} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          ref={filterButtonRef}
          type="button"
          onClick={() => setPanelOpen((s) => !s)}
          aria-expanded={panelOpen}
          aria-haspopup="dialog"
          aria-label={`Filters (${count} active)`}
          className={cn(
            'relative flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 transition-colors',
            count > 0
              ? 'border-[var(--themis-primary)]/50 bg-[var(--themis-glass-tint)] text-[var(--themis-primary)]'
              : 'border-border-subtle bg-surface/60 text-text-secondary hover:bg-surface-hover hover:text-text-primary',
          )}
        >
          <Filter size={12} aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">Filter</span>
          {count > 0 && (
            <span
              aria-hidden="true"
              className="rounded-full px-1.5 font-mono text-[9px] uppercase tracking-widest"
              style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips — small bar above the queue list */}
      <AnimatePresence initial={false}>
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <ActiveChips />
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 flex items-center gap-1 rounded-md px-1 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:text-text-primary"
            >
              <X size={10} aria-hidden="true" />
              <span>Clear all</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <QueueFilterPanel
        anchorRef={filterButtonRef}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}

function ActiveChips() {
  const { queueFilters, patchFilters } = useThemis();
  const personaMap = usePersonaMap();

  const chips: { key: string; label: string; remove: () => void }[] = [];

  for (const status of queueFilters.statuses) {
    chips.push({
      key: `status-${status}`,
      label: statusLabel(status),
      remove: () =>
        patchFilters({
          statuses: queueFilters.statuses.filter((s) => s !== status),
        }),
    });
  }
  for (const id of queueFilters.submitterIds) {
    chips.push({
      key: `sub-${id}`,
      label: personaMap.get(id)?.displayName ?? id,
      remove: () =>
        patchFilters({
          submitterIds: queueFilters.submitterIds.filter((x) => x !== id),
        }),
    });
  }
  for (const value of queueFilters.businessUnits) {
    chips.push({
      key: `bu-${value}`,
      label: value,
      remove: () =>
        patchFilters({
          businessUnits: queueFilters.businessUnits.filter((x) => x !== value),
        }),
    });
  }
  for (const value of queueFilters.severities) {
    chips.push({
      key: `sev-${value}`,
      label: `Severity · ${value}`,
      remove: () =>
        patchFilters({ severities: queueFilters.severities.filter((x) => x !== value) }),
    });
  }
  for (const value of queueFilters.kinds) {
    chips.push({
      key: `kind-${value}`,
      label: kindLabel(value),
      remove: () => patchFilters({ kinds: queueFilters.kinds.filter((x) => x !== value) }),
    });
  }
  for (const band of queueFilters.amountBands) {
    chips.push({
      key: `amt-${band}`,
      label: AMOUNT_BAND_LABEL[band],
      remove: () =>
        patchFilters({ amountBands: queueFilters.amountBands.filter((x) => x !== band) }),
    });
  }
  if (queueFilters.hasAttachments) {
    chips.push({
      key: 'has-att',
      label: 'Has attachments',
      remove: () => patchFilters({ hasAttachments: false }),
    });
  }
  if (queueFilters.unreadOnly) {
    chips.push({
      key: 'unread',
      label: 'Unread only',
      remove: () => patchFilters({ unreadOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          className="group flex items-center gap-1 rounded-full border border-[var(--themis-primary)]/30 bg-[var(--themis-glass-tint)] py-0.5 pl-1.5 pr-0.5 text-[10.5px] transition-colors hover:bg-[var(--themis-primary)]/15"
          style={{ color: 'var(--themis-primary)' }}
          aria-label={`Remove filter: ${c.label}`}
        >
          <span className="truncate">{c.label}</span>
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors group-hover:bg-[var(--themis-primary)]/20">
            <X size={9} aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  );
}
