'use client';

import dynamic from 'next/dynamic';
import MathBlock from '@/components/blog/MathBlock';
import InlineEquation from '@/components/blog/InlineEquation';
import TheoremBlock from '@/components/blog/TheoremBlock';
import VisualizationContainer from '@/components/blog/VisualizationContainer';

const AgenticArchitecture = dynamic(
  () => import('@/components/blog/diagrams/AgenticArchitecture'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

const SubAgentExecution = dynamic(
  () => import('@/components/blog/diagrams/SubAgentExecution'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

const EPMTranslation = dynamic(
  () => import('@/components/blog/diagrams/EPMTranslation'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

const FullSystemArchitecture = dynamic(
  () => import('@/components/blog/diagrams/FullSystemArchitecture'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

const EventModelAnimation = dynamic(
  () => import('@/components/blog/diagrams/EventModelAnimation'),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div> }
);

export default function AgenticAIPost() {
  return (
    <>
      {/* ================================================================ */}
      {/* Abstract                                                         */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">Abstract</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Large Language Models (LLMs) have demonstrated remarkable capability in natural language
        understanding, yet their probabilistic nature and opaque reasoning present fundamental
        challenges for enterprise financial systems requiring deterministic correctness,
        fine-grained access control, and regulatory auditability. This paper presents an
        architectural pattern &mdash; <strong>LLM-as-Router</strong> &mdash; that leverages
        language model strengths (intent classification, semantic parsing) while explicitly
        preventing their weaknesses (unreliable computation, data leakage) from affecting system
        outputs. We formalize the separation of concerns between an intent detection layer and a
        deterministic computation layer, prove that this architecture preserves data
        confidentiality under defined threat models, and describe a production implementation
        processing ~40,000 employee transits across ~9,000 organizational rollups with
        millisecond-level query response for a major bank&apos;s CFO Group.
      </p>

      {/* Hero Diagram */}
      <VisualizationContainer minHeight={500} caption="Full System Architecture: Two-layer LLM-as-Router pattern with parallel sub-agents and entitlement enforcement">
        {(isVisible) => <FullSystemArchitecture />}
      </VisualizationContainer>

      {/* ================================================================ */}
      {/* 1. Introduction                                                  */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">1. Introduction</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Enterprise AI systems operating on sensitive financial data face a trilemma: they must
        be <em>intelligent</em> (understand natural language queries), <em>correct</em> (produce
        deterministic, auditable results), and <em>secure</em> (enforce fine-grained access
        controls). Existing LLM-powered analytics tools typically sacrifice correctness and
        security for intelligence, passing sensitive data through model context windows and
        relying on probabilistic inference for computation [1, 2].
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        We argue that this tradeoff is architectural, not fundamental. By decomposing the system
        into two layers with distinct computational properties &mdash; a stateless, data-free
        intent detection layer powered by an LLM, and a stateful, data-rich deterministic
        computation layer powered by conventional software &mdash; we achieve all three
        properties simultaneously.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The contributions of this paper are:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-secondary">
        <li>A formal definition of the <strong>LLM-as-Router</strong> architecture pattern for enterprise AI</li>
        <li>A proof that the architecture preserves data confidentiality under a defined threat model</li>
        <li>A formalization of EPM-to-SQL entitlement translation as a lattice-preserving mapping</li>
        <li>A production validation at enterprise scale</li>
      </ol>

      {/* ================================================================ */}
      {/* 2. Problem Formulation                                           */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">2. Problem Formulation</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.1 System Requirements</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Let <InlineEquation tex="\\mathcal{Q}" /> denote the space of natural language queries,{' '}
        <InlineEquation tex="\\mathcal{D}" /> the space of sensitive enterprise data, and{' '}
        <InlineEquation tex="\\mathcal{R}" /> the space of formatted responses. We seek a
        function <InlineEquation tex="f: \\mathcal{Q} \\rightarrow \\mathcal{R}" /> such that:
      </p>

      <TheoremBlock variant="definition" number={1} title="System Requirements">
        <p className="mb-3">
          <strong>Requirement 1 (Semantic Understanding).</strong>{' '}
          <InlineEquation tex="f" /> must map semantically equivalent queries to equivalent
          responses:
        </p>
        <MathBlock tex="q_1 \\equiv_{\\text{sem}} q_2 \\implies f(q_1) = f(q_2)" />
        <p className="mb-3">
          <strong>Requirement 2 (Deterministic Correctness).</strong> For any query{' '}
          <InlineEquation tex="q" /> with a well-defined answer{' '}
          <InlineEquation tex="r^*" /> derivable from <InlineEquation tex="\\mathcal{D}" />,
          the system must return exactly <InlineEquation tex="r^*" />:
        </p>
        <MathBlock tex="f(q) = r^* = g(\\mathcal{D}, \\phi(q))" />
        <p className="mb-1 text-xs text-text-tertiary">
          where <InlineEquation tex="\\phi(q)" /> is the structured representation
          of <InlineEquation tex="q" /> and <InlineEquation tex="g" /> is a deterministic
          computation function.
        </p>
        <p className="mb-3 mt-3">
          <strong>Requirement 3 (Data Confidentiality).</strong> The LLM
          component <InlineEquation tex="\\mathcal{L}" /> must never observe any element
          of <InlineEquation tex="\\mathcal{D}" />:
        </p>
        <MathBlock tex="\\mathcal{L}.\\text{context} \\cap \\mathcal{D} = \\emptyset" />
        <p className="mb-3">
          <strong>Requirement 4 (Entitlement Enforcement).</strong> For a user{' '}
          <InlineEquation tex="u" /> with permission set <InlineEquation tex="P(u)" />,
          the visible data must be restricted:
        </p>
        <MathBlock tex="f_u(q) = g(\\mathcal{D}|_{P(u)}, \\phi(q))" />
        <p className="text-xs text-text-tertiary">
          where <InlineEquation tex="\\mathcal{D}|_{P(u)}" /> denotes{' '}
          <InlineEquation tex="\\mathcal{D}" /> filtered to the subset authorized
          for <InlineEquation tex="u" />.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">2.2 Why Monolithic LLM Architectures Fail</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        A monolithic architecture passes both the query and relevant data into a single LLM call:
      </p>
      <MathBlock tex="f_{\\text{mono}}(q) = \\mathcal{L}(q, \\mathcal{D}_{\\text{relevant}})" />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This violates Requirement 3 by construction. It also violates Requirement 2 because LLM
        outputs are stochastic &mdash; the same prompt produces different outputs across
        invocations [3]. Temperature zero does not guarantee determinism across model versions or
        API updates.
      </p>

      <VisualizationContainer minHeight={400} caption="Figure 1: Monolithic vs. LLM-as-Router architecture comparison. The monolithic approach passes data through the LLM context, violating confidentiality and determinism guarantees.">
        {(isVisible) => <AgenticArchitecture />}
      </VisualizationContainer>

      {/* ================================================================ */}
      {/* 3. Architecture: LLM-as-Router                                   */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">3. Architecture: LLM-as-Router</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.1 Formal Definition</h3>

      <TheoremBlock variant="definition" number={2} title="LLM-as-Router Architecture">
        <p className="mb-2">
          A system <InlineEquation tex="\\mathcal{S}" /> implements the LLM-as-Router pattern
          if it decomposes into two components:
        </p>
        <MathBlock tex="\\mathcal{S} = \\mathcal{L}_{\\text{route}} \\circ \\mathcal{A}_{\\text{compute}}" />
        <p className="mb-1">where:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <InlineEquation tex="\\mathcal{L}_{\\text{route}}: \\mathcal{Q} \\rightarrow \\mathcal{I}" />{' '}
            is a <strong>routing function</strong> implemented by an LLM, mapping natural
            language queries to a structured intent space <InlineEquation tex="\\mathcal{I}" />
          </li>
          <li>
            <InlineEquation tex="\\mathcal{A}_{\\text{compute}}: \\mathcal{I} \\times \\mathcal{D} \\rightarrow \\mathcal{R}" />{' '}
            is a <strong>computation function</strong> implemented by deterministic agents,
            mapping intents and data to responses
          </li>
          <li>
            <InlineEquation tex="\\mathcal{L}_{\\text{route}}" /> receives no element
            of <InlineEquation tex="\\mathcal{D}" /> as input
          </li>
        </ul>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.2 Intent Space</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The intent space <InlineEquation tex="\\mathcal{I}" /> is a structured schema:
      </p>
      <MathBlock tex="\\mathcal{I} = \\{(c, \\theta, \\tau, \\omega) \\mid c \\in \\mathcal{C},\\; \\theta \\in \\Theta,\\; \\tau \\in \\mathcal{T},\\; \\omega \\in \\Omega\\}" />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">where:</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          <InlineEquation tex="c \\in \\mathcal{C} = \\{\\text{headcount}, \\text{cost}, \\text{positions}\\}" />{' '}
          is the <strong>domain class</strong>
        </li>
        <li>
          <InlineEquation tex="\\theta \\in \\Theta" /> is the <strong>query parameter set</strong>{' '}
          (time range, organizational scope, comparison type)
        </li>
        <li>
          <InlineEquation tex="\\tau \\in \\mathcal{T}" /> is the <strong>temporal specification</strong>{' '}
          (point-in-time, range, trend)
        </li>
        <li>
          <InlineEquation tex="\\omega \\in \\Omega" /> is the <strong>output format</strong>{' '}
          (table, chart, summary, report)
        </li>
      </ul>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The intent space is finite and enumerable, which is what makes the downstream agents
        deterministic &mdash; they handle a known set of structured inputs, not open-ended
        natural language.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">3.3 Sub-Agent Orchestration</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The computation layer consists of <InlineEquation tex="k" /> specialized sub-agents{' '}
        <InlineEquation tex="\\{A_1, A_2, \\ldots, A_k\\}" />, each handling a partition of the
        domain class space:
      </p>
      <MathBlock tex="\\mathcal{A}_{\\text{compute}}(i, \\mathcal{D}) = A_{c(i)}(\\theta(i), \\tau(i), \\omega(i), \\mathcal{D}|_{P(u)})" />
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        In the production system, <InlineEquation tex="k = 3" />: an EPM/cost agent, a
        headcount agent, and an open positions agent. These execute in parallel:
      </p>
      <MathBlock tex="\\mathcal{A}_{\\text{compute}} = A_1 \\| A_2 \\| A_3" />

      <TheoremBlock variant="proposition" number={1} title="Parallel Correctness">
        <p>
          If each sub-agent <InlineEquation tex="A_j" /> is deterministic and operates on
          disjoint data partitions, then parallel execution preserves correctness:
        </p>
        <MathBlock tex="\\forall j \\neq j': \\mathcal{D}_j \\cap \\mathcal{D}_{j'} = \\emptyset \\implies (A_1 \\| A_2 \\| A_3)(i, \\mathcal{D}) = A_{c(i)}(i, \\mathcal{D}_{c(i)})" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          Since each agent reads only from its own data partition and writes only to its own
          output buffer, there are no read-write conflicts. The routing
          function <InlineEquation tex="c(i)" /> selects exactly one agent per query. The other
          agents either idle (no matching intent) or handle independent concurrent queries. By
          the absence of shared mutable state, parallel execution is equivalent to serial
          execution of the selected agent. <InlineEquation tex="\\square" />
        </p>
      </TheoremBlock>

      <VisualizationContainer minHeight={400} caption="Figure 2: Sub-agent parallel execution. Select a query type to see how the router dispatches to the corresponding agent track while others remain idle.">
        {(isVisible) => <SubAgentExecution />}
      </VisualizationContainer>

      {/* ================================================================ */}
      {/* 4. Data Confidentiality Guarantee                                */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">4. Data Confidentiality Guarantee</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">4.1 Threat Model</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        We consider a threat model where the LLM provider is an honest-but-curious adversary: it
        faithfully processes inputs but may retain or leak context window contents. This is the
        standard concern for enterprise LLM deployment [4].
      </p>

      <TheoremBlock variant="definition" number={3} title="Context Exposure Set">
        <p>
          The context exposure set <InlineEquation tex="\\mathcal{E}(\\mathcal{L})" /> of an
          LLM component <InlineEquation tex="\\mathcal{L}" /> is the union of all inputs
          provided to <InlineEquation tex="\\mathcal{L}" /> across all invocations:
        </p>
        <MathBlock tex="\\mathcal{E}(\\mathcal{L}) = \\bigcup_{t} \\text{input}_t(\\mathcal{L})" />
      </TheoremBlock>

      <TheoremBlock variant="theorem" number={1} title="Data Confidentiality">
        <p>
          In an LLM-as-Router architecture{' '}
          <InlineEquation tex="\\mathcal{S} = \\mathcal{L}_{\\text{route}} \\circ \\mathcal{A}_{\\text{compute}}" />,
          if <InlineEquation tex="\\mathcal{L}_{\\text{route}}" /> receives only elements
          of <InlineEquation tex="\\mathcal{Q}" /> (natural language queries) and system
          prompts <InlineEquation tex="\\mathcal{P}" /> (containing schema metadata but no data
          values), then:
        </p>
        <MathBlock tex="\\mathcal{E}(\\mathcal{L}_{\\text{route}}) \\cap \\mathcal{D} = \\emptyset" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p className="mb-2">
          By construction, <InlineEquation tex="\\mathcal{L}_{\\text{route}}: \\mathcal{Q} \\rightarrow \\mathcal{I}" />.
          The input to <InlineEquation tex="\\mathcal{L}_{\\text{route}}" /> at each invocation
          is <InlineEquation tex="(q_t, p)" /> where <InlineEquation tex="q_t \\in \\mathcal{Q}" />{' '}
          and <InlineEquation tex="p \\in \\mathcal{P}" />. Since <InlineEquation tex="\\mathcal{Q}" />{' '}
          contains only user-generated natural language and <InlineEquation tex="\\mathcal{P}" />{' '}
          contains only structural metadata (table names, column types, domain labels &mdash; not
          data values), and <InlineEquation tex="\\mathcal{D}" /> contains only data values
          (employee records, financial figures, organizational assignments):
        </p>
        <MathBlock tex="\\mathcal{E}(\\mathcal{L}_{\\text{route}}) = \\bigcup_t \\{q_t\\} \\cup \\{p\\} \\subseteq \\mathcal{Q} \\cup \\mathcal{P}" />
        <p>
          Since <InlineEquation tex="(\\mathcal{Q} \\cup \\mathcal{P}) \\cap \\mathcal{D} = \\emptyset" />{' '}
          by the domain separation assumption, the result follows. <InlineEquation tex="\\square" />
        </p>
      </TheoremBlock>

      <TheoremBlock variant="corollary" number={1}>
        <p>
          Even if the LLM provider retains all context window contents indefinitely, no sensitive
          enterprise data is exposed.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">4.2 Boundary Enforcement</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The confidentiality guarantee holds only if the architectural boundary is enforced &mdash;
        i.e., no code path exists that passes data values to the LLM. In the production system,
        this is enforced by:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-secondary">
        <li>
          <strong>Interface typing:</strong> The routing function&apos;s input type signature
          accepts only{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            (query: string, system_prompt: string)
          </code>{' '}
          &mdash; no data parameters exist in the function signature
        </li>
        <li>
          <strong>Network isolation:</strong> The LLM API call originates from a service that has
          no database credentials and no access to data stores
        </li>
        <li>
          <strong>Audit logging:</strong> Every LLM invocation is logged with its full input,
          enabling automated verification
          that <InlineEquation tex="\\mathcal{E}(\\mathcal{L}) \\cap \\mathcal{D} = \\emptyset" />
        </li>
      </ol>

      {/* ================================================================ */}
      {/* 5. Entitlement Model: EPM-to-SQL Translation                     */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">5. Entitlement Model: EPM-to-SQL Translation</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">5.1 The Translation Problem</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Enterprise Performance Management (EPM) systems enforce access control through
        multidimensional cube permissions &mdash; a user may see certain intersections of
        dimensions (e.g., &ldquo;Risk division &times; North America &times; FY2025&rdquo;) but
        not others. SQL databases enforce access through row-level predicates. Translating between
        these models is non-trivial because cube permissions are <em>conjunctive</em> over
        dimensions while SQL predicates are <em>disjunctive</em> over rows.
      </p>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">5.2 Formal Model</h3>

      <TheoremBlock variant="definition" number={4} title="EPM Permission Structure">
        <p>
          An EPM permission set for user <InlineEquation tex="u" /> is a set of authorized
          dimension intersections:
        </p>
        <MathBlock tex="P(u) = \\{(d_1^{(j)}, d_2^{(j)}, \\ldots, d_n^{(j)})\\}_{j=1}^{m}" />
        <p>
          where each <InlineEquation tex="d_i^{(j)} \\in D_i" /> is an element of
          dimension <InlineEquation tex="i" /> (organizational unit, geography, time period, etc.).
        </p>
      </TheoremBlock>

      <TheoremBlock variant="definition" number={5} title="SQL Entitlement Filter">
        <p className="mb-2">
          The corresponding SQL filter is a
          predicate <InlineEquation tex="\\sigma_u" /> such that for any
          row <InlineEquation tex="r" /> in the data table:
        </p>
        <MathBlock tex="\\sigma_u(r) = \\text{true} \\iff \\exists j: \\bigwedge_{i=1}^{n} r.d_i = d_i^{(j)}" />
        <p>
          That is, a row is visible if and only if its dimension values match at least one
          authorized intersection.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">5.3 The Translation Pipeline</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The production system implements this translation as a four-stage pipeline:
      </p>
      <MathBlock tex="\\text{EPM Cubes} \\xrightarrow{\\alpha} \\text{Security Groups} \\xrightarrow{\\beta} \\text{Employee Sets} \\xrightarrow{\\gamma} \\text{Transit Filters} \\xrightarrow{\\delta} \\text{SQL WHERE Clauses}" />

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Stage <InlineEquation tex="\\alpha" />:</strong> Extract permission grants from
        the EPM system as structured
        tuples <InlineEquation tex="(u, D_1, D_2, \\ldots, D_n)" />.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Stage <InlineEquation tex="\\beta" />:</strong> Map permission grants to security
        group memberships. Security groups represent natural organizational boundaries (e.g.,
        &ldquo;Division A Managers&rdquo;) and serve as a caching layer &mdash; permissions change
        slowly, so pre-computing group-to-employee mappings avoids runtime EPM queries.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Stage <InlineEquation tex="\\gamma" />:</strong> Expand security groups to
        employee-level transit sets. A transit is the fundamental unit of the data model (see
        Section 6), representing an employee&apos;s assignment to an organizational position.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Stage <InlineEquation tex="\\delta" />:</strong> Compile transit sets into
        parameterized SQL WHERE clauses:
      </p>
      <div className="mb-4 overflow-x-auto rounded bg-surface p-4">
        <code className="font-mono text-xs text-text-secondary">
          WHERE transit_id IN (SELECT transit_id FROM entitlements WHERE user_id = :current_user)
        </code>
      </div>

      <TheoremBlock variant="proposition" number={2} title="Entitlement Preservation">
        <p>
          The translation pipeline preserves the lattice structure of EPM permissions: if
          user <InlineEquation tex="u_1" /> has a subset
          of <InlineEquation tex="u_2" />&apos;s permissions in EPM,
          then <InlineEquation tex="u_1" /> sees a subset
          of <InlineEquation tex="u_2" />&apos;s data in SQL:
        </p>
        <MathBlock tex="P(u_1) \\subseteq P(u_2) \\implies \\mathcal{D}|_{P(u_1)} \\subseteq \\mathcal{D}|_{P(u_2)}" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          Each stage <InlineEquation tex="\\alpha, \\beta, \\gamma, \\delta" /> is monotone with
          respect to set inclusion. If <InlineEquation tex="P(u_1) \\subseteq P(u_2)" />,
          then <InlineEquation tex="\\alpha(P(u_1)) \\subseteq \\alpha(P(u_2))" /> (fewer
          permission grants leads to fewer security
          groups), <InlineEquation tex="\\beta(\\alpha(P(u_1))) \\subseteq \\beta(\\alpha(P(u_2)))" />{' '}
          (fewer security groups leads to fewer employees), and so on. Since each stage preserves
          subset relationships, the composition preserves
          them. <InlineEquation tex="\\square" />
        </p>
      </TheoremBlock>

      <VisualizationContainer minHeight={400} caption="Figure 3: EPM-to-SQL translation pipeline. Toggle between two different permission sets to see how the output SQL changes at each stage.">
        {(isVisible) => <EPMTranslation />}
      </VisualizationContainer>

      {/* ================================================================ */}
      {/* 6. Event-Driven Data Model                                       */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">6. Event-Driven Data Model</h2>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">6.1 Events vs. Snapshots</h3>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        Traditional HR analytics systems use periodic snapshot models: headcount at
        time <InlineEquation tex="t" /> is a count of active employees in a snapshot table. This
        approach suffers from reconciliation errors when employees transfer between organizational
        units within the same reporting period.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        We instead model workforce movements as a stream of discrete events at the transactional
        employee-by-transit level.
      </p>

      <TheoremBlock variant="definition" number={6} title="Workforce Event">
        <p className="mb-2">
          A workforce event <InlineEquation tex="e" /> is a tuple:
        </p>
        <MathBlock tex="e = (\\text{employee}_{\\text{id}},\\; \\text{transit}_{\\text{id}},\\; \\text{event\\_type},\\; \\text{timestamp},\\; \\text{source\\_rollup},\\; \\text{target\\_rollup})" />
        <p>
          where <InlineEquation tex="\\text{event\\_type} \\in \\{\\text{New Hire},\\; \\text{Departure},\\; \\text{Lateral Move Out},\\; \\text{Lateral Move In},\\; \\text{Promotion}\\}" />.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-xl font-medium text-text-primary">6.2 Automatic Reconciliation</h3>

      <TheoremBlock variant="theorem" number={2} title="Intra-Rollup Transfer Netting">
        <p>
          For any rollup <InlineEquation tex="R" />, if an
          employee <InlineEquation tex="e" /> transfers from
          position <InlineEquation tex="p_1" /> to
          position <InlineEquation tex="p_2" /> where
          both <InlineEquation tex="p_1, p_2 \\in R" />, then the net headcount change
          for <InlineEquation tex="R" /> is zero:
        </p>
        <MathBlock tex="\\Delta H(R) = \\sum_{e \\in \\text{events}(R)} \\text{sign}(e) = (+1)_{\\text{Move In}} + (-1)_{\\text{Move Out}} = 0" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          An intra-rollup transfer generates exactly two events: a Lateral Move Out
          from <InlineEquation tex="p_1" /> (counted
          as <InlineEquation tex="-1" />) and a Lateral Move In
          to <InlineEquation tex="p_2" /> (counted
          as <InlineEquation tex="+1" />). Since both positions belong to the same
          rollup <InlineEquation tex="R" />, the contribution
          to <InlineEquation tex="\\Delta H(R)" />{' '}
          is <InlineEquation tex="-1 + 1 = 0" />. <InlineEquation tex="\\square" />
        </p>
      </TheoremBlock>

      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        This is guaranteed by construction, not by post-hoc reconciliation. The event model makes
        double-counting structurally impossible.
      </p>

      <VisualizationContainer minHeight={400} caption="Figure 4: Event model animation. Drag an employee between positions to see how Lateral Move Out and Lateral Move In events fire, with headcount counters updating in real-time.">
        {(isVisible) => <EventModelAnimation />}
      </VisualizationContainer>

      {/* ================================================================ */}
      {/* 7. Production Validation                                         */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">7. Production Validation</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The architecture has been deployed in production serving a major bank&apos;s CFO Group
        with the following measured characteristics:
      </p>
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-text-tertiary">
              <th className="pb-2 pr-4 font-medium">Metric</th>
              <th className="pb-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Employee transits processed</td>
              <td className="py-2 font-mono">~40,000</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Organizational rollups</td>
              <td className="py-2 font-mono">~9,000</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Geographies</td>
              <td className="py-2 font-mono">~60,000</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Query response latency</td>
              <td className="py-2 font-mono">Millisecond-level</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">Sub-agent count</td>
              <td className="py-2 font-mono">3 (parallel)</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">LLM data exposure</td>
              <td className="py-2 font-mono">Zero (by construction, per Theorem 1)</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Entitlement model</td>
              <td className="py-2 font-mono">EPM-to-SQL (per Section 5)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The system delivers financial insights through three channels: a production-grade dynamic
        dashboard, a conversational chatbot interface, and inbox-ready HTML reports &mdash; all
        enforcing the same entitlement model.
      </p>

      {/* ================================================================ */}
      {/* 8. Related Work                                                  */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">8. Related Work</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The separation of LLM reasoning from data computation relates to several active research
        threads:
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Tool-use architectures.</strong> ReAct [5] and Toolformer [6] demonstrate LLMs
        using external tools, but typically pass data through the LLM context for reasoning. Our
        architecture is stricter: the LLM never sees data, only intents.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Guardrailed generation.</strong> NeMo Guardrails [7] and similar frameworks add
        safety filters around LLM outputs. Our approach is complementary but more fundamental
        &mdash; rather than filtering unsafe outputs, we prevent unsafe inputs.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Text-to-SQL.</strong> DIN-SQL [8] and DAIL-SQL [9] achieve strong results on
        benchmarks but assume the LLM can access schema and data. Our architecture restricts the
        LLM to schema metadata only.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        <strong>Agentic frameworks.</strong> LangGraph [10], AutoGen [11], and CrewAI provide
        orchestration primitives. Our contribution is the formal separation guarantee and the
        entitlement-preserving data layer, which are architecture-level concerns above the
        framework level.
      </p>

      {/* ================================================================ */}
      {/* 9. Conclusion                                                    */}
      {/* ================================================================ */}
      <h2 className="mb-4 mt-12 text-2xl font-semibold text-text-primary">9. Conclusion</h2>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The LLM-as-Router pattern resolves the intelligence-correctness-security trilemma by
        architectural decomposition rather than compromise. By proving that the data
        confidentiality guarantee holds under an honest-but-curious threat model, and that the
        entitlement translation preserves the permission lattice, we provide formal foundations
        for deploying LLM-powered systems in regulated enterprise environments.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-secondary">
        The key insight is simple but consequential: <strong>use LLMs for what they&apos;re good
        at (understanding language), and use deterministic systems for what they&apos;re good at
        (computing answers).</strong> The architectural boundary between these two capabilities is
        where trust is built.
      </p>
      {/* References and Further Reading rendered by PostLayout from data/posts/index.ts */}
    </>
  );
}
