'use client';

import { useMemo, useState, type DragEvent } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useThemis, usePersonaMap } from '../../_lib/store';
import {
  applyDashboardFilters,
  computeKPIs,
  DEFAULT_SCENARIO,
  type DashboardFilters,
} from '../../_lib/dashboard';
import {
  WIDGET_WIDTHS,
  reorderWidgets,
  type Widget,
  type WidgetCols,
} from '../../_lib/dashboard-grid';
import KPIWidget from './widgets/KPIWidget';
import TimelineWidget from './widgets/TimelineWidget';
import KindBarsWidget from './widgets/KindBarsWidget';
import DonutWidget from './widgets/DonutWidget';
import BusinessUnitWidget from './widgets/BusinessUnitWidget';
import PersonaActivityWidget from './widgets/PersonaActivityWidget';
import TableWidget from './widgets/TableWidget';
import FilterWidget from './widgets/FilterWidget';
import DianeNoteWidget from './widgets/DianeNoteWidget';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { WidgetProps } from './widgets/widget-shared';

interface DashboardGridProps {
  widgets: Widget[];
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
  editing: boolean;
  onWidgetsChange: (next: Widget[]) => void;
  onEditWidget: (widgetId: string) => void;
}

const DRAG_MIME = 'application/x-themis-widget';

/**
 * DashboardGrid — 12-column flex-wrap grid that hosts widgets.
 *
 * In `editing` mode, each widget gets a chrome header:
 *   ┌─ ⠿ Title ──── ¼ ⅓ ½ ⅔ Full · ✎ · ✕ ┐
 *   │           widget body                │
 *   └──────────────────────────────────────┘
 *
 * Reorder via HTML5 drag-drop on the header. Width via the inline
 * preset chips. Hand-rolled — no react-grid-layout dep — because the
 * 12-col flex layout fits the codebase's terse-deps discipline.
 */
export default function DashboardGrid({
  widgets,
  filters,
  setFilters,
  editing,
  onWidgetsChange,
  onEditWidget,
}: DashboardGridProps) {
  const { seed } = useThemis();
  const personaMap = usePersonaMap();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Apply filters once, share across all widgets.
  const filtered = useMemo(
    () => applyDashboardFilters(seed.submissions, filters),
    [seed.submissions, filters],
  );
  const kpis = useMemo(
    () => computeKPIs(filtered, seed.audit, DEFAULT_SCENARIO),
    [filtered, seed.audit],
  );

  // Drag-reorder is gated on `editing` — keeps view-mode immutable.
  // The fix here addresses two real bugs in the prior implementation:
  //  1. The whole `<header>` was `draggable={true}` AND contained child
  //     `<button>`s — buttons inherited the draggable, causing click-vs-
  //     drag contention. Now only the GripVertical is draggable; the
  //     header is not. Buttons get `draggable={false}` explicitly.
  //  2. The drop target lacked visual feedback — added `hoverDropId`
  //     state with an amethyst ring on dragover.
  const [hoverDropId, setHoverDropId] = useState<string | null>(null);

  const onDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    if (!editing) return;
    e.dataTransfer.setData(DRAG_MIME, id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };
  const onDragEnd = () => {
    setDraggedId(null);
    setHoverDropId(null);
  };
  const onDrop = (e: DragEvent<HTMLElement>, toId: string) => {
    if (!editing) return;
    e.preventDefault();
    const fromId = e.dataTransfer.getData(DRAG_MIME);
    setDraggedId(null);
    setHoverDropId(null);
    if (!fromId || fromId === toId) return;
    onWidgetsChange(reorderWidgets(widgets, fromId, toId));
  };
  const onDragOver = (e: DragEvent<HTMLElement>, toId: string) => {
    if (!editing) return;
    if (Array.from(e.dataTransfer.types).includes(DRAG_MIME)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (toId !== hoverDropId) setHoverDropId(toId);
    }
  };
  const onDragLeave = (toId: string) => {
    if (hoverDropId === toId) setHoverDropId(null);
  };

  const setCols = (id: string, cols: WidgetCols) => {
    onWidgetsChange(widgets.map((w) => (w.id === id ? { ...w, cols } : w)));
  };
  const remove = (id: string) => {
    onWidgetsChange(widgets.filter((w) => w.id !== id));
  };

  if (widgets.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface/30 px-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          Empty dashboard
        </p>
        <p className="mt-3 max-w-md text-[13px] text-text-secondary">
          Add a widget from the palette below to start tracking what matters
          to you. Saved per-persona, shareable by URL.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {widgets.map((w) => (
        <motion.div
          key={w.id}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          style={{ gridColumn: `span ${w.cols} / span ${w.cols}` }}
          className={cn(
            'group relative flex min-h-[140px] flex-col rounded-2xl border bg-surface/40 transition-all',
            draggedId === w.id && 'opacity-50',
            hoverDropId === w.id && draggedId && draggedId !== w.id
              ? 'border-[var(--themis-primary)]/70 ring-2 ring-[var(--themis-primary)]/30'
              : 'border-border-subtle',
            editing && hoverDropId !== w.id && 'hover:border-[var(--themis-primary)]/40',
          )}
          onDragOver={(e) => onDragOver(e, w.id)}
          onDragLeave={() => onDragLeave(w.id)}
          onDrop={(e) => onDrop(e, w.id)}
        >
          {/* Chrome header — only the grip is draggable in edit mode. Header
              itself is not draggable, so clicking title / chips / buttons
              never gets confused for a drag. */}
          <header className="flex items-center gap-2 border-b border-border-subtle/60 px-3 py-2">
            {editing && (
              <span
                role="button"
                aria-label="Drag to reorder"
                title="Drag to reorder"
                draggable
                onDragStart={(e) => onDragStart(e, w.id)}
                onDragEnd={onDragEnd}
                className="flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary active:cursor-grabbing"
              >
                <GripVertical size={12} aria-hidden="true" />
              </span>
            )}
            <h3 className="min-w-0 flex-1 truncate font-display text-[13px] font-medium text-text-primary">
              {w.title}
            </h3>
            {editing && (
              <>
                <div
                  className="flex items-center gap-0.5 rounded-md border border-border-subtle bg-surface/70 px-0.5 py-0.5"
                  draggable={false}
                >
                  {WIDGET_WIDTHS.map((preset) => {
                    const active = w.cols === preset.cols;
                    return (
                      <button
                        key={preset.cols}
                        type="button"
                        draggable={false}
                        onClick={() => setCols(w.id, preset.cols)}
                        aria-pressed={active}
                        title={`${preset.cols} columns`}
                        className={cn(
                          'rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider transition-colors',
                          active
                            ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                            : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary',
                        )}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  draggable={false}
                  onClick={() => onEditWidget(w.id)}
                  className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  title="Configure widget"
                  aria-label="Configure widget"
                >
                  <Pencil size={11} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  draggable={false}
                  onClick={() => remove(w.id)}
                  className="rounded-md p-1 text-text-tertiary transition-colors hover:bg-[var(--themis-rejected-bg)] hover:text-[var(--themis-rejected)]"
                  title="Remove widget"
                  aria-label="Remove widget"
                >
                  <Trash2 size={11} aria-hidden="true" />
                </button>
              </>
            )}
          </header>

          {/* Body */}
          <div className="min-h-0 flex-1 px-4 py-4">
            <RenderWidget
              widget={w}
              submissions={filtered}
              audit={seed.audit}
              personaMap={personaMap}
              kpis={kpis}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RenderWidget(props: WidgetProps) {
  switch (props.widget.config.kind) {
    case 'kpi':
      return <KPIWidget {...props} />;
    case 'timeline':
      return <TimelineWidget {...props} />;
    case 'kindBars':
      return <KindBarsWidget {...props} />;
    case 'donut':
      return <DonutWidget {...props} />;
    case 'businessUnit':
      return <BusinessUnitWidget {...props} />;
    case 'personaActivity':
      return <PersonaActivityWidget {...props} />;
    case 'table':
      return <TableWidget {...props} />;
    case 'filter':
      return <FilterWidget {...props} />;
    case 'dianeNote':
      return <DianeNoteWidget {...props} />;
  }
}
