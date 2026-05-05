'use client';

import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import {
  clearCachedPassphrase,
  getCachedPassphrase,
  type EncryptedBlob,
} from '../_lib/crypto';
import type { ThemisSeed } from '@/data/themis/types';
import { ThemisProvider } from '../_lib/store';
import LockScreen from './LockScreen';
import Shell from './Shell';

/**
 * ThemisRoot — orchestrates the gate.
 *
 *   1. On mount, fetch the encrypted bundle from /blue-rose/data.enc.json.
 *   2. Try the cached sessionStorage passphrase (silent re-unlock).
 *   3. Otherwise render LockScreen and wait for user input.
 *   4. On successful decrypt, mount ThemisProvider with the seed and the
 *      shell renders.
 *
 * The "Lock" button in the shell clears sessionStorage and resets state.
 */
export default function ThemisRoot() {
  const [blob, setBlob] = useState<EncryptedBlob | null>(null);
  const [blobError, setBlobError] = useState<string | null>(null);
  const [seed, setSeed] = useState<ThemisSeed | null>(null);
  const [cachedPassphrase] = useState<string | null>(() =>
    typeof window !== 'undefined' ? getCachedPassphrase() : null,
  );

  // Fetch ciphertext once
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

  const onUnlock = useCallback((decrypted: ThemisSeed, _passphrase: string) => {
    setSeed(decrypted);
  }, []);

  const onLock = useCallback(() => {
    clearCachedPassphrase();
    setSeed(null);
  }, []);

  // MotionConfig with reducedMotion="user" honors the OS preference for the
  // entire Themis subtree — animations become instant rather than softer.
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
          <Shell onLock={onLock} />
        </ThemisProvider>
      )}
    </MotionConfig>
  );
}
