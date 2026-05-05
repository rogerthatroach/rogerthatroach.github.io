/**
 * AES-GCM passphrase gate.
 *
 * Wire format (Base64-encoded JSON in `public/blue-rose/data.enc.json`):
 *   { v: 1, salt: <Base64 16B>, iv: <Base64 12B>, ct: <Base64 ciphertext+tag> }
 *
 * Browser unlock flow:
 *   1. Fetch ciphertext.
 *   2. Derive AES-256 key via PBKDF2(SHA-256, 200k iterations) over the
 *      passphrase + salt.
 *   3. Decrypt with AES-GCM(key, iv). On failure (wrong passphrase),
 *      `crypto.subtle.decrypt` throws — caller renders the shake.
 *   4. Cache the *derived key* in sessionStorage for the tab's lifetime
 *      so soft-reloads don't re-prompt.
 *
 * No new deps — `crypto.subtle` is native.
 */

const PBKDF2_ITERATIONS = 200_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const KEY_BYTES = 32;
const SESSION_KEY = 'themis:k';

export interface EncryptedBlob {
  v: 1;
  salt: string;
  iv: string;
  ct: string;
}

/**
 * Allocate a Uint8Array backed by a fresh ArrayBuffer. TypeScript 5.7+
 * is strict about `Uint8Array<ArrayBuffer>` vs `Uint8Array<ArrayBufferLike>`
 * — `crypto.subtle` insists on the former. Constructing via
 * `new Uint8Array(N)` widens to `ArrayBufferLike`, so we go through the
 * explicit `new ArrayBuffer(N)` path.
 */
function alloc(size: number): Uint8Array<ArrayBuffer> {
  return new Uint8Array(new ArrayBuffer(size));
}

function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const out = alloc(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_BYTES * 8 },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptJson(passphrase: string, data: unknown): Promise<EncryptedBlob> {
  const salt = alloc(SALT_BYTES);
  crypto.getRandomValues(salt);
  const iv = alloc(IV_BYTES);
  crypto.getRandomValues(iv);
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const ctBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(data)),
  );
  return { v: 1, salt: toB64(salt), iv: toB64(iv), ct: toB64(ctBuf) };
}

export async function decryptBlob<T = unknown>(
  passphrase: string,
  blob: EncryptedBlob,
): Promise<T> {
  if (blob.v !== 1) throw new Error('themis:unsupported-blob-version');
  const salt = fromB64(blob.salt);
  const iv = fromB64(blob.iv);
  const ct = fromB64(blob.ct);
  const key = await deriveKey(passphrase, salt);
  const ptBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  const dec = new TextDecoder();
  return JSON.parse(dec.decode(ptBuf)) as T;
}

/** Cache the derived key for the tab's lifetime. Wrong passphrase → throws. */
export async function unlockAndCache<T = unknown>(
  passphrase: string,
  blob: EncryptedBlob,
): Promise<T> {
  const data = await decryptBlob<T>(passphrase, blob);
  try {
    sessionStorage.setItem(SESSION_KEY, passphrase);
  } catch {
    /* private mode / blocked storage — fall through, just won't auto-unlock on reload */
  }
  return data;
}

export function getCachedPassphrase(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function clearCachedPassphrase(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}
