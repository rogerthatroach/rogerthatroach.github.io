import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/posts/**/*.tsx',
    './data/posts/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        'border-subtle': 'var(--color-border)',
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'diagram-grid': 'var(--color-diagram-grid)',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      fontSize: {
        metric: ['2.5rem', { lineHeight: '1' }],
      },
      maxWidth: {
        content: '64rem',
      },
    },
  },
  plugins: [],
};

export default config;
