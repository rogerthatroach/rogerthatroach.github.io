# Claude Code Handoff — Portfolio Rebuild

> **Date:** 2026-03-29
> **From:** Planning session in Claude.ai
> **To:** Claude Code build session
> **Action:** Read these docs, then rebuild the portfolio from the thesis up.

---

## Step 1: Read These Documents (In This Order)

1. **`CLAUDE.md`** (root) — Project brain. Session protocol, coding standards, skill hooks.
2. **`docs/specs/PORTFOLIO_VISION.md`** — THE MOST IMPORTANT FILE. Read the "Thesis — READ THIS FIRST" section. This defines what we're building and why. The portfolio has an arc, not sections.
3. **`docs/career/KNOWLEDGE_BASE_ADDENDUM_FINAL.md`** — New details: Digital Twin is now "Combustion Tuning" with 84 models, PSO, NOx/SOx/CO emissions. Aegis v1 benchmarks Big 6 banks. 5th award confirmed.
4. **`docs/career/CAREER_KNOWLEDGE_BASE.md`** — Full career content.
5. **`docs/specs/PORTFOLIO_SPEC.md`** — Technical spec (stack, structure, deployment).
6. **`docs/specs/COVERAGE_ANALYSIS.md`** — Gap analysis (all must-haves now filled).

---

## Step 2: Understand the Rebuild Direction

### What's Wrong with the Current Site
The current site at rogerthatroach.github.io is organized by generic sections (hero → metrics → journey → projects → about). It treats the career as a list. It reads like a resume on a dark background.

### What We're Building Instead
A portfolio that demonstrates **systems thinking expressed as design.** The defining thesis:

> Milap took physical-world complexity (a 900MW power plant) and learned to model it. Then he applied that same systems-thinking pattern at increasing levels of abstraction — cloud ML, financial analytics, agentic AI — until he was architecting intelligent systems that make enterprise decisions.

The portfolio should make a hiring manager **FEEL** that ascending arc in 60 seconds of scrolling.

### The Arc (One Pattern, Four Levels)
```
Level 1: Physical Systems  → Sense → Model → Optimize (PSO) → Act
Level 2: Cloud Systems     → Ingest → Model → Optimize → Deliver  
Level 3: Financial Systems → Extract → Model → Optimize → Report
Level 4: Intelligent Systems → Ingest → Agent → Optimize (RAG/MCP) → Decide
```

---

## Step 3: Build Plan

### Phase 1 — Foundation Rebuild
- [ ] Rebuild the hero: Number Sequence concept (see PORTFOLIO_VISION.md §1)
  - $3M → 90 min → 40,000 transits → 2 weeks → Bank-wide → Name reveal
  - Each frame is a massive monospace number + ghosted context
  - Auto-advance or scroll-triggered
- [ ] Add 3D particle mesh background (Three.js r128) — subtle, scroll-reactive
- [ ] Implement the Abstraction Ladder visual between hero and projects
  - 4 levels ascending, one curved line connecting them
  - Each level: era label + project names + one metric + color ramp

### Phase 2 — Architecture-as-Content Projects
- [ ] Replace text-heavy project cards with SVG architecture diagrams
- [ ] **Digital Twin (Combustion Tuning):** Sensor array → Feature Engineering → 84 Models → PSO → Operators → $3M. Warm palette (amber/coral). Industrial schematic feel.
- [ ] **PAR Assist:** User → LangGraph → MCP Tools (3 branches) → RAG Layers (3 tiers) → Draft. Purple palette.
- [ ] **Astraeus:** GPT Router → 3 Sub-Agents (parallel lanes) → Merge → Outputs. Blue/teal palette.
- [ ] **Aegis v2:** NL → Intent Parse → KPI Detect → Disambiguation → Text-to-SQL → Results. Green palette.
- [ ] **Commodity Tax:** Before (months, red) → After (90 min, green). Simplest diagram.
- [ ] All diagrams animate on scroll: nodes appear, then connections draw themselves
- [ ] Max 40 words per project caption beneath each diagram

### Phase 3 — Supporting Sections
- [ ] About section: 80 words max. Include the 70/30 bar (hands-on vs leadership)
- [ ] Awards: compact horizontal strip, 5 items
- [ ] The Pattern Strip: "Same pattern at every level: model the system → find the leverage point → automate the decision → measure the impact."
- [ ] Footer with contact links
- [ ] Total page word count: ≤300 (excluding tech tags)

### Phase 4 — Polish
- [ ] Responsive: 375px → 768px → 1440px
- [ ] Reduced motion fallbacks for all animations + 3D
- [ ] Lighthouse 90+ all categories
- [ ] SEO metadata, og:image
- [ ] Final content review against CAREER_KNOWLEDGE_BASE.md

---

## Key Technical Notes

### SVG Architecture Diagrams
- Build as React components in `/components/diagrams/`
- Use Framer Motion `pathLength` for connection draw animation
- Use `useInView` for scroll-triggered entrance
- Dark theme native: all colors on #0a0a0a background
- Interactive: hover a node → highlight its connections
- Consistent visual language across all 5 diagrams

### Three.js (Hero Background)
- CDN: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- No CapsuleGeometry (r142+), no OrbitControls import
- BufferGeometry + Points for particle mesh
- Canvas with `position: absolute; z-index: 0` behind hero content
- Link camera position to scroll for parallax
- <10K triangles for mobile
- Static fallback for reduced-motion

### Word Budget
| Section | Max Words |
|---------|-----------|
| Hero tagline | 12 |
| Each project caption | 40 |
| About section | 80 |
| Pattern strip | 25 |
| Entire page | 300 |

---

## Content Updates to Apply

### Digital Twin → Combustion Tuning
- Project name on portfolio: **"Combustion Tuning"** (subtitle: "Digital Twin — 900MW Coal Plant")
- Team: 3-person R&D team, Milap was the ML engineer
- Client: MHPS (Mitsubishi Hitachi Power Systems)
- Objective: Reduce NOx, SOx, CO emissions
- Scale: 90+ sensors, 84 output models
- Architecture: Sensors → Feature Eng → ML Regression → PSO → Optimal Settings → Operators
- Impact: $3M/yr savings + emissions reduction
- Era: R&D cutting-edge 2017-2018

### Aegis v1
- Data: Supplementary Financial Package from Big 6 Canadian banks
- Derived KPIs for peer benchmarking
- v1 → v2 story: foundation → AI-native intelligence layer

### Awards (now 5, confirmed)
Add: CFO One RBC Team Award (2025) — LLM/AI initiatives, esp. Aegis v1

### PAR Assist Scale
"Enterprise-wide platform serving PAR authors across all RBC business lines"

---

*Start with Phase 1. Commit after each major component. Update docs/CHANGELOG.md at session end.*
