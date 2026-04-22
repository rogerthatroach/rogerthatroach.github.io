import { ChevronDown } from 'lucide-react';

/**
 * Native `<details>` disclosure wrapper styled to match the site.
 * Closed by default (pass `defaultOpen` to flip). Arrow rotates via
 * the `group-open` variant — no JS. Accessible + keyboard-operable
 * for free.
 */
export default function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  /** Short hint shown next to the title, e.g. "42 skills across 5 registers". */
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen || undefined}
      className="group rounded-2xl border border-border-subtle bg-surface/30 transition-colors open:bg-surface/50"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h2>
          {summary && (
            <p className="mt-0.5 text-xs text-text-tertiary sm:text-sm">{summary}</p>
          )}
        </div>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className="shrink-0 text-text-tertiary transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border-subtle px-5 py-5 md:px-6 md:py-6">
        {children}
      </div>
    </details>
  );
}
