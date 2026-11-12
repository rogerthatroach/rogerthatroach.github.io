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

## Publishing and recovery

GitHub Pages must use **GitHub Actions** as its publishing source. Publishing
the source branch directly produces a README page instead of the built
portfolio. The pre-push hook checks this setting before a `main` update, and
the deployment workflow checks it again before building.

Each release validates the static export, records its commit and résumé PDF
hash in `release.json`, and keeps the built `github-pages` artifact for 90 days.
After deployment, live checks verify the release identity, homepage, résumé,
PDF and every CSS/JavaScript asset referenced by those pages. Failed build or
security checks leave the deployed release in place. A failed live check
triggers recovery from a prior verified release; newer successful deployments
or explicit restores take precedence over delayed recovery events.

For a manual restore, select an unexpired successful **Deploy to GitHub Pages**
run whose live check passed, then run **Restore a verified GitHub Pages
deployment** from `main` with that run's ID:

```bash
gh workflow run restore.yml --ref main -f source_run_id=RUN_ID
```

Recovery validates and republishes the saved static files without reinstalling
dependencies or rebuilding the site, then repeats the live checks. Publishing
and recovery share a queue so they cannot deploy concurrently. Backups expire
after 90 days; this recovery path does not provide independent hosting during
a GitHub-wide outage.
