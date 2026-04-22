import { TIMELINE } from '@/data/timeline';
import { paletteStyle } from '@/lib/palette';

/**
 * Current-role card for /resume. Pulls rbc-lead from TIMELINE as the
 * authoritative "what are you doing right now" source, rendered with
 * the Intelligent Systems era palette so it reads as the latest chapter.
 */
const ERA_PALETTE = {
  primary: '#93c5fd',
  primaryLight: '#1e40af',
};

export default function CurrentRoleCard() {
  const current = TIMELINE[0];
  if (!current) return null;

  return (
    <div
      style={paletteStyle(ERA_PALETTE)}
      className="palette-card rounded-2xl border p-5 md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="palette-text font-mono text-xs font-semibold uppercase tracking-widest">
          Now · {current.era}
        </p>
        <span className="font-mono text-xs text-text-tertiary">{current.period}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {current.logoPath && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.logoPath}
            alt=""
            aria-hidden="true"
            className="h-7 w-auto max-w-[120px] shrink-0 object-contain"
            loading="lazy"
          />
        )}
        <h2 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
          {current.role}
        </h2>
      </div>
      <p className="mt-1 text-sm text-text-tertiary">{current.org}</p>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {current.description}
      </p>

      {current.teamContext && (
        <div className="mt-4 border-t border-border-subtle pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Team shape
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
            {current.teamContext}
          </p>
        </div>
      )}
    </div>
  );
}
