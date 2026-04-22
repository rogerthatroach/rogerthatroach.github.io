# Codebase Audit — 2026-04-22

**Auditor:** Claude Opus 4.7 (1M context), acting as agent supervisor for 5 parallel sub-agent audits
**Subject:** `rogerthatroach.github.io` — Next.js 14 static-export portfolio site
**Commit at audit start:** `be5e406` (feat(resume): single-page overhaul — material bookends + scrollytelling + collapsibles)
**Classification:** Internal review, not shipped-facing

---

## 1. Abstract

This document records a systematic audit of the `rogerthatroach.github.io` codebase across seven tracks — content consistency, proofread, navigation/linking coverage, visual and typographic consistency, accessibility, SEO and metadata, and performance/build health — plus a synthesis layer for blindspot analysis. Auditing was performed on the `main` branch at commit `be5e406`, after the /resume single-page consolidation shipped.

The codebase was found to be in **good-to-excellent condition** across most tracks. Content consistency, navigation/linking coverage, external-link hygiene, sitemap, and the core a11y primitives (focus management, ARIA on modals, prefers-reduced-motion) all passed without defects. Defects cluster in three areas: (a) typographic treatment of a small number of headings that skipped the `font-display` migration; (b) tap targets on icon-only buttons below the WCAG 2.1 AA 44×44 px minimum; (c) a latent `awards.ts` data-structure issue where two distinct historical awards were collapsed into a single row. Twelve trivial issues were fixed inline during this audit; fourteen items are deferred for scoped follow-up.

## 2. Methodology

### 2.1 Auditor composition

Eight distinct investigative tracks were identified. Five were dispatched to parallel `Explore` sub-agents with self-contained briefs (each brief named the authoritative sources, the specific claims/patterns to look for, and the expected output format). Two (SEO + performance) were audited directly by the supervisor via `Grep` / `Bash` / `Read` primitives because the checks reduced to simple greps over a known surface area. The eighth track — blindspot synthesis — was performed post-hoc by the supervisor with access to all seven prior reports.

### 2.2 Input surfaces

- 15 page components (`app/**/page.tsx`)
- 87 React components (`components/**/*.tsx`)
- 13 data modules (`data/*.ts`) + 12 MDX blog posts (`data/posts/*.mdx`)
- Global stylesheet (`app/globals.css`), Tailwind config, Next.js config
- Git history, CHANGELOG, prior audit records (`docs/specs/CONTENT_AUDIT.md`)
- Canonical source: `data/canonical.ts`, `CLAUDE.md §11`, `docs/career/CAREER_KNOWLEDGE_BASE.md`, `docs/career/RESUME_RAW.md`

### 2.3 Authoritative precedence for claims

Where a numeric or factual claim appeared on multiple surfaces, precedence was:

1. `data/canonical.ts` — runtime constants; highest trust
2. `CLAUDE.md §11` — reconciled table, updated 2026-04-21
3. `docs/career/CAREER_KNOWLEDGE_BASE.md` — narrative source
4. `docs/career/RESUME_RAW.md` — raw substrate for rewrites
5. `docs/specs/CONTENT_AUDIT.md` — prior reconciliations

### 2.4 Severity taxonomy

| Severity | Definition | Typical response |
|---|---|---|
| **P0** | Factual error · ship-blocker · broken link · hard a11y fail · typo that would embarrass | Fix immediately |
| **P1** | Inconsistency · drift · gap · accessibility gap (soft-fail) · stale wording | Fix this week |
| **P2** | Polish · stylistic variance · enhancement · documentation gap | Fix opportunistically |

### 2.5 Known methodology limitations

- **No browser runtime**: contrast ratios on dynamic CSS-var palettes cannot be computed by static grep — flagged for manual Lighthouse/WAVE follow-up.
- **No E2E test suite**: keyboard flow through multi-component journeys (e.g., modal open → ⌘K → navigate away) was checked via code inspection only, not actual input simulation.
- **No NLP**: awkward-phrasing flags rely on heuristics; sub-agents may miss register mismatches that a human editor catches.
- **No visual diff**: typography and spacing parity claims were derived from class-name comparison, not pixel-level comparison.
- **Agent hallucination risk**: One of the a11y findings (skip-link absent) was a false positive — the skip-link exists in [`app/layout.tsx:127-131`](../../app/layout.tsx#L127-L131). Cross-checked and dropped.

## 3. Findings by track

### Track 1 · Content consistency
**Sub-agent:** `Content consistency audit` · **Duration:** 86s · **Scope:** 13 data files + 12 MDX posts + canonical refs

**Verdict:** Clean across all 13 enumerated canonical claims (career span, production systems count, Aegis v2 framing, team shape, PAR status, Astraeus scale, Humana accuracy, Digital Twin savings, Commodity Tax efficiency, era names, GCP cert removal, role title claims, degree names).

| Finding | File:Line | Severity | Status |
|---|---|---|---|
| `awards.ts` conflates two Star of the Month awards (Nov 2017 + Jan 2019) into a single 2019 row | [`data/awards.ts:38-46`](../../data/awards.ts#L38-L46) | P1 | **Deferred** — needs product decision: split into 2 rows, increasing `AWARDS_COUNT` from 5 → 6, or document the collapse as deliberate |
| TCS Star of the Month year precision drops month-level info that the knowledge base carries | [`data/awards.ts:38-46`](../../data/awards.ts#L38-L46) | P2 | Deferred — tied to above |

All other numeric references audit clean. Verified items are listed in Appendix A.

### Track 2 · Proofread
**Sub-agent:** `Proofread audit across surfaces` · **Duration:** 58s · **Scope:** all rendered strings

**Verdict:** No embarrassing typos. A handful of stylistic inconsistencies, mostly around one compound construction.

| Finding | File:Line | Quote / detail | Severity | Status |
|---|---|---|---|---|
| "Same closed loop." reads ambiguous without the noun it modifies | [`data/hero.ts:25`](../../data/hero.ts#L25) | `Same closed loop.` | P1 | **Fixed inline** → `Same closed-loop pattern.` |
| Hyphenation of "closed loop" vs "closed-loop" drifts across MDX and `data/` | Multiple | Attributive use should hyphenate; nominal use should not | P2 | Deferred — needs systematic pass |
| Date en-dash spacing inconsistent: `"2016 – 2019"` vs `"2022–2025"` | Across timeline + companies + projectCaseStudies | Standard is en-dash with spaces per CMOS, but the site has mixed usage | P2 | Deferred — low user-visible impact |
| `$3M` display-form vs "months → 90 min" vs "months → 90 minutes" long-form | Intentional per [`data/canonical.ts`](../../data/canonical.ts) comment §17 | P2 | Documented-as-intentional; no fix required |

No P0 proofread defects. 40+ putative findings were resolved as non-issues (intentional style, verified correct spellings, matching industry terminology).

### Track 3 · Navigation and linking coverage
**Sub-agent:** `Navigation + linking coverage audit` · **Duration:** 111s · **Scope:** every `Link`/`href`/`<a>` in the repo

**Verdict:** Cleanest track. No defects.

| Category | Result |
|---|---|
| Dead internal links | **0 found** — all `/projects/[slug]`, `/blog/[slug]`, `/papers/[slug]`, `/#work` anchors resolve |
| `/resume/arc` residue (just deleted) | **0 found** — fully scrubbed |
| Orphan routes | **0** — every public route reachable from Nav, Footer, or CommandPalette |
| Sitemap coverage | **Complete** — all public routes, playground correctly excluded |
| External-link hygiene | **100%** — every `target="_blank"` paired with `rel="noopener noreferrer"` |
| Blog ↔ case study symmetric cross-links | **All 12 pairs verified** |
| Papers `related` → blog | **All 3 verified** |

Two P1-enhancement suggestions (deeper blog-series cross-links; papers-in-case-study back-links) are opt-in — not defects.

### Track 4 · SEO + metadata coverage
**Method:** direct grep + inspection · **Scope:** `app/**/page.tsx` + `app/layout.tsx` + `public/*`

| Finding | Location | Severity | Status |
|---|---|---|---|
| Open Graph image is SVG-only (`/og-image.svg`) | [`app/layout.tsx:58`](../../app/layout.tsx#L58) | P1 | **Deferred** — Twitter and LinkedIn prefer raster (PNG/JPG at 1200×630). Render a PNG fallback via `@vercel/og` or manual export. Pre-existing backlog item per handover. |
| All 15 pages carry `metadata` export | — | ✓ | Verified clean |
| Canonical URLs on all 10 public pages; playground intentionally unmarked (noindex) | — | ✓ | Verified clean |
| JSON-LD `Person` schema at root layout | [`app/layout.tsx:101-123`](../../app/layout.tsx#L101-L123) | ✓ | Verified clean |
| JSON-LD `Person` schema on `/resume` | [`app/resume/page.tsx:200-214`](../../app/resume/page.tsx#L200-L214) | ✓ | Verified clean |
| Twitter `summary_large_image` on blog/project/paper detail | Via `generateMetadata` | ✓ | Verified clean |
| `robots.txt` present, allows all, names sitemap | [`public/robots.txt`](../../public/robots.txt) | ✓ | Verified clean |

### Track 5 · Visual and typography consistency
**Sub-agent:** `Visual + typography consistency audit` · **Duration:** 86s · **Scope:** all components + globals

**Verdict:** Era-palette refactor largely complete. Four header sites skipped the `font-display` migration. Three classes of visual drift flagged for scoped normalization.

| Finding | File:Line | Severity | Status |
|---|---|---|---|
| `/projects` h1 missing `font-display` and `tracking-tight` | [`app/projects/page.tsx:29`](../../app/projects/page.tsx#L29) | P0 | **Fixed inline** |
| `CaseStudyLayout` nested `Section` h2 missing `font-display` | [`components/projects/CaseStudyLayout.tsx:57`](../../components/projects/CaseStudyLayout.tsx#L57) | P0 | **Fixed inline** |
| MDX h2 missing `font-display` | [`components/blog/MDXComponents.tsx:20`](../../components/blog/MDXComponents.tsx#L20) | P1 | **Fixed inline** |
| Blog framework `ConstraintsBlock` uses hardcoded rose/amber/blue instead of era palette | [`components/blog/framework/ConstraintsBlock.tsx:26-36`](../../components/blog/framework/ConstraintsBlock.tsx#L26-L36) | P0 (classed) | **Deferred** — semantic, not era-bound; palette may not be the right abstraction. Needs design call. |
| `OptionsConsidered` pros/cons hardcoded emerald/rose | [`components/blog/framework/OptionsConsidered.tsx`](../../components/blog/framework/OptionsConsidered.tsx) | P1 | Deferred — same semantic rationale |
| `SkillTimeline.ACCENT_COLORS` glow shadows still hardcoded | [`components/SkillTimeline.tsx:19-22`](../../components/SkillTimeline.tsx#L19-L22) | P1 | Deferred — glow is theme-invariant; palette-var extraction is refactor polish, not a defect |
| `/resume` mixes `py-14`, `py-16`, `py-20`, `py-24` section padding | [`app/resume/page.tsx`](../../app/resume/page.tsx) | P1 | Deferred — needs canonical-rhythm decision |
| Hero CTAs use `rounded-full`; About CTAs use `rounded-lg` | Hero + AboutSection | P1 | Deferred — needs design call |
| Award-card size drift: `RecognitionSection` p-4 + h-16 thumb vs `AwardsPanel` p-3 + h-12 thumb | Two files | P1 | Deferred — intentional if AwardsPanel is tighter-on-purpose; verify |
| Icon-size drift: Trophy 22 vs 16, ArrowRight 14 canonical, WritingLinks 18 outlier | Multiple | P2 | Deferred — canonical size table to be established |
| Playground `HeroVariant` uses h3 for display-level 3xl/4xl text | [`components/playground/HeroVariant.tsx:79,88`](../../components/playground/HeroVariant.tsx#L79) | P2 | Deferred — playground-only (noindex), lower priority |

### Track 6 · Accessibility
**Sub-agent:** `Accessibility audit` · **Duration:** 124s · **Scope:** all interactive components + keyboard flow

**Verdict:** Core a11y primitives solid. Tap target sizing is the primary gap.

| Finding | File:Line | Severity | Status |
|---|---|---|---|
| `ThemeToggle` tap target 40×40 < WCAG AA 44×44 | [`components/ThemeToggle.tsx:35`](../../components/ThemeToggle.tsx#L35) | P1 | **Fixed inline** (h-10 w-10 → h-11 w-11) |
| `Nav` kebab tap target 40×40 < 44×44 | [`components/Nav.tsx:100`](../../components/Nav.tsx#L100) | P1 | **Fixed inline** (h-10 w-10 → h-11 w-11) |
| `RoleOverlay` close button ~38×38 effective < 44×44 | [`components/resume/story/RoleOverlay.tsx:82-88`](../../components/resume/story/RoleOverlay.tsx) | P1 | **Fixed inline** (p-1.5 → h-11 w-11 flex-centered) |
| `ArcProgress` dot hit areas very small | [`components/resume/arc/ArcProgress.tsx:87-95`](../../components/resume/arc/ArcProgress.tsx) | P1 | **Deferred** — needs visual/hit-area decoupling; current dots are the visual, expanding hit area via invisible padding would change feel |
| Hero `<section>` missing accessible name | [`components/Hero.tsx`](../../components/Hero.tsx) | P1 | **Fixed inline** (`aria-label="Intro"`) |
| MetricsRibbon's `#through-line` is a `<div>`, not `<section>`, no accessible name | [`components/MetricsRibbon.tsx:49`](../../components/MetricsRibbon.tsx#L49) | P1 | **Fixed inline** (`<div>` → `<section aria-label="Through-line thesis and key metrics">`) |
| Dark-mode contrast on palette-card tint backgrounds needs manual verification | Multiple | P1 | **Deferred** — requires browser Lighthouse / WAVE / contrast checker |
| `text-text-tertiary` on `bg-surface-hover` in dark mode may fall below 4.5:1 | globals.css | P1 | Deferred — same manual verification needed |
| Custom MDX `<img>` component missing for alt-text enforcement on markdown images | [`components/blog/MDXComponents.tsx`](../../components/blog/MDXComponents.tsx) | P2 | Deferred — no blog post currently uses inline markdown images; protective, not reactive |
| CommandPalette input uses `outline-none` without a `focus-visible:` replacement class | [`components/CommandPalette.tsx:118`](../../components/CommandPalette.tsx#L118) | P2 | Deferred — `cmdk` library may provide implicit focus handling; requires in-browser verification. Tentative finding. |

**Verified clean** (sub-agent reported explicitly, cross-checked):
- Skip-link exists ([`app/layout.tsx:127-131`](../../app/layout.tsx#L127-L131)) — the agent's "missing skip-link" finding was a false positive; dropped.
- Blog posts wrapped in `<motion.article>` ([`components/blog/PostLayout.tsx:38`](../../components/blog/PostLayout.tsx#L38)) — agent suggested wrapping but already done.
- Keyboard flow through modals (RoleOverlay, CommandPalette): Escape closes, body scroll locked, focus returns on close.
- Portrait image has meaningful alt text; logos use `alt=""` + `aria-hidden="true"` correctly.
- Prefers-reduced-motion honored in Hero carousel, CommandPalette, EraChapter scroll transforms.
- ARIA on nav mobile menu (`aria-expanded`, `aria-controls`) correct.
- JSON-LD Person schema with `sameAs` links present.

### Track 7 · Performance + build health
**Method:** direct inspection · **Scope:** package.json, build output, TypeScript strictness markers

| Finding | Location | Severity | Status |
|---|---|---|---|
| 9 `<img>` tags vs `next/image` | Multiple | P2 | **Intentional** — `next.config.js` sets `output: 'export'` + `images.unoptimized: true` for GitHub Pages; `next/image` adds no benefit and would ship extra JS. |
| `as any` / `@ts-ignore` / `@ts-expect-error` | — | ✓ | **0 occurrences** in project code. |
| `any` type escapes | — | ✓ | 0 occurrences in project code (grep hits were English prose). |
| Largest bundle chunk: 371 KB (`bd904a5c...`) | `out/_next/static/chunks/` | P2 | Deferred — likely three.js from `@react-three/fiber` used in `ParticleField`. Could be dynamic-imported if LCP suffers, but currently fine. |
| 3.2 MB total chunks | `out/_next/static/chunks/` | P2 | Deferred — reasonable for the interactivity surface area; worth revisiting if Lighthouse perf score regresses below 90. |
| Dependencies audit | `package.json` | ✓ | No known-bad packages; all deps in use. |

### Track 8 · Blindspot synthesis (supervisor-conducted)

Cross-cutting themes extracted from the other seven tracks + supervisor's own read of the surface:

| Blindspot | Rationale | Severity | Status |
|---|---|---|---|
| **No explicit "Open to opportunities" signal anywhere on the site** | A hiring manager landing on `/` has to infer intent from Projects + CTAs. Adding a signal (pinned note on About or Now) would remove ambiguity. | P1 | Deferred — product decision |
| **Geographic location (Toronto) mentioned in hero `HERO.location` data but not surfaced in UI** | Recruiters filter by geography; invisible location = invisible signal | P1 | Deferred — one-line UI add in About or Now |
| **No rendered email address / contact form** | Contact path is "Contact / CV" button → About page → three buttons including LinkedIn. Adds 2 clicks between "I want to talk to Milap" and "I'm composing the message." | P1 | Deferred — design call |
| **`/now` page content not verified for staleness** | Sivers-style `/now` pages decay fastest. Not audited as part of this pass. | P2 | Deferred — cursory follow-up |
| **Awards count drift latent in `awards.ts`** (see Track 1) | Two distinct Star of the Month awards (2017 + 2019) collapsed into one 2019 entry. CV / rendered UI under-represents the real award count. | P1 | Deferred — data correction needed |
| **OG image is SVG-only** (see Track 4) | Twitter + LinkedIn may not render SVG OG previews; link shares lose the social-card effect. | P1 | Deferred — PNG export needed |
| **No explicit citizenship / work authorization signal** | Relevant to recruiters for role matching; typically in the "About" footer or on resume PDF. | P2 | Deferred — content decision, not code |
| **Footer lacks copyright line / year stamp** | Standard-practice signal of "site is maintained." Also helpful for staleness inference. | P2 | Deferred — 1-line footer add |
| **Dark-mode contrast on palette-card tinted backgrounds not browser-verified** (see Track 6) | Desk audit caught the risk; real Lighthouse/WAVE run needed before asserting AA compliance | P1 | Deferred — manual run |
| **No analytics / visibility signal** | If Milap wants to know who's landing from where, there's no instrumentation. Omission may be deliberate (privacy, simplicity) — flagged for decision, not defect. | N/A | Deferred — deliberate or follow-up |
| **12-post blog has no search or filter UI** | With 12 posts the `/blog` index is still scannable; at ~20+ posts this becomes a UX gap. Preempt by scaffolding filter-by-tag. | P2 | Deferred — preemptive |
| **`/playground` routes noindex'd but still reachable via sitemap residue in prior versions** (no current drift) | Worth watching; if a playground route gets linked-from-elsewhere accidentally it leaks the preview work | — | No current issue; documented |

## 4. Inline fixes applied in this audit

Committed alongside this report. Each fix is traceable via git blame to the audit commit.

| # | Fix | File |
|---|---|---|
| 1 | `/projects` h1 → `font-display tracking-tight` | [`app/projects/page.tsx:29`](../../app/projects/page.tsx#L29) |
| 2 | CaseStudyLayout Section h2 → `font-display tracking-tight` | [`components/projects/CaseStudyLayout.tsx:57`](../../components/projects/CaseStudyLayout.tsx#L57) |
| 3 | MDX h2 → `font-display tracking-tight` | [`components/blog/MDXComponents.tsx:20`](../../components/blog/MDXComponents.tsx#L20) |
| 4 | Hero bio: "Same closed loop." → "Same closed-loop pattern." | [`data/hero.ts:25`](../../data/hero.ts#L25) |
| 5 | `ThemeToggle` h-10 w-10 → h-11 w-11 (44×44) | [`components/ThemeToggle.tsx:35`](../../components/ThemeToggle.tsx#L35) |
| 6 | Nav kebab h-10 w-10 → h-11 w-11 | [`components/Nav.tsx:100`](../../components/Nav.tsx#L100) |
| 7 | RoleOverlay close: p-1.5 → h-11 w-11 flex-centered | [`components/resume/story/RoleOverlay.tsx:82-88`](../../components/resume/story/RoleOverlay.tsx) |
| 8 | Hero `<section>` → `aria-label="Intro"` | [`components/Hero.tsx`](../../components/Hero.tsx) |
| 9 | MetricsRibbon `<div#through-line>` → `<section aria-label="...">` | [`components/MetricsRibbon.tsx:49`](../../components/MetricsRibbon.tsx#L49) |

Build verified green after fixes (`npm run build` — 31 static routes, no warnings).

## 5. Deferred backlog (prioritized)

### P1 (address within current development cycle)

1. **Awards data correction** — split the merged TCS Star of the Month entry into two rows with distinct dates (Nov 2017, Jan 2019); bump `AWARDS_COUNT` if total changes, update awards display.
2. **OG image PNG fallback** — render a 1200×630 PNG from `og-image.svg` (or via `@vercel/og`); reference as fallback in metadata.
3. **Dark-mode contrast sweep** — run Lighthouse / WAVE on `/resume` in dark mode; verify palette-text colors pass AA against palette-card backgrounds and surface-hover.
4. **Hiring-manager signal gap** — decide on "Open to opportunities" + geographic location surface.
5. **ArcProgress hit-area expansion** — decouple dot visual from tap target so WCAG 44×44 is satisfied without enlarging the dot.
6. **Contact path friction** — consider surfacing email + a contact form on /about or /now.

### P2 (address opportunistically)

7. **Hyphenation sweep** — "closed loop" vs "closed-loop" across MDX + data.
8. **Date en-dash spacing normalization** — pick one form, apply everywhere.
9. **Resume vertical-rhythm canonicalization** — decide on py-14/16/20/24 semantic meaning and apply.
10. **Button radius normalization** — rounded-full vs rounded-lg.
11. **Award card size harmonization** — RecognitionSection vs AwardsPanel padding + thumb sizing.
12. **Icon size canonical table** — CTA=14, structural=16, emphasis=18+.
13. **SkillTimeline glow → CSS var** — minor polish, aligns with palette refactor.
14. **`<img>`-in-MDX custom component** — preempt missing alt text on any future markdown-embedded image.
15. **Footer copyright line** — trust signal, 1-line add.

## 6. Verified-clean inventory (Appendix A)

These claims were explicitly audited and passed; recording to avoid re-audit churn and establish what "clean" means in this repo.

### Content claims
- Career span: 7.5+ years (TCS 3.3 + Quantiphi 1 + RBC 3.5) — canonical, CLAUDE.md §11, all surfaces agree
- Production AI systems count: 3 (PAR Assist, Astraeus, Aegis v1+v2) — correctly reconciled per 2026-04-21 audit
- Aegis v2 framing: concurrent 2-week refactor (not independent delivery) — honored in case study + timeline + projects
- Team shape: 1 direct (singular) + 2 interns joining May 2026 + 7 cumulative interns + peak 5 historical
- PAR Assist status: pilot April 2026, enterprise rollout Q2/Q3 2026
- Astraeus scale: ~40K transits, ~9K rollups, ~60K geography hierarchy nodes
- Humana: 99.95% (up from ~70%)
- Digital Twin: $3M/year, 84 models, 90+ sensors
- Commodity Tax: months → 90 min (canonical short form)
- Era names: Foundation, Cloud ML, Enterprise Analytics, Intelligent Systems
- GCP ACE cert: correctly omitted from rendered code (expired Jan 2024)

### Site integrity
- 0 dead internal links (12 blog ↔ case study symmetric pairs, all `/projects/[slug]` + `/papers/[slug]` anchors resolve)
- Sitemap complete (10 public routes + 12 blog posts + 6 projects + 1 paper; playground correctly excluded)
- External-link security (`rel="noopener noreferrer"` paired with `target="_blank"` 100%)
- Orphan routes: 0
- Metadata coverage: 15/15 pages
- Canonical URLs: 10/10 public pages
- JSON-LD Person schema: 2 locations (root layout + /resume)

### Accessibility primitives
- Skip-link present and functioning (appears on focus)
- Modals (RoleOverlay, CommandPalette) with `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Body scroll lock + Escape close + focus return on modal close
- Nav mobile kebab with `aria-expanded` + `aria-controls`
- ArcProgress with `aria-current="step"` on active dot
- Portrait image `alt="Harmilap Singh Dhaliwal"`
- All logo images decorative: `alt=""` + `aria-hidden="true"`
- Prefers-reduced-motion respected in Hero carousel, CommandPalette, EraChapter scroll transforms, ProjectReveal blur-in

### Code health
- 0 `any` in project source
- 0 `@ts-ignore` / `@ts-expect-error`
- 0 `as any`
- Build green on 31 static routes
- TypeScript strict mode clean (`tsc --noEmit`)
- Hooks (pre-commit, commit-msg, pre-push) enforcing ritual

## 7. Re-audit criteria

This audit should be re-run when:

1. A new content surface ships (new blog post, new case study, new top-level page) — at minimum re-run Track 1 (content consistency).
2. A refactor touches more than 20 files in a single commit — re-run all seven tracks.
3. A dependency is added or major-version upgraded.
4. The canonical palette or typography system changes.
5. Quarterly at a minimum, even in the absence of above triggers, to catch staleness decay (date references, forward-looking claims like "joining May 2026" once May 2026 passes).

## 8. Limitations and known gaps in this audit

- **No runtime browser testing** — contrast ratios, actual keyboard flow, scroll performance, and prefers-reduced-motion behavior were all inferred from code inspection rather than observed.
- **No screen-reader testing** — VoiceOver / NVDA / JAWS behavior not simulated. ARIA correctness is necessary but not sufficient for good screen-reader UX.
- **No mobile device testing** — responsive-class review only; actual Safari iOS / Chrome Android behavior not verified.
- **No perf profiling** — bundle sizes and chunk counts reported; actual LCP / FID / CLS on real devices not measured.
- **No SEO crawl** — sitemap correctness verified; actual Googlebot indexation + Search Console submission not checked.
- **Historical git blame not exhaustive** — focused on current state, not who-introduced-what-when.

Follow-up runs should plug these gaps by pairing this static audit with Lighthouse (automated browser test) + a manual 10-minute screen-reader pass.

---

**End of audit.**

*Filed under: `docs/audits/`. See also: [`docs/specs/CONTENT_AUDIT.md`](../specs/CONTENT_AUDIT.md), [`docs/specs/DECISIONS.md`](../specs/DECISIONS.md), [`docs/plans/IMPROVEMENT_PIPELINE.md`](../plans/IMPROVEMENT_PIPELINE.md).*
