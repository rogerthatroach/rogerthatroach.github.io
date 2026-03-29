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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
