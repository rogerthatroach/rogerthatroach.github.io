# rogerthatroach.github.io

Personal portfolio of **Harmilap Singh Dhaliwal** — AI & Data Science Lead.
Live at **[rogerthatroach.github.io](https://rogerthatroach.github.io)**.

A career arc from industrial Digital Twins to bank-wide production agentic AI,
told through interactive case studies, technical whitepapers, and architecture
diagrams.

## Stack

- **Next.js 14** (App Router) with `output: 'export'` → fully static
- **TypeScript** (strict) · **Tailwind CSS** · **Framer Motion**
- **MDX** blog/papers · **@xyflow/react** (ReactFlow) architecture diagrams ·
  **Three.js** hero particle field · **KaTeX** math (pre-rendered at build)
- Deployed to **GitHub Pages** via GitHub Actions (SHA-pinned), with a daily
  rebuild so future-dated posts auto-publish

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
```
