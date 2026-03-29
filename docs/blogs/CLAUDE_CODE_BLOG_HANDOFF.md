# Claude Code Handoff — Technical Blog Posts

> **Date:** 2026-03-29
> **Context:** Three technical whitepapers to be rendered as interactive blog posts on the portfolio at rogerthatroach.github.io
> **Instruction:** Read this file FIRST. Then read PORTFOLIO_BUGFIX_AND_ENHANCEMENT.md. Fix the bugs before building blog posts.

---

## Prerequisites

Before building blog posts, the critical bugs must be fixed:
1. Metrics section showing zeros
2. Duplicate timeline entries
3. PAR Assist diagram not rendering
4. Contact links in footer

See `PORTFOLIO_BUGFIX_AND_ENHANCEMENT.md` for details. Fix those first, deploy, then proceed here.

---

## Blog Infrastructure (Build This First)

### Step 1: Blog Route and Layout

Create the blog infrastructure before adding any content.

**Route structure:**
```
app/
├── blog/
│   ├── page.tsx                    # Blog index — list of all posts
│   └── [slug]/
│       └── page.tsx                # Individual post page (dynamic route)
components/
├── blog/
│   ├── PostCard.tsx                # Card for blog index listing
│   ├── PostLayout.tsx              # Shared layout for all posts (title, date, tags, reading time, references)
│   ├── MathBlock.tsx               # LaTeX rendering component
│   ├── InlineEquation.tsx          # Inline LaTeX rendering
│   ├── ReferenceList.tsx           # Academic references section
│   ├── FurtherReading.tsx          # Further reading section
│   ├── VisualizationContainer.tsx  # Wrapper for interactive diagrams (handles loading state, intersection observer)
│   └── diagrams/                   # Post-specific interactive components
│       ├── AgenticArchitecture.tsx
│       ├── SubAgentExecution.tsx
│       ├── EPMTranslation.tsx
│       ├── FiveStagePipeline.tsx
│       ├── EmbeddingSpace.tsx
│       ├── GuardrailValidator.tsx
│       ├── PSOSwarm.tsx
│       ├── ModelSelectionScatter.tsx
│       ├── ClosedLoopCycle.tsx
│       └── AbstractionLadder.tsx
data/
├── posts/
│   ├── agentic-ai.ts              # Post metadata + content
│   ├── text-to-sql.ts             # Post metadata + content
│   └── closed-loop.ts             # Post metadata + content
```

### Step 2: Math Rendering

Install KaTeX for LaTeX rendering:
```bash
npm install katex
npm install @types/katex --save-dev
```

Create `MathBlock.tsx` and `InlineEquation.tsx` components:
- `MathBlock` renders display-mode equations (centered, larger) — used for theorems, proofs, major equations
- `InlineEquation` renders inline equations within text — used for variable references, short expressions
- Both use `katex.renderToString()` with `displayMode` flag
- Include KaTeX CSS in the blog layout

**Important:** The blog posts use `$$...$$` for display math and `$...$` for inline math. The components should parse these from the post content OR the post content should be structured as React components that use `<MathBlock>` and `<InlineEquation>` directly. The latter approach (React components) is more reliable.

### Step 3: Post Layout Component

`PostLayout.tsx` should include:
- Title (large, white)
- Author + date + estimated reading time
- Keywords/tags (styled pills, like the tech tags on project cards)
- Abstract section (slightly indented, different background)
- Main content area
- Section numbering (auto-generated from headings)
- `ReferenceList` at bottom (numbered, academic style: [1], [2], etc.)
- `FurtherReading` after references
- Confidentiality disclaimer (the italic note at the bottom of each post)
- Back to blog index link
- Share / copy link button (optional, nice-to-have)

### Step 4: Blog Index Page

`blog/page.tsx` — simple grid of `PostCard` components showing:
- Post title
- Subtitle / one-line description
- Date
- Reading time
- Tags
- A small preview of the hero diagram (static thumbnail version)

---

## Post Implementation Order

Build posts in this order. Each post adds complexity — earlier posts establish patterns that later posts reuse.

### Phase 1: Post 1 — Agentic AI (Simplest Diagrams)

**Source file:** `blog_post_1_agentic_ai_v2.md`

**Content structure:** Convert the markdown into a React component (or MDX if you prefer) that uses `MathBlock`, `InlineEquation`, and the diagram components.

**Diagrams to build (in order of complexity):**

#### Diagram 1A: Architecture Comparison (Static SVG)
- Two architectures side by side: Monolithic vs LLM-as-Router
- LEFT: single LLM box receiving query + data, red X marks
- RIGHT: two-layer split, green checkmarks
- This is a static SVG with Framer Motion entrance animation (fade in left, then right)
- **Complexity: Low** — this is just boxes, arrows, and labels

#### Diagram 1B: Sub-Agent Parallel Execution (Animated SVG)
- Router node at top distributes to 3 parallel agent tracks
- Interactive: dropdown to select query type, corresponding track highlights
- Show timing visualization (parallel = max, not sum)
- **Complexity: Medium** — needs state management for the dropdown + conditional highlighting
- Use Framer Motion `variants` for the highlight animation

#### Diagram 1C: EPM-to-SQL Translation Pipeline (Interactive SVG)
- 4 stages flowing left to right: Cubes → Groups → Employees → Transits → SQL
- Interactive: toggle between two user permission sets to see output change
- **Complexity: Medium** — needs state for toggle + data flowing through stages

#### Diagram 1D: Full System Architecture (Hero Diagram)
- Top-to-bottom flow with clear two-layer separation
- Layer 1 (blue): User Query → LLM Router → Structured Intent
- Layer 2 (green): Intent → 3 parallel agent tracks → Response Formatter → Outputs
- Boundary line between layers (dashed red)
- Interactive: dropdown for query type, toggle for entitlement filter visibility, node tooltips
- **Complexity: Medium-High** — most complex diagram in Post 1
- Build this LAST within Post 1

#### Diagram 1E: Event Model Animation (Animated SVG)
- Organizational hierarchy (3 divisions, 2 rollups each)
- Animate employee transfers: show events firing, counters updating
- Interactive: drag employee between positions (stretch goal — if too complex, make it click-based)
- **Complexity: High** — skip the drag interaction for v1, use click-to-transfer instead

**Math rendering in Post 1:**
- 4 formal requirements (set notation)
- Definition 1 (LLM-as-Router), Proposition 1 (parallel correctness proof)
- Theorem 1 (data confidentiality proof), Corollary 1
- Definition 2-4 (context exposure, EPM permissions, SQL filters)
- Proposition 2 (entitlement preservation proof)
- Theorem 2 (intra-rollup netting proof)

---

### Phase 2: Post 2 — Text-to-SQL (Medium Diagrams)

**Source file:** `blog_post_2_text_to_sql_v2.md`

#### Diagram 2A: Five-Stage Pipeline (Animated SVG)
- Horizontal flow with 5 distinct blocks
- Color coding: blue (LLM stages), green (deterministic stages)
- Click any stage to expand into sub-diagram
- **Complexity: Medium** — collapsible sections within an SVG

#### Diagram 2B: Embedding Space Visualization (Interactive Canvas/SVG)
- 2D scatter plot of KPI embeddings (simulated positions for ~30 KPIs)
- Clusters visible (interest margin, efficiency, capital)
- Text input: user types a metric reference, a point appears and lines draw to nearest neighbors
- Show cosine similarity scores on connecting lines
- **Complexity: High** — needs a text input wired to simulated embedding positions
- Use pre-computed 2D positions (not real embeddings — simulate plausible cluster layout)
- Use D3.js or pure SVG for the scatter + connecting lines

#### Diagram 2C: Guardrail Validation Flow (Interactive)
- Vertical flow: SQL enters from top, passes through 4 validation gates
- Provide example inputs: normal query, injection attempt, wrong table, DELETE statement
- Each gate shows pass/fail with explanation
- **Complexity: Medium-High** — needs a dropdown/selector for example inputs + conditional rendering per gate

#### Diagram 2D: Full Pipeline with Query Flow (Hero Diagram)
- Combined version of 2A with sample query flowing through
- Show disambiguation branching (high confidence → proceed, low → clarify)
- **Complexity: Medium** — builds on 2A, adds animation

**Math rendering in Post 2:**
- Requirements 1-4 (formal)
- Cosine similarity formula
- Candidate set retrieval formula
- Proposition 3 (embedding robustness)
- Disambiguation decision function (Definition 6)
- Proposition 4 (disambiguation safety proof)
- SQL template definition (Definition 7)
- Theorems 3-4 (injection impossibility, schema compliance proofs)

---

### Phase 3: Post 3 — Closed-Loop / PSO (Most Complex Diagrams)

**Source file:** `blog_post_3_closed_loop_v2.md`

#### Diagram 3A: Closed-Loop Cycle (Interactive SVG)
- Circular flow: Sense → Model → Optimize → Act → (back to Sense)
- 4 tabs: Physical, Cloud, Financial, Intelligent
- Selecting a tab relabels all nodes with domain-specific instantiation
- **Complexity: Medium** — tabbed state + label swapping

#### Diagram 3B: Model Selection Dashboard (Interactive Scatter)
- Scatter plot: x = R², y = inter-fold variance
- Points color-coded by algorithm (linear, tree, SVM)
- Green zone = acceptable region
- Slider for σ_max threshold — filters unstable models
- Hover for all 5 metrics
- **Complexity: Medium-High** — use simulated data for ~50 model candidates across 5 algorithm types
- Use Recharts or D3 for the scatter plot

#### Diagram 3C: PSO Swarm Simulation (THE CENTERPIECE)
- 2D optimization landscape rendered as a heatmap (use Rastrigin function or custom multi-modal surface)
- N=30 particles as dots moving through the space
- Particle trails showing history
- Personal best + global best markers
- **Interactive controls:**
  - Play/Pause button
  - Slider: inertia weight w (0.2 to 1.0)
  - Slider: c1 cognitive coefficient
  - Slider: c2 social coefficient  
  - Slider: swarm size N (10 to 100)
  - Reset button
  - Speed slider
- Convergence plot (best value vs iteration) updating in real-time alongside the main visualization
- **Complexity: Very High** — this is a full simulation
- Use `requestAnimationFrame` for the animation loop
- The PSO update equations (velocity + position) run in JS — they're simple arithmetic
- The landscape function is just `f(x,y) = A*n + sum(x_i^2 - A*cos(2*pi*x_i))` for Rastrigin
- Render the heatmap as an off-screen canvas, overlay particles as SVG or canvas dots
- **Build tip:** Get the simulation logic working first (console.log particle positions), then add rendering, then add controls

#### Diagram 3D: Abstraction Ladder (Hero — Potentially Portfolio Home Page)
- 4 horizontal rows stacked vertically
- Each row = 4 nodes (Sense, Model, Optimize, Act) connected horizontally
- Vertical lines connecting corresponding nodes across levels
- Color per level: orange (physical), purple (cloud), green (financial), blue (intelligent)
- Interactive: hover for tooltips, click row to expand, toggle "Show Technologies" 
- Scroll animation: builds from bottom up, each level materializes with connection lines drawing in
- **Complexity: High** — but structurally simpler than the PSO simulation (it's styled SVG with animation)

**Math rendering in Post 3:**
- Definition 1 (closed-loop system 4-tuple)
- Properties 1-3
- Pearson correlation formula
- All 5 model evaluation metrics (R², RMSE, MAPE, MAE, fold variance)
- Definition 2 (model selection criterion)
- Definition 3 (particle state)
- PSO velocity + position update equations
- Multi-objective formulation with constraints
- Proposition 5 (convergence) + probability formula
- Theorem 5 (non-convexity robustness sketch)
- Definition 4 (structural isomorphism)

---

## Technical Notes for Claude Code

### Math Rendering
- Use KaTeX, not MathJax (faster rendering, better for React)
- Display math: `katex.renderToString(latex, { displayMode: true })`
- Inline math: `katex.renderToString(latex, { displayMode: false })`
- Wrap in `dangerouslySetInnerHTML` — KaTeX output is safe HTML
- Import KaTeX CSS: `import 'katex/dist/katex.min.css'`

### Diagram Components
- All diagrams should be wrapped in `VisualizationContainer` which handles:
  - Intersection Observer (animate only when in viewport)
  - Loading state (show skeleton while JS loads)
  - Responsive sizing (diagrams should scale with container width)
- Use Framer Motion for entrance animations and state transitions
- Use SVG for static/animated diagrams
- Use Canvas for the PSO simulation (performance — 100 particles × 60fps needs canvas, not SVG)
- Interactive controls should use standard React state (useState) — no external state management needed

### Responsive Design
- Diagrams should be viewable on mobile (minimum 320px width)
- Interactive controls should stack vertically on small screens
- The PSO simulation can show fewer particles on mobile (N=15 instead of 30)
- Math equations should use KaTeX's `fleqn` option for left-aligned display on narrow screens

### Performance
- Lazy-load diagram components (React.lazy + Suspense) — the blog text should render immediately, diagrams load after
- The PSO simulation should pause when not in viewport (Intersection Observer)
- Pre-compute the heatmap for the PSO landscape — don't recalculate every frame

### Color Palette (Match Existing Site Theme)
- Background: inherit from site (dark)
- Diagram backgrounds: slightly lighter than page background (e.g., rgba(255,255,255,0.03))
- Node fills: use accent colors from the site's existing palette
- Text in diagrams: white or light gray
- Connections/arrows: medium gray, highlighted connections in accent color
- Interactive highlights: brighter version of accent color
- Pass/fail indicators: green (#4ade80) / red (#f87171)

### Theorem/Proof Styling
- **Definition** blocks: left border accent color, slightly indented, labeled "Definition N"
- **Theorem** blocks: left border + subtle background tint, labeled "Theorem N"
- **Proposition** blocks: same as theorem but lighter styling
- **Proof** blocks: indented, preceded by "Proof." in italic, ended with □ (QED square)
- **Corollary** blocks: lighter than theorem, follows the theorem it derives from

---

## Execution Order Summary

```
PHASE 0: Fix critical bugs (PORTFOLIO_BUGFIX_AND_ENHANCEMENT.md)
  → Deploy

PHASE 1: Blog infrastructure
  → Blog route, post layout, math rendering, reference components
  → Deploy

PHASE 2: Post 1 (Agentic AI) — content + diagrams 1A through 1E
  → Deploy

PHASE 3: Post 2 (Text-to-SQL) — content + diagrams 2A through 2D
  → Deploy

PHASE 4: Post 3 (Closed-Loop/PSO) — content + diagrams 3A through 3D
  → Deploy

PHASE 5: Add blog link to main navigation
  → Deploy
```

Each phase = one or more commits. Deploy after each phase to catch issues early.

---

## Content Files

The three blog post markdown files contain:
- Full text content (convert to React components or MDX)
- `<!-- VISUALIZATION SPEC -->` comment blocks defining each diagram's requirements
- LaTeX equations (convert to KaTeX calls)
- Reference lists (convert to ReferenceList component data)

File names:
- `blog_post_1_agentic_ai_v2.md`
- `blog_post_2_text_to_sql_v2.md`
- `blog_post_3_closed_loop_v2.md`

Place these in the repo root or in `docs/blog/` for Claude Code to reference during implementation.
