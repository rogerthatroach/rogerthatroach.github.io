# Brief: enterprise-agentic-ai-architecture

**Reader level:** engineer
**Target word count:** ~3,500 (currently ~2,200 in math-heavy form)
**Companion post:** par-assist-building (director register)
**Canonical sources:** `data/posts/enterprise-agentic-ai.mdx` + `docs/blogs/HANDOFF_BLOG_PAR_ASSIST.md` + `docs/career/CAREER_KNOWLEDGE_BASE.md` §PAR Assist

---

## Current state audit (against framework §1 spec)

| § | Section | Current coverage | Gap |
|---|---|---|---|
| 1 | Preamble | ❌ | Add 1-paragraph hook + companion-post cross-link |
| 2 | Context | ✅ strong (§1 Introduction) | — |
| 3 | Constraints | ⚠️ embedded as formal Requirements (Theorem 1) | **Add `<ConstraintsBlock />`** summary above the formal version |
| 4 | Options considered | ❌ only "monolithic fails" (§2.2) | **Add `<OptionsConsidered />`** for 3 decisions: orchestration framework, action boundary, retrieval architecture |
| 5 | Decision rationale | ⚠️ scattered in §3 subsections | **Add `<DecisionRationale />`** callouts per chosen option |
| 6 | Architecture | ✅ strong (§3 + diagram) | Could upgrade `AgenticArchitecturePAR.tsx` to the 14-node layer-coded version (already drafted in `.claude/worktrees/`) |
| 7 | Implementation | ⚠️ prose only, no code | Add 2–3 `<pre>` blocks: tool contract shape, retrieval config, state transition example |
| 8 | Metrics | ❌ §5 says "transforms days into guided session" — no numbers | **[REDACTED] user input needed** — see below |
| 9 | Timeline / velocity | ❌ missing | **[REDACTED] user input needed** |
| 10 | War stories | ❌ missing | **[REDACTED] user input needed** |
| 11 | Lessons | ⚠️ §5 has closing remark | Expand into its own section |
| 12 | References | ✅ 15+ CitationRef | — |

---

## Proposed rewrite scope

**Keep the math.** The formal Theorem/Proposition/Proof rigor is a differentiator for engineer-audience. Don't water it down.

**Layer the framework on top.** The framework components go BEFORE the formal treatment (reader gets the story, then the proof). Sequence:

1. Preamble (new, ~100 words)
2. §1 Context (keep existing)
3. `<ConstraintsBlock>` (new) — 3 constraints summarized
4. §2.1 System Requirements — the formal version with Theorem 1 (keep)
5. `<OptionsConsidered>` (new) — **orchestration decision**: LangGraph vs. LangChain chains vs. hand-rolled FSM vs. CrewAI
6. §2.2 Why Monolithic Fails (keep, rename to "Monolithic vs graph")
7. §3 Architecture (keep) + updated diagram
8. `<DecisionRationale option="LangGraph">` (new) — ties back to Requirement 2 + 4
9. §3.1 Why LangGraph Over Vanilla Chains (keep formal math)
10. `<OptionsConsidered>` (new) — **action boundary decision**: MCP vs. custom function calling vs. free-form tool use
11. §3.2 MCP Tools as the Action Layer (keep)
12. `<DecisionRationale option="MCP tools">` (new) — auditability causality
13. `<OptionsConsidered>` (new) — **retrieval decision**: single RAG vs. multi-layer RAG vs. graph RAG
14. §3.3 Multi-Layer RAG (keep)
15. §3.4 PostgreSQL (keep)
16. §4 Context Isolation (keep)
17. **NEW: Implementation** — 2–3 code shapes (tool contract signature, retrieval config, router switch)
18. **NEW: Metrics** — `<BeforeAfterDiff before={{...}} after={{...}} />` for the drafting time transformation
19. **NEW: Timeline** — November 2025 → February 2026 → April 2026 dates, parallel workstreams
20. **NEW: War stories** — 1–2 failed attempts or scope cuts
21. **NEW: Lessons** — expand the current §5 Remark
22. §5 Impact and Reusability (keep, rename to "Pattern reusability")
23. References (keep)

---

## [REDACTED] user input needed

Before shipping, user needs to resolve:

1. **Metrics (§8):**
   - Specific "before" drafting time: "days"? "weeks"? "~N hours of back-and-forth"?
   - Specific "after": "guided session"? "~M minutes to draft"? "N% reduction in revision cycles"?
   - Adoption/usage numbers if available (pilot N authors? ~M PARs drafted in first month?)
   - Are any of these shareable, or stay qualitative?

2. **Timeline (§9):**
   - Specific sprint counts / team-size at each phase (currently CAREER_KNOWLEDGE_BASE has "Nov 2025 one-page plan → Feb 2026 dev → April 16 2026 ship" — confirm + expand)
   - What were you running in parallel? (confirmed: Astraeus + Aegis v2)
   - Anything about how Amplify POC → productionization scope transition happened?

3. **War stories (§10) — pick one (or write your own):**
   - Candidate A: Single-pass RAG was latency-heavy and noisy → refactored to multi-layer RAG with format-aware chunking. Lesson: retrieval architecture must match source semantic shape.
   - Candidate B: Initial agent design was monolithic (one big agent with many tools) — hit context limits → refactored to graph with conditional routing. Lesson: orchestration is a graph problem, not a prompt problem.
   - Candidate C: Your call — prior scope cut, tool that got removed, architectural walk-back.

4. **Implementation code shapes:**
   - Can I show a pseudo-code tool contract signature? (e.g., `T_template_select: (intent, context) → { template_id, confidence, rationale }`)
   - OK to show anonymized config dict shape for retrieval (chunk_size, top_k, thresholds)?
   - State transition example from the router?

5. **Options considered — real alternatives:**
   - For **orchestration**: was CrewAI considered? AutoGen? Which others?
   - For **action boundary**: which tool-use patterns were tried before MCP?
   - For **retrieval**: did single-RAG baseline run first, then get replaced?

---

## Framework palette usage plan

- `<ConstraintsBlock>` — 1 instance, §3
- `<OptionsConsidered>` — 3 instances (orchestration, action boundary, retrieval)
- `<DecisionRationale>` — 3 instances matching the above
- `<BeforeAfterDiff>` — 1 instance, §8 metrics
- `<Glossed>` — wraps prose throughout, auto-lights PAR Assist / LangGraph / MCP / pgvector / etc. terms
- `<StepThrough>` — **maybe** — could walk through a sample drafting session as Implementation §7 anchor. Skippable; prose is fine.
- `<LayeredReveal>` — **skip** — architecture diagram + formal math already carries the weight. Layered scrollytelling would double-present.

Existing `VisualizationContainer` + `AgenticArchitecturePAR` stay. No new diagrams needed unless we upgrade to the 14-node variant (separate decision — optional polish, not blocking).

---

## Delivery order

1. User resolves 5 [REDACTED] batches above (async; replace inline in this doc)
2. Session N+1 opens this brief, drafts MDX rewrite following the sequence above
3. Build + Lighthouse checks per framework §6 quality gates
4. Commit: `feat(blog): Tier 7b — PAR formal post via framework`
5. Companion builder post (`par-assist-building`) follows in Tier 7c with a lighter palette selection (no ConstraintsBlock/OptionsConsidered, use StepThrough for the team/velocity narrative, Glossed throughout)
