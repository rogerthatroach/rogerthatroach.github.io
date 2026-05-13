import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google';
import CommandPalette from '@/components/CommandPalette';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// Fraunces — warm serif display cut. Used for page H1s, section H2s,
// blog/case-study titles. Body prose stays in Inter; tech chips + mono
// eyebrows stay in JetBrains Mono. Pairs naturally with the sakura /
// wabi-sabi palette.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const SITE_URL = 'https://rogerthatroach.github.io';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f5f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
    template: '%s | Harmilap Singh Dhaliwal',
  },
  description:
    'From building industrial Digital Twins that saved $3M to architecting enterprise agentic AI platforms — with the technical depth to design systems and the leadership range to ship them.',
  openGraph: {
    title: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
    description:
      'From Digital Twins to deterministic agents — shipping AI at bank scale.',
    url: SITE_URL,
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
    description:
      'From Digital Twins to deterministic agents — shipping AI at bank scale.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// Inline script to prevent flash of wrong theme. Runs before React
// hydrates so the document starts in the right theme.
//
// Reads localStorage['theme-pack']; falls back to legacy 'theme' key so
// users who set dark mode pre-ThemePicker land on sakura-dark. Applies
// both:
//   - .dark class on <html>       → activates Tailwind dark: variants
//   - data-theme attribute        → activates the CSS theme-pack block
//
// OS prefers-color-scheme is intentionally ignored — theme is an explicit
// choice, not an environment default.
const themeScript = `
  (function() {
    try {
      var valid = ['sakura-light','sakura-dark','nord','solarized-dark','monokai','paper','themis','themis-dark'];
      // URL param override — e.g. ?theme=monokai — ephemeral (not
      // persisted), useful for preview links and Lighthouse sweeps.
      var params = new URLSearchParams(window.location.search);
      var urlTheme = params.get('theme');
      var pack = urlTheme && valid.indexOf(urlTheme) !== -1
        ? urlTheme
        : localStorage.getItem('theme-pack');
      if (!pack) {
        var legacy = localStorage.getItem('theme');
        pack = legacy === 'dark' ? 'sakura-dark' : 'sakura-light';
      }
      var darkBase = ['sakura-dark','nord','solarized-dark','monokai','themis-dark'].indexOf(pack) !== -1;
      if (darkBase) document.documentElement.classList.add('dark');
      // 'themis' and 'themis-dark' both resolve to the same data-theme
      // attribute — only the .dark class differs.
      var themeAttr = pack === 'themis-dark' ? 'themis' : pack;
      if (pack !== 'sakura-light' && pack !== 'sakura-dark') {
        document.documentElement.setAttribute('data-theme', themeAttr);
      }
    } catch (e) { /* localStorage blocked — fall through to default */ }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Harmilap Singh Dhaliwal',
              jobTitle: 'AI & Data Science Lead',
              url: SITE_URL,
              sameAs: [
                'https://www.linkedin.com/in/harmilapsingh',
                'https://github.com/rogerthatroach',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'Agentic AI',
                'Data Science',
                'Enterprise AI Architecture',
              ],
            }),
          }}
        />
      </head>
      <body className="font-body">
        {/* hi. curious how this was built? /colophon */}
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* Portfolio is publicly viewable. /blue-rose still has its
            own WhiteLodgeGate (AES-GCM passphrase gate) inside the
            /blue-rose route, independent of the main portfolio. */}
        {children}
        {/* ⌘K search — listens globally for Cmd/Ctrl+K and for the
            `cmdk:open` custom event fired from mobile nav dropdown. */}
        <CommandPalette />
      </body>
    </html>
  );
}
