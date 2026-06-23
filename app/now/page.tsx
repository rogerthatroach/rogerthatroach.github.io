import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Update this file every ~6 weeks. Sivers convention: three bullets,
// concrete, present-tense. https://nownownow.com
const UPDATED = 'June 2026';

const BULLETS: { heading: string; body: string }[] = [
  {
    heading: 'Shipping',
    body: 'PAR Assist in production — RBC\'s first bank-wide production AI agent. Pilot live April 2026; deployed bank-wide May 2026. Single-agent governance envelope, LangGraph on Postgres, two-stage field-group retrieval, N parallel Sonnet-4.5 extraction calls.',
  },
  {
    heading: 'Building',
    body: 'The next phase of the drafter: turning PAR Assist\'s single-agent envelope into a config-driven multi-agent framework. The orchestration, typed MCP tool registry, and field-group retrieval stay fixed — what changes for a new business problem is configuration, not code. Solidifying that architecture now, so the next drafting product is a config, not a rebuild.',
  },
  {
    heading: 'Thinking about',
    body: 'Product as configuration. If the drafter architecture is right, a second business problem shouldn\'t need a second system — it should need a different config over the same orchestration, tools, and retrieval. The hard part is keeping the framework general without letting it drift into abstraction. Every envelope you build should make the next one cheaper.',
  },
];

export const metadata: Metadata = {
  title: 'Now — Harmilap Singh Dhaliwal',
  description: `What I'm focused on, as of ${UPDATED}. Three bullets, updated every few weeks. Sivers convention.`,
  alternates: { canonical: '/now' },
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
