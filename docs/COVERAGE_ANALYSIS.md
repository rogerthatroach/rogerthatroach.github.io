# Portfolio Coverage Analysis

> **Method:** First principles decomposition → Hermeneutic interpretation (what does a Director-level hiring manager need?) → RCA on each gap (why is it missing, what's the cost of leaving it empty?)
>
> **Date:** 2026-03-29
> **Status:** Fill offline, then hand back to Claude Code for Phase 2+ builds

---

## 0. First Principles — What This Portfolio Must Prove

A hiring manager evaluating for Director / Sr. Director / VP / Head of AI roles needs to answer **five questions** within 60 seconds of landing:

| # | Question | Portfolio Section That Answers It |
|---|----------|----------------------------------|
| 1 | Can this person **build** AI systems? | Projects (architecture depth) |
| 2 | Can this person **lead** teams and ship? | Metrics, About, Project narratives (role clarity) |
| 3 | What's their **trajectory**? | Skill Timeline (progression, not randomness) |
| 4 | Do they operate at **enterprise scale**? | Metrics (numbers), Project scale indicators |
| 5 | Would I **trust** them with my org? | Awards (social proof), About (voice/judgment), Overall polish |

Every gap below is evaluated against: **does leaving this empty weaken one of those five answers?**

---

## 1. Projects — Deep Dive Coverage

### PAR Assist ✅ STRONG — minor gaps

| Field | Have? | Content | Gap Action |
|-------|-------|---------|------------|
| One-liner | ✅ | Enterprise-wide LangGraph agentic system for PARs | — |
| Role | ✅ | Conceived vision, led strategic + technical requirements | — |
| Stack | ✅ | LangGraph, MCP, PostgreSQL, embeddings, custom/dynamic RAG | — |
| Architecture detail | ✅ | Agent flow, MCP tools, multi-layer RAG, chunking pipeline | — |
| Impact metric | ⚠️ | "Scaling from intern POC → bank-wide production initiative" | **NEED:** A concrete number. Users impacted? Time saved? Departments onboarded? Even "targeting X,000 users bank-wide" works. |
| Origin story | ✅ | Amplify intern idea → enterprise product | — |
| Timeline | ⚠️ | When did development start? Expected production date? | **NEED:** Even approximate: "Q1 2025 start, targeting Q3 2025 production" |
| Visual/diagram idea | ✅ | Agent flow: User → LangGraph → MCP Tools → RAG → Response | — |

**Hermeneutic note:** PAR Assist is the *crown jewel* — it shows vision + execution + scale. The missing impact metric weakens Q2 (can they ship?) and Q4 (enterprise scale). A projected number is better than no number.

---

### Astraeus ✅ COMPREHENSIVE — best documented project

| Field | Have? | Content | Gap Action |
|-------|-------|---------|------------|
| One-liner | ✅ | Deterministic agentic platform for CFO-grade financial analytics | — |
| Role | ✅ | Architect, lead developer, product visionary | — |
| Stack | ✅ | Multi-tier agentic framework, text-to-SQL, GPT (routing), EPM security | — |
| Architecture detail | ✅ | 3 sub-agents (EPM, Headcount, Open Positions), parallel execution, event model, entitlement modeling | — |
| Scale metrics | ✅ | ~40K transits, ~9K rollups, ~60K geos, millisecond slicing | — |
| Impact metric | ✅ | Scale numbers serve as impact | — |
| Security narrative | ✅ | GPT for routing only, no data leakage, deterministic agents | — |
| Timeline | ⚠️ | When did Astraeus start? When was it production? | **NEED:** Approximate dates |
| Visual/diagram idea | ✅ | 3 sub-agents + data flow diagram | — |

**Hermeneutic note:** This project single-handedly answers Q1, Q4, and partially Q5 (responsible AI). Strongest project in the portfolio.

---

### Aegis v1 & v2 ✅ GOOD — v1 is thin

| Field | Have? | Content | Gap Action |
|-------|-------|---------|------------|
| One-liner | ✅ | Text-to-SQL benchmarking engine with LLM-assisted KPI disambiguation | — |
| v2 technical detail | ✅ | Intent parsing, query decomposition, embeddings, similarity search, disambiguation, guardrails | — |
| v2 delivery speed | ✅ | 2 weeks (while running Astraeus + Amplify) | — |
| v1 detail | ⚠️ | "Productionized Aegis v1, standardized codebase within Functions Assist" | **NEED:** What did v1 actually do? What data did it benchmark? How was it used? 2-3 sentences. |
| Impact metric | ⚠️ | Speed of delivery (2 weeks) is the metric, but no user/business impact | **NICE TO HAVE:** Who uses Aegis? How many KPIs? How many queries/day? |
| Timeline | ⚠️ | v1 shipped during Sr. Data Scientist role (2022-2025), v2 shipped 2025 | **NEED:** Approximate v1 date |

**Decision:** Present as ONE project card with v1 → v2 evolution narrative. Shows growth + iteration.

---

### Digital Twin (TCS) ✅ GOOD — architecture gap

| Field | Have? | Content | Gap Action |
|-------|-------|---------|------------|
| One-liner | ✅ | ML-powered Digital Twin reducing costs by $3M/year | — |
| Role | ✅ | Lead data scientist, end-to-end delivery | — |
| Stack | ✅ | R, Python, regression, classification, clustering | — |
| Impact | ✅ | $3M annual cost reduction, 2× Star of the Month | — |
| Architecture | ❌ | Missing | **NEED:** What was the system flow? Sensor data → what preprocessing → what models → what output → how did operators use it? Even a 3-step description helps build the diagram. |
| Scale | ⚠️ | 900MW plant, Maizuru Japan — but no data scale | **NICE TO HAVE:** How many sensors? Data volume? Model refresh frequency? |
| Team | ⚠️ | Solo or team? | **NICE TO HAVE:** "Led a team of X" or "sole data scientist" — both are valid signals |
| Client relationship | ✅ | Japanese energy company, cross-border India ↔ Japan | — |

**Hermeneutic note:** This is the origin story. Hiring managers love a "where it all started" with a hard number ($3M). The architecture gap is the biggest miss — without it, the project card will be thinner than the RBC ones and the diagram will be generic.

---

### Commodity Tax (RBC) ✅ SUFFICIENT — simple story, well told

| Field | Have? | Content | Gap Action |
|-------|-------|---------|------------|
| One-liner | ✅ | Overhauled tax return process from months → 90 minutes | — |
| Stack | ✅ | PySpark, Tableau, General Ledger extraction | — |
| Impact | ✅ | Months → 90 min, CFO Quarterly Team Award | — |
| Architecture | ⚠️ | What was the pipeline? Extract → transform → what? | **NICE TO HAVE:** 2-3 sentence pipeline description for expanded card view |

**Decision:** This is a supporting project — proves breadth. Doesn't need deep architecture.

---

## 2. Skill Timeline — Coverage

| Era | Period | Skills Listed | Gap? |
|-----|--------|--------------|------|
| Foundation | 2016-2019 | R, ggplot2, Python, applied ML | ✅ Complete |
| Deep Learning | 2019 | CNNs, TensorFlow, computer vision | ✅ Complete |
| Big Data | 2021 | Hadoop, Spark, PySpark | ✅ Complete |
| Cloud ML | 2021-2022 | GCP, Vertex AI, AutoML, Document AI | ✅ Complete |
| Enterprise Analytics | 2022-2024 | SQL, Tableau, PySpark, financial modeling | ✅ Complete |
| GenAI & LLMs | 2024-2025 | RAG, text-to-SQL, embeddings, prompt eng | ⚠️ When exactly did GenAI work start at RBC? |
| Agentic AI | 2025-Present | LangGraph, MCP, multi-agent orchestration | ✅ Complete |
| Full-Stack AI | 2025-Present | React frontends for LLM tools | ✅ Complete |

**One gap:** The transition from Enterprise Analytics → GenAI. When did LLM/RAG work begin? Was it gradual (experimented in 2023, serious in 2024) or sudden (2024 pivot)?

---

## 3. Metrics — Coverage

| Metric | Value | Source | Buildable? |
|--------|-------|--------|-----------|
| Years in AI/ML | 8+ | Career timeline | ✅ |
| Team members managed | 6+ | Org structure | ✅ |
| Production AI systems shipped | 4 | Project list | ✅ |
| Enterprise users impacted | Bank-wide | PAR Assist scope | ⚠️ Vague — a number would be stronger |
| Fastest product delivery | 2 weeks | Aegis v2 | ✅ |
| Largest efficiency gain | Months → 90 min | Commodity Tax | ✅ |
| Cost savings delivered | $3M/year | Digital Twin | ✅ |
| Awards & recognition | 5 | Awards list | ⚠️ Spec says 5, knowledge base lists 4. What's the 5th? |

---

## 4. Awards — Coverage

| Award | Org | Year | In Knowledge Base? |
|-------|-----|------|--------------------|
| CFO Quarterly Team Award | RBC | Q4 2023 | ✅ |
| Star of the Month | TCS | Nov 2017 | ✅ |
| Star of the Month | TCS | Jan 2019 | ✅ |
| Innovation Pride Award | TCS | Sep 2019 | ✅ |
| CFO One RBC Team Award | RBC | 2025 | ❌ **In PORTFOLIO_SPEC only, not in knowledge base** |

**RCA:** The "CFO One RBC Team Award 2025" appears in PORTFOLIO_SPEC.md Section 3.6 but is NOT in CAREER_KNOWLEDGE_BASE.md Section 5. Either it's real and was missed, or it was speculatively added to the spec.

**Action needed:** Confirm this award exists. If yes, add to knowledge base with details (what was it for?).

---

## 5. About Section — Coverage

Draft exists in PORTFOLIO_SPEC.md Section 3.5. It references:
- ✅ AI & Data Science Lead at RBC
- ✅ CFO Group
- ✅ Digital Twins origin → agentic AI present
- ✅ Team leadership + 70% hands-on
- ✅ Looking for next challenge

**Gap:** The draft says "Milap" but public portfolio uses full name. Minor — will adjust during build.

---

## 6. Summary — Action Items for Offline Capture

### Must-Have (weakens portfolio if missing)

| # | Item | Why It Matters | Effort |
|---|------|---------------|--------|
| 1 | **PAR Assist impact metric** — projected users, departments, or time saved | Crown jewel project has no number | 1 sentence |
| 2 | **PAR Assist timeline** — when started, when targeting production | Shows execution velocity | 2 dates |
| 3 | **Astraeus timeline** — when started, when production | Same | 2 dates |
| 4 | **Digital Twin architecture flow** — sensors → model → output → action | Needed for diagram + credibility of the $3M claim | 3-5 sentences |
| 5 | **CFO One RBC Team Award 2025** — confirm real, add details | Award count is 5 in spec but only 4 documented | 1 sentence |

### Nice-to-Have (strengthens but not blocking)

| # | Item | Why It Matters | Effort |
|---|------|---------------|--------|
| 6 | Aegis v1 detail — what it benchmarked, who used it | v1 → v2 story is thin on v1 side | 2-3 sentences |
| 7 | Digital Twin data scale — sensors, data volume | Makes the $3M more credible | 1 sentence |
| 8 | Digital Twin team size — solo or team? | Leadership signal | 1 word |
| 9 | "Enterprise users impacted" — actual number or range | Vague metric vs. concrete metric | 1 number |
| 10 | GenAI transition timing — when did LLM work start at RBC? | Timeline accuracy | 1 date |
| 11 | Commodity Tax pipeline detail | Expanded card content | 2-3 sentences |
| 12 | Aegis usage stats — queries/day, KPIs cataloged | Impact evidence | 1-2 numbers |

---

*Fill the must-haves first. Hand this file back to Claude Code when ready — I'll update the data files and rebuild.*
