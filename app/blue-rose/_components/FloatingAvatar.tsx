'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { hashSeed, mulberry32 } from '../_lib/prng';
import { cn } from '@/lib/utils';

/**
 * FloatingAvatar — generative gradient-blob avatar.
 *
 * Three overlapping ellipses with rotated gradients, deterministically
 * positioned + colored from the seed. Wrapped in a subtle Y-axis float
 * (4-6px, 3.6s ease loop). No external dep — small SVG, drawn inline.
 *
 * Looks like the boring-avatars "marble" style without the dep cost.
 */

const PALETTE = [
  ['#b9a8d6', '#7e6aa8'], // amethyst
  ['#9bc4ad', '#5d8870'], // sage
  ['#d4a574', '#a8784a'], // amber
  ['#d49aa3', '#a85d6a'], // rose
  ['#9aabbf', '#5f7184'], // slate
  ['#7fc6cc', '#3d7d83'], // teal
  ['#e8b96b', '#b58740'], // honey
  ['#c4a8e0', '#8a6db5'], // lavender
];

export interface FloatingAvatarProps {
  seed: string;
  size?: number;
  /** Color of the ring around the avatar (e.g. persona accent). */
  ringColor?: string;
  /** Render an "online" presence dot at bottom-right. */
  presence?: boolean;
  /** Disable the float (useful in dense lists). */
  static?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function FloatingAvatar({
  seed,
  size = 36,
  ringColor,
  presence = false,
  static: isStatic = false,
  className,
  ariaLabel,
}: FloatingAvatarProps) {
  const reduceMotion = useReducedMotion();

  const blobs = useMemo(() => {
    const rng = mulberry32(hashSeed(seed));
    const colorIdx = Math.floor(rng() * PALETTE.length);
    const [light, dark] = PALETTE[colorIdx];
    return [
      { cx: 30 + rng() * 12, cy: 30 + rng() * 12, rx: 28 + rng() * 8, ry: 28 + rng() * 8, fill: dark, rot: rng() * 360 },
      { cx: 50 + rng() * 14, cy: 36 + rng() * 16, rx: 22 + rng() * 10, ry: 24 + rng() * 10, fill: light, rot: rng() * 360 },
      { cx: 36 + rng() * 18, cy: 56 + rng() * 12, rx: 20 + rng() * 8, ry: 18 + rng() * 8, fill: light, rot: rng() * 360 },
    ];
  }, [seed]);

  const floatAmount = useMemo(() => {
    const rng = mulberry32(hashSeed(seed) ^ 0xa5a5a5a5);
    return 4 + rng() * 2;
  }, [seed]);
  const floatDuration = useMemo(() => 3.4 + (mulberry32(hashSeed(seed) ^ 0x5a5a5a5a)() * 0.8), [seed]);

  const dotSize = Math.max(8, Math.round(size * 0.22));

  return (
    <motion.span
      className={cn('relative inline-flex shrink-0', className)}
      style={{ width: size, height: size }}
      aria-label={ariaLabel ?? `Avatar for ${seed}`}
      role="img"
      animate={
        reduceMotion || isStatic
          ? { y: 0 }
          : { y: [0, -floatAmount, 0] }
      }
      transition={
        reduceMotion || isStatic
          ? { duration: 0 }
          : { duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        aria-hidden="true"
        className="overflow-hidden rounded-full"
        style={
          ringColor
            ? { boxShadow: `0 0 0 2px ${ringColor}, 0 0 0 3px var(--color-bg)` }
            : undefined
        }
      >
        <rect width="80" height="80" fill="var(--color-surface)" />
        {blobs.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={b.fill}
            opacity={0.85}
            transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
          />
        ))}
      </svg>
      {presence && (
        <span
          className="absolute right-0 bottom-0 rounded-full ring-2 ring-[var(--color-bg)]"
          style={{
            width: dotSize,
            height: dotSize,
            background: 'var(--themis-approved, #5d8870)',
          }}
          aria-label="online"
        />
      )}
    </motion.span>
  );
}
