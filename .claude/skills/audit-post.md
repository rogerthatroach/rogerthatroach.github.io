---
name: audit-post
description: Audit a blog post for content integrity, reference accuracy, and rendering correctness
user_invocable: true
---

# Audit Blog Post

When invoked with a post slug (e.g., `/audit-post closed-loop`), perform a comprehensive read-only audit.

## 1. Load Files

- `data/posts/{slug}.mdx` — the post content
- `data/posts/index.ts` — metadata + references array for this post
- Build output: `out/blog/{slug}.html` (run `npm run build` first if needed)

## 2. Check Citation Integrity

For every `<CitationRef id={N} />` in the MDX:
- Verify `id: N` exists in the `references` array in `index.ts`
- Verify the reference authors/title match what the surrounding text claims
  - Example: if text says "Kennedy and Eberhart [1]", reference 1 MUST be Kennedy & Eberhart

For every reference in the array:
- Check it has a `url` field (flag if missing)
- Check the URL is plausible (arXiv format, known domains)

## 3. Check KaTeX Rendering

In the built HTML (`out/blog/{slug}.html`):
- Count `class="katex"` — should match expected equation count
- Check for `<mi>m</mi><mi>a</mi><mi>t</mi>` — broken letter-by-letter rendering = FAIL
- Verify `tex()` pattern: every MathBlock/InlineEquation should use `html={tex("...")}`, not `tex="..."`

## 4. Check Content Standards

- [ ] Numbered sections (## 1., ## 2., etc.)
- [ ] At least 2 `<TheoremBlock variant="definition">`
- [ ] At least 1 `<TheoremBlock variant="theorem">` with a following `<TheoremBlock variant="proof">`
- [ ] KaTeX equations present (both display and inline)
- [ ] No hardcoded content (no inline styles, no magic strings)
- [ ] Abstract present in `index.ts` metadata
- [ ] Reading time reasonable for content length

## 5. Check Diagrams

- Diagrams imported from `@/components/blog/BlogDiagrams` (not inline dynamic imports)
- Diagram components use ReactFlow or CSS variables (no hardcoded hex colors)
- Diagrams wrapped in `<VisualizationContainer>`

## 6. Output

Report findings as a table:

| Check | Status | Details |
|-------|--------|---------|
| Citations match references | ✅/❌ | ... |
| All references have URLs | ✅/❌ | ... |
| KaTeX renders correctly | ✅/❌ | ... |
| Formal definitions present | ✅/❌ | count |
| Theorems with proofs | ✅/❌ | count |
| No hardcoded content | ✅/❌ | ... |
| Diagrams theme-aware | ✅/❌ | ... |
