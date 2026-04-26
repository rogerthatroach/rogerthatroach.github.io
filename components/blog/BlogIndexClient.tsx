'use client';

import { useCallback, useMemo, useState } from 'react';
import ProjectAccordion, { type AccordionGroup } from '@/components/blog/ProjectAccordion';

/**
 * Blog index — interactive shell.
 *
 * Owns the register-filter state (formal · practitioner · builder).
 * Renders the sticky title block + filter chips + accordion in one
 * client surface so chip selection and accordion filtering stay in
 * sync without context plumbing.
 *
 * Sort order within each group: formal → practitioner → builder
 * (matches the legend); date as secondary sort within the same
 * register.
 *
 * Filter behaviour (selecting, not dropping):
 *   • Default: empty selection = show everything (no constraint).
 *   • Click a chip → adds that register to the active set; only posts
 *     in selected registers show. Click again → removes from set.
 *   • Multi-select union: 2+ chips selected = show posts matching any
 *     of them.
 *   • "Clear" link appears only when the set is non-empty.
 *
 * Groups with zero posts after filtering are hidden.
 */

type Register = 'formal' | 'practitioner' | 'builder';

const REGISTER_ORDER: Record<Register, number> = {
  formal: 0,
  practitioner: 1,
  builder: 2,
};

const REGISTER_GLYPH: Record<Register, string> = {
  formal: '§',
  practitioner: '¶',
  builder: '◯',
};

const REGISTER_GLOSS: Record<Register, string> = {
  formal: 'theorem · proof · math',
  practitioner: 'decisions · options considered · rationale',
  builder: 'story · lessons · leadership',
};

const REGISTERS: Register[] = ['formal', 'practitioner', 'builder'];

export default function BlogIndexClient({ groups }: { groups: AccordionGroup[] }) {
  const [selected, setSelected] = useState<Set<Register>>(() => new Set());

  const toggle = useCallback((r: Register) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  // Filter + sort. Empty selection = show everything (no constraint).
  // Otherwise: only posts whose register is in the selected set survive.
  // Groups with no surviving posts are dropped so the page doesn't
  // render empty headers.
  const visibleGroups = useMemo(() => {
    return groups
      .map((g) => ({
        ...g,
        posts: g.posts
          .filter((p) => {
            if (selected.size === 0) return true;
            return p.register && selected.has(p.register as Register);
          })
          .slice()
          .sort((a, b) => {
            const ar = REGISTER_ORDER[(a.register as Register) ?? 'builder'] ?? 99;
            const br = REGISTER_ORDER[(b.register as Register) ?? 'builder'] ?? 99;
            if (ar !== br) return ar - br;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }),
      }))
      .filter((g) => g.posts.length > 0);
  }, [groups, selected]);

  return (
    <>
      {/* Sticky header: title + subtitle + register filter legend. The
          translucent background + soft bottom border give the surface
          enough contrast to separate from scrolling content without
          breaking the wabi-sabi restraint. */}
      <div className="sticky top-16 z-20 -mx-6 border-b border-border-subtle/40 bg-background/85 px-6 pb-5 pt-3 backdrop-blur-md md:-mx-16 md:px-16">
        <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">Writings</h1>
        <p className="mt-2 max-w-2xl text-base text-text-secondary">
          Technical explorations — architecture patterns, formal guarantees, and the systems
          thinking behind the work. Grouped by project so posts about the same system read as
          a set.
        </p>

        {/* Register chips — selecting filter. Default empty = show all
            (no constraint). Click a chip → adds to the filter set →
            only matching posts show. Click again → removes. Multi-
            select union. */}
        <div
          role="group"
          aria-label="Filter posts by register"
          className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-2 text-[11px] text-text-tertiary"
        >
          <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.18em] text-text-tertiary/70">
            filter
          </span>
          {REGISTERS.map((r) => {
            const isSelected = selected.has(r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggle(r)}
                aria-pressed={isSelected}
                className={`group flex items-baseline gap-1.5 rounded-md border px-2.5 py-1 transition-all ${
                  isSelected
                    ? 'border-accent bg-accent-muted text-accent'
                    : 'border-border-subtle/40 bg-transparent text-text-tertiary hover:border-border-subtle hover:text-text-secondary'
                }`}
              >
                <span aria-hidden="true" className="font-display text-base leading-none">
                  {REGISTER_GLYPH[r]}
                </span>
                <span className="font-mono uppercase tracking-[0.18em]">{r}</span>
                <span
                  className={`hidden font-sans normal-case tracking-normal sm:inline ${
                    isSelected ? 'text-accent/70' : 'text-text-tertiary/70'
                  }`}
                >
                  {REGISTER_GLOSS[r]}
                </span>
              </button>
            );
          })}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clear}
              className="ml-1 font-mono text-[9px] uppercase tracking-[0.18em] text-text-tertiary transition-colors hover:text-accent"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {visibleGroups.length === 0 ? (
        <p className="mt-16 text-center text-sm text-text-tertiary">
          No posts match the active filters.
        </p>
      ) : (
        <div className="mt-8">
          <ProjectAccordion groups={visibleGroups} />
        </div>
      )}
    </>
  );
}
