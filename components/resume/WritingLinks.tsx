import Link from 'next/link';
import { ArrowRight, FileText, ScrollText } from 'lucide-react';

const LINKS = [
  {
    href: '/blog',
    icon: FileText,
    title: 'Engineering blog',
    summary:
      'Deep-dives: Prometheus architecture, Astraeus LLM-as-Router, commodity-tax CFO trust, combustion tuning with operators, text-to-SQL.',
  },
  {
    href: '/papers',
    icon: ScrollText,
    title: 'Long-form papers (in progress)',
    summary:
      'Operating-model drafts on AI inside bank CFO functions. Abstract + ToC + BibTeX surfaced; full drafts ship as they land.',
  },
];

export default function WritingLinks() {
  return (
    <ul className="space-y-3">
      {LINKS.map((l) => {
        const Icon = l.icon;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex items-start gap-3 rounded-xl border border-border-subtle bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface-hover"
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary transition-colors group-hover:text-accent">
                  {l.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
                  {l.summary}
                </p>
              </div>
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="mt-1 shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
