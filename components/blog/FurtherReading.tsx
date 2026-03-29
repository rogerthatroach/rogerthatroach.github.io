import type { FurtherReadingItem } from '@/data/posts';

interface FurtherReadingProps {
  items: FurtherReadingItem[];
}

export default function FurtherReading({ items }: FurtherReadingProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">Further Reading</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              {item.title}
            </a>
            <p className="mt-0.5 text-sm text-text-tertiary">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
