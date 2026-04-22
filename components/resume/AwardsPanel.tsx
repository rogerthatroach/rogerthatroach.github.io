import { Trophy } from 'lucide-react';
import { AWARDS } from '@/data/awards';

export default function AwardsPanel() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {AWARDS.map((award) => (
        <li
          key={`${award.title}-${award.year}`}
          className="flex gap-3 rounded-xl border border-border-subtle bg-surface/40 p-3"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-accent-muted">
            {award.imagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={award.imagePath}
                alt=""
                aria-hidden="true"
                className="h-full w-full rounded-lg object-cover"
                loading="lazy"
              />
            ) : (
              <Trophy size={16} className="text-accent" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold leading-snug text-text-primary">
              {award.title}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {award.org} · {award.year}
            </p>
            {award.detail && (
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                {award.detail}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
