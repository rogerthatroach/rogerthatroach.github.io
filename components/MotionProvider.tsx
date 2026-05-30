'use client';

import { MotionConfig } from 'framer-motion';

// Wraps the whole app so every Framer Motion animation honors the OS
// prefers-reduced-motion setting. The global CSS reduced-motion reset
// (globals.css) only zeroes CSS animations/transitions; it cannot stop
// Framer's JS-driven inline opacity/transform (requestAnimationFrame)
// styles. reducedMotion="user" makes all motion components respect the
// setting site-wide without per-component edits.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
