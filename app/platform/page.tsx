import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const META_TITLE = 'Platform';
const META_DESCRIPTION =
  'Platform patterns behind production AI: approved model access, containerized runtime, transactional state, vector retrieval, and audit controls.';

const STACK: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Internal multi-provider model gateway',
    body: (
      <>
        Production AI systems route approved LLM calls through an internal
        multi-provider model gateway. It centralizes authentication, rate
        limiting, audit logging, and endpoint selection. Gateway configuration
        routes approved requests to approved foundation-model endpoints.
      </>
    ),
  },
  {
    title: 'OpenShift (OCP pods)',
    body: (
      <>
        Kubernetes-based runtime. Containerized FastAPI services,
        OCP-managed scaling, rollout, secrets, and network policy.
        The bank systems described here ship as OCP-deployable artifacts on the
        standard CI/CD pipeline. OCP itself is operated by GFT
        (Global Functions Technology); my role is consumer-side
        &mdash; designing services to deploy cleanly into the
        pipeline they own.
      </>
    ),
  },
  {
    title: 'PostgreSQL + pgvector',
    body: (
      <>
        Transactional storage supports application state, trace records,
        embeddings, and vector search across separated roles.
        PAR Assist runs production RAG on this stack: a field-group
        classifier selects relevant groups, bounded retrieval pulls
        candidates from <span className="font-mono">pgvector</span>,
        scoped extraction calls feed an ownership-aware merge, and registered
        MCP dispatches are recorded alongside retained workflow state.
      </>
    ),
  },
  {
    title: 'Postgres-backed audit + observability',
    body: (
      <>
        Structured request logs, per-tool dispatch records, model
        invocation metadata, refusal reasons &mdash; written to
        Postgres alongside application state on the registered path. Record
        completeness still depends on successful writes, route coverage, and
        retention. Retained records support SQL-based reconstruction of a
        final answer&rsquo;s normal execution path.
      </>
    ),
  },
];

const ACTIVITIES: { lead: string; body: string }[] = [
  {
    lead: 'Design AI services that integrate with this stack.',
    body: 'Through an internal multi-provider model gateway (approved endpoint access, rate limiting, audit), on OCP (containerized, observable), on Postgres (state + audit + embeddings).',
  },
  {
    lead: 'Define the contract.',
    body: 'What does "an AI service at RBC" look like? Typed APIs, structured logs, explicit audit records, approved foundation-model endpoints through an internal multi-provider gateway, RAG via pgvector. The architectural pattern is the artifact.',
  },
  {
    lead: 'Hands-on at the complex levels.',
    body: '~70% hands-on. LangGraph orchestrator on Postgres. Field-group RAG schema. Typed MCP tool registry. Optimized Cython compute paths. Permission cascade for entitlement.',
  },
];

const CAPABILITIES: { surface: string; evidence: React.ReactNode }[] = [
  {
    surface: 'Multi-provider model API integration',
    evidence: (
      <>
        Approved foundation-model endpoints across{' '}
        <Link
          href="/projects/astraeus"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          Astraeus
        </Link>{' '}
        and{' '}
        <Link
          href="/projects/par-assist"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          PAR Assist
        </Link>
        .
      </>
    ),
  },
  {
    surface: 'Vector database / RAG architecture',
    evidence: (
      <>
        <span className="font-mono">pgvector</span> + two-stage
        field-group retrieval (
        <Link
          href="/blog/enterprise-agentic-ai-architecture"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          technical note
        </Link>
        ).
      </>
    ),
  },
  {
    surface: 'Authentication / authorization',
    evidence: (
      <>
        5-stage permission cascade (
        <Link
          href="/blog/agentic-ai"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          technical note
        </Link>
        ).
      </>
    ),
  },
  {
    surface: 'Audit logging / observability',
    evidence: (
      <>
        Typed MCP tool registry &rarr; Postgres audit log (PAR Assist);
        recorded lineage and configured inspection views (
        <Link
          href="/blog/commodity-tax-provenance"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          technical note
        </Link>
        ).
      </>
    ),
  },
  {
    surface: 'LLM safety / guardrails',
    evidence: (
      <>
        Staged controls: semantic candidate retrieval &rarr; explicit
        clarification &rarr; reviewed templates and parameter binding (
        <Link
          href="/blog/text-to-sql"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          technical note
        </Link>
        ).
      </>
    ),
  },
  {
    surface: 'Model-as-router pattern',
    evidence: (
      <>
        LLM proposes route; deterministic enforcement downstream (
        <Link
          href="/projects/astraeus"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          Astraeus case study
        </Link>
        ).
      </>
    ),
  },
  {
    surface: 'Container runtime',
    evidence: (
      <>
        OpenShift (OCP) &mdash; consumer-side. Services I own deploy
        through GFT&rsquo;s standard CI/CD pipeline; GFT operates the
        runtime.
      </>
    ),
  },
  {
    surface: 'Unified state store',
    evidence: (
      <>
        PostgreSQL &mdash; application state, audit log, and embeddings
        in one system.
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
          <ArrowLeft size={16} />
          Home
        </Link>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Platform
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            The platform underneath.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            The systems on the home page &mdash; PAR Assist, Astraeus,
            Aegis &mdash; don&rsquo;t exist in isolation. They sit on a
            stack that defines what &ldquo;an AI service at RBC&rdquo;
            actually means: how it talks to LLMs, where it runs, how it
            stores state, how it gets audited. This page describes that
            stack and what I do at this layer.
          </p>

          {/* The stack */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            The stack
          </h2>
          <dl className="mt-5 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {STACK.map((s) => (
              <div
                key={s.title}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  {s.title}
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {s.body}
                </dd>
              </div>
            ))}
          </dl>

          {/* What I do at this layer */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            What I do at this layer
          </h2>
          <ol className="mt-4 space-y-5">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-5">
                <p className="font-semibold text-text-primary">{a.lead}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {a.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-lg border border-border-subtle bg-surface/30 p-4 text-sm leading-relaxed text-text-secondary">
            The internal multi-provider model gateway is owned and operated by
            another RBC team. The systems documented here integrate through
            that shared service; my role is on the consumer side.
          </p>

          {/* Capability map */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Capability map
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Each row maps a platform-engineering surface to where I demonstrate
            it in production case studies and technical posts.
          </p>
          <dl className="mt-5 divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle bg-surface/30">
            {CAPABILITIES.map((c) => (
              <div
                key={c.surface}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[14rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
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
