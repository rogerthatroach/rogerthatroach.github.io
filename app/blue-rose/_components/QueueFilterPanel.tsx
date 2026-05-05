'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Filter, Paperclip, RotateCcw, Sparkles, X } from 'lucide-react';
import type { SubmissionStatus } from '@/data/themis/types';
import { useThemis, usePersonaMap } from '../_lib/store';
import {
  AMOUNT_BAND_LABEL,
  activeFilterCount,
  computeDimensions,
  kindLabel,
  statusLabel,
  type AmountBand,
  type QueueFilters,
} from '../_lib/filters';
import FloatingAvatar from './FloatingAvatar';
import { cn } from '@/lib/utils';

const PANEL_WIDTH = 420;
const PANEL_OFFSET_Y = 8;
const VIEWPORT_PAD = 12;

interface QueueFilterPanelProps {
  /** The element the panel anchors to (usually the Filter button). */
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
}

/**
 * QueueFilterPanel — portalled popover with all filter dimensions.
 *
 * Anchors to the Filter button via getBoundingClientRect, position:fixed,
 * clamped to viewport. Uses the same portal pattern as FieldThread so it
 * escapes the queue's overflow:auto container and stacks above the right
 * pane.
 *
 * Each dimension renders as a row of toggle-chips. Selected chips light
 * up amethyst. The footer has Clear-all + filter-count + a Done button.
 */
export default function QueueFilterPanel({ anchorRef, open, onClose }: QueueFilterPanelProps) {
  const { seed, queueFilters, patchFilters, clearFilters } = useThemis();
  const personaMap = usePersonaMap();
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dims = useMemo(() => computeDimensions(seed.submissions), [seed.submissions]);
  const count = activeFilterCount(queueFilters);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const compute = () => {
      const node = anchorRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = rect.left;
      if (left + PANEL_WIDTH + VIEWPORT_PAD > vw) {
        left = vw - PANEL_WIDTH - VIEWPORT_PAD;
      }
      if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;
      let top = rect.bottom + PANEL_OFFSET_Y;
      const popHeight = panelRef.current?.offsetHeight ?? 520;
      if (top + popHeight + VIEWPORT_PAD > vh) {
        const above = rect.top - PANEL_OFFSET_Y - popHeight;
        top = above > VIEWPORT_PAD ? above : VIEWPORT_PAD;
      }
      setPos({ top, left });
    };
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideAnchor = anchorRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideAnchor && !insidePanel) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, anchorRef, onClose]);

  const toggleArrayItem = <K extends keyof QueueFilters>(
    key: K,
    value: QueueFilters[K] extends Array<infer U> ? U : never,
  ) => {
    const arr = queueFilters[key] as unknown as Array<typeof value>;
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    patchFilters({ [key]: next } as Partial<QueueFilters>);
  };

  if (!mounted) return null;

  const panel = (
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label="Queue filters"
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          className="themis-glass-pop fixed z-[100] flex max-h-[80vh] flex-col overflow-hidden rounded-xl"
          style={{ top: pos.top, left: pos.left, width: PANEL_WIDTH }}
        >
          <header className="flex items-center justify-between border-b border-border-subtle px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <Filter size={12} style={{ color: 'var(--themis-primary)' }} aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Filters
              </span>
              {count > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                  style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
                >
                  {count}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              <X size={12} aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
            <Group label="Status">
              {dims.statuses.map((d) => (
                <Chip
                  key={d.id}
                  label={statusLabel(d.id)}
                  count={d.count}
                  active={queueFilters.statuses.includes(d.id)}
                  onClick={() => toggleArrayItem('statuses', d.id as SubmissionStatus)}
                />
              ))}
            </Group>

            <Group label="Submitter">
              {dims.submitters.map((d) => {
                const p = personaMap.get(d.id);
                return (
                  <Chip
                    key={d.id}
                    label={p?.displayName ?? d.id}
                    count={d.count}
                    active={queueFilters.submitterIds.includes(d.id)}
                    onClick={() => toggleArrayItem('submitterIds', d.id)}
                    leading={
                      p && (
                        <FloatingAvatar
                          seed={p.avatarSeed}
                          size={16}
                          ringColor={p.accentHex}
                          static
                        />
                      )
                    }
                  />
                );
              })}
            </Group>

            {dims.businessUnits.length > 0 && (
              <Group label="Business unit">
                {dims.businessUnits.map((d) => (
                  <Chip
                    key={d.value}
                    label={d.value}
                    count={d.count}
                    active={queueFilters.businessUnits.includes(d.value)}
                    onClick={() => toggleArrayItem('businessUnits', d.value)}
                  />
                ))}
              </Group>
            )}

            {dims.severities.length > 0 && (
              <Group label="Severity">
                {dims.severities.map((d) => (
                  <Chip
                    key={d.value}
                    label={d.value}
                    count={d.count}
                    active={queueFilters.severities.includes(d.value)}
                    onClick={() => toggleArrayItem('severities', d.value)}
                  />
                ))}
              </Group>
            )}

            <Group label="Type">
              {dims.kinds.map((d) => (
                <Chip
                  key={d.value}
                  label={kindLabel(d.value)}
                  count={d.count}
                  active={queueFilters.kinds.includes(d.value)}
                  onClick={() => toggleArrayItem('kinds', d.value)}
                />
              ))}
            </Group>

            {dims.amountBands.length > 0 && (
              <Group label="Amount">
                {dims.amountBands.map((d) => (
                  <Chip
                    key={d.id}
                    label={AMOUNT_BAND_LABEL[d.id]}
                    count={d.count}
                    active={queueFilters.amountBands.includes(d.id)}
                    onClick={() => toggleArrayItem('amountBands', d.id as AmountBand)}
                  />
                ))}
              </Group>
            )}

            <div className="my-3 h-px bg-border-subtle/60" />

            <Group label="Other">
              <ToggleRow
                icon={Paperclip}
                label="Has attachments"
                active={queueFilters.hasAttachments}
                onClick={() => patchFilters({ hasAttachments: !queueFilters.hasAttachments })}
              />
              <ToggleRow
                icon={Sparkles}
                label="Unread only"
                active={queueFilters.unreadOnly}
                onClick={() => patchFilters({ unreadOnly: !queueFilters.unreadOnly })}
              />
            </Group>
          </div>

          <footer className="flex items-center justify-between gap-2 border-t border-border-subtle bg-surface/40 px-3.5 py-2.5">
            <button
              type="button"
              onClick={clearFilters}
              disabled={count === 0}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-40"
            >
              <RotateCcw size={11} aria-hidden="true" />
              <span>Clear all</span>
            </button>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {count === 0 ? 'No filters active' : `${count} filter${count === 1 ? '' : 's'} active`}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors"
              style={{ background: 'var(--themis-primary)', color: 'var(--color-bg)' }}
            >
              Done
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(<div data-themis="true">{panel}</div>, document.body);
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
  leading,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11.5px] font-medium transition-colors',
        active
          ? 'border-transparent bg-[var(--themis-primary)] text-[var(--color-bg)]'
          : 'border-border-subtle bg-surface/60 text-text-secondary hover:bg-surface-hover hover:text-text-primary',
      )}
    >
      {leading}
      {active && <Check size={11} className="shrink-0" aria-hidden="true" />}
      <span className="truncate">{label}</span>
      {typeof count === 'number' && (
        <span
          className={cn(
            'shrink-0 font-mono text-[10px] tracking-wider',
            active ? 'opacity-80' : 'text-text-tertiary',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Filter;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={active}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-hover"
    >
      <span
        className={cn(
          'flex h-7 w-12 items-center rounded-full px-1 transition-colors',
          active ? 'justify-end bg-[var(--themis-primary)]' : 'justify-start bg-surface-hover',
        )}
      >
        <span
          className="block h-5 w-5 rounded-full bg-[var(--color-bg)] shadow-sm"
          aria-hidden="true"
        />
      </span>
      <Icon size={12} className="text-text-tertiary" aria-hidden="true" />
      <span className="text-[12.5px] text-text-primary">{label}</span>
    </button>
  );
}
