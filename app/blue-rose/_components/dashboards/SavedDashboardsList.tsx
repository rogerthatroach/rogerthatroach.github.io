'use client';

import { useState } from 'react';
import { Copy, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Dashboard } from '../../_lib/dashboard-grid';
import { cn } from '@/lib/utils';

interface SavedDashboardsListProps {
  dashboards: Dashboard[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

export default function SavedDashboardsList({
  dashboards,
  activeId,
  onSelect,
  onCreate,
  onDuplicate,
  onRename,
  onRemove,
}: SavedDashboardsListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const startRename = (d: Dashboard) => {
    setRenamingId(d.id);
    setDraftName(d.name);
    setOpenMenuId(null);
  };
  const commitRename = (id: string) => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed.length <= 60) onRename(id, trimmed);
    setRenamingId(null);
  };

  return (
    <aside className="flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
          My dashboards
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-1 rounded-md border border-border-subtle bg-surface/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-[var(--themis-primary)]/40 hover:text-text-primary"
          title="New dashboard"
        >
          <Plus size={10} aria-hidden="true" />
          <span>New</span>
        </button>
      </header>

      {dashboards.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-subtle bg-surface/30 px-3 py-3 font-mono text-[10px] text-text-tertiary">
          No saved dashboards yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {dashboards.map((d) => {
            const active = d.id === activeId;
            const renaming = renamingId === d.id;
            return (
              <li key={d.id} className="relative">
                {renaming ? (
                  <input
                    type="text"
                    value={draftName}
                    autoFocus
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => commitRename(d.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(d.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    className="w-full rounded-lg border border-[var(--themis-primary)] bg-surface/70 px-2.5 py-1.5 text-[13px] text-text-primary outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(d.id)}
                    className={cn(
                      'group flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors',
                      active
                        ? 'border-[var(--themis-primary)]/50 bg-[var(--themis-glass-tint)]'
                        : 'border-border-subtle bg-surface/40 hover:border-[var(--themis-primary)]/30 hover:bg-surface-hover',
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-text-primary">
                      {d.name}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((id) => (id === d.id ? null : d.id));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId((id) => (id === d.id ? null : d.id));
                        }
                      }}
                      className="rounded-md p-1 text-text-tertiary opacity-0 transition-all hover:bg-surface-hover hover:text-text-primary group-hover:opacity-100"
                      aria-label="Dashboard menu"
                    >
                      <MoreHorizontal size={11} aria-hidden="true" />
                    </span>
                  </button>
                )}
                {openMenuId === d.id && !renaming && (
                  <div
                    role="menu"
                    className="themis-glass-pop absolute right-1 top-full z-20 mt-1 w-44 rounded-lg border border-border-subtle bg-surface/95 py-1 shadow-lg"
                  >
                    <MenuItem
                      label="Rename"
                      icon={<Pencil size={11} aria-hidden="true" />}
                      onClick={() => startRename(d)}
                    />
                    <MenuItem
                      label="Duplicate"
                      icon={<Copy size={11} aria-hidden="true" />}
                      onClick={() => {
                        onDuplicate(d.id);
                        setOpenMenuId(null);
                      }}
                    />
                    <MenuItem
                      label="Delete"
                      tone="danger"
                      icon={<Trash2 size={11} aria-hidden="true" />}
                      onClick={() => {
                        if (window.confirm(`Delete "${d.name}"?`)) onRemove(d.id);
                        setOpenMenuId(null);
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

function MenuItem({
  label,
  icon,
  onClick,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone?: 'danger';
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors',
        tone === 'danger'
          ? 'text-[var(--themis-rejected)] hover:bg-[var(--themis-rejected-bg)]'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
