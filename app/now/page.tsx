import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { NOW } from '@/data/now';

const { updated: UPDATED, bullets: BULLETS } = NOW;

const META_TITLE = 'Now';
const META_DESCRIPTION = NOW.metaDescription;
const META_PATH = '/now';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: META_PATH },
  openGraph: {
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    url: META_PATH,
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function NowPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Home
        </Link>

        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Now · updated {UPDATED}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {NOW.heading}
          </h1>

          <ol className="mt-10 space-y-6">
            {BULLETS.map((b, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-5">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  {b.heading}
                </p>
                <p className="mt-2 text-base leading-relaxed text-text-primary">
                  {b.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
