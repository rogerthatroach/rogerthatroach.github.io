'use client';

import { ArrowRight, FileBadge, Linkedin } from 'lucide-react';
import type { Theme } from '@/data/themes';
import { themeStyle } from '@/data/themes';
import { paletteStyle } from '@/lib/palette';

/**
 * Renders a compact hero + card + typography + palette preview inside a
 * scoped theme wrapper. The wrapper sets the 10 site-level CSS vars,
 * so descendants pick up the theme's values via var(--color-*) without
 * mutating :root. Nav/Footer outside this wrapper stay on site default.
 */
export default function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      data-theme={theme.id}
      data-mode={theme.base}
      style={themeStyle(theme)}
      className="rounded-2xl border p-6 md:p-8"
    >
      {/* Header: theme identity */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
           style={{ borderColor: theme.tokens.border }}>
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight"
              style={{ color: theme.tokens.textPrimary }}>
            {theme.name}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: theme.tokens.textTertiary }}>
            {theme.subtitle}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: theme.tokens.accent }}>
          {theme.base} · {theme.id}
        </span>
      </div>

      {/* Mini hero */}
      <div className="mb-6">
        <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.18em]"
           style={{ color: theme.tokens.accent }}>
          <span className="mr-2" style={{ color: theme.tokens.textTertiary }}>§</span>
          AI &amp; Data Science Lead
        </p>
        <h4 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl"
            style={{ color: theme.tokens.textPrimary }}>
          Harmilap Singh Dhaliwal
        </h4>
        <p className="mt-2 max-w-xl text-sm leading-relaxed md:text-base"
           style={{ color: theme.tokens.textSecondary }}>
          Architecting agentic AI for RBC CFO Group — the bank&rsquo;s largest function.
        </p>

        {/* CTAs */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                style={{
                  borderColor: theme.tokens.accent + '55',
                  backgroundColor: theme.tokens.accentMuted,
                  color: theme.tokens.accent,
                }}>
            Read case studies
            <ArrowRight size={14} aria-hidden="true" />
          </span>
          <span className="group inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
                style={{
                  borderColor: theme.tokens.border,
                  backgroundColor: theme.tokens.surface,
                  color: theme.tokens.textPrimary,
                }}>
            <FileBadge size={14} aria-hidden="true" style={{ color: theme.tokens.textTertiary }} />
            Contact / CV
          </span>
        </div>
      </div>

      {/* Era palette row */}
      <div className="mb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest"
           style={{ color: theme.tokens.textTertiary }}>
          Era palette
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(theme.eras) as [keyof Theme['eras'], Theme['eras'][keyof Theme['eras']]][]).map(
            ([era, palette]) => (
              <span
                key={era}
                style={{
                  ...paletteStyle(palette),
                  backgroundColor: `${theme.base === 'light' ? palette.primaryLight : palette.primary}15`,
                  borderColor: `${theme.base === 'light' ? palette.primaryLight : palette.primary}40`,
                  color: theme.base === 'light' ? palette.primaryLight : palette.primary,
                }}
                className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
              >
                {era}
              </span>
            )
          )}
        </div>
      </div>

      {/* Typography ladder */}
      <div className="mb-6 space-y-1.5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest"
           style={{ color: theme.tokens.textTertiary }}>
          Typography
        </p>
        <p className="text-base font-semibold" style={{ color: theme.tokens.textPrimary }}>
          Primary — Inter 16 semibold. Workhorse body text.
        </p>
        <p className="text-sm" style={{ color: theme.tokens.textSecondary }}>
          Secondary — Inter 14 regular. Body prose, long-form reading.
        </p>
        <p className="text-xs" style={{ color: theme.tokens.textTertiary }}>
          Tertiary — Inter 12 regular. Metadata, captions, timestamps.
        </p>
        <p className="font-mono text-xs"
           style={{ color: theme.base === 'light' ? theme.tokens.textSecondary : theme.tokens.textTertiary }}>
          Mono — JetBrains 12. Code, metric values, keyboard shortcuts.
        </p>
      </div>

      {/* Surface + border swatches */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['bg', theme.tokens.bg],
          ['surface', theme.tokens.surface],
          ['surface-hover', theme.tokens.surfaceHover],
          ['accent-muted', theme.tokens.accentMuted],
        ].map(([label, val]) => (
          <div
            key={label}
            className="rounded-md border p-3"
            style={{ backgroundColor: val, borderColor: theme.tokens.border }}
          >
            <p className="font-mono text-[9px] uppercase tracking-wider"
               style={{ color: theme.tokens.textTertiary }}>
              {label}
            </p>
            <p className="font-mono text-[10px]" style={{ color: theme.tokens.textSecondary }}>
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* Origin / character note */}
      <div className="rounded-lg border p-4"
           style={{ borderColor: theme.tokens.border, backgroundColor: theme.tokens.surface }}>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest"
           style={{ color: theme.tokens.accent }}>
          Origin
        </p>
        <p className="text-xs leading-relaxed" style={{ color: theme.tokens.textSecondary }}>
          {theme.origin}
        </p>
      </div>
    </div>
  );
}
