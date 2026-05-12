import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const STACK: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Lumina (LLM gateway)',
    body: (
      <>
        Internal API gateway. Every LLM call from every production AI
        system at RBC routes through Lumina &mdash; authentication, rate
        limiting, audit logging, and provider selection in one layer.
        Behind Lumina:{' '}
        <span className="font-mono">Azure OpenAI</span> (GPT-4o,
        GPT-4.1) and <span className="font-mono">AWS Bedrock</span>{' '}
        (Anthropic Claude &mdash; Sonnet 4.5 in production). Multi-vendor
        by construction; services request capabilities, Lumina picks the
        route.
      </>
    ),
  },
  {
    title: 'OpenShift (OCP pods)',
    body: (
      <>
        Kubernetes-based runtime. Containerized FastAPI services,
        OCP-managed scaling, rollout, secrets, and network policy.
        Every system I lead ships as OCP-deployable artifacts on the
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
        The unified store. Application state, audit logs, embeddings,
        and vector search &mdash; one database, multiple roles.
        PAR Assist runs production RAG on this stack: field-group
        classifier picks groups, two-stage retrieval pulls top-K
        passages from <span className="font-mono">pgvector</span>,
        parallel extraction agents run against Sonnet 4.5 (via
        Lumina), results merge as dict-union, every typed MCP tool
        dispatch logs to the same Postgres instance.
      </>
    ),
  },
  {
    title: 'Postgres-backed audit + observability',
    body: (
      <>
        Structured request logs, per-tool dispatch records, model
        invocation metadata, refusal reasons &mdash; all written to
        Postgres alongside application state. Audit-by-construction,
        not aspirational. Drilling from a final answer back through
        every step is a SQL query, not log archeology.
      </>
    ),
  },
];

const ACTIVITIES: { lead: string; body: string }[] = [
  {
    lead: 'Design AI services that integrate with this stack.',
    body: 'Through Lumina (vendor-agnostic LLM access, rate limit, audit), on OCP (containerized, observable), on Postgres (state + audit + embeddings).',
  },
  {
    lead: 'Define the contract.',
    body: 'What does "an AI service at RBC" look like? Typed APIs, structured logs, audit-by-default, multi-vendor LLM access via Lumina, RAG via pgvector. The architectural pattern is the artifact.',
  },
  {
    lead: 'Hands-on at the complex levels.',
    body: '70% hands-on. LangGraph orchestrator on Postgres. Field-group RAG schema. Typed MCP tool registry. Cython compute paths for the millisecond-latency stuff. Permission cascade for entitlement.',
  },
];

const CAPABILITIES: { surface: string; evidence: React.ReactNode }[] = [
  {
    surface: 'Multi-vendor LLM API integration',
    evidence: (
      <>
        Lumina-fronted Claude (Sonnet 4.5) + OpenAI (GPT-4.1) across{' '}
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
          href="/blog/enterprise-agentic-ai"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          formal post
        </Link>
        ,{' '}
        <a
          href="https://github.com/rogerthatroach/prometheus-multi-agent-retrieval"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          repo
        </a>
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
          formal post
        </Link>
        ,{' '}
        <a
          href="https://github.com/rogerthatroach/astraeus-llm-as-router"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          repo
        </a>
        ).
      </>
    ),
  },
  {
    surface: 'Audit logging / observability',
    evidence: (
      <>
        Typed MCP tool registry &rarr; Postgres audit log (PAR Assist);
        provenance algebra (
        <Link
          href="/blog/commodity-tax-provenance"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          formal post
        </Link>
        ,{' '}
        <a
          href="https://github.com/rogerthatroach/commodity-tax-provenance"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          repo
        </a>
        ).
      </>
    ),
  },
  {
    surface: 'LLM safety / guardrails',
    evidence: (
      <>
        Defense-in-depth: calibration &rarr; AST validation &rarr;
        template fallback (
        <Link
          href="/blog/text-to-sql"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          formal post
        </Link>
        ,{' '}
        <a
          href="https://github.com/rogerthatroach/aegis-guarded-text-to-sql"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:text-text-primary"
        >
          repo
        </a>
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

const REFERENCE_IMPLEMENTATIONS: {
  name: string;
  url: string;
  backs: string;
}[] = [
  {
    name: 'aegis-guarded-text-to-sql',
    url: 'https://github.com/rogerthatroach/aegis-guarded-text-to-sql',
    backs: 'Aegis text-to-SQL — calibration · AST validation · template-bank fallback',
  },
  {
    name: 'commodity-tax-provenance',
    url: 'https://github.com/rogerthatroach/commodity-tax-provenance',
    backs: 'Commodity Tax — typed graph rewrite + provenance algebra',
  },
  {
    name: 'astraeus-llm-as-router',
    url: 'https://github.com/rogerthatroach/astraeus-llm-as-router',
    backs: 'Astraeus — LLM-as-router + 5-stage permission cascade',
  },
  {
    name: 'prometheus-multi-agent-retrieval',
    url: 'https://github.com/rogerthatroach/prometheus-multi-agent-retrieval',
    backs: 'PAR Assist — two-stage retrieval + N parallel extraction + coverage loop',
  },
];

export const metadata: Metadata = {
  title: 'Platform — Harmilap Singh Dhaliwal',
  description:
    'The platform stack underneath the systems — Lumina LLM gateway, OpenShift runtime, PostgreSQL + pgvector, Postgres-backed audit. What I do at this layer, mapped to evidence.',
  alternates: { canonical: '/platform' },
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
            Lumina is owned and operated by another RBC team. The systems
            documented here integrate through it; their architectural shape
            is downstream of what Lumina makes easy or hard.
          </p>

          {/* Capability map */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Capability map
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Each row maps a platform-engineering surface to where I demonstrate
            it &mdash; in production at RBC and in the public reference
            implementations below.
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

          {/* Reference implementations */}
          <h2 className="mt-12 text-xl font-semibold text-text-primary">
            Reference implementations
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Four public Python repos backing the technical posts. Working
            code, synthetic data, reproducible plots, deterministic LLM
            stubs. Each is the public skeleton of one production system,
            small enough to read end-to-end in an hour.
          </p>
          <ul className="mt-5 space-y-3">
            {REFERENCE_IMPLEMENTATIONS.map((r) => (
              <li
                key={r.name}
                className="rounded-lg border border-border-subtle bg-surface/30 p-4"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-sm text-accent underline underline-offset-4 hover:text-text-primary"
                >
                  <Github size={13} />
                  {r.name}
                </a>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {r.backs}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
