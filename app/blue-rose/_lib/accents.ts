/**
 * Themis persona accent palette.
 *
 * 6 hand-picked colors that all clear WCAG AA against both the warm-paper
 * light surface (#ffffff) and the deep-amethyst dark surface (#151212).
 * Used to tint avatar rings, message bubbles, name pills, presence dots.
 *
 * Picked deterministically per persona via `accentForSeed(seed)`.
 */

import { hashSeed } from './prng';

export const PERSONA_ACCENTS = [
  { name: 'amethyst', light: '#7e6aa8', dark: '#b9a8d6' },
  { name: 'sage',     light: '#5d8870', dark: '#9bc4ad' },
  { name: 'amber',    light: '#a8784a', dark: '#d4a574' },
  { name: 'rose',     light: '#a85d6a', dark: '#d49aa3' },
  { name: 'slate',    light: '#5f7184', dark: '#9aabbf' },
  { name: 'teal',     light: '#3d7d83', dark: '#7fc6cc' },
] as const;

export type PersonaAccent = (typeof PERSONA_ACCENTS)[number];

export function accentForSeed(seed: string): PersonaAccent {
  return PERSONA_ACCENTS[hashSeed(seed) % PERSONA_ACCENTS.length];
}
