'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { decryptBlob, type EncryptedBlob } from '../_lib/crypto';
import type { ThemisSeed } from '@/data/themis/types';
import OwlGlyph from './OwlGlyph';
import { hashSeed, mulberry32 } from '../_lib/prng';
import { cn } from '@/lib/utils';

interface LockScreenProps {
  onUnlock: (seed: ThemisSeed, passphrase: string) => void;
  blob: EncryptedBlob | null;
  blobError: string | null;
  cachedPassphrase: string | null;
}

/**
 * LockScreen — threshold to the White Lodge.
 *
 * Designed for *cryptic, mysterious, powerful, simple* (per user direction).
 * Visual vocabulary, in order down the page:
 *
 *   1. Pulsing amethyst halo — slow 4.2s breath behind the owl
 *   2. Owl glyph — large (84px), unframed, the single symbol that carries
 *      the brand. Subtly scales with the halo so they feel like one being.
 *   3. Wordmark — "WHITE LODGE" in display serif, generous letter-spacing,
 *      uppercase. Ceremonial register.
 *   4. Underline-only passphrase input — no label, no border-box, no
 *      submit button. Enter triggers unlock.
 *   5. Italic ceremonial line — "Spoken to Diane." — Cooper's tape-recorder
 *      framing. Twin Peaks fans recognize; non-fans read as atmospheric.
 *
 * No "PASSPHRASE" label. No "Unlock" button. No "Concept · Phase 2"
 * footer. No "Passphrase incorrect" error text — the shake alone is
 * the failure signal. The lock screen is the prototype's entire
 * playful budget; everything else holds back.
 */
export default function LockScreen({ onUnlock, blob, blobError, cachedPassphrase }: LockScreenProps) {
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const [autoTried, setAutoTried] = useState(false);

  // Auto-attempt with cached passphrase once the blob arrives
  useEffect(() => {
    if (autoTried || !blob || !cachedPassphrase) return;
    setAutoTried(true);
    setBusy(true);
    decryptBlob<ThemisSeed>(cachedPassphrase, blob)
      .then((seed) => onUnlock(seed, cachedPassphrase))
      .catch(() => setBusy(false));
  }, [autoTried, blob, cachedPassphrase, onUnlock]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!blob || busy || !pass) return;
    setBusy(true);
    try {
      const seed = await decryptBlob<ThemisSeed>(pass, blob);
      onUnlock(seed, pass);
    } catch {
      setBusy(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      inputRef.current?.select();
    }
  };

  return (
    <div className="themis-lock-veil relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Faint subtle rounded circles scattered across the background. */}
      <BackgroundCircles />
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'relative z-10 flex w-full max-w-[280px] flex-col items-center gap-8',
          shaking && 'themis-shake',
        )}
      >
        {/* Owl pair — focal offset right of center, faint ghost in the
            geometric middle. Opposing breath: as the focal grows the
            ghost diminishes, and vice versa. Same 4.2s tempo, inverted
            scale + opacity. */}
        <div className="relative h-[100px] w-[120px]">
          {/* Ghost — centered, very faint, breathes inversely */}
          <motion.span
            aria-hidden="true"
            className="absolute block"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--themis-primary)',
              opacity: 0.14,
            }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 0.14 }
                : { scale: [1, 0.97, 1], opacity: [0.14, 0.08, 0.14] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <OwlGlyph size={96} />
          </motion.span>
          {/* Focal — offset right, grows as ghost diminishes */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: 'calc(50% + 22px)',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.span
              className="block"
              style={{ color: 'var(--themis-primary)' }}
              animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.025, 1] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <OwlGlyph size={96} />
            </motion.span>
          </div>
        </div>

        {/* Wordmark — ceremonial */}
        <h1
          className="font-display text-[22px] font-medium uppercase tracking-[0.32em] text-text-primary"
          aria-label="White Lodge"
        >
          White&nbsp;Lodge
        </h1>

        {/* Minimal underline input */}
        <form onSubmit={submit} className="w-full">
          <input
            ref={inputRef}
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={busy || !blob}
            placeholder="········"
            aria-label="Passphrase"
            className="themis-lock-input"
          />
        </form>

        {/* Italic ceremonial line */}
        <p className="font-display text-[12px] italic tracking-widest text-text-tertiary">
          Spoken to Diane.
        </p>

        {/* Quiet status feedback — no wrong-passphrase text (shake = failure) */}
        <div
          className="min-h-[14px] text-center font-mono text-[9px] uppercase tracking-[0.3em]"
          aria-live="polite"
        >
          {blobError ? (
            <span className="text-text-tertiary opacity-70">— bundle unreachable —</span>
          ) : !blob ? (
            <span className="text-text-tertiary opacity-50">…</span>
          ) : busy ? (
            <span style={{ color: 'var(--themis-primary)' }} className="opacity-80">
              ◌ ◌ ◌
            </span>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * BackgroundCircles — concentric rings emanating from the geometric
 * center, very faint. "Almost there and almost not there." The eye reads
 * them as atmosphere — a frozen ripple — not as a foreground element.
 *
 * Static. Stroke only, no fill. Pixel radii so each ring renders as a
 * true circle regardless of viewport aspect ratio. cx/cy at 50% of the
 * viewport so rings always center perfectly.
 *
 * Opacity 0.020–0.045 — barely registering. Some rings extend well past
 * the viewport edges; that's intentional (the rings should feel like
 * they continue beyond what's visible).
 */
function BackgroundCircles() {
  const rings = useMemo(() => {
    const rng = mulberry32(hashSeed('white-lodge-rings-v1'));
    // Eight concentric rings with organic spacing — each step a bit
    // larger than the last, with small jitter so the spacing doesn't
    // read as mechanical.
    const radii = [70, 130, 200, 290, 400, 540, 720, 940];
    return radii.map((base, i) => ({
      id: i,
      radius: base + (rng() - 0.5) * 24,
      strokeWidth: 0.45 + rng() * 0.4,
      opacity: 0.020 + rng() * 0.025,
    }));
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ color: 'var(--themis-primary)' }}
    >
      {rings.map((r) => (
        <circle
          key={r.id}
          cx="50%"
          cy="50%"
          r={r.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={r.strokeWidth}
          opacity={r.opacity}
        />
      ))}
    </svg>
  );
}
