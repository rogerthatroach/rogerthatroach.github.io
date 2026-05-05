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
        {/* Owl + offset echo — a faint static copy in the geometric
            middle, with the focal owl drifted slightly to the side and
            carrying the breath. Twin Peaks doppelganger framing. */}
        <div className="relative h-[100px] w-[120px]">
          {/* Ghost — centered, static, faint */}
          <span
            aria-hidden="true"
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--themis-primary)',
              opacity: 0.22,
            }}
          >
            <OwlGlyph size={88} />
          </span>
          {/* Focal — offset right, breathes */}
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
                  : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <OwlGlyph size={88} />
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
 * BackgroundCircles — faint, deterministic, rounded shapes scattered
 * across the lock screen veil. No animation; the eye treats these as
 * texture, not motion. Layered behind everything (z-0, pointer-events
 * none). Uses --themis-primary so they pick up the active theme.
 *
 * Density tuning: 24 circles, radius 4–28px, opacity 0.03–0.09. Seeded
 * via mulberry32 so positions are stable across renders + reloads.
 */
function BackgroundCircles() {
  const circles = useMemo(() => {
    const rng = mulberry32(hashSeed('white-lodge-circles-v1'));
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      cx: rng() * 100, // viewport %
      cy: rng() * 100,
      r: 4 + rng() * 24, // px
      opacity: 0.03 + rng() * 0.06,
    }));
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      style={{ color: 'var(--themis-primary)' }}
    >
      {circles.map((c) => (
        <circle
          key={c.id}
          cx={`${c.cx}%`}
          cy={`${c.cy}%`}
          r={c.r}
          fill="currentColor"
          opacity={c.opacity}
        />
      ))}
    </svg>
  );
}
