import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisCandidateAmbiguityContent } from '@/data/visualizations/aegis';

export default function AegisCandidateAmbiguityFigure({ content }: { content: AegisCandidateAmbiguityContent }) {
  const headingId = content.id + '-title';
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {content.routes.map((route) => (
          <div key={route.id} className="border-t-2 border-text-primary pt-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{route.countLabel}</p>
            <p className="mt-3 text-base font-semibold text-text-primary">{route.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{route.request}</p>
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary">{content.candidateListLabel}</p>
            {route.candidates.length > 0 ? (
              <ol className="mt-2 divide-y divide-border-subtle border-y border-border-subtle">
                {route.candidates.map((candidate, index) => (
                  <li key={candidate.label} className="grid grid-cols-[2rem_1fr] gap-3 py-3">
                    <span className="font-mono text-sm font-bold text-text-primary">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{candidate.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-text-secondary">{candidate.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 border-y border-dashed border-border-subtle py-4 text-sm text-text-secondary">
                {content.emptyListDetail}
              </p>
            )}
            <div className="mt-5 border-l-2 border-text-primary pl-4">
              <p className="text-sm font-semibold text-text-primary">{route.decision}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{route.outcome}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-2 border-y-2 border-text-primary py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.scoreNoteLabel}</p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.scoreNote}</p>
      </div>
      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
