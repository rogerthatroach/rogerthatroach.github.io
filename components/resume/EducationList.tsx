import { EDUCATION, CREDENTIALS } from '@/data/education';

export default function EducationList() {
  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {EDUCATION.map((e) => (
          <li key={e.degree} className="border-l-2 border-accent/40 pl-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-text-primary">{e.degree}</p>
              <span className="font-mono text-[10px] text-text-tertiary">{e.years}</span>
            </div>
            <p className="mt-0.5 text-xs text-text-secondary">{e.institution}</p>
            {e.detail && (
              <p className="mt-1.5 text-xs leading-relaxed text-text-tertiary">
                {e.detail}
              </p>
            )}
          </li>
        ))}
      </ul>

      {CREDENTIALS.length > 0 && (
        <div className="border-t border-border-subtle pt-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Continuing Education
          </p>
          <ul className="space-y-2">
            {CREDENTIALS.map((c) => (
              <li key={c.title} className="text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">{c.title}</span> ·{' '}
                <span className="text-text-tertiary">
                  {c.issuer} · {c.year}
                </span>
                {c.note && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-text-tertiary">
                    {c.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
