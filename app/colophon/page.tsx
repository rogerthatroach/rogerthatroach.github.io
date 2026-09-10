import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { THEMES } from '@/data/themes';

const ROWS: { label: string; value: React.ReactNode }[] = [
  {
    label: 'Framework',
    value: 'Next.js 16 (app router, static export). React 19. TypeScript in strict mode.',
  },
  {
    label: 'Styling',
    value: (
      <>
        Tailwind CSS 4 with CSS-variable-backed theme tokens. The palette
        picker exposes {THEMES.length} themes built from the same semantic
        color relationships.
      </>
    ),
  },
  {
    label: 'Typography',
    value: (
      <>
        <span className="font-mono">Fraunces</span> for display type,{' '}
        <span className="font-mono">Inter</span> for body copy, and{' '}
        <span className="font-mono">JetBrains Mono</span> for labels and code.
        All three are self-hosted through <span className="font-mono">next/font</span>.
      </>
    ),
  },
  {
    label: 'Motion',
    value: (
      <>
        Framer Motion for selected transitions. Motion supplements the copy
        and static figure states rather than carrying an explanation alone.
      </>
    ),
  },
  {
    label: 'Diagrams',
    value: (
      <>
        HTML, CSS, and SVG backed by typed content. Interaction is added where
        changing state clarifies a sequence, comparison, or trade-off; the
        initial frame carries the primary idea.
      </>
    ),
  },
  {
    label: 'Content',
    value: (
      <>
        Case studies and posts live in typed data and MDX. They are organized
        around mechanism, evidence, boundaries, and stated limits.
      </>
    ),
  },
  {
    label: 'Hosting',
    value: (
      <>
        GitHub Pages, static export, deployed from{' '}
        <span className="font-mono">main</span> via GitHub Actions.
      </>
    ),
  },
  {
    label: 'Source',
    value: (
      <a
        href="https://github.com/rogerthatroach/rogerthatroach.github.io"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-accent underline underline-offset-4 hover:text-text-primary"
      >
        <Github size={14} aria-hidden="true" />
        rogerthatroach/rogerthatroach.github.io
      </a>
    ),
  },
];

const META_TITLE = 'Colophon';
const META_DESCRIPTION =
  'Framework, typography, figures, hosting, and public-source notes for this portfolio.';
const META_PATH = '/colophon';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: META_PATH },
  openGraph: {
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    url: META_PATH,
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function ColophonPage() {
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
          <ArrowLeft size={16} aria-hidden="true" />
          Home
        </Link>

        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Colophon
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Technical stack and publishing choices.
          </h1>

          {/* Stack table */}
          <dl className="mt-10 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {r.label}
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Public source
          </h2>
          <p className="mt-3 border-l-2 border-accent/40 pl-5 text-sm leading-relaxed text-text-secondary">
            The linked repository is public. Anything tracked there
            should be treated as published material, including source comments,
            metadata, and assets.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
