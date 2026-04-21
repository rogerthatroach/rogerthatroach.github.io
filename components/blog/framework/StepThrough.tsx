'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Step-through widget for guided narratives — a workflow, a drafting
 * session, a pipeline in action. User clicks prev/next to advance.
 *
 * Steps can contain arbitrary JSX. For paired diagrams + prose, put the
 * diagram + caption inside a single step's `content`.
 *
 * Respects prefers-reduced-motion — crossfade becomes instant swap.
 *
 * Usage:
 *
 *   <StepThrough
 *     label="Drafting a new PAR"
 *     steps={[
 *       { title: 'User intent', content: <>...</> },
 *       { title: 'Template match', content: <>...</> },
 *       { title: 'Field extraction', content: <>...</> },
 *     ]}
 *   />
 */
export interface Step {
  title: string;
  content: React.ReactNode;
  /** Optional caption below the step title. */
  caption?: string;
}

export default function StepThrough({
  steps,
  label,
}: {
  steps: Step[];
  /** Optional label shown above the stepper. */
  label?: string;
}) {
  const [idx, setIdx] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = steps[idx];
  const total = steps.length;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));

  return (
    <figure className="my-8 not-prose">
      {label && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
          {label}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface/40 p-5 md:p-6">
        {/* Step header — title + progress */}
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {current.title}
            </h3>
            {current.caption && (
              <p className="mt-0.5 text-xs text-text-tertiary">
                {current.caption}
              </p>
            )}
          </div>
          <span className="shrink-0 font-mono text-xs text-text-tertiary">
            Step {idx + 1} / {total}
          </span>
        </div>

        {/* Step body — crossfade on change */}
        <div className="relative min-h-[6rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="text-sm leading-relaxed text-text-secondary"
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav + progress dots */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors',
              idx === 0
                ? 'border-border-subtle text-text-tertiary opacity-50'
                : 'border-border-subtle text-text-secondary hover:border-accent/40 hover:text-accent'
            )}
            aria-label="Previous step"
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Prev
          </button>

          <div className="flex gap-1.5" role="tablist" aria-label="Step progress">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Go to step ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === idx
                    ? 'w-6 bg-accent'
                    : 'w-1.5 bg-border-subtle hover:bg-accent/50'
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={idx === total - 1}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors',
              idx === total - 1
                ? 'border-border-subtle text-text-tertiary opacity-50'
                : 'border-accent/40 bg-accent-muted text-accent hover:border-accent hover:bg-accent hover:text-background'
            )}
            aria-label="Next step"
          >
            Next
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </figure>
  );
}
