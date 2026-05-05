'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PORTFOLIO_GATE_SESSION_KEY } from '@/lib/portfolio-gate';
import PortfolioLockScreen from './PortfolioLockScreen';

interface PortfolioGateProps {
  children: React.ReactNode;
}

/**
 * PortfolioGate — wraps the entire portfolio behind a client-side
 * passphrase gate, except for the /blue-rose subroute which has its
 * own AES-GCM gate (the White Lodge). Two independent passphrases.
 *
 *   - /blue-rose/* :  PortfolioGate pass-through (children rendered raw);
 *                     /blue-rose's own WhiteLodgeGate handles unlock.
 *   - everywhere else: PortfolioLockScreen until the user enters the
 *                     correct passphrase. Unlock cached in sessionStorage
 *                     so closing the tab re-prompts.
 *
 * `mounted` gate prevents SSR hydration mismatch — the static export
 * pre-renders the portfolio HTML; the gate decision happens after
 * hydration when sessionStorage is readable.
 */
type GateState = 'pending' | 'locked' | 'unlocked';

export default function PortfolioGate({ children }: PortfolioGateProps) {
  const pathname = usePathname();
  const [gateState, setGateState] = useState<GateState>('pending');

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem(PORTFOLIO_GATE_SESSION_KEY);
      setGateState(flag === '1' ? 'unlocked' : 'locked');
    } catch {
      /* sessionStorage blocked — stay locked */
      setGateState('locked');
    }
  }, []);

  const onUnlock = useCallback(() => {
    setGateState('unlocked');
    try {
      sessionStorage.setItem(PORTFOLIO_GATE_SESSION_KEY, '1');
    } catch {
      /* noop */
    }
  }, []);

  // /blue-rose has its own AES-GCM gate — bypass the portfolio gate
  // entirely on that subroute. The WhiteLodgeGate inside takes over.
  const isBlueRose = pathname?.startsWith('/blue-rose');
  if (isBlueRose) return <>{children}</>;

  // Pre-hydration: render nothing. This keeps the static HTML output
  // clean (no portfolio content leaks via View Source or curl) and
  // prevents flicker between pending and either lock/unlock states.
  if (gateState === 'pending') {
    return <div aria-hidden="true" className="min-h-screen" />;
  }

  if (gateState === 'locked') {
    return <PortfolioLockScreen onUnlock={onUnlock} />;
  }

  return <>{children}</>;
}
