/**
 * Portfolio gate — shared constants + helpers.
 *
 * The portfolio sits behind a client-side passphrase gate so casual
 * visitors can't browse without an invite. The gate is theatre-grade,
 * not real security: the static content ships to the browser anyway,
 * so anyone willing to inspect the network tab or run `curl` can read
 * the source. The gate exists to keep the portfolio out of casual
 * social-share traffic and search-engine indexing.
 *
 * Two layers of gating in this site:
 *   1. Portfolio gate (this file) — wraps the whole site EXCEPT
 *      /blue-rose, which has its own AES-GCM unlock for the seeded
 *      prototype data.
 *   2. White Lodge gate at /blue-rose — see app/blue-rose/_lib/crypto.ts
 *      The two passphrases are independent.
 *
 * To rotate the portfolio passphrase:
 *   1. Compute SHA-256 hex of the new passphrase:
 *        echo -n "your new passphrase" | shasum -a 256
 *   2. Replace PORTFOLIO_PASSPHRASE_HASH below.
 *   3. Distribute the new passphrase out-of-band.
 */

/** SHA-256 hex of the current portfolio passphrase. */
export const PORTFOLIO_PASSPHRASE_HASH =
  '5d489a7ad01216f66109c7df91d84978a67c3b0be12434f0c4338f5dc9d16471';
// Default passphrase: "milap-portfolio"

export const PORTFOLIO_GATE_SESSION_KEY = 'portfolio:gate:v1';

/** SHA-256 hex of `input`. Uses `crypto.subtle` (browser-native). */
export async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}
