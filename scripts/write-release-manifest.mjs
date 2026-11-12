#!/usr/bin/env node

import { readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { assertBrandedPage, assertPdf, staticAssetUrls, validateReleaseManifest } from './verify-live-site.mjs'

export function createReleaseManifest({ commitSha, runId, resumeBytes }) {
  return validateReleaseManifest({ schemaVersion: 1, commitSha, runId, resumeSha256: assertPdf(resumeBytes) })
}

export function validateExport(directory) {
  const root = resolve(directory)
  const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8')
  const resumeHtml = readFileSync(resolve(root, 'resume.html'), 'utf8')
  const resumeBytes = readFileSync(resolve(root, 'resume.pdf'))
  assertBrandedPage(indexHtml)
  assertBrandedPage(resumeHtml, { resume: true })
  assertPdf(resumeBytes)
  const assets = [...new Set([
    ...staticAssetUrls(indexHtml, 'https://export.invalid/'),
    ...staticAssetUrls(resumeHtml, 'https://export.invalid/'),
  ])]
  for (const asset of assets) {
    const path = resolve(root, `.${decodeURIComponent(new URL(asset).pathname)}`)
    if (!path.startsWith(`${root}${sep}`)) throw new Error('Static asset path escapes the export directory')
    if (!statSync(path).isFile() || statSync(path).size === 0) throw new Error('A referenced Next.js static asset is missing or empty')
    const prefix = readFileSync(path).subarray(0, 128).toString('utf8')
    if (/^\s*(?:<!doctype\s+html|<html\b)/i.test(prefix)) throw new Error('A referenced Next.js static asset contains HTML')
  }
  return { resumeBytes, assetCount: assets.length }
}

export function writeReleaseManifest({ directory, commitSha, runId }) {
  const { resumeBytes, assetCount } = validateExport(directory)
  const manifest = createReleaseManifest({ commitSha, runId, resumeBytes })
  const destination = resolve(directory, 'release.json')
  const temporary = `${destination}.${process.pid}.tmp`
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`)
  renameSync(temporary, destination)
  return { manifest, assetCount }
}

export function parseArguments(argv) {
  if (argv.length !== 2 || argv[0] !== '--directory' || !argv[1] || argv[1].startsWith('--')) {
    throw new Error('Usage: node scripts/write-release-manifest.mjs --directory out')
  }
  return { directory: argv[1] }
}

function main() {
  const { directory } = parseArguments(process.argv.slice(2))
  const commitSha = (process.env.RELEASE_SHA || process.env.GITHUB_SHA || '').trim()
  const runId = (process.env.RELEASE_RUN_ID || process.env.GITHUB_RUN_ID || '').trim()
  const { manifest, assetCount } = writeReleaseManifest({ directory, commitSha, runId })
  console.log(`Release manifest written: ${manifest.commitSha} (run ${manifest.runId}); ${assetCount} static assets; résumé ${manifest.resumeSha256}`)
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    main()
  } catch (error) {
    console.error(`Release manifest generation failed: ${error.message}`)
    process.exitCode = 1
  }
}
