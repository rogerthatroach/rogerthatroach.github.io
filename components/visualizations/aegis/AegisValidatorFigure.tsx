import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisValidatorContent } from '@/data/visualizations/aegis';

export default function AegisValidatorFigure({ content }: { content: AegisValidatorContent }) {
  const headingId = content.id + '-title';
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <p className="mt-7 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.inputLabel}</p>
      <dl className="mt-3 grid gap-4 md:grid-cols-3">
        {content.inputs.map((input) => (
          <div key={input.label} className="border-t-2 border-text-primary pt-3">
            <dt className="text-sm font-semibold text-text-primary">{input.label}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{input.detail}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-8 divide-y divide-border-subtle border-y border-border-subtle">
        {content.checks.map((check) => (
          <li key={check.number} className="grid gap-4 py-5 md:grid-cols-[3rem_1fr_1.1fr] md:gap-6">
            <p className="font-mono text-base font-bold text-text-primary">{check.number}</p>
            <div>
              <p className="text-base font-semibold text-text-primary">{check.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{check.detail}</p>
            </div>
            <div className="border-l-2 border-dotted border-text-primary pl-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">{content.missingControlLabel}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">{check.failure}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid border-y-2 border-text-primary md:grid-cols-2 md:divide-x md:divide-text-primary">
        {[content.pass, content.reject].map((outcome) => (
          <div key={outcome.title} className="border-b border-border-subtle py-5 last:border-b-0 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">{outcome.condition}</p>
            <p className="mt-2 text-lg font-semibold text-text-primary">{outcome.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{outcome.detail}</p>
          </div>
        ))}
      </div>
      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
