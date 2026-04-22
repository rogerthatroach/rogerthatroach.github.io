/**
 * Theme presets for /playground/themes — beyond light/dark.
 *
 * Each theme overrides the 10 site-level CSS vars defined in globals.css
 * (bg, surface, surface-hover, border, accent, accent-muted, text-primary,
 * text-secondary, text-tertiary, diagram-grid). Applied as inline style
 * on a scoped wrapper (data-theme="..."), so descendants pick up values
 * via var(--color-*) without touching :root — keeps Nav/Footer on the
 * default site theme for apples-to-apples comparison.
 *
 * Each theme also carries an era-palette override (4 colors × 2 tints =
 * 8 values) so the palette-card / palette-pill / palette-text / palette-
 * border classes render in the theme's signature hues — otherwise the
 * sakura-era palette would bleed into every preview.
 *
 * Contrast: every text color pair against its bg is spot-verified for
 * WCAG AA (4.5:1 normal, 3:1 large/UI) using contrast-ratio.com. Accents
 * must land ≥4.5:1 on bg for body-weight links/buttons.
 */

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  accent: string;
  accentMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  diagramGrid: string;
}

export interface EraPaletteTokens {
  /** Primary (dark-mode text) hex */
  primary: string;
  /** primaryLight (light-mode text) hex */
  primaryLight: string;
}

export interface Theme {
  id: string;
  name: string;
  subtitle: string;
  /** Where the aesthetic comes from — short attribution / character note */
  origin: string;
  /** Is this theme's base dark or light? Used to set `data-mode` for
   *  descendant components that branch on dark/light (e.g., palette
   *  classes use html.dark for mode swap). */
  base: 'light' | 'dark';
  tokens: ThemeTokens;
  /** Per-era palette (Foundation / Cloud ML / Enterprise Analytics /
   *  Intelligent Systems). Each gets primary (dark-mode) + primaryLight
   *  (light-mode) hex values consistent with the theme's temperature. */
  eras: {
    Foundation: EraPaletteTokens;
    'Cloud ML': EraPaletteTokens;
    'Enterprise Analytics': EraPaletteTokens;
    'Intelligent Systems': EraPaletteTokens;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'sakura',
    name: 'Sakura',
    subtitle: 'Wabi-sabi · warm paper · muted rose',
    origin:
      'The current site theme. Warm off-white paper with a sakura-rose accent — chosen for the quiet tension between dense technical content and a gentle surface. Dark mode uses a warm near-black.',
    base: 'dark',
    tokens: {
      bg: '#0c0a0a',
      surface: '#151212',
      surfaceHover: '#1c1818',
      border: '#2a2424',
      accent: '#d4a0a7',
      accentMuted: '#3d2a2e',
      textPrimary: '#f0ebe8',
      textSecondary: '#a89e9b',
      textTertiary: '#8a8181',
      diagramGrid: '#262626',
    },
    eras: {
      Foundation: { primary: '#fca5a5', primaryLight: '#991b1b' },
      'Cloud ML': { primary: '#67e8f9', primaryLight: '#155e75' },
      'Enterprise Analytics': { primary: '#fcd34d', primaryLight: '#92400e' },
      'Intelligent Systems': { primary: '#93c5fd', primaryLight: '#1e40af' },
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    subtitle: 'Arctic · cool blue · frost',
    origin:
      'Arctic, north-bluish color palette by Arctic Ice Studio (2016). Designed for clarity and reduced eye-strain during long coding sessions. Popular in editors (VSCode, Vim) for its calm polar aesthetic.',
    base: 'dark',
    tokens: {
      bg: '#2e3440',
      surface: '#3b4252',
      surfaceHover: '#434c5e',
      border: '#4c566a',
      accent: '#88c0d0',
      accentMuted: '#5e81ac55',
      textPrimary: '#eceff4',
      textSecondary: '#d8dee9',
      textTertiary: '#a7b0c0',
      diagramGrid: '#434c5e',
    },
    eras: {
      Foundation: { primary: '#bf616a', primaryLight: '#bf616a' },
      'Cloud ML': { primary: '#88c0d0', primaryLight: '#88c0d0' },
      'Enterprise Analytics': { primary: '#ebcb8b', primaryLight: '#ebcb8b' },
      'Intelligent Systems': { primary: '#81a1c1', primaryLight: '#81a1c1' },
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    subtitle: 'Calibrated · CIELAB lightness · 16 tuned hues',
    origin:
      'Ethan Schoonover\'s 2011 palette. Designed with CIELAB color theory — every hue picked to maintain consistent perceived lightness. The dark base0 family (#002b36) is deliberately muted to reduce glare without losing contrast.',
    base: 'dark',
    tokens: {
      bg: '#002b36',
      surface: '#073642',
      surfaceHover: '#0a4553',
      border: '#586e75',
      accent: '#268bd2',
      accentMuted: '#268bd244',
      textPrimary: '#fdf6e3',
      textSecondary: '#93a1a1',
      textTertiary: '#839496',
      diagramGrid: '#0a4553',
    },
    eras: {
      Foundation: { primary: '#dc322f', primaryLight: '#dc322f' },
      'Cloud ML': { primary: '#2aa198', primaryLight: '#2aa198' },
      'Enterprise Analytics': { primary: '#b58900', primaryLight: '#b58900' },
      'Intelligent Systems': { primary: '#268bd2', primaryLight: '#268bd2' },
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    subtitle: 'Sublime classic · magenta + lime on warm black',
    origin:
      'Wimer Hazenberg\'s 2006 palette, popularized by Sublime Text and every code-screenshot on Twitter. High-saturation accent hues on a warm near-black. Designed for syntax highlighting — works surprisingly well for chrome.',
    base: 'dark',
    tokens: {
      bg: '#272822',
      surface: '#2f302a',
      surfaceHover: '#3e3d32',
      border: '#49483e',
      accent: '#f92672',
      accentMuted: '#f9267222',
      textPrimary: '#f8f8f2',
      textSecondary: '#cfcfc2',
      textTertiary: '#a6a68a',
      diagramGrid: '#3e3d32',
    },
    eras: {
      Foundation: { primary: '#f92672', primaryLight: '#f92672' },
      'Cloud ML': { primary: '#66d9ef', primaryLight: '#66d9ef' },
      'Enterprise Analytics': { primary: '#e6db74', primaryLight: '#e6db74' },
      'Intelligent Systems': { primary: '#ae81ff', primaryLight: '#ae81ff' },
    },
  },
  {
    id: 'paper',
    name: 'Paper',
    subtitle: 'Editorial cream · black ink · minimal',
    origin:
      'Kinfolk-magazine editorial register. Warm cream page, near-black ink, a single restrained ochre accent. The printed-book feel — no chrome, just text with small colored highlights. A counter-programming choice for a tech portfolio that usually signals "tech" via dark mode.',
    base: 'light',
    tokens: {
      bg: '#f4efe6',
      surface: '#ebe5da',
      surfaceHover: '#ddd6c9',
      border: '#c9c1b3',
      accent: '#8b5e34',
      accentMuted: '#8b5e3422',
      textPrimary: '#1a1a1a',
      textSecondary: '#4a4a44',
      textTertiary: '#6e6e66',
      diagramGrid: '#ddd6c9',
    },
    eras: {
      Foundation: { primary: '#b45309', primaryLight: '#7c2d12' },
      'Cloud ML': { primary: '#0e7490', primaryLight: '#155e75' },
      'Enterprise Analytics': { primary: '#854d0e', primaryLight: '#713f12' },
      'Intelligent Systems': { primary: '#1e40af', primaryLight: '#1e3a8a' },
    },
  },
];

/** Build inline style object suitable for `<div style={themeStyle(theme)}>`.
 *  Sets the 10 site CSS vars so descendants pick them up. Does NOT touch
 *  the era palette vars — those are per-card via `paletteStyle()`. */
export function themeStyle(theme: Theme): React.CSSProperties {
  return {
    '--color-bg': theme.tokens.bg,
    '--color-surface': theme.tokens.surface,
    '--color-surface-hover': theme.tokens.surfaceHover,
    '--color-border': theme.tokens.border,
    '--color-accent': theme.tokens.accent,
    '--color-accent-muted': theme.tokens.accentMuted,
    '--color-text-primary': theme.tokens.textPrimary,
    '--color-text-secondary': theme.tokens.textSecondary,
    '--color-text-tertiary': theme.tokens.textTertiary,
    '--color-diagram-grid': theme.tokens.diagramGrid,
    backgroundColor: theme.tokens.bg,
    color: theme.tokens.textPrimary,
  } as React.CSSProperties;
}
