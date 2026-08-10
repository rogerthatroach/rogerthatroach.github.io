import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AbstractionComparisonContent } from '@/data/visualizations/closedLoop';

export default function AbstractionComparisonFigure({ content }: { content: AbstractionComparisonContent }) {
  const headingId = `${content.id}-title`;

  return (
    <section aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-7 hidden grid-cols-[12rem_repeat(5,minmax(0,1fr))] gap-4 border-b-2 border-text-primary pb-3 xl:grid">
        <span aria-hidden="true" />
        {content.questions.map((question) => (
          <p key={question.id} className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
            {question.label}
          </p>
        ))}
      </div>

      <ol className="divide-y divide-border-subtle border-y border-border-subtle xl:border-t-0">
        {content.rows.map((row) => (
          <li key={row.id} className="py-6">
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[12rem_repeat(5,minmax(0,1fr))] xl:gap-4">
              <header className="lg:col-span-2 xl:col-span-1">
                <p className="text-base font-semibold text-text-primary">{row.domain}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-tertiary">{row.context}</p>
              </header>

              {content.questions.map((question) => {
                const answer = row.answers.find((candidate) => candidate.questionId === question.id);
                if (!answer) return null;
                return (
                  <div key={question.id} className="border-l-2 border-text-primary pl-3">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary xl:hidden">
                      {question.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary xl:mt-0">{answer.detail}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-2 border-t border-dotted border-text-primary pt-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-5 xl:ml-48">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
                {content.limitLabel}
              </p>
              <p className="text-sm font-semibold leading-relaxed text-text-primary">{row.limit}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.bottomLineLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.bottomLine}</p>
      </div>

      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
