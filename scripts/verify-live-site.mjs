#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const COMMIT_SHA = /^[a-f0-9]{40}$/i
const PDF_SHA = /^[a-f0-9]{64}$/i
const RUN_ID = /^\d+$/

export function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex')
}

export function renderedText(html) {
  return html
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/\s+/g, ' ')
    .trim()
}

export function assertBrandedPage(html, { resume = false } = {}) {
  if (typeof html !== 'string' || !/<main\b[^>]*\bid=["']main-content["']/i.test(html)) {
    throw new Error(`${resume ? 'Résumé' : 'Homepage'} is missing its main-content landmark`)
  }
  const visible = renderedText(html)
  if (!visible.includes('Harmilap Singh Dhaliwal')) {
    throw new Error(`${resume ? 'Résumé' : 'Homepage'} is missing the portfolio identity`)
  }
  if (/class=["'][^"']*\bmarkdown-body\b/i.test(html) || /<h1\b[^>]*>\s*(?:<a\b[^>]*>)?\s*rogerthatroach\.github\.io\s*(?:<\/a>)?\s*<\/h1>/i.test(html)) {
    throw new Error('The page contains the README fallback instead of the portfolio')
  }
  if (resume) {
    if (!/R[eé]sum[eé]/i.test(visible) || !visible.includes('Professional experience')) {
      throw new Error('Résumé is missing its heading or professional experience')
    }
    if (!/\bhref=["'][^"']*\/resume\.pdf(?:[?#][^"']*)?["']/i.test(html)) {
      throw new Error('Résumé is missing its PDF link')
    }
  }
}

export function staticAssetUrls(html, baseUrl) {
  const base = new URL(baseUrl)
  const assets = new Set()
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base)
    if (!url.pathname.includes('/_next/static/') || !/\.(?:css|js)$/i.test(url.pathname)) continue
    if (url.origin !== base.origin) throw new Error('A Next.js static asset points to another origin')
    assets.add(url.href)
  }
  if (assets.size === 0) throw new Error('Homepage is missing Next.js CSS or JavaScript assets')
  return [...assets]
}

export function assertPdf(bytes, expectedSha) {
  if (Buffer.from(bytes).subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('Résumé download is not a PDF')
  }
  const actual = sha256(bytes)
  if (expectedSha && actual !== expectedSha.toLowerCase()) throw new Error('Résumé PDF SHA-256 does not match the expected release')
  return actual
}

export function validateReleaseManifest(manifest, { expectedSha, expectedPdfSha } = {}) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('Release manifest must be an object')
  if (manifest.schemaVersion !== 1 || !COMMIT_SHA.test(manifest.commitSha ?? '') || !RUN_ID.test(manifest.runId ?? '') || !PDF_SHA.test(manifest.resumeSha256 ?? '')) {
    throw new Error('Release manifest has an invalid schema or release identity')
  }
  if (typeof manifest.commitSha !== 'string' || typeof manifest.runId !== 'string' || typeof manifest.resumeSha256 !== 'string') {
    throw new Error('Release manifest identity fields must be strings')
  }
  if (expectedSha && manifest.commitSha.toLowerCase() !== expectedSha.toLowerCase()) throw new Error('Release manifest commit does not match the expected release')
  if (expectedPdfSha && manifest.resumeSha256.toLowerCase() !== expectedPdfSha.toLowerCase()) throw new Error('Release manifest PDF SHA-256 does not match the expected release')
  return manifest
}

function normalizedBaseUrl(value) {
  const url = new URL(value)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Base URL must be an HTTP(S) URL without credentials, query or fragment')
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  return url
}

async function fetchBytes(url, { fetchImpl, nonce, timeoutMs, kind, origin }) {
  const requestUrl = new URL(url)
  requestUrl.searchParams.set('_release_check', nonce)
  const response = await fetchImpl(requestUrl, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (response.status !== 200) throw new Error(`${kind} returned HTTP ${response.status}`)
  if (response.url && new URL(response.url).origin !== origin) throw new Error(`${kind} redirected to another origin`)
  const contentType = (response.headers.get('content-type') ?? '').toLowerCase()
  const bytes = Buffer.from(await response.arrayBuffer())
  if (!bytes.length) throw new Error(`${kind} is empty`)
  return { bytes, contentType }
}

export async function verifyLiveSite({ baseUrl, expectedSha, expectedPdfSha, fetchImpl = fetch, timeoutMs = 10000, nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}` }) {
  if (!COMMIT_SHA.test(expectedSha ?? '') || !PDF_SHA.test(expectedPdfSha ?? '')) throw new Error('Expected commit and PDF SHA-256 must be full hexadecimal hashes')
  const base = normalizedBaseUrl(baseUrl)
  const options = { fetchImpl, nonce, timeoutMs, origin: base.origin }
  const [release, home, resume, pdf] = await Promise.all([
    fetchBytes(new URL('release.json', base), { ...options, kind: 'Release manifest' }),
    fetchBytes(base, { ...options, kind: 'Homepage' }),
    fetchBytes(new URL('resume', base), { ...options, kind: 'Résumé page' }),
    fetchBytes(new URL('resume.pdf', base), { ...options, kind: 'Résumé PDF' }),
  ])
  if (!release.contentType.includes('json')) throw new Error('Release manifest has a non-JSON content type')
  if (!home.contentType.includes('text/html') || !resume.contentType.includes('text/html')) throw new Error('Homepage or résumé has a non-HTML content type')
  let manifest
  try {
    manifest = JSON.parse(release.bytes.toString('utf8'))
  } catch {
    throw new Error('Release manifest is not valid JSON')
  }
  validateReleaseManifest(manifest, { expectedSha, expectedPdfSha })
  const homeHtml = home.bytes.toString('utf8')
  const resumeHtml = resume.bytes.toString('utf8')
  assertBrandedPage(homeHtml)
  assertBrandedPage(resumeHtml, { resume: true })
  assertPdf(pdf.bytes, expectedPdfSha)
  const assetUrls = [...new Set([
    ...staticAssetUrls(homeHtml, base),
    ...staticAssetUrls(resumeHtml, base),
  ])]
  let nextAsset = 0
  let assetFailure
  await Promise.all(Array.from({ length: Math.min(4, assetUrls.length) }, async () => {
    while (!assetFailure && nextAsset < assetUrls.length) {
      const assetUrl = assetUrls[nextAsset++]
      const assetPath = new URL(assetUrl).pathname
      try {
        const asset = await fetchBytes(assetUrl, { ...options, kind: `Next.js static asset ${assetPath}` })
        const expectedType = /\.css$/i.test(assetPath) ? /(?:^|;)\s*text\/css\b/ : /(?:javascript|ecmascript)/
        if (!expectedType.test(asset.contentType) || /^\s*(?:<!doctype\s+html|<html\b)/i.test(asset.bytes.toString('utf8', 0, 128))) {
          throw new Error(`Next.js static asset ${assetPath} returned HTML or an unexpected content type`)
        }
      } catch (error) {
        assetFailure ??= error
      }
    }
  }))
  if (assetFailure) throw assetFailure
  return { commitSha: manifest.commitSha, runId: manifest.runId, resumeSha256: manifest.resumeSha256, assetPath: new URL(assetUrls[0]).pathname, assetCount: assetUrls.length }
}

export function parseArguments(argv) {
  const values = { attempts: 12, retryDelayMs: 10000 }
  const flags = new Map([['--base-url', 'baseUrl'], ['--expected-sha', 'expectedSha'], ['--expected-pdf-sha', 'expectedPdfSha'], ['--attempts', 'attempts'], ['--retry-delay-ms', 'retryDelayMs']])
  for (let index = 0; index < argv.length; index += 2) {
    const key = flags.get(argv[index])
    const value = argv[index + 1]
    if (!key || !value || value.startsWith('--')) throw new Error(`Invalid or missing CLI argument: ${argv[index] ?? ''}`)
    if (Object.hasOwn(values, key) && !['attempts', 'retryDelayMs'].includes(key)) throw new Error(`Duplicate CLI argument: ${argv[index]}`)
    values[key] = value
  }
  if (!values.baseUrl || !COMMIT_SHA.test(values.expectedSha ?? '')) throw new Error('--base-url and a full --expected-sha are required')
  normalizedBaseUrl(values.baseUrl)
  for (const [key, min, max] of [['attempts', 1, 60], ['retryDelayMs', 0, 60000]]) {
    if (!/^\d+$/.test(String(values[key]))) throw new Error(`${key} must be an integer`)
    values[key] = Number(values[key])
    if (values[key] < min || values[key] > max) throw new Error(`${key} must be between ${min} and ${max}`)
  }
  if (values.expectedPdfSha && !PDF_SHA.test(values.expectedPdfSha)) throw new Error('--expected-pdf-sha must be a full SHA-256 hash')
  return values
}

export async function verifyWithRetries(options, { verify = verifyLiveSite, sleep = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds)), log = console.error } = {}) {
  const { attempts = 12, retryDelayMs = 10000 } = options
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await verify(options)
    } catch (error) {
      if (attempt === attempts) throw error
      log(`Live-site check ${attempt}/${attempts}: ${error.message}; retrying in ${retryDelayMs}ms`)
      await sleep(retryDelayMs)
    }
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  options.expectedPdfSha ??= assertPdf(readFileSync(resolve(ROOT, 'public/resume.pdf')))
  const result = await verifyWithRetries(options)
  console.log(`Live site verified: ${result.commitSha} (run ${result.runId}); résumé ${result.resumeSha256}; ${result.assetCount} static assets checked (first ${result.assetPath})`)
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`Live-site verification failed: ${error.message}`)
    process.exitCode = 1
  })
}
