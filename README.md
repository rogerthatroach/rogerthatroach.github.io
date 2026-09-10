# rogerthatroach.github.io

Personal portfolio of **Harmilap Singh Dhaliwal** — AI & Data Science Lead.
Live at **[rogerthatroach.github.io](https://rogerthatroach.github.io)**.

A public record of production ML and AI work across industrial systems, cloud
document intelligence, financial automation, and agentic workflows.

## Stack

- **Next.js 16** (App Router) with `output: 'export'` → fully static
- **TypeScript** (strict) · **Tailwind CSS** · **Framer Motion**
- **MDX** writing · server-rendered **HTML/CSS/SVG** visual explanations ·
  self-hosted fonts · restrained optional motion
- Deployed to **GitHub Pages** via SHA-pinned GitHub Actions

## Architecture

Content is data-driven: all copy, metrics, and project narratives live in typed
objects under [`data/`](data/) (single source of truth in `data/canonical.ts`),
and components read from them — content edits touch one data file, not JSX.

## Develop

```bash
nvm use            # pinned Node (see .nvmrc)
npm install
npm run dev        # local dev server
npm run build      # static export → ./out
npm run verify:export  # metadata, links, claims, and machine-output gate
npm run check      # typecheck + build + exported-site verification
```
