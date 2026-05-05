'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { decryptBlob, type EncryptedBlob } from '../_lib/crypto';
import type { ThemisSeed } from '@/data/themis/types';
import GlassCard from './GlassCard';

interface LockScreenProps {
  onUnlock: (seed: ThemisSeed, passphrase: string) => void;
  /** Pre-fetched ciphertext blob, if available. */
  blob: EncryptedBlob | null;
  blobError: string | null;
  /** Optional initial passphrase (from sessionStorage) — auto-tried on mount. */
  cachedPassphrase: string | null;
}

export default function LockScreen({ onUnlock, blob, blobError, cachedPassphrase }: LockScreenProps) {
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [errorHint, setErrorHint] = useState<string | null>(null);
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

  // Focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!blob || busy || !pass) return;
    setBusy(true);
    setErrorHint(null);
    try {
      const seed = await decryptBlob<ThemisSeed>(pass, blob);
      onUnlock(seed, pass);
    } catch {
      setBusy(false);
      setShaking(true);
      setErrorHint('Passphrase incorrect.');
      setTimeout(() => setShaking(false), 500);
      inputRef.current?.select();
    }
  };

  return (
    <div className="themis-vignette relative flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md"
      >
        <GlassCard className={shaking ? 'themis-shake p-8' : 'p-8'}>
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)]">
              <Lock size={20} style={{ color: 'var(--themis-primary)' }} aria-hidden="true" />
            </div>
          </div>
          <div className="mb-7 text-center">
            <h1 className="font-display text-3xl font-medium tracking-tight text-text-primary">
              Themis
            </h1>
            <p className="mt-1.5 text-sm text-text-tertiary">Approvals, observed.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Passphrase
              </span>
              <input
                ref={inputRef}
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  if (errorHint) setErrorHint(null);
                }}
                disabled={busy || !blob}
                className="w-full rounded-lg border border-border-subtle bg-surface/60 px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-[var(--themis-primary)] focus:ring-2 focus:ring-[var(--themis-primary)]/30 disabled:opacity-60"
                placeholder="••••••••••"
                aria-invalid={Boolean(errorHint)}
                aria-describedby={errorHint ? 'themis-pass-error' : undefined}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !blob || !pass}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                background: 'var(--themis-primary)',
                color: 'var(--color-bg)',
              }}
            >
              {busy ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  <span>Unlocking…</span>
                </>
              ) : (
                <span>Unlock</span>
              )}
            </button>
            <div className="min-h-[20px] text-center text-[12px]" aria-live="polite">
              {errorHint && (
                <span id="themis-pass-error" style={{ color: 'var(--themis-rejected)' }}>
                  {errorHint}
                </span>
              )}
              {!errorHint && blobError && (
                <span className="text-text-tertiary">
                  Couldn&apos;t load encrypted bundle: {blobError}
                </span>
              )}
              {!errorHint && !blobError && !blob && (
                <span className="text-text-tertiary">Fetching…</span>
              )}
            </div>
          </form>
          <p className="mt-6 border-t border-border-subtle pt-4 text-center font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Concept · Phase 2 prototype
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
