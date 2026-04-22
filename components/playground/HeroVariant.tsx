import { ArrowRight } from 'lucide-react';

/**
 * Scaled-down hero preview. Renders three compositions with the same copy
 * so the only variable is hierarchy / portrait placement. Inside a
 * rounded container to signal "this is a preview, not the actual hero."
 */
export default function HeroVariant({
  variant,
  label,
  caption,
}: {
  variant: string;
  label: string;
  caption: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
      {/* Label bar */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border-subtle px-5 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Variant
          </p>
          <p className="mt-0.5 text-sm font-semibold text-text-primary">
            {label}
          </p>
        </div>
        <p className="max-w-md text-xs text-text-tertiary">{caption}</p>
      </div>

      {/* Preview surface — fixed aspect so all three compare apples-to-apples */}
      <div className="bg-background px-6 py-8 md:px-10 md:py-12">
        {variant === 'current' && <CurrentHero />}
        {variant === 'audit' && <AuditHero />}
        {variant === 'hybrid' && <HybridHero />}
      </div>
    </div>
  );
}

function CurrentHero() {
  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
      <div className="order-first mx-auto aspect-[4/5] w-32 overflow-hidden rounded-xl lg:mx-0 lg:order-last lg:w-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portrait-sm.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-xs tracking-widest text-accent">
          AI &amp; Data Science Lead — RBC
        </p>
        <h3 className="mb-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          Harmilap Singh Dhaliwal
        </h3>
        <p className="mb-2 text-base text-text-secondary md:text-lg">
          I architect AI systems across four domains — industrial, cloud,
          enterprise, agentic.
        </p>
        <p className="text-xs text-text-tertiary">
          Eight years shipping production AI — from 900MW combustion tuning in
          Japan to bank-wide agentic platforms in Toronto.
        </p>
      </div>
    </div>
  );
}

function AuditHero() {
  return (
    <div className="max-w-[680px]">
      {/* Name as 12px mono eyebrow */}
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
        § Harmilap Singh Dhaliwal
      </p>

      {/* H1: positioning statement with one concrete number, 40-56px */}
      <h3 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary">
        I build AI systems for regulated finance — from physical combustion to
        agentic workflows on $600M+ allocations.
      </h3>

      <p className="mt-5 max-w-[560px] text-sm leading-[1.5] text-text-secondary md:text-base">
        AI &amp; Data Science Lead at RBC CFO Group. Previously Quantiphi,
        TCS. 7.5 years shipping ML in production.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
        >
          Read case studies
          <ArrowRight size={12} />
        </a>
        <a
          href="#"
          className="text-xs text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          Contact / CV
        </a>
      </div>
    </div>
  );
}

function HybridHero() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
      <div className="max-w-[680px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
          § Harmilap Singh Dhaliwal
        </p>

        <h3 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary">
          I build AI systems for regulated finance — from physical combustion
          to agentic workflows on $600M+ allocations.
        </h3>

        <p className="mt-5 max-w-[560px] text-sm leading-[1.5] text-text-secondary md:text-base">
          AI &amp; Data Science Lead at RBC CFO Group. Previously Quantiphi,
          TCS. 7.5 years shipping ML in production.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            Read case studies
            <ArrowRight size={12} />
          </a>
          <a
            href="#"
            className="text-xs text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
          >
            Contact / CV
          </a>
        </div>
      </div>

      {/* Small signature portrait tile — 96×96, not dominant */}
      <div className="order-first mx-auto aspect-square w-24 overflow-hidden rounded-xl border border-border-subtle md:order-last md:mx-0 md:self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portrait-sm.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
