#!/usr/bin/env node
/**
 * Encrypt the Themis seed JSON with a passphrase, emit ciphertext.
 *
 * Usage:
 *   THEMIS_PASSPHRASE='your-passphrase-here' node scripts/encrypt-themis-data.mjs
 *
 * Or, if `.themis-passphrase` exists in the repo root (gitignored), it'll
 * be read automatically.
 *
 * Reads:  data/themis/seed.json  (gitignored plaintext)
 * Writes: public/blue-rose/data.enc.json  (committed ciphertext)
 *
 * Wire format mirrors `app/blue-rose/_lib/crypto.ts`:
 *   { v: 1, salt: <Base64 16B>, iv: <Base64 12B>, ct: <Base64 ciphertext+tag> }
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), '..');
const SEED_PATH = resolve(ROOT, 'data/themis/seed.json');
const OUT_PATH = resolve(ROOT, 'public/blue-rose/data.enc.json');
const PASSPHRASE_FILE = resolve(ROOT, '.themis-passphrase');

const PBKDF2_ITERATIONS = 200_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BITS = 256;

function readPassphrase() {
  const fromEnv = process.env.THEMIS_PASSPHRASE;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  if (existsSync(PASSPHRASE_FILE)) {
    return readFileSync(PASSPHRASE_FILE, 'utf8').trim();
  }
  console.error(
    'No passphrase. Set THEMIS_PASSPHRASE env var or create .themis-passphrase in the repo root.',
  );
  process.exit(1);
}

function toB64(buf) {
  return Buffer.from(buf).toString('base64');
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const baseKey = await webcrypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: KEY_BITS },
    true,
    ['encrypt', 'decrypt'],
  );
}

async function main() {
  if (!existsSync(SEED_PATH)) {
    console.error(`Seed not found at ${SEED_PATH}. Create data/themis/seed.json first.`);
    process.exit(1);
  }

  const seedJson = readFileSync(SEED_PATH, 'utf8');
  // Validate it parses
  JSON.parse(seedJson);

  const passphrase = readPassphrase();
  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = webcrypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const ctBuf = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(seedJson),
  );

  const blob = {
    v: 1,
    salt: toB64(salt),
    iv: toB64(iv),
    ct: toB64(new Uint8Array(ctBuf)),
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(blob, null, 2) + '\n', 'utf8');

  const sizeKb = (Buffer.byteLength(JSON.stringify(blob)) / 1024).toFixed(1);
  console.log(`✓ Encrypted ${SEED_PATH} → ${OUT_PATH}  (${sizeKb} KB)`);
}

main().catch((err) => {
  console.error('Encryption failed:', err);
  process.exit(1);
});
