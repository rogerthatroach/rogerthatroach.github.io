'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sha256Hex, PORTFOLIO_PASSPHRASE_HASH } from '@/lib/portfolio-gate';
import { cn } from '@/lib/utils';

interface PortfolioLockScreenProps {
  onUnlock: () => void;
}

/**
 * PortfolioLockScreen — gates the portfolio behind a passphrase.
 *
 * Restrained mystique: the portfolio is invited-audience-only, so the
 * lock reads less mystical than the White Lodge gate at /blue-rose
 * (which is its own deeper layer). Wabi-sabi palette, minimal underline
 * input, single italic line of welcome.
 *
 * No labels, no buttons (Enter submits), no error text on wrong
 * passphrase — the shake is the failure signal. Same rule that governs
 * the White Lodge gate: the lock screen is the only playful budget;
 * everywhere else holds back.
 */
export default function PortfolioLockScreen({ onUnlock }: PortfolioLockScreenProps) {
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !pass) return;
    setBusy(true);
    try {
      const hash = await sha256Hex(pass);
      if (hash === PORTFOLIO_PASSPHRASE_HASH) {
        onUnlock();
        return;
      }
    } catch {
      /* fall through to fail path */
    }
    setBusy(false);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    inputRef.current?.select();
  };

  return (
    <div className="portfolio-lock-veil relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'relative z-10 flex w-full max-w-[320px] flex-col items-center gap-7',
          shaking && 'portfolio-lock-shake',
        )}
      >
        {/* Monogram / wordmark */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Portfolio
          </p>
          <h1 className="font-display text-[22px] font-medium leading-tight tracking-tight text-text-primary">
            Harmilap Singh Dhaliwal
          </h1>
        </div>

        {/* Passphrase input — minimal underline */}
        <form onSubmit={submit} className="w-full">
          <input
            ref={inputRef}
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={busy}
            placeholder="········"
            aria-label="Passphrase"
            className="portfolio-lock-input"
          />
        </form>

        {/* Italic ceremonial line */}
        <p className="font-display text-[12px] italic tracking-widest text-text-tertiary">
          An invited audience.
        </p>

        {/* Quiet status when busy — no wrong-passphrase text */}
        <div
          className="min-h-[14px] text-center font-mono text-[9px] uppercase tracking-[0.3em]"
          aria-live="polite"
        >
          {busy && (
            <span className="text-accent opacity-80">◌ ◌ ◌</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
