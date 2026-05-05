/**
 * Dashboard grid — layout state, widget shapes, persistence, share-by-URL.
 *
 * Pure module; no React. Components import this for types + helpers.
 *
 * Layout model:
 *   - 12-column grid
 *   - Each widget owns a row; widgets stack vertically in the order of
 *     `dashboard.widgets`
 *   - Width is one of WIDGET_WIDTHS (3/4/6/8/12 cols)
 *   - Two adjacent widgets occupy the same row when their widths sum to
 *     ≤12; otherwise they wrap. Pure CSS flex-wrap handles this.
 *
 * This is deliberately simpler than react-grid-layout: no free 2D drag,
 * no resize-from-corner. Reorder via drag-handle + width via preset
 * chips. ~200 lines instead of a 50KB dep.
 */
import type { DashboardKPIs } from './dashboard';

// ── Widget catalog ──────────────────────────────────────────────────

export type WidgetKind =
  | 'kpi'
  | 'timeline'
  | 'kindBars'
  | 'donut'
  | 'businessUnit'
  | 'personaActivity'
  | 'table'
  | 'filter'
  | 'dianeNote';

export type KPIMetric = keyof DashboardKPIs;

export type FilterDimension = 'businessUnit' | 'kind' | 'severity';

export type WidgetConfig =
  | { kind: 'kpi'; metric: KPIMetric }
  | { kind: 'timeline' }
  | { kind: 'kindBars' }
  | { kind: 'donut' }
  | { kind: 'businessUnit' }
  | { kind: 'personaActivity' }
  | { kind: 'table'; rows: number }
  | { kind: 'filter'; dimension: FilterDimension }
  | { kind: 'dianeNote'; question: string };

export interface Widget {
  id: string;
  title: string;
  cols: WidgetCols; // grid width
  config: WidgetConfig;
}

export type WidgetCols = 3 | 4 | 6 | 8 | 12;

export const WIDGET_WIDTHS: { cols: WidgetCols; label: string }[] = [
  { cols: 3, label: '¼' },
  { cols: 4, label: '⅓' },
  { cols: 6, label: '½' },
  { cols: 8, label: '⅔' },
  { cols: 12, label: 'Full' },
];

export const WIDGET_CATALOG: Array<{
  kind: WidgetKind;
  label: string;
  hint: string;
  defaultCols: WidgetCols;
}> = [
  { kind: 'kpi', label: 'KPI tile', hint: 'Single number with label', defaultCols: 3 },
  { kind: 'timeline', label: 'Approvals over time', hint: 'Area chart by bucket', defaultCols: 12 },
  { kind: 'kindBars', label: 'Volume by type', hint: 'Horizontal bars per kind', defaultCols: 6 },
  { kind: 'donut', label: 'Status donut', hint: 'Distribution across queue', defaultCols: 4 },
  { kind: 'businessUnit', label: 'By business unit', hint: 'Approved vs pending', defaultCols: 6 },
  { kind: 'personaActivity', label: 'Per-persona activity', hint: 'Submitted / approved / in-flight', defaultCols: 6 },
  { kind: 'table', label: 'Recent submissions', hint: 'List of latest rows', defaultCols: 8 },
  { kind: 'filter', label: 'Filter chip', hint: 'Scope dashboard by dimension', defaultCols: 4 },
  { kind: 'dianeNote', label: 'Diane note', hint: 'Saved Q&A snippet', defaultCols: 6 },
];

export const KPI_METRIC_OPTIONS: Array<{
  metric: KPIMetric;
  label: string;
  hint: string;
}> = [
  { metric: 'approvedCount', label: 'Approved', hint: 'Count this period' },
  { metric: 'approvedBudget', label: 'Approved budget', hint: 'Sum of approved spend' },
  { metric: 'inFlightCount', label: 'In flight', hint: 'Pending + in-review' },
  { metric: 'inFlightCostAtRisk', label: 'Cost at risk', hint: 'Budget pending decision' },
  { metric: 'approvalRate', label: 'Approval rate', hint: 'Approved / terminal' },
  { metric: 'avgDecisionMs', label: 'Decision velocity', hint: 'Avg time-to-decide' },
  { metric: 'anomalyCount', label: 'Anomalies', hint: 'Hint count in range' },
  { metric: 'rejectedCount', label: 'Rejected', hint: 'Terminal reject count' },
];

// ── Dashboard shape ─────────────────────────────────────────────────

export interface Dashboard {
  id: string;
  name: string;
  ownerPersonaId: string;
  widgets: Widget[];
  createdAt: number;
  updatedAt: number;
}

export const STORAGE_KEY = 'themis:dashboards:v1';

interface PersistedShape {
  v: 1;
  dashboards: Dashboard[];
  activeId: string | null;
}

// ── Persistence ─────────────────────────────────────────────────────

export function loadDashboards(): { dashboards: Dashboard[]; activeId: string | null } {
  if (typeof window === 'undefined') return { dashboards: [], activeId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dashboards: [], activeId: null };
    const parsed = JSON.parse(raw) as PersistedShape;
    if (parsed.v !== 1 || !Array.isArray(parsed.dashboards)) {
      return { dashboards: [], activeId: null };
    }
    return { dashboards: parsed.dashboards, activeId: parsed.activeId ?? null };
  } catch {
    return { dashboards: [], activeId: null };
  }
}

export function saveDashboards(
  dashboards: Dashboard[],
  activeId: string | null,
): void {
  if (typeof window === 'undefined') return;
  try {
    const blob: PersistedShape = { v: 1, dashboards, activeId };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
  } catch {
    /* localStorage full / unavailable — silent no-op */
  }
}

// ── Builders ────────────────────────────────────────────────────────

export function createDashboard(
  name: string,
  ownerPersonaId: string,
): Dashboard {
  const now = Date.now();
  return {
    id: `dash_${now}_${Math.random().toString(36).slice(2, 8)}`,
    name: name || 'Untitled dashboard',
    ownerPersonaId,
    widgets: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function defaultWidget(kind: WidgetKind): Widget {
  const meta = WIDGET_CATALOG.find((w) => w.kind === kind)!;
  const id = `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const config = defaultConfig(kind);
  return {
    id,
    title: meta.label,
    cols: meta.defaultCols,
    config,
  };
}

function defaultConfig(kind: WidgetKind): WidgetConfig {
  switch (kind) {
    case 'kpi':
      return { kind: 'kpi', metric: 'approvedBudget' };
    case 'timeline':
      return { kind: 'timeline' };
    case 'kindBars':
      return { kind: 'kindBars' };
    case 'donut':
      return { kind: 'donut' };
    case 'businessUnit':
      return { kind: 'businessUnit' };
    case 'personaActivity':
      return { kind: 'personaActivity' };
    case 'table':
      return { kind: 'table', rows: 6 };
    case 'filter':
      return { kind: 'filter', dimension: 'businessUnit' };
    case 'dianeNote':
      return { kind: 'dianeNote', question: 'What\'s our approval rate?' };
  }
}

export function reorderWidgets(
  widgets: Widget[],
  fromId: string,
  toId: string,
): Widget[] {
  const fromIdx = widgets.findIndex((w) => w.id === fromId);
  const toIdx = widgets.findIndex((w) => w.id === toId);
  if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return widgets;
  const next = [...widgets];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

// ── Share via URL hash ──────────────────────────────────────────────

export function encodeDashboardForShare(d: Dashboard): string {
  // Strip ownerPersonaId so an imported dashboard belongs to the importer.
  const slim: Omit<Dashboard, 'ownerPersonaId'> = {
    id: d.id,
    name: d.name,
    widgets: d.widgets,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
  const json = JSON.stringify(slim);
  // base64url-safe (no padding)
  if (typeof window === 'undefined') return '';
  const b64 = window.btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeDashboardFromShare(
  s: string,
  importerPersonaId: string,
): Dashboard | null {
  try {
    if (typeof window === 'undefined') return null;
    const padded = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4;
    const filled = pad ? padded + '='.repeat(4 - pad) : padded;
    const json = decodeURIComponent(escape(window.atob(filled)));
    const parsed = JSON.parse(json) as Omit<Dashboard, 'ownerPersonaId'>;
    if (!Array.isArray(parsed.widgets) || typeof parsed.name !== 'string') {
      return null;
    }
    return {
      id: `dash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: `${parsed.name} (imported)`,
      ownerPersonaId: importerPersonaId,
      widgets: parsed.widgets,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

// ── Starter dashboards ──────────────────────────────────────────────

/** A handful of widgets the user can drop in fresh to feel the surface. */
export function starterDashboard(ownerPersonaId: string): Dashboard {
  const now = Date.now();
  return {
    id: `dash_starter_${now}`,
    name: 'My first dashboard',
    ownerPersonaId,
    createdAt: now,
    updatedAt: now,
    widgets: [
      { id: 'w_s1', title: 'Approved budget', cols: 3, config: { kind: 'kpi', metric: 'approvedBudget' } },
      { id: 'w_s2', title: 'In flight', cols: 3, config: { kind: 'kpi', metric: 'inFlightCount' } },
      { id: 'w_s3', title: 'Approval rate', cols: 3, config: { kind: 'kpi', metric: 'approvalRate' } },
      { id: 'w_s4', title: 'Anomalies', cols: 3, config: { kind: 'kpi', metric: 'anomalyCount' } },
      { id: 'w_s5', title: 'Approvals over time', cols: 12, config: { kind: 'timeline' } },
      { id: 'w_s6', title: 'Status', cols: 4, config: { kind: 'donut' } },
      { id: 'w_s7', title: 'Volume by type', cols: 8, config: { kind: 'kindBars' } },
    ],
  };
}
