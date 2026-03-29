import type { Reference } from '@/data/posts';

interface ReferenceListProps {
  references: Reference[];
}

export default function ReferenceList({ references }: ReferenceListProps) {
  if (references.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border-subtle pt-8">
      <h2 className="mb-6 text-lg font-semibold text-text-primary">References</h2>
      <ol className="space-y-3">
        {references.map((ref) => (
          <li key={ref.id} className="text-sm leading-relaxed text-text-secondary">
            <span className="mr-1 font-mono text-text-tertiary">[{ref.id}]</span>
            {ref.authors} &ldquo;{ref.title}.&rdquo;{' '}
            <em>{ref.venue}</em>, {ref.year}.
            {ref.url && (
              <>
                {' '}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-2 hover:underline"
                >
                  Link
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
