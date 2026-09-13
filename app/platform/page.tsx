import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { COMMODITY_TAX_REVIEW_SUMMARY } from '@/data/canonical';

const META_TITLE = 'Platform';
const META_DESCRIPTION =
  'Application-level patterns across production systems and automation, including bounded model use, governed data access, evidence, and review.';

const PATTERNS: { title: string; body: string }[] = [
  {
    title: 'Shared model access',
    body: 'The applications described here call approved foundation-model endpoints through a shared internal multi-provider gateway. I build those consumer applications and their controls; another team owns the gateway itself.',
  },
  {
    title: 'Managed delivery',
    body: 'Services are packaged and released through the bank’s standard managed runtime and delivery controls. The portfolio describes application behavior, not cluster, network, or deployment topology.',
  },
  {
    title: 'Product-specific state and retrieval',
    body: 'Storage and retrieval differ by product. A workflow may retain application state, use scoped dense retrieval, or preserve record lineage where available; these are design choices, not one universal stack.',
  },
  {
    title: 'Evaluation, evidence, and review',
    body: 'Model-mediated behavior is tested with task-specific evaluation and human review. Traces, logs, coverage checks, and inspection surfaces support investigation, but none is presented as a guarantee on its own.',
  },
];

const CAPABILITIES: { surface: string; evidence: React.ReactNode }[] = [
  {
    surface: 'Bounded agent workflow',
    evidence: (
      <>
        One agent coordinates bounded tool routines, scoped evidence,
        coverage checks, and review in{' '}
        <Link
          href="/projects/funding-request-drafting"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          the AI/LLM drafting platform
        </Link>
        .
      </>
    ),
  },
  {
    surface: 'Governed analytics',
    evidence: (
      <>
        A model routes analytical intent while entitlement-aware deterministic
        code retrieves and calculates within approved scopes in{' '}
        <Link
          href="/projects/workforce-analytics"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          the AI/LLM workforce analytics platform
        </Link>
        .
      </>
    ),
  },
  {
    surface: 'Guarded text-to-SQL',
    evidence: (
      <>
        Candidate retrieval, clarification, reviewed templates, and parameter
        binding constrain database execution in{' '}
        <Link
          href="/projects/financial-peer-benchmarking"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          the financial peer benchmarking platform
        </Link>
        .
      </>
    ),
  },
  {
    surface: 'Lineage and inspection',
    evidence: (
      <>
        {COMMODITY_TAX_REVIEW_SUMMARY} in{' '}
        <Link
          href="/projects/commodity-tax"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          Commodity Tax
        </Link>
        .
      </>
    ),
  },
];

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: '/platform' },
  openGraph: {
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    url: '/platform',
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Platform | Harmilap Singh Dhaliwal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function PlatformPage() {
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

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Engineering patterns
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Application boundaries.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            The systems share a small set of application-level patterns. They
            do not map RBC&rsquo;s internal infrastructure. Shared enterprise
            services are described only far enough to distinguish the
            applications I build from services other teams run.
          </p>

          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Shared constraints, varied implementations
          </h2>
          <dl className="mt-5 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {PATTERNS.map((pattern) => (
              <div
                key={pattern.title}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {pattern.title}
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {pattern.body}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Where the patterns appear
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Implementations vary by system, and not every case study is an AI
            system.
          </p>
          <dl className="mt-5 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {CAPABILITIES.map((c) => (
              <div
                key={c.surface}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[14rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  {c.surface}
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {c.evidence}
                </dd>
              </div>
            ))}
          </dl>

        </div>
      </main>
      <Footer />
    </>
  );
}
