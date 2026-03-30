'use client';

import dynamic from 'next/dynamic';
import MathBlock from '@/components/blog/MathBlock';
import InlineEquation from '@/components/blog/InlineEquation';
import TheoremBlock from '@/components/blog/TheoremBlock';
import VisualizationContainer from '@/components/blog/VisualizationContainer';

const FiveStagePipeline = dynamic(
  () => import('@/components/blog/diagrams/FiveStagePipeline'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading pipeline diagram&hellip;
      </div>
    ),
  }
);

const EmbeddingSpace = dynamic(
  () => import('@/components/blog/diagrams/EmbeddingSpace'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading embedding visualization&hellip;
      </div>
    ),
  }
);

const GuardrailValidator = dynamic(
  () => import('@/components/blog/diagrams/GuardrailValidator'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading guardrail diagram&hellip;
      </div>
    ),
  }
);

const FullPipelineFlow = dynamic(
  () => import('@/components/blog/diagrams/FullPipelineFlow'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading full pipeline diagram&hellip;
      </div>
    ),
  }
);

export default function TextToSQLPost() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. Introduction                                                     */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        1. Introduction
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Text-to-SQL — the task of translating natural language questions into executable
        SQL queries — has seen significant progress through large language models. DIN-SQL
        [1], DAIL-SQL [2], and C3 [3] achieve execution accuracies above 85% on the Spider
        benchmark [4]. However, production deployment in regulated financial environments
        exposes failure modes that benchmark evaluations do not capture:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-secondary">
        <li>
          <strong>Ambiguous KPI references</strong> that map to multiple valid metrics
        </li>
        <li>
          <strong>Evolving taxonomies</strong> where new KPIs are continuously added to the
          catalog
        </li>
        <li>
          <strong>Injection vulnerabilities</strong> from unguarded SQL generation
        </li>
        <li>
          <strong>Non-deterministic outputs</strong> that cannot be regression-tested
        </li>
        <li>
          <strong>Displacive errors</strong> — a confidently wrong answer is worse than no
          answer
        </li>
      </ol>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        We address these failures through decomposition: rather than treating text-to-SQL
        as a single function{' '}
        <InlineEquation tex="f: \\text{NL} \\rightarrow \\text{SQL}" />, we factor it into
        five stages, each with explicit contracts, testable invariants, and formal safety
        properties.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Problem Formulation                                              */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        2. Problem Formulation
      </h2>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        2.1 The Benchmarking Domain
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The system operates on a financial benchmarking database containing Key Performance
        Indicators (KPIs) derived from regulatory filings of major financial institutions.
        Let:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          <InlineEquation tex="\\mathcal{K} = \\{k_1, k_2, \\ldots, k_n\\}" /> be the{' '}
          <strong>KPI catalog</strong>, where each <InlineEquation tex="k_i" /> has a name{' '}
          <InlineEquation tex="n_i" />, definition <InlineEquation tex="d_i" />, and
          metadata <InlineEquation tex="m_i" /> (reporting period, entity, unit)
        </li>
        <li>
          <InlineEquation tex="\\mathcal{V}" /> be the <strong>value store</strong>,
          containing time-indexed KPI values for each institution
        </li>
        <li>
          <InlineEquation tex="\\mathcal{Q}" /> be the space of natural language queries
        </li>
      </ul>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The system must implement{' '}
        <InlineEquation tex="f: \\mathcal{Q} \\rightarrow \\mathcal{R}" /> where{' '}
        <InlineEquation tex="\\mathcal{R}" /> is the space of formatted benchmark
        comparisons.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        2.2 Formal Requirements
      </h3>

      <TheoremBlock variant="definition" number={1} title="Injection Safety">
        <p>
          No user input string <InlineEquation tex="q \\in \\mathcal{Q}" /> can cause
          execution of SQL operations outside the predefined operation set{' '}
          <InlineEquation tex="\\mathcal{O} = \\{\\text{SELECT}\\}" />:
        </p>
        <MathBlock tex="\\forall q \\in \\mathcal{Q}: \\text{op}(\\text{SQL}(q)) \\in \\mathcal{O}" />
      </TheoremBlock>

      <TheoremBlock variant="definition" number={2} title="Schema Compliance">
        <p>
          Generated SQL may reference only tables{' '}
          <InlineEquation tex="T_{\\text{allowed}}" /> and columns{' '}
          <InlineEquation tex="C_{\\text{allowed}}" /> in the registered schema:
        </p>
        <MathBlock tex="\\forall q \\in \\mathcal{Q}: \\text{tables}(\\text{SQL}(q)) \\subseteq T_{\\text{allowed}} \\wedge \\text{cols}(\\text{SQL}(q)) \\subseteq C_{\\text{allowed}}" />
      </TheoremBlock>

      <TheoremBlock variant="definition" number={3} title="Disambiguation Correctness">
        <p>
          If the system resolves an ambiguous KPI reference, the resolved KPI must be the
          one the user intended with probability at least{' '}
          <InlineEquation tex="1 - \\epsilon" /> for a configurable confidence threshold{' '}
          <InlineEquation tex="\\epsilon" />:
        </p>
        <MathBlock tex="P(\\hat{k} = k^*) \\geq 1 - \\epsilon" />
        <p>
          Otherwise, the system must request clarification rather than guess.
        </p>
      </TheoremBlock>

      <TheoremBlock variant="definition" number={4} title="Testability">
        <p>
          Every pipeline stage must be independently testable with deterministic inputs and
          outputs:
        </p>
        <MathBlock tex="\\forall \\text{ stage } s_i: \\exists \\text{ test suite } T_i \\text{ s.t. } s_i \\text{ is deterministic on } T_i" />
      </TheoremBlock>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Five-Stage Pipeline Architecture                                 */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        3. Five-Stage Pipeline Architecture
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The pipeline decomposes <InlineEquation tex="f" /> into five sequential stages:
      </p>

      <MathBlock tex="f = s_5 \\circ s_4 \\circ s_3 \\circ s_2 \\circ s_1" />

      <p className="mb-4 text-sm leading-relaxed text-text-secondary">where:</p>

      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-2 pr-4 font-medium text-text-tertiary text-left">Stage</th>
              <th className="pb-2 pr-4 font-medium text-text-tertiary text-left">
                Function
              </th>
              <th className="pb-2 pr-4 font-medium text-text-tertiary text-left">Input</th>
              <th className="pb-2 pr-4 font-medium text-text-tertiary text-left">Output</th>
              <th className="pb-2 font-medium text-text-tertiary text-left">Uses LLM?</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation tex="s_1" />
              </td>
              <td className="py-2 pr-4">Intent Parsing</td>
              <td className="py-2 pr-4">
                Natural language query <InlineEquation tex="q" />
              </td>
              <td className="py-2 pr-4">
                Structured intent <InlineEquation tex="I" />
              </td>
              <td className="py-2">Yes (constrained)</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation tex="s_2" />
              </td>
              <td className="py-2 pr-4">KPI Detection</td>
              <td className="py-2 pr-4">
                Metric reference from <InlineEquation tex="I" />
              </td>
              <td className="py-2 pr-4">
                Candidate set{' '}
                <InlineEquation tex="\\mathcal{K}_c \\subseteq \\mathcal{K}" />
              </td>
              <td className="py-2">No (embeddings)</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation tex="s_3" />
              </td>
              <td className="py-2 pr-4">Disambiguation</td>
              <td className="py-2 pr-4">
                Candidates <InlineEquation tex="\\mathcal{K}_c" /> + query{' '}
                <InlineEquation tex="q" />
              </td>
              <td className="py-2 pr-4">
                Resolved KPI <InlineEquation tex="\\hat{k}" /> or clarification request
              </td>
              <td className="py-2">Conditional</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">
                <InlineEquation tex="s_4" />
              </td>
              <td className="py-2 pr-4">SQL Generation</td>
              <td className="py-2 pr-4">
                Resolved KPI <InlineEquation tex="\\hat{k}" /> + parameters
              </td>
              <td className="py-2 pr-4">Validated SQL string</td>
              <td className="py-2">Template + validation</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <InlineEquation tex="s_5" />
              </td>
              <td className="py-2 pr-4">Result Formatting</td>
              <td className="py-2 pr-4">Query results</td>
              <td className="py-2 pr-4">
                Formatted response <InlineEquation tex="r" />
              </td>
              <td className="py-2">No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <VisualizationContainer
        minHeight={350}
        caption="Figure 1: Five-stage decomposed pipeline — blue stages use LLM, green stages are fully deterministic"
      >
        {() => <FiveStagePipeline />}
      </VisualizationContainer>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Stage 1: Intent Parsing                                          */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        4. Stage 1: Intent Parsing
      </h2>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        4.1 Structured Extraction
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The intent parser maps a natural language query to a structured intent tuple:
      </p>
      <MathBlock tex="s_1: \\mathcal{Q} \\rightarrow \\mathcal{I} = (\\mu, \\tau, \\delta, \\omega)" />
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">where:</p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          <InlineEquation tex="\\mu \\in \\mathcal{M}" /> is the{' '}
          <strong>metric reference</strong> (the KPI the user is asking about, in their
          words)
        </li>
        <li>
          <InlineEquation tex="\\tau \\in \\mathcal{T}" /> is the{' '}
          <strong>temporal scope</strong> (quarter, year, range, trend)
        </li>
        <li>
          <InlineEquation tex="\\delta \\in \\Delta" /> is the{' '}
          <strong>comparison dimension</strong> (peer vs. self, absolute vs. relative)
        </li>
        <li>
          <InlineEquation tex="\\omega \\in \\Omega" /> is the{' '}
          <strong>output type</strong> (table, chart, single value, narrative)
        </li>
      </ul>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        4.2 Constrained Generation
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The LLM is prompted with a schema definition of{' '}
        <InlineEquation tex="\\mathcal{I}" /> and instructed to output a JSON object
        conforming to the schema. This is constrained generation — the model&apos;s output
        space is restricted to valid intent tuples.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Validation.</strong> The JSON output is validated against the schema before
        proceeding. If validation fails (missing fields, invalid enum values), the system
        retries with the validation error appended to the prompt. After{' '}
        <InlineEquation tex="k_{\\max}" /> retries, it requests clarification from the
        user.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Ambiguity Detection.</strong> If the metric reference{' '}
        <InlineEquation tex="\\mu" /> is empty or too vague (e.g.,{' '}
        &ldquo;efficiency&rdquo; with no qualifying context), the system returns a
        clarification request rather than proceeding with a guess. This is Stage 1&apos;s
        contribution to Requirement 3.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Stage 2: KPI Detection via Embedding Similarity                  */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        5. Stage 2: KPI Detection via Embedding Similarity
      </h2>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        5.1 Embedding Space
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Each KPI <InlineEquation tex="k_i \\in \\mathcal{K}" /> is represented by an
        embedding vector computed from its name, definition, and metadata:
      </p>
      <MathBlock tex="\\mathbf{e}_i = \\text{embed}(n_i \\oplus d_i \\oplus m_i) \\in \\mathbb{R}^d" />
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        where <InlineEquation tex="\\oplus" /> denotes string concatenation with separator
        tokens and{' '}
        <InlineEquation tex="\\text{embed}: \\text{String} \\rightarrow \\mathbb{R}^d" />{' '}
        is a pre-trained sentence embedding model.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The user&apos;s metric reference <InlineEquation tex="\\mu" /> is similarly
        embedded:
      </p>
      <MathBlock tex="\\mathbf{e}_\\mu = \\text{embed}(\\mu)" />

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        5.2 Similarity Search
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The candidate set is retrieved by cosine similarity:
      </p>
      <MathBlock tex="\\text{sim}(k_i, \\mu) = \\frac{\\mathbf{e}_i \\cdot \\mathbf{e}_\\mu}{\\|\\mathbf{e}_i\\| \\|\\mathbf{e}_\\mu\\|}" />
      <MathBlock tex="\\mathcal{K}_c = \\{k_i \\in \\mathcal{K} \\mid \\text{sim}(k_i, \\mu) \\geq \\tau_{\\min}\\}" />
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        where <InlineEquation tex="\\tau_{\\min}" /> is the minimum similarity threshold.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        5.3 Why Embeddings Over Keyword Matching
      </h3>

      <TheoremBlock variant="proposition" number={3} title="Embedding Robustness to Synonymy">
        <p>
          For semantically equivalent metric references{' '}
          <InlineEquation tex="\\mu_1 \\equiv_{\\text{sem}} \\mu_2" /> (e.g.,{' '}
          &ldquo;NIM&rdquo; and &ldquo;Net Interest Margin&rdquo;), embedding similarity
          preserves retrieval:
        </p>
        <MathBlock tex="\\mu_1 \\equiv_{\\text{sem}} \\mu_2 \\implies |\\text{sim}(k, \\mu_1) - \\text{sim}(k, \\mu_2)| < \\delta" />
        <p>
          for small <InlineEquation tex="\\delta" />, assuming the embedding model captures
          semantic similarity (a property validated empirically for modern sentence
          transformers [5]).
        </p>
      </TheoremBlock>

      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Keyword matching fails here because &ldquo;NIM&rdquo; shares zero tokens with
        &ldquo;Net Interest Margin.&rdquo; Edit distance fails because the strings are not
        typos of each other. Embeddings succeed because they encode semantic meaning, not
        surface form.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        5.4 The Scaling Problem
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        As the KPI catalog <InlineEquation tex="|\\mathcal{K}|" /> grows, the probability
        of near-duplicate entries increases. Consider:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>&ldquo;Net Interest Margin&rdquo;</li>
        <li>&ldquo;Net Interest Margin (Adjusted)&rdquo;</li>
        <li>&ldquo;Net Interest Margin (Domestic Only)&rdquo;</li>
        <li>&ldquo;NIM — Regulatory Basis&rdquo;</li>
      </ul>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        These are distinct KPIs with different definitions and values, but their embeddings
        cluster tightly in <InlineEquation tex="\\mathbb{R}^d" />. When{' '}
        <InlineEquation tex="|\\mathcal{K}_c| > 1" /> and the top candidates are close in
        similarity score, we enter the disambiguation stage.
      </p>

      <VisualizationContainer
        minHeight={400}
        caption="Figure 2: KPI embedding space — clusters of related metrics with the disambiguation danger zone highlighted"
      >
        {() => <EmbeddingSpace />}
      </VisualizationContainer>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Stage 3: LLM-Assisted Disambiguation                            */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        6. Stage 3: LLM-Assisted Disambiguation
      </h2>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        6.1 Triggering Condition
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Disambiguation is invoked when the candidate set is ambiguous:
      </p>
      <MathBlock
        tex={`\\text{disambiguate?} = \\begin{cases} \\text{no} & \\text{if } |\\mathcal{K}_c| = 1 \\\\ \\text{no} & \\text{if } |\\mathcal{K}_c| > 1 \\wedge \\text{sim}(k_1, \\mu) - \\text{sim}(k_2, \\mu) > \\gamma \\\\ \\text{yes} & \\text{otherwise} \\end{cases}`}
      />
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        where <InlineEquation tex="k_1, k_2" /> are the top-2 candidates sorted by
        similarity, and <InlineEquation tex="\\gamma" /> is the{' '}
        <strong>confidence gap threshold</strong>. If the top candidate is sufficiently
        dominant, we accept it without LLM disambiguation.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        6.2 The Disambiguation Protocol
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        When triggered, the LLM receives:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
        <li>
          The user&apos;s original query <InlineEquation tex="q" />
        </li>
        <li>
          The candidate KPI names{' '}
          <InlineEquation tex="\\{n_i : k_i \\in \\mathcal{K}_c\\}" />
        </li>
        <li>
          The candidate KPI definitions{' '}
          <InlineEquation tex="\\{d_i : k_i \\in \\mathcal{K}_c\\}" />
        </li>
      </ul>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Critically, the LLM does <strong>not</strong> receive KPI values or any data from{' '}
        <InlineEquation tex="\\mathcal{V}" />. This preserves the data confidentiality
        property (cf. companion paper on LLM-as-Router architectures).
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The LLM outputs a selection{' '}
        <InlineEquation tex="\\hat{k} \\in \\mathcal{K}_c" /> and a confidence score{' '}
        <InlineEquation tex="p \\in [0, 1]" />.
      </p>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        6.3 Confidence Thresholding
      </h3>

      <TheoremBlock variant="definition" number={6} title="Disambiguation Decision Function">
        <p>The disambiguation outcome is:</p>
        <MathBlock
          tex={`\\text{outcome}(\\hat{k}, p) = \\begin{cases} \\text{accept}(\\hat{k}) & \\text{if } p \\geq 1 - \\epsilon \\\\ \\text{clarify}(\\mathcal{K}_c) & \\text{if } p < 1 - \\epsilon \\end{cases}`}
        />
        <p>
          where <InlineEquation tex="\\epsilon" /> is the maximum acceptable error
          probability from Requirement 3.
        </p>
      </TheoremBlock>

      <TheoremBlock variant="proposition" number={4} title="Disambiguation Safety">
        <p>
          If the LLM&apos;s confidence score is calibrated (i.e.,{' '}
          <InlineEquation tex="P(\\hat{k} = k^* \\mid p) \\geq p" /> for all confidence
          levels <InlineEquation tex="p" />
          ), then the disambiguation decision function satisfies Requirement 3:
        </p>
        <MathBlock tex="P(\\hat{k} = k^*) \\geq 1 - \\epsilon \\text{ whenever outcome} = \\text{accept}" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          The accept condition requires <InlineEquation tex="p \\geq 1 - \\epsilon" />. By
          calibration,{' '}
          <InlineEquation tex="P(\\hat{k} = k^* \\mid p) \\geq p \\geq 1 - \\epsilon" />.{' '}
          <InlineEquation tex="\\square" />
        </p>
      </TheoremBlock>

      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        In practice, LLM confidence scores are not perfectly calibrated [6], so we set{' '}
        <InlineEquation tex="\\epsilon" /> conservatively (we use{' '}
        <InlineEquation tex="\\epsilon = 0.05" />) and validate calibration empirically on
        a held-out query set.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Stage 4: Guardrailed SQL Generation                              */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        7. Stage 4: Guardrailed SQL Generation
      </h2>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        7.1 Template-Based Generation
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Once the KPI is resolved, SQL generation uses a hybrid approach: a template library
        provides the structural skeleton, and parameterization fills in the specific values.
      </p>

      <TheoremBlock variant="definition" number={7} title="SQL Template">
        <p>
          A template <InlineEquation tex="T" /> is a SQL string with typed placeholders:
        </p>
        <MathBlock tex="T(\\text{kpi\\_id}: \\text{int},\\; \\text{period}: \\text{date},\\; \\text{entity}: \\text{string}) = \\text{SELECT } \\ldots \\text{ WHERE kpi\\_id = :kpi\\_id AND } \\ldots" />
        <p>
          Templates are pre-authored and reviewed for each query pattern (peer comparison,
          time series trend, single-point lookup, cross-entity ranking).
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        7.2 Formal Safety Properties
      </h3>

      <TheoremBlock variant="theorem" number={3} title="Injection Impossibility">
        <p>
          If all user-supplied values are passed as parameterized bindings (not
          string-interpolated into the SQL), then SQL injection is impossible:
        </p>
        <MathBlock tex="\\forall q \\in \\mathcal{Q}: \\nexists \\text{ substring } s \\text{ of } q \\text{ that executes as SQL}" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          Parameterized queries separate code (the SQL template) from data (the parameter
          values) at the database driver level [7]. The driver processes the SQL template as
          a prepared statement, compiling it into an execution plan before binding parameter
          values. Parameter values are treated as data literals, not as SQL syntax.
          Therefore, no content of <InlineEquation tex="q" /> — regardless of its structure
          or embedded SQL keywords — can alter the query&apos;s syntactic structure or
          execution plan.
        </p>
      </TheoremBlock>

      <TheoremBlock variant="theorem" number={4} title="Schema Compliance">
        <p>
          If the template library <InlineEquation tex="\\mathcal{T}" /> references only
          tables in <InlineEquation tex="T_{\\text{allowed}}" /> and columns in{' '}
          <InlineEquation tex="C_{\\text{allowed}}" />, and templates are selected (not
          generated), then Requirement 2 is satisfied:
        </p>
        <MathBlock tex="\\forall T \\in \\mathcal{T}: \\text{tables}(T) \\subseteq T_{\\text{allowed}} \\wedge \\text{cols}(T) \\subseteq C_{\\text{allowed}}" />
        <MathBlock tex="\\text{template\\_select}: \\mathcal{I} \\rightarrow \\mathcal{T} \\implies \\text{tables}(\\text{SQL}(q)) \\subseteq T_{\\text{allowed}}" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          The SQL execution uses only templates from{' '}
          <InlineEquation tex="\\mathcal{T}" />. Each template is authored and reviewed to
          reference only allowed tables and columns. Since no dynamic table or column names
          enter through parameters (which are values, not identifiers), the schema boundary
          is preserved.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-8 text-lg font-medium text-text-primary">
        7.3 Validation Layer
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Even with template-based generation, a validation layer provides defense-in-depth:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-text-secondary">
        <li>
          <strong>Whitelist check:</strong> Parse the generated SQL AST and verify all table
          and column references against <InlineEquation tex="T_{\\text{allowed}}" /> and{' '}
          <InlineEquation tex="C_{\\text{allowed}}" />
        </li>
        <li>
          <strong>Operation check:</strong> Verify the top-level operation is SELECT (no
          INSERT, UPDATE, DELETE, DROP)
        </li>
        <li>
          <strong>Structure check:</strong> Compare the generated SQL structure against the
          expected template structure using tree edit distance on the AST
        </li>
        <li>
          <strong>Parameter type check:</strong> Verify each bound parameter matches the
          expected type from the template definition
        </li>
      </ol>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        If any check fails, the query is rejected and logged for review — it never reaches
        the database.
      </p>

      <VisualizationContainer
        minHeight={400}
        caption="Figure 3: Four-gate guardrail validation — SQL injection attempts are caught at parameterization, schema violations at whitelist check"
      >
        {() => <GuardrailValidator />}
      </VisualizationContainer>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Stage 5: Deterministic Result Formatting                         */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        8. Stage 5: Deterministic Result Formatting
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The final stage transforms raw query results into the output format{' '}
        <InlineEquation tex="\\omega" /> specified in the intent. This stage is entirely
        deterministic — no LLM involvement:
      </p>
      <MathBlock tex="s_5: (\\text{QueryResult}, \\omega) \\rightarrow \\mathcal{R}" />
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Output types include comparison tables, trend charts, summary statistics, and
        narrative descriptions (generated from templates, not LLMs).
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 9. On the Two-Week Delivery                                         */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        9. On the Two-Week Delivery
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The second version of this system was designed and deployed in two weeks. This
        timeline merits explanation because it appears to contradict the depth of
        engineering described above.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Three factors made this possible:
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Factor 1: Domain maturity.</strong> Version 1 had been in production for
        months. The KPI catalog, data layer, entitlement model, and deployment
        infrastructure were stable. The rewrite replaced the query interface, not the
        foundation.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Factor 2: Pre-crystallized architecture.</strong> The five-stage
        decomposition, the embedding approach, the confidence thresholding protocol, and the
        guardrail layers had been explored and decided during months of research preceding
        the build. The architecture was ready; it needed to be written, not discovered.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Factor 3: Framework standardization.</strong> The codebase was built within
        an internal platform that handled authentication, entitlements, and deployment.
        Infrastructure was not in scope.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The lesson: speed in delivery comes from depth in preparation. The two weeks of
        building was enabled by months of thinking.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 10. Related Work                                                    */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        10. Related Work
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Text-to-SQL benchmarks.</strong> Spider [4] and WikiSQL [8] evaluate
        end-to-end accuracy but do not measure safety properties (injection resistance,
        schema compliance) or disambiguation quality. Our pipeline is designed for these
        properties first, accuracy second.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Decomposed approaches.</strong> DIN-SQL [1] decomposes text-to-SQL into
        sub-problems but uses LLM generation at each stage. Our approach restricts LLM use
        to intent parsing and disambiguation, using deterministic templates for SQL
        generation.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>Embedding-based retrieval.</strong> Dense retrieval methods [9] using
        sentence transformers have shown strong performance for semantic matching tasks. We
        apply this specifically to KPI catalog matching with a disambiguation overlay.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        <strong>SQL safety.</strong> OWASP SQL injection prevention [7] establishes
        parameterization as the primary defense. Our contribution is integrating this with
        LLM-generated queries where the attack surface is the natural language input, not a
        traditional form field.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* 11. Conclusion                                                      */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="mb-4 mt-12 text-xl font-semibold text-text-primary">
        11. Conclusion
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The five-stage decomposition transforms text-to-SQL from a monolithic generation
        task into a pipeline with formal safety properties. By factoring the problem into
        intent parsing, embedding-based detection, confidence-thresholded disambiguation,
        template-based generation with parameterization, and deterministic formatting, we
        achieve injection impossibility, schema compliance, and disambiguation correctness —
        properties that are provable, not aspirational.
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The key insight: <strong>decomposition is itself the primary guardrail.</strong>{' '}
        Each stage has a narrow contract, a testable interface, and clear failure modes.
        When something goes wrong, you know which stage failed. When the catalog grows, you
        know which stage to extend. When requirements change, you know which stage to modify
        without risking the others.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Full Pipeline Hero Diagram                                          */}
      {/* ------------------------------------------------------------------ */}
      <VisualizationContainer
        minHeight={450}
        caption="Figure 4: Complete pipeline architecture — query flows through all five stages with typed connections and safety property annotations"
      >
        {() => <FullPipelineFlow />}
      </VisualizationContainer>
    </>
  );
}
