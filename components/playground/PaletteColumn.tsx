import type { CSSProperties } from 'react';
import { Check, ArrowRight } from 'lucide-react';

/**
 * A single palette-comparison column.
 *
 * The `vars` object is applied as inline CSS variables, so every Tailwind
 * class that reads bg-{background|surface|accent} etc inside the column
 * reflects that palette — without leaking out to siblings. This lets us
 * render three full palettes side-by-side on the same page.
 */
export default function PaletteColumn({
  name,
  description,
  vars,
}: {
  name: string;
  description: string;
  vars: Record<string, string>;
}) {
  return (
    <div
      style={vars as CSSProperties}
      className="rounded-xl border border-border bg-background p-5 text-text-primary"
    >
      {/* Label row */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Palette
        </p>
        <h3 className="mt-1 text-sm font-semibold text-text-primary">
          {name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      {/* Swatch strip — shows the actual hex values */}
      <div className="mb-5 flex gap-1">
        {['--color-bg', '--color-surface', '--color-border', '--color-accent', '--color-accent-muted'].map((v) => (
          <div
            key={v}
            style={{ backgroundColor: `var(${v})` }}
            className="h-6 flex-1 rounded border border-border"
            aria-label={v}
          />
        ))}
      </div>

      {/* Mini-component set — a plausible preview of the live site */}
      <div className="space-y-4">
        {/* Era-style card */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              Cloud ML
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">
              2021–2022
            </span>
          </div>
          <p className="text-xs font-semibold text-text-primary">Quantiphi</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">
            ~70% → 99.95% accuracy uplift on Humana documents.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] text-accent">
            <Check size={10} />
            Milestone metric
          </div>
        </div>

        {/* Button row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-muted px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-background"
          >
            Primary
            <ArrowRight size={12} />
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            Secondary
          </button>
          <a
            href="#"
            className="text-xs text-accent underline-offset-4 hover:underline"
          >
            Link
          </a>
        </div>

        {/* Progress dots (like SectionProgress) */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Dots
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
          </div>
        </div>

        {/* Metric counter */}
        <div className="rounded-lg border border-border bg-surface-hover p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Years shipping ML
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-accent">
            7.5
            <span className="ml-0.5 text-sm text-text-secondary">+</span>
          </p>
        </div>
      </div>
    </div>
  );
}
