'use client';

import dynamic from 'next/dynamic';
import MathBlock from '@/components/blog/MathBlock';
import InlineEquation from '@/components/blog/InlineEquation';
import TheoremBlock from '@/components/blog/TheoremBlock';
import VisualizationContainer from '@/components/blog/VisualizationContainer';
import { tex } from '@/lib/katex';

const AgenticArchitecturePAR = dynamic(
  () => import('@/components/blog/diagrams/AgenticArchitecturePAR'),
  { ssr: false, loading: () => <div className="flex h-[600px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

export default function EnterpriseAgenticAIPost() {
  return (
    <>
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">1. Introduction</h2>
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
        It&apos;s an orchestration problem. This paper formalizes the architectural pattern that
        solves it.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">2. Problem Formulation</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.1 System Requirements</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Let <InlineEquation html={tex("\\mathcal{W}")} /> denote the space of enterprise
        workflows (multi-step document creation processes),{' '}
        <InlineEquation html={tex("\\mathcal{U}")} /> the space of user utterances,{' '}
        <InlineEquation html={tex("\\mathcal{D}")} /> the heterogeneous document corpus
        (policies, templates, historical examples, user uploads), and{' '}
        <InlineEquation html={tex("\\mathcal{S}")} /> the state space tracking workflow
        progress. We seek a system <InlineEquation html={tex("\\mathcal{F}")} /> that
        guides users through <InlineEquation html={tex("\\mathcal{W}")} /> while satisfying
        four formal requirements:
      </p>

      <TheoremBlock variant="definition" number={1} title="System Requirements">
        <p className="mb-2">
          <strong>Requirement 1 (Context Isolation).</strong> The LLM component{' '}
          <InlineEquation html={tex("\\mathcal{L}")} /> must never observe sensitive
          operational data <InlineEquation html={tex("\\mathcal{D}_{\\text{sensitive}}")} />:
        </p>
        <MathBlock html={tex("\\mathcal{E}(\\mathcal{L}) \\cap \\mathcal{D}_{\\text{sensitive}} = \\emptyset", true)} />
        <p className="mb-2">
          <strong>Requirement 2 (Stateful Orchestration).</strong> The system must maintain
          workflow state <InlineEquation html={tex("s \\in \\mathcal{S}")} /> across
          an unbounded number of interaction turns{' '}
          <InlineEquation html={tex("t \\in \\{1, 2, \\ldots\\}")} />:
        </p>
        <MathBlock html={tex("s_{t+1} = \\delta(s_t, u_t, a_t) \\quad \\text{where } \\delta: \\mathcal{S} \\times \\mathcal{U} \\times \\mathcal{A} \\to \\mathcal{S}", true)} />
        <p className="mb-2">
          <strong>Requirement 3 (Heterogeneous Retrieval).</strong> Retrieval must respect
          document structure, source provenance, and per-step relevance criteria:
        </p>
        <MathBlock html={tex("\\text{retrieve}(q, s_t) = \\bigoplus_{l=1}^{L} R_l(q, s_t, \\mathcal{D}_l) \\quad \\text{where each } R_l \\text{ has distinct scoping rules}", true)} />
        <p>
          <strong>Requirement 4 (Auditability).</strong> Every system action must be a logged,
          typed tool invocation with reconstructible inputs and outputs:
        </p>
        <MathBlock html={tex("\\forall a \\in \\mathcal{A}: a = \\text{Tool}_k(\\text{input}_k) \\mapsto \\text{output}_k \\quad \\text{with } (k, \\text{input}_k, \\text{output}_k) \\in \\text{AuditLog}", true)} />
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.2 Why Monolithic Architectures Fail</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        A monolithic LLM approach <InlineEquation html={tex("\\mathcal{F}_{\\text{mono}}(u_t) = \\mathcal{L}(u_t, \\mathcal{D}, s_t)")} /> violates
        Requirement 1 by construction (data enters the LLM context), lacks Requirement 2 (no
        persistent state machine), and cannot satisfy Requirement 4 (actions are implicit in
        generated text, not typed invocations). Sequential chain architectures address none of
        these: they are stateless, single-turn, and unauditable.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">3. Architecture: LangGraph Agentic System</h2>

      <TheoremBlock variant="definition" number={2} title="Agentic Workflow System">
        <p>
          An agentic workflow system is a directed graph{' '}
          <InlineEquation html={tex("G = (V, E, \\mathcal{S}, \\delta)")} /> where:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <InlineEquation html={tex("V = \\{v_{\\text{parse}}, v_{\\text{route}}, v_{\\text{execute}}, v_{\\text{respond}}\\}")} /> are
            processing nodes
          </li>
          <li>
            <InlineEquation html={tex("E \\subseteq V \\times V")} /> are directed edges
            (conditional transitions)
          </li>
          <li>
            <InlineEquation html={tex("\\mathcal{S}")} /> is the shared persistent state space
          </li>
          <li>
            <InlineEquation html={tex("\\delta: \\mathcal{S} \\times \\mathcal{U} \\times \\mathcal{A} \\to \\mathcal{S}")} /> is
            the state transition function
          </li>
        </ul>
        <p className="mt-2">
          Each node <InlineEquation html={tex("v_i")} /> reads from{' '}
          <InlineEquation html={tex("\\mathcal{S}")} />, performs its computation, and writes
          back. The graph controller determines which node executes next based on the current
          state.
        </p>
      </TheoremBlock>

      <VisualizationContainer
        minHeight={600}
        caption="Figure 1: Enterprise agentic AI architecture — LangGraph orchestration, MCP tools, multi-layer RAG, PostgreSQL backbone. Hover any node for details."
      >
        {() => <AgenticArchitecturePAR />}
      </VisualizationContainer>

      <TheoremBlock variant="proposition" number={1} title="State Persistence Across Turns">
        <p>
          For an agentic workflow system <InlineEquation html={tex("G")} /> with state
          transition function <InlineEquation html={tex("\\delta")} />, the workflow
          state <InlineEquation html={tex("s_t")} /> at turn{' '}
          <InlineEquation html={tex("t")} /> encodes the complete history of field
          assignments, conflicts, and ambiguities:
        </p>
        <MathBlock html={tex("s_t = \\delta(s_{t-1}, u_t, a_t) = \\delta(\\ldots\\delta(\\delta(s_0, u_1, a_1), u_2, a_2)\\ldots, u_t, a_t)", true)} />
        <p>
          The user&apos;s reference at turn <InlineEquation html={tex("t")} /> to information from
          turn <InlineEquation html={tex("j < t")} /> is resolved by querying{' '}
          <InlineEquation html={tex("s_t")} /> directly, without replaying the history.
        </p>
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          By induction on <InlineEquation html={tex("t")} />. Base
          case: <InlineEquation html={tex("s_0")} /> is the initial state (empty template,
          no fields assigned). Inductive step: if <InlineEquation html={tex("s_{t-1}")} /> encodes
          all information from turns <InlineEquation html={tex("1, \\ldots, t-1")} />, then{' '}
          <InlineEquation html={tex("s_t = \\delta(s_{t-1}, u_t, a_t)")} /> incorporates
          turn <InlineEquation html={tex("t")} />&apos;s contribution via the transition function.
          Since <InlineEquation html={tex("\\delta")} /> is deterministic and the state space{' '}
          <InlineEquation html={tex("\\mathcal{S}")} /> includes all field values, conflict records,
          and assignment metadata, no information is lost across turns.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.1 Why LangGraph Over Vanilla Chains</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        LangChain&apos;s sequential chains implement a linear composition{' '}
        <InlineEquation html={tex("f = f_n \\circ \\cdots \\circ f_1")} />. This fails for
        workflows requiring conditional branching (did the user answer the question or ask a
        clarifying one?), parallel execution (fetch policy context while parsing the uploaded
        document), and persistent state across turns. LangGraph models the workflow as a directed
        graph with a shared state object, enabling:
      </p>
      <MathBlock html={tex("v_{\\text{next}} = \\text{Router}(s_t) = \\begin{cases} v_{\\text{clarify}} & \\text{if ambiguous}(s_t) \\\\ v_{\\text{resolve}} & \\text{if conflict}(s_t) \\\\ v_{\\text{assign}} & \\text{if field\\_pending}(s_t) \\\\ v_{\\text{respond}} & \\text{if complete}(s_t) \\end{cases}", true)} />

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.2 MCP Tools as the Action Layer</h3>

      <TheoremBlock variant="definition" number={3} title="MCP Tool Contract">
        <p>
          A Model Context Protocol tool <InlineEquation html={tex("T_k")} /> is a typed function:
        </p>
        <MathBlock html={tex("T_k: \\text{Input}_k \\to \\text{Output}_k \\quad \\text{where } \\text{Input}_k, \\text{Output}_k \\text{ are validated schemas}", true)} />
        <p>
          with the invariant that every invocation produces an audit record{' '}
          <InlineEquation html={tex("(k, \\text{input}_k, \\text{output}_k, \\text{timestamp})")} />.
          The tool set <InlineEquation html={tex("\\mathcal{T} = \\{T_{\\text{template}}, T_{\\text{field}}, T_{\\text{conflict}}, T_{\\text{ambiguity}}\\}")} /> defines
          the complete action boundary of the agent.
        </p>
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Four tools comprise the action layer:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-2 text-base text-text-secondary">
        <li>
          <strong><InlineEquation html={tex("T_{\\text{template}}")} /> (Template
          selection):</strong> Semantic similarity against template descriptions, filtered by
          business rules. Not keyword matching.
        </li>
        <li>
          <strong><InlineEquation html={tex("T_{\\text{field}}")} /> (Field
          assignment):</strong> Decomposes natural language into structured template fields with
          type validation and assumption flagging.
        </li>
        <li>
          <strong><InlineEquation html={tex("T_{\\text{conflict}}")} /> (Conflict
          resolution):</strong> When sources provide contradictory guidance for the same field,
          surfaces the conflict explicitly rather than silently resolving.
        </li>
        <li>
          <strong><InlineEquation html={tex("T_{\\text{ambiguity}}")} /> (Ambiguity
          detection):</strong> Flags low-confidence assignments and generates targeted clarifying
          questions.
        </li>
      </ul>

      <TheoremBlock variant="theorem" number={1} title="Action Boundary Enforcement">
        <p>
          If the agent&apos;s action space is restricted to{' '}
          <InlineEquation html={tex("\\mathcal{A} = \\{T_k(\\cdot) \\mid T_k \\in \\mathcal{T}\\}")} />,
          then no action can occur outside the defined tool set:
        </p>
        <MathBlock html={tex("\\forall a \\in \\mathcal{A},\\; \\exists k: a = T_k(\\text{input}_k) \\implies a \\in \\text{AuditLog}", true)} />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          By construction. The LangGraph execution engine dispatches actions exclusively through
          the tool registry <InlineEquation html={tex("\\mathcal{T}")} />. Each tool{' '}
          <InlineEquation html={tex("T_k")} /> validates its input against{' '}
          <InlineEquation html={tex("\\text{Input}_k")} /> before execution and logs the
          complete invocation record. No code path exists for the agent to perform an action
          outside <InlineEquation html={tex("\\mathcal{T}")} /> &mdash; the graph controller
          only invokes registered tools. Since logging is a side effect of invocation (not a
          post-hoc process), every action is auditable.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.3 Multi-Layer RAG</h3>

      <TheoremBlock variant="definition" number={4} title="Layered Retrieval Function">
        <p>
          The retrieval function <InlineEquation html={tex("R")} /> is a composition of{' '}
          <InlineEquation html={tex("L = 3")} /> scoped retrieval layers:
        </p>
        <MathBlock html={tex("R(q, s_t) = \\bigoplus_{l=1}^{3} R_l(q, s_t, \\mathcal{D}_l)", true)} />
        <p>where:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <InlineEquation html={tex("R_1")} />: Conversation history retrieval (session-scoped,
            semantic similarity over <InlineEquation html={tex("\\mathcal{D}_1 = \\{(u_j, a_j)\\}_{j < t}")} />)
          </li>
          <li>
            <InlineEquation html={tex("R_2")} />: Uploaded document retrieval (user-scoped,
            format-aware chunking over <InlineEquation html={tex("\\mathcal{D}_2 = \\text{uploads}(u)")} />)
          </li>
          <li>
            <InlineEquation html={tex("R_3")} />: Institutional knowledge retrieval (global scope,
            policy corpus <InlineEquation html={tex("\\mathcal{D}_3")} /> with prompt template
            selection)
          </li>
        </ul>
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Each layer uses embedding similarity as the retrieval mechanism. For a query{' '}
        <InlineEquation html={tex("q")} /> and document chunk{' '}
        <InlineEquation html={tex("d_i")} />, retrieval is:
      </p>
      <MathBlock html={tex("\\text{sim}(q, d_i) = \\frac{\\mathbf{e}_q \\cdot \\mathbf{e}_{d_i}}{\\|\\mathbf{e}_q\\| \\|\\mathbf{e}_{d_i}\\|} \\geq \\tau_l \\quad \\text{where } \\mathbf{e} = \\text{embed}(\\cdot) \\in \\mathbb{R}^d", true)} />

      <TheoremBlock variant="proposition" number={2} title="Retrieval Isolation">
        <p>
          Layer 2 retrieval is user-scoped: for users{' '}
          <InlineEquation html={tex("u_1 \\neq u_2")} />,
        </p>
        <MathBlock html={tex("R_2(q, s_t, \\mathcal{D}_2(u_1)) \\cap R_2(q, s_t, \\mathcal{D}_2(u_2)) = \\emptyset", true)} />
        <p>
          No cross-contamination occurs between user sessions. This is enforced by session-scoped
          embedding indices in PostgreSQL &mdash; each user&apos;s chunks are indexed in a
          partition keyed by session ID.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.4 PostgreSQL as Unified Backbone</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        PostgreSQL with pgvector unifies structured metadata (workflow state, template definitions,
        field schemas, user sessions) and vector embeddings in a single transactional store. The
        critical advantage: when the agent needs to check{' '}
        <InlineEquation html={tex("\\text{empty\\_fields}(s_t)")} /> AND{' '}
        <InlineEquation html={tex("\\text{relevant\\_policy}(\\text{field}_j)")} />,
        that&apos;s one query &mdash; not a cross-system join:
      </p>
      <MathBlock html={tex("\\text{context}(\\text{field}_j, s_t) = \\sigma_{\\text{field}=j}(\\mathcal{S}) \\bowtie \\text{top}_k(R_3(\\text{field}_j.\\text{description}, s_t, \\mathcal{D}_3))", true)} />

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">4. Context Isolation Guarantee</h2>

      <TheoremBlock variant="theorem" number={2} title="Context Isolation">
        <p>
          In the agentic workflow system <InlineEquation html={tex("G")} />, the LLM
          component <InlineEquation html={tex("\\mathcal{L}")} /> (used at{' '}
          <InlineEquation html={tex("v_{\\text{parse}}")} /> and{' '}
          <InlineEquation html={tex("v_{\\text{route}}")} />) receives only user
          utterances <InlineEquation html={tex("u_t")} />, schema metadata{' '}
          <InlineEquation html={tex("\\mathcal{M}")} />, and tool output
          summaries <InlineEquation html={tex("\\text{summary}(a_t)")} />. Sensitive data{' '}
          <InlineEquation html={tex("\\mathcal{D}_{\\text{sensitive}}")} /> never enters the LLM
          context:
        </p>
        <MathBlock html={tex("\\mathcal{E}(\\mathcal{L}) = \\bigcup_t \\{u_t\\} \\cup \\{\\mathcal{M}\\} \\cup \\{\\text{summary}(a_t)\\}", true)} />
        <MathBlock html={tex("\\mathcal{E}(\\mathcal{L}) \\cap \\mathcal{D}_{\\text{sensitive}} = \\emptyset", true)} />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          By the architectural separation in <InlineEquation html={tex("G")} />. The LLM
          operates only at nodes <InlineEquation html={tex("v_{\\text{parse}}")} /> and{' '}
          <InlineEquation html={tex("v_{\\text{route}}")} />, which receive{' '}
          <InlineEquation html={tex("(u_t, \\mathcal{M})")} /> as input. All data access occurs
          within MCP tools <InlineEquation html={tex("\\mathcal{T}")} />, which execute in a
          separate context with database credentials that the LLM process does not hold. Tool
          outputs are post-processed into summaries before being written to the shared state{' '}
          <InlineEquation html={tex("\\mathcal{S}")} /> that the LLM can read. Since{' '}
          <InlineEquation html={tex("\\mathcal{M}")} /> contains only schema structure (table
          names, field types, template descriptions) and no data values, and summaries contain
          only assignment status (not underlying data), the intersection with{' '}
          <InlineEquation html={tex("\\mathcal{D}_{\\text{sensitive}}")} /> is empty.
        </p>
      </TheoremBlock>

      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">5. Impact and Reusability</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The system transforms a process that took days or weeks of drafting &mdash; involving
        back-and-forth emails, policy lookups, and template confusion &mdash; into a guided,
        interactive session where the AI handles retrieval, conflict resolution, and formatting while
        the human focuses on substance.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The deeper impact is architectural. This pattern &mdash; LangGraph for orchestration, MCP
        tools for auditable actions, multi-layer RAG for heterogeneous retrieval, PostgreSQL for
        unified state &mdash; is reusable. It applies to any enterprise workflow involving
        multi-step document creation with institutional knowledge: regulatory filings, investment
        memos, compliance reviews, onboarding packages.
      </p>

      <TheoremBlock variant="remark">
        <p>
          The key insight is the separation of concerns. Define{' '}
          <InlineEquation html={tex("\\mathcal{F} = \\mathcal{L} \\circ \\mathcal{T} \\circ \\mathcal{R} \\circ \\mathcal{S}")} /> where
          each component has a distinct responsibility:
        </p>
        <MathBlock html={tex("\\underbrace{\\mathcal{L}}_{\\text{LLMs reason}} \\circ \\underbrace{\\mathcal{T}}_{\\text{tools act}} \\circ \\underbrace{\\mathcal{R}}_{\\text{code controls flow}} \\circ \\underbrace{\\mathcal{S}}_{\\text{database remembers}}", true)} />
        <p>
          That separation is what makes agentic AI viable in regulated enterprise environments
          &mdash; not prompt engineering tricks, but structural guarantees about what the system
          can and cannot do.
        </p>
      </TheoremBlock>
    </>
  );
}
