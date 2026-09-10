#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = join(ROOT, 'out')
const SITE_ORIGIN = 'https://rogerthatroach.github.io'

const failures = []

function fail(message) {
  failures.push(message)
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function routeForHtml(path) {
  const local = relative(OUT, path).split(sep).join('/')
  if (local === 'index.html') return '/'
  return `/${local.replace(/\.html$/, '')}`
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
}

function renderedText(html) {
  return decodeHtml(
    html
      .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function localTarget(pathname) {
  const decoded = decodeURIComponent(pathname)
  const relativePath = decoded === '/' ? 'index.html' : decoded.replace(/^\//, '')
  const direct = join(OUT, relativePath)
  const candidates = [direct]

  if (!extname(relativePath)) {
    candidates.push(`${direct}.html`, join(direct, 'index.html'))
  }

  return candidates.find((candidate) => existsSync(candidate))
}

if (!existsSync(OUT)) {
  console.error('Missing out/. Run npm run build before npm run verify:export.')
  process.exit(1)
}

const htmlFiles = walk(OUT).filter((path) => path.endsWith('.html'))
const contentPages = htmlFiles.filter((path) => {
  const route = routeForHtml(path)
  return route !== '/404' && !route.startsWith('/_not-found')
})

const renderedOutputGuards = [
  ['client-only placeholder', /Loading (?:diagram|post)/i],
  ['legacy visualization runtime label', /ReactFlow/i],
  ['uninitialized server metric', />\$0M</i],
]

const requiredVisibleTextByRoute = new Map([
  ['/', ['Hands-on production AI leadership', '3 production AI systems']],
  ['/resume', ['AI & Data Science Lead — RBC', 'Three production AI systems at the bank', 'AI/LLM Drafting Platform', 'AI/LLM Workforce Analytics Platform', 'Mar → Nov 2025', 'Financial Peer Benchmarking Platform', 'Professional experience']],
  ['/about', ['I lead best when I stay close to the work', 'Four domains, four recurring questions']],
  ['/now', ['Now · updated August 2026', 'Current focus']],
  ['/platform', ['Application boundaries', 'They do not map RBC’s internal infrastructure']],
  ['/projects', ['AI/LLM Drafting Platform', 'Combustion Tuning']],
  ['/projects/project-approval-drafting', ['Problem and context', 'One agent carries the draft from intake to review', 'A field group is a scope, not a specialist agent']],
  ['/projects/workforce-analytics', ['Decision and trade-off', 'Outcome and operating state', 'Language stays at the edges; permissions and calculation stay in code']],
  ['/projects/financial-peer-benchmarking', ['Decision and trade-off', 'Outcome and operating state', 'One pipeline, two legitimate outcomes']],
  ['/projects/commodity-tax', ['Decision and trade-off', 'Outcome and operating state']],
  ['/projects/document-intelligence', ['Decision and trade-off', 'Outcome and operating state']],
  ['/projects/combustion-tuning', ['Decision and trade-off', 'Outcome and operating state']],
  ['/blog/project-approval-drafting-platform-building', ['Building an AI/LLM Drafting Platform: From One-Page Plan to CFO Group Launch']],
  ['/blog/enterprise-agentic-ai-architecture', ['AI/LLM Drafting: One Agent, Bounded Tools, Human Review']],
  ['/blog/agentic-ai', ['The numerical path is repeatable for fixed inputs, data, code, and configuration; model routing and prose remain probabilistic.']],
  ['/blog/text-to-sql', ["The model's score is a routing signal, not a correctness probability."]],
  ['/blog/closed-loop', ['A model output is not yet a useful system.']],
  ['/blog/enterprise-agentic-ai-framework', ['The goal is not maximum autonomy. It is explicit responsibility: one component owns control, bounded routines perform declared work, configured checks expose known gaps, and an author decides what moves forward.']],
  ['/blog/commodity-tax-provenance', ['The dashboards therefore support investigation, not automated approval.']],
  ['/blog/workforce-analytics-model-boundary', ['Building AI/LLM Workforce Analytics Around a Deliberate Model Boundary', 'From March through the November 2025 launch']],
  ['/blog/workforce-analytics-boundary-decisions', ['AI/LLM Workforce Analytics: Four Decisions About Model and Deterministic Work']],
  ['/blog/financial-benchmarking-refactor', ['Financial Peer Benchmarking: What Made a Two-Week Refactor Possible']],
  ['/blog/financial-benchmarking-query-decisions', ['Financial Peer Benchmarking: Four Decisions for Bounded Text-to-SQL']],
  ['/blog/commodity-tax-cfo-trust', ['Commodity Tax: Designing Calculation and Inspection Together']],
  ['/blog/commodity-tax-cfo-trust-framework', ['Commodity Tax: Two Decisions Behind a Reviewable Workflow']],
])

for (const path of contentPages) {
  const route = routeForHtml(path)
  const html = readFileSync(path, 'utf8')
  const visibleText = renderedText(html)

  if (route === '/papers' || route.startsWith('/papers/')) {
    fail(`${route}: papers must remain absent until a versioned publication is approved`)
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
  if (!title) fail(`${route}: missing <title>`)
  if (title && /Harmilap Singh Dhaliwal\s*[|\-]​?\s*Harmilap Singh Dhaliwal/i.test(decodeHtml(title))) {
    fail(`${route}: duplicated owner name in title`)
  }

  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
  if (!description) {
    fail(`${route}: missing meta description`)
  } else if (decodeHtml(description).length > 160) {
    fail(`${route}: meta description is ${decodeHtml(description).length} characters`)
  }

  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
  if (!canonical) fail(`${route}: missing canonical URL`)

  // Blue Rose is a separately scoped prototype with its own application shell.
  // Keep its metadata, claims, and links in this scan, but do not apply the
  // portfolio page-landmark contract to those routes.
  if (!route.startsWith('/blue-rose')) {
    const mains = html.match(/<main\b/gi)?.length ?? 0
    if (mains !== 1) fail(`${route}: expected one main landmark, found ${mains}`)
  }

  for (const [label, pattern] of renderedOutputGuards) {
    if (pattern.test(html)) fail(`${route}: contains ${label}`)
  }

  for (const phrase of requiredVisibleTextByRoute.get(route) ?? []) {
    if (!visibleText.includes(phrase)) fail(`${route}: rendered text is missing “${phrase}”`)
  }

  const hrefs = [...html.matchAll(/\shref="([^"]+)"/gi)].map((match) => decodeHtml(match[1]))
  for (const href of hrefs) {
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:')) continue

    let url
    try {
      url = new URL(href, `${SITE_ORIGIN}${route === '/' ? '/' : `${route}/`}`)
    } catch {
      fail(`${route}: invalid href ${href}`)
      continue
    }

    if (url.origin !== SITE_ORIGIN || url.pathname.startsWith('/_next/')) continue

    const target = localTarget(url.pathname)
    if (!target) {
      fail(`${route}: broken internal href ${href}`)
      continue
    }

    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1))
      const targetHtml = readFileSync(target, 'utf8')
      if (!targetHtml.includes(`id="${id}"`) && !targetHtml.includes(`name="${id}"`)) {
        fail(`${route}: missing fragment target ${href}`)
      }
    }
  }
}

const paperExposurePatterns = [
  ['/papers route', /\/papers(?:[\/"'<\s]|$)/i],
]

for (const path of walk(OUT).filter((candidate) => /\.(?:html|js|xml|txt|json)$/i.test(candidate))) {
  const contents = readFileSync(path, 'utf8')
  for (const [label, pattern] of paperExposurePatterns) {
    if (pattern.test(contents)) fail(`${relative(OUT, path)}: contains ${label}`)
  }
}

try {
  const capabilities = JSON.parse(readFileSync(join(OUT, 'capabilities.json'), 'utf8'))
  if (capabilities.projects?.length !== 6) fail('/capabilities.json: expected six projects')
  if (capabilities.experience?.productionAiSystemsAtRbc !== 3) {
    fail('/capabilities.json: expected exactly three production AI systems at RBC')
  }
} catch (error) {
  fail(`/capabilities.json: ${error instanceof Error ? error.message : String(error)}`)
}

if (!existsSync(join(OUT, 'resume.pdf'))) fail('/resume.pdf: verified public résumé missing from export')
if (!existsSync(join(OUT, 'og-image.png'))) fail('/og-image.png: social preview missing from export')

// Retired internal names must never reappear in rendered output. The public
// copy carries functional descriptions; the codenames below were removed by
// the publication audit. Source-level constants cover the TypeScript data
// layer, but MDX prose is literal text, so this is the only check that covers
// every surface a reader actually sees.
const RETIRED_PUBLIC_TERMS = ['FinancialBenchmarking', 'WorkforceAnalytics', 'AI/LLM Drafting Platform', 'ModelGateway']

for (const path of contentPages) {
  const route = routeForHtml(path)
  const visibleText = renderedText(readFileSync(path, 'utf8'))
  for (const term of RETIRED_PUBLIC_TERMS) {
    if (visibleText.includes(term)) {
      fail(`${route}: retired internal name “${term}” reappeared in rendered text`)
    }
  }
}

if (failures.length > 0) {
  console.error(`Export verification failed with ${failures.length} issue(s):`)
  for (const issue of failures) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Export verification passed: ${contentPages.length} HTML pages, internal links, metadata, claims, and machine outputs.`)
