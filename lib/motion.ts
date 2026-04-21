/**
 * Shared Framer Motion variants.
 *
 * Variants here are reused across multiple components so entrance rhythms
 * stay consistent. Each variant respects `prefers-reduced-motion` via the
 * hook approach: components wrap with `useReducedMotion()` where relevant.
 */

import type { Variants } from 'framer-motion';

/**
 * blurIn — soft, confident-restraint entrance. Used by disclosure reveals
 * in the /resume expanded SkillTimeline and by scrollytelling chapter
 * reveals in /resume/arc.
 *
 * Spring physics (stiffness 200, damping 25) lands with natural settle
 * rather than a linear ease. Blur phase-out is the distinctive signal;
 * the opacity+y handles the standard fade-up.
 */
export const blurIn: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
};

/**
 * fadeUp — basic stagger-friendly entrance. Use when blurIn would be
 * too heavy (e.g., dense lists).
 */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/**
 * staggerChildren — apply to a parent to cascade child blurIn/fadeUp.
 * Usage: <motion.div variants={staggerContainer} initial="initial" animate="animate">
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
