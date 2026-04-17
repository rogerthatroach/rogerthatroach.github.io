# Post-Audit Roadmap — Tiers 4f through 6

> **Author:** Milap Dhaliwal (via Claude, 2026-04-17)
> **Status:** Post-Tier-4e planning
> **Depends on:** Tier 4e complete (`ce25075` on main — canonical.ts, dynamic sitemap, surface fixes)

---

## 0. CONTEXT

A full audit on 2026-04-11 found the portfolio is **strong baseline, weak conversion surface**: top-15% craft for an AI/ML Director candidate, but the site proves *you can build* more than it proves *you should be hired*. The 4e tier closed the structural defects (drift, dead code, sitemap staleness). This roadmap addresses what remains.

Not all of this should ship together. Items cluster into **six tiers** with different cadences, risk profiles, and blockers. Three are standalone and can execute today. Two are blocked on you. One is loose backlog.

### Sequencing thesis

Closing craft loops (4f) before humanizing (4g) gives humanization a verified base. Shipping TL;DRs (5a) in parallel with 4g is zero-risk and compounds its ROI. Tier 5b (second practitioner post) and 5c (resume) are their own timelines — not gated by this roadmap.

---

## 1. TIER 4f — Verification & Polish

**Theme:** close the "did you actually verify?" gap. The audit surfaced things CLAUDE.md claimed but nobody had checked.

**Why first:** every downstream tier assumes a correct base. Lighthouse <90 would undermine 4g's conversion gains; mobile breakage would undermine 5a's TL;DRs. Verify before adding.

### Scope

| # | Item | Type | Auto? |
|---|---|---|---|
| 1 | Lighthouse audit on 4 page types (home, /projects, /projects/[slug], /blog/[slug]), scores documented | Verification | Semi — can run via CLI |
| 2 | Mobile QA at 375 / 768 / 1440 via Chrome device toolbar | Verification | No — needs your eyes |
| 3 | Dark/light parity — systematic component walkthrough | Verification | No — needs your eyes |
| 4 | Nav Work/Projects disambiguation | Code change | Yes |
| 5 | Staleness signal for NOW_BUILDING items | Code change | Yes (pending decision below) |

### Decision needed for #5

In Tier 4e we removed `staleAfter` as unenforced/Zero-Waste. The roadmap argued for reinstating a *different* staleness signal. Pick:

- **(a)** Add `updatedAt: ISODate` per item + build-time warning if >60 days old
- **(b)** No staleness mechanism — manual review is the process
- **(c)** Small alternative: add a `debug.log` build step that prints current NOW_BUILDING contents so drift is visible during builds

Recommended: **(a)** — costs one field, buys mechanical drift protection. Different from `staleAfter` because (1) it's *updated*, not "expires", and (2) it triggers a *warning*, not a conditional render.

### Files

- New: `docs/specs/LIGHTHOUSE_BASELINE.md` (gitignored doc recording scores)
- Modify: `data/nav.ts` (disambig — rename "Work" → "Selected Work", or drop it)
- Modify: `data/nowBuilding.ts` (add `updatedAt` if decision (a))
- New: `scripts/check-staleness.mjs` or a `next.config.js` build hook (decision (a))

### Verification

- Lighthouse: scores ≥ 90 on all four categories for all page types, OR documented known gaps
- Mobile: screenshots at 3 breakpoints for 3 page types (home, one case study, one blog post) attached to `docs/specs/LIGHTHOUSE_BASELINE.md`
- Dark/light: both modes visually inspected on every route
- Nav: single unambiguous path to the project grid
- Staleness: build output shows current-state log or warning

### Effort estimate

- Autonomous code (nav + staleness + Lighthouse CLI): ~1h
- Your visual QA (mobile + dark/light): ~1h
- Total: **~2h**

---

## 2. TIER 4g — Humanization & Conversion

**Theme:** move the portfolio from *artifact* to *conversion surface*. Single highest-ROI tier for what the site is *for*.

**Why after 4f:** humanization adds surfaces (photo, CTA, OG images). Verifying base first means these additions land on a known-good foundation.

### Five decisions you need to make

| # | Decision | Options |
|---|---|---|
| 1 | Photo for About section | (a) take portrait this week (b) use existing photo (c) skip — use illustrated monogram |
| 2 | Positioning statement | Keep current tagline ("I architect AI platforms...") vs. sharpen to a vertical ("I help banks ship agentic AI without compliance disasters") |
| 3 | CTA type | Calendly scheduling link / mailto with subject template / DM reachability via LinkedIn-Twitter |
| 4 | "Open to..." signal | Yes (small banner) / No / Only show when true |
| 5 | Per-post OG image style | Abstract gradient + title / Photo + title / Minimal typographic |

Photo and positioning statement are the high-leverage ones. Others can default if you don't care.

### Scope (once decisions made)

1. **Photo in About** — sticky right column per earlier conversation; 280-320px rounded, desaturated to match tokens, mobile-responsive
2. **Hero tagline / About opener** — whatever positioning you pick
3. **CTA block** — in About closer + optionally in nav; Calendly if going that route
4. **Per-post OG images** — `app/blog/[slug]/opengraph-image.tsx` using the same `ImageResponse` pattern as the favicon. Title + accent background. Rendered at build time, 1200×630.
5. **Optional: "Open to..." banner** — small, dismissible via localStorage, above nav

### Files

- `data/about.ts`, `data/hero.ts`, `data/nav.ts` (copy + CTA data)
- `components/AboutSection.tsx` (photo + CTA render)
- New `public/images/portrait.{jpg,webp}` or similar (user asset)
- New `app/blog/[slug]/opengraph-image.tsx` (per-post OG)
- `app/blog/[slug]/page.tsx` generateMetadata (point to new OG)

### Effort estimate

- Once decisions made: ~3h
- Photo prep + decisions: **your time, not mine**

---

## 3. TIER 5a — Case Study TL;DRs

**Theme:** skimmer-friendly 2nd layer. Case studies are strong for 5-min readers; TL;DRs serve 30-second scanners.

**Why independent:** no blocker, no design decisions beyond content. Can ship in parallel with 4g.

### Scope

- Extend `CaseStudy` interface with `tldr: { problem: string; decision: string; impact: string }`
- Populate for all 6 case studies (authored by you)
- Render above "Context" section on each case study page, boxed
- Design: 3 bullets, ~15 words each, using canonical metrics where available

### Files

- `data/projectCaseStudies.ts` (interface + 6 populated TL;DRs)
- `components/projects/CaseStudyLayout.tsx` (render block)

### Effort estimate

- Your writing: ~2h for 18 bullets
- My integration + styling: ~1h

### Gate

You author the 18 bullets before I integrate. No agent-drafted copy in production per our memory convention.

---

## 4. TIER 5b — Second Practitioner Post

**Theme:** "How Commodity Tax Built CFO Trust" per `PORTFOLIO_V2_HANDOVER_FINAL.md` §13.

Target: 2026-05-15. Hard fallback: 2026-06-15.

No new plan work. Pipeline already exists — embargo system handles publishing, dynamic sitemap picks it up, three-layer funnel cross-links to the Commodity Tax case study automatically.

### Gate

You write the post. ~800-1000 words, practitioner register, one architecture diagram. Per the handover:
- Story of the CFO stakeholder trust cascade
- Commodity Tax (months → 90 min) → stakeholder confidence → Aegis v1 → Astraeus → PAR Assist
- Not a technical deep dive — a leadership story about earning permission to ship AI

---

## 5. TIER 5c — Interactive Resume

**Status:** blocked on 5 decisions from earlier hermeneutic review of `INTERACTIVE_RESUME_HANDOVER_FINAL.md`:

1. Skill grid — keep or cut (copy-first principle cuts it; utility-page framing keeps it)
2. `/resume` route vs. SkillTimeline expansion on homepage
3. Nav placement (utility page → nav)
4. Tier 5a budget realism (the handover's ~30 min is ~4x under actual)
5. Copy authorship — Milap authors, not Claude

Not gated by this roadmap. Happens when the 5 decisions happen.

---

## 6. TIER 6 — Discovery & Amplification

**Not a coherent tier.** A menu of 5 items with loose timeline. Pick 1-2 per month over 8-12 weeks.

| Item | Effort | Value | Notes |
|---|---|---|---|
| Privacy-friendly analytics (Plausible, ~$9/mo) | 1h integration | Validates 4g hypotheses | Needed to know if CTA/photo/positioning convert |
| `/updates` route — derived from git log | ~3h | Signals liveness | Rebuilds on cron, shows "April: shipped X" |
| "How I hire" long-form essay | ~1 week writing | High Director-level signal | One quarterly post |
| SEO tune of existing blog posts | ~3h | Discovery | Add schema.org Article, "Who this is for" callouts, heading tuning |
| GitHub profile investment OR removal | 1 day | Authenticity | Either 2-3 sample projects OR drop the hero link |

### Effort guidance

No tier sequencing within 6. Pick by what interests you in a given week.

---

## EXECUTION SEQUENCE (recommended)

| When | Tier | Requires |
|---|---|---|
| This week | 4f | Your ~1h for mobile / dark-light QA |
| Week 2-3 | 4g | Your 5 decisions + photo |
| In parallel with 4g | 5a | Your 2h writing |
| 2026-05-15 target | 5b | Your writing time |
| Whenever unblocked | 5c | Your 5 decisions |
| Next 8-12 weeks | 6 | Pick from menu |

## ONE-LINE PRIORITY

**If you only ship one more tier before Tier 5, make it 4g, not 4f.** Verification is technically higher-leverage for craft; humanization is higher-leverage for conversion. Craft here is already strong enough to score green on Lighthouse without intervention. The humanization gap is costing actual inbound.

---

## WHAT THIS ROADMAP EXCLUDES

- Redesigns of the existing homepage structure (Tier 4c is ~2 weeks old; it's working)
- Rewriting existing blog posts (time-stamped artifacts rule)
- Additions that don't serve the Director-level audience (no side-project showcases beyond GitHub)
- New frameworks, CMS migration, or visual overhauls — no need

---

*Post-4e baseline: 18 static pages, 151 kB homepage First Load, dynamic sitemap derived from POSTS + PROJECTS, canonical.ts as metric SSoT. This roadmap builds on that foundation.*
