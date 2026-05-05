import type { Metadata } from 'next';
import './_styles/themis.css';

export const metadata: Metadata = {
  title: 'Bookhouse',
  description: 'Concept — Phase 2 prototype.',
  robots: { index: false, follow: false },
};

/**
 * Themis route layout. Scopes Themis-native CSS tokens to this subtree
 * via [data-themis="true"]. The portfolio's global Nav/Footer aren't
 * imported anywhere on this route, so the shell renders full-bleed.
 */
export default function ThemisLayout({ children }: { children: React.ReactNode }) {
  return <div data-themis="true">{children}</div>;
}
