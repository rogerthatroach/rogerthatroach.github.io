import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { POSTS, isPostPublic } from '@/data/posts';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BlogPostShell from '@/components/blog/BlogPostShell';

const SITE_URL = 'https://rogerthatroach.github.io';

export function generateStaticParams() {
  return POSTS.filter((p) => isPostPublic(p)).map((p) => ({
    slug: p.meta.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.abstract,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.abstract,
      url: `/blog/${params.slug}`,
      siteName: 'Harmilap Singh Dhaliwal',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.meta.date,
      authors: ['Harmilap Singh Dhaliwal'],
      tags: post.meta.tags,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.abstract,
      images: ['/og-image.png'],
    },
  };
}

// BlogPosting JSON-LD — pre-rendered server-side so Google's rich-result
// crawler sees Article schema (not just the global Person). Author refs
// the single Person entity by @id (defined in app/layout.tsx).
function blogPostingJsonLd(slug: string) {
  const post = POSTS.find((p) => p.meta.slug === slug);
  if (!post) return null;
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta.title,
    description: post.meta.abstract,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Harmilap Singh Dhaliwal' },
    keywords: post.meta.tags.join(', '),
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: 'en',
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.meta.slug === params.slug);
  if (!post) notFound();

  const jsonLd = blogPostingJsonLd(params.slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Nav />
      <main id="main-content" className="min-h-screen">
        <BlogPostShell slug={params.slug} meta={post.meta} />
      </main>
      <Footer />
    </>
  );
}
