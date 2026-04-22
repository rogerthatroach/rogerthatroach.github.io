import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PAPERS } from '@/data/papers';

export const metadata: Metadata = {
  title: 'Papers — Harmilap Singh Dhaliwal',
  description:
    'Long-form citable artifacts. Patterns, constraints, and decisions from inside the work.',
  alternates: { canonical: '/papers' },
};

export default function PapersIndexPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Home
        </Link>

        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Papers
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Long-form artifacts — citable, stable, specific.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Blog posts compress ideas; papers commit to them. Each artifact
          below is a stable URL, a BibTeX citation, and an 8–15 page PDF.
          Written to be linked-to, not just read.
        </p>

        <ul className="mt-12 space-y-4">
          {PAPERS.map((p) => {
            const isDraft = p.status === 'draft';
            const comingLabel = isDraft && p.draftStarted
              ? `Drafting since ${new Date(p.draftStarted).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}`
              : null;

            return (
              <li key={p.slug}>
                <Link
                  href={`/papers/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-border-subtle bg-surface/40 transition-colors hover:border-accent/40 hover:bg-surface-hover"
                >
                  <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-6 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface text-accent">
                      <FileText size={20} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                          {p.year} · {p.pages} pp
                        </span>
                        {isDraft && (
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-500">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-display text-base font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-lg">
                        {p.title}
                      </p>
                      {p.subtitle && (
                        <p className="mt-1 text-xs text-text-tertiary sm:text-sm">
                          {p.subtitle}
                        </p>
                      )}
                      {comingLabel && (
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                          {comingLabel}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="hidden shrink-0 self-center text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent sm:block"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-xs text-text-tertiary">
          New papers appear here as they&rsquo;re drafted. Each has a stable
          URL that will not change.
        </p>
      </main>
      <Footer />
    </>
  );
}
