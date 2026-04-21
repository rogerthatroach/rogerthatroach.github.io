import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * "Options considered" table — the decision-visibility spine.
 *
 * Use at §4 of any post making a non-obvious architectural choice.
 * Requires ≥3 alternatives with honest pros/cons. The chosen option
 * gets a visual highlight + "chosen" badge. Shallow/binary options
 * lists are the hallmark of a light post — this component exists to
 * make them harder to write.
 *
 * Example MDX usage:
 *
 *   <OptionsConsidered
 *     decision="Orchestration framework for conditional workflows"
 *     options={[
 *       { name: 'LangGraph', pros: [...], cons: [...], chosen: true },
 *       { name: 'Vanilla LangChain chains', pros: [...], cons: [...] },
 *       { name: 'Hand-rolled FSM', pros: [...], cons: [...] },
 *       { name: 'CrewAI', pros: [...], cons: [...] },
 *     ]}
 *   />
 */
export interface Option {
  name: string;
  pros: string[];
  cons: string[];
  chosen?: boolean;
  /** Optional one-liner summary shown under the name. */
  summary?: string;
}

interface OptionsConsideredProps {
  /** One-line framing of what's being decided. */
  decision: string;
  options: Option[];
  /** Optional label to replace the default "Options considered" heading. */
  heading?: string;
}

export default function OptionsConsidered({
  decision,
  options,
  heading = 'Options considered',
}: OptionsConsideredProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {heading}
        </p>
        <p className="mt-1 text-sm font-medium text-text-primary">{decision}</p>
      </div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {options.map((option) => (
          <li
            key={option.name}
            className={cn(
              'relative rounded-lg border p-4',
              option.chosen
                ? 'border-accent bg-accent-muted/30'
                : 'border-border-subtle bg-surface/50'
            )}
          >
            {option.chosen && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                <Check size={10} aria-hidden="true" />
                Chosen
              </span>
            )}
            <div className="pr-16">
              <strong className="block text-sm font-semibold text-text-primary">
                {option.name}
              </strong>
              {option.summary && (
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {option.summary}
                </p>
              )}
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Pros
                </dt>
                <dd>
                  <ul className="space-y-1 text-text-secondary">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="leading-snug">
                        · {pro}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Cons
                </dt>
                <dd>
                  <ul className="space-y-1 text-text-secondary">
                    {option.cons.map((con, i) => (
                      <li key={i} className="leading-snug">
                        · {con}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </figure>
  );
}
