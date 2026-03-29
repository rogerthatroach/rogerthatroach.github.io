import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
  description:
    'From building industrial Digital Twins that saved $3M to architecting enterprise agentic AI platforms — with the technical depth to design systems and the leadership range to ship them.',
  openGraph: {
    title: 'Harmilap Singh Dhaliwal — AI & Data Science Lead',
    description:
      'From Digital Twins to deterministic agents — shipping AI at bank scale.',
    type: 'website',
  },
};

// Inline script to prevent flash of wrong theme
const themeScript = `
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
