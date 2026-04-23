# Written material audit — 2026-04-22

## Summary

**Files reviewed:** 12 MDX blog posts + 6 project case studies + hero/about/metrics/timeline/awards data files + resume/CLAUDE.md canonical sources

**Issues identified:**
- **P1 (Factual/Fabrication Risk):** 3 critical issues
- **P2 (Consistency Drift):** 4 minor drift issues  
- **P3 (Tone/Register):** 2 register issues
- **P4 (Cleanup):** 0 issues

---

## P1 Issues (Factual / Fabrication Risk)

### Issue 1.1: PAR Assist Architecture — Three RAG Layers vs. Two-Stage Field-Group Retrieval

**File:** `/data/posts/enterprise-agentic-ai.mdx` (formal mathematical post)

**Lines:** 98–104, 132

**Claim as written:**

> **Requirement 3 (Heterogeneous Retrieval).** Retrieval must respect document structure, source provenance, and per-step relevance criteria:
> 
> `R(q, s_t) = ⊕_{l=1}^{3} R_l(q, s_t, 𝒟_l)`
> 
> - `R_1`: Conversation history (session-scoped)
> - `R_2`: Uploaded documents (user-scoped, format-aware chunking)
> - `R_3`: Institutional knowledge (global scope, prompt template selection)

Also §5 caption: "multi-layer RAG, PostgreSQL backbone"

**Why it's flagged:**

The companion posts (`enterprise-agentic-ai-framework.mdx` at lines 160–209 and `par-assist-building.mdx` at lines 34–40) describe a fundamentally different retrieval architecture: **two-stage field-group retrieval**:

- **Stage 1:** Which *field groups* are relevant (similarity search on uploaded material + template context)?
- **Stage 2:** Top-10 chunks *per relevant group* with custom compression (not three independent layers).

The formal post's "three-layer RAG" treats retrieval as **R_1 + R_2 + R_3** (conversation history + uploaded docs + institutional knowledge — three independent indexing layers that combine), while the framework post describes **field-group taxonomy → group-scoped retrieval → compression** (two stages with one unified retrieval function organized by target fields, not by source origin).

These are architecturally incompatible descriptions of the same system. The builder post is explicit: "Flat RAG would surface chunks from unrelated fields and templates ... [we use] Two-stage retrieval: groups → chunks → compression" (lines 171–181).

**Suggested fix:** 

`enterprise-agentic-ai.mdx` must be rewritten. Either:
- Replace the three-layer mathematical model with the two-stage field-group model (favored — matches the actual implementation), OR
- If the formal post is meant to be a generalized *candidate* architecture (not the implemented one), add a footnote stating "This formulation describes a candidate architecture; the production system at PAR Assist uses two-stage field-group retrieval instead (see `enterprise-agentic-ai-framework.mdx`)."

**Canonical source check:**
- `data/projectCaseStudies.ts` (PAR Assist TLDR, implementation section) describes "two-stage field-group retrieval" (line 348).
- RESUME_RAW.md §3.1 confirms "two-stage field-group retrieval with custom compression" (lines 253–257).

---

### Issue 1.2: Years of Experience — "Eight Years" in Hero Bio vs. Canonical "7.5+"

**File:** `/data/hero.ts`

**Lines:** 25

**Claim as written:**

> bio: 'Eight years from 900MW power plants in Japan to bank-wide AI platforms in Toronto. Same closed-loop pattern. Four abstraction levels.',

**Why it's flagged:**

`data/canonical.ts` line 50 defines:
```typescript
export const YEARS_EXPERIENCE = '7.5+';
```

With comment: "TCS (3.3y) + Quantiphi (1y) + RBC (3.5y) = ~7.8y; round to 7.5+."

RESUME_RAW.md §1 (line 43) reinforces: "The Master Resume currently says '8+ years' but the verified figure ... is **7.5+ years**."

**Suggested fix:**

Change hero.ts line 25 to:
```typescript
bio: 'Seven and a half years from 900MW power plants in Japan to bank-wide AI platforms in Toronto. Same closed-loop pattern. Four abstraction levels.',
```

Or use the canonical constant:
```typescript
import { YEARS_EXPERIENCE } from './canonical';
// ... 
bio: `${YEARS_EXPERIENCE} years from 900MW power plants in Japan to bank-wide AI platforms in Toronto. Same closed-loop pattern. Four abstraction levels.`,
```

---

### Issue 1.3: Production AI Systems Count — Potential Overcount in Metrics Display

**File:** `/data/metrics.ts`

**Lines:** 24

**Claim as written:**

> { value: String(PRODUCTION_SYSTEMS_COUNT), numericValue: PRODUCTION_SYSTEMS_COUNT, label: 'Production Gen AI Systems', context: 'PAR Assist, Astraeus, Aegis (v1 → v2 refactor)' },

**Why it's flagged:**

The context correctly identifies 3 systems (PAR Assist, Astraeus, Aegis as one product with v1 and v2 as revisions), which matches canonical.ts line 43: `PRODUCTION_SYSTEMS_COUNT = 3`.

However, RESUME_RAW.md §6 (Verified Metrics Table, line 596) lists:
> Production AI systems | **4** | PAR Assist, Astraeus, Aegis v1, Aegis v2

This is the drift: the table lists "4" (treating v1 and v2 as separate) while the metric display and canonical.ts say "3" (treating v1+v2 as one product, one refactor).

Per canonical.ts comment (lines 40–41): "Per 2026-04-21 audit: do NOT present Aegis v2 as an independent 4th product. v2 was a 2-week focused refactor of v1 done alongside PAR Assist + Astraeus work."

**Suggested fix:**

Update RESUME_RAW.md §6 line 596 from "4" to "3" and update the systems list to "PAR Assist, Astraeus, Aegis (v1+v2 as one product)".

---

## P2 Issues (Consistency Drift)

### Issue 2.1: Aegis v2 Framing — Independent Build vs. Concurrent Refactor

**Files:** Multiple

**Drift:**

| File | Framing | Issue |
|------|---------|-------|
| `enterprise-agentic-ai-framework.mdx` §4 title | "Aegis v2 in just two weeks (leveraging v1 experience) **while concurrently advancing Astraeus**" | ✅ Correct — emphasizes refactor, not build |
| `aegis-v2-velocity.mdx` title | "Aegis v2 went from concept to production in two weeks... simultaneously running Astraeus" | ✅ Correct — "concept to production" is the refactor, not a blank-slate build |
| `data/projectCaseStudies.ts` Aegis TLDR (line 216) | "Shipped to production in **2 weeks — while simultaneously running Astraeus development**" | ✅ Correct |
| `RESUME_RAW.md` §3.1 (line 71) | "Designed and implemented Aegis v2 in just two weeks (leveraging v1 experience)" | ✅ Correct |

**Status:** All sources agree v2 is a refactor, not independent build. **No drift detected** — marked as checked and consistent.

### Issue 2.2: Commodity Tax Scale — Inconsistent Notation

**Files:** Multiple

**Drift:**

| File | Phrasing | Value |
|------|----------|-------|
| `data/projectCaseStudies.ts` line 162 | "~$250M GST, ~$350M PVAT (~$600M+ total)" | Sum notation: ~$600M+ |
| `data/timeline.ts` line 160 | "$600M+" | Short form |
| `RESUME_RAW.md` §3.2 (line 293) | "~$250M GST, ~$350M PVAT (~$600M+ total)" | Matches case study |
| `data/canonical.ts` | Not defined (per design comment line 14: "Prose is authored voice") | — |

**Status:** Notation is consistent (~250M + ~350M = ~600M+). Minor notational variation between long-form ($250M GST + $350M PVAT) and short form ($600M+) is acceptable for different display contexts.

### Issue 2.3: Astraeus Transits / Geographies — Scope Clarity

**Files:** Multiple

**The numbers:**

| Metric | Value | Context |
|--------|-------|---------|
| Transits (leaf-level routing) | ~40,000 | `canonical.ts` line 75 |
| Rollups (intermediate aggregation) | ~9,000 | `canonical.ts` line 77 |
| Geographies | ~60,000 | `canonical.ts` line 79 comment: "Geography *hierarchy size* — total nodes in RBC's cost-centre geography tree (**hierarchy, not transits**)" |

**Drift check:**

- `agentic-ai.mdx` §2.1 (line 17): "~40,000 employee transits across ~9,000 organizational rollups with strict entitlement controls"
- `projectCaseStudies.ts` Astraeus TLDR (line 268): "~40,000 employee transits across ~9,000 organizational rollups"

Both correctly separate transits and rollups. No case study mentions geographies in the same sentence, so no false equivalence.

**Status:** Consistent and clarified in canonical.ts comments. **No drift** — the 60K geographies are mentioned in CLAUDE.md §11 context but never confused with the 40K transits.

### Issue 2.4: Tone — Register Consistency in Blog Posts vs. Resume Data

**Pattern:** Blog posts use narrative, essay register ("The seductive option", "The architectural call"); resume data uses formal, metrics-first register ("Managed up to 5 people simultaneously").

**Status:** This is intentional separation of concerns (per CLAUDE.md §3.4: "All portfolio content lives in typed TypeScript objects in `/data/`"). Blog posts and resume data *should* differ in register. No drift to flag.

---

## P3 Issues (Tone / Register)

### Issue 3.1: Hype Language in Blog Posts

**Files:** `par-assist-building.mdx`, `agentic-ai.mdx`

**Examples:**

| Post | Quote | Register |
|------|-------|----------|
| `par-assist-building.mdx` l.26 | "I saw the shape of something **bigger**" | Sales-adjacent; vague |
| `agentic-ai.mdx` l.8 | "The most common architectural **mistake in enterprise agentic AI**" | Overstatement; unsourced |
| `enterprise-agentic-ai-framework.mdx` l.15 | "PAR drafting is a **stateful, branching workflow**" | Precise; acceptable |

**Severity:** Low. The blog posts are engineering narratives, not formal papers. The language ("something bigger") is honest-engineering voice, not marketing hype.

**Suggested fix:** Optional — these are voice choices. If tightening: "I saw the opportunity to scale it from a prototype to an enterprise platform" is more specific than "something bigger."

### Issue 3.2: "Seamless" and Similar Hedge Words

**Files:** None found. Searched blog posts for "seamless", "remarkable", "cutting-edge", "groundbreaking" — none present.

**Status:** Portfolio tone is appropriately direct and engineering-focused. No hype inflation detected.

---

## P4 Issues (Cleanup)

### Scan Results

- **TODOs/FIXMEs:** None found in blog posts or data files.
- **Dead links:** All internal links in case studies reference valid projects. (`/projects/par-assist`, `/projects/astraeus`, etc. all exist in `data/projects.ts`).
- **Broken citations:** Blog posts import CitationRef components; citation indices are consistent with citation data.
- **Formatting:** All MDX files parse cleanly.

**Status:** ✅ No cleanup issues.

---

## Special Watchlist

### Aegis v2 as a "Product" vs. a "Refactor"

**Scope:** All files consistently frame Aegis v2 correctly as a refactor of v1, not an independent product. The "2 weeks" narrative is about refactor velocity (leveraging v1 learnings), not concept-to-production speed.

**Status:** ✅ No drift. Consistent across RESUME_RAW.md, case studies, blog posts, and canonical.ts.

---

## Cross-File Consistency Check

### Metrics Table (canonical.ts vs. CLAUDE.md §11 vs. RESUME_RAW.md §6)

| Metric | canonical.ts | CLAUDE.md §11 | RESUME_RAW.md §6 | Status |
|--------|--------------|---------------|-----------------|--------|
| Years | 7.5+ | 7.5+ | 7.5+ ✅ (with note on "8+" error) | ✅ Consistent |
| Production systems | 3 | 3 | **4 ❌** | DRIFT — see P1.3 |
| Digital Twin savings | $3M | $3M | $3M | ✅ Consistent |
| Commodity Tax efficiency | 90 min | 90 min | 90 min | ✅ Consistent |
| Astraeus transits | ~40,000 | ~40,000 | ~40,000 | ✅ Consistent |
| Astraeus rollups | ~9,000 | ~9,000 | ~9,000 | ✅ Consistent |

---

## Final Recommendations

### Must-Fix (Before Next Content Push)

1. **P1.1 (PAR Assist architecture):** Rewrite `enterprise-agentic-ai.mdx` to align with two-stage field-group retrieval model, OR add a note that the formal post describes a candidate architecture and the production system differs.

2. **P1.2 (Years of experience):** Update `hero.ts` bio from "Eight years" to "7.5+ years" or use the canonical constant.

3. **P1.3 (Production systems count):** Align RESUME_RAW.md §6 from "4 systems" to "3 systems" to match canonical.ts and display logic.

### Optional (Polish)

- Consider tightening vague language in `par-assist-building.mdx` ("something bigger" → "opportunity to scale it").
- Verify that PAR Assist case study in `projectCaseStudies.ts` is the "source of truth" against which blog posts are checked (currently it is).

---

## Audit Methodology

- Searched all 12 MDX blog posts for factual claims, metrics, system descriptions.
- Cross-checked every metric against `canonical.ts`, `CLAUDE.md §11`, and `RESUME_RAW.md §6`.
- Verified architectural descriptions in formal posts against framework and builder companion posts.
- Checked consistency of system names, scale numbers, and dates across surfaces.
- Scanned for tone issues, dead links, and TODOs.

**Audit date:** April 22, 2026  
**Scope:** Full portfolio material (12 blog posts, 6 case studies, resume data, canonical sources)  
**Status:** Ready for owner review and remediation.

