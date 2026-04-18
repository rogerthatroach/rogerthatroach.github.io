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
    '--p-bg-d': `${p.primary}15`,
    '--p-bg-l': `${p.primaryLight}15`,
    '--p-border-d': `${p.primary}30`,
    '--p-border-l': `${p.primaryLight}30`,
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
