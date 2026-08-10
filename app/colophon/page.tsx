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
        Tailwind CSS with CSS-variable-backed theme tokens. {THEMES.length}{' '}
        themes live behind the palette picker in the nav:{' '}
        {THEMES.map((theme, index) => (
          <span key={theme.id}>
            {index > 0 && (index === THEMES.length - 1 ? ', and ' : ', ')}
            <span className="font-mono">{theme.name}</span> ({theme.description})
          </span>
        ))}
        .
      </>
    ),
  },
  {
    label: 'Typography',
    value: (
      <>
        <a
          href="https://rsms.me/inter/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          Inter
        </a>{' '}
        for body. <span className="font-mono">JetBrains Mono</span> for
        eyebrows, metrics, and technical chips. Both loaded via{' '}
        <span className="font-mono">next/font</span>.
      </>
    ),
  },
  {
    label: 'Motion',
    value: (
      <>
        Framer Motion, with{' '}
        <span className="font-mono">prefers-reduced-motion</span> handling in
        interactive components.
      </>
    ),
  },
  {
    label: 'Diagrams',
    value: (
      <>
        Server-rendered HTML, CSS, and SVG figures backed by typed content
        and native semantic structure. Interactive figures begin with a useful
        static frame and keep their complete explanation available without
        motion or interaction. PAR Assist{' '}
        <a
          href="/blog/enterprise-agentic-ai-framework"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          envelope diagram
        </a>{' '}
        is the current worked example.
      </>
    ),
  },
  {
    label: 'Writing framework',
    value: (
      <>
        Decision guides surface constraints, alternatives, trade-offs,
        walkthroughs, and before-and-after comparisons. Technical notes use
        plain language to explain mechanisms, evidence, boundaries, and
        failure paths.
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
        <Github size={14} />
        rogerthatroach/rogerthatroach.github.io
      </a>
    ),
  },
];

const PRINCIPLES: { heading: string; body: string }[] = [
  {
    heading: 'First principles',
    body: 'Decompose to root causes before writing code. No cargo-culting. If a dependency, pattern, or abstraction can&rsquo;t be justified, remove it.',
  },
  {
    heading: 'Zero waste',
    body: 'Remove unused code and just-in-case abstractions when they are found. Keep the public source focused.',
  },
  {
    heading: 'Copy-first, animation-last',
    body: 'Text does the work. Motion is texture, not substitute. Reduced-motion users see the same content, instantly.',
  },
  {
    heading: 'Measure twice, cut once',
    body: 'Plan, confirm, execute. Type checks and production builds are followed by route, keyboard, and rendered-text review before publication.',
  },
];

const META_TITLE = 'Colophon';
const META_DESCRIPTION =
  'Typefaces, framework, hosting, and design principles behind this site. Craft notes.';
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
          <ArrowLeft size={16} />
          Home
        </Link>

        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Colophon
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What this site is made of.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Typefaces, framework, hosting, and the design principles I kept
            coming back to. Not exhaustive. Just the ones that shaped what
            shipped.
          </p>

          {/* Stack table */}
          <dl className="mt-10 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  {r.label}
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Principles */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Principles
          </h2>
          <ol className="mt-4 space-y-5">
            {PRINCIPLES.map((p, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-5">
                <p className="font-semibold text-text-primary">{p.heading}</p>
                <p
                  className="mt-1 text-sm leading-relaxed text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
