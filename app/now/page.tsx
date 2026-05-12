import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Update this file every ~6 weeks. Sivers convention: three bullets,
// concrete, present-tense. https://nownownow.com
const UPDATED = 'April 2026';

const BULLETS: { heading: string; body: string }[] = [
  {
    heading: 'Shipping',
    body: 'PAR Assist — the first true agentic framework approved for production at RBC. Pilot live April 2026; enterprise rollout across business lines through Q2/Q3 2026. Single-agent governance envelope, LangGraph on Postgres, two-stage field-group retrieval, N parallel Sonnet-4.5 extraction calls. Early design for v2: multi-agent "skills" composed over the v1 substrate.',
  },
  {
    heading: 'Writing',
    body: 'Sanitized PAR Assist across every surface (formal math post, practitioner rewrite, builder story, case study, homepage, resume, glossary) in one pass after an audit caught a fabricated three-layer RAG claim sitting unchallenged for weeks. PAR is now the benchmark; applying the same pass to Astraeus next.',
  },
  {
    heading: 'Thinking about',
    body: 'How v1 substrates become v2 substrates. The single-agent envelope at PAR Assist was constrained by governance, not by engineering — but the constraint forced a structure (typed MCP tool registry, unified Postgres store, field-group taxonomy) that v2 skills compose on without rewrite. Every envelope you build should make its next envelope cheaper.',
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
