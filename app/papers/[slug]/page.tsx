import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, Download, Calendar } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PAPERS } from '@/data/papers';

export function generateStaticParams() {
  return PAPERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const paper = PAPERS.find((p) => p.slug === params.slug);
  if (!paper) return { title: 'Paper not found' };
  return {
    title: `${paper.title} — Papers`,
    description: paper.abstract.slice(0, 180),
    alternates: { canonical: `/papers/${paper.slug}` },
    openGraph: {
      title: paper.title,
      description: paper.subtitle ?? paper.abstract.slice(0, 180),
      type: 'article',
    },
  };
}

export default function PaperLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const paper = PAPERS.find((p) => p.slug === params.slug);
  if (!paper) notFound();

  const isDraft = paper.status === 'draft';
  const bibtexAuthor = paper.bibtexAuthor ?? 'Dhaliwal, Harmilap Singh';
  const bibtexKey = `dhaliwal${paper.year}${paper.slug.replace(/-/g, '')}`;
  const citationDate = paper.publishedAt ?? paper.draftStarted ?? `${paper.year}-01-01`;
  const citationMonth = new Date(citationDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-3xl px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/papers"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Papers
        </Link>

        {/* Header */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Paper · {paper.year} · {paper.pages} pp
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
          {paper.title}
        </h1>
        {paper.subtitle && (
          <p className="mt-3 font-display text-base leading-relaxed text-text-secondary sm:text-lg">
            {paper.subtitle}
          </p>
        )}

        {/* Status row */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {isDraft ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
              <Calendar size={10} aria-hidden="true" />
              Drafting since {citationMonth}
            </span>
          ) : (
            <a
              href={`/papers/${paper.slug}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="group inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
            >
              <Download size={14} aria-hidden="true" />
              Download PDF ({paper.pages} pp)
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Stable URL · no version churn
          </span>
        </div>

        {/* Abstract */}
        <section className="mt-12">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
            Abstract
          </p>
          <p className="font-display text-base leading-relaxed text-text-secondary sm:text-lg">
            {paper.abstract}
          </p>
        </section>

        {/* Table of contents */}
        <section className="mt-12">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
            Table of contents
          </p>
          <ol className="space-y-2 border-l-2 border-border-subtle pl-5">
            {paper.toc.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed text-text-secondary">
                {item}
              </li>
            ))}
          </ol>
        </section>

        {/* Topics */}
        <section className="mt-10">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {paper.topics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border-subtle bg-surface/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Related */}
        {paper.related && paper.related.length > 0 && (
          <section className="mt-12">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
              Related
            </p>
            <ul className="space-y-3">
              {paper.related.map((r) => (
                <li key={r.url}>
                  <Link
                    href={r.url}
                    className="group block rounded-lg border border-border-subtle bg-surface/30 p-4 transition-colors hover:border-accent/40 hover:bg-surface-hover"
                  >
                    <div className="flex items-start gap-3">
                      <FileText size={14} className="mt-0.5 shrink-0 text-text-tertiary group-hover:text-accent" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                          {r.title}
                        </p>
                        {r.note && (
                          <p className="mt-1 text-xs text-text-tertiary">{r.note}</p>
                        )}
                      </div>
                      <ArrowRight size={12} className="mt-1 shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cite as */}
        <section className="mt-12 border-t border-border-subtle pt-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
            Cite as
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border-subtle bg-surface/40 p-4 text-xs text-text-secondary">
            <code className="font-mono">{`@techreport{${bibtexKey},
  author      = {${bibtexAuthor}},
  title       = {${paper.title}},
  year        = {${paper.year}},
  month       = {${new Date(citationDate).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })}},
  pages       = {${paper.pages}},
  url         = {https://rogerthatroach.github.io/papers/${paper.slug}},
  institution = {Independent}
}`}</code>
          </pre>
          <p className="mt-3 text-xs text-text-tertiary">
            Plain text: <em className="text-text-secondary">{bibtexAuthor}. ({citationMonth}). {paper.title}. https://rogerthatroach.github.io/papers/{paper.slug}.</em>
          </p>
        </section>

        {/* Disclaimer */}
        <p className="mt-10 text-xs italic text-text-tertiary">
          This paper describes architectural patterns and engineering decisions
          at a level of abstraction that does not reveal proprietary code,
          data, or internal screenshots. Concrete details appear only where
          they have already been shared publicly. Everything else is
          generalised to the pattern.
        </p>
      </main>
      <Footer />
    </>
  );
}
