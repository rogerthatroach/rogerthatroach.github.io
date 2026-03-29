# Guardrailed Text-to-SQL for Financial Benchmarking: A Multi-Stage Pipeline with Formal Safety Properties

**Author:** Harmilap Singh Dhaliwal
**Date:** March 2026
**Keywords:** text-to-SQL, semantic similarity, KPI disambiguation, SQL injection prevention, guardrailed generation, enterprise NLP

---

## Abstract

Text-to-SQL systems that rely on end-to-end LLM generation achieve strong results on academic benchmarks (Spider, WikiSQL) but lack the formal safety guarantees required for financial applications where incorrect query results can drive material business decisions. This paper presents a five-stage decomposed pipeline — intent parsing, KPI detection via embedding similarity, LLM-assisted disambiguation with confidence thresholds, guardrailed SQL generation with whitelist enforcement, and deterministic result formatting — that provides provable properties: SQL injection impossibility through parameterization, schema compliance through whitelist validation, and disambiguation correctness through bounded confidence scoring. We describe a production implementation that was designed and deployed in two weeks for peer benchmarking across major financial institutions.

---

## 1. Introduction

Text-to-SQL — the task of translating natural language questions into executable SQL queries — has seen significant progress through large language models. DIN-SQL [1], DAIL-SQL [2], and C3 [3] achieve execution accuracies above 85% on the Spider benchmark [4]. However, production deployment in regulated financial environments exposes failure modes that benchmark evaluations do not capture:

1. **Ambiguous KPI references** that map to multiple valid metrics
2. **Evolving taxonomies** where new KPIs are continuously added to the catalog
3. **Injection vulnerabilities** from unguarded SQL generation
4. **Non-deterministic outputs** that cannot be regression-tested
5. **Displacive errors** — a confidently wrong answer is worse than no answer

We address these failures through decomposition: rather than treating text-to-SQL as a single function $f: \text{NL} \rightarrow \text{SQL}$, we factor it into five stages, each with explicit contracts, testable invariants, and formal safety properties.

---

## 2. Problem Formulation

### 2.1 The Benchmarking Domain

The system operates on a financial benchmarking database containing Key Performance Indicators (KPIs) derived from regulatory filings of major financial institutions. Let:

- $\mathcal{K} = \{k_1, k_2, \ldots, k_n\}$ be the **KPI catalog**, where each $k_i$ has a name $n_i$, definition $d_i$, and metadata $m_i$ (reporting period, entity, unit)
- $\mathcal{V}$ be the **value store**, containing time-indexed KPI values for each institution
- $\mathcal{Q}$ be the space of natural language queries

The system must implement $f: \mathcal{Q} \rightarrow \mathcal{R}$ where $\mathcal{R}$ is the space of formatted benchmark comparisons.

### 2.2 Formal Requirements

**Requirement 1 (Injection Safety).** No user input string $q \in \mathcal{Q}$ can cause execution of SQL operations outside the predefined operation set $\mathcal{O} = \{\text{SELECT}\}$:

$$\forall q \in \mathcal{Q}: \text{op}(\text{SQL}(q)) \in \mathcal{O}$$

**Requirement 2 (Schema Compliance).** Generated SQL may reference only tables $T_{\text{allowed}}$ and columns $C_{\text{allowed}}$ in the registered schema:

$$\forall q \in \mathcal{Q}: \text{tables}(\text{SQL}(q)) \subseteq T_{\text{allowed}} \wedge \text{cols}(\text{SQL}(q)) \subseteq C_{\text{allowed}}$$

**Requirement 3 (Disambiguation Correctness).** If the system resolves an ambiguous KPI reference, the resolved KPI must be the one the user intended with probability at least $1 - \epsilon$ for a configurable confidence threshold $\epsilon$:

$$P(\hat{k} = k^*) \geq 1 - \epsilon$$

Otherwise, the system must request clarification rather than guess.

**Requirement 4 (Testability).** Every pipeline stage must be independently testable with deterministic inputs and outputs:

$$\forall \text{stage } s_i: \exists \text{ test suite } T_i \text{ s.t. } s_i \text{ is deterministic on } T_i$$

---

## 3. Five-Stage Pipeline Architecture

The pipeline decomposes $f$ into five sequential stages:

$$f = s_5 \circ s_4 \circ s_3 \circ s_2 \circ s_1$$

where:

| Stage | Function | Input | Output | Uses LLM? |
|-------|----------|-------|--------|-----------|
| $s_1$ | Intent Parsing | Natural language query $q$ | Structured intent $I$ | Yes (constrained) |
| $s_2$ | KPI Detection | Metric reference from $I$ | Candidate set $\mathcal{K}_c \subseteq \mathcal{K}$ | No (embeddings) |
| $s_3$ | Disambiguation | Candidates $\mathcal{K}_c$ + query $q$ | Resolved KPI $\hat{k}$ or clarification request | Conditional |
| $s_4$ | SQL Generation | Resolved KPI $\hat{k}$ + parameters | Validated SQL string | Template + validation |
| $s_5$ | Result Formatting | Query results | Formatted response $r$ | No |

<!-- VISUALIZATION SPEC: Five-stage pipeline
Horizontal flow diagram with 5 stages as distinct blocks.
Each block shows: stage name, input type, output type, and whether LLM is involved (icon).
Data flows left to right with typed connections between stages.
Interactive: click any stage to expand it into a detailed sub-diagram.
Color coding: blue for LLM-involved stages, green for deterministic stages.
Animate: query enters from left, flows through each stage with a brief processing animation at each.
At stage 3, show a branching point: "high confidence → proceed" vs "low confidence → ask user"
-->

---

## 4. Stage 1: Intent Parsing

### 4.1 Structured Extraction

The intent parser maps a natural language query to a structured intent tuple:

$$s_1: \mathcal{Q} \rightarrow \mathcal{I} = (\mu, \tau, \delta, \omega)$$

where:
- $\mu \in \mathcal{M}$ is the **metric reference** (the KPI the user is asking about, in their words)
- $\tau \in \mathcal{T}$ is the **temporal scope** (quarter, year, range, trend)
- $\delta \in \Delta$ is the **comparison dimension** (peer vs. self, absolute vs. relative)
- $\omega \in \Omega$ is the **output type** (table, chart, single value, narrative)

### 4.2 Constrained Generation

The LLM is prompted with a schema definition of $\mathcal{I}$ and instructed to output a JSON object conforming to the schema. This is constrained generation — the model's output space is restricted to valid intent tuples.

**Validation.** The JSON output is validated against the schema before proceeding. If validation fails (missing fields, invalid enum values), the system retries with the validation error appended to the prompt. After $k_{\max}$ retries, it requests clarification from the user.

**Ambiguity Detection.** If the metric reference $\mu$ is empty or too vague (e.g., "efficiency" with no qualifying context), the system returns a clarification request rather than proceeding with a guess. This is Stage 1's contribution to Requirement 3.

---

## 5. Stage 2: KPI Detection via Embedding Similarity

### 5.1 Embedding Space

Each KPI $k_i \in \mathcal{K}$ is represented by an embedding vector computed from its name, definition, and metadata:

$$\mathbf{e}_i = \text{embed}(n_i \oplus d_i \oplus m_i) \in \mathbb{R}^d$$

where $\oplus$ denotes string concatenation with separator tokens and $\text{embed}: \text{String} \rightarrow \mathbb{R}^d$ is a pre-trained sentence embedding model.

The user's metric reference $\mu$ is similarly embedded:

$$\mathbf{e}_\mu = \text{embed}(\mu)$$

### 5.2 Similarity Search

The candidate set is retrieved by cosine similarity:

$$\text{sim}(k_i, \mu) = \frac{\mathbf{e}_i \cdot \mathbf{e}_\mu}{\|\mathbf{e}_i\| \|\mathbf{e}_\mu\|}$$

$$\mathcal{K}_c = \{k_i \in \mathcal{K} \mid \text{sim}(k_i, \mu) \geq \tau_{\min}\}$$

where $\tau_{\min}$ is the minimum similarity threshold.

### 5.3 Why Embeddings Over Keyword Matching

**Proposition 3 (Embedding Robustness to Synonymy).** For semantically equivalent metric references $\mu_1 \equiv_{\text{sem}} \mu_2$ (e.g., "NIM" and "Net Interest Margin"), embedding similarity preserves retrieval:

$$\mu_1 \equiv_{\text{sem}} \mu_2 \implies |\text{sim}(k, \mu_1) - \text{sim}(k, \mu_2)| < \delta$$

for small $\delta$, assuming the embedding model captures semantic similarity (a property validated empirically for modern sentence transformers [5]).

Keyword matching fails here because "NIM" shares zero tokens with "Net Interest Margin." Edit distance fails because the strings are not typos of each other. Embeddings succeed because they encode semantic meaning, not surface form.

### 5.4 The Scaling Problem

As the KPI catalog $|\mathcal{K}|$ grows, the probability of near-duplicate entries increases. Consider:

- "Net Interest Margin"
- "Net Interest Margin (Adjusted)"
- "Net Interest Margin (Domestic Only)"
- "NIM — Regulatory Basis"

These are distinct KPIs with different definitions and values, but their embeddings cluster tightly in $\mathbb{R}^d$. When $|\mathcal{K}_c| > 1$ and the top candidates are close in similarity score, we enter the disambiguation stage.

<!-- VISUALIZATION SPEC: Embedding space visualization
2D projection (t-SNE or UMAP style) of KPI embeddings.
Clusters of related KPIs visible (interest margin cluster, efficiency cluster, capital cluster).
Interactive: user types a metric reference in a text input, an embedding point appears and lines draw to the nearest neighbors.
Highlight the "danger zone" where multiple KPIs are close — this is where disambiguation is needed.
Show cosine similarity scores on the connecting lines.
Animate: as user types, the query point moves in real-time and neighbors update.
-->

---

## 6. Stage 3: LLM-Assisted Disambiguation

### 6.1 Triggering Condition

Disambiguation is invoked when the candidate set is ambiguous:

$$\text{disambiguate?} = \begin{cases} \text{no} & \text{if } |\mathcal{K}_c| = 1 \\ \text{no} & \text{if } |\mathcal{K}_c| > 1 \wedge \text{sim}(k_1, \mu) - \text{sim}(k_2, \mu) > \gamma \\ \text{yes} & \text{otherwise} \end{cases}$$

where $k_1, k_2$ are the top-2 candidates sorted by similarity, and $\gamma$ is the **confidence gap threshold**. If the top candidate is sufficiently dominant, we accept it without LLM disambiguation.

### 6.2 The Disambiguation Protocol

When triggered, the LLM receives:
- The user's original query $q$
- The candidate KPI names $\{n_i : k_i \in \mathcal{K}_c\}$
- The candidate KPI definitions $\{d_i : k_i \in \mathcal{K}_c\}$

Critically, the LLM does **not** receive KPI values or any data from $\mathcal{V}$. This preserves the data confidentiality property (cf. companion paper on LLM-as-Router architectures).

The LLM outputs a selection $\hat{k} \in \mathcal{K}_c$ and a confidence score $p \in [0, 1]$.

### 6.3 Confidence Thresholding

**Definition 6 (Disambiguation Decision Function).** The disambiguation outcome is:

$$\text{outcome}(\hat{k}, p) = \begin{cases} \text{accept}(\hat{k}) & \text{if } p \geq 1 - \epsilon \\ \text{clarify}(\mathcal{K}_c) & \text{if } p < 1 - \epsilon \end{cases}$$

where $\epsilon$ is the maximum acceptable error probability from Requirement 3.

**Proposition 4 (Disambiguation Safety).** If the LLM's confidence score is calibrated (i.e., $P(\hat{k} = k^* \mid p) \geq p$ for all confidence levels $p$), then the disambiguation decision function satisfies Requirement 3:

$$P(\hat{k} = k^*) \geq 1 - \epsilon \text{ whenever outcome} = \text{accept}$$

*Proof.* The accept condition requires $p \geq 1 - \epsilon$. By calibration, $P(\hat{k} = k^* \mid p) \geq p \geq 1 - \epsilon$. $\square$

In practice, LLM confidence scores are not perfectly calibrated [6], so we set $\epsilon$ conservatively (we use $\epsilon = 0.05$) and validate calibration empirically on a held-out query set.

---

## 7. Stage 4: Guardrailed SQL Generation

### 7.1 Template-Based Generation

Once the KPI is resolved, SQL generation uses a hybrid approach: a template library provides the structural skeleton, and parameterization fills in the specific values.

**Definition 7 (SQL Template).** A template $T$ is a SQL string with typed placeholders:

$$T(\text{kpi\_id}: \text{int},\; \text{period}: \text{date},\; \text{entity}: \text{string}) = \text{SELECT } \ldots \text{ WHERE kpi\_id = :kpi\_id AND } \ldots$$

Templates are pre-authored and reviewed for each query pattern (peer comparison, time series trend, single-point lookup, cross-entity ranking).

### 7.2 Formal Safety Properties

**Theorem 3 (Injection Impossibility).** If all user-supplied values are passed as parameterized bindings (not string-interpolated into the SQL), then SQL injection is impossible:

$$\forall q \in \mathcal{Q}: \nexists \text{ substring } s \text{ of } q \text{ that executes as SQL}$$

*Proof.* Parameterized queries separate code (the SQL template) from data (the parameter values) at the database driver level [7]. The driver processes the SQL template as a prepared statement, compiling it into an execution plan before binding parameter values. Parameter values are treated as data literals, not as SQL syntax. Therefore, no content of $q$ — regardless of its structure or embedded SQL keywords — can alter the query's syntactic structure or execution plan. $\square$

**Theorem 4 (Schema Compliance).** If the template library $\mathcal{T}$ references only tables in $T_{\text{allowed}}$ and columns in $C_{\text{allowed}}$, and templates are selected (not generated), then Requirement 2 is satisfied:

$$\forall T \in \mathcal{T}: \text{tables}(T) \subseteq T_{\text{allowed}} \wedge \text{cols}(T) \subseteq C_{\text{allowed}}$$

$$\text{template\_select}: \mathcal{I} \rightarrow \mathcal{T} \implies \text{tables}(\text{SQL}(q)) \subseteq T_{\text{allowed}}$$

*Proof.* The SQL execution uses only templates from $\mathcal{T}$. Each template is authored and reviewed to reference only allowed tables and columns. Since no dynamic table or column names enter through parameters (which are values, not identifiers), the schema boundary is preserved. $\square$

### 7.3 Validation Layer

Even with template-based generation, a validation layer provides defense-in-depth:

1. **Whitelist check:** Parse the generated SQL AST and verify all table and column references against $T_{\text{allowed}}$ and $C_{\text{allowed}}$
2. **Operation check:** Verify the top-level operation is SELECT (no INSERT, UPDATE, DELETE, DROP)
3. **Structure check:** Compare the generated SQL structure against the expected template structure using tree edit distance on the AST
4. **Parameter type check:** Verify each bound parameter matches the expected type from the template definition

If any check fails, the query is rejected and logged for review — it never reaches the database.

<!-- VISUALIZATION SPEC: Guardrail validation flow
Vertical flow: generated SQL enters from top, passes through 4 validation gates.
Each gate is a checkpoint with a pass/fail indicator.
Interactive: provide a text input where user can type a SQL string (or select from examples including injection attempts).
The SQL flows through the gates, and injection attempts get rejected at specific gates with explanations.
Show the AST parse for the whitelist check.
Example inputs: normal query (passes all), SQL injection attempt (fails at parameterization), wrong table reference (fails at whitelist), DELETE statement (fails at operation check).
Animate: green checkmarks appear as each gate passes, red X with explanation if it fails.
-->

---

## 8. Stage 5: Deterministic Result Formatting

The final stage transforms raw query results into the output format $\omega$ specified in the intent. This stage is entirely deterministic — no LLM involvement:

$$s_5: (\text{QueryResult}, \omega) \rightarrow \mathcal{R}$$

Output types include comparison tables, trend charts, summary statistics, and narrative descriptions (generated from templates, not LLMs).

---

## 9. On the Two-Week Delivery

The second version of this system was designed and deployed in two weeks. This timeline merits explanation because it appears to contradict the depth of engineering described above.

Three factors made this possible:

**Factor 1: Domain maturity.** Version 1 had been in production for months. The KPI catalog, data layer, entitlement model, and deployment infrastructure were stable. The rewrite replaced the query interface, not the foundation.

**Factor 2: Pre-crystallized architecture.** The five-stage decomposition, the embedding approach, the confidence thresholding protocol, and the guardrail layers had been explored and decided during months of research preceding the build. The architecture was ready; it needed to be written, not discovered.

**Factor 3: Framework standardization.** The codebase was built within an internal platform that handled authentication, entitlements, and deployment. Infrastructure was not in scope.

The lesson: speed in delivery comes from depth in preparation. The two weeks of building was enabled by months of thinking.

---

## 10. Related Work

**Text-to-SQL benchmarks.** Spider [4] and WikiSQL [8] evaluate end-to-end accuracy but do not measure safety properties (injection resistance, schema compliance) or disambiguation quality. Our pipeline is designed for these properties first, accuracy second.

**Decomposed approaches.** DIN-SQL [1] decomposes text-to-SQL into sub-problems but uses LLM generation at each stage. Our approach restricts LLM use to intent parsing and disambiguation, using deterministic templates for SQL generation.

**Embedding-based retrieval.** Dense retrieval methods [9] using sentence transformers have shown strong performance for semantic matching tasks. We apply this specifically to KPI catalog matching with a disambiguation overlay.

**SQL safety.** OWASP SQL injection prevention [7] establishes parameterization as the primary defense. Our contribution is integrating this with LLM-generated queries where the attack surface is the natural language input, not a traditional form field.

---

## 11. Conclusion

The five-stage decomposition transforms text-to-SQL from a monolithic generation task into a pipeline with formal safety properties. By factoring the problem into intent parsing, embedding-based detection, confidence-thresholded disambiguation, template-based generation with parameterization, and deterministic formatting, we achieve injection impossibility, schema compliance, and disambiguation correctness — properties that are provable, not aspirational.

The key insight: **decomposition is itself the primary guardrail.** Each stage has a narrow contract, a testable interface, and clear failure modes. When something goes wrong, you know which stage failed. When the catalog grows, you know which stage to extend. When requirements change, you know which stage to modify without risking the others.

---

## References

[1] Pourreza, M. and Rafiei, D. "DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction." *NeurIPS 2023*.

[2] Gao, D., et al. "Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation." *VLDB 2024*.

[3] Dong, X., et al. "C3: Zero-shot Text-to-SQL with ChatGPT." *arXiv preprint arXiv:2307.07306* (2023).

[4] Yu, T., et al. "Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task." *EMNLP 2018*.

[5] Reimers, N. and Gurevych, I. "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks." *EMNLP 2019*.

[6] Kadavath, S., et al. "Language Models (Mostly) Know What They Know." *arXiv preprint arXiv:2207.05221* (2022).

[7] OWASP Foundation. "SQL Injection Prevention Cheat Sheet." https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

[8] Zhong, V., Xiong, C., and Socher, R. "Seq2SQL: Generating Structured Queries from Natural Language using Reinforcement Learning." *arXiv preprint arXiv:1709.00103* (2017).

[9] Karpukhin, V., et al. "Dense Passage Retrieval for Open-Domain Question Answering." *EMNLP 2020*.

---

## Further Reading

- Rajkumar, N., et al. "Evaluating the Text-to-SQL Capabilities of Large Language Models." *arXiv preprint arXiv:2204.00498* (2023).
- Li, J., et al. "Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs." *NeurIPS 2023*.
- Bird, S., et al. "Towards a Unified Multi-Dimensional Evaluator for Text-to-SQL." *EMNLP 2023*.

---

<!-- DIAGRAM SPEC: Full Pipeline Architecture (Hero Diagram for This Post)

Layout: Horizontal flow, 5 stages as distinct blocks connected by typed arrows

[NL Query] → STAGE 1: Intent Parser
  → labeled arrow: "Structured Intent (μ, τ, δ, ω)"
  → STAGE 2: KPI Detector (Embeddings)
  → labeled arrow: "Candidate Set K_c"
  → STAGE 3: Disambiguator
    ↗ (high confidence): labeled arrow "Resolved KPI k̂"
    ↘ (low confidence): dashed arrow "Clarification Request" back to user
  → STAGE 4: SQL Generator + Guardrails
    Sub-diagram: [Template Select] → [Parameterize] → [Validate (4 checks)] → [Execute]
  → labeled arrow: "Query Results"
  → STAGE 5: Formatter
  → [Formatted Response]

Color coding:
- Stages using LLM: blue tint
- Deterministic stages: green tint  
- Guardrail checks: amber/warning tint

Interactive:
- Click any stage to see the formal definition and I/O types
- Toggle "show safety properties" to overlay which theorem applies at each stage
- Enter a sample query to see it flow through the pipeline with real-time stage outputs
- Enter an adversarial query (SQL injection) to see which guardrail catches it

Animation:
1. Query enters from left
2. Flows through each stage with a brief transformation animation
3. At disambiguation: show the confidence score and the branching decision
4. At guardrails: show 4 checks executing sequentially with green checkmarks
5. Result exits right in the specified format
-->
