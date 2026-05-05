'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RingClusterProps {
  total: number;
  filled: number;
  /** Optional emphasis mode — when true, fills get the amethyst glow. */
  current?: boolean;
  size?: number;
  className?: string;
}

/**
 * RingCluster — concentric-ring-inspired progress indicator.
 *
 * Replaces the colored pill with a row of small dots/rings:
 *   - filled  → solid amethyst dot
 *   - pending → faint open ring
 *
 * Visual lineage: the lock screen's eight concentric rings + the
 * offset-echo owls. A status indicator that whispers instead of shouts.
 *
 * Up to ~8 dots cleanly; beyond that the row compresses tighter.
 */
export default function RingCluster({
  total,
  filled,
  current = false,
  size = 6,
  className,
}: RingClusterProps) {
  const safeTotal = Math.max(total, 1);
  const safeFilled = Math.max(0, Math.min(filled, safeTotal));
  const fillColor = current ? 'var(--themis-primary)' : 'var(--themis-secondary)';
  const ringColor = 'var(--text-tertiary)';

  return (
    <span
      className={cn('inline-flex items-center gap-[3px]', className)}
      role="img"
      aria-label={`${safeFilled} of ${safeTotal} fields complete`}
    >
      {Array.from({ length: safeTotal }, (_, i) => {
        const isFilled = i < safeFilled;
        return (
          <motion.span
            key={i}
            layout
            initial={false}
            animate={{
              scale: isFilled ? 1 : 0.85,
              opacity: isFilled ? 1 : 0.55,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="block rounded-full"
            style={{
              width: size,
              height: size,
              background: isFilled ? fillColor : 'transparent',
              boxShadow: isFilled
                ? `0 0 0 1px ${fillColor}`
                : `0 0 0 1px ${ringColor}`,
            }}
          />
        );
      })}
    </span>
  );
}
