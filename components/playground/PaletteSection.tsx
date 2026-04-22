'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import PaletteColumn from './PaletteColumn';

export interface Palette {
  name: string;
  description: string;
  vars: Record<string, string>;
  /** The natural background of this palette ('dark' or 'light'), so the
   * toggle can display a helpful indicator. */
  base: 'dark' | 'light';
}

type Mode = 'native' | 'dark' | 'light';

/**
 * Palette comparison with a background-mode toggle.
 *
 * Native mode: each palette renders on its own background (Sakura on
 * near-black, Oxblood on bone, Algae on near-black). This is how each
 * would ship.
 *
 * Force dark / Force light: every column is rendered against the same
 * background (from the Sakura and Oxblood palettes respectively), so
 * colour choices can be compared on equal footing without the background
 * itself doing the perceptual work.
 */
export default function PaletteSection({ palettes }: { palettes: Palette[] }) {
  const [mode, setMode] = useState<Mode>('native');

  const forced = palettes.find((p) =>
    mode === 'dark' ? p.base === 'dark' : mode === 'light' ? p.base === 'light' : false,
  );

  return (
    <>
      {/* Mode toggle */}
      <div className="mb-5 inline-flex items-center gap-1 rounded-full border border-border-subtle bg-surface/40 p-1">
        {(['native', 'dark', 'light'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
              mode === m
                ? 'bg-accent text-background'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {m === 'native'
              ? 'Native bg'
              : m === 'dark'
                ? 'Force dark'
                : 'Force light'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {palettes.map((p) => {
          // In forced mode, override --color-bg (and friends) with the
          // forced palette's background set; keep accent/text from the
          // column's own palette so the colour choice is what's being
          // compared, not the bg.
          const vars =
            mode === 'native' || !forced
              ? p.vars
              : {
                  ...p.vars,
                  '--color-bg': forced.vars['--color-bg'],
                  '--color-surface': forced.vars['--color-surface'],
                  '--color-surface-hover': forced.vars['--color-surface-hover'],
                  '--color-border': forced.vars['--color-border'],
                };
          return (
            <PaletteColumn
              key={p.name}
              name={p.name}
              description={p.description}
              vars={vars}
            />
          );
        })}
      </div>

      <p className="mt-4 text-xs text-text-tertiary">
        {mode === 'native'
          ? 'Each palette on its own background. Real-world preview.'
          : `All three palettes forced onto the ${mode === 'dark' ? 'Sakura dark' : 'Oxblood light'} background. Accent / text / border colours retained — only the canvas changes.`}
      </p>
    </>
  );
}
