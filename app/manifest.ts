import type { MetadataRoute } from 'next';

// Web app manifest — declares name/theme/icons so iOS home-screen saves and
// Android install prompts get a proper icon instead of a screenshot.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
    short_name: 'HSD',
    description:
      "AI & Data Science Lead. Bank-wide production agentic AI, LLM analytics platforms, and the career arc behind them.",
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a0a',
    theme_color: '#0c0a0a',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
