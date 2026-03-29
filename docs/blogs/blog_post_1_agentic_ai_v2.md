# Deterministic Agentic Architectures for Enterprise Financial Analytics: A Separation-of-Concerns Approach to LLM-Powered Decision Systems

**Author:** Harmilap Singh Dhaliwal
**Date:** March 2026
**Keywords:** agentic AI, deterministic agents, LLM routing, enterprise security, entitlement modeling, responsible AI

---

## Abstract

Large Language Models (LLMs) have demonstrated remarkable capability in natural language understanding, yet their probabilistic nature and opaque reasoning present fundamental challenges for enterprise financial systems requiring deterministic correctness, fine-grained access control, and regulatory auditability. This paper presents an architectural pattern — **LLM-as-Router** — that leverages language model strengths (intent classification, semantic parsing) while explicitly preventing their weaknesses (unreliable computation, data leakage) from affecting system outputs. We formalize the separation of concerns between an intent detection layer and a deterministic computation layer, prove that this architecture preserves data confidentiality under defined threat models, and describe a production implementation processing ~40,000 employee transits across ~9,000 organizational rollups with millisecond-level query response for a major bank's CFO Group.

---

## 1. Introduction

Enterprise AI systems operating on sensitive financial data face a trilemma: they must be *intelligent* (understand natural language queries), *correct* (produce deterministic, auditable results), and *secure* (enforce fine-grained access controls). Existing LLM-powered analytics tools typically sacrifice correctness and security for intelligence, passing sensitive data through model context windows and relying on probabilistic inference for computation [1, 2].

We argue that this tradeoff is architectural, not fundamental. By decomposing the system into two layers with distinct computational properties — a stateless, data-free intent detection layer powered by an LLM, and a stateful, data-rich deterministic computation layer powered by conventional software — we achieve all three properties simultaneously.

The contributions of this paper are:
1. A formal definition of the **LLM-as-Router** architecture pattern for enterprise AI
2. A proof that the architecture preserves data confidentiality under a defined threat model
3. A formalization of EPM-to-SQL entitlement translation as a lattice-preserving mapping
4. A production validation at enterprise scale

---

## 2. Problem Formulation

### 2.1 System Requirements

Let $\mathcal{Q}$ denote the space of natural language queries, $\mathcal{D}$ the space of sensitive enterprise data, and $\mathcal{R}$ the space of formatted responses. We seek a function $f: \mathcal{Q} \rightarrow \mathcal{R}$ such that:

**Requirement 1 (Semantic Understanding).** $f$ must map semantically equivalent queries to equivalent responses:

$$q_1 \equiv_{\text{sem}} q_2 \implies f(q_1) = f(q_2)$$

**Requirement 2 (Deterministic Correctness).** For any query $q$ with a well-defined answer $r^*$ derivable from $\mathcal{D}$, the system must return exactly $r^*$:

$$f(q) = r^* = g(\mathcal{D}, \phi(q))$$

where $\phi(q)$ is the structured representation of $q$ and $g$ is a deterministic computation function.

**Requirement 3 (Data Confidentiality).** The LLM component $\mathcal{L}$ must never observe any element of $\mathcal{D}$:

$$\mathcal{L}.\text{context} \cap \mathcal{D} = \emptyset$$

**Requirement 4 (Entitlement Enforcement).** For a user $u$ with permission set $P(u)$, the visible data must be restricted:

$$f_u(q) = g(\mathcal{D}|_{P(u)}, \phi(q))$$

where $\mathcal{D}|_{P(u)}$ denotes $\mathcal{D}$ filtered to the subset authorized for $u$.

### 2.2 Why Monolithic LLM Architectures Fail

A monolithic architecture passes both the query and relevant data into a single LLM call:

$$f_{\text{mono}}(q) = \mathcal{L}(q, \mathcal{D}_{\text{relevant}})$$

This violates Requirement 3 by construction. It also violates Requirement 2 because LLM outputs are stochastic — the same prompt produces different outputs across invocations [3]. Temperature zero does not guarantee determinism across model versions or API updates.

<!-- VISUALIZATION SPEC: Architecture comparison diagram
Two architectures side by side:
LEFT: "Monolithic" — single box with LLM receiving both query and data, red X marks on security and determinism
RIGHT: "LLM-as-Router" — two-layer split, LLM receives only query, agents receive only structured intent, green checkmarks on all requirements
Animate: draw left first, show failure modes appearing as red annotations, then draw right showing the separation
-->

---

## 3. Architecture: LLM-as-Router

### 3.1 Formal Definition

**Definition 1 (LLM-as-Router Architecture).** A system $\mathcal{S}$ implements the LLM-as-Router pattern if it decomposes into two components:

$$\mathcal{S} = \mathcal{L}_{\text{route}} \circ \mathcal{A}_{\text{compute}}$$

where:
- $\mathcal{L}_{\text{route}}: \mathcal{Q} \rightarrow \mathcal{I}$ is a **routing function** implemented by an LLM, mapping natural language queries to a structured intent space $\mathcal{I}$
- $\mathcal{A}_{\text{compute}}: \mathcal{I} \times \mathcal{D} \rightarrow \mathcal{R}$ is a **computation function** implemented by deterministic agents, mapping intents and data to responses
- $\mathcal{L}_{\text{route}}$ receives no element of $\mathcal{D}$ as input

### 3.2 Intent Space

The intent space $\mathcal{I}$ is a structured schema:

$$\mathcal{I} = \{(c, \theta, \tau, \omega) \mid c \in \mathcal{C},\; \theta \in \Theta,\; \tau \in \mathcal{T},\; \omega \in \Omega\}$$

where:
- $c \in \mathcal{C} = \{\text{headcount}, \text{cost}, \text{positions}\}$ is the **domain class**
- $\theta \in \Theta$ is the **query parameter set** (time range, organizational scope, comparison type)
- $\tau \in \mathcal{T}$ is the **temporal specification** (point-in-time, range, trend)
- $\omega \in \Omega$ is the **output format** (table, chart, summary, report)

The intent space is finite and enumerable, which is what makes the downstream agents deterministic — they handle a known set of structured inputs, not open-ended natural language.

### 3.3 Sub-Agent Orchestration

The computation layer consists of $k$ specialized sub-agents $\{A_1, A_2, \ldots, A_k\}$, each handling a partition of the domain class space:

$$\mathcal{A}_{\text{compute}}(i, \mathcal{D}) = A_{c(i)}(\theta(i), \tau(i), \omega(i), \mathcal{D}|_{P(u)})$$

In the production system, $k = 3$: an EPM/cost agent, a headcount agent, and an open positions agent. These execute in parallel:

$$\mathcal{A}_{\text{compute}} = A_1 \| A_2 \| A_3$$

**Proposition 1 (Parallel Correctness).** If each sub-agent $A_j$ is deterministic and operates on disjoint data partitions, then parallel execution preserves correctness:

$$\forall j \neq j': \mathcal{D}_j \cap \mathcal{D}_{j'} = \emptyset \implies (A_1 \| A_2 \| A_3)(i, \mathcal{D}) = A_{c(i)}(i, \mathcal{D}_{c(i)})$$

*Proof.* Since each agent reads only from its own data partition and writes only to its own output buffer, there are no read-write conflicts. The routing function $c(i)$ selects exactly one agent per query. The other agents either idle (no matching intent) or handle independent concurrent queries. By the absence of shared mutable state, parallel execution is equivalent to serial execution of the selected agent. $\square$

<!-- VISUALIZATION SPEC: Sub-agent parallel execution
Three agents as parallel tracks, with a router node at top distributing intents.
Interactive: user selects a query type from a dropdown, the corresponding agent track highlights and animates a data flow from DB → computation → response, while other tracks dim.
Show timing: parallel execution completes in max(t_1, t_2, t_3) not sum.
-->

---

## 4. Data Confidentiality Guarantee

### 4.1 Threat Model

We consider a threat model where the LLM provider is an honest-but-curious adversary: it faithfully processes inputs but may retain or leak context window contents. This is the standard concern for enterprise LLM deployment [4].

**Definition 2 (Context Exposure Set).** The context exposure set $\mathcal{E}(\mathcal{L})$ of an LLM component $\mathcal{L}$ is the union of all inputs provided to $\mathcal{L}$ across all invocations:

$$\mathcal{E}(\mathcal{L}) = \bigcup_{t} \text{input}_t(\mathcal{L})$$

**Theorem 1 (Data Confidentiality).** In an LLM-as-Router architecture $\mathcal{S} = \mathcal{L}_{\text{route}} \circ \mathcal{A}_{\text{compute}}$, if $\mathcal{L}_{\text{route}}$ receives only elements of $\mathcal{Q}$ (natural language queries) and system prompts $\mathcal{P}$ (containing schema metadata but no data values), then:

$$\mathcal{E}(\mathcal{L}_{\text{route}}) \cap \mathcal{D} = \emptyset$$

*Proof.* By construction, $\mathcal{L}_{\text{route}}: \mathcal{Q} \rightarrow \mathcal{I}$. The input to $\mathcal{L}_{\text{route}}$ at each invocation is $(q_t, p)$ where $q_t \in \mathcal{Q}$ and $p \in \mathcal{P}$. Since $\mathcal{Q}$ contains only user-generated natural language and $\mathcal{P}$ contains only structural metadata (table names, column types, domain labels — not data values), and $\mathcal{D}$ contains only data values (employee records, financial figures, organizational assignments):

$$\mathcal{E}(\mathcal{L}_{\text{route}}) = \bigcup_t \{q_t\} \cup \{p\} \subseteq \mathcal{Q} \cup \mathcal{P}$$

Since $(\mathcal{Q} \cup \mathcal{P}) \cap \mathcal{D} = \emptyset$ by the domain separation assumption, the result follows. $\square$

**Corollary 1.** Even if the LLM provider retains all context window contents indefinitely, no sensitive enterprise data is exposed.

### 4.2 Boundary Enforcement

The confidentiality guarantee holds only if the architectural boundary is enforced — i.e., no code path exists that passes data values to the LLM. In the production system, this is enforced by:

1. **Interface typing:** The routing function's input type signature accepts only `(query: string, system_prompt: string)` — no data parameters exist in the function signature
2. **Network isolation:** The LLM API call originates from a service that has no database credentials and no access to data stores
3. **Audit logging:** Every LLM invocation is logged with its full input, enabling automated verification that $\mathcal{E}(\mathcal{L}) \cap \mathcal{D} = \emptyset$

---

## 5. Entitlement Model: EPM-to-SQL Translation

### 5.1 The Translation Problem

Enterprise Performance Management (EPM) systems enforce access control through multidimensional cube permissions — a user may see certain intersections of dimensions (e.g., "Risk division × North America × FY2025") but not others. SQL databases enforce access through row-level predicates. Translating between these models is non-trivial because cube permissions are *conjunctive* over dimensions while SQL predicates are *disjunctive* over rows.

### 5.2 Formal Model

**Definition 3 (EPM Permission Structure).** An EPM permission set for user $u$ is a set of authorized dimension intersections:

$$P(u) = \{(d_1^{(j)}, d_2^{(j)}, \ldots, d_n^{(j)})\}_{j=1}^{m}$$

where each $d_i^{(j)} \in D_i$ is an element of dimension $i$ (organizational unit, geography, time period, etc.).

**Definition 4 (SQL Entitlement Filter).** The corresponding SQL filter is a predicate $\sigma_u$ such that for any row $r$ in the data table:

$$\sigma_u(r) = \text{true} \iff \exists j: \bigwedge_{i=1}^{n} r.d_i = d_i^{(j)}$$

That is, a row is visible if and only if its dimension values match at least one authorized intersection.

### 5.3 The Translation Pipeline

The production system implements this translation as a four-stage pipeline:

$$\text{EPM Cubes} \xrightarrow{\alpha} \text{Security Groups} \xrightarrow{\beta} \text{Employee Sets} \xrightarrow{\gamma} \text{Transit Filters} \xrightarrow{\delta} \text{SQL WHERE Clauses}$$

**Stage $\alpha$:** Extract permission grants from the EPM system as structured tuples $(u, D_1, D_2, \ldots, D_n)$.

**Stage $\beta$:** Map permission grants to security group memberships. Security groups represent natural organizational boundaries (e.g., "Division A Managers") and serve as a caching layer — permissions change slowly, so pre-computing group → employee mappings avoids runtime EPM queries.

**Stage $\gamma$:** Expand security groups to employee-level transit sets. A transit is the fundamental unit of the data model (see Section 6), representing an employee's assignment to an organizational position.

**Stage $\delta$:** Compile transit sets into parameterized SQL WHERE clauses:

```sql
WHERE transit_id IN (SELECT transit_id FROM entitlements WHERE user_id = :current_user)
```

**Proposition 2 (Entitlement Preservation).** The translation pipeline preserves the lattice structure of EPM permissions: if user $u_1$ has a subset of $u_2$'s permissions in EPM, then $u_1$ sees a subset of $u_2$'s data in SQL:

$$P(u_1) \subseteq P(u_2) \implies \mathcal{D}|_{P(u_1)} \subseteq \mathcal{D}|_{P(u_2)}$$

*Proof.* Each stage $\alpha, \beta, \gamma, \delta$ is monotone with respect to set inclusion. If $P(u_1) \subseteq P(u_2)$, then $\alpha(P(u_1)) \subseteq \alpha(P(u_2))$ (fewer permission grants → fewer security groups), $\beta(\alpha(P(u_1))) \subseteq \beta(\alpha(P(u_2)))$ (fewer security groups → fewer employees), and so on. Since each stage preserves subset relationships, the composition preserves them. $\square$

<!-- VISUALIZATION SPEC: EPM-to-SQL translation pipeline
Interactive: show a sample user with 3 dimension grants flowing through the 4 stages.
At each stage, show the data expanding (cubes → groups → employees → transits → SQL).
User can toggle between two different permission sets to see how the output SQL changes.
Animate the flow left-to-right with data counts at each stage.
-->

---

## 6. Event-Driven Data Model

### 6.1 Events vs. Snapshots

Traditional HR analytics systems use periodic snapshot models: headcount at time $t$ is a count of active employees in a snapshot table. This approach suffers from reconciliation errors when employees transfer between organizational units within the same reporting period.

We instead model workforce movements as a stream of discrete events at the transactional employee-by-transit level.

**Definition 5 (Workforce Event).** A workforce event $e$ is a tuple:

$$e = (\text{employee}_{\text{id}},\; \text{transit}_{\text{id}},\; \text{event\_type},\; \text{timestamp},\; \text{source\_rollup},\; \text{target\_rollup})$$

where $\text{event\_type} \in \{\text{New Hire},\; \text{Departure},\; \text{Lateral Move Out},\; \text{Lateral Move In},\; \text{Promotion}\}$.

### 6.2 Automatic Reconciliation

**Theorem 2 (Intra-Rollup Transfer Netting).** For any rollup $R$, if an employee $e$ transfers from position $p_1$ to position $p_2$ where both $p_1, p_2 \in R$, then the net headcount change for $R$ is zero:

$$\Delta H(R) = \sum_{e \in \text{events}(R)} \text{sign}(e) = (+1)_{\text{Move In}} + (-1)_{\text{Move Out}} = 0$$

*Proof.* An intra-rollup transfer generates exactly two events: a Lateral Move Out from $p_1$ (counted as $-1$) and a Lateral Move In to $p_2$ (counted as $+1$). Since both positions belong to the same rollup $R$, the contribution to $\Delta H(R)$ is $-1 + 1 = 0$. $\square$

This is guaranteed by construction, not by post-hoc reconciliation. The event model makes double-counting structurally impossible.

<!-- VISUALIZATION SPEC: Event model animation
Show a sample organizational hierarchy (3 divisions, 2 rollups each).
Animate an employee transferring: the "Lateral Move Out" event fires on the source, "Lateral Move In" on the target.
Show headcount counters updating in real-time.
For an intra-rollup transfer, highlight that the rollup counter doesn't change (net zero).
For an inter-rollup transfer, show source -1 and target +1.
Interactive: let user drag an employee between positions and watch the events + counters update.
-->

---

## 7. Production Validation

The architecture has been deployed in production serving a major bank's CFO Group with the following measured characteristics:

| Metric | Value |
|--------|-------|
| Employee transits processed | ~40,000 |
| Organizational rollups | ~9,000 |
| Geographies | ~60,000 |
| Query response latency | Millisecond-level |
| Sub-agent count | 3 (parallel) |
| LLM data exposure | Zero (by construction, per Theorem 1) |
| Entitlement model | EPM-to-SQL (per Section 5) |

The system delivers financial insights through three channels: a production-grade dynamic dashboard, a conversational chatbot interface, and inbox-ready HTML reports — all enforcing the same entitlement model.

---

## 8. Related Work

The separation of LLM reasoning from data computation relates to several active research threads:

**Tool-use architectures.** ReAct [5] and Toolformer [6] demonstrate LLMs using external tools, but typically pass data through the LLM context for reasoning. Our architecture is stricter: the LLM never sees data, only intents.

**Guardrailed generation.** NeMo Guardrails [7] and similar frameworks add safety filters around LLM outputs. Our approach is complementary but more fundamental — rather than filtering unsafe outputs, we prevent unsafe inputs.

**Text-to-SQL.** DIN-SQL [8] and DAIL-SQL [9] achieve strong results on benchmarks but assume the LLM can access schema and data. Our architecture restricts the LLM to schema metadata only.

**Agentic frameworks.** LangGraph [10], AutoGen [11], and CrewAI provide orchestration primitives. Our contribution is the formal separation guarantee and the entitlement-preserving data layer, which are architecture-level concerns above the framework level.

---

## 9. Conclusion

The LLM-as-Router pattern resolves the intelligence-correctness-security trilemma by architectural decomposition rather than compromise. By proving that the data confidentiality guarantee holds under an honest-but-curious threat model, and that the entitlement translation preserves the permission lattice, we provide formal foundations for deploying LLM-powered systems in regulated enterprise environments.

The key insight is simple but consequential: **use LLMs for what they're good at (understanding language), and use deterministic systems for what they're good at (computing answers).** The architectural boundary between these two capabilities is where trust is built.

---

## References

[1] Zhao, W.X., et al. "A Survey of Large Language Models." *arXiv preprint arXiv:2303.18223* (2023).

[2] Sun, Z., et al. "TrustLLM: Trustworthiness in Large Language Models." *arXiv preprint arXiv:2401.05561* (2024).

[3] Ouyang, S., et al. "LLM is Like a Box of Chocolates: the Non-determinism of ChatGPT in Code Generation." *arXiv preprint arXiv:2308.02828* (2023).

[4] Li, H., et al. "Privacy in Large Language Models: Attacks, Defenses and Future Directions." *arXiv preprint arXiv:2310.10383* (2023).

[5] Yao, S., et al. "ReAct: Synergizing Reasoning and Acting in Language Models." *ICLR 2023*.

[6] Schick, T., et al. "Toolformer: Language Models Can Teach Themselves to Use Tools." *NeurIPS 2023*.

[7] Rebedea, T., et al. "NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications." *EMNLP 2023 (Demo)*.

[8] Pourreza, M. and Rafiei, D. "DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction." *NeurIPS 2023*.

[9] Gao, D., et al. "Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation." *VLDB 2024*.

[10] LangGraph Documentation. LangChain, Inc. https://langchain-ai.github.io/langgraph/

[11] Wu, Q., et al. "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation." *arXiv preprint arXiv:2308.08155* (2023).

---

## Further Reading

- Chase, H. "LangChain: Building Applications with LLMs through Composability." (2022). https://github.com/langchain-ai/langchain
- Anthropic. "Model Context Protocol (MCP) Specification." (2024). https://modelcontextprotocol.io
- Microsoft. "Responsible AI Principles." https://www.microsoft.com/en-us/ai/responsible-ai
- Google. "Secure AI Framework (SAIF)." (2023). https://safety.google/cybersecurity-advancements/saif/

---

<!-- DIAGRAM SPEC: Full System Architecture (Hero Diagram for This Post)

Layout: Top-to-bottom flow with clear two-layer separation

LAYER 1 (top, labeled "Intent Layer — LLM-Powered, Stateless, Data-Free"):
  [User Query (NL)] → [LLM Router] → [Structured Intent (c, θ, τ, ω)]
  
  Visual: LLM Router node has a shield icon indicating "no data passes through"
  Color: Blue/cool tones

LAYER 2 (bottom, labeled "Computation Layer — Deterministic, Stateful, Data-Rich"):
  [Structured Intent] → branches to 3 parallel tracks:
    Track 1: [EPM Agent] → [EPM Data Store]
    Track 2: [Headcount Agent] → [HR Event Store]  
    Track 3: [Open Positions Agent] → [Positions DB]
  
  All three tracks merge into → [Response Formatter] → [Dashboard | Chatbot | Report]
  
  Cross-cutting: [Entitlement Filter] spans all three data stores
  Color: Green/warm tones

BOUNDARY LINE between layers: dashed red line labeled "Data Boundary — nothing crosses"

Animation:
1. Query enters from top
2. Flows through LLM Router (brief glow)
3. Intent classification appears as structured text
4. Intent routes to one of three agent tracks (other two dim)
5. Selected agent queries data store (entitlement filter flashes)
6. Response flows back up through formatter
7. Output appears in one of three channels

Interactive: 
- Dropdown to select query type → changes which agent track highlights
- Toggle to show/hide the entitlement filter layer
- Hover on any node for a tooltip with formal definition
-->
