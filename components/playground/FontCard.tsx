/**
 * Font-pairing comparison card.
 *
 * The card wrapper uses site default font; children override via className
 * so sans/mono swap in for the body + chip. Text content is identical
 * across cards by design — the only variable is the typeface.
 *
 * displayClass is optional: when provided, only the headline gets the
 * display font (useful for serif-display + sans-body pairings like
 * Fraunces or Instrument Serif over Inter).
 */
export default function FontCard({
  name,
  note,
  sansClass,
  monoClass,
  displayClass,
}: {
  name: string;
  note: string;
  sansClass: string;
  monoClass: string;
  displayClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface/50 p-5">
      {/* Meta label — uses site default, so the comparison label itself
          stays constant across cards */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Pairing
        </p>
        <h3 className="mt-1 text-sm font-semibold text-text-primary">
          {name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          {note}
        </p>
      </div>

      {/* Sample content — body uses sansClass; mono uses monoClass;
          headline uses displayClass if provided, otherwise falls back
          to sansClass. */}
      <div className={`space-y-3 ${sansClass}`}>
        <p className={`${monoClass} text-[10px] uppercase tracking-widest text-accent`}>
          § Harmilap Singh Dhaliwal
        </p>

        <h4
          className={`${displayClass ?? ''} text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-text-primary`}
        >
          I build AI systems for regulated finance — from physical combustion
          to agentic workflows on $600M+ allocations.
        </h4>

        <p className="text-sm leading-relaxed text-text-secondary">
          AI &amp; Data Science Lead at RBC CFO Group. Previously Quantiphi,
          TCS. 7.5 years shipping ML in production. The closed-loop pattern —
          sense, model, optimize, act — at four ascending abstraction levels.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className={`${monoClass} inline-flex items-center rounded-full border border-accent/30 bg-accent-muted/40 px-2.5 py-0.5 text-[10px] font-medium text-accent`}>
            LangGraph
          </span>
          <span className={`${monoClass} inline-flex items-center rounded-full border border-border-subtle bg-surface px-2.5 py-0.5 text-[10px] text-text-secondary`}>
            MCP
          </span>
          <span className={`${monoClass} inline-flex items-center rounded-full border border-border-subtle bg-surface px-2.5 py-0.5 text-[10px] text-text-secondary`}>
            pgvector
          </span>
        </div>

        <p className={`${monoClass} pt-2 text-[11px] text-text-tertiary`}>
          Nov 2025 · 40,000 events · 99.95% accuracy · $3M/yr
        </p>
      </div>
    </div>
  );
}
