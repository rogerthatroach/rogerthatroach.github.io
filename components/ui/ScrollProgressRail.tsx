'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Reading-progress rail — a 2px accent line pinned to the top edge that fills
 * left→right as the page scrolls. Compositor-only (scaleX transform), so it
 * never touches the main thread or causes layout. Decorative (the scrollbar
 * already conveys position) → aria-hidden + pointer-events-none.
 *
 * Mounted on long-form pages only (case studies + blog/paper posts), where a
 * progress cue is meaningful.
 */
export default function ScrollProgressRail() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Spring smooths the fill on normal scroll; reduced-motion binds straight to
  // the raw progress (still tracks, no easing lag).
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const scaleX = reduce ? scrollYProgress : smooth;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
    />
  );
}
