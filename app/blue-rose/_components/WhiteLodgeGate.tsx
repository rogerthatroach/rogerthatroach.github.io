'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import {
  clearCachedPassphrase,
  getCachedPassphrase,
  type EncryptedBlob,
} from '../_lib/crypto';
import type { ThemisSeed } from '@/data/themis/types';
import { ThemisProvider } from '../_lib/store';
import LockScreen from './LockScreen';
import WhiteLodgeLayout from './WhiteLodgeLayout';

const LOCK_ROOT = '/blue-rose';
const HOME_ROUTE = '/blue-rose/home';

/**
 * WhiteLodgeGate — wraps every /blue-rose/* route via app/blue-rose/layout.tsx.
 *
 * Responsibilities (subsumes the prior ThemisRoot.tsx):
 *   1. Fetch the AES-GCM ciphertext at /blue-rose/data.enc.json once.
 *   2. Try to auto-unlock with the sessionStorage-cached passphrase.
 *   3. While locked, render <LockScreen> — regardless of which subroute
 *      the user landed on. After successful unlock, redirect to /home
 *      if they were on the lock root.
 *   4. While unlocked, mount <ThemisProvider> + <WhiteLodgeLayout> with
 *      the active page (children) inside.
 *
 * MotionConfig with reducedMotion="user" wraps the entire subtree so
 * OS reduced-motion preference flows through every component.
 */
export default function WhiteLodgeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [blob, setBlob] = useState<EncryptedBlob | null>(null);
  const [blobError, setBlobError] = useState<string | null>(null);
  const [seed, setSeed] = useState<ThemisSeed | null>(null);
  const [cachedPassphrase] = useState<string | null>(() =>
    typeof window !== 'undefined' ? getCachedPassphrase() : null,
  );

  const isLockRoot = pathname === LOCK_ROOT;

  useEffect(() => {
    let alive = true;
    fetch('/blue-rose/data.enc.json', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as EncryptedBlob;
      })
      .then((b) => {
        if (alive) setBlob(b);
      })
      .catch((err) => {
        if (alive) setBlobError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (seed && isLockRoot) {
      router.replace(HOME_ROUTE);
    }
  }, [seed, isLockRoot, router]);

  const onUnlock = useCallback((decrypted: ThemisSeed) => {
    setSeed(decrypted);
  }, []);

  const onLock = useCallback(() => {
    clearCachedPassphrase();
    setSeed(null);
    if (!isLockRoot) router.replace(LOCK_ROOT);
  }, [router, isLockRoot]);

  return (
    <MotionConfig reducedMotion="user">
      {!seed ? (
        <LockScreen
          onUnlock={onUnlock}
          blob={blob}
          blobError={blobError}
          cachedPassphrase={cachedPassphrase}
        />
      ) : (
        <ThemisProvider seed={seed}>
          <WhiteLodgeLayout onLock={onLock}>{children}</WhiteLodgeLayout>
        </ThemisProvider>
      )}
    </MotionConfig>
  );
}
