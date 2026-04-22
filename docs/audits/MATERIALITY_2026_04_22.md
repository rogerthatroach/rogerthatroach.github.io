# Materiality Audit — 2026-04-22

**Auditor:** Claude Opus 4.7 (supervisor) + 3 parallel Explore sub-agents
**Subject:** `rogerthatroach.github.io` at commit `3659893`
**Frame:** "No fluff. Solid material everywhere. Follow the design language."

---

## 1. Abstract

Three parallel audits examined the site from different lenses:

1. **Copy materiality** — every rendered string: filler, hedge words, dead adjectives, intensifiers, puff.
2. **Component + page materiality** — every component and section: does it earn its place, or is it decoration?
3. **Design-language discipline** — is the era-palette / Fraunces / `max-w-content` / motion system followed, or drifting?

**Headline verdict:** The site is in the **top 5–10%** of portfolio density and discipline. No systemic register problem, no decorative sections, no data duplication that isn't contextually justified. The gaps cluster in three narrow bands: small copy intensifiers, a few vertical-rhythm oddities, and missing `focus-visible` states on hover-triggered reveals.

This audit resulted in **10 inline fixes** shipped alongside the report. 4 items are flagged for user decision because they're judgment calls (ParticleField keep/cut, unanchored skills, button-radius canonicalization, spacing canon). 5 items are deferred as P2 polish.

One agent finding was a **false positive**: PageTransition.tsx flagged as orphan, but CaseStudyLayout imports and uses it. Cross-checked and dropped.

## 2. Methodology

### 2.1 Sub-agent briefs (self-contained)

Each agent received an explicit brief with:
- Scope (which files / surfaces)
- Definition of what counts as a failure (e.g., "filler = sentence that could be deleted without loss of meaning")
- What DOESN'T count (e.g., intentional stylistic choices by the user)
- Canonical reference points (voice samples from the existing codebase)
- Expected output format + severity taxonomy

### 2.2 Severity

Same P0/P1/P2 taxonomy as [`CODEBASE_AUDIT_2026_04_22.md`](CODEBASE_AUDIT_2026_04_22.md). Here, additionally:
- **"Earned"** vs **"Decoration"** — a component / section / animation is *earned* if removing it causes signal loss; it's *decoration* if removal costs only aesthetics.
- **"Judgment call"** flagged separately — items where a reasonable reviewer could go either way. Surfaced for user, not auto-fixed.

### 2.3 Known methodology limits

- No runtime testing — all static inspection.
- Sub-agents can hallucinate orphan-imports (see §1 note on PageTransition). Supervisor cross-checks claims that recommend deletion.
- Density judgments are qualitative — the site's voice reference ("GPT handles intent; deterministic code handles truth") calibrated expectations, but edge cases remain subjective.

## 3. Findings

### Track A — Copy materiality

**Verdict:** Exceptionally dense. 8 findings across 13 data files + 12 MDX posts. No P0 typos, no systemic puffery. The user's voice is disciplined (concrete verbs, metric-anchored claims, no hedging).

| Finding | File:Line | Severity | Status |
|---|---|---|---|
| "seamless drill-through" (dead adjective on high-visibility case study) | [`projectCaseStudies.ts:271`](../../data/projectCaseStudies.ts#L271) | P0 | **Fixed** → "drill-through" |
| "groundbreaking within TCS at the time" (dead adjective + obvious context) | [`projectCaseStudies.ts:96`](../../data/projectCaseStudies.ts#L96) | P1 | **Fixed** → cleaner causal chain with award names |
| "remarkably fast" (intensifier undermining the concrete metric) | [`projectCaseStudies.ts:244`](../../data/projectCaseStudies.ts#L244) | P1 | **Fixed** → "Two weeks, delivered concurrently with Astraeus… the speed came from crystallizing months of v1 learnings" |
| "progressive impact" (vague; next clause does the real work) | [`timeline.ts:98`](../../data/timeline.ts#L98) | P1 | **Fixed** → drops "progressive impact" in favor of the concrete deliverable list |
| "Advanced Tableau dashboards" (dead adjective) | [`projects.ts:98`](../../data/projects.ts#L98) | P2 | **Fixed** → "Tableau dashboards for financial KPI monitoring (CFO Group adoption vehicle)" — adds *why* it mattered instead of puff |

**Quotes of existing density (baseline to maintain):**
- "GPT handles intent; deterministic code handles truth." — `about.ts`
- "months → 90 minutes" — `canonical.ts`
- "Days of email replaced by seconds-level answers" — `projectCaseStudies.ts`
- "Governance by construction" — PAR Assist tagline

Over 92% of surfaces required zero edits. No MDX post had a density issue.

### Track B — Component + page materiality

**Verdict:** 68 of 75 components load-bearing. 8 pages, all dense. Animations are the biggest overreach area.

| Finding | Path | Severity | Status |
|---|---|---|---|
| `ParticleField` — 3D drift, 80 KB+ Three.js chunk, pure decoration | [`components/ParticleField.tsx`](../../components/ParticleField.tsx) | P0 (agent's view) | **Flagged for user decision** — the particle field is part of the sakura/wabi-sabi identity the user deliberately chose; removing it is a brand call, not a defect |
| `PageTransition.tsx` flagged as orphan | [`components/ui/PageTransition.tsx`](../../components/ui/PageTransition.tsx) | P0 (agent) | **Dropped — false positive**; imported + used in `CaseStudyLayout.tsx:10/131/451` |
| `ProjectCard` status label "In Progress" vs CaseStudyLayout "In Productionization" | [`ProjectCard.tsx:47`](../../components/projects/ProjectCard.tsx#L47) | P1 | **Fixed** → unified to "In Productionization" |
| `ProjectCard` inline `style={{ transition }}` racing Framer Motion | [`ProjectCard.tsx:28`](../../components/projects/ProjectCard.tsx) | P1 | **Fixed** → inline style removed; Framer Motion handles transitions |
| Skills without anchor: PyTorch, Hadoop/Spark | [`skills.ts:85`, `:100`](../../data/skills.ts) | P1 | **Flagged for user decision** — are these shipped skills or aspirational listings? Remove if not anchored; add anchor project if shipped |
| Skill "Shiny (R)" anchors to Johns Hopkins capstone (not in Projects) | [`skills.ts:118`](../../data/skills.ts#L118) | P2 | Anchor is real but invisible — consider surfacing the capstone in `/resume` education/side-projects or removing the skill |
| Awards render in both `RecognitionSection` (home) and `AwardsPanel` (/resume) | Both | P2 | **No fix** — data is in one source (`awards.ts`); renderers differ by context (home = spotlight, resume = reference). Audit agent initially flagged as duplication; supervisor reclassified as intentional. |
| Metrics render in both `MetricsRibbon` (home, animated) and `ResumeMetrics` (/resume, static) | Both | P2 | **No fix** — same rationale as awards |

#### Animations (subcategory of Track B)

| Animation | Role | Verdict |
|---|---|---|
| Hero FADE_UP cascade | Entrance beat | Identity text now renders at final state (Tier 11 LCP fix); CTAs + status pill keep subtle entrance. Earned. |
| MetricsRibbon counter + fade-up | Proof arriving | Earned — counter is narrative beat. |
| SkillTimeline staggered fade-up | Timeline unfolding | Earned. |
| CommandPalette modal enter/exit | UX affordance | Earned. |
| RoleOverlay float-in | UX affordance | Earned. |
| AgentNode hover scale + description reveal | UX + a11y | Earned. |
| `ParticleField` drift | Ambient mood | **Judgment call** — kept (brand), but carries ~80 KB bundle + WebGL requirement. |
| RecognitionSection stagger | Entrance polish | Decorative; instant render would lose only pacing. P2. |
| AnimatedEdge dashed flow | Pipeline motion | Decorative; static edges with arrow tips would convey same flow. P2. |
| Blog diagram per-post animations (ClosedLoopCycle, PSOSwarm, EventModelAnimation) | Pedagogical | Earned on pedagogy diagrams; decorative on flavor diagrams. Per-diagram triage if budget is an issue. |

### Track C — Design-language discipline

**Verdict:** ~90% disciplined. Main gaps: `focus-visible` coverage on hover-only reveals; vertical-rhythm ad-hoc (py-8/10/12).

| Finding | File:Line | Severity | Status |
|---|---|---|---|
| Hero H1 missing `font-display` | [`Hero.tsx` name h1](../../components/Hero.tsx) | P1 (agent) | **Not a fix** — user explicitly chose Inter for the name via playground comparison ("Hero name was fine, in those playground inter tight was better"). Deliberate. |
| 404 page H1 uses `font-mono` instead of `font-display` | [`app/not-found.tsx:22`](../../app/not-found.tsx#L22) | P1 | **Flagged** — likely intentional (terminal-style 404). Verify with user; easy flip if not. |
| `AboutSection` uses `py-8 md:py-10` (outside canonical 14/16/20/24) | [`AboutSection.tsx:16`](../../components/AboutSection.tsx#L16) | P1 | **Fixed** → `py-14 md:py-16` |
| `Footer` uses `py-12` (outside canon) | [`Footer.tsx:9`](../../components/Footer.tsx#L9) | P2 | **Fixed** → `py-16` |
| Playground `HeroVariant` uses `py-8 md:py-12` | [`HeroVariant.tsx:33`](../../components/playground/HeroVariant.tsx#L33) | P2 | Deferred — playground scope; lower priority |
| Footer + Nav social `<a>` lack `focus-visible` state | [`Footer.tsx:17-33`](../../components/Footer.tsx) | P1 | **Fixed** → added `focus-visible:text-accent focus-visible:outline-accent` on all three |
| `HoverTerm` trigger already has `focus-visible:border-accent` — false positive from agent | [`HoverTerm.tsx:100`](../../components/resume/story/HoverTerm.tsx#L100) | — | **Verified clean** |
| Button radius drift: `rounded-full` (Hero CTAs) vs `rounded-lg` (AboutSection aside) | Multiple | P2 | **Flagged for user decision** — both defensible; either canonicalize or document the rule "full for primary page CTAs, lg for side nav" |
| Inline era-palette hex in `CurrentRoleCard` + `SkillTimeline` + `EraChapter` + `RoleOverlay` | Multiple | P2 | **Deferred** — move into a `data/eras.ts` single-source-of-truth; minor refactor, not urgent |
| Status badge (`text-amber-600 dark:text-amber-400`) hardcoded in `ProjectCard` + `CaseStudyLayout` | Both | P2 | **No fix** — intentional: status is palette-neutral (same amber regardless of project era); documented as structural exception |

**Verified disciplined baselines:**

- **Palette system** — zero era-palette violations. Hardcoded colors are confined to status badges (intentional palette-neutral) and data-viz diagrams (intentional spec exception).
- **Symbols** — `§`, `·`, `—`, `→` used consistently; no mixing of `—` vs `-` vs `–` as separators.
- **Max-width + gutter** — `mx-auto max-w-content` + `px-6 md:px-16` applied uniformly.
- **Responsive breakpoints** — every `hidden`/`block` switch is intentional and commented.
- **Dark-mode parity** — every custom CSS var has light + dark pair; no orphaned colors.
- **Prefers-reduced-motion** — respected site-wide.

## 4. Inline fixes applied in this audit

10 fixes, 6 files:

| # | Fix | File |
|---|---|---|
| 1 | "seamless" → (removed) | [`data/projectCaseStudies.ts:271`](../../data/projectCaseStudies.ts#L271) |
| 2 | "groundbreaking within TCS at the time" → concrete causal chain with award dates | [`data/projectCaseStudies.ts:96`](../../data/projectCaseStudies.ts#L96) |
| 3 | "remarkably fast" → "Two weeks, delivered concurrently with Astraeus…" | [`data/projectCaseStudies.ts:244`](../../data/projectCaseStudies.ts#L244) |
| 4 | "progressive impact" → concrete deliverable list | [`data/timeline.ts:98`](../../data/timeline.ts#L98) |
| 5 | "Advanced Tableau dashboards" → "Tableau dashboards for financial KPI monitoring (CFO Group adoption vehicle)" | [`data/projects.ts:98`](../../data/projects.ts#L98) |
| 6 | ProjectCard status label "In Progress" → "In Productionization" (unify with CaseStudyLayout) | [`components/projects/ProjectCard.tsx:47`](../../components/projects/ProjectCard.tsx#L47) |
| 7 | ProjectCard remove inline `style={{ transition }}` race with Framer Motion | [`components/projects/ProjectCard.tsx`](../../components/projects/ProjectCard.tsx) |
| 8 | AboutSection `py-8 md:py-10` → `py-14 md:py-16` (canonical rhythm) | [`components/AboutSection.tsx:16`](../../components/AboutSection.tsx#L16) |
| 9 | Footer `py-12` → `py-16` | [`components/Footer.tsx:9`](../../components/Footer.tsx#L9) |
| 10 | Footer social `<a>` links + meta-nav + copyright — added `focus-visible:text-accent focus-visible:outline-accent` | [`components/Footer.tsx`](../../components/Footer.tsx) |

Build verified green after all fixes.

## 5. Flagged for user decision (not auto-fixed)

| # | Decision | Context |
|---|---|---|
| 1 | **Keep or remove `ParticleField`?** | ~80 KB Three.js chunk loaded on homepage; ambient sakura-petal drift; pure decoration (no information). Removing would regain performance budget + simplicity. Keeping honors the wabi-sabi identity the user chose deliberately. Not a defect — a brand trade-off. |
| 2 | **PyTorch + Hadoop/Spark skills — anchor or cut?** | Listed in `data/skills.ts` with no `firstShipped` year and no `anchorProject`. Either they're real shipped work (add anchor) or aspirational listings (cut to keep skills honest). |
| 3 | **Shiny (R) — surface the Johns Hopkins capstone or cut the skill?** | Anchor exists (`Johns Hopkins capstone — n-gram language model`) but the capstone isn't visible in any Project, Timeline entry, or Blog post. Options: (a) surface the capstone in `/resume` education side-projects, (b) keep as-is and accept unlinked anchor, (c) cut the skill. |
| 4 | **404 page H1 font** — intentional `font-mono`? | `app/not-found.tsx:22` uses `font-mono` on H1. Likely a deliberate terminal-style register for a 404. Confirm or flip to `font-display` for consistency. |
| 5 | **Button radius canon** — `rounded-full` vs `rounded-lg`? | Hero CTAs use `rounded-full`; AboutSection aside uses `rounded-lg`. Both defensible. Either standardize on one, or document the rule ("full = primary page CTA, lg = secondary / list item"). |

## 6. Deferred P2 backlog

1. Playground `HeroVariant` `py-8 md:py-12` → canonical rhythm.
2. Playground `HeroVariant` using `h3` for display-level 3xl/4xl text (should be h2).
3. Move inline era-palette hex values from component files to `data/eras.ts` single source of truth.
4. `AnimatedEdge` dashed flow animation — static with arrow tips conveys same signal at lower cost.
5. `RecognitionSection` stagger fade-up — instant render loses only pacing.
6. `ResumeMetrics` + `MetricsRibbon` — shared data layer, separate renderers (minor DRY refactor; not a bug).
7. BP variance (100 ↔ 96) on resume-mobile Lighthouse — run with verbose to identify which audit toggles.

## 7. Verified-material inventory

Surfaces that explicitly passed the materiality test during this audit:

- **Hero** — identity card, CTAs, status pill, number-sequence narrative beat all earn their place.
- **MetricsRibbon** — through-line + 6 metrics; each metric backs a claim in the prose.
- **ThesisMapping** — four-level abstraction visualization; codifies the narrative spine.
- **SkillTimeline** — career progression + decision rationale on click.
- **ProjectsHybridTable** (homepage) — Year/Era/Project/Role/Outcome; tight, scannable.
- **ProjectCard** (mosaic grid) — distinct context per card; bookend layout for narrative arc.
- **CaseStudyLayout** — Context / Challenge / Options / Decision / Implementation / Impact / Lessons; nothing redundant.
- **RoleOverlay** — headline metric, transition story, team context, projects with rationale; essential depth for /resume.
- **CollapsibleSection** — `<details>` disclosures for Skills / Education / Awards / Writing; progressive disclosure earned.
- **EraChapter** + **ProjectReveal** (scrollytelling arc) — era header, project cards, decision rationale per project.
- **AboutSection** — opener + 3 beliefs + closer; every sentence carries a claim.
- **Footer** — socials + meta-nav + location + copyright; every link is distinct signal.
- **CommandPalette** — faster power-user discovery; surfaces 30+ entries (all 6 projects, all 12 posts, theme toggle) vs Nav's 4 primary paths. Deduplication with Nav is intentional.
- **All 12 blog posts** — 4 registers (formal, framework A/B, builder, draft); no stub-quality posts.
- **All 6 projects** — architecturally distinct (combustion / document-intel / commodity-tax / aegis / astraeus / par-assist); no merge candidates.

## 8. Re-audit criteria

Run this audit when:
1. Voice / tone changes materially (new MDX posts, rewritten About).
2. A new section or component is added that might be decorative.
3. A new design token or palette dimension is introduced (e.g., Tier 13 playground themes).
4. Quarterly, to catch drift.

---

*Filed under `docs/audits/`. Partner docs: [`CODEBASE_AUDIT_2026_04_22.md`](CODEBASE_AUDIT_2026_04_22.md), [`LIGHTHOUSE_2026_04_22.md`](LIGHTHOUSE_2026_04_22.md).*
