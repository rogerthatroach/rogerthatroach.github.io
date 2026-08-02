import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Update this file every ~6 weeks. Sivers convention: three bullets,
// concrete, present-tense. https://nownownow.com
const UPDATED = 'August 2026';

const BULLETS: { heading: string; body: string }[] = [
  {
    heading: 'Shipping',
    body: 'PAR Assist is the first true agentic AI platform approved for production at the bank. Its pilot launched in April 2026, followed by a full CFO Group launch across all geographies in May. The production system uses a single-agent governance envelope, LangGraph on Postgres, two-stage field-group retrieval, and bounded parallel extraction calls.',
  },
  {
    heading: 'Building',
    body: 'A multi-agent successor is in pilot. Further details will follow in a coordinated publication.',
  },
  {
    heading: 'Thinking about',
    body: 'How production feedback can improve coverage checks without widening the reviewed system boundary.',
  },
];

const META_TITLE = 'Now';
const META_DESCRIPTION = `What I'm focused on, as of ${UPDATED}. Three bullets, updated every few weeks. Sivers convention.`;
const META_PATH = '/now';

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

export default function NowPage() {
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
            Now · updated {UPDATED}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What I&rsquo;m focused on.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            A <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 hover:text-text-primary"
            >/now</a> page, in the Derek Sivers sense: current focus in three bullets, updated every few weeks. Not an activity log. Not a changelog. The answer to &ldquo;what are you up to?&rdquo;
          </p>

          <ol className="mt-10 space-y-6">
            {BULLETS.map((b, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {b.heading}
                </p>
                <p className="mt-2 text-base leading-relaxed text-text-primary">
                  {b.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-xs text-text-tertiary">
            If this is stale &mdash; more than ~6 weeks from the date above
            &mdash; it&rsquo;s my fault. Ping me and I&rsquo;ll refresh it.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
