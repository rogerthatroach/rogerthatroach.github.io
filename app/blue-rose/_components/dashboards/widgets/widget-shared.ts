/**
 * Shared widget prop shape — every widget reads filtered submissions
 * + precomputed KPIs from the parent dashboard host.
 */
import type { AuditEvent, Persona, Submission } from '@/data/themis/types';
import type { DashboardFilters, DashboardKPIs } from '../../../_lib/dashboard';
import type { Widget } from '../../../_lib/dashboard-grid';

export interface WidgetProps {
  widget: Widget;
  submissions: Submission[];
  audit: AuditEvent[];
  personaMap: Map<string, Persona>;
  kpis: DashboardKPIs;
  filters: DashboardFilters;
  setFilters: (next: DashboardFilters) => void;
}
