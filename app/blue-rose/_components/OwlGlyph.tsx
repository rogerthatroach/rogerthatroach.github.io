'use client';

import { cn } from '@/lib/utils';

interface OwlGlyphProps {
  size?: number;
  className?: string;
  /** Color used for the eyes/pupils' negative space (defaults to page bg). */
  pupilColor?: string;
}

/**
 * Bookhouse owl glyph — stylized geometric owl head.
 *
 *   - Soft rounded shield outer (head/body silhouette)
 *   - Two prominent eyes with bg-colored pupils for the "watcher" feel
 *   - Faint ear tufts + beak indication
 *
 * Uses `currentColor` for all the colored geometry so the owl picks up
 * its surrounding text/accent color naturally. Pupils use `var(--color-bg)`
 * (or override) so the eyes remain crisp circles regardless of the
 * containing surface's background.
 *
 * Lore: in Twin Peaks, "the owls are not what they seem" — a watcher
 * motif that maps neatly to an approvals / oversight product.
 */
export default function OwlGlyph({ size = 24, className, pupilColor }: OwlGlyphProps) {
  const pupil = pupilColor ?? 'var(--color-bg)';
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* Soft rounded shield — head/body silhouette */}
      <path
        d="M16 2.5 C8 2.5 4.8 8.4 4.8 15.5 C4.8 22 9 27.5 16 28.8 C23 27.5 27.2 22 27.2 15.5 C27.2 8.4 24 2.5 16 2.5 Z"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      {/* Ear tufts */}
      <path d="M8 4 L10.5 7.6 L6.5 7.5 Z" fill="currentColor" fillOpacity="0.45" />
      <path d="M24 4 L25.5 7.5 L21.5 7.6 Z" fill="currentColor" fillOpacity="0.45" />
      {/* Eye discs */}
      <circle cx="11.7" cy="13.6" r="3.8" fill="currentColor" />
      <circle cx="20.3" cy="13.6" r="3.8" fill="currentColor" />
      {/* Pupils — bg-colored so the eyes register as round, watching */}
      <circle cx="11.7" cy="13.6" r="1.5" fill={pupil} />
      <circle cx="20.3" cy="13.6" r="1.5" fill={pupil} />
      {/* Tiny highlight crescents */}
      <circle cx="12.4" cy="12.7" r="0.55" fill={pupil} opacity="0.75" />
      <circle cx="21" cy="12.7" r="0.55" fill={pupil} opacity="0.75" />
      {/* Beak */}
      <path
        d="M14.4 18.5 L17.6 18.5 L16 21.2 Z"
        fill="currentColor"
        fillOpacity="0.65"
      />
      {/* Subtle chest hint — two small feather strokes */}
      <path
        d="M12 23.5 Q16 25.6 20 23.5"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
