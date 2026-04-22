# Lighthouse Audit — 2026-04-22

**Target:** production (`https://rogerthatroach.github.io`)
**Runner:** Lighthouse v12 via `npx`, headless Chrome (new), `--disable-gpu`
**Routes sampled:** 5 (home, resume, projects/par-assist, blog/enterprise-agentic-ai-architecture) × up to 2 form factors (mobile + desktop)
**Settings:** mobile = simulated throttling + mobile screen emulation; desktop = `--preset=desktop`; all runs use `--only-categories=performance,accessibility,best-practices,seo`

---

## 1. Pre-fix baseline (commit `556b7da`)

First production measurement after Tier 11 P1 code fixes shipped. Exposed a severe homepage regression.

| Route | Form | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/` | mobile | 98 | **59** | 89 | **82** |
| `/` | desktop | 100 | **59** | 93 | **82** |
| `/resume` | mobile | 97 | 95 | 100 | 100 |
| `/resume` | desktop | 100 | 96 | 100 | 100 |
| `/projects/par-assist` | mobile | 96 | 100 | 100 | 100 |
| `/blog/enterprise-agentic-ai-architecture` | mobile | 94 | 100 | 100 | 100 |

**Homepage-only failures** (A11y 59, SEO 82, BP 89) with clean scores everywhere else. Same 0-score audits across both mobile and desktop:

- `viewport`: "No <meta name=\"viewport\"> tag found"
- `document-title`: "Failing Elements" pointed at HTML root
- `html-has-lang`: same
- `meta-description`: "No meta description"

These HTML elements **were present** in the server-rendered response (verified via `curl`). The failures were therefore a measurement artifact, not a real content defect.

### 1.1 Root cause

[`components/ParticleField.tsx`](../../components/ParticleField.tsx) (Three.js + React Three Fiber) mounts on the homepage. In headless Chrome with `--disable-gpu` (the Lighthouse default), WebGL is unavailable. Three.js threw an unhandled error:

```
Error creating WebGL context.
THREE.WebGLRenderer: A WebGL context could not be created.
  VENDOR = 0xffff, DEVICE = 0xffff, GL_VENDOR = Disabled, GL_RENDERER = Disabled,
  ErrorMessage = BindToCurrentSequence failed.
```

The throw cascaded through Lighthouse's audit pipeline, causing its DOM-query audits to short-circuit — hence the `viewport`/`title`/`lang`/`description` false negatives. Only the homepage mounts `ParticleField`, so only the homepage regressed; resume/project/blog were unaffected.

### 1.2 Fix — commit `55b997e`

Added explicit WebGL availability detection at mount time. When `canvas.getContext('webgl2' | 'webgl' | 'experimental-webgl')` returns null (or throws), the component renders nothing instead of letting Three.js error downstream.

```typescript
useEffect(() => {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) setSupported(false);
  } catch {
    setSupported(false);
  }
  // ... existing prefers-reduced-motion handler
}, []);

if (!visible || !supported) return null;
```

Effect: no more WebGL errors in headless Chrome → Lighthouse's DOM audits run to completion → real scores surface. Real-user browsers still get the particle field as before (WebGL is universally available in Chrome, Firefox, Safari, Edge on device hardware).

## 2. Post-fix (commits `55b997e` + `7e61817`)

After the WebGL guard, a secondary LCP issue surfaced on home-mobile (Perf 86). Traced to the `FADE_UP` staggered entrance on Hero text — the bio paragraph (LCP candidate on mobile viewport) sat at `opacity: 0` for ~0.75s delay + 0.7s duration = ~1.45s before reaching final state. Lighthouse measured LCP at 4.2s (score 45), dragging Perf down.

### 2.1 Fix — commit `7e61817`

Converted eyebrow / name / tagline / bio from `motion.p` with `FADE_UP` variants to plain `<p>` / `<h1>` that render at final state immediately. CTAs + availability status pill still animate (they are chrome, not content). Mirrors the AboutSection LCP optimization from Session 6.

### 2.2 Measured impact

**Localhost (dev validation, `npx serve out`):**

| Route | Form | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|---|
| `/` | mobile | **96** | **100** | **100** | **100** | **2.8 s** (was 4.2 s) |

**Production (CDN, HTTP/2, compressed):** TBD — awaiting fresh deploy to verify; expected Perf ≥ 98 on home-mobile given the localhost improvement + CDN acceleration delta on other routes.

## 3. Final score snapshot (production, commit `c93797b`)

After all three fixes deployed (WebGL guard + Hero LCP + palette-card contrast):

| Route | Form | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/` | mobile | **100** | **100** | **100** | **100** |
| `/` | desktop | **100** | **100** | **100** | **100** |
| `/resume` | mobile | **100** | **100** | 96† | **100** |
| `/resume` | desktop | **100** | **100** | **100** | **100** |
| `/projects/par-assist` | mobile | 96 | **100** | **100** | **100** |
| `/blog/enterprise-agentic-ai-architecture` | mobile | 94 | **100** | **100** | **100** |

† resume-mobile BP briefly dropped from 100 → 96 on one re-run (likely run-to-run variance on the same commit; desktop stayed at 100).

### 3.1 Net improvement (pre-fix vs. post-fix, homepage)

| Metric | Pre-fix (prod) | Post-fix (prod) | Δ |
|---|---|---|---|
| home-mobile Perf | 98 | **100** | +2 |
| home-mobile A11y | 59 | **100** | **+41** |
| home-mobile BP | 89 | **100** | +11 |
| home-mobile SEO | 82 | **100** | +18 |
| home-mobile LCP | 4.2 s* | **1.9 s** | **−2.3 s** |
| home-desktop A11y | 59 | **100** | **+41** |

\* The 4.2 s LCP was measured on the **fixed-for-WebGL** run (post-55b997e, pre-7e61817). The original 98 Perf score was misleadingly inflated because WebGL errors short-circuited several audits.

### 3.2 Contrast fix (commit `c93797b`)

Lighthouse flagged `/resume` A11y 96 due to `text-text-tertiary` (#706764) on palette-card blue tint (`#e6e6ed` after 15% alpha blend) = 4.43:1 contrast — just below WCAG AA's 4.5:1 threshold. Three elements: period, org subtitle, team-shape label.

Fix: promoted those three to `text-text-secondary` (#575451 in light mode) inside palette-card regions. Applied to both [`CurrentRoleCard.tsx`](../../components/resume/CurrentRoleCard.tsx) (the actual failing surface) and [`SkillTimeline.tsx:111`](../../components/SkillTimeline.tsx#L111) (same `RoleCard` component, same tint, pre-emptive fix for homepage parity).

Result: `/resume` A11y 96 → **100** on both mobile and desktop.

## 4. Open items after this run

1. **Project + blog mobile Perf 94-96** — not shipping-blockers, but worth a sweep. Largest chunks are Three.js (homepage ParticleField is now WebGL-guarded but chunk still ships), Framer Motion, and @xyflow/react for the ReactFlow diagrams on case-study pages. Dynamic-import review owed if we want Perf 100 across all routes.
2. **900 ms unused JavaScript on homepage** (`bd904a5c` + `b536a0f1` + `6496` chunks). Tree-shake or code-split review.
3. **BP run-to-run variance on resume-mobile** (100 → 96). Investigate once with verbose output to identify which audit toggles.
4. **No device-emulated LCP measurement** yet — Lighthouse simulates throttling. A real device test via WebPageTest or field data from CrUX would validate the 1.9 s LCP holds under real mobile conditions.

## 5. Methodology notes + limitations

- **Synthetic throttling** (Lighthouse's default): simulates slow 4G + 4x CPU slowdown. Different from field data; useful as a relative baseline, not an absolute SLA.
- **`--disable-gpu` artifact**: this pass surfaced a real class of issue that would also hit CI environments, some privacy-preserving browser modes, and very old hardware. The fix makes the site more resilient, not just Lighthouse-friendlier.
- **CDN variance**: GitHub Pages uses a Varnish-style edge (`x-proxy-cache`, `age`, `via: 1.1 varnish` headers). First fetch after deploy may bypass cache; subsequent fetches benefit. Score drift of ±2 Perf points between runs is normal.
- **User-agent-specific cache**: GitHub Pages returned stale HTML on `--preset=desktop` runs immediately after deploy while mobile returns were fresh. Re-running after ~30 s resolved the cache split. When comparing pre/post, always re-run all form factors after deploy, not just the first one.
- **Not measured this pass**: mobile device-emulated screen reader flow, real-device LCP, RUM / Core Web Vitals from crux.dev.
- **Not measured ever (this site)**: Best Practices `cache-insight` / `uses-long-cache-ttl` — GitHub Pages' cache policy is a hosting constraint, not an app constraint; flagged but not actionable without self-hosting.

## 6. Re-run criteria

Run Lighthouse when:
1. Any page-level component or layout change ships (especially anything in `components/` that renders on `/`, `/resume`, `/blog/[slug]`, `/projects/[slug]`).
2. A new dependency is added that touches the render path (diagrams, animations, heavy UI).
3. Font loading strategy changes.
4. After `next.config.js` changes.
5. Quarterly at minimum.

---

*Filed under `docs/audits/`. Partner doc: [`CODEBASE_AUDIT_2026_04_22.md`](CODEBASE_AUDIT_2026_04_22.md). Underlying Lighthouse JSON reports archived in `/tmp/lh/` during the session — not committed (binary-ish, large, regenerable).*
