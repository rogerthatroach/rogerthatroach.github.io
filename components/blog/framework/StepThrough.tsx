'use client';

import { useId, useState } from 'react';
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
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const current = steps[idx];
  const total = steps.length;

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));

  return (
    <figure className="my-8 not-prose">
      {label && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
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
        <div
          id={panelId}
          role="region"
          aria-label={`Step ${idx + 1} of ${total}: ${current.title}`}
          aria-live="polite"
          aria-atomic="true"
          className="relative min-h-24"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="text-sm leading-relaxed text-text-secondary"
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Authored mobile navigation: step targets get their own row so all
            controls remain 44px without clipping a narrow article column. */}
        <div className="mt-5 grid grid-cols-2 items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className={cn(
              'col-start-1 row-start-2 inline-flex min-h-11 items-center gap-1 justify-self-start rounded-md border px-3 py-2 text-xs font-semibold transition-colors sm:row-start-1',
              idx === 0
                ? 'border-border-subtle text-text-tertiary opacity-50'
                : 'border-border-subtle text-text-secondary hover:border-accent/40 hover:text-accent'
            )}
            aria-label={idx === 0 ? 'Previous step' : `Previous step: ${steps[idx - 1].title}`}
            aria-controls={panelId}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Prev
          </button>

          <div
            className="col-span-2 col-start-1 row-start-1 flex justify-self-center sm:col-span-1 sm:col-start-2"
            role="group"
            aria-label="Choose a step"
          >
            {steps.map((step, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-pressed={i === idx}
                aria-controls={panelId}
                aria-label={`Go to step ${i + 1}: ${step.title}`}
                className="group flex h-11 min-w-11 items-center justify-center px-2"
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all',
                    i === idx
                      ? 'w-6 bg-accent'
                      : 'w-1.5 bg-border-subtle group-hover:bg-accent/50'
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={idx === total - 1}
            className={cn(
              'col-start-2 row-start-2 inline-flex min-h-11 items-center gap-1 justify-self-end rounded-md border px-3 py-2 text-xs font-semibold transition-colors sm:col-start-3 sm:row-start-1',
              idx === total - 1
                ? 'border-border-subtle text-text-tertiary opacity-50'
                : 'border-accent/40 bg-accent-muted text-accent hover:border-accent hover:bg-accent hover:text-background'
            )}
            aria-label={idx === total - 1 ? 'Next step' : `Next step: ${steps[idx + 1].title}`}
            aria-controls={panelId}
          >
            Next
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {steps.length > 1 && (
        <noscript>
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface/40 p-5 md:p-6">
            <p className="mb-4 text-sm font-semibold text-text-primary">
              Remaining steps
            </p>
            <ol className="space-y-5">
              {steps.slice(1).map((step, stepIndex) => (
                <li key={`${step.title}-${stepIndex}`}>
                  <h3 className="text-base font-semibold text-text-primary">
                    Step {stepIndex + 2}: {step.title}
                  </h3>
                  {step.caption && (
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {step.caption}
                    </p>
                  )}
                  <div className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.content}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </noscript>
      )}
    </figure>
  );
}
