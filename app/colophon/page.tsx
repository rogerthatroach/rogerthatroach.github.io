import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const BUILD_DATE = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const ROWS: { label: string; value: React.ReactNode }[] = [
  {
    label: 'Framework',
    value: 'Next.js 14 (app router, static export). React 18. TypeScript in strict mode.',
  },
  {
    label: 'Styling',
    value: 'Tailwind CSS with CSS-variable-backed theme tokens. Dark mode default; warm sakura accents on a wabi-sabi paper palette.',
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
        Framer Motion, gated on{' '}
        <span className="font-mono">prefers-reduced-motion</span>. Every
        scroll-triggered reveal has a static fallback.
      </>
    ),
  },
  {
    label: 'Diagrams',
    value: 'ReactFlow for interactive architecture diagrams. Hand-authored SVG where layout is static. KaTeX pre-rendered at module scope for math.',
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
  {
    label: 'Last built',
    value: <span className="font-mono text-sm">{BUILD_DATE}</span>,
  },
];

const PRINCIPLES: { heading: string; body: string }[] = [
  {
    heading: 'First principles',
    body: 'Decompose to root causes before writing code. No cargo-culting. If a dependency, pattern, or abstraction can&rsquo;t be justified, remove it.',
  },
  {
    heading: 'Zero waste',
    body: 'No dead code. No commented-out blocks. No just-in-case abstractions. Every file earns its place.',
  },
  {
    heading: 'Copy-first, animation-last',
    body: 'Text does the work. Motion is texture, not substitute. Reduced-motion users see the same content, instantly.',
  },
  {
    heading: 'Measure twice, cut once',
    body: 'Plan, confirm, execute. Lighthouse, axe, keyboard-only flow, and screen reader every shippable route.',
  },
];

export const metadata: Metadata = {
  title: 'Colophon — Harmilap Singh Dhaliwal',
  description:
    'Typefaces, framework, hosting, and design principles behind this site. Craft notes.',
  alternates: { canonical: '/colophon' },
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
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
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
