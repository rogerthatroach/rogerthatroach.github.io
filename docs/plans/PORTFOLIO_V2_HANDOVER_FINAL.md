# Portfolio v2 — Final Handover Document

> **Author:** Milap Dhaliwal (via Claude, April 10, 2026)
> **Status:** Tier 4 addition to IMPROVEMENT_PIPELINE.md. Merge relevant sections into PORTFOLIO_SPEC.md after execution.
> **Repo:** rogerthatroach/rogerthatroach.github.io
> **Stack:** Next.js + TypeScript + Tailwind CSS + Framer Motion, GitHub Pages

---

## 0. RELATIONSHIP TO EXISTING SPECS

This document is a Tier 4 scope addition to IMPROVEMENT_PIPELINE.md. It is NOT a replacement for CLAUDE.md, PORTFOLIO_SPEC.md, or THREE_LAYER_CONTENT_ARCHITECTURE.md.

Where this document conflicts with established norms, the conflict resolution table in Section 1 is authoritative.

Where this document references file paths, verify against actual repo state. MDX migration has already happened; blog posts live in `data/posts/*.mdx`.

---

## 1. CONFLICT RESOLUTIONS

| # | Conflict | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | 4 feature branches vs. main+dev | **Keep norm.** `dev` branch, tier-gated merges. Tag `v1.0` before starting. | Solo project. Dev + tags is lighter. |
| 2 | Batched PRs vs. iterative shipping | **Keep norm.** One tier at a time, user review between each. | |
| 3 | Rewrite existing blog posts | **Override norm, with nuance.** Do NOT rewrite existing posts. ADD new posts in a second register. | Prior feedback protected quality, not LaTeX specifically. Two tracks preserves substance while adding range. |
| 4 | New PAR Assist post in leadership register | **Override norm, with constraint.** Must contain architecture decisions and trade-offs. Not a fluff piece. | |
| 5 | Archive files to /blog/archive/ | **Keep norm (zero waste).** Git history + v1.0 tag is the archive. | |
| 6 | 6 project cards → 3 | **Override handover.** Keep all 6 on homepage. Simplify presentation only (see Section 3). | Three-layer funnel requires all 6 entry points. |
| 7 | New Career Arc component | **Keep norm.** Reuse existing SkillTimeline/EraTransition. Don't duplicate. | |
| 8 | Named client "Humana" | **Use it.** Confirmed by Milap. Standard for consulting portfolios. | |
| 9 | PAR Assist blog timing | **Draft now, publish after April 16.** Frontmatter date: April 17+. | |
| 10 | File paths (src/content/) | **Keep norm.** Actual path: `data/posts/*.mdx`. | |
| 11 | Dual .md + .tsx files | **Keep norm.** MDX single-source, no duplicates. | |
| 12 | Homepage as parts list | **Override handover.** Narrative arc added in Section 2. | |
| 13 | Merge two agentic posts | **Keep both. DO NOT merge.** Different systems (Astraeus vs PAR Assist). | |
| 14 | No pipeline integration | **This is Tier 4.** Slots into existing pipeline. | |

---

## 2. THE VISION — HOMEPAGE AS NARRATIVE ARC

### The 60-second experience

**0-5 seconds (Hero):** "I architect AI platforms. I lead teams that ship them." Immediate identity. Social icons right there.

**5-15 seconds (Through-line + Stats):** The thesis: "sense → model → optimize → act." Immediately followed by proof: 5 awards, 4 production systems, $3M savings, 8+ years. Thesis AND track record in one breath.

**15-30 seconds (What I'm Building Now):** Present-tense momentum. PAR Assist shipping. Astraeus scaling. Team growing. Signals: "in motion, not cataloging the past."

**30-60 seconds (Projects):** Six project cards, each with a headline metric, one sentence, and era badge (Foundation / Cloud ML / Enterprise Analytics / Intelligent Systems). No React Flow diagrams here. The era badges make the career arc visible without a separate section. Cards are entry points into the three-layer funnel.

**60+ seconds (About):** Leadership philosophy. Three beliefs. The "how I think" close to the story. Positioned between projects and Recognition, earning its length because only already-interested readers reach it.

**Final (Recognition + Footer):** Awards. Contact. Close.

### What does NOT change from v1:
- Hero (keep as-is)
- Number of project cards (all 6)
- /projects page (full cards with React Flow)
- Case study pages and blog posts
- SkillTimeline / EraTransition components
- Awards section

---

## 3. HOMEPAGE CHANGES

### Move up:
- Through-line section ("Every system I've built follows the same pattern...") — immediately after hero
- Stats bar — immediately after through-line

### Add:
- "What I'm Building Now" section — between stats and project cards (see Section 5)

### Simplify (NOT remove):
- Homepage project cards: remove React Flow diagrams only. **Retain era badges (Foundation / Cloud ML / Enterprise Analytics / Intelligent Systems).** Keep headline metric + one sentence + link. The era badges ARE the career-arc signal on the homepage. Removing them breaks the narrative described in Section 2.

### Reposition:
- About section: lands between projects and Recognition. This is the "how I think" close, not the introduction. Its length (3 principles, ~200 words) is earned because only already-interested readers reach this position.

---

## 4. ABOUT SECTION — FULL REWRITE

```
I believe the best technical leaders still build.

That's why I stay 70% hands-on — designing architectures, writing code,
debugging production systems — while leading a growing AI team at RBC's
CFO Group. Not because I have to. Because the moment a technical leader
stops building, they start making decisions based on abstractions instead
of reality.

Three things I've learned building AI systems across power plants, cloud
pipelines, and enterprise finance:

First, the architecture IS the product. Not the model, not the prompt,
not the framework. The decisions about what the LLM touches and what it
doesn't — that's what makes an AI system trustworthy in a regulated
environment. In every system I've built, GPT handles intent; deterministic
code handles truth. That separation isn't a constraint. It's the design.

Second, the best ideas come from everywhere. PAR Assist started as an
intern's proof-of-concept during the Amplify program. I saw the shape of
something bigger, resourced it, and scaled the vision. Today it's shipping
as a bank-wide agentic AI platform. My job as a leader isn't to have the
best ideas. It's to recognize them, clear the path to production, and make
sure everyone knows where they started.

Third, every system I've built follows the same pattern: sense the
environment, model it, optimize against constraints, close the loop. At a
power plant, that meant 90 sensors and Particle Swarm Optimization. In
enterprise finance, it means LangGraph agents reasoning about policies
while deterministic code enforces entitlements. The technology changes.
The pattern doesn't.

I'm always open to conversations about building AI teams, shipping GenAI
in regulated industries, and what "production-ready" actually means when
the CFO is watching.
```

**Note on PAR Assist repetition (Tension #2):** PAR Assist appears three times on the homepage, each with a deliberately different rhetorical role:
- **About:** Illustrates the principle "best ideas come from everywhere." The principle is foregrounded, but PAR Assist is named so the reader connects the story to the shipping product in the Now section. Obscuring the name would fragment the signal.
- **Now section:** Signals shipping momentum. Present tense, active voice.
- **Project card:** Entry point to the technical deep-dive (case study → blog).

These should read as cumulative, not repetitive. The three mentions carry distinct frames (principle / momentum / entry point) — that's what differentiates them, not whether the name appears. Naming PAR Assist consistently across all three mentions is a feature, not a flaw: it welds the origin story to the shipping product to the deep-dive, so a Director reading top-to-bottom sees one arc converge on one system.

---

## 5. "WHAT I'M BUILDING NOW" SECTION

```
What I'm Building Now

Shipping PAR Assist — an enterprise-wide agentic AI platform that
transforms how RBC drafts project approvals across the bank. LangGraph
orchestration, MCP tools, multi-layer RAG. Going live April 2026.

Scaling Astraeus to new CFO data domains — extending millisecond-level
financial analytics beyond headcount into Income Statement, Balance Sheet,
and Daily Financial Reporting.

Growing the team — 2 new interns joining May 2026, continuing the
pipeline that turned an intern's idea into a bank-wide production system.
```

**Staleness note:** The "2 new interns joining May 2026" line becomes stale after May. Consider a data-driven approach: store "now" items in a data file with a `staleAfter` date so it's obvious when content needs refreshing.

---

## 6. BLOG STRATEGY — TWO TRACKS

### Why two tracks, not a rewrite:

The prior blog-standards feedback said "consistency is non-negotiable." Read in context, that feedback protected intellectual substance against dilution. The deeper intent was rigor, not mandatory LaTeX. Two explicit tracks preserve substance while adding range.

### The tracks:

**Track 1: "Technical Explorations" (formal register)**
- Existing posts. Theorems, proofs, LaTeX, formal definitions. No changes.
- Posts: Closed-Loop Optimization, Enterprise Agentic AI Architecture, Deterministic Agentic Architectures, Guardrailed Text-to-SQL

**Track 2: "Building in Practice" (practitioner register)**
- New posts only. Architecture decisions, trade-offs, leadership lessons.
- Must maintain intellectual substance: the problem, why existing approaches failed, the architecture decision with explicit trade-offs, what shipped, what you'd do differently.
- Posts: "How We Built PAR Assist" (see Section 7)

### The two-tracks proof (Tension #4):

The cleanest demonstration that this works is PAR Assist itself. The same system now has two blog posts in two registers:
- **"Enterprise Agentic AI Architecture"** (Track 1, formal): formalizes the system as a directed graph with typed MCP tool contracts, proves context isolation by construction, derives retrieval scoping properties
- **"How We Built PAR Assist"** (Track 2, practitioner): the problem, the intern spark, why LangGraph over chains, the leadership lessons, what shipped

Same system. Depth track and builder track. Cross-linked via "Related project: PAR Assist." This IS what range looks like. Section headers or tags on the blog index can make the two tracks visible, or they can simply coexist chronologically. Either way, the visitor who reads both sees a leader who can operate in both registers.

### On track maturity (Tension #3):

Track 2 launches with one post. One post isn't a track yet, it's a register experiment. The framing becomes "two tracks" once a second practitioner post exists. Candidate for second post: **"How Commodity Tax Built CFO Trust"** — the story of how automating a months-long process to 90 minutes opened the door to AI adoption in the CFO Group. Problem → stakeholder dynamics → technical approach → the trust cascade that enabled Astraeus and PAR Assist. This would be written after Tier 4d ships and the first practitioner post is validated.

Until the second post exists, the blog index should NOT label tracks. Just show posts chronologically. The register difference will be felt without being declared.

---

## 7. BLOG POST DRAFT — "How We Built PAR Assist"

**File:** `data/posts/par-assist-building.mdx`
**Publish date:** April 17, 2026 or later (after system ships April 16)
**Tags:** Leadership, Agentic AI, LangGraph, Product Development
**Related project:** PAR Assist

```markdown
---
title: "How We Built PAR Assist: From Intern POC to Bank-Wide Product"
date: "2026-04-17"
readTime: "8 min read"
tags: ["Leadership", "Agentic AI", "LangGraph", "Product Development"]
relatedProject: "PAR Assist"
---

In November 2025, I wrote a one-page plan for an AI system that would
transform how RBC drafts Project Approval Requests. Five months later,
it's shipping bank-wide.

This is the story of how it happened, what I learned about scaling an
intern's proof-of-concept into an enterprise product, and why the
hardest part had nothing to do with technology.

## The problem

Project Approval Requests (PARs) are how major banks govern significant
initiatives. They're high-stakes documents requiring institutional
knowledge, policy compliance, and cross-referencing dozens of templates,
rules, and historical examples. The drafting process took weeks. Most of
that time was spent hunting for the right template, resolving
contradictions between policy documents, and guessing which fields
applied to which project type.

This wasn't a search problem. It was an orchestration problem.

## The spark

During the 2025 Amplify internship program, one of the four interns I
was managing prototyped a concept: what if an AI assistant could guide
you through a PAR step by step? The prototype was rough — a basic
chatbot with a single RAG layer — but the insight was sharp. The user
didn't need answers. They needed guidance through a process.

I saw the shape of something bigger. Not a chatbot. An agentic platform
that could understand where you were in the workflow, pull the right
context at the right moment, resolve conflicts between policies
automatically, and adapt to any PAR type across any business line.

## The architecture decisions

**Why LangGraph over vanilla chains.** A PAR workflow isn't linear. At
any point, the system might need to clarify an ambiguity, resolve a
conflict between two policy documents, or switch templates because the
user's project type changed mid-draft. LangGraph models this as a
directed graph with persistent state. Conditional routing based on
workflow state is the core capability.

**Why MCP tools as the action boundary.** Every action the agent takes
is a typed, logged tool invocation: template selection, field assignment,
conflict resolution, ambiguity detection. No invisible prompt
engineering. Every decision is auditable. In a regulated environment,
that's not optional.

**Why three RAG layers, not one.** A single RAG layer can't handle this:
- Conversation history (session-scoped, context never lost)
- Uploaded documents (user-scoped, chunked and embedded on the fly)
- Institutional knowledge (global scope, policies and templates)

Each layer has its own retrieval function, relevance threshold, and
scope rules.

**Why PostgreSQL + pgvector.** Structured metadata and vector embeddings
in one transactional store. No sync problems between vector store and
application database.

**Context isolation.** The LLM parses intent and routes. It never sees
sensitive data. All data access happens through MCP tools and
deterministic Python code. Separate code paths, not prompt engineering.

## The leadership lessons

**Scoping.** The intern prototype tried everything. The production
version does one thing well: guided PAR drafting with the right context
at the right moment. Saying no to features is harder than building them.

**Parallel execution.** I ran PAR Assist alongside Astraeus and Aegis
v2. Clean separation of concerns isn't just good engineering. It's a
management strategy.

**Trusting the origin.** An intern had the idea. The best thing I did
was resource it, scale the vision, and make sure everyone knew where it
started. That's how you build a team where people bring their best ideas
to work.

## The result

PAR Assist ships bank-wide on April 16, 2026. Less than three months
from development start. What was weeks of manual drafting becomes a
guided interactive session.

## What I'd do differently

Start the formal architecture document earlier. We had the vision in
November but didn't start real development until February. A ready
technical design would have shaved weeks off.

Involve end users earlier. We built on accurate pain-point understanding,
but earlier feedback would have caught edge cases sooner.

## The pattern

Sense (policies, documents, user input) → model (LangGraph agents) →
optimize (RAG retrieval, MCP tool selection) → act (guided decisions).
Different technology from PSO on a power plant. Same architecture.
```

---

## 8. PROJECT CARD CONTENT UPDATES

### Document Intelligence:
- Metric: **"99.95% Accuracy"** (was: "Cloud-Scale Document Processing")
- Subtitle: "up from ~70% with Document AI alone"
- Description update: mention Humana, OpenCV pipeline, BigTable + BigQuery

### PAR Assist:
- Badge: **"Shipping April 2026"** (was: "In Progress")
- After April 16: remove badge, metric becomes "Bank-wide, Live"

### All case study links:
- Verify every link in Tier 4a. Dead links are worse than no links.
- Also verify case study pages themselves render correctly (three-layer funnel depends on them).

---

## 9. VERIFIED METRICS

| Metric | Value | Source |
|--------|-------|--------|
| Years of experience | 8+ | TCS 3.3 + Quantiphi 1 + RBC 3.5 |
| Cost savings (Digital Twin) | $3M/year | TCS Combustion Tuning |
| Commodity Tax scale | ~$250M GST, ~$350M PVAT (~$600M+ total) | RBC |
| Efficiency gain (Commodity Tax) | Months → 90 minutes | RBC |
| Aegis v2 build time | 2 weeks | While running 2 concurrent workstreams |
| Astraeus scale | ~40K transits, ~9K rollups | Millisecond slicing |
| ML models (Digital Twin) | 84 output models | Across 90+ sensors |
| Humana accuracy | 99.95% (up from ~70%) | Quantiphi, OpenCV + RF |
| Peak team management | Up to 5 simultaneously | RBC |
| Interns managed (total) | 7 | Plus 2 joining May 2026 |
| Sr Data Scientists managed | 2 | RBC |
| Awards | 5 | 2 RBC + 3 TCS |
| Hackathon placement | 2nd / 600 | TCS CV Hackathon 2019 |
| Hands-on involvement | ~70% | Architecture, code, ETL, full-stack |
| PAR Assist prod date | April 16, 2026 | RBC |
| Astraeus prod date | November 2025 | RBC |
| Aegis v1 start | April 2024 | RBC |
| Astraeus start | February 2025 | RBC |

---

## 10. TONE GUIDE

### Homepage, About, Now:
- First person, active voice, short sentences
- Beliefs and principles, not self-description
- No em dashes, no "passionate about," no "results-driven"

### Blog — Technical Explorations (existing):
- No changes. Formal register stays.

### Blog — Building in Practice (new):
- First person plural where appropriate
- Problem first, then architecture decisions as trade-offs
- Must include technical substance
- ~800-1,200 words + 1 architecture diagram
- No LaTeX, no theorems

---

## 11. IMPLEMENTATION TIERS

### Why this order:

Tiers 4a and 4b are trivially fast (15 minutes and 1 hour respectively) and independent of everything else. They unlock immediate value (correct metrics, stronger About) with zero risk to the homepage structure. Tier 4c is the highest-impact change but touches the most components, so it benefits from a clean, updated baseline. This is deliberate sequencing: low-risk wins first to build momentum, then the structural change on a verified foundation. Not risk aversion.

**Tiers 4c and 4d can run in parallel** — they touch different files (homepage components vs. `data/posts/`). Running them in parallel means both land by April 17, so the homepage restructure and the first practitioner blog post ship together. This matters because the homepage's "range" claim is only supported once a practitioner post exists live.

### Tier 4a: Content Updates (lowest risk, ~15 min)
- [ ] Tag current main as `v1.0`
- [ ] Update Document Intelligence metric to 99.95%, add Humana pipeline details
- [ ] Update PAR Assist badge to "Shipping April 2026"
- [ ] Verify all case study links. Fix dead ones.
- [ ] Verify case study pages render correctly (three-layer funnel check)
- [ ] `npm run build`, user review, merge to main

### Tier 4b: About Section Rewrite (~1 hour)
- [ ] Replace About section with v2 draft (Section 4)
- [ ] Position About between projects and Recognition
- [ ] Verify rendering
- [ ] `npm run build`, user review, merge to main

### Tier 4c: Homepage Hierarchy (can run parallel with 4d)
- [ ] Move through-line section above project cards
- [ ] Move stats bar to after through-line
- [ ] Add "What I'm Building Now" section (Section 5)
- [ ] Simplify homepage project cards: remove React Flow diagrams only. **Retain era badges.**
- [ ] All 6 cards remain
- [ ] Reuse existing SkillTimeline/EraTransition (no new components)
- [ ] Full visual review, desktop and mobile
- [ ] `npm run build`, user review, merge to main

### Tier 4d: New Blog Post (can run parallel with 4c)
- [ ] Add `data/posts/par-assist-building.mdx` (Section 7)
- [ ] Set frontmatter date to April 17 or later
- [ ] Do NOT modify, rewrite, archive, merge, or delete any existing blog posts
- [ ] Verify blog index, TOC, related project links
- [ ] `npm run build`, user review, merge to main
- [ ] Tag as `v2.0` after both 4c and 4d are merged

### Rules:
- All work on `dev` branch per CLAUDE.md
- One tier at a time for 4a and 4b. 4c and 4d can overlap.
- **4c and 4d get independent reviews and independent merges.** If one fails review, the other can still ship. This protects the April 17 blog post launch from being blocked by a homepage-restructure issue.
- `npm run build` after every change
- User review before every merge to main
- Conventional commits

---

## 12. WHAT THIS DOCUMENT DOES NOT COVER

- Mobile responsiveness (test during Tier 4c, not a spec change)
- SEO, meta tags, analytics
- Case study page changes (beyond link verification in Tier 4a)
- Any modifications to existing blog posts
- A second practitioner-track blog post (candidate: "How Commodity Tax Built CFO Trust" — deferred to post-v2)

---

## 13. FUTURE: SECOND PRACTITIONER POST (DEFERRED)

Once Tier 4d ships and the first practitioner post is validated, the candidate for the second "Building in Practice" post is:

**"How Commodity Tax Built CFO Trust"**
- The story of automating a months-long, $600M+ allocation process to 90 minutes
- Not just a technical win — the trust cascade: Commodity Tax → stakeholder confidence → Aegis v1 → Astraeus → PAR Assist
- Problem → stakeholder dynamics → PySpark + GL extraction → Tableau dashboards → the door it opened
- ~800-1,000 words, practitioner register

Once this second post exists, the blog has a genuine two-track structure. Until then, the register difference is felt, not declared.

### Timeline and fallback

- **Target:** Within 4 weeks of Tier 4d merging (approximately May 15, 2026).
- **Hard fallback:** If no second practitioner post has shipped by **June 15, 2026**, reframe Section 6 in PORTFOLIO_SPEC.md. The "two tracks" framing becomes "a builder-register companion post experiment" — a single practitioner post living alongside the formal corpus, not a track claim. Update `feedback_blog_standards.md` memory to match.
- **Why the fallback exists:** Deferrals in solo projects tend to become permanent. A dated fallback prevents the two-tracks framing from becoming structurally weak forever. If life gets in the way, the framing gracefully downgrades instead of quietly lying.

---

*Tiers 4a and 4b can start today. They are independent of all tensions above.*
