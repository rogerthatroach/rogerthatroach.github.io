'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Pencil, Plus } from 'lucide-react';
import { useCurrentPersona } from '../../_lib/store';
import {
  EMPTY_DASHBOARD_FILTERS,
  type DashboardFilters,
} from '../../_lib/dashboard';
import {
  createDashboard,
  decodeDashboardFromShare,
  defaultWidget,
  loadDashboards,
  saveDashboards,
  starterDashboard,
  type Dashboard,
  type Widget,
  type WidgetKind,
} from '../../_lib/dashboard-grid';
import DashboardGrid from './DashboardGrid';
import DashboardSwitcher from './DashboardSwitcher';
import InsightsHeader from '../InsightsHeader';
import SavedDashboardsList from './SavedDashboardsList';
import ShareDashboardButton from './ShareDashboardButton';
import WidgetPalette from './WidgetPalette';
import WidgetConfigModal from './WidgetConfigModal';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * CustomDashboardPage — drag-mosaic dashboard builder at
 * /blue-rose/insights/custom.
 *
 *   ┌─ saved list ┬─ active dashboard ────────────────────┐
 *   │ My boards   │ Name · Edit · Share                   │
 *   │ + New       │ Filter chips (time + dimensions)      │
 *   │ • Capex     │ ┌─ widget ─┐ ┌─ widget ─┐ ...         │
 *   │ • Quarterly │ │   chart  │ │   KPI    │             │
 *   │             │ └──────────┘ └──────────┘             │
 *   └─────────────┴───────────────────────────────────────┘
 *
 * State persisted to localStorage `themis:dashboards:v1`. Sharing via
 * URL hash `#d=<base64>` — no backend.
 */
export default function CustomDashboardPage() {
  const persona = useCurrentPersona();
  const [hydrated, setHydrated] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_DASHBOARD_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [importBanner, setImportBanner] = useState<Dashboard | null>(null);

  // Hydrate from localStorage; check URL hash for shared dashboard.
  useEffect(() => {
    const { dashboards: persisted, activeId: persistedActive } = loadDashboards();
    let nextDashboards = persisted;
    let nextActive = persistedActive;

    // First-run: seed a starter dashboard so the surface is non-empty.
    if (nextDashboards.length === 0) {
      const starter = starterDashboard(persona.id);
      nextDashboards = [starter];
      nextActive = starter.id;
      saveDashboards(nextDashboards, nextActive);
    }

    // Check for shared dashboard in URL hash.
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const m = hash.match(/^#d=(.+)$/);
      if (m) {
        const imported = decodeDashboardFromShare(m[1], persona.id);
        if (imported) {
          setImportBanner(imported);
          // Clear the hash so reload doesn't re-trigger.
          history.replaceState(null, '', window.location.pathname);
        }
      }
    }

    setDashboards(nextDashboards);
    setActiveId(nextActive ?? nextDashboards[0]?.id ?? null);
    setHydrated(true);
  }, [persona.id]);

  // Persist whenever dashboards change.
  useEffect(() => {
    if (!hydrated) return;
    saveDashboards(dashboards, activeId);
  }, [hydrated, dashboards, activeId]);

  const activeDashboard = useMemo(
    () => dashboards.find((d) => d.id === activeId) ?? null,
    [dashboards, activeId],
  );

  const updateActive = useCallback(
    (mut: (d: Dashboard) => Dashboard) => {
      setDashboards((prev) =>
        prev.map((d) => (d.id === activeId ? mut({ ...d, updatedAt: Date.now() }) : d)),
      );
    },
    [activeId],
  );

  const onCreate = () => {
    const next = createDashboard('Untitled dashboard', persona.id);
    setDashboards((prev) => [next, ...prev]);
    setActiveId(next.id);
    setEditing(true);
  };
  const onDuplicate = (id: string) => {
    const src = dashboards.find((d) => d.id === id);
    if (!src) return;
    const copy: Dashboard = {
      ...src,
      id: `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: `${src.name} copy`,
      ownerPersonaId: persona.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDashboards((prev) => [copy, ...prev]);
    setActiveId(copy.id);
  };
  const onRename = (id: string, name: string) => {
    setDashboards((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name, updatedAt: Date.now() } : d)),
    );
  };
  const onRemove = (id: string) => {
    setDashboards((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  };
  const onPickWidget = (kind: WidgetKind) => {
    const widget = defaultWidget(kind);
    updateActive((d) => ({ ...d, widgets: [...d.widgets, widget] }));
  };
  const onWidgetsChange = (widgets: Widget[]) => {
    updateActive((d) => ({ ...d, widgets }));
  };
  const onEditWidget = (widgetId: string) => {
    const w = activeDashboard?.widgets.find((x) => x.id === widgetId) ?? null;
    setEditingWidget(w);
  };
  const onSaveWidget = (next: Widget) => {
    updateActive((d) => ({
      ...d,
      widgets: d.widgets.map((w) => (w.id === next.id ? next : w)),
    }));
  };
  const acceptImport = () => {
    if (!importBanner) return;
    setDashboards((prev) => [importBanner, ...prev]);
    setActiveId(importBanner.id);
    setImportBanner(null);
  };

  if (!hydrated) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <div className="h-8 w-40 animate-pulse rounded-md bg-surface/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10"
      >
        {/* Page heading */}
        <motion.div variants={fadeUp} className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
              Insights
            </p>
            <h1 className="font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
              Custom dashboards
            </h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Build your own view. Drag to reorder · width via the chips · share by URL.
            </p>
          </div>
        </motion.div>

        {/* Dashboard switcher — toggle Holistic ↔ saved custom boards */}
        <motion.div variants={fadeUp} className="mb-6">
          <DashboardSwitcher
            active={activeId ?? 'holistic'}
            onSelectCustom={(id) => setActiveId(id)}
          />
        </motion.div>

        {/* Import banner */}
        {importBanner && (
          <motion.div
            variants={fadeUp}
            className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--themis-in-review)]/40 bg-[var(--themis-in-review-bg)] px-4 py-3"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                Imported dashboard
              </p>
              <p className="mt-0.5 text-[13px] text-text-primary">
                <strong className="font-medium">{importBanner.name}</strong> —{' '}
                {importBanner.widgets.length} widget
                {importBanner.widgets.length === 1 ? '' : 's'}. Save to keep, or
                discard.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setImportBanner(null)}
                className="rounded-md border border-border-subtle bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={acceptImport}
                className="flex items-center gap-1 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                style={{
                  background: 'var(--themis-primary)',
                  color: 'var(--color-bg)',
                }}
              >
                <Check size={11} aria-hidden="true" />
                <span>Save</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 2-col layout: saved list + active dashboard */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <motion.div variants={fadeUp}>
            <SavedDashboardsList
              dashboards={dashboards}
              activeId={activeId}
              onSelect={setActiveId}
              onCreate={onCreate}
              onDuplicate={onDuplicate}
              onRename={onRename}
              onRemove={onRemove}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="min-w-0">
            {!activeDashboard ? (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface/30 px-8 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                  No dashboard selected
                </p>
                <p className="mt-3 max-w-md text-[13px] text-text-secondary">
                  Pick one from the list, or create a new one.
                </p>
                <button
                  type="button"
                  onClick={onCreate}
                  className="mt-4 flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                  style={{
                    background: 'var(--themis-primary)',
                    color: 'var(--color-bg)',
                  }}
                >
                  <Plus size={11} aria-hidden="true" />
                  <span>New dashboard</span>
                </button>
              </div>
            ) : (
              <>
                {/* Active toolbar */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                      {activeDashboard.widgets.length} widget
                      {activeDashboard.widgets.length === 1 ? '' : 's'}
                    </p>
                    <h2 className="truncate font-display text-lg font-medium text-text-primary">
                      {activeDashboard.name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((v) => !v)}
                    className={cn(
                      'rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                      filtersOpen
                        ? 'border-[var(--themis-primary)]/50 bg-[var(--themis-glass-tint)] text-text-primary'
                        : 'border-border-subtle bg-surface/60 text-text-secondary hover:border-[var(--themis-primary)]/40 hover:text-text-primary',
                    )}
                  >
                    Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing((v) => !v)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                      editing
                        ? 'border-[var(--themis-primary)]/50 bg-[var(--themis-glass-tint)] text-text-primary'
                        : 'border-border-subtle bg-surface/60 text-text-secondary hover:border-[var(--themis-primary)]/40 hover:text-text-primary',
                    )}
                  >
                    {editing ? (
                      <>
                        <Check size={11} aria-hidden="true" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Pencil size={11} aria-hidden="true" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
                    style={{
                      background: 'var(--themis-primary)',
                      color: 'var(--color-bg)',
                    }}
                  >
                    <Plus size={11} aria-hidden="true" />
                    <span>Add widget</span>
                  </button>
                  <ShareDashboardButton dashboard={activeDashboard} />
                </div>

                {filtersOpen && (
                  <div className="mb-4 rounded-2xl border border-border-subtle bg-surface/40 px-4 py-3">
                    <InsightsHeader filters={filters} setFilters={setFilters} />
                  </div>
                )}

                <DashboardGrid
                  widgets={activeDashboard.widgets}
                  filters={filters}
                  setFilters={setFilters}
                  editing={editing}
                  onWidgetsChange={onWidgetsChange}
                  onEditWidget={onEditWidget}
                />
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      <WidgetPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPick={onPickWidget}
      />
      <WidgetConfigModal
        widget={editingWidget}
        onClose={() => setEditingWidget(null)}
        onSave={onSaveWidget}
      />
    </div>
  );
}
