'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import type { Persona } from '@/data/themis/types';
import FloatingAvatar from './FloatingAvatar';
import { cn } from '@/lib/utils';

const ROLE_LABEL: Record<Persona['role'], string> = {
  submitter: 'Submitter',
  approver: 'Approver',
  observer: 'Observer',
  admin: 'Admin',
  agent: 'AI agent',
};

interface PersonaPillProps {
  personas: Persona[];
  currentPersonaId: string;
  onSwitch: (id: string) => void;
}

/**
 * Persona pill — pinned in the Themis top bar. Click to drop a menu of
 * all personas. Lossless switch (drafts survive). Active persona gets a
 * tinted ring + check; others render at default neutral.
 */
export default function PersonaPill({ personas, currentPersonaId, onSwitch }: PersonaPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = personas.find((p) => p.id === currentPersonaId) ?? personas[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!current) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'group flex items-center gap-2.5 rounded-full px-2 py-1 pl-1 pr-3 text-left',
          'border border-border-subtle bg-surface/70 backdrop-blur-sm',
          'transition-colors hover:bg-surface-hover',
        )}
      >
        <FloatingAvatar
          seed={current.avatarSeed}
          size={28}
          ringColor={current.accentHex}
          presence
          static
        />
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[13px] font-medium text-text-primary">{current.displayName}</span>
          <span className="truncate font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {ROLE_LABEL[current.role]}
          </span>
        </span>
        <ChevronDown size={14} className="text-text-tertiary transition-transform group-aria-expanded:rotate-180" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Switch persona"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-[calc(100%+8px)] z-40 w-72 overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-xl"
          >
            <div className="border-b border-border-subtle px-3 py-1.5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Viewing as
              </p>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {personas.map((p) => {
                const isActive = p.id === current.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => {
                        onSwitch(p.id);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                        isActive ? 'bg-accent-muted' : 'hover:bg-surface-hover',
                      )}
                    >
                      <FloatingAvatar seed={p.avatarSeed} size={32} ringColor={p.accentHex} static />
                      <span className="flex min-w-0 flex-1 flex-col leading-tight">
                        <span className={cn('truncate text-[13px] font-medium', isActive ? 'text-accent' : 'text-text-primary')}>
                          {p.displayName}
                        </span>
                        {p.title && (
                          <span className="truncate text-[11px] text-text-tertiary">{p.title}</span>
                        )}
                        <span className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
                          {ROLE_LABEL[p.role]}
                        </span>
                      </span>
                      {isActive && <Check size={14} className="shrink-0 text-accent" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
