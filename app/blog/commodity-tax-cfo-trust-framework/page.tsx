import type { Metadata } from 'next';
import { COMMODITY_TAX_CONSOLIDATION, POSTS } from '@/data/posts';

const { destinationSlug, heading, description } = COMMODITY_TAX_CONSOLIDATION;
const destinationPath = `/blog/${destinationSlug}`;
const destination = POSTS.find((post) => post.meta.slug === destinationSlug);

if (!destination || destination.meta.status !== 'published') {
  throw new Error('The consolidated article must have a published destination.');
}
const destinationTitle = destination.meta.title;

export const metadata: Metadata = {
  title: heading,
  description,
  alternates: { canonical: destinationPath },
  robots: { index: false, follow: true },
  openGraph: {
    title: destinationTitle,
    description,
    url: destinationPath,
    type: 'website',
  },
};

export default function ConsolidatedArticlePage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destinationPath}`} />
      <main id="main-content" className="mx-auto min-h-screen max-w-3xl px-6 py-24">
        <h1 className="font-display text-3xl font-semibold text-text-primary">{heading}</h1>
        <p className="mt-4 text-text-secondary">{description}</p>
        <a href={destinationPath} className="mt-6 inline-block text-accent underline underline-offset-4">
          {destinationTitle}
        </a>
      </main>
    </>
  );
}
