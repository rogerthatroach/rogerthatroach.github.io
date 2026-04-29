# Portfolio Hiring-Readiness Audit — 2026-04-29

> Devil's-advocate review of `rogerthatroach.github.io` against senior AI/ML hiring-manager bar. Combines a thorough codebase audit with external best-practice synthesis (Eugene Yan, Lilian Weng, Simon Willison, Dan Luu, StaffEng, Pragmatic Engineer).

---

## Verdict

**Not ready to share broadly. ~2 days of focused work away from being so.**

Architecture, narrative arc, and technical chops are strong. Strong enough that hiring managers who get past the issues will take the call. But there are 3-4 specific items that, if a director-level reader notices, will torch credibility instantly. They have to be fixed before this goes out.

---

## Hard truths (devil's advocate)

### 1. There is a fabricated anecdote shipped to production. 🔴

The Commodity Tax builder post anchors on a "cycle-1 analyst catches stale GST mapping during drill-down" scene. The gap doc [`docs/plans/COMMODITY_TAX_OPEN_GAPS_2026_04_26.md`](../plans/COMMODITY_TAX_OPEN_GAPS_2026_04_26.md) (lines 40-42) explicitly flags this as "invented from prose context." If a hiring manager asks "tell me about a real bug you caught with that system" on a call and the writeup turns out to be reconstructed narrative, recovery in the same conversation is unlikely.

**This is the #1 ship-blocker.**

### 2. Two draft posts are linked from live case studies. 🔴

[`combustion-tuning-operators`](../../data/posts/combustion-tuning-operators.mdx) and [`document-intelligence-accuracy-cliff`](../../data/posts/document-intelligence-accuracy-cliff.mdx) are `status: 'draft'` in [data/posts/index.ts](../../data/posts/index.ts) but referenced by `companionBlogPostSlug` in [data/projectCaseStudies.ts](../../data/projectCaseStudies.ts). Click through and they 404. Static-export 404s on a portfolio claiming engineering rigor are self-defeating.

### 3. Placeholder metrics ship as facts. 🔴

Aegis formal post cites ECE thresholds ("below 0.05") and eval-set sizes ("~200") that [`docs/plans/AEGIS_OPEN_GAPS_2026_04_26.md`](../plans/AEGIS_OPEN_GAPS_2026_04_26.md) flags as awaiting confirmation. Senior hiring managers ask "how was that measured" — the current answer is "those are my best guesses." Either get the numbers from prod or replace with calibrated language ("calibration metrics tracked but not yet stabilized for public reporting").

### 4. The "2 weeks" Aegis v2 framing reads as overclaim depending on context. 🟡

[data/canonical.ts](../../data/canonical.ts) admits it's a *concurrent refactor alongside other work*; some surfaces let it read as "built v2 in 2 weeks." Get this consistent everywhere — hiring managers cross-read surfaces.

### 5. ~14 published posts and no OSS artifact. 🟡

Biggest gap against staff/principal-level peers (Eugene Yan, Lilian Weng, Simon Willison, Chip Huyen). They all have either a repo, a paper, or a talk that the writing points to. The current portfolio has writing → writing → writing.

A single small OSS repo (a calibration eval harness, a SQL-template-bank toy, a provenance-graph demo) — even 200 lines of working code — would 10x the trust signal of any single blog post.

---

## The "trying too hard" risk

Best-in-class senior AI/ML portfolios — Dan Luu, Julia Evans, Eugene Yan, Simon Willison, Lilian Weng — are **deliberately plain**. Plainness is a flex when the writing carries weight. The current site has:

- A 6-theme picker
- A particle field on the hero
- A scrolling number sequence
- KaTeX equations on builder-register posts (where they don't earn their place)
- Custom diagram framework, accordion, command palette
- 7 architecture docs in `docs/plans/`

Some is genuinely good craft (theme-aware diagrams, AA-tuned palettes, the cascade diagram family). Some pattern-matches to "designer cosplaying engineer" or "bootcamp grad with a Notion export."

**Rule of thumb (Gergely Orosz / StaffEng / Pragmatic Engineer):** every animation should answer *"what does this tell the reader they couldn't get from static text?"* If it doesn't — cut it.

Specifically question:
- The particle field (weakest signal)
- The number-sequence carousel
- The 6-theme picker (strongest of the three — actually well-engineered, but stacked with the others reads as visual budget compensating for content thinness)

---

## What's actually working

- **Architecture-first POV**: "I architect AI systems inside governance envelopes" is a real, differentiated thesis, repeated coherently across posts. Strongest part of the portfolio.
- **Three-register framework** (formal § / practitioner ¶ / builder ◯) is genuinely novel and shows craft in technical writing.
- **Career arc reads cleanly**: power plants → cloud → bank → enterprise AI. 7.5y, no padding, audited honestly.
- **Cascade diagram family** across Prometheus / Astraeus / Aegis / Commodity Tax gives the site visual coherence that most engineering portfolios lack.
- **A11y / theme tuning is real engineering**, not vanity — AA contrast across 6 themes is harder than it looks.
- **Honesty in [data/canonical.ts](../../data/canonical.ts) comments** ("v2 is a refactor of v1, not independent delivery"; "GCP cert removed - expired Jan 2024") shows calibrated self-reporting. Hiring managers who notice this will trust the rest more.
- **Open-gaps docs exist at all** — that the site has been audited and what's invented vs verified is written down is itself a strong signal. The fix is: act on them before sharing.

---

## Top 5 fixes, ordered by impact

1. **Kill or replace the fabricated Commodity Tax cycle-1 anecdote.** Either swap with a real anecdote or rewrite the section to omit the dramatized scene. Non-negotiable.
2. **Resolve the draft-post 404s.** Either publish the two drafts (even thin), or strip the `companionBlogPostSlug` references from the case studies, or replace with "Companion writeup in progress" affordance.
3. **Replace placeholder metrics with calibrated language** in Aegis formal post until verified numbers exist. "Calibration is tracked via ECE; specifics pending public-disclosure review" is honest and survives questioning.
4. **Cut one or two visual flourishes** — particle field, number sequence carousel, or theme picker. Pick the most "trying hard" and remove it. Particle field is the weakest signal.
5. **Prune to depth over breadth.** A staff portfolio with 4-6 deeply argued posts and one OSS repo beats 14 posts and no code. Mark the weakest 4-5 as drafts (or move to `/notes`) and elevate the strongest 5-6 as the canonical set.

---

## Smaller items worth knowing

- No `sitemap.xml` linked from `robots.txt` (verify [app/sitemap.ts](../../app/sitemap.ts) emits in `out/`).
- The "$3M savings" combustion metric has no methodology one-liner — even "measured against [baseline]" would help.
- `docs/plans/` is checked in — fine for transparency, but a hiring manager browsing the repo will see internal scaffolding. Either lean into it (link from `/colophon` as "how this site was built") or move to a separate location.
- Bank list (Big-6) on Aegis: gap doc flags as decision pending. Default to generalized ("a top-5 Canadian bank") unless RBC has explicitly approved naming peers.
- Resume PDF — confirm regenerated from current Master Resume; open gap docs imply it may be stale.

---

## External best-practices synthesis

Distilled from Eugene Yan (`eugeneyan.com/start-here`), Lilian Weng, Simon Willison, Dan Luu, Will Larson (StaffEng), Gergely Orosz (Pragmatic Engineer), Chip Huyen, Julia Evans, Dan Abramov.

### What separates a "personal blog" from a "credibility portfolio"

- A blog signals taste; a portfolio proves shipped systems.
- The bar at staff/principal is **scope + ownership + outcome made legible** — Will Larson calls it "a writing sample of how you think."
- Credibility = traceable claims. If a hiring manager can't trace a claim to evidence in one click, it reads as marketing.
- Differentiator: a strong **point of view** repeated across artifacts.

### The 30-second scan filters

- Above-the-fold answer to: *who, what level, what shipped, what scale*.
- One-line case study titles with metric + system noun, not adjectives.
- Recent dates. Dead blog (last post 2023) is a negative signal at staff level.
- Working links, working code, working diagrams. Broken anything = junior.
- Absence of buzzword soup (no "passionate AI enthusiast," no skill-bar charts, no tech-stack badge wall).

### Mistakes that make senior portfolios look junior

- Scroll-jacked hero animations / particle backgrounds / number counters.
- No specifics (team size, system name, scale, decision tradeoffs).
- Listing everything — six projects with no hierarchy is worse than two with depth.
- Claimed projects with no case study (logo-grid red flag).

### What case studies look like at staff/principal

- **Architecture-decision-driven, not STAR.** Read like an internal design doc: problem framing → constraints → options considered → decision + tradeoff → outcome → what we'd do differently.
- Show the alternatives you rejected. "We chose retrieval over fine-tuning because [latency budget + label scarcity]" is staff-level. "We used RAG" is junior.
- Quantified outcome AND honest scope. Numbers without methodology read as inflated.
- Diagrams that show data flow, not logos.

### Trust signals

- **Honesty about what didn't work.** "We tried X, it failed because Y, we shipped Z" is the strongest credibility signal.
- Specificity that only an insider could fabricate — exact failure modes, exact numbers, named tradeoffs.
- Provenance: linked PRs, talks, papers, conference recordings, named collaborators (with permission).
- Calibrated language. "Contributed to" beats "led" if accurate.

### Table stakes vs differentiating vs noise

- **Table stakes:** name, role, 3-6 case studies, contact, working on mobile, no broken links.
- **Differentiating:** strong written POV; one or two deep technical writeups; an OSS artifact or talk.
- **Noise:** "what I'm reading," tech-stack badges, hero animations, Spotify-now-playing widget, skill-percentage bars, theme pickers, generic "About" page with hobbies.

### The "too polished" risk

- Notion-export-with-animations aesthetic signals **content thinness being compensated by visual budget**.
- Dan Luu, Julia Evans, Simon Willison, Eugene Yan — highest-signal portfolios in the field — are deliberately plain. Plainness is a flex when the writing carries weight.

### Confidentiality at senior level

- Working norm: **describe the pattern, not the proprietary detail.**
- Get explicit approval for internal system names before publishing.
- Avoid: (a) overclaiming via vague superlatives, (b) being so generic the case study is meaningless. Middle path: **specific on architecture and outcome, generic on business detail**.
- Cite scale via order-of-magnitude if exact numbers are sensitive.

---

## Bottom line

The work is there. The writing is there. There's a real POV. The portfolio shipping right now would have ~3 specific things a sharp hiring manager could legitimately use against the candidate — and that's avoidable with a focused day of editing.

Fix the fabricated anecdote, the 404s, and the placeholder metrics — that alone moves it from "not ready" to "shareable." The "trying too hard" question and the OSS-artifact gap are the medium-term polish that distinguishes "shareable" from "competitive at staff level."
