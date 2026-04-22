import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TIMELINE, type TimelineNode } from '@/data/timeline';
import { cn } from '@/lib/utils';

/**
 * Four-abstraction-level thesis mapping for /about.
 *
 * Renders the sense → model → optimize → act pattern at ascending
 * abstraction levels (Physical → Cloud → Financial → Intelligent), each
 * row anchored to the role where that level was shipped. The audit's
 * P1-6 brief: "Thesis visible on /about without scrolling on desktop.
 * Each row links to a case study or blog post."
 *
 * Reads role data from data/timeline.ts so period / logo / link stay
 * canonical. Level labels are a presentation layer — the audit framing
 * (Physical / Cloud / Financial / Intelligent) is clearer for a
 * director-audience than the role-era strings (Foundation / Cloud ML /
 * Enterprise Analytics / Intelligent Systems) used elsewhere.
 */

interface LevelMap {
  level: string;
  id: TimelineNode['id'];
  highlight: string;
  href?: string;
}

const LEVELS: LevelMap[] = [
  {
    level: 'Physical',
    id: 'tcs',
    highlight: '84 ML models · PSO · $3M/yr saved at 900MW Maizuru',
    href: '/projects/combustion-tuning',
  },
  {
    level: 'Cloud',
    id: 'quantiphi',
    highlight: '~70% → 99.95% accuracy on Humana documents',
    href: '/projects/document-intelligence',
  },
  {
    level: 'Financial',
    id: 'rbc-senior',
    highlight: 'months → 90 min on $600M+ commodity-tax allocations',
    href: '/projects/commodity-tax',
  },
  {
    level: 'Intelligent',
    id: 'rbc-lead',
    highlight: 'PAR Assist + Astraeus · LangGraph · pgvector · text-to-SQL',
    href: '/projects/par-assist',
  },
];

export default function ThesisMapping() {
  return (
    <section aria-labelledby="thesis-heading" className="my-10">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          The pattern, mapped
        </p>
        <h3
          id="thesis-heading"
          className="mt-1 text-lg font-semibold text-text-primary sm:text-xl"
        >
          Same closed loop, four abstraction levels.
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Sense the state of the system. Model it. Optimize against a goal.
          Act — and close the loop. The substrate changes; the pattern
          doesn&rsquo;t.
        </p>
      </div>

      <ol className="divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
        {LEVELS.map(({ level, id, highlight, href }) => {
          const node = TIMELINE.find((n) => n.id === id);
          if (!node) return null;
          const RowContent = (
            <div
              className={cn(
                'grid grid-cols-[auto_1fr] gap-3 p-4 sm:grid-cols-[8rem_1fr_auto] sm:gap-5 sm:p-5',
                href && 'group transition-colors hover:bg-surface-hover'
              )}
            >
              <div className="sm:border-r sm:border-border-subtle sm:pr-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {level}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-text-tertiary">
                  {node.period}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">
                  {node.org} — {node.role.replace(/ — .*$/, '')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                  {highlight}
                </p>
              </div>

              {href && (
                <div className="col-start-2 row-start-2 mt-1 inline-flex items-center gap-1 text-xs text-accent transition-transform sm:col-auto sm:row-auto sm:mt-0 sm:self-center sm:group-hover:translate-x-0.5">
                  Case study
                  <ArrowRight size={12} aria-hidden="true" />
                </div>
              )}
            </div>
          );

          return (
            <li key={id}>
              {href ? <Link href={href}>{RowContent}</Link> : RowContent}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
