'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, Square, SquareStack } from 'lucide-react';
import {
  createDashboard,
  loadDashboards,
  saveDashboards,
  type Dashboard,
} from '../../_lib/dashboard-grid';
import { useCurrentPersona } from '../../_lib/store';
import { cn } from '@/lib/utils';

interface DashboardSwitcherProps {
  /** Which dashboard surface is currently rendering. */
  active: 'holistic' | string;
  /**
   * Optional handler — when provided, clicking a custom-dashboard chip
   * fires this with the dashboard id (used by /insights/custom to
   * switch boards in-place). When absent, the switcher routes to
   * /insights/custom for any custom-dashboard click.
   */
  onSelectCustom?: (dashboardId: string) => void;
}

/**
 * DashboardSwitcher — a slim chip strip that lets the user toggle
 * between the pre-built Holistic dashboard and any saved custom
 * dashboards. Mounts at the top of both `/insights` and
 * `/insights/custom`.
 *
 *   ┌─ ◫ Holistic ●  ▢ Capex board   ▢ Quarterly review   + New ─┐
 *
 * - "Holistic" = the pre-built /insights surface (T1.8a)
 * - Each subsequent chip = a custom dashboard saved to localStorage
 *   (themis:dashboards:v1) — persona-scoped
 * - "+ New" creates a new blank dashboard and routes to /insights/custom
 */
export default function DashboardSwitcher({
  active,
  onSelectCustom,
}: DashboardSwitcherProps) {
  const persona = useCurrentPersona();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    const { dashboards: persisted } = loadDashboards();
    // Only show dashboards owned by the current persona (or unowned imports)
    const mine = persisted.filter(
      (d) => !d.ownerPersonaId || d.ownerPersonaId === persona.id,
    );
    setDashboards(mine);
    setHydrated(true);
  }, [persona.id]);

  const onNew = () => {
    const next = createDashboard('Untitled dashboard', persona.id);
    const all = [next, ...dashboards];
    saveDashboards(all, next.id);
    router.push('/blue-rose/insights/custom');
  };

  const onSelect = (id: string) => {
    if (onSelectCustom) {
      onSelectCustom(id);
      return;
    }
    // Persist activeId so /insights/custom picks it up when it mounts
    saveDashboards(dashboards, id);
    router.push('/blue-rose/insights/custom');
  };

  if (!hydrated) {
    return <div className="h-9" aria-hidden="true" />;
  }

  return (
    <nav
      role="tablist"
      aria-label="Dashboard"
      className="flex flex-wrap items-center gap-1.5"
    >
      <Link
        href="/blue-rose/insights"
        role="tab"
        aria-selected={active === 'holistic'}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
          active === 'holistic'
            ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
            : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        )}
      >
        <Sparkles size={10} aria-hidden="true" />
        <span>Holistic</span>
      </Link>

      {dashboards.map((d) => {
        const isActive = active === d.id;
        return (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(d.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
              isActive
                ? 'bg-[var(--themis-primary)] text-[var(--color-bg)]'
                : 'border border-border-subtle text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )}
            title={`${d.widgets.length} widget${d.widgets.length === 1 ? '' : 's'}`}
          >
            {isActive ? (
              <SquareStack size={10} aria-hidden="true" />
            ) : (
              <Square size={10} aria-hidden="true" />
            )}
            <span className="max-w-[160px] truncate normal-case tracking-normal">
              {d.name}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onNew}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-border-subtle px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary transition-colors hover:border-[var(--themis-primary)]/50 hover:text-text-primary"
      >
        <Plus size={10} aria-hidden="true" />
        <span>New</span>
      </button>
    </nav>
  );
}
