/**
 * mulberry32 — small, fast, deterministic 32-bit PRNG.
 *
 * Used to jitter simulated reactivity offsets so identical inputs always
 * produce identical sequences (replays match) but each event lands with
 * micro-variance instead of feeling robotic.
 *
 * Reference: https://gist.github.com/tommyettinger/46a3b48c1b6c0c1e6edd
 */
export function mulberry32(seed: number) {
  let a = seed | 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash a string to a 32-bit seed (cyrb53-lite). Good enough for jitter,
 * not for cryptography.
 */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Jittered offset around a base ms, scaled by jitterFraction (default 0.25). */
export function jittered(baseMs: number, seed: string, jitterFraction = 0.25): number {
  const rng = mulberry32(hashSeed(seed));
  const r = rng() * 2 - 1;
  return Math.round(baseMs * (1 + r * jitterFraction));
}
