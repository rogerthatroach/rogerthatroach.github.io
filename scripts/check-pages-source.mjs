#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

const REPOSITORY = 'rogerthatroach/rogerthatroach.github.io'

function fail(message) {
  console.error(`GitHub Pages source check failed: ${message}`)
  process.exit(1)
}

function runGh(args) {
  const result = spawnSync('gh', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 20_000,
  })

  if (result.error || result.signal) {
    fail('GitHub CLI could not complete the check. Verify that gh is installed and GitHub is reachable.')
  }

  return result
}

const authentication = runGh(['auth', 'status', '--hostname', 'github.com', '--active'])
if (authentication.status !== 0) {
  fail('Sign in to GitHub CLI with an active github.com account before publishing.')
}

const response = runGh([
  'api',
  '--hostname', 'github.com',
  '--method', 'GET',
  `repos/${REPOSITORY}/pages`,
])
if (response.status !== 0) {
  fail('Could not read the repository Pages settings. Check GitHub access before publishing.')
}

let pages
try {
  pages = JSON.parse(response.stdout)
} catch {
  fail('GitHub returned an invalid Pages settings response.')
}

if (pages?.build_type !== 'workflow') {
  fail('The publishing source must be GitHub Actions (workflow). Check repository Settings → Pages before publishing.')
}

console.log('GitHub Pages source verified: GitHub Actions (workflow).')
