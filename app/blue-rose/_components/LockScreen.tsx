'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { decryptBlob, type EncryptedBlob } from '../_lib/crypto';
import type { ThemisSeed } from '@/data/themis/types';
import OwlGlyph from './OwlGlyph';
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
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'relative z-10 flex w-full max-w-[280px] flex-col items-center gap-8',
          shaking && 'themis-shake',
        )}
      >
        {/* Pulsing halo + owl — two layered halos (outer faint, inner brighter)
            and a slightly larger owl to give the symbol more presence
            without losing the restraint of the rest of the screen. */}
        <div className="relative h-32 w-32">
          {/* Outer halo — wider, fainter */}
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, var(--themis-primary) 0%, transparent 60%)',
            }}
            animate={
              reduceMotion
                ? { opacity: 0.10 }
                : { opacity: [0.06, 0.18, 0.06] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 5.4, repeat: Infinity, ease: 'easeInOut' }
            }
          />
          {/* Inner halo — tighter, brighter */}
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, var(--themis-primary) 0%, transparent 65%)',
            }}
            animate={
              reduceMotion
                ? { opacity: 0.20 }
                : { opacity: [0.12, 0.34, 0.12] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            }
          />
          <motion.span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              color: 'var(--themis-primary)',
              filter: 'drop-shadow(0 0 8px rgba(126, 106, 168, 0.25))',
            }}
            animate={
              reduceMotion
                ? { scale: 1 }
                : { scale: [1, 1.03, 1] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <OwlGlyph size={100} />
          </motion.span>
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
