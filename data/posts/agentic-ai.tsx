'use client';

import MathBlock from '@/components/blog/MathBlock';
import InlineEquation from '@/components/blog/InlineEquation';
import TheoremBlock from '@/components/blog/TheoremBlock';
import VisualizationContainer from '@/components/blog/VisualizationContainer';

export default function AgenticAIPost() {
  return (
    <>
      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">1. Introduction</h2>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        Enterprise AI systems face a fundamental tension: large language models excel at
        understanding natural language but cannot be trusted with deterministic computation
        over sensitive financial data. This paper proposes a separation-of-concerns
        architecture — <em>LLM-as-Router</em> — that resolves this tension by confining the
        LLM to intent classification while delegating all data operations to deterministic,
        auditable sub-agents.
      </p>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">2. Problem Formulation</h2>

      <h3 className="mb-3 mt-6 text-lg font-medium text-text-primary">2.1 System Requirements</h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        The system must satisfy four formal requirements simultaneously. Let{' '}
        <InlineEquation tex="Q" /> denote the space of natural-language queries and{' '}
        <InlineEquation tex="R" /> the space of structured responses:
      </p>

      <TheoremBlock variant="definition" number={1} title="System Requirements">
        <p className="mb-2">
          <strong>Requirement 1 (Semantic Understanding).</strong> The system must parse
          natural-language queries into structured intents with high fidelity.
        </p>
        <p className="mb-2">
          <strong>Requirement 2 (Deterministic Correctness).</strong> All numerical
          computations must be exactly reproducible and auditable.
        </p>
        <p className="mb-2">
          <strong>Requirement 3 (Data Confidentiality).</strong> No sensitive employee or
          financial data may be exposed to the LLM context window.
        </p>
        <p>
          <strong>Requirement 4 (Entitlement Enforcement).</strong> Query results must respect
          the requesting user&apos;s EPM permission structure.
        </p>
      </TheoremBlock>

      <h3 className="mb-3 mt-6 text-lg font-medium text-text-primary">2.2 Why Monolithic LLM Architectures Fail</h3>
      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        A monolithic architecture — where a single LLM receives both the query and the
        data — violates Requirements 2 and 3 simultaneously. The LLM cannot guarantee
        deterministic arithmetic, and any data passed into the prompt becomes part of the
        model&apos;s context, potentially exposable through prompt injection or unintended
        generation.
      </p>

      <VisualizationContainer minHeight={300} caption="Figure 1: Monolithic vs. LLM-as-Router architecture comparison">
        {() => (
          <div className="flex h-[300px] items-center justify-center text-sm text-text-tertiary">
            Architecture comparison diagram — coming in Phase 2
          </div>
        )}
      </VisualizationContainer>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">3. Architecture: LLM-as-Router</h2>

      <TheoremBlock variant="definition" number={2} title="LLM-as-Router">
        <p>
          An LLM-as-Router architecture is a composition{' '}
          <InlineEquation tex="S = D \circ R" /> where:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <InlineEquation tex="R: Q \to I" /> is an LLM-based router mapping queries to
            structured intents
          </li>
          <li>
            <InlineEquation tex="D: I \to R" /> is a deterministic dispatch layer mapping
            intents to computation results
          </li>
        </ul>
      </TheoremBlock>

      <MathBlock
        tex="S(q) = D(R(q)) = D(i) \quad \text{where } i = R(q) \in I"
        label="(1)"
      />

      <TheoremBlock variant="proposition" number={1} title="Parallel Correctness">
        <p>
          Given <InlineEquation tex="k" /> independent sub-agents{' '}
          <InlineEquation tex="A_1, \ldots, A_k" />, parallel execution produces identical
          results to sequential execution:
        </p>
        <MathBlock tex="\bigoplus_{j=1}^{k} A_j(i) = A_1(i) \oplus A_2(i) \oplus \cdots \oplus A_k(i)" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          Each sub-agent <InlineEquation tex="A_j" /> operates on disjoint data partitions
          with no shared mutable state. The merge operator{' '}
          <InlineEquation tex="\oplus" /> is commutative and associative.
          Therefore execution order is irrelevant to the final result.
        </p>
      </TheoremBlock>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">4. Data Confidentiality Guarantee</h2>

      <TheoremBlock variant="theorem" number={1} title="Data Confidentiality">
        <p>
          In the LLM-as-Router architecture, the LLM context exposure set{' '}
          <InlineEquation tex="E_{LLM}" /> contains no sensitive data:
        </p>
        <MathBlock tex="E_{LLM} \cap D_{sensitive} = \emptyset" />
      </TheoremBlock>

      <TheoremBlock variant="proof">
        <p>
          By construction, the router <InlineEquation tex="R" /> receives only the
          natural-language query <InlineEquation tex="q" /> and a fixed schema description.
          All data access occurs within the deterministic layer{' '}
          <InlineEquation tex="D" />, which operates in a separate execution context with
          no pathway back to the LLM&apos;s token generation.
        </p>
      </TheoremBlock>

      <h2 className="mb-4 mt-10 text-xl font-semibold text-text-primary">7. Production Validation</h2>
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
              <td className="py-2 pr-4">Parallel sub-agents</td>
              <td className="py-2 font-mono">3</td>
            </tr>
            <tr className="border-b border-border-subtle/50">
              <td className="py-2 pr-4">LLM data exposure</td>
              <td className="py-2 font-mono">Zero</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Response latency</td>
              <td className="py-2 font-mono">Milliseconds</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
