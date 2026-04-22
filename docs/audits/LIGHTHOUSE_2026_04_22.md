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

## 3. Score snapshot (all routes, post-fix baseline)

*[To be filled once final production deploy of `7e61817` is live. Placeholder table:]*

| Route | Form | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| `/` | mobile | _pending_ | 100 | 100 | 100 |
| `/` | desktop | 100 | 100 | 100 | 100 |
| `/resume` | mobile | 97 | 96 | 100 | 100 |
| `/resume` | desktop | 100 | 96 | 100 | 100 |
| `/projects/par-assist` | mobile | 96 | 100 | 100 | 100 |
| `/blog/enterprise-agentic-ai-architecture` | mobile | 94 | 100 | 100 | 100 |

The `/resume` A11y at 96 (vs 100 elsewhere) is tracked as P1 in [`CODEBASE_AUDIT_2026_04_22.md`](CODEBASE_AUDIT_2026_04_22.md) §3 Track 6 (dark-mode contrast on palette-card tints, ArcProgress dot hit-area — partially mitigated by the 44×44 min-height fix but rail-internal overlap may still be flagged).

## 4. Open items after this run

1. **Verify production Perf ≥ 95 on home-mobile** once `7e61817` is live and CDN-cached.
2. **Resume A11y gap to 100** — trace the specific audits Lighthouse flags (likely palette-card contrast on tint at 15% alpha; or ArcProgress hit-area after the fix). Requires browser DevTools to confirm the specific failing audits.
3. **Perf: 900 ms unused JavaScript on homepage** (`bd904a5c` + `b536a0f1` + `6496` chunks). Likely Three.js + Framer Motion + geist fonts. Dynamic imports or tree-shake review owed.
4. **LCP on mobile: targets < 2.5 s** — localhost post-fix measured 2.8 s; CDN should shave ≥ 500 ms. Re-measure after deploy.

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
