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

// Inline script to prevent flash of wrong theme. Light is the default —
// dark mode only activates if the user has explicitly toggled to it.
// OS prefers-color-scheme is intentionally ignored.
const themeScript = `
  (function() {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
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
        {children}
        {/* ⌘K search — listens globally for Cmd/Ctrl+K and for the
            `cmdk:open` custom event fired from mobile nav dropdown. */}
        <CommandPalette />
      </body>
    </html>
  );
}
