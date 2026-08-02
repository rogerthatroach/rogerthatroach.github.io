export interface ThemeDefinition {
  id: string;
  name: string;
  commandLabel: string;
  description: string;
  base: 'light' | 'dark';
  dataTheme: string | null;
  swatches: {
    bg: string;
    accent: string;
    text: string;
  };
}

/**
 * Canonical registry for every selectable site theme.
 *
 * Sakura uses the default CSS tokens, so its two variants have no
 * `data-theme` value. Amethyst's light and dark variants share the `themis`
 * token set and are distinguished by the root `.dark` class.
 */
export const THEMES = [
  {
    id: 'sakura-light',
    name: 'Sakura Light',
    commandLabel: 'Theme · Sakura Light',
    description: 'Warm paper · rose accent',
    base: 'light',
    dataTheme: null,
    swatches: { bg: '#f8f5f2', accent: '#8a5560', text: '#1a1412' },
  },
  {
    id: 'sakura-dark',
    name: 'Sakura Dark',
    commandLabel: 'Theme · Sakura Dark',
    description: 'Warm near-black · muted rose',
    base: 'dark',
    dataTheme: null,
    swatches: { bg: '#0c0a0a', accent: '#d4a0a7', text: '#f0ebe8' },
  },
  {
    id: 'nord',
    name: 'Aurora',
    commandLabel: 'Theme · Aurora (Nord)',
    description: 'Arctic blue · aurora borealis (née Nord)',
    base: 'dark',
    dataTheme: 'nord',
    swatches: { bg: '#2e3440', accent: '#88c0d0', text: '#eceff4' },
  },
  {
    id: 'solarized-dark',
    name: 'Obsidian',
    commandLabel: 'Theme · Obsidian (Solarized)',
    description: 'CIELAB-precise · volcanic glass (née Solarized Dark)',
    base: 'dark',
    dataTheme: 'solarized-dark',
    swatches: { bg: '#002b36', accent: '#4fb3f5', text: '#fdf6e3' },
  },
  {
    id: 'monokai',
    name: 'Ember',
    commandLabel: 'Theme · Ember (Monokai)',
    description: 'Warm black · pink spark (née Monokai)',
    base: 'dark',
    dataTheme: 'monokai',
    swatches: { bg: '#272822', accent: '#ff6b9d', text: '#f8f8f2' },
  },
  {
    id: 'paper',
    name: 'Papyrus',
    commandLabel: 'Theme · Papyrus (Paper)',
    description: 'Editorial cream · iron-gall ink (née Paper)',
    base: 'light',
    dataTheme: 'paper',
    swatches: { bg: '#f4efe6', accent: '#7a4e28', text: '#1a1a1a' },
  },
  {
    id: 'themis',
    name: 'Amethyst',
    commandLabel: 'Theme · Amethyst (Themis)',
    description: 'Soft glass · Themis (light)',
    base: 'light',
    dataTheme: 'themis',
    swatches: { bg: '#f6f4f8', accent: '#6d5896', text: '#1c1822' },
  },
  {
    id: 'themis-dark',
    name: 'Amethyst Dark',
    commandLabel: 'Theme · Amethyst Dark',
    description: 'Deep amethyst · Themis (dark)',
    base: 'dark',
    dataTheme: 'themis',
    swatches: { bg: '#0d0b14', accent: '#b9a8d6', text: '#ece7f3' },
  },
] as const satisfies readonly ThemeDefinition[];

export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME_ID: ThemeId = 'sakura-light';

export const THEME_IDS: readonly ThemeId[] = THEMES.map((theme) => theme.id);

export const DARK_THEME_IDS: readonly ThemeId[] = THEMES.filter(
  (theme) => theme.base === 'dark',
).map((theme) => theme.id);

export const THEME_DATA_ATTRIBUTES: Readonly<Record<ThemeId, string | null>> =
  Object.fromEntries(
    THEMES.map((theme) => [theme.id, theme.dataTheme]),
  ) as Record<ThemeId, string | null>;

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && (THEME_IDS as readonly string[]).includes(value);
}

export function getTheme(id: ThemeId): (typeof THEMES)[number] {
  const theme = THEMES.find((candidate) => candidate.id === id);
  if (!theme) throw new Error(`Unknown theme: ${id}`);
  return theme;
}
