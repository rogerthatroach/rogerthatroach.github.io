import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import CommandPalette from '@/components/CommandPalette';
import MotionProvider from '@/components/MotionProvider';
import InternalNavigationProvider from '@/components/navigation/InternalNavigationProvider';
import {
  DARK_THEME_IDS,
  DEFAULT_THEME_ID,
  THEME_DATA_ATTRIBUTES,
  THEME_IDS,
} from '@/data/themes';
import {
  CURRENT_ROLE,
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE_PATH,
} from '@/data/site';
import './globals.css';

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
});

// Fraunces — warm serif display cut. Used for page H1s, section H2s,
// blog/case-study titles. Body prose stays in Inter; tech chips + mono
// eyebrows stay in JetBrains Mono. Pairs naturally with the sakura /
// wabi-sabi palette.
const fraunces = localFont({
  src: './fonts/fraunces-latin.woff2',
  variable: '--font-fraunces',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
});

function serializeForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

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
    default: SITE_TITLE,
    template: `%s | ${PERSON_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: PERSON_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: `${PERSON_NAME} — ${CURRENT_ROLE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
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
const serializedThemeIds = serializeForInlineScript(THEME_IDS);
const serializedDarkThemeIds = serializeForInlineScript(DARK_THEME_IDS);
const serializedThemeDataAttributes = serializeForInlineScript(
  THEME_DATA_ATTRIBUTES,
);
const serializedDefaultThemeId = serializeForInlineScript(DEFAULT_THEME_ID);

const themeScript = `
  (function() {
    try {
      var valid = ${serializedThemeIds};
      var darkThemes = ${serializedDarkThemeIds};
      var dataThemes = ${serializedThemeDataAttributes};
      // URL param override — e.g. ?theme=monokai — ephemeral and not persisted.
      var params = new URLSearchParams(window.location.search);
      var urlTheme = params.get('theme');
      var pack = urlTheme && valid.indexOf(urlTheme) !== -1
        ? urlTheme
        : null;
      if (!pack) {
        var stored = localStorage.getItem('theme-pack');
        pack = stored && valid.indexOf(stored) !== -1 ? stored : null;
      }
      if (!pack) {
        var legacy = localStorage.getItem('theme');
        pack = legacy === 'dark' ? 'sakura-dark' : ${serializedDefaultThemeId};
      }
      var darkBase = darkThemes.indexOf(pack) !== -1;
      if (darkBase) document.documentElement.classList.add('dark');
      var themeAttr = dataThemes[pack];
      if (themeAttr !== null) {
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
  // suppressHydrationWarning on <html>: the inline themeScript sets the .dark
  // class + data-theme on <html> before hydration, so the server/client <html>
  // attributes intentionally differ. Scoped to that one element.
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
    >
      <head>
        {/* Best-effort hardening via <meta> (GitHub Pages can't set response
            headers). Only directives that don't break a static Next export
            with inline hydration scripts: no script-src/default-src (would
            block Next's inline scripts + the theme bootstrap). Clickjacking
            (frame-ancestors / X-Frame-Options) can't be set via meta — that's
            a residual GitHub Pages limitation. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="object-src 'none'; base-uri 'self'; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Agent-readable capabilities manifest (also linked from llms.txt). */}
        <link rel="alternate" type="application/json" href="/capabilities.json" title="Capabilities (machine-readable)" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': `${SITE_URL}/#person`,
              name: PERSON_NAME,
              jobTitle: CURRENT_ROLE,
              url: SITE_URL,
              sameAs: [
                'https://www.linkedin.com/in/harmilapsingh',
                'https://github.com/rogerthatroach',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'Information Retrieval',
                'Natural Language Processing',
                'Production ML Systems',
              ],
            }),
          }}
        />
      </head>
      <body className="font-body">
        {/* Per-theme grain — a fixed noise layer behind all content (z-index:-1
            under the body stacking context, so zero text-contrast impact).
            Intensity is theme-driven via --grain-opacity; 0 on dark themes. */}
        <div className="grain-overlay" aria-hidden="true" />
        {/* hi. curious how this was built? /colophon */}
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-100 -translate-y-20 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* Portfolio is publicly viewable. /blue-rose still has its
            own WhiteLodgeGate (AES-GCM passphrase gate) inside the
            /blue-rose route, independent of the main portfolio. */}
        {/* MotionProvider → all Framer Motion honors prefers-reduced-motion. */}
        <InternalNavigationProvider>
          <MotionProvider>
            {children}
            {/* ⌘K search — listens globally for Cmd/Ctrl+K and for the
                `cmdk:open` custom event fired from mobile nav dropdown. */}
            <CommandPalette />
          </MotionProvider>
        </InternalNavigationProvider>
      </body>
    </html>
  );
}
