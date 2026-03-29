# Blog Infrastructure & Posts — Implementation Plan

> **Date:** 2026-03-29
> **Status:** Approved for implementation
> **Prerequisite:** Critical bugs fixed in commit c618088

---

## The Whole: Why This Blog Exists

The portfolio answers: **"How do you think?"** The architecture diagrams on the home page show the *what* — five systems, ascending in abstraction. But the formal proofs, the mathematical definitions, the interactive simulations — these show the *depth beneath the surface*. The blog is where the portfolio's implicit claim ("this person thinks in systems") becomes an explicit demonstration.

Each post maps to a level of the career thesis:

| Post | Career Level | What It Proves |
|------|-------------|----------------|
| **Agentic AI** | Level 4 (Intelligent) | The most recent work has formal foundations — LLM-as-Router is principled, not hacked together |
| **Text-to-SQL** | Level 4 (Intelligent) | Safety guarantees are mathematical, not vibes. Injection impossibility is a theorem, not a hope |
| **Closed-Loop/PSO** | **All 4 levels** | The unifying thesis — the same sense→model→optimize→act pattern at every abstraction level. This is THE argument |

Post 3 is the capstone. Its Abstraction Ladder diagram IS the portfolio's thesis rendered as an interactive visualization. The PSO simulation IS the physical-world origin story made tangible — a hiring manager can watch particles converge and *feel* what optimization means before reading about its application at higher abstractions.

### Design Language (Flows from Portfolio)

The blog inherits the portfolio's wabi-sabi aesthetic:

- **Warm paper (#f8f5f2) / near-black (#0c0a0a)** — the same CSS variables, the same warmth
- **Sakura accent (#b07a82 / #d4a0a7)** — for theorem borders, equation highlights, interactive states
- **Monospace for data, sans-serif for prose** — JetBrains Mono for equations and code, Inter for text
- **Whitespace is structural** — generous margins around theorems and diagrams; they breathe
- **Diagrams ARE content** — not illustrations beside text. Each visualization replaces paragraphs of explanation
- **Signal, not noise** — no decorative elements. Every component earns its place by conveying understanding

Mathematical formalism should feel like architecture: precise, structured, earned. The theorem blocks are the blog equivalent of the portfolio's architecture diagrams — they show how the mind works.

### The Hermeneutic Principle Applied

Each blog post (part) only makes full sense in the context of the portfolio (whole). The portfolio's home page makes claims through numbers and diagrams. The blog posts provide the formal proofs behind those claims. And the whole — portfolio + blog together — is more than either alone: it demonstrates that the same person who can architect production systems can also formalize their thinking with mathematical rigor.

The blog doesn't just add content. It transforms what the portfolio *means*.

---

## Phase 1: Blog Infrastructure

**Goal:** The skeleton that makes the blog feel native to the portfolio — same warmth, same precision, same "systems thinking expressed as design" ethos. Deploy with a stub post to verify the pipeline.

### 1.1 Install KaTeX
```bash
npm install katex
npm install -D @types/katex
```
KaTeX renders equations as the blog's equivalent of architecture diagrams — visual artifacts that convey understanding faster than prose.

### 1.2 Data Layer — `data/posts/index.ts`

Follows the portfolio's data-driven pattern: content decisions live in typed TypeScript, never hardcoded in JSX.

- `BlogPostMeta` — slug, title, subtitle, date, tags, readingTime, abstract, status
- `Reference` — academic citation (numbered [1], [2]... — the formal provenance of ideas)
- `FurtherReadingItem` — external links for deeper exploration
- `BlogPost` — combines meta + references + furtherReading
- `POSTS: BlogPost[]` — all 3 posts, sourced from the markdown content

### 1.3 Blog Components

Each component serves a specific role in the reading experience. Built in dependency order:

| # | Component | Role in the Whole |
|---|-----------|-------------------|
| 1 | **MathBlock.tsx** | Display equations — the formal language of systems thinking. KaTeX `displayMode: true`, horizontal scroll on mobile |
| 2 | **InlineEquation.tsx** | Inline math woven into prose — variables and expressions flow with the text |
| 3 | **TheoremBlock.tsx** | The structural backbone: definitions, theorems, propositions, proofs, corollaries. Left border in sakura accent. QED square for proofs. These are where rigor becomes visible |
| 4 | **ReferenceList.tsx** | Academic provenance — numbered citations ground the work in the field |
| 5 | **FurtherReading.tsx** | Doors to deeper understanding — curated, not exhaustive |
| 6 | **VisualizationContainer.tsx** | The bridge between text and interaction. Intersection Observer pauses/resumes animations. Render prop `(isVisible) => ReactNode` gives diagrams control. Loading skeleton matches the surface color. This container is what makes diagrams *live* in the reading flow rather than sitting beside it |
| 7 | **PostLayout.tsx** | The reading experience wrapper. Narrow prose column (`max-w-3xl`) for comfortable line length. Title, date, tags, abstract, then content, then references. Imports KaTeX CSS (scoped to blog pages). The layout should feel like reading an academic paper typeset with the portfolio's warmth |
| 8 | **PostCard.tsx** | Blog index entry — title, date, tags, reading time. The card is a promise of depth. Matches the portfolio's surface/border tokens |
| 9 | **BlogPostShell.tsx** | The routing bridge — maps slugs to dynamically imported content components via `next/dynamic({ ssr: false })`. Invisible to the reader, essential to the architecture |

### 1.4 Routes

**`app/blog/page.tsx`** — Blog index (server component)
- Clean, minimal. Title "Writing" (not "Blog" — the portfolio speaks in verbs, not nouns)
- Grid of PostCards. Uses `Nav`, `PageTransition`, `Footer`
- The index page is a table of contents, not a magazine — sparse, scannable

**`app/blog/[slug]/page.tsx`** — Individual post (server component)
- `generateStaticParams()` from `POSTS` array (static export requirement)
- `generateMetadata()` for per-post SEO (title, description from abstract)
- Renders `BlogPostShell` which loads the right content component

### 1.5 Config Updates
- `tailwind.config.ts`: add `'./data/posts/**/*.tsx'` to content array
- KaTeX CSS imported in `PostLayout.tsx` only (zero waste — not loaded on portfolio pages)

### 1.6 Stub Post — `data/posts/agentic-ai.tsx`
Minimal TSX: one heading + one MathBlock + one TheoremBlock + one VisualizationContainer (placeholder div). Verifies the entire pipeline end-to-end before we invest in content conversion.

### 1.7 Verification
- `npm run build` generates `out/blog/index.html` and `out/blog/agentic-ai/index.html`
- `npx tsc --noEmit` passes
- KaTeX renders cleanly in both themes (sakura accent on warm paper / dusty rose on dark)
- Theorem blocks feel like part of the portfolio's design language, not a foreign element
- Responsive at 375px, 768px, 1440px

---

## Phase 2: Post 1 — Agentic AI (Deterministic Agents)

**Source:** `docs/blogs/blog_post_1_agentic_ai_v2.md`

**What this post proves:** The LLM-as-Router pattern isn't a hack — it's a principled architecture with formal guarantees about data confidentiality and parallel correctness. The diagrams make the architecture *tangible*; the theorems make it *provable*.

### 2.1 Content Conversion
Markdown → TSX in `data/posts/agentic-ai.tsx`. Prose becomes JSX paragraphs. Equations become `<MathBlock>` and `<InlineEquation>`. Formal blocks become `<TheoremBlock>` variants. The production metrics table shows this isn't theoretical — it runs at scale.

### 2.2 Diagrams (complexity order — each builds visual vocabulary for the next)

| # | Component | What It Communicates |
|---|-----------|---------------------|
| 1A | **AgenticArchitecture.tsx** | The core insight: monolithic fails, separation works. Static SVG, Framer entrance. Side-by-side makes the argument visual |
| 1B | **SubAgentExecution.tsx** | Parallelism is the payoff. Dropdown selects query type → track highlights → timing visualization shows `max(t₁,t₂,t₃)` not `sum` |
| 1C | **EPMTranslation.tsx** | Security is structural, not bolted on. Toggle permission sets → watch SQL output transform. The interaction makes entitlement modeling visceral |
| 1D | **FullSystemArchitecture.tsx** | The hero diagram — two layers, three agents, data boundary. Dropdown + toggle + tooltips. This is the portfolio's Astraeus diagram *explained* |
| 1E | **EventModelAnimation.tsx** | Events vs snapshots. Click to transfer employees → watch counters reconcile. The most complex interaction, but the concept is simple: events are the source of truth |

All wrapped in `<VisualizationContainer>`, loaded via `next/dynamic({ ssr: false })`.

### 2.3 Verification
- All diagrams render, interact, and pause when off-viewport
- All equations display correctly in both themes
- Diagrams scale on mobile (controls stack vertically)
- The reading experience flows: prose → theorem → diagram → prose without jarring transitions

---

## Phase 3: Post 2 — Text-to-SQL (Guardrailed Generation)

**Source:** `docs/blogs/blog_post_2_text_to_sql_v2.md`

**What this post proves:** Natural language to SQL isn't a prompt engineering trick — it's a five-stage pipeline where safety is guaranteed by construction (injection is impossible, not just unlikely). The embedding visualization makes the abstract concept of "semantic similarity" concrete.

### 3.1 Content Conversion
Same TSX pattern as Post 1. The 5-stage pipeline table is the structural spine.

### 3.2 Diagrams

| # | Component | What It Communicates |
|---|-----------|---------------------|
| 2A | **FiveStagePipeline.tsx** | Decomposition is the strategy. Click any stage to expand — the pipeline is fractal, each stage has its own structure |
| 2B | **EmbeddingSpace.tsx** | *The centerpiece of this post.* A 2D scatter of KPI embeddings. Type a metric name → watch a point appear → lines draw to nearest neighbors with cosine scores. Makes "semantic similarity" something you can *touch*. Uses D3 (already installed) with pre-computed positions |
| 2C | **GuardrailValidator.tsx** | Safety as experience. Select inputs (normal query, injection attempt, wrong table, DELETE) → watch each gate pass or fail with explanations. The reader *feels* the guardrails working |
| 2D | **FullPipelineFlow.tsx** | End-to-end flow with disambiguation branching. High confidence → proceed. Low → clarify. Shows the pipeline is intelligent, not just mechanical |

---

## Phase 4: Post 3 — Closed-Loop/PSO (The Unifying Pattern)

**Source:** `docs/blogs/blog_post_3_closed_loop_v2.md`

**What this post proves:** *Everything.* This is the career thesis formalized. The same sense→model→optimize→act pattern at four abstraction levels. The PSO simulation is the physical-world origin story made interactive. The Abstraction Ladder is the portfolio's thesis in one visualization.

### 4.1 Content Conversion
Most equations of any post (20+). The mathematical density reflects the depth — this post earns every symbol.

### 4.2 Diagrams

| # | Component | What It Communicates |
|---|-----------|---------------------|
| 3A | **ClosedLoopCycle.tsx** | The pattern itself. 4 tabs relabel nodes per domain — same structure, different instantiation. The interaction IS the thesis |
| 3B | **ModelSelectionScatter.tsx** | Rigor in model selection. Scatter plot with sigma_max slider filters unstable models. Shows that "84 models" isn't brute force — it's systematic evaluation |
| 3C | **PSOSwarm.tsx** | **THE CENTERPIECE.** Canvas-based swarm simulation on a Rastrigin landscape heatmap. Play/pause, w/c1/c2/N sliders, convergence plot. A hiring manager watches particles explore, converge, find optima — and *understands* what optimization feels like. Build: simulation logic → canvas rendering → controls → convergence plot |
| 3D | **AbstractionLadder.tsx** | **The portfolio's thesis as a visualization.** 4 rows x 4 nodes, vertical connections, scroll-build animation. "Show Technologies" toggle. Click to expand rows. Animation builds bottom-up: physical → cloud → financial → intelligent. Final pulse — all vertical lines glow — shows structural unity |

### 4.3 PSO Technical Strategy
1. Pure math first — PSO velocity/position update equations as functions
2. Canvas heatmap — pre-compute Rastrigin surface once, render as image data
3. Particle rendering — dots + trails on canvas overlay
4. Controls — React state for parameters, refs to avoid effect re-triggering
5. Convergence plot — small SVG chart updating in real-time
6. `requestAnimationFrame` gated by `isVisible` from VisualizationContainer
7. Mobile: reduce to N=15 particles, simplify controls to essential sliders

---

## Phase 5: Nav Integration

- Update hash links to `/#work`, `/#journey`, `/#about` (works from any page)
- Add `Blog` to `NAV_LINKS` with `href: '/blog'`
- Conditional rendering: `<Link>` for routes, `<a>` for hash links
- The blog link in the nav is the final stitch — it says "there's depth here if you want it"

---

## Design Principles Governing All Phases

### Aesthetic Continuity
- All components use CSS variable tokens (`text-text-primary`, `bg-surface`, `border-border`)
- Theorem blocks: `border-l-2 border-accent` — sakura accent is the visual thread
- Diagram containers: `bg-surface/50 rounded-xl border border-border` — same surface treatment as portfolio cards
- No new colors. No new fonts. The blog is the portfolio's voice at a different register

### Interaction Philosophy
- Diagrams respond to curiosity, not demand. Hover reveals, click explores, scroll triggers
- Interactive elements have clear affordances (dropdowns, toggles, sliders) — no hidden gestures
- Every interaction teaches something. If clicking a button doesn't deepen understanding, remove the button

### Typography for Long-Form
- Prose column: `max-w-3xl` (48rem) — 65-75 characters per line for comfortable reading
- Diagrams break out to full `max-w-content` (64rem) — they deserve the space
- Equations centered, with horizontal scroll on mobile
- Section headings in the same weight hierarchy as the portfolio

### Performance as Respect
- Diagrams lazy-load — the reader sees text immediately, visualizations arrive as they scroll
- Canvas simulations pause off-viewport — the reader's battery matters
- KaTeX CSS scoped to blog — the portfolio home page is unaffected
- Total blog JS stays under 500KB gzipped (excluding diagram chunks)

---

## Architecture Decisions

1. **TSX over MDX** — Matches existing PARAssist deep-dive pattern. Direct control over KaTeX + diagram imports. No new toolchain.
2. **Metadata in data/posts/index.ts, content in separate TSX files** — Mirrors `data/projects.ts` + component separation. Content decisions in one place.
3. **VisualizationContainer render prop** — `(isVisible) => ReactNode` gives diagrams direct animation control. The container handles viewport awareness; the diagram handles its own life cycle.
4. **next/dynamic over React.lazy** — Codebase convention. Handles SSR avoidance + code splitting + loading states in one API.
5. **KaTeX CSS in PostLayout only** — Zero waste. Blog-only dependency stays blog-scoped.

## Critical Files

**New (Phase 1):**
- `data/posts/index.ts` — Types + metadata + references (the data spine)
- `components/blog/MathBlock.tsx` — Display equations
- `components/blog/InlineEquation.tsx` — Inline math
- `components/blog/TheoremBlock.tsx` — Formal block styling
- `components/blog/ReferenceList.tsx` — Academic citations
- `components/blog/FurtherReading.tsx` — External links
- `components/blog/VisualizationContainer.tsx` — Viewport-aware diagram wrapper
- `components/blog/PostLayout.tsx` — Reading experience wrapper
- `components/blog/PostCard.tsx` — Blog index card
- `components/blog/BlogPostShell.tsx` — Slug to component router
- `app/blog/page.tsx` — Blog index
- `app/blog/[slug]/page.tsx` — Post routing + static params
- `data/posts/agentic-ai.tsx` — Post 1 content (stub, then full)

**Modified:**
- `tailwind.config.ts` — Add `data/posts/**/*.tsx` to content
- `components/Nav.tsx` — Add Blog link (Phase 5)

## Verification (End-to-End)

After each phase:
1. `npm run build` succeeds (static export generates all blog routes)
2. `npx tsc --noEmit` passes
3. Visual check at 375px, 768px, 1440px
4. Theme toggle: blog pages feel native in both modes — warm paper with sakura, or dark with dusty rose
5. Navigation: Home <-> Blog <-> Post flows without breaking
6. Diagrams lazy-load and pause off-viewport
7. KaTeX renders without Tailwind CSS conflicts
8. The reading experience flows: the blog feels like the portfolio *speaking at length*, not a different site bolted on
