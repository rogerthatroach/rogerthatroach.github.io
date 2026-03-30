---
name: enrich-post
description: Enrich or update a blog post with new content, references, or sections
user_invocable: true
---

# Enrich Blog Post

When this skill is invoked with a post slug (e.g., `/enrich-post agentic-ai`), follow this protocol:

## 1. Load Context

Read these files before making any changes:
- `data/posts/{slug}.mdx` — the post content (single source of truth)
- `data/posts/index.ts` — post metadata, references, and further reading
- `docs/career/CAREER_KNOWLEDGE_BASE.md` — career content source of truth
- `docs/specs/PORTFOLIO_SPEC.md` — design spec and content guidelines
- `CLAUDE.md` — coding standards and session protocol

## 2. Enforce Standards

Every blog post MUST have:
- **Numbered sections** (## 1. Introduction, ## 2. Problem Formulation, etc.)
- **At least 2 formal definitions** using `<TheoremBlock variant="definition">`
- **At least 1 theorem with proof** using `<TheoremBlock variant="theorem">` + `<TheoremBlock variant="proof">`
- **KaTeX equations** using `tex()` from `@/lib/katex` — call at module scope, pass as `html` prop
- **Clickable citations** using `<CitationRef id={N} />` — every [N] must match `id: N` in the references array
- **Every reference must have a `url` field** where a public link exists
- **Interactive diagrams** via `@/components/blog/BlogDiagrams` (ReactFlow, theme-aware)
- **No hardcoded content** — all text flows from the MDX, all metadata from `index.ts`

## 3. Math Rendering Pattern

```mdx
import { tex } from '@/lib/katex'
import MathBlock from '@/components/blog/MathBlock'
import InlineEquation from '@/components/blog/InlineEquation'

Inline: <InlineEquation html={tex("\\mathcal{Q}")} />
Display: <MathBlock html={tex("f(x) = x^2", true)} />
```

CRITICAL: The `tex()` function must be called at the top level or in expressions — never pass raw LaTeX as a string prop. This avoids the backslash serialization bug.

## 4. Citation Pattern

```mdx
import CitationRef from '@/components/blog/CitationRef'

The LLM-as-Router pattern <CitationRef id={1} /> resolves this...
```

Citations render as clickable `[1]` links that scroll to `#ref-1` in the references section.

## 5. Output Changes To

1. `data/posts/{slug}.mdx` — content updates
2. `data/posts/index.ts` — new/updated references, metadata changes (reading time, abstract, tags)
3. `components/blog/diagrams/*.tsx` — if new visualizations are needed

## 6. After Changes

- Run `npm run build` to verify
- Check KaTeX renders: `grep -c 'class="katex"' out/blog/{slug}.html`
- Check citations: `grep -c 'href="#ref-' out/blog/{slug}.html`

## 7. Confidentiality

- RBC internal system names (Astraeus, Aegis, PAR Assist) — confirm with Milap before publishing
- No proprietary data, model outputs, or internal screenshots
- Architecture diagrams show PATTERNS, not implementation details
