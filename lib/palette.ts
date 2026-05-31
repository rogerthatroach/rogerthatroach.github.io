import type { ProjectPalette } from '@/data/projects';
import type { Company } from '@/data/companies';

/**
 * Build the CSS variables a palette-aware class (`palette-pill`,
 * `palette-text`, `palette-border` in globals.css) reads:
 *   --p-l     light-mode text color (primaryLight)
 *   --p-d     dark-mode text color  (primary)
 *   --p-bg-l  light-mode tinted bg
 *   --p-bg-d  dark-mode tinted bg
 *   --p-border-l / --p-border-d  same for borders
 *
 * This lets both server and client components render theme-aware palette
 * styling without a runtime hook — the CSS cascade handles the theme swap.
 */
export function paletteStyle(p: Pick<ProjectPalette, 'primary' | 'primaryLight'>) {
  return {
    '--p-d': p.primary,
    '--p-l': p.primaryLight,
    // Tints via color-mix() rather than hex-alpha string concat. Opacities
    // match the prior 0x15 / 0x30 hex-alpha exactly (21/255 = 8.24%,
    // 48/255 = 18.82%), so the render is pixel-identical — just modern CSS
    // that works for named/var colors too, not only 6-digit hex.
    '--p-bg-d': `color-mix(in srgb, ${p.primary} 8.24%, transparent)`,
    '--p-bg-l': `color-mix(in srgb, ${p.primaryLight} 8.24%, transparent)`,
    '--p-border-d': `color-mix(in srgb, ${p.primary} 18.82%, transparent)`,
    '--p-border-l': `color-mix(in srgb, ${p.primaryLight} 18.82%, transparent)`,
  } as React.CSSProperties;
}

/**
 * Variant for Hero company strip. Company.accent is the brand color;
 * accentLight / accentDark are optional contrast-safe overrides per
 * mode. Falls back to accent when a variant isn't set.
 */
export function companyTextStyle(c: Pick<Company, 'accent' | 'accentLight' | 'accentDark'>) {
  return {
    '--p-l': c.accentLight ?? c.accent,
    '--p-d': c.accentDark ?? c.accent,
  } as React.CSSProperties;
}
