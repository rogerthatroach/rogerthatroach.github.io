# Handoff: Blog Post — Enterprise Agentic AI Architecture

> **For:** Claude Code  
> **Repo:** rogerthatroach.github.io  
> **Priority:** High — this is a portfolio differentiator for the Head of Applied AI application (deadline April 11)  
> **Read first:** CLAUDE.md, docs/specs/PORTFOLIO_SPEC.md, docs/CHANGELOG.md

---

## 1. What to build

Add a **blog/writing section** to the portfolio with this as the first post. If a blog section doesn't exist yet, create one. The blog should feel like a natural extension of the portfolio — same design system, same dark theme, same typography. Each post gets its own page (routed, not a modal or accordion).

**Blog index page:** `/blog` or `/writing` — a clean list of posts with title, date, reading time, and a 1-line description. Minimal. No cards or images — just typographic hierarchy.

**Individual post page:** `/blog/enterprise-agentic-ai-architecture` — full article with the architecture diagram rendered inline as an SVG component.

---

## 2. Blog post content

### Metadata

```typescript
{
  slug: "enterprise-agentic-ai-architecture",
  title: "Building an Enterprise Agentic AI System: LangGraph, MCP Tools, and Multi-Layer RAG",
  subtitle: "How I designed an agentic platform that guides users through complex enterprise workflows — and the architectural decisions that made it work at scale.",
  date: "2026-03-29",
  readingTime: "6 min",
  tags: ["LangGraph", "MCP", "RAG", "Agentic AI", "PostgreSQL", "Enterprise AI"],
}
```

### Full article (markdown)

```markdown
## The problem

Enterprise organizations run on structured processes. Project approvals, budget requests, compliance reviews — these workflows are high-stakes, document-heavy, and riddled with institutional knowledge that lives in people's heads rather than systems. A single approval request might require understanding historical precedents, organizational policies, template conventions, and domain-specific terminology — all while navigating ambiguity in what the requester actually needs.

Most teams throw a chatbot at this. Ask a question, get an answer. But that mental model breaks immediately. The user doesn't need a Q&A interface. They need a *collaborator* — something that understands where they are in a multi-step process, holds context across the entire session, pulls the right reference material at the right moment, and resolves contradictions between policy documents without the user knowing there was a conflict.

That's a fundamentally different problem than retrieval-augmented generation. It's an orchestration problem.

## The constraints

Three constraints shaped every design decision.

**No sensitive data in LLM context.** In regulated environments, you cannot pass operational data through third-party LLM endpoints. Period. This means the LLM handles reasoning and routing — but deterministic code handles data access, computation, and document retrieval. The architecture must enforce this separation structurally, not through prompting alone.

**Multi-document, multi-format retrieval.** Users upload their own documents (PDFs, slide decks, Word files, plain text) alongside the system's policy corpus. A naive RAG pipeline that treats everything as flat text chunks will miss structural cues — a table in a PDF, a numbered list in a policy doc, a hierarchical outline in a slide deck. The chunking and embedding strategy has to be format-aware.

**Stateful, multi-step workflows.** Unlike single-turn Q&A, an approval request unfolds over dozens of interactions. The system needs to remember what the user said in step 2 when they're on step 14. It needs to know which template fields have been filled, which are conflicting, and which are ambiguous. Vanilla RAG has no concept of workflow state.

## The architecture

I built this as a **LangGraph agentic system** — a directed graph of specialized nodes, each responsible for one discrete task, orchestrated through a state machine that tracks workflow progress.

<!-- RENDER ARCHITECTURE DIAGRAM HERE — see SVG section below -->

### Why LangGraph over vanilla chains

LangChain's sequential chains work for single-turn pipelines. But when you need conditional branching (did the user answer the question or ask a clarifying one?), parallel execution (fetch policy context while parsing the uploaded document), and persistent state across turns — you need a graph. LangGraph models the workflow as nodes and edges with a shared state object that persists across the entire session. Each node reads state, does its job, writes back. The graph decides what runs next.

This is the same pattern as deterministic agent orchestration I've used in other systems: the LLM provides intelligence at specific decision points, but the *flow* is controlled by code. You get the reasoning capabilities of LLMs without surrendering control of execution order.

### MCP tools as the action layer

Model Context Protocol (MCP) tools handle the actions the agent can take — and critically, they define the *boundaries* of what the agent is allowed to do. Each tool is a typed function with explicit inputs, outputs, and validation:

- **Template selection:** Given the user's intent and organizational context, select the correct workflow template from the catalog. This isn't keyword matching — it's semantic similarity against template descriptions, filtered by business rules.
- **Field assignment:** Map the user's natural language input to specific template fields. When the user says "the budget is roughly 2M over two years," the tool decomposes that into annual figures, maps them to the right fields, and flags assumptions for user confirmation.
- **Conflict resolution:** When two sources (say, the user's uploaded brief and an existing policy document) provide contradictory guidance for the same field, the tool surfaces the conflict explicitly rather than silently picking one.
- **Ambiguity detection:** When the system can't confidently assign a value — because the input is vague, or the field has domain-specific meaning — it flags the ambiguity and generates a targeted clarifying question.

The MCP pattern matters because it makes the agent's capabilities auditable. Every action is a tool call with logged inputs and outputs. You can reconstruct exactly what the system did and why — which is non-negotiable in regulated environments.

### Multi-layer RAG: not one pipeline, three

The naive approach to RAG is one vector store, one retrieval step, one context window. That fails here for three reasons: the context sources are heterogeneous, the relevance criteria change per step, and the volume exceeds a single context window.

I designed three retrieval layers, each serving a different purpose:

**Layer 1 — Conversation history.** Every user message and system response is embedded and stored in PostgreSQL (using pgvector). When the user references something from earlier in the session — "use the same budget figure from before" — the system retrieves the relevant exchange by semantic similarity, not just recency. This eliminates the context loss problem that plagues long multi-turn sessions.

**Layer 2 — Uploaded documents.** Users attach their own reference materials. These go through a format-aware chunking pipeline: PDFs are parsed with layout detection (tables, headers, lists treated as structural units, not arbitrary character splits), slide decks preserve slide boundaries, and Word documents respect heading hierarchy. Chunks are embedded and indexed per session. Retrieval is scoped to the current user's uploads — never cross-contaminated.

**Layer 3 — Institutional knowledge.** The policy corpus, historical examples, and best practices live in a persistent vector store. But retrieval here isn't just similarity search — there's a second RAG layer that selects which *prompt template* to use for field assignment based on the field type and domain context. A financial field gets a different extraction prompt than a timeline field, because the reasoning required is different.

### PostgreSQL as the backbone

I chose PostgreSQL with pgvector over dedicated vector databases for a deliberate reason: it unifies structured metadata (workflow state, template definitions, field schemas, user sessions) and vector embeddings in a single transactional store. When the agent needs to check "which fields are still empty" AND "what's the most relevant policy for field X" — that's one query, not a cross-system join. In an enterprise environment where every new service adds operational overhead, consolidating on a proven, supported database is a pragmatic choice.

## The impact

The system transforms a process that took days or weeks of drafting — involving back-and-forth emails, policy lookups, and template confusion — into a guided, interactive session where the AI handles retrieval, conflict resolution, and formatting while the human focuses on substance.

But the deeper impact is architectural. This pattern — LangGraph for orchestration, MCP tools for auditable actions, multi-layer RAG for heterogeneous retrieval, PostgreSQL for unified state — is reusable. It applies to any enterprise workflow that involves multi-step document creation with institutional knowledge: regulatory filings, investment memos, compliance reviews, onboarding packages.

The key insight isn't any single component. It's the separation of concerns: **LLMs reason, tools act, code controls flow, and the database remembers.** That separation is what makes agentic AI viable in regulated enterprise environments — not prompt engineering tricks, but structural guarantees about what the system can and cannot do.

---

*This post describes architectural patterns and design decisions. No proprietary implementation details, internal systems, or confidential data are disclosed.*

---

## References

[1] Yao, S. et al. "ReAct: Synergizing Reasoning and Acting in Language Models." *ICLR 2023*.
[2] Schick, T. et al. "Toolformer: Language Models Can Teach Themselves to Use Tools." *NeurIPS 2023*.
[3] Wang, L. et al. "A Survey on Large Language Model based Autonomous Agents." *arXiv preprint* (2023).
[4] Wu, Q. et al. "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation." *arXiv preprint* (2023).
[5] Anthropic. "Model Context Protocol Specification." *modelcontextprotocol.io* (2024).
[6] Chase, H. "LangGraph: Multi-Actor Applications with LLMs." *LangChain, Inc.* (2024).
[7] Lewis, P. et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *NeurIPS 2020*.
[8] Guu, K. et al. "REALM: Retrieval-Augmented Language Model Pre-Training." *ICML 2020*.
[9] Reimers, N. & Gurevych, I. "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks." *EMNLP 2019*.
[10] Li, H. et al. "Privacy in Large Language Models: Attacks, Defenses and Future Directions." *arXiv preprint* (2023).
[11] Patil, S. et al. "Gorilla: Large Language Model Connected with Massive APIs." *arXiv preprint* (2023).
[12] Wei, J. et al. "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." *NeurIPS 2022*.
[13] Mialon, G. et al. "Augmented Language Models: A Survey." *Transactions on Machine Learning Research* (2023).
[14] Johnson, J. et al. "Billion-Scale Similarity Search with GPUs." *IEEE Transactions on Big Data* (2021).

## Further Reading

- LangGraph Documentation. https://langchain-ai.github.io/langgraph/
- Model Context Protocol (MCP). https://modelcontextprotocol.io/
- pgvector: Open-Source Vector Similarity Search for PostgreSQL. https://github.com/pgvector/pgvector
- Weng, L. "LLM Powered Autonomous Agents." https://lilianweng.github.io/posts/2023-06-23-agent/ (2023).
- Microsoft Responsible AI Standard. https://www.microsoft.com/en-us/ai/responsible-ai
```

---

## 3. Architecture diagram — SVG code

Render this as a React component (`ArchitectureDiagramPAR.tsx` or similar). The SVG should be inline in the blog post, placed after the "The architecture" heading and before "Why LangGraph over vanilla chains."

Adapt the colors to the portfolio's design system (dark background). The SVG below uses CSS variables — map them to whatever the portfolio's theme tokens are. If the portfolio uses a dark theme by default, the light fills (50-stop) should become the dark fills (800-stop) and vice versa.

```svg
<svg width="100%" viewBox="0 0 680 720" xmlns="http://www.w3.org/2000/svg">

  <!-- Title -->
  <text fill="var(--text-secondary, #a1a1aa)" font-family="var(--font-sans, 'Inter', sans-serif)" font-size="14" font-weight="500" x="340" y="30" text-anchor="middle">Enterprise agentic AI architecture</text>
  <text fill="var(--text-muted, #71717a)" font-family="var(--font-sans, 'Inter', sans-serif)" font-size="12" x="340" y="48" text-anchor="middle">LangGraph + MCP tools + multi-layer RAG</text>

  <!-- ============ USER INPUT ============ -->
  <rect x="240" y="70" width="200" height="44" rx="8" fill="var(--surface-2, #27272a)" stroke="var(--border, #3f3f46)" stroke-width="0.5"/>
  <text fill="var(--text-primary, #e4e4e7)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="340" y="96" text-anchor="middle">User input</text>

  <!-- Arrow down -->
  <line x1="340" y1="114" x2="340" y2="144" stroke="var(--border, #3f3f46)" stroke-width="1.5"/>
  <polygon points="334,140 340,150 346,140" fill="var(--border, #3f3f46)"/>

  <!-- ============ LANGGRAPH ORCHESTRATION CONTAINER ============ -->
  <rect x="60" y="144" width="560" height="120" rx="16" fill="var(--purple-fill, rgba(124,58,237,0.08))" stroke="var(--purple-border, rgba(124,58,237,0.3))" stroke-width="0.5"/>
  <text fill="var(--purple-text, #a78bfa)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="340" y="170" text-anchor="middle">LangGraph orchestration</text>
  <text fill="var(--purple-text-muted, #7c3aed)" font-family="var(--font-sans)" font-size="12" x="340" y="188" text-anchor="middle" opacity="0.7">Directed graph with persistent state machine</text>

  <!-- Internal nodes -->
  <rect x="86" y="200" width="110" height="44" rx="6" fill="var(--teal-fill, rgba(20,184,166,0.12))" stroke="var(--teal-border, rgba(20,184,166,0.3))" stroke-width="0.5"/>
  <text fill="var(--teal-text, #5eead4)" font-family="var(--font-sans)" font-size="13" font-weight="500" x="141" y="226" text-anchor="middle">Parse intent</text>

  <line x1="196" y1="222" x2="216" y2="222" stroke="var(--border)" stroke-width="1"/>
  <polygon points="212,219 220,222 212,225" fill="var(--border)"/>

  <rect x="216" y="200" width="110" height="44" rx="6" fill="var(--teal-fill)" stroke="var(--teal-border)" stroke-width="0.5"/>
  <text fill="var(--teal-text)" font-family="var(--font-sans)" font-size="13" font-weight="500" x="271" y="226" text-anchor="middle">Route</text>

  <line x1="326" y1="222" x2="346" y2="222" stroke="var(--border)" stroke-width="1"/>
  <polygon points="342,219 350,222 342,225" fill="var(--border)"/>

  <rect x="346" y="200" width="128" height="44" rx="6" fill="var(--teal-fill)" stroke="var(--teal-border)" stroke-width="0.5"/>
  <text fill="var(--teal-text)" font-family="var(--font-sans)" font-size="13" font-weight="500" x="410" y="226" text-anchor="middle">Execute tool</text>

  <line x1="474" y1="222" x2="494" y2="222" stroke="var(--border)" stroke-width="1"/>
  <polygon points="490,219 498,222 490,225" fill="var(--border)"/>

  <rect x="494" y="200" width="110" height="44" rx="6" fill="var(--teal-fill)" stroke="var(--teal-border)" stroke-width="0.5"/>
  <text fill="var(--teal-text)" font-family="var(--font-sans)" font-size="13" font-weight="500" x="549" y="226" text-anchor="middle">Respond</text>

  <!-- Arrows down to MCP + RAG -->
  <line x1="220" y1="264" x2="220" y2="300" stroke="var(--border)" stroke-width="1.5"/>
  <polygon points="214,296 220,306 226,296" fill="var(--border)"/>
  <text fill="var(--text-muted)" font-family="var(--font-sans)" font-size="11" x="228" y="286">Tools</text>

  <line x1="460" y1="264" x2="460" y2="300" stroke="var(--border)" stroke-width="1.5"/>
  <polygon points="454,296 460,306 466,296" fill="var(--border)"/>
  <text fill="var(--text-muted)" font-family="var(--font-sans)" font-size="11" x="468" y="286">Retrieval</text>

  <!-- ============ MCP TOOLS CONTAINER ============ -->
  <rect x="60" y="300" width="280" height="200" rx="16" fill="var(--coral-fill, rgba(239,68,68,0.06))" stroke="var(--coral-border, rgba(239,68,68,0.25))" stroke-width="0.5"/>
  <text fill="var(--coral-text, #fca5a5)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="200" y="326" text-anchor="middle">MCP tools (action layer)</text>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="200" y="344" text-anchor="middle" opacity="0.6">Typed, logged, auditable</text>

  <!-- Tool boxes -->
  <rect x="80" y="360" width="120" height="44" rx="6" fill="var(--coral-fill-inner, rgba(239,68,68,0.1))" stroke="var(--coral-border)" stroke-width="0.5"/>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="140" y="378" text-anchor="middle">Template</text>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="140" y="394" text-anchor="middle">selection</text>

  <rect x="208" y="360" width="120" height="44" rx="6" fill="var(--coral-fill-inner)" stroke="var(--coral-border)" stroke-width="0.5"/>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="268" y="378" text-anchor="middle">Field</text>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="268" y="394" text-anchor="middle">assignment</text>

  <rect x="80" y="416" width="120" height="44" rx="6" fill="var(--coral-fill-inner)" stroke="var(--coral-border)" stroke-width="0.5"/>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="140" y="434" text-anchor="middle">Conflict</text>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="140" y="450" text-anchor="middle">resolution</text>

  <rect x="208" y="416" width="120" height="44" rx="6" fill="var(--coral-fill-inner)" stroke="var(--coral-border)" stroke-width="0.5"/>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="268" y="434" text-anchor="middle">Ambiguity</text>
  <text fill="var(--coral-text)" font-family="var(--font-sans)" font-size="12" x="268" y="450" text-anchor="middle">detection</text>

  <!-- ============ MULTI-LAYER RAG CONTAINER ============ -->
  <rect x="360" y="300" width="260" height="200" rx="16" fill="var(--blue-fill, rgba(59,130,246,0.06))" stroke="var(--blue-border, rgba(59,130,246,0.25))" stroke-width="0.5"/>
  <text fill="var(--blue-text, #93c5fd)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="490" y="326" text-anchor="middle">Multi-layer RAG</text>
  <text fill="var(--blue-text)" font-family="var(--font-sans)" font-size="12" x="490" y="344" text-anchor="middle" opacity="0.6">Three retrieval scopes</text>

  <!-- RAG layer rows -->
  <rect x="380" y="360" width="220" height="36" rx="6" fill="var(--blue-fill-inner, rgba(59,130,246,0.1))" stroke="var(--blue-border)" stroke-width="0.5"/>
  <text fill="var(--blue-text)" font-family="var(--font-sans)" font-size="12" x="490" y="382" text-anchor="middle">Layer 1: Conversation history</text>

  <rect x="380" y="404" width="220" height="36" rx="6" fill="var(--blue-fill-inner)" stroke="var(--blue-border)" stroke-width="0.5"/>
  <text fill="var(--blue-text)" font-family="var(--font-sans)" font-size="12" x="490" y="426" text-anchor="middle">Layer 2: Uploaded documents</text>

  <rect x="380" y="448" width="220" height="36" rx="6" fill="var(--blue-fill-inner)" stroke="var(--blue-border)" stroke-width="0.5"/>
  <text fill="var(--blue-text)" font-family="var(--font-sans)" font-size="12" x="490" y="470" text-anchor="middle">Layer 3: Institutional knowledge</text>

  <!-- Arrows down to PostgreSQL -->
  <line x1="200" y1="500" x2="200" y2="540" stroke="var(--border)" stroke-width="1.5"/>
  <polygon points="194,536 200,546 206,536" fill="var(--border)"/>

  <line x1="490" y1="500" x2="490" y2="540" stroke="var(--border)" stroke-width="1.5"/>
  <polygon points="484,536 490,546 496,536" fill="var(--border)"/>

  <!-- ============ POSTGRESQL BACKBONE ============ -->
  <rect x="100" y="540" width="480" height="70" rx="12" fill="var(--amber-fill, rgba(245,158,11,0.08))" stroke="var(--amber-border, rgba(245,158,11,0.3))" stroke-width="0.5"/>
  <text fill="var(--amber-text, #fbbf24)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="340" y="570" text-anchor="middle">PostgreSQL + pgvector</text>
  <text fill="var(--amber-text)" font-family="var(--font-sans)" font-size="12" x="340" y="590" text-anchor="middle" opacity="0.7">Unified store: workflow state, embeddings, metadata, sessions</text>

  <!-- ============ SEPARATION OF CONCERNS CALLOUT ============ -->
  <rect x="120" y="640" width="440" height="52" rx="8" fill="none" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3"/>
  <text fill="var(--text-primary, #e4e4e7)" font-family="var(--font-sans)" font-size="14" font-weight="500" x="340" y="662" text-anchor="middle">Separation of concerns</text>
  <text fill="var(--text-muted, #71717a)" font-family="var(--font-sans)" font-size="12" x="340" y="680" text-anchor="middle">LLMs reason — tools act — code controls flow — database remembers</text>

</svg>
```

### Color mapping guide

The SVG uses CSS custom properties. Map them to the portfolio's existing theme:

| SVG variable | Purpose | Suggested dark-theme value |
|---|---|---|
| `--text-primary` | Main text | zinc-200 / `#e4e4e7` |
| `--text-secondary` | Section headers | zinc-400 / `#a1a1aa` |
| `--text-muted` | Descriptions | zinc-500 / `#71717a` |
| `--surface-2` | Neutral box fills | zinc-800 / `#27272a` |
| `--border` | Lines, strokes | zinc-700 / `#3f3f46` |
| `--purple-fill` | LangGraph container | `rgba(124,58,237,0.08)` |
| `--purple-border` | LangGraph stroke | `rgba(124,58,237,0.3)` |
| `--purple-text` | LangGraph labels | violet-400 / `#a78bfa` |
| `--teal-fill` | Graph nodes | `rgba(20,184,166,0.12)` |
| `--teal-border` | Graph node strokes | `rgba(20,184,166,0.3)` |
| `--teal-text` | Graph node labels | teal-300 / `#5eead4` |
| `--coral-fill` | MCP container | `rgba(239,68,68,0.06)` |
| `--coral-border` | MCP strokes | `rgba(239,68,68,0.25)` |
| `--coral-text` | MCP labels | red-300 / `#fca5a5` |
| `--blue-fill` | RAG container | `rgba(59,130,246,0.06)` |
| `--blue-border` | RAG strokes | `rgba(59,130,246,0.25)` |
| `--blue-text` | RAG labels | blue-300 / `#93c5fd` |
| `--amber-fill` | PostgreSQL container | `rgba(245,158,11,0.08)` |
| `--amber-border` | PostgreSQL stroke | `rgba(245,158,11,0.3)` |
| `--amber-text` | PostgreSQL labels | amber-400 / `#fbbf24` |

If the portfolio already has a color system, use that. The key constraint is: each architectural layer gets its own color ramp so the diagram is scannable at a glance. Purple = orchestration, teal = graph nodes, coral/red = action tools, blue = retrieval, amber = storage.

---

## 4. Implementation notes

### File structure additions

```
app/
├── blog/
│   ├── page.tsx                            # Blog index
│   └── [slug]/
│       └── page.tsx                        # Individual post layout
components/
├── blog/
│   ├── BlogPostLayout.tsx                  # Post page wrapper (title, date, reading time, content)
│   ├── BlogIndex.tsx                       # List of posts
│   └── diagrams/
│       └── AgenticArchitectureDiagram.tsx   # The SVG above as a React component
data/
├── blog-posts.ts                           # Post metadata + content (or MDX if preferred)
```

### If MDX is already set up or preferred

Use MDX for the post content and import the diagram component inline:

```mdx
import { AgenticArchitectureDiagram } from '@/components/blog/diagrams/AgenticArchitectureDiagram'

## The architecture

I built this as a **LangGraph agentic system**...

<AgenticArchitectureDiagram />

### Why LangGraph over vanilla chains
```

### If using plain TypeScript data objects

Store the post content as a string in `data/blog-posts.ts` and render with a markdown renderer (e.g. `react-markdown`). Insert the diagram component at the marker `<!-- RENDER ARCHITECTURE DIAGRAM HERE -->`.

### Navigation

Add a "Writing" or "Blog" link to the site nav. Keep it simple — just the word, no icon.

### Typography for blog posts

- Body text: 16-18px, line-height 1.7-1.8, max-width ~680px (readable line length)
- Headings: same font family as the rest of the site, medium weight
- Code/technical terms: monospace inline, same as existing code styling
- Block quotes (the constraint sections): subtle left border + muted text
- The `---` horizontal rule before the disclaimer: thin, muted

### Responsive

The SVG uses `width="100%"` so it scales naturally. On mobile (<640px), it'll be narrow but still readable. No special handling needed.

---

## 5. Design intent

This blog post should feel like **a practitioner sharing architectural decisions** — not a marketing blog, not a tutorial. The tone is direct, opinionated, and specific. The reader should come away thinking "this person has built real systems and made hard tradeoffs."

The architecture diagram is the centerpiece of the post. It should be the thing someone screenshots and shares. Make sure it has breathing room — generous margin above and below, no text crowding it.

The disclaimer at the bottom ("This post describes architectural patterns...") is non-negotiable. It establishes the confidentiality boundary. Style it subtly (smaller, muted) but keep it.

---

## 6. Post-implementation checklist

- [ ] Blog index page exists at `/blog` or `/writing`
- [ ] Post renders at `/blog/enterprise-agentic-ai-architecture`
- [ ] Architecture diagram renders inline (not as an image — as SVG)
- [ ] Diagram colors match the portfolio's theme
- [ ] Nav includes a link to the blog section
- [ ] Post typography is readable (16-18px body, ~680px max-width)
- [ ] Mobile responsive — diagram scales, text reflows
- [ ] `npm run build` passes
- [ ] Disclaimer renders at bottom of post
- [ ] Update docs/CHANGELOG.md with this addition
