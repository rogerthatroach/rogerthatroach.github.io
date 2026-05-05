import type { Metadata } from 'next';
import './_styles/themis.css';
import WhiteLodgeGate from './_components/WhiteLodgeGate';

export const metadata: Metadata = {
  title: 'White Lodge',
  description: 'Concept — Phase 2 prototype.',
  robots: { index: false, follow: false },
};

/**
 * White Lodge route layout — wraps every /blue-rose/* page in:
 *   - the [data-themis="true"] CSS scope
 *   - <WhiteLodgeGate>, which handles the AES-GCM unlock orchestration
 *     and renders either LockScreen (locked) or WhiteLodgeLayout chrome
 *     + the active page (unlocked).
 *
 * The portfolio's global Nav/Footer aren't imported anywhere on this
 * route, so the chrome renders full-bleed.
 */
export default function ThemisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-themis="true">
      <WhiteLodgeGate>{children}</WhiteLodgeGate>
    </div>
  );
}
