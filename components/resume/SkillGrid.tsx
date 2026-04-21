'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILL_CATEGORIES, SKILLS, type SkillCategory } from '@/data/skills';
import { cn } from '@/lib/utils';

type Filter = SkillCategory | 'all';

export default function SkillGrid() {
  const [filter, setFilter] = useState<Filter>('all');

  const visibleSkills = useMemo(
    () => (filter === 'all' ? SKILLS : SKILLS.filter((s) => s.category === filter)),
    [filter]
  );

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: SKILLS.length };
    for (const cat of SKILL_CATEGORIES) {
      counts[cat.id] = SKILLS.filter((s) => s.category === cat.id).length;
    }
    return counts;
  }, []);

  return (
    <section id="skills" className="px-6 py-14 md:px-16">
      <div className="mx-auto max-w-content">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Skills
          </h2>
          <span
            aria-live="polite"
            className="font-mono text-xs text-text-tertiary"
          >
            {visibleSkills.length} of {SKILLS.length} shown
          </span>
        </div>

        {/* Filter buttons */}
        <div role="group" aria-label="Filter skills by category" className="mb-6 flex flex-wrap gap-2">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All"
            count={countsByCategory.all}
          />
          {SKILL_CATEGORIES.map((cat) => (
            <FilterButton
              key={cat.id}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
              label={cat.label}
              count={countsByCategory[cat.id]}
            />
          ))}
        </div>

        {/* Skill cards — grid with layout reflow on filter */}
        <motion.ul layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleSkills.map((skill) => {
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-2">
                    <strong className="text-sm font-semibold text-text-primary">
                      {skill.name}
                    </strong>
                    {skill.firstShipped && (
                      <span className="font-mono text-[10px] text-text-tertiary">
                        since {skill.firstShipped}
                      </span>
                    )}
                  </div>
                  {skill.anchorProject && (
                    <p className="mt-1 text-xs text-text-secondary">
                      {skill.anchorProject}
                      {skill.anchorLink && (
                        <span className="ml-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      )}
                    </p>
                  )}
                </>
              );
              return (
                <motion.li
                  key={`${skill.category}-${skill.name}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border-subtle bg-surface/50 p-4 transition-colors hover:border-accent/30 hover:bg-surface-hover"
                >
                  {skill.anchorLink ? (
                    <Link href={skill.anchorLink} className="group block">
                      {inner}
                    </Link>
                  ) : (
                    <div className="block">{inner}</div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
        active
          ? 'border-accent bg-accent text-background'
          : 'border-border-subtle bg-surface/50 text-text-secondary hover:border-accent/40 hover:text-accent'
      )}
    >
      {label}
      <span className={cn('ml-1.5 font-mono text-[10px] font-normal', active ? 'text-background/80' : 'text-text-tertiary')}>
        {count}
      </span>
    </button>
  );
}
