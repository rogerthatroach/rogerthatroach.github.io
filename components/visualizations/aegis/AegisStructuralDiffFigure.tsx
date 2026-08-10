import FigureHeader from '@/components/visualizations/FigureHeader';
import type { AegisStructuralDiffContent } from '@/data/visualizations/aegis';

export default function AegisStructuralDiffFigure({ content }: { content: AegisStructuralDiffContent }) {
  const headingId = content.id + '-title';
  const [aspectLabel, beforeLabel, afterLabel] = content.columnLabels;
  return (
    <section aria-labelledby={headingId}>
      <FigureHeader headingId={headingId} title={content.title} thesis={content.thesis} headingLevel={content.headingLevel} />
      <div className="mt-6 border-y-2 border-text-primary py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.sharedLabel}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{content.sharedDetail}</p>
      </div>
      <div className="mt-5 hidden grid-cols-[0.7fr_1fr_1fr] gap-5 border-b border-border-subtle pb-3 md:grid">
        {[aspectLabel, beforeLabel, afterLabel].map((label) => (
          <p key={label} className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">{label}</p>
        ))}
      </div>
      <ul className="divide-y divide-border-subtle border-b border-border-subtle">
        {content.rows.map((row) => (
          <li key={row.aspect} className="grid gap-4 py-5 md:grid-cols-[0.7fr_1fr_1fr] md:gap-5">
            <p className="text-sm font-semibold text-text-primary">{row.aspect}</p>
            <div className="border-l border-border-subtle pl-4">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary md:hidden">{beforeLabel}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{row.before}</p>
            </div>
            <div className="border-l-2 border-text-primary pl-4">
              <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-text-tertiary md:hidden">{afterLabel}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{row.after}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-l-4 border-text-primary pl-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">{content.continuityLabel}</p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-text-primary">{content.continuityDetail}</p>
      </div>
    </section>
  );
}
