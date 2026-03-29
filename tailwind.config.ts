import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        'surface-hover': '#1a1a1a',
        'border-subtle': '#262626',
        accent: '#3b82f6',
        'accent-muted': '#1e3a5f',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
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
