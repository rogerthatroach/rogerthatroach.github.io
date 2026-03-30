'use client';

import dynamic from 'next/dynamic';
import VisualizationContainer from '@/components/blog/VisualizationContainer';

const AgenticArchitecturePAR = dynamic(
  () => import('@/components/blog/diagrams/AgenticArchitecturePAR'),
  { ssr: false, loading: () => <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

export default function EnterpriseAgenticAIPost() {
  return (
    <>
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">The problem</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Enterprise organizations run on structured processes. Project approvals, budget requests,
        compliance reviews &mdash; these workflows are high-stakes, document-heavy, and riddled
        with institutional knowledge that lives in people&apos;s heads rather than systems. A single
        approval request might require understanding historical precedents, organizational policies,
        template conventions, and domain-specific terminology &mdash; all while navigating ambiguity
        in what the requester actually needs.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Most teams throw a chatbot at this. Ask a question, get an answer. But that mental model
        breaks immediately. The user doesn&apos;t need a Q&amp;A interface. They need a{' '}
        <em>collaborator</em> &mdash; something that understands where they are in a multi-step
        process, holds context across the entire session, pulls the right reference material at the
        right moment, and resolves contradictions between policy documents without the user knowing
        there was a conflict.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        That&apos;s a fundamentally different problem than retrieval-augmented generation.
        It&apos;s an orchestration problem.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">The constraints</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Three constraints shaped every design decision.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>No sensitive data in LLM context.</strong> In regulated environments, you cannot pass
        operational data through third-party LLM endpoints. Period. This means the LLM handles
        reasoning and routing &mdash; but deterministic code handles data access, computation, and
        document retrieval. The architecture must enforce this separation structurally, not through
        prompting alone.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Multi-document, multi-format retrieval.</strong> Users upload their own documents
        (PDFs, slide decks, Word files, plain text) alongside the system&apos;s policy corpus. A
        naive RAG pipeline that treats everything as flat text chunks will miss structural cues
        &mdash; a table in a PDF, a numbered list in a policy doc, a hierarchical outline in a slide
        deck. The chunking and embedding strategy has to be format-aware.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Stateful, multi-step workflows.</strong> Unlike single-turn Q&amp;A, an approval
        request unfolds over dozens of interactions. The system needs to remember what the user said
        in step 2 when they&apos;re on step 14. It needs to know which template fields have been
        filled, which are conflicting, and which are ambiguous. Vanilla RAG has no concept of
        workflow state.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">The architecture</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        I built this as a <strong>LangGraph agentic system</strong> &mdash; a directed graph of
        specialized nodes, each responsible for one discrete task, orchestrated through a state
        machine that tracks workflow progress.
      </p>

      <VisualizationContainer
        minHeight={500}
        caption="Enterprise agentic AI architecture — LangGraph + MCP tools + multi-layer RAG"
      >
        {() => <AgenticArchitecturePAR />}
      </VisualizationContainer>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">Why LangGraph over vanilla chains</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        LangChain&apos;s sequential chains work for single-turn pipelines. But when you need
        conditional branching (did the user answer the question or ask a clarifying one?), parallel
        execution (fetch policy context while parsing the uploaded document), and persistent state
        across turns &mdash; you need a graph. LangGraph models the workflow as nodes and edges with
        a shared state object that persists across the entire session. Each node reads state, does
        its job, writes back. The graph decides what runs next.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This is the same pattern as deterministic agent orchestration I&apos;ve used in other
        systems: the LLM provides intelligence at specific decision points, but the <em>flow</em>{' '}
        is controlled by code. You get the reasoning capabilities of LLMs without surrendering
        control of execution order.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">MCP tools as the action layer</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Model Context Protocol (MCP) tools handle the actions the agent can take &mdash; and
        critically, they define the <em>boundaries</em> of what the agent is allowed to do. Each
        tool is a typed function with explicit inputs, outputs, and validation:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-2 text-base text-text-secondary">
        <li>
          <strong>Template selection:</strong> Given the user&apos;s intent and organizational
          context, select the correct workflow template from the catalog. This isn&apos;t keyword
          matching &mdash; it&apos;s semantic similarity against template descriptions, filtered by
          business rules.
        </li>
        <li>
          <strong>Field assignment:</strong> Map the user&apos;s natural language input to specific
          template fields. When the user says &ldquo;the budget is roughly 2M over two
          years,&rdquo; the tool decomposes that into annual figures, maps them to the right fields,
          and flags assumptions for user confirmation.
        </li>
        <li>
          <strong>Conflict resolution:</strong> When two sources (say, the user&apos;s uploaded brief
          and an existing policy document) provide contradictory guidance for the same field, the
          tool surfaces the conflict explicitly rather than silently picking one.
        </li>
        <li>
          <strong>Ambiguity detection:</strong> When the system can&apos;t confidently assign a
          value &mdash; because the input is vague, or the field has domain-specific meaning
          &mdash; it flags the ambiguity and generates a targeted clarifying question.
        </li>
      </ul>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The MCP pattern matters because it makes the agent&apos;s capabilities auditable. Every
        action is a tool call with logged inputs and outputs. You can reconstruct exactly what the
        system did and why &mdash; which is non-negotiable in regulated environments.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">Multi-layer RAG: not one pipeline, three</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The naive approach to RAG is one vector store, one retrieval step, one context window. That
        fails here for three reasons: the context sources are heterogeneous, the relevance criteria
        change per step, and the volume exceeds a single context window.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        I designed three retrieval layers, each serving a different purpose:
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Layer 1 &mdash; Conversation history.</strong> Every user message and system response
        is embedded and stored in PostgreSQL (using pgvector). When the user references something
        from earlier in the session &mdash; &ldquo;use the same budget figure from
        before&rdquo; &mdash; the system retrieves the relevant exchange by semantic similarity, not
        just recency. This eliminates the context loss problem that plagues long multi-turn sessions.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Layer 2 &mdash; Uploaded documents.</strong> Users attach their own reference
        materials. These go through a format-aware chunking pipeline: PDFs are parsed with layout
        detection (tables, headers, lists treated as structural units, not arbitrary character
        splits), slide decks preserve slide boundaries, and Word documents respect heading hierarchy.
        Chunks are embedded and indexed per session. Retrieval is scoped to the current user&apos;s
        uploads &mdash; never cross-contaminated.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Layer 3 &mdash; Institutional knowledge.</strong> The policy corpus, historical
        examples, and best practices live in a persistent vector store. But retrieval here
        isn&apos;t just similarity search &mdash; there&apos;s a second RAG layer that selects which{' '}
        <em>prompt template</em> to use for field assignment based on the field type and domain
        context. A financial field gets a different extraction prompt than a timeline field, because
        the reasoning required is different.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">PostgreSQL as the backbone</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        I chose PostgreSQL with pgvector over dedicated vector databases for a deliberate reason: it
        unifies structured metadata (workflow state, template definitions, field schemas, user
        sessions) and vector embeddings in a single transactional store. When the agent needs to
        check &ldquo;which fields are still empty&rdquo; AND &ldquo;what&apos;s the most relevant
        policy for field X&rdquo; &mdash; that&apos;s one query, not a cross-system join. In an
        enterprise environment where every new service adds operational overhead, consolidating on a
        proven, supported database is a pragmatic choice.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">The impact</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The system transforms a process that took days or weeks of drafting &mdash; involving
        back-and-forth emails, policy lookups, and template confusion &mdash; into a guided,
        interactive session where the AI handles retrieval, conflict resolution, and formatting while
        the human focuses on substance.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        But the deeper impact is architectural. This pattern &mdash; LangGraph for orchestration,
        MCP tools for auditable actions, multi-layer RAG for heterogeneous retrieval, PostgreSQL for
        unified state &mdash; is reusable. It applies to any enterprise workflow that involves
        multi-step document creation with institutional knowledge: regulatory filings, investment
        memos, compliance reviews, onboarding packages.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The key insight isn&apos;t any single component. It&apos;s the separation of concerns:{' '}
        <strong>
          LLMs reason, tools act, code controls flow, and the database remembers.
        </strong>{' '}
        That separation is what makes agentic AI viable in regulated enterprise environments
        &mdash; not prompt engineering tricks, but structural guarantees about what the system can
        and cannot do.
      </p>
    </>
  );
}
